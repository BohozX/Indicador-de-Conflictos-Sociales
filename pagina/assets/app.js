const $ = (s) => document.querySelector(s);

const diccionario = { en: {
  "Entorno sociopolítico · Bolivia": "Sociopolitical environment · Bolivia",
  "Bloqueos de carreteras por conflictos sociales en Bolivia, día a día y por departamento, y un índice de incertidumbre a partir de medios de prensa bolivianos.": "Road blockades caused by social conflicts in Bolivia, day by day and by department, and an uncertainty index based on Bolivian news outlets.",
  "Inicio": "Home",
  "Secciones": "Sections",
  "Idioma": "Language",
  "Por departamento": "By department",
  "Incertidumbre": "Uncertainty",
  "Indicador de Conflictos Sociales": "Social Conflict Indicator",
  "Conflictos": "Conflicts",
  "Entorno sociopolítico": "Sociopolitical environment",
  "Bloqueos hoy · Bolivia": "Blockades today · Bolivia",
  "Máximo en 90 días": "Maximum in 90 days",
  "puntos en un solo día": "points in a single day",
  "Días con bloqueo · Bolivia": "Days with blockades · Bolivia",
  "de los últimos 90": "of the last 90",
  "Noticias registradas": "News recorded",
  "Red vial fundamental": "Main road network",
  "Territorio": "Territory",
  "Seleccionar territorio": "Select territory",
  "Últimos 90 días": "Last 90 days",
  "Agrupación": "Grouping",
  "Diario": "Daily",
  "Semanal": "Weekly",
  "Cada barra suma los puntos bloqueados de lunes a domingo; las semanas incompletas van atenuadas.": "Each bar adds up the blocked points from Monday to Sunday; incomplete weeks are faded.",
  "Toca un día para verlo en el mapa.": "Tap a day to see it on the map.",
  "Bloqueos diarios de los últimos 90 días": "Daily blockades in the last 90 days",
  "Datos no disponibles": "Data not available",
  "No fue posible cargar la serie.": "Could not load the series.",
  "Bloqueos · Bolivia": "Blockades · Bolivia",
  "Período del mapa": "Map period",
  "Día": "Day",
  "90 días": "90 days",
  "Día seleccionado": "Selected day",
  "Día anterior": "Previous day",
  "Día siguiente": "Next day",
  "Cargando fecha…": "Loading date…",
  "Mapa de bloqueos por departamento de Bolivia": "Map of blockades by department in Bolivia",
  "Cargando mapa…": "Loading map…",
  "Ver 90 días": "See 90 days",
  "Relleno: bloqueos del día · Círculos: puntos bloqueados": "Fill: blockades on the day · Circles: blocked points",
  "Puntos del día / puntos-día en 90 días": "Points on the day / point-days in 90 days",
  "Cargando departamentos…": "Loading departments…",
  "Metodología": "Methodology",
  "Fuente: Administradora Boliviana de Carreteras (ABC), reportes públicos de transitabilidad · Límites: GeoBolivia": "Source: Bolivian Road Administration (ABC), public road condition reports · Boundaries: GeoBolivia",
  "En construcción": "Under construction",
  "Índice de Incertidumbre": "Uncertainty Index",
  "Últimos 7 días": "Last 7 days",
  "Medios": "Outlets",
  "prensa, radio y televisión": "press, radio and television",
  "Nuevas en la última actualización": "New in the latest update",
  "Noticias por día": "News per day",
  "Noticias registradas por día": "News recorded per day",
  "Por medio": "By outlet",
  "últimos 7 días": "last 7 days",
  "Últimos titulares": "Latest headlines",
  "Fuente: medios de prensa bolivianos": "Source: Bolivian news outlets",
  "Bloqueos hoy · {territorio}": "Blockades today · {territorio}",
  "Días con bloqueo · {territorio}": "Days with blockades · {territorio}",
  "Máximo en {n} días · {territorio}": "Maximum in {n} days · {territorio}",
  "de los últimos {n}": "of the last {n}",
  "Últimos {n} días · {territorio}": "Last {n} days · {territorio}",
  "Bloqueos diarios de los últimos {n} días · {territorio}": "Daily blockades in the last {n} days · {territorio}",
  "Bloqueos semanales de los últimos {n} días · {territorio}": "Weekly blockades in the last {n} days · {territorio}",
  "Última actualización: {fecha}": "Last update: {fecha}",
  "Fecha de actualización no disponible": "Update date not available",
  "{nombre}: {hoy} puntos el día seleccionado, {total} puntos-día en 90 días": "{nombre}: {hoy} points on the selected day, {total} point-days in 90 days",
  "Sin ubicación válida: {dia} el día seleccionado, {total} en 90 días. Cuentan solo en el total nacional.": "No valid location: {dia} on the selected day, {total} in 90 days. They count only in the national total.",
  "Fecha no disponible": "Date not available",
  "Acercar": "Zoom in",
  "Alejar": "Zoom out",
  "día bloqueado": "day blocked",
  "días bloqueado": "days blocked",
  "Primer día: {fecha}": "First day: {fecha}",
  "Último día: {fecha}": "Last day: {fecha}",
  "Bloqueos · {territorio}": "Blockades · {territorio}",
  "Mapa de bloqueos · {territorio} · {periodo}": "Map of blockades · {territorio} · {periodo}",
  "últimos 90 días": "last 90 days",
  "el {fecha}": "on {fecha}",
  "en 90 días": "in 90 days",
  "punto": "point",
  "puntos": "points",
  "punto-día": "point-day",
  "puntos-día": "point-days",
  "Relleno: puntos-día en 90 días · Tamaño del círculo: días bloqueado": "Fill: point-days in 90 days · Circle size: days blocked",
  "Cargando puntos…": "Loading points…",
  "Fecha no disponible. Selecciona la vista de 90 días para ver los puntos.": "Date not available. Choose the 90-day view to see the points.",
  "Sin bloqueos en los últimos 90 días": "No blockades in the last 90 days",
  "Sin bloqueos reportados el {fecha}": "No blockades reported on {fecha}",
  " · semana parcial ({n} d)": " · partial week ({n} d)",
  "Semana del {rango}{parcial}": "Week of {rango}{parcial}",
  "{n} en la semana": "{n} in the week",
  "máximo {maximo} en un día · {dias} de {n} días con bloqueo": "max {maximo} in a day · {dias} of {n} days with blockades",
  "punto bloqueado": "blocked point",
  "puntos bloqueados": "blocked points",
  "desde el {fecha}": "since {fecha}",
  "desde {fecha}": "since {fecha}",
  "noticias": "news items",
  "Cargando la serie nacional…": "Loading the national series…",
  "Cargando la serie departamental…": "Loading the department series…",
  "No fue posible cargar el mapa. Los demás datos siguen disponibles.": "Could not load the map. The other data remain available.",
  "No fue posible iniciar el mapa.": "Could not initialize the map.",
  "No fue posible cargar la serie nacional.": "Could not load the national series.",
  "No fue posible cargar los datos por departamento.": "Could not load the data by department.",
  "No fue posible cargar los puntos de bloqueo.": "Could not load the blockade points.",
  "No fue posible cargar los límites departamentales.": "Could not load the department boundaries.",
  "No fue posible cargar el resumen de noticias.": "Could not load the news summary.",
  "El CSV tiene comillas sin cerrar.": "The CSV has unclosed quotes.",
  "El CSV tiene filas incompletas.": "The CSV has incomplete rows.",
  "No fue posible cargar el archivo.": "Could not load the file.",
  "El archivo no tiene el formato esperado.": "The file does not have the expected format.",
  "El archivo contiene un valor no válido.": "The file contains an invalid value.",
  "Lo que pasa en las carreteras y en las noticias de Bolivia: los puntos bloqueados por conflictos sociales, <b>día a día</b> y por departamento, y un índice de incertidumbre construido a partir de once medios de prensa.": "What is happening on Bolivia's roads and in its news: road points blocked by social conflicts, <b>day by day</b> and by department, and an uncertainty index built from eleven news outlets.",
  "La unidad de conteo es <b>una coordenada única por día</b>. Un mismo punto de la carretera reportado varias veces en una jornada cuenta una sola vez.": "The counting unit is <b>one unique coordinate per day</b>. A road point reported several times in a day is counted only once.",
  "Un punto se cuenta desde el día en que se reporta el bloqueo y sigue contando mientras el episodio permanezca abierto. El último día se cuenta solo si, antes del cierre, hubo al menos una observación en la que el episodio seguía activo; si se cierra en la primera observación del día, ese día no cuenta.": "A point is counted from the day the blockade is reported and continues to count while the episode remains open. The last day is counted only if, before closure, there was at least one observation in which the episode was still active; if it is closed in the first observation of the day, that day is not counted.",
  "Solo se consideran los reportes cuyo estado corresponde a un tramo no transitable por conflictos sociales, con fecha y coordenadas válidas.": "Only reports whose status corresponds to a road section impassable due to social conflicts, with valid dates and coordinates, are considered.",
  "Cada punto se asigna a un departamento ubicando su coordenada dentro de los límites departamentales de GeoBolivia. Si cae fuera del país a menos de 5 km del borde (pasos fronterizos), se asigna al departamento más cercano. Los puntos que la ABC publica sin coordenadas válidas cuentan en el total nacional, pero no en ningún departamento.": "Each point is assigned to a department by locating its coordinate within the GeoBolivia department boundaries. If it falls outside the country less than 5 km from the border (border crossings), it is assigned to the nearest department. Points published by ABC without valid coordinates count toward the national total, but not toward any department.",
  "En <code>codigo/indicador.py</code> de este mismo repositorio puede leerse la lógica exacta de este cálculo. Es una copia de referencia, publicada para poder auditarla: se extrae en cada actualización del motor que realmente produce la serie.": "The exact logic of this calculation can be read in <code>codigo/indicador.py</code> in this same repository. It is a reference copy, published so it can be audited: it is extracted at each update from the engine that actually produces the series."
} };
let idioma = "es";
try {
  const guardado = localStorage.getItem("idioma");
  if (guardado === "en" || guardado === "es") idioma = guardado;
} catch {}
const configuracionRegional = () => idioma === "en" ? "en-US" : "es-BO";
const originalesIdioma = new WeakMap();
let entero;
let diaMes;
let diaCompleto;

function traducir(clave, valores = {}) {
  const plantilla = diccionario[idioma]?.[clave] ?? clave;
  return plantilla.replace(/\{(\w+)\}/g, (marca, nombre) => valores[nombre] ?? marca);
}

function prepararFormatos() {
  entero = new Intl.NumberFormat(configuracionRegional(), { maximumFractionDigits: 0 });
  diaMes = new Intl.DateTimeFormat(configuracionRegional(), {
    timeZone: "UTC", day: "2-digit", month: "short",
  });
  diaCompleto = new Intl.DateTimeFormat(configuracionRegional(), {
    timeZone: "UTC", weekday: "long", day: "2-digit", month: "long", year: "numeric",
  });
}

function aplicarIdioma() {
  document.querySelectorAll("[data-i18n-lang]").forEach((el) => el.setAttribute("lang", idioma));
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    if (!originalesIdioma.has(el)) originalesIdioma.set(el, el.innerHTML);
    el.innerHTML = idioma === "es" ? originalesIdioma.get(el) : traducir(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => el.setAttribute("aria-label", traducir(el.dataset.i18nAria)));
  document.querySelectorAll("[data-i18n-content]").forEach((el) => el.setAttribute("content", traducir(el.dataset.i18nContent)));
  document.querySelectorAll("#idioma button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.l === idioma)));
  actualizarZoom();
}

function actualizarZoom() {
  document.querySelectorAll("#mapa .leaflet-control-zoom a").forEach((b, i) => {
    const etiqueta = traducir(i === 0 ? "Acercar" : "Alejar");
    b.setAttribute("title", etiqueta);
    b.setAttribute("aria-label", etiqueta);
  });
}

function cambiarIdioma(nuevo) {
  if (!["es", "en"].includes(nuevo) || nuevo === idioma) return;
  idioma = nuevo;
  try { localStorage.setItem("idioma", idioma); } catch {}
  prepararFormatos();
  aplicarIdioma();
  actualizar();
  window.dispatchEvent(new Event("idiomachange"));
}

prepararFormatos();

let serie = [];
let vista = "dia";
let nacional = [];
let departamentales = null;
let puntos = null;
let limites = null;
let territorio = "bolivia";
let diaSeleccionado = "";
let modoMapa = "dia";
let mapa = null;
let capaLimites = null;
let capaPuntos = null;
const estilosMapa = new Map();
const errores = {};
const departamentos = [
  { id: "beni", nombre: "Beni" },
  { id: "chuquisaca", nombre: "Chuquisaca" },
  { id: "cochabamba", nombre: "Cochabamba" },
  { id: "la_paz", nombre: "La Paz" },
  { id: "oruro", nombre: "Oruro" },
  { id: "pando", nombre: "Pando" },
  { id: "potosi", nombre: "Potosí" },
  { id: "santa_cruz", nombre: "Santa Cruz" },
  { id: "tarija", nombre: "Tarija" },
];
const nombreTerritorio = () => departamentos.find((d) => d.id === territorio)?.nombre || "Bolivia";
const calendario = () => nacional.length ? nacional : departamentales || [];
const filaDia = () => departamentales?.find((p) => p.fecha === diaSeleccionado);

function fecha(iso) {
  return new Date(`${iso}T00:00:00Z`);
}

function porSemana(datos) {
  const semanas = new Map();
  datos.forEach((p) => {
    const d = fecha(p.fecha);
    const diaSemana = (d.getUTCDay() + 6) % 7;
    const lunes = new Date(d);
    lunes.setUTCDate(d.getUTCDate() - diaSemana);
    const clave = lunes.toISOString().slice(0, 10);
    if (!semanas.has(clave)) semanas.set(clave, []);
    semanas.get(clave).push(p.bloqueos);
  });

  return [...semanas.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1)).map(([lunes, valores]) => {
    const domingo = new Date(fecha(lunes));
    domingo.setUTCDate(domingo.getUTCDate() + 6);
    const suma = valores.reduce((a, b) => a + b, 0);
    return {
      fecha: lunes,
      hasta: domingo.toISOString().slice(0, 10),
      bloqueos: suma,
      maximo: Math.max(...valores),
      dias: valores.length,
      diasConBloqueo: valores.filter((v) => v > 0).length,
      completa: valores.length === 7,
    };
  });
}

const datosVista = () => (vista === "semana" ? porSemana(serie) : serie);

function mostrarError(detalle) {
  $("#estado").hidden = false;
  $("#estado-detalle").textContent = traducir(detalle);
}

function leerCSV(texto) {
  const filas = [];
  let fila = [];
  let campo = "";
  let comillas = false;
  const contenido = texto.replace(/^\uFEFF/, "");
  for (let i = 0; i < contenido.length; i += 1) {
    const c = contenido[i];
    if (c === '"') {
      if (comillas && contenido[i + 1] === '"') { campo += '"'; i += 1; }
      else comillas = !comillas;
    } else if (c === "," && !comillas) {
      fila.push(campo);
      campo = "";
    } else if ((c === "\n" || c === "\r") && !comillas) {
      fila.push(campo);
      if (fila.some((v) => v !== "")) filas.push(fila);
      fila = [];
      campo = "";
      if (c === "\r" && contenido[i + 1] === "\n") i += 1;
    } else campo += c;
  }
  if (comillas) throw new Error(traducir("El CSV tiene comillas sin cerrar."));
  fila.push(campo);
  if (fila.some((v) => v !== "")) filas.push(fila);
  const cabecera = filas.shift() || [];
  if (filas.some((f) => f.length !== cabecera.length)) throw new Error(traducir("El CSV tiene filas incompletas."));
  return { cabecera, filas: filas.map((f) => Object.fromEntries(cabecera.map((c, i) => [c, f[i]]))) };
}

async function cargarCSV(archivo, columnas) {
  const respuesta = await fetch(`data/${archivo}?v=${Date.now()}`, { cache: "no-store" });
  if (!respuesta.ok) throw new Error(traducir("No fue posible cargar el archivo."));
  const datos = leerCSV(await respuesta.text());
  if (columnas.some((c) => !datos.cabecera.includes(c))) throw new Error(traducir("El archivo no tiene el formato esperado."));
  return datos.filas;
}

function numero(valor) {
  if (valor === "" || !Number.isFinite(Number(valor))) throw new Error(traducir("El archivo contiene un valor no válido."));
  return Number(valor);
}

function actualizar() {
  const dias = calendario();
  if (!diaSeleccionado && dias.length) diaSeleccionado = dias.at(-1).fecha;
  serie = territorio === "bolivia" ? nacional : (departamentales || []).map((p) => ({
    fecha: p.fecha, bloqueos: p[territorio],
  }));
  $("#estado").hidden = !!serie.length;
  if (!serie.length) mostrarError(territorio === "bolivia"
    ? errores.nacional || "Cargando la serie nacional…"
    : errores.departamentos || "Cargando la serie departamental…");
  pintarCifras();
  ocultarTip();
  dibujar();
  pintarPanel();
  pintarFecha();
  pintarMapa();
}

function seleccionarTerritorio(id, animado = true) {
  if (id !== "bolivia" && !departamentos.some((d) => d.id === id)) return;
  territorio = id;
  document.querySelectorAll("#territorios button").forEach((b) => {
    const activo = b.dataset.territorio === territorio;
    b.classList.toggle("activo", activo);
    b.setAttribute("aria-pressed", String(activo));
  });
  actualizar();
  encuadrar(animado);
}

function seleccionarDia(iso) {
  if (!calendario().some((p) => p.fecha === iso)) return;
  diaSeleccionado = iso;
  ocultarTip();
  dibujar();
  pintarPanel();
  pintarFecha();
  pintarMapa();
}

function moverDia(paso) {
  const dias = calendario();
  const i = dias.findIndex((p) => p.fecha === diaSeleccionado);
  if (dias[i + paso]) seleccionarDia(dias[i + paso].fecha);
}

function contar(el, valor) {
  if (!el) return;
  if (!Number.isFinite(valor)) { el.textContent = "—"; el.dataset.valor = ""; return; }
  const desde = Number(el.dataset.valor || 0);
  el.dataset.valor = String(valor);
  cancelAnimationFrame(el.animacion || 0);
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || desde === valor) { el.textContent = entero.format(valor); return; }
  const inicio = performance.now();
  const paso = (t) => {
    const k = Math.min(1, (t - inicio) / 900);
    el.textContent = entero.format(Math.round(desde + (valor - desde) * (1 - (1 - k) ** 3)));
    if (k < 1) el.animacion = requestAnimationFrame(paso);
  };
  el.animacion = requestAnimationFrame(paso);
}

function pintarCifras() {
  const ultimo = serie.at(-1);
  const valores = serie.map((p) => p.bloqueos);
  const conBloqueo = valores.filter((v) => v > 0).length;

  $("#r-hoy").textContent = traducir("Bloqueos hoy · {territorio}", { territorio: nombreTerritorio() });
  $("#r-con-bloqueo").textContent = traducir("Días con bloqueo · {territorio}", { territorio: nombreTerritorio() });
  contar($("#c-hoy"), ultimo ? ultimo.bloqueos : NaN);
  $("#c-hoy-fecha").textContent = ultimo ? diaMes.format(fecha(ultimo.fecha)) : traducir("Datos no disponibles");
  contar($("#c-max"), ultimo ? Math.max(...valores) : NaN);
  contar($("#c-dias"), ultimo ? conBloqueo : NaN);

  const n = serie.length || 90;
  $("#r-max").textContent = traducir("Máximo en {n} días · {territorio}", { n, territorio: nombreTerritorio() });
  $("#r-dias").textContent = traducir("de los últimos {n}", { n });
  $("#r-titulo").textContent = traducir("Últimos {n} días · {territorio}", { n, territorio: nombreTerritorio() });
  $("#grafico").setAttribute("aria-label", traducir(vista === "dia" ? "Bloqueos diarios de los últimos {n} días · {territorio}" : "Bloqueos semanales de los últimos {n} días · {territorio}", { n, territorio: nombreTerritorio() }));

  $("#rango").textContent =
    ultimo ? `${diaMes.format(fecha(serie[0].fecha))} — ${diaMes.format(fecha(ultimo.fecha))}` : "—";
  const actualizado = calendario().at(-1);
  $("#pie-actualizado").textContent =
    actualizado ? traducir("Última actualización: {fecha}", { fecha: diaCompleto.format(fecha(actualizado.fecha)) }) : traducir("Fecha de actualización no disponible");
}

function pintarPanel() {
  const panel = $("#departamentos");
  panel.textContent = "";
  $("#sin-ubicacion").hidden = true;
  $("#panel-fecha").textContent = diaSeleccionado ? diaCompleto.format(fecha(diaSeleccionado)) : "—";
  if (!departamentales) {
    const mensaje = document.createElement("p");
    mensaje.className = "nota-vista";
    mensaje.textContent = traducir(errores.departamentos || "Cargando departamentos…");
    panel.append(mensaje);
    return;
  }
  const fila = filaDia();
  const totales = departamentos.map((d) => ({
    ...d, total: departamentales.reduce((suma, p) => suma + p[d.id], 0),
  })).sort((a, b) => b.total - a.total || a.nombre.localeCompare(b.nombre, "es"));
  const maximo = Math.max(1, ...totales.map((d) => d.total));
  totales.forEach((d) => {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "departamento";
    boton.classList.toggle("activo", territorio === d.id);
    boton.dataset.territorio = d.id;
    boton.setAttribute("aria-pressed", String(territorio === d.id));
    const hoy = fila ? entero.format(fila[d.id]) : "—";
    boton.setAttribute("aria-label", traducir("{nombre}: {hoy} puntos el día seleccionado, {total} puntos-día en 90 días", { nombre: d.nombre, hoy, total: entero.format(d.total) }));
    boton.innerHTML = `<span class="departamento-nombre">${d.nombre}</span>` +
      `<span class="departamento-valores"><b>${hoy}</b> / ${entero.format(d.total)}</span>` +
      `<span class="departamento-barra" aria-hidden="true"><span style="width:${d.total / maximo * 100}%"></span></span>`;
    panel.append(boton);
  });
  const sinDia = fila?.sin_ubicacion || 0;
  const sinTotal = departamentales.reduce((suma, p) => suma + p.sin_ubicacion, 0);
  if (sinDia > 0 || sinTotal > 0) {
    $("#sin-ubicacion").hidden = false;
    $("#sin-ubicacion").textContent = traducir("Sin ubicación válida: {dia} el día seleccionado, {total} en 90 días. Cuentan solo en el total nacional.", { dia: entero.format(sinDia), total: entero.format(sinTotal) });
  }
}

function pintarFecha() {
  const dias = calendario();
  const i = dias.findIndex((p) => p.fecha === diaSeleccionado);
  $("#mapa-fecha").textContent = diaSeleccionado ? diaCompleto.format(fecha(diaSeleccionado)) : traducir("Fecha no disponible");
  $("#dia-anterior").disabled = i <= 0;
  $("#dia-siguiente").disabled = i < 0 || i >= dias.length - 1;
}

function prepararMapa() {
  if (!window.L) {
    errores.mapa = "No fue posible cargar el mapa. Los demás datos siguen disponibles.";
    return;
  }
  mapa = L.map("mapa", {
    zoomSnap: .25, scrollWheelZoom: false, dragging: !L.Browser.mobile, tapHold: false,
    touchZoom: true, doubleClickZoom: !L.Browser.mobile,
  });
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a>", maxZoom: 18,
  }).addTo(mapa);
  mapa.zoomControl.setPosition("topleft");
  mapa.on("contextmenu", (e) => {
    e.originalEvent?.preventDefault();
    seleccionarTerritorio("bolivia");
  });
  actualizarZoom();
  capaPuntos = L.layerGroup().addTo(mapa);
  encuadrar();
}

function encuadrar(animado = false) {
  if (!mapa) return;
  let limitesVista = capaLimites?.getBounds();
  if (territorio !== "bolivia" && capaLimites) {
    capaLimites.eachLayer((capa) => {
      if (capa.feature.properties.id === territorio) limitesVista = capa.getBounds();
    });
  }
  const caja = limitesVista || [[-22.9, -69.7], [-9.6, -57.4]];
  if (animado && !matchMedia("(prefers-reduced-motion: reduce)").matches) mapa.flyToBounds(caja, { padding: [18, 18], duration: 1.4, easeLinearity: .15 });
  else mapa.fitBounds(caja, { padding: [18, 18], animate: false });
}

function resumirPuntos(datos) {
  const coordenadas = new Map();
  datos.forEach((p) => {
    const clave = `${p.latitud},${p.longitud}`;
    if (!coordenadas.has(clave)) coordenadas.set(clave, { ...p, dias: new Set(), primero: p.fecha, ultimo: p.fecha });
    const punto = coordenadas.get(clave);
    punto.dias.add(p.fecha);
    if (p.fecha < punto.primero) punto.primero = p.fecha;
    if (p.fecha > punto.ultimo) punto.ultimo = p.fecha;
  });
  return [...coordenadas.values()];
}

function contenidoPopup(p) {
  const caja = document.createElement("div");
  const seccion = document.createElement("strong");
  seccion.textContent = p.seccion;
  caja.append(seccion);
  const nombre = departamentos.find((d) => d.id === p.departamento)?.nombre || p.departamento;
  const lineas = modoMapa === "dia" ? [nombre, diaCompleto.format(fecha(p.fecha))] : [
    nombre, `${entero.format(p.dias.size)} ${traducir(p.dias.size === 1 ? "día bloqueado" : "días bloqueado")}`,
    traducir("Primer día: {fecha}", { fecha: diaCompleto.format(fecha(p.primero)) }),
    traducir("Último día: {fecha}", { fecha: diaCompleto.format(fecha(p.ultimo)) }),
  ];
  lineas.forEach((linea) => {
    const texto = document.createElement("div");
    texto.textContent = linea;
    caja.append(texto);
  });
  return caja;
}

function pintarMapa() {
  $("#mapa-titulo").textContent = traducir("Bloqueos · {territorio}", { territorio: nombreTerritorio() });
  $("#mapa").setAttribute("aria-label", traducir("Mapa de bloqueos · {territorio} · {periodo}", { territorio: nombreTerritorio(), periodo: modoMapa === "dia" ? diaSeleccionado : traducir("últimos 90 días") }));
  const aviso = $("#mapa-aviso");
  const texto = $("#mapa-aviso-texto");
  $("#ver-ventana").hidden = true;
  aviso.hidden = false;
  const fallos = [...new Set(Object.values(errores).map((error) => traducir(error)))];
  $("#mapa-error").textContent = fallos.join(" ");
  $("#mapa-error").hidden = fallos.length === 0;
  if (!mapa) {
    texto.textContent = traducir(errores.mapa || "Cargando mapa…");
    return;
  }
  const estilo = getComputedStyle(document.documentElement);
  const alerta = estilo.getPropertyValue("--alerta").trim();
  const tinta = estilo.getPropertyValue("--ink").trim();
  const fila = modoMapa === "dia"
    ? filaDia()
    : departamentales && Object.fromEntries(departamentos.map((d) => [
      d.id, departamentales.reduce((suma, p) => suma + p[d.id], 0),
    ]));
  const maximo = Math.max(1, ...departamentos.map((d) => fila?.[d.id] || 0));
  if (limites && !capaLimites) {
    capaLimites = L.geoJSON(limites, {
      onEachFeature: (feature, capa) => {
        capa.on("click", () => seleccionarTerritorio(feature.properties.id));
        capa.on("mouseover", () => {
          const base = estilosMapa.get(feature.properties.id) || {};
          capa.setStyle({ ...base, color: "#ffffff", weight: 2.6, opacity: 1, fillOpacity: Math.min(.85, (base.fillOpacity || 0) + .2) });
          capa.bringToFront();
        });
        capa.on("mouseout", () => {
          capa.setStyle(estilosMapa.get(feature.properties.id) || {});
          capaLimites.eachLayer((otra) => { if (otra.feature.properties.id === territorio) otra.bringToFront(); });
        });
      },
    }).addTo(mapa);
    encuadrar();
  }
  capaLimites?.eachLayer((capa) => {
    const { id, nombre } = capa.feature.properties;
    const valor = fila?.[id];
    const estilo = {
      color: tinta, weight: territorio === id ? 2.8 : .8,
      opacity: territorio === "bolivia" || territorio === id ? .8 : .35,
      fillColor: alerta, fillOpacity: valor > 0 ? .15 + .5 * valor / maximo : 0,
    };
    estilosMapa.set(id, estilo);
    capa.setStyle(estilo);
    const cuando = modoMapa === "dia" ? traducir("el {fecha}", { fecha: diaMes.format(fecha(diaSeleccionado)) }) : traducir("en 90 días");
    const unidad = traducir(modoMapa === "dia" ? (valor === 1 ? "punto" : "puntos") : (valor === 1 ? "punto-día" : "puntos-día"));
    const mensaje = `${nombre} · ${valor === undefined ? traducir("Datos no disponibles") : `${entero.format(valor)} ${unidad} ${cuando}`}`;
    if (capa.getTooltip()) capa.setTooltipContent(mensaje);
    else capa.bindTooltip(mensaje, { sticky: true });
    if (territorio === id) capa.bringToFront();
  });
  capaPuntos.clearLayers();
  $("#mapa-leyenda").textContent = traducir(modoMapa === "dia"
    ? "Relleno: bloqueos del día · Círculos: puntos bloqueados"
    : "Relleno: puntos-día en 90 días · Tamaño del círculo: días bloqueado");
  if (!puntos) {
    texto.textContent = traducir(errores.puntos || "Cargando puntos…");
    return;
  }
  if (!diaSeleccionado && modoMapa === "dia") {
    texto.textContent = traducir("Fecha no disponible. Selecciona la vista de 90 días para ver los puntos.");
    $("#ver-ventana").hidden = false;
    return;
  }
  const delTerritorio = puntos.filter((p) => territorio === "bolivia" || p.departamento === territorio);
  const visibles = modoMapa === "dia" ? delTerritorio.filter((p) => p.fecha === diaSeleccionado) : resumirPuntos(delTerritorio);
  visibles.forEach((p) => {
    const marcador = L.circleMarker([p.latitud, p.longitud], {
      radius: modoMapa === "dia" ? 6 : 3 + 1.4 * Math.sqrt(p.dias.size),
      color: modoMapa === "dia" ? alerta : "#ffffff", fillColor: alerta,
      fillOpacity: modoMapa === "dia" ? .78 : .6, weight: modoMapa === "dia" ? 1.5 : 1,
    }).bindPopup(contenidoPopup(p), { maxWidth: 260, closeButton: false }).addTo(capaPuntos);
    marcador.bindTooltip(departamentos.find((d) => d.id === p.departamento)?.nombre || p.departamento);
  });
  aviso.hidden = visibles.length > 0;
  if (!visibles.length) {
    texto.textContent = !delTerritorio.length || modoMapa === "ventana"
      ? traducir("Sin bloqueos en los últimos 90 días")
      : traducir("Sin bloqueos reportados el {fecha}", { fecha: diaMes.format(fecha(diaSeleccionado)) });
    $("#ver-ventana").hidden = !delTerritorio.length || modoMapa === "ventana";
  }
}

function cambiarModo(modo) {
  modoMapa = modo;
  document.querySelectorAll("#modo-mapa button").forEach((b) => {
    const activo = b.dataset.modo === modo;
    b.classList.toggle("activo", activo);
    b.setAttribute("aria-pressed", String(activo));
  });
  pintarMapa();
}

function svg(nombre, atributos = {}) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", nombre);
  Object.entries(atributos).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
}

function dibujar() {
  const lienzo = $("#grafico");
  const caja = $("#grafico-wrap");
  lienzo.textContent = "";
  if (!serie.length) return;

  const ancho = lienzo.clientWidth || caja.clientWidth || 700;
  const alto = lienzo.clientHeight || 340;
  lienzo.setAttribute("viewBox", `0 0 ${ancho} ${alto}`);

  const izq = 6;
  const der = 42;
  const arriba = 14;
  const abajo = 26;
  const datos = datosVista();
  const mayor = Math.max(1, ...datos.map((p) => p.bloqueos));
  const pasoEje = Math.max(1, Math.ceil(mayor / 4));
  const maximo = pasoEje * Math.ceil(mayor / pasoEje);
  const base = alto - abajo;

  const paso = (ancho - izq - der) / datos.length;
  const x = (i) => izq + paso * (i + 0.5);
  const y = (v) => base - (v / maximo) * (base - arriba);

  const estilo = getComputedStyle(document.documentElement);
  const acento = estilo.getPropertyValue("--acento").trim() || "#111111";
  const tenue = estilo.getPropertyValue("--ink-3").trim() || "#777777";
  const rejillaColor = estilo.getPropertyValue("--rejilla").trim() || "rgba(0,0,0,.08)";
  const ejeColor = estilo.getPropertyValue("--eje").trim() || "rgba(0,0,0,.22)";
  const guiaColor = estilo.getPropertyValue("--guia").trim() || "rgba(0,0,0,.3)";

  const rejilla = svg("g");
  const pasos = maximo / pasoEje;
  for (let k = 0; k <= pasos; k += 1) {
    const valor = pasoEje * k;
    const yy = y(valor);
    rejilla.append(svg("line", {
      x1: 0, x2: ancho - der + 4, y1: yy.toFixed(1), y2: yy.toFixed(1),
      stroke: rejillaColor, "stroke-width": 1,
    }));
    const etiqueta = svg("text", {
      x: ancho - der + 9, y: (yy + 3.6).toFixed(1),
      fill: tenue, "font-size": 11,
    });
    etiqueta.textContent = entero.format(Math.round(valor));
    rejilla.append(etiqueta);
  }
  lienzo.append(rejilla);

  const barras = svg("g");
  const seleccionado = vista === "dia" ? datos.findIndex((p) => p.fecha === diaSeleccionado) : -1;
  if (seleccionado >= 0) {
    lienzo.append(svg("rect", {
      x: x(seleccionado) - paso / 2, y: arriba - 4, width: paso, height: base - arriba + 4,
      fill: estilo.getPropertyValue("--acento-soft").trim(), "pointer-events": "none",
    }));
    lienzo.append(svg("line", {
      id: "dia-elegido", x1: x(seleccionado), x2: x(seleccionado), y1: arriba - 4, y2: base,
      stroke: estilo.getPropertyValue("--alerta").trim(), "stroke-width": 1.5,
      "pointer-events": "none",
    }));
  }
  const grosor = Math.max(2, Math.min(paso * 0.66, 34));
  datos.forEach((p, i) => {
    if (p.bloqueos <= 0) return;
    const yy = y(p.bloqueos);
    barras.append(svg("rect", {
      x: (x(i) - grosor / 2).toFixed(1), y: yy.toFixed(1),
      width: grosor.toFixed(1), height: Math.max(1.5, base - yy).toFixed(1),
      rx: Math.min(3, grosor / 4), fill: acento,
      opacity: p.completa === false ? .32 : 1,
    }));
  });
  lienzo.append(barras);

  lienzo.append(svg("line", {
    x1: 0, x2: ancho - der + 4, y1: base, y2: base,
    stroke: ejeColor, "stroke-width": 1,
  }));

  const eje = svg("g");
  const marcas = Math.min(vista === "semana" ? 6 : 5, datos.length);
  for (let k = 0; k < marcas; k += 1) {
    const i = Math.round((k / Math.max(marcas - 1, 1)) * (datos.length - 1));
    const t = svg("text", {
      x: x(i).toFixed(1), y: alto - 7, fill: tenue, "font-size": 11,
      "text-anchor": k === 0 ? "start" : k === marcas - 1 ? "end" : "middle",
    });
    t.textContent = diaMes.format(fecha(datos[i].fecha));
    eje.append(t);
  }
  lienzo.append(eje);

  const guia = svg("line", {
    id: "guia", y1: arriba - 4, y2: base,
    stroke: guiaColor, "stroke-width": 1, "stroke-dasharray": "3 3",
    visibility: "hidden",
  });
  lienzo.append(guia);

  lienzo.__geo = { x, y, base, ancho, der };
  lienzo.__datos = datos;
}

function indiceEvento(evento) {
  const lienzo = $("#grafico");
  const geo = lienzo.__geo;
  const datos = lienzo.__datos;
  if (!serie.length || !geo || !datos || !datos.length) return -1;

  const caja = lienzo.getBoundingClientRect();
  const px = evento.clientX - caja.left;
  let i = 0;
  let mejor = Infinity;
  datos.forEach((_, k) => {
    const d = Math.abs(geo.x(k) - px);
    if (d < mejor) { mejor = d; i = k; }
  });
  return i;
}

function mostrarTip(evento) {
  const lienzo = $("#grafico");
  const geo = lienzo.__geo;
  const datos = lienzo.__datos;
  const i = indiceEvento(evento);
  if (i < 0) return;

  const punto = datos[i];
  const guia = document.getElementById("guia");
  if (guia) {
    guia.setAttribute("x1", geo.x(i).toFixed(1));
    guia.setAttribute("x2", geo.x(i).toFixed(1));
    guia.setAttribute("visibility", "visible");
  }

  const tip = $("#tip");
  if (vista === "semana") {
    const rotulo = `${diaMes.format(fecha(punto.fecha))} — ${diaMes.format(fecha(punto.hasta))}`;
    const parcial = punto.completa ? "" : traducir(" · semana parcial ({n} d)", { n: punto.dias });
    tip.innerHTML =
      traducir("Semana del {rango}{parcial}", { rango: rotulo, parcial }) +
      `<b>${traducir("{n} en la semana", { n: entero.format(punto.bloqueos) })}</b>` +
      `<span class="detalle">${traducir("máximo {maximo} en un día · {dias} de {n} días con bloqueo", { maximo: entero.format(punto.maximo), dias: punto.diasConBloqueo, n: punto.dias })}</span>`;
  } else {
    tip.innerHTML =
      `${diaCompleto.format(fecha(punto.fecha))}<b>${entero.format(punto.bloqueos)} ` +
      `${traducir(punto.bloqueos === 1 ? "punto bloqueado" : "puntos bloqueados")}</b>`;
  }
  tip.hidden = false;

  const anchoCaja = $("#grafico-wrap").clientWidth;
  const anchoTip = tip.offsetWidth;
  const izquierda = geo.x(i) > anchoCaja / 2 ? geo.x(i) - anchoTip - 12 : geo.x(i) + 12;
  tip.style.left = `${Math.max(4, Math.min(izquierda, anchoCaja - anchoTip - 4))}px`;
  tip.style.top = `${Math.max(4, Math.min(geo.y(punto.bloqueos) - 46, geo.base - 40))}px`;
}

function ocultarTip() {
  $("#tip").hidden = true;
  const guia = document.getElementById("guia");
  if (guia) guia.setAttribute("visibility", "hidden");
}

async function iniciar() {
  try {
    prepararMapa();
  } catch {
    errores.mapa = "No fue posible iniciar el mapa.";
  }
  actualizar();

  const lienzo = $("#grafico");
  lienzo.addEventListener("pointermove", mostrarTip);
  lienzo.addEventListener("pointerdown", mostrarTip);
  lienzo.addEventListener("pointerleave", ocultarTip);
  lienzo.addEventListener("pointerup", ocultarTip);
  lienzo.addEventListener("contextmenu", (e) => e.preventDefault());
  lienzo.addEventListener("click", (evento) => {
    if (vista !== "dia") return;
    const i = indiceEvento(evento);
    if (i >= 0) seleccionarDia(lienzo.__datos[i].fecha);
  });
  lienzo.addEventListener("keydown", (evento) => {
    if (vista !== "dia" || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(evento.key)) return;
    evento.preventDefault();
    if (evento.key === "Home") seleccionarDia(calendario()[0]?.fecha);
    else if (evento.key === "End") seleccionarDia(calendario().at(-1)?.fecha);
    else moverDia(evento.key === "ArrowLeft" ? -1 : 1);
  });

  $("#territorios").addEventListener("click", (evento) => {
    const boton = evento.target.closest("button[data-territorio]");
    if (boton) seleccionarTerritorio(boton.dataset.territorio);
  });
  $("#departamentos").addEventListener("click", (evento) => {
    const boton = evento.target.closest("button[data-territorio]");
    if (boton) seleccionarTerritorio(boton.dataset.territorio);
  });
  $("#modo-mapa").addEventListener("click", (evento) => {
    const boton = evento.target.closest("button[data-modo]");
    if (boton) cambiarModo(boton.dataset.modo);
  });
  $("#ver-ventana").addEventListener("click", () => cambiarModo("ventana"));
  $("#dia-anterior").addEventListener("click", () => moverDia(-1));
  $("#dia-siguiente").addEventListener("click", () => moverDia(1));

  $("#vista").addEventListener("click", (evento) => {
    const boton = evento.target.closest("button[data-vista]");
    if (!boton || boton.dataset.vista === vista) return;
    vista = boton.dataset.vista;
    document.querySelectorAll("#vista button").forEach((b) => {
      const activo = b.dataset.vista === vista;
      b.classList.toggle("activo", activo);
      b.setAttribute("aria-pressed", String(activo));
    });
    $("#nota-vista").hidden = vista !== "semana";
    $("#nota-dia").hidden = vista !== "dia";
    lienzo.setAttribute("aria-describedby", vista === "dia" ? "nota-dia" : "nota-vista");
    pintarCifras();
    ocultarTip();
    dibujar();
  });

  let temporizador = 0;
  window.addEventListener("resize", () => {
    window.clearTimeout(temporizador);
    temporizador = window.setTimeout(() => {
      dibujar();
      mapa?.invalidateSize();
    }, 160);
  });

  await Promise.allSettled([
    cargarCSV("ultimos_90_dias.csv", ["fecha", "bloqueos"]).then((filas) => {
      if (!filas.length) throw new Error();
      nacional = filas.map((p) => ({ fecha: p.fecha, bloqueos: numero(p.bloqueos) }));
    }).catch(() => {
      errores.nacional = "No fue posible cargar la serie nacional.";
    }).then(actualizar),
    cargarCSV("departamentos_90_dias.csv", ["fecha", ...departamentos.map((d) => d.id), "sin_ubicacion"]).then((filas) => {
      if (!filas.length) throw new Error();
      departamentales = filas.map((p) => Object.fromEntries(Object.entries(p).map(([k, v]) => [k, k === "fecha" ? v : numero(v)])));
    }).catch(() => {
      errores.departamentos = "No fue posible cargar los datos por departamento.";
    }).then(actualizar),
    cargarCSV("puntos_90_dias.csv", ["fecha", "latitud", "longitud", "departamento", "seccion"]).then((filas) => {
      puntos = filas.map((p) => ({ ...p, latitud: numero(p.latitud), longitud: numero(p.longitud) }));
    }).catch(() => {
      errores.puntos = "No fue posible cargar los puntos de bloqueo.";
    }).then(actualizar),
    fetch(`data/departamentos.geojson?v=${Date.now()}`, { cache: "no-store" }).then((respuesta) => {
      if (!respuesta.ok) throw new Error();
      return respuesta.json();
    }).then((datos) => {
      if (datos.type !== "FeatureCollection" || !datos.features?.length) throw new Error();
      limites = datos;
    }).catch(() => {
      errores.limites = "No fue posible cargar los límites departamentales.";
    }).then(actualizar),
  ]);
}

aplicarIdioma();
$("#idioma").addEventListener("click", (evento) => {
  const boton = evento.target.closest("button[data-l]");
  if (boton) cambiarIdioma(boton.dataset.l);
});
iniciar();
