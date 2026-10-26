from __future__ import annotations

import csv
import io
import json
import sys
from datetime import date, timedelta
from pathlib import Path

DIAS = 90

DEPARTAMENTOS = [
    "beni", "chuquisaca", "cochabamba", "la_paz", "oruro",
    "pando", "potosi", "santa_cruz", "tarija", "sin_ubicacion",
]

COLUMNAS_PUNTOS = ["fecha", "latitud", "longitud", "departamento", "seccion"]


def main() -> int:
    if len(sys.argv) != 3:
        print("uso: preparar_publico.py <bloqueos_historico.csv> <carpeta destino>")
        return 2

    origen, destino = Path(sys.argv[1]), Path(sys.argv[2])
    origen_departamentos = origen.with_name("bloqueos_departamento.csv")
    origen_puntos = origen.with_name("puntos_bloqueados.csv")
    origen_geo = origen.parent.parent / "geo" / "departamentos.geojson"

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

    nacional = {f["fecha"][:10]: int(float(f["bloqueos"])) for f in ventana}

    with origen_departamentos.open(encoding="utf-8", newline="") as fh:
        lector = csv.DictReader(fh)
        if lector.fieldnames != ["fecha", *DEPARTAMENTOS]:
            print(f"ERROR: columnas inesperadas en {origen_departamentos.name}", file=sys.stderr)
            return 1
        por_departamento = {
            f["fecha"][:10]: [int(float(f[d])) for d in DEPARTAMENTOS]
            for f in lector
            if f.get("fecha") and f["fecha"][:10] in nacional
        }

    if set(por_departamento) != set(nacional):
        print("ERROR: la serie por departamento no cubre los mismos dias", file=sys.stderr)
        return 1
    descuadre = [d for d, v in por_departamento.items() if sum(v) != nacional[d]]
    if descuadre:
        print(f"ERROR: departamentos no suman el total en {descuadre[:5]}", file=sys.stderr)
        return 1

    contenido = "fecha," + ",".join(DEPARTAMENTOS) + "\n" + "".join(
        f"{d},{','.join(str(v) for v in por_departamento[d])}\n" for d in sorted(por_departamento)
    )
    escribir(destino / "departamentos_90_dias.csv", contenido.encode("utf-8"))

    with origen_puntos.open(encoding="utf-8", newline="") as fh:
        puntos = [
            f for f in csv.DictReader(fh)
            if f.get("fecha") and f["fecha"][:10] in nacional and f["departamento"] != "sin_ubicacion"
        ]
    puntos.sort(key=lambda f: (f["fecha"][:10], float(f["latitud"]), float(f["longitud"])))

    buffer = io.StringIO()
    escritor = csv.writer(buffer, lineterminator="\n")
    escritor.writerow(COLUMNAS_PUNTOS)
    for f in puntos:
        escritor.writerow([
            f["fecha"][:10], f["latitud"], f["longitud"], f["departamento"],
            " ".join((f.get("sección") or "").split()),
        ])
    escribir(destino / "puntos_90_dias.csv", buffer.getvalue().encode("utf-8"))

    geo = json.loads(origen_geo.read_text(encoding="utf-8"))
    limpio = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {
                    "id": f["properties"]["id"],
                    "nombre": f["properties"]["nombre"],
                },
                "geometry": {
                    "type": f["geometry"]["type"],
                    "coordinates": f["geometry"]["coordinates"],
                },
            }
            for f in geo["features"]
        ],
    }
    escribir(
        destino / "departamentos.geojson",
        json.dumps(limpio, ensure_ascii=False, separators=(",", ":")).encode("utf-8"),
    )

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

    print(f"[OK] {len(ventana)} dias publicados ({resumen['desde']} -> {resumen['hasta']}), "
          f"{len(puntos)} puntos-dia en el mapa")
    return 0


def escribir(ruta: Path, datos: bytes) -> None:
    if ruta.exists() and ruta.read_bytes() == datos:
        return
    ruta.write_bytes(datos)


if __name__ == "__main__":
    sys.exit(main())
