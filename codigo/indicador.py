"""Calculo del indicador de conflictos sociales en carreteras de Bolivia.

Este archivo se genera automaticamente a partir del motor que produce la serie
publicada, y contiene unicamente la logica de calculo: como se pasa de los
reportes de transitabilidad a un conteo diario de bloqueos.

La obtencion de los datos no forma parte de este archivo.

Unidad de conteo: una coordenada unica por dia.
"""

from __future__ import annotations

from collections import defaultdict

import pandas as pd

CONFLICT_STATE = "e - no transitable por conflictos sociales"

COLUMNS = [
    "fecha_consulta",
    "fecha_reporte",
    "fecha_fin",
    "latitud",
    "longitud",
    "estado",
    "sección",
    "evento",
    "clima",
    "horario_de_corte",
    "tipo_de_carretera",
    "alternativa_de_circulación_o_desvios",
    "restricción_vehicular",
    "sector",
    "trabajos_de_conservación_vial",
]

KEY_COLUMNS = [
    "fecha_reporte",
    "latitud",
    "longitud",
]

DATE_COLUMNS = ["fecha_consulta", "fecha_reporte", "fecha_fin"]

INDICATOR_START = pd.Timestamp("2021-01-01")


def normalize(value):
    if value is None:
        return ""

    return str(value).strip().lower()


def frame_schema(df):
    df = df.copy()

    for column in COLUMNS:
        if column not in df.columns:
            df[column] = pd.NA

    for column in [
        "fecha_consulta",
        "fecha_reporte",
        "fecha_fin",
    ]:
        df[column] = (
            pd.to_datetime(
                df[column],
                errors="coerce",
            )
            .dt.floor("s")
        )

    for column in [
        "latitud",
        "longitud",
    ]:
        df[column] = (
            pd.to_numeric(
                df[column],
                errors="coerce",
            )
            .round(10)
        )

    for column in COLUMNS:
        if column not in [
            "fecha_consulta",
            "fecha_reporte",
            "fecha_fin",
            "latitud",
            "longitud",
        ]:
            df[column] = df[column].astype("string")

    return df[COLUMNS]


def remove_exact_duplicates(df):
    """Elimina solo filas 100 % idénticas; preserva reapariciones reales."""
    out = frame_schema(df)
    return (
        out.drop_duplicates(subset=COLUMNS, keep="first")
        .sort_values(
            ["fecha_consulta", "fecha_reporte", "latitud", "longitud"],
            kind="stable",
        )
        .reset_index(drop=True)
    )


def observable_activities(df):
    """Cambios reconstruibles: cualquier alta o cierre, de cualquier estado."""
    data = frame_schema(df)
    timestamps = (
        pd.concat(
            [data["fecha_consulta"].dropna(), data["fecha_fin"].dropna()],
            ignore_index=True,
        )
        .drop_duplicates()
        .sort_values()
    )
    activities = defaultdict(list)
    for value in timestamps:
        ts = pd.Timestamp(value).floor("s")
        activities[ts.normalize()].append(ts)
    return dict(activities)


def episode_start_days(data):
    """Overrides solo para reapariciones de una clave exacta ya cerrada."""
    duplicated = data.loc[data.duplicated(subset=KEY_COLUMNS, keep=False)]
    if duplicated.empty:
        return {}
    starts = {}
    for _, group in duplicated.groupby(KEY_COLUMNS, dropna=False, sort=False):
        ordered = group.sort_values("fecha_consulta", kind="stable", na_position="last")
        for position, (idx, row) in enumerate(ordered.iterrows()):
            if position == 0:
                continue
            repday = pd.Timestamp(row["fecha_reporte"]).normalize()
            if pd.notna(row["fecha_consulta"]):
                starts[idx] = max(repday, pd.Timestamp(row["fecha_consulta"]).normalize())
    return starts


def build_daily_series(df, start_date, end_date):
    """Calcula solo el rango solicitado usando la metodología histórica final.

    Reglas:
    - unidad: coordenada única por día;
    - día de fecha_reporte: cuenta;
    - días intermedios de una versión abierta: cuentan;
    - día terminal posterior al reporte: cuenta solo si antes de fecha_fin
      hubo al menos una actividad observable en la base y el episodio seguía abierto;
    - si se cierra en la primera actividad observable del día, el terminal no cuenta;
    - varias versiones de una coordenada el mismo día cuentan una sola vez.
    """
    data = remove_exact_duplicates(df)
    activities = observable_activities(data)
    effective_starts = episode_start_days(data)
    start = max(pd.Timestamp(start_date).normalize(), INDICATOR_START)
    end = pd.Timestamp(end_date).normalize()
    if end < start:
        return pd.DataFrame(columns=["fecha", "bloqueos"])

    conflicts = data.loc[
        data["estado"].astype("string").str.strip().str.lower().eq(CONFLICT_STATE)
        & data["fecha_reporte"].notna()
        & data["latitud"].notna()
        & data["longitud"].notna()
    ].copy()

    point_days = set()
    for row in conflicts.itertuples(index=True):
        report = pd.Timestamp(row.fecha_reporte).floor("s")
        repday = effective_starts.get(row.Index, report.normalize())
        first = (
            pd.Timestamp(row.fecha_consulta).floor("s")
            if pd.notna(row.fecha_consulta)
            else pd.NaT
        )
        finish = (
            pd.Timestamp(row.fecha_fin).floor("s")
            if pd.notna(row.fecha_fin)
            else pd.NaT
        )
        lat = float(row.latitud)
        lon = float(row.longitud)

        if pd.isna(finish):
            last = end
        else:
            fday = finish.normalize()
            if fday <= repday:
                last = repday
            else:
                survived = False
                for activity in activities.get(fday, []):
                    if activity >= finish:
                        continue
                    if pd.notna(first) and activity < first:
                        continue
                    survived = True
                    break
                last = fday if survived else fday - pd.Timedelta(days=1)

        begin = max(repday, start)
        stop = min(last, end)
        if stop >= begin:
            for day in pd.date_range(begin, stop, freq="D"):
                point_days.add((day.normalize(), lat, lon))

    counts = defaultdict(int)
    for day, lat, lon in point_days:
        counts[day] += 1

    dates = pd.date_range(start, end, freq="D")
    return pd.DataFrame(
        {
            "fecha": dates,
            "bloqueos": [int(counts.get(day.normalize(), 0)) for day in dates],
        }
    )
