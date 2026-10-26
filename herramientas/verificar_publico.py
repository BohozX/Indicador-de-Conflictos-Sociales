from __future__ import annotations

import csv
import json
import re
import subprocess
import sys
from pathlib import Path

from preparar_publico import COLUMNAS_PUNTOS, DEPARTAMENTOS, DIAS

RAIZ = Path(__file__).resolve().parents[1]

PRIVADO = "private"

DATOS_PERMITIDOS = {
    "ultimos_90_dias.csv", "resumen.json", "departamentos_90_dias.csv",
    "puntos_90_dias.csv", "departamentos.geojson",
}

COLUMNAS = ["fecha", "bloqueos"]

PROHIBIDO = (
    "captcha", "genai", "BeautifulSoup", "requests.Session",
    "api/v1/data", "solve_", "fetch_once", "fetch_events",
)

CLAVES = (
    r"AIza[0-9A-Za-z_-]{30,}",
    r"BEGIN [A-Z ]*PRIVATE KEY",
    r"ssh-(rsa|ed25519) AAAA[0-9A-Za-z+/]{20,}",
    r"gh[pousr]_[0-9A-Za-z]{30,}",
    r"sk-[A-Za-z0-9]{30,}",
)

EXTENSIONES_PROHIBIDAS = {".jsonl", ".gz", ".zip", ".tar", ".pem", ".key", ".env"}


def fallar(mensaje: str) -> None:
    print(f"[ERROR] {mensaje}", file=sys.stderr)
    sys.exit(1)


def git(*argumentos: str) -> subprocess.CompletedProcess:
    return subprocess.run(
        ["git", *argumentos], cwd=RAIZ, capture_output=True, text=True,
    )


def revisar_motor_privado() -> None:
    if not (RAIZ / PRIVADO).is_dir():
        return

    rastreados = git("ls-files", "--", PRIVADO).stdout.split()
    if rastreados:
        fallar(f"el motor privado esta rastreado por git: {rastreados[:5]}")

    if git("check-ignore", "-q", "--", f"{PRIVADO}/").returncode != 0:
        fallar(f"{PRIVADO}/ no esta en .gitignore")

    sucio = [l for l in git("status", "--porcelain").stdout.splitlines()
             if l[3:].lstrip('"').startswith(f"{PRIVADO}/")]
    if sucio:
        fallar(f"el motor privado aparece en git status: {sucio[:5]}")

    print(f"[OK] {PRIVADO}/ ignorado por git, sin archivos rastreados")


def revisar_indicador_referencial() -> None:
    objetivo = RAIZ / "codigo" / "indicador.py"
    if not objetivo.is_file():
        fallar("falta codigo/indicador.py")

    importa = re.compile(
        r"^\s*(from\s+(codigo\.)?indicador\s+import|import\s+(codigo\.)?indicador)", re.M)
    ejecuta = re.compile(r"python[0-9.]*\s+(-\S+\s+)*[\"']?codigo/indicador\.py")

    for ruta in RAIZ.rglob("*"):
        if not ruta.is_file() or ".git" in ruta.parts or PRIVADO in ruta.parts:
            continue
        if ruta.suffix.lower() not in {".py", ".yml", ".yaml", ".sh"}:
            continue
        if ruta in (objetivo, Path(__file__).resolve()):
            continue
        texto = ruta.read_text(encoding="utf-8", errors="replace")
        if importa.search(texto):
            fallar(f"{ruta.relative_to(RAIZ)} importa el indicador de referencia")
        if ejecuta.search(texto):
            fallar(f"{ruta.relative_to(RAIZ)} ejecuta el indicador de referencia")

    print("[OK] codigo/indicador.py es solo referencia: nadie lo importa ni lo ejecuta")


def main() -> int:
    revisar_motor_privado()
    revisar_indicador_referencial()

    datos = RAIZ / "pagina" / "data"

    presentes = {p.name for p in datos.glob("*") if p.is_file()}
    if presentes != DATOS_PERMITIDOS:
        fallar(f"pagina/data debe contener exactamente {sorted(DATOS_PERMITIDOS)}, "
               f"y contiene {sorted(presentes)}")

    csv_publico = datos / "ultimos_90_dias.csv"
    with csv_publico.open(encoding="utf-8", newline="") as fh:
        lector = csv.reader(fh)
        cabecera = next(lector, [])
        filas = list(lector)
    if cabecera != COLUMNAS:
        fallar(f"el CSV publico debe tener columnas {COLUMNAS}, tiene {cabecera}")
    if not 1 <= len(filas) <= DIAS + 5:
        fallar(f"el CSV publico tiene {len(filas)} filas, fuera del rango esperado")
    for fila in filas:
        if len(fila) != 2 or not re.fullmatch(r"\d{4}-\d{2}-\d{2}", fila[0]):
            fallar(f"fila con formato inesperado: {fila}")
        if not re.fullmatch(r"\d+", fila[1]):
            fallar(f"valor de bloqueos no entero: {fila}")
    nacional = {f[0]: int(f[1]) for f in filas}

    with (datos / "departamentos_90_dias.csv").open(encoding="utf-8", newline="") as fh:
        lector = csv.reader(fh)
        cabecera = next(lector, [])
        filas_dep = list(lector)
    if cabecera != ["fecha", *DEPARTAMENTOS]:
        fallar(f"departamentos_90_dias.csv tiene columnas {cabecera}")
    if [f[0] for f in filas_dep] != [f[0] for f in filas]:
        fallar("departamentos_90_dias.csv no cubre los mismos dias que la serie nacional")
    for fila in filas_dep:
        if len(fila) != len(cabecera) or not all(re.fullmatch(r"\d+", v) for v in fila[1:]):
            fallar(f"fila de departamentos con formato inesperado: {fila}")
        if sum(int(v) for v in fila[1:]) != nacional[fila[0]]:
            fallar(f"los departamentos no suman el total nacional el {fila[0]}")

    with (datos / "puntos_90_dias.csv").open(encoding="utf-8", newline="") as fh:
        lector = csv.reader(fh)
        cabecera = next(lector, [])
        filas_pts = list(lector)
    if cabecera != COLUMNAS_PUNTOS:
        fallar(f"puntos_90_dias.csv tiene columnas {cabecera}")
    vistos = set()
    conteo = {}
    for fila in filas_pts:
        if len(fila) != len(COLUMNAS_PUNTOS) or fila[0] not in nacional:
            fallar(f"punto con formato o fecha inesperados: {fila}")
        if fila[3] not in DEPARTAMENTOS[:-1]:
            fallar(f"punto con departamento desconocido: {fila}")
        try:
            lat, lon = float(fila[1]), float(fila[2])
        except ValueError:
            fallar(f"punto con coordenadas no numericas: {fila}")
        if not (-23.5 <= lat <= -9.5 and -70 <= lon <= -57.4):
            fallar(f"punto fuera de Bolivia: {fila}")
        if (fila[0], lat, lon) in vistos:
            fallar(f"punto repetido el mismo dia: {fila}")
        vistos.add((fila[0], lat, lon))
        conteo[(fila[0], fila[3])] = conteo.get((fila[0], fila[3]), 0) + 1
    for fila in filas_dep:
        for departamento, valor in zip(DEPARTAMENTOS[:-1], fila[1:-1]):
            if conteo.get((fila[0], departamento), 0) != int(valor):
                fallar(f"puntos_90_dias.csv no cuadra con {departamento} el {fila[0]}")

    geo = json.loads((datos / "departamentos.geojson").read_text(encoding="utf-8"))
    if set(geo) != {"type", "features"}:
        fallar(f"departamentos.geojson con claves inesperadas: {sorted(geo)}")
    for f in geo["features"]:
        if set(f) != {"type", "properties", "geometry"} or set(f["properties"]) != {"id", "nombre"}:
            fallar(f"departamentos.geojson con propiedades inesperadas: {sorted(f['properties'])}")
        if set(f["geometry"]) != {"type", "coordinates"} or f["geometry"]["type"] not in {"Polygon", "MultiPolygon"}:
            fallar("departamentos.geojson con geometria inesperada")
    ids = sorted(f["properties"]["id"] for f in geo["features"])
    if ids != sorted(DEPARTAMENTOS[:-1]):
        fallar(f"departamentos.geojson no tiene los 9 departamentos: {ids}")

    for ruta in RAIZ.rglob("*"):
        if not ruta.is_file() or ".git" in ruta.parts or PRIVADO in ruta.parts:
            continue
        if ruta.suffix.lower() in EXTENSIONES_PROHIBIDAS:
            fallar(f"archivo de tipo prohibido: {ruta.relative_to(RAIZ)}")
        if ruta.suffix.lower() not in {".py", ".csv", ".json", ".geojson", ".html", ".md", ".yml", ".txt", ".js", ".css"}:
            continue
        if ruta.parent.name == "herramientas":
            continue
        texto = ruta.read_text(encoding="utf-8", errors="replace")
        texto = re.sub(r"\$\{\{[^}]*\}\}", "", texto)
        colados = [p for p in PROHIBIDO if p.lower() in texto.lower()]
        if colados:
            fallar(f"{ruta.relative_to(RAIZ)} contiene material privado: {colados}")
        for patron in CLAVES:
            if re.search(patron, texto):
                fallar(f"{ruta.relative_to(RAIZ)} parece contener una credencial")

    print(f"[OK] frontera publica intacta: {len(filas)} dias, {len(filas_pts)} puntos-dia, "
          "departamentos cuadrados, sin rastros privados")
    return 0


if __name__ == "__main__":
    sys.exit(main())
