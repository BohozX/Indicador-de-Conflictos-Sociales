# Indicador de Conflictos Sociales · Bolivia

Seguimiento diario de los puntos de la red vial fundamental bloqueados por
conflictos sociales, a partir de los reportes públicos de transitabilidad de la
Administradora Boliviana de Carreteras.

**Página:** https://bohozx.github.io/Indicador-de-Conflictos-Sociales/

> Proyecto independiente. No es una publicación oficial de la ABC.

## Qué hay aquí

| | |
|---|---|
| `pagina/` | La página: gráfico de los últimos 90 días, en vista diaria y semanal |
| `pagina/data/ultimos_90_dias.csv` | La serie publicada: `fecha,bloqueos` |
| `pagina/data/resumen.json` | Cifras del periodo |
| `codigo/indicador.py` | El cálculo del indicador |
| `herramientas/` | Generación de los datos públicos y control de la frontera |

## Metodología

La unidad de conteo es **una coordenada única por día**. Un mismo punto de la
carretera reportado varias veces en una jornada cuenta una sola vez.

Un punto se cuenta desde el día en que se reporta el bloqueo y sigue contando
mientras el episodio permanezca abierto. El último día se cuenta solo si, antes
del cierre, hubo al menos una observación en la que el episodio seguía activo;
si se cierra en la primera observación del día, ese día no cuenta.

Solo se consideran los reportes cuyo estado corresponde a un tramo no
transitable por conflictos sociales, con fecha y coordenadas válidas.

En la vista semanal, las semanas van de **lunes a domingo** y cada barra es el
**promedio de puntos bloqueados por día** de esa semana, para que ambas vistas
se lean en la misma escala. Las semanas incompletas de los extremos se dibujan
atenuadas y se promedian solo sobre los días observados.

## Sobre el código publicado

`codigo/indicador.py` **no es una transcripción a mano**: se extrae
automáticamente, en cada actualización, del motor que produce la serie. Así lo
que se lee aquí es siempre la lógica que realmente se ejecutó.

La obtención de los datos no forma parte de este repositorio.

## Actualización

Cada dos horas mediante GitHub Actions. Solo se genera un commit cuando la
serie cambia.

Antes de publicar, `herramientas/verificar_publico.py` comprueba que en el
repositorio solo estén los archivos permitidos y que ninguno contenga
credenciales ni rastros del proceso de obtención de datos. Si algo se cuela,
la ejecución falla y no se publica.

## Fuente

Administradora Boliviana de Carreteras (ABC), reportes públicos de
transitabilidad de la red vial fundamental.
