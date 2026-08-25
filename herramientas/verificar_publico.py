"""Frontera publica: falla la corrida si algo privado se cuela al repositorio.

Se ejecuta antes de publicar. Comprueba dos cosas: que solo esten los archivos
permitidos, y que ninguno contenga rastros del motor privado.
"""

from __future__ import annotations

import csv
import re
import subprocess
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[1]

# Durante la corrida, el motor privado se descarga en private/. No es contenido
# de este repositorio: esta en .gitignore y el commit usa rutas explicitas. Por
# eso no se lee su contenido; lo que se comprueba es exactamente eso.
PRIVADO = "private"

# Lo unico que puede vivir en pagina/data
DATOS_PERMITIDOS = {"ultimos_90_dias.csv", "resumen.json"}

# Columnas admitidas en el CSV publico: solo el agregado diario
COLUMNAS = ["fecha", "bloqueos"]

# Como se obtienen los datos. Eso vive solo en el motor privado.
# Los nombres de columna del calculo (latitud, longitud) si pueden aparecer:
# describen el esquema de entrada, no publican ninguna coordenada. El nombre de
# una variable de entorno tampoco es un secreto; lo que se vigila es su valor.
PROHIBIDO = (
    "captcha", "genai", "BeautifulSoup", "requests.Session",
    "api/v1/data", "solve_", "fetch_once", "fetch_events",
)

# Credenciales de verdad, por su forma
CLAVES = (
    r"AIza[0-9A-Za-z_-]{30,}",
    r"BEGIN [A-Z ]*PRIVATE KEY",
    r"ssh-(rsa|ed25519) AAAA[0-9A-Za-z+/]{20,}",
    r"gh[pousr]_[0-9A-Za-z]{30,}",
    r"sk-[A-Za-z0-9]{30,}",
)

# Archivos crudos que nunca deben aparecer
EXTENSIONES_PROHIBIDAS = {".jsonl", ".gz", ".zip", ".tar", ".pem", ".key", ".env"}


def fallar(mensaje: str) -> None:
    print(f"[ERROR] {mensaje}", file=sys.stderr)
    sys.exit(1)


def git(*argumentos: str) -> subprocess.CompletedProcess:
    return subprocess.run(
        ["git", *argumentos], cwd=RAIZ, capture_output=True, text=True,
    )


def revisar_motor_privado() -> None:
    """El motor privado puede estar en el disco, nunca en el repositorio."""
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
    """codigo/indicador.py se publica para leerse, no para correrse.

    La serie sale del motor privado. Si algun dia algo de aqui empezara a
    importarlo o ejecutarlo, este repositorio dejaria de ser solo un espejo y
    la corrida falla antes de publicar.
    """
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
    if not 1 <= len(filas) <= 95:
        fallar(f"el CSV publico tiene {len(filas)} filas, fuera del rango esperado")
    for fila in filas:
        if len(fila) != 2 or not re.fullmatch(r"\d{4}-\d{2}-\d{2}", fila[0]):
            fallar(f"fila con formato inesperado: {fila}")
        if not re.fullmatch(r"\d+", fila[1]):
            fallar(f"valor de bloqueos no entero: {fila}")

    # ningun archivo del repositorio puede contener rastros privados
    for ruta in RAIZ.rglob("*"):
        if not ruta.is_file() or ".git" in ruta.parts or PRIVADO in ruta.parts:
            continue
        if ruta.suffix.lower() in EXTENSIONES_PROHIBIDAS:
            fallar(f"archivo de tipo prohibido: {ruta.relative_to(RAIZ)}")
        if ruta.suffix.lower() not in {".py", ".csv", ".json", ".html", ".md", ".yml", ".txt"}:
            continue
        # las herramientas declaran los terminos prohibidos para poder vigilarlos
        if ruta.parent.name == "herramientas":
            continue
        texto = ruta.read_text(encoding="utf-8", errors="replace")
        # ${{ secrets.X }} es una referencia, no un valor: GitHub resuelve el
        # secreto en tiempo de ejecucion y nunca queda escrito aqui.
        texto = re.sub(r"\$\{\{[^}]*\}\}", "", texto)
        colados = [p for p in PROHIBIDO if p.lower() in texto.lower()]
        if colados:
            fallar(f"{ruta.relative_to(RAIZ)} contiene material privado: {colados}")
        for patron in CLAVES:
            if re.search(patron, texto):
                fallar(f"{ruta.relative_to(RAIZ)} parece contener una credencial")

    print(f"[OK] frontera publica intacta: {len(filas)} dias, sin rastros privados")
    return 0


if __name__ == "__main__":
    sys.exit(main())
