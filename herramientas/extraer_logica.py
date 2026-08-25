from __future__ import annotations

import ast
import sys
from pathlib import Path

CONSTANTES = [
    "CONFLICT_STATE",
    "COLUMNS",
    "KEY_COLUMNS",
    "DATE_COLUMNS",
    "INDICATOR_START",
]
FUNCIONES = [
    "normalize",
    "frame_schema",
    "remove_exact_duplicates",
    "observable_activities",
    "episode_start_days",
    "build_daily_series",
]

PROHIBIDO = (
    "requests", "session", "captcha", "genai", "gemini", "BeautifulSoup",
    "API_URL", "BASE_URL", "GEMINI", "urljoin", "solve_", "fetch_",
)

CABECERA = '''"""Calculo del indicador de conflictos sociales en carreteras de Bolivia.

===============================================================================
ARCHIVO DE REFERENCIA. NO SE EJECUTA NI SE IMPORTA EN NINGUN LADO.

Esta aqui para que se pueda leer y auditar como se calcula el indicador. Nada
en este repositorio lo llama: ni el workflow, ni la pagina, ni las
herramientas. La serie publicada NO sale de este archivo.

La serie sale del motor privado. Este archivo es una copia de solo lectura de
su logica de calculo, extraida automaticamente en cada corrida: si el motor
cambia, esto cambia detras. Por eso se lee, no se edita ni se corre.
===============================================================================

Contiene unicamente la logica de calculo: como se pasa de los reportes de
transitabilidad a un conteo diario de bloqueos. La obtencion de los datos no
forma parte de este archivo.

Unidad de conteo: una coordenada unica por dia.
"""

from __future__ import annotations

from collections import defaultdict

import pandas as pd

'''


def main() -> int:
    if len(sys.argv) != 3:
        print("uso: extraer_logica.py <main.py de origen> <destino>")
        return 2

    origen, destino = Path(sys.argv[1]), Path(sys.argv[2])
    arbol = ast.parse(origen.read_text(encoding="utf-8"))

    piezas: dict[str, str] = {}
    for nodo in arbol.body:
        if isinstance(nodo, ast.FunctionDef) and nodo.name in FUNCIONES:
            piezas[nodo.name] = ast.get_source_segment(
                origen.read_text(encoding="utf-8"), nodo
            )
        elif isinstance(nodo, ast.Assign):
            for objetivo in nodo.targets:
                if isinstance(objetivo, ast.Name) and objetivo.id in CONSTANTES:
                    piezas[objetivo.id] = ast.get_source_segment(
                        origen.read_text(encoding="utf-8"), nodo
                    )

    faltan = [n for n in CONSTANTES + FUNCIONES if n not in piezas]
    if faltan:
        print(f"ERROR: no se encontraron en el origen: {faltan}", file=sys.stderr)
        return 1

    cuerpo = CABECERA
    for nombre in CONSTANTES:
        cuerpo += piezas[nombre] + "\n\n"
    cuerpo += "\n"
    for nombre in FUNCIONES:
        cuerpo += piezas[nombre] + "\n\n\n"

    colados = [p for p in PROHIBIDO if p in cuerpo]
    if colados:
        print(f"ERROR: la extraccion arrastro codigo privado: {colados}", file=sys.stderr)
        return 1

    try:
        ast.parse(cuerpo)
    except SyntaxError as exc:
        print(f"ERROR: el resultado no es Python valido: {exc}", file=sys.stderr)
        return 1

    destino.parent.mkdir(parents=True, exist_ok=True)
    destino.write_text(cuerpo.rstrip() + "\n", encoding="utf-8", newline="\n")
    print(f"[OK] {destino}: {len(CONSTANTES)} constantes y {len(FUNCIONES)} funciones")
    return 0


if __name__ == "__main__":
    sys.exit(main())
