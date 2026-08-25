"""Prepara los datos que consume la pagina publica.

Toma la serie diaria ya calculada por el motor y recorta los ultimos 90 dias.
No recalcula nada: publica exactamente los valores que produjo el motor.

    python herramientas/preparar_publico.py <bloqueos_historico.csv> <carpeta destino>
"""

from __future__ import annotations

import csv
import json
import sys
from datetime import date, timedelta
from pathlib import Path

DIAS = 90


def main() -> int:
    if len(sys.argv) != 3:
        print(__doc__)
        return 2

    origen, destino = Path(sys.argv[1]), Path(sys.argv[2])
    with origen.open(encoding="utf-8", newline="") as fh:
        filas = [f for f in csv.DictReader(fh) if f.get("fecha")]

    if not filas:
        print("ERROR: el historico esta vacio", file=sys.stderr)
        return 1

    filas.sort(key=lambda f: f["fecha"])
    ultimo = date.fromisoformat(filas[-1]["fecha"][:10])
    desde = ultimo - timedelta(days=DIAS - 1)
    ventana = [f for f in filas if date.fromisoformat(f["fecha"][:10]) >= desde]

    destino.mkdir(parents=True, exist_ok=True)

    salida = destino / "ultimos_90_dias.csv"
    contenido = "fecha,bloqueos\n" + "".join(
        f"{f['fecha'][:10]},{int(float(f['bloqueos']))}\n" for f in ventana
    )
    escribir(salida, contenido.encode("utf-8"))

    total = sum(int(float(f["bloqueos"])) for f in ventana)
    con_bloqueo = sum(1 for f in ventana if int(float(f["bloqueos"])) > 0)
    resumen = {
        "dias": len(ventana),
        "desde": ventana[0]["fecha"][:10],
        "hasta": ventana[-1]["fecha"][:10],
        "ultimo_valor": int(float(ventana[-1]["bloqueos"])),
        "maximo": max(int(float(f["bloqueos"])) for f in ventana),
        "dias_con_bloqueo": con_bloqueo,
        "suma_dias_bloqueo": total,
    }
    escribir(
        destino / "resumen.json",
        (json.dumps(resumen, indent=1, ensure_ascii=False) + "\n").encode("utf-8"),
    )

    print(f"[OK] {len(ventana)} dias publicados ({resumen['desde']} -> {resumen['hasta']})")
    return 0


def escribir(ruta: Path, datos: bytes) -> None:
    """Solo escribe si cambio, para no generar commits vacios."""
    if ruta.exists() and ruta.read_bytes() == datos:
        return
    ruta.write_bytes(datos)


if __name__ == "__main__":
    sys.exit(main())
