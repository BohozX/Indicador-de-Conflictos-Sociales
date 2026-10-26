const $ = (s) => document.querySelector(s);

const entero = new Intl.NumberFormat("es-BO", { maximumFractionDigits: 0 });
const diaMes = new Intl.DateTimeFormat("es-BO", {
  timeZone: "UTC", day: "2-digit", month: "short",
});
const diaCompleto = new Intl.DateTimeFormat("es-BO", {
  timeZone: "UTC", weekday: "long", day: "2-digit", month: "long", year: "numeric",
});

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
  $("#estado-detalle").textContent = detalle;
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
  if (comillas) throw new Error("El CSV tiene comillas sin cerrar.");
  fila.push(campo);
  if (fila.some((v) => v !== "")) filas.push(fila);
  const cabecera = filas.shift() || [];
  if (filas.some((f) => f.length !== cabecera.length)) throw new Error("El CSV tiene filas incompletas.");
  return { cabecera, filas: filas.map((f) => Object.fromEntries(cabecera.map((c, i) => [c, f[i]]))) };
}

async function cargarCSV(archivo, columnas) {
  const respuesta = await fetch(`data/${archivo}?v=${Date.now()}`, { cache: "no-store" });
  if (!respuesta.ok) throw new Error("No fue posible cargar el archivo.");
  const datos = leerCSV(await respuesta.text());
  if (columnas.some((c) => !datos.cabecera.includes(c))) throw new Error("El archivo no tiene el formato esperado.");
  return datos.filas;
}

function numero(valor) {
  if (valor === "" || !Number.isFinite(Number(valor))) throw new Error("El archivo contiene un valor no válido.");
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

function seleccionarTerritorio(id) {
  if (id !== "bolivia" && !departamentos.some((d) => d.id === id)) return;
  territorio = id;
  document.querySelectorAll("#territorios button").forEach((b) => {
    const activo = b.dataset.territorio === territorio;
    b.classList.toggle("activo", activo);
    b.setAttribute("aria-pressed", String(activo));
  });
  actualizar();
  encuadrar();
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

function pintarCifras() {
  const ultimo = serie.at(-1);
  const valores = serie.map((p) => p.bloqueos);
  const conBloqueo = valores.filter((v) => v > 0).length;

  $("#r-hoy").textContent = `Bloqueos hoy · ${nombreTerritorio()}`;
  $("#r-con-bloqueo").textContent = `Días con bloqueo · ${nombreTerritorio()}`;
  $("#c-hoy").textContent = ultimo ? entero.format(ultimo.bloqueos) : "—";
  $("#c-hoy-fecha").textContent = ultimo ? diaMes.format(fecha(ultimo.fecha)) : "Datos no disponibles";
  $("#c-max").textContent = ultimo ? entero.format(Math.max(...valores)) : "—";
  $("#c-dias").textContent = ultimo ? entero.format(conBloqueo) : "—";

  const n = serie.length || 90;
  $("#r-max").textContent = `Máximo en ${n} días · ${nombreTerritorio()}`;
  $("#r-dias").textContent = `de los últimos ${n}`;
  $("#r-titulo").textContent = `Últimos ${n} días · ${nombreTerritorio()}`;
  $("#grafico").setAttribute("aria-label", `Bloqueos ${vista === "dia" ? "diarios" : "semanales"} de los últimos ${n} días · ${nombreTerritorio()}`);

  $("#rango").textContent =
    ultimo ? `${diaMes.format(fecha(serie[0].fecha))} — ${diaMes.format(fecha(ultimo.fecha))}` : "—";
  const actualizado = calendario().at(-1);
  $("#pie-actualizado").textContent =
    actualizado ? `Última actualización: ${diaCompleto.format(fecha(actualizado.fecha))}` : "Fecha de actualización no disponible";
}

function pintarPanel() {
  const panel = $("#departamentos");
  panel.textContent = "";
  $("#sin-ubicacion").hidden = true;
  $("#panel-fecha").textContent = diaSeleccionado ? diaCompleto.format(fecha(diaSeleccionado)) : "—";
  if (!departamentales) {
    const mensaje = document.createElement("p");
    mensaje.className = "nota-vista";
    mensaje.textContent = errores.departamentos || "Cargando departamentos…";
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
    boton.setAttribute("aria-label", `${d.nombre}: ${hoy} puntos el día seleccionado, ${entero.format(d.total)} puntos-día en 90 días`);
    boton.innerHTML = `<span class="departamento-nombre">${d.nombre}</span>` +
      `<span class="departamento-valores"><b>${hoy}</b> / ${entero.format(d.total)}</span>` +
      `<span class="departamento-barra" aria-hidden="true"><span style="width:${d.total / maximo * 100}%"></span></span>`;
    panel.append(boton);
  });
  const sinDia = fila?.sin_ubicacion || 0;
  const sinTotal = departamentales.reduce((suma, p) => suma + p.sin_ubicacion, 0);
  if (sinDia > 0 || sinTotal > 0) {
    $("#sin-ubicacion").hidden = false;
    $("#sin-ubicacion").textContent = `Sin ubicación válida: ${entero.format(sinDia)} el día seleccionado, ${entero.format(sinTotal)} en 90 días. Cuentan solo en el total nacional.`;
  }
}

function pintarFecha() {
  const dias = calendario();
  const i = dias.findIndex((p) => p.fecha === diaSeleccionado);
  $("#mapa-fecha").textContent = diaSeleccionado ? diaCompleto.format(fecha(diaSeleccionado)) : "Fecha no disponible";
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
  const controles = $("#mapa").querySelectorAll(".leaflet-control-zoom a");
  controles.forEach((b, i) => {
    const texto = i === 0 ? "Acercar" : "Alejar";
    b.setAttribute("title", texto);
    b.setAttribute("aria-label", texto);
  });
  capaPuntos = L.layerGroup().addTo(mapa);
  encuadrar();
}

function encuadrar() {
  if (!mapa) return;
  let limitesVista = capaLimites?.getBounds();
  if (territorio !== "bolivia" && capaLimites) {
    capaLimites.eachLayer((capa) => {
      if (capa.feature.properties.id === territorio) limitesVista = capa.getBounds();
    });
  }
  mapa.fitBounds(limitesVista || [[-22.9, -69.7], [-9.6, -57.4]], { padding: [18, 18], animate: false });
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
    nombre, `${entero.format(p.dias.size)} ${p.dias.size === 1 ? "día bloqueado" : "días bloqueado"}`,
    `Primer día: ${diaCompleto.format(fecha(p.primero))}`,
    `Último día: ${diaCompleto.format(fecha(p.ultimo))}`,
  ];
  lineas.forEach((linea) => {
    const texto = document.createElement("div");
    texto.textContent = linea;
    caja.append(texto);
  });
  return caja;
}

function pintarMapa() {
  $("#mapa-titulo").textContent = `Bloqueos · ${nombreTerritorio()}`;
  $("#mapa").setAttribute("aria-label", `Mapa de bloqueos · ${nombreTerritorio()} · ${modoMapa === "dia" ? diaSeleccionado : "últimos 90 días"}`);
  const aviso = $("#mapa-aviso");
  const texto = $("#mapa-aviso-texto");
  $("#ver-ventana").hidden = true;
  aviso.hidden = false;
  const fallos = [...new Set(Object.values(errores))];
  $("#mapa-error").textContent = fallos.join(" ");
  $("#mapa-error").hidden = fallos.length === 0;
  if (!mapa) {
    texto.textContent = errores.mapa || "Cargando mapa…";
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
      },
    }).addTo(mapa);
    encuadrar();
  }
  capaLimites?.eachLayer((capa) => {
    const { id, nombre } = capa.feature.properties;
    const valor = fila?.[id];
    capa.setStyle({
      color: tinta, weight: territorio === id ? 2.8 : .8,
      opacity: territorio === "bolivia" || territorio === id ? .8 : .35,
      fillColor: alerta, fillOpacity: valor > 0 ? .15 + .5 * valor / maximo : 0,
    });
    const cuando = modoMapa === "dia" ? `el ${diaMes.format(fecha(diaSeleccionado))}` : "en 90 días";
    const unidad = modoMapa === "dia" ? (valor === 1 ? "punto" : "puntos") : (valor === 1 ? "punto-día" : "puntos-día");
    const mensaje = `${nombre} · ${valor === undefined ? "Datos no disponibles" : `${entero.format(valor)} ${unidad} ${cuando}`}`;
    if (capa.getTooltip()) capa.setTooltipContent(mensaje);
    else capa.bindTooltip(mensaje, { sticky: true });
    if (territorio === id) capa.bringToFront();
  });
  capaPuntos.clearLayers();
  $("#mapa-leyenda").textContent = modoMapa === "dia"
    ? "Relleno: bloqueos del día · Círculos: puntos bloqueados"
    : "Relleno: puntos-día en 90 días · Tamaño del círculo: días bloqueado";
  if (!puntos) {
    texto.textContent = errores.puntos || "Cargando puntos…";
    return;
  }
  if (!diaSeleccionado && modoMapa === "dia") {
    texto.textContent = "Fecha no disponible. Selecciona la vista de 90 días para ver los puntos.";
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
      ? "Sin bloqueos en los últimos 90 días"
      : `Sin bloqueos reportados el ${diaMes.format(fecha(diaSeleccionado))}`;
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
  const maximo = Math.max(1, ...datos.map((p) => p.bloqueos));
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
  const pasos = 4;
  for (let k = 0; k <= pasos; k += 1) {
    const valor = (maximo * k) / pasos;
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
    const parcial = punto.completa ? "" : ` · semana parcial (${punto.dias} d)`;
    tip.innerHTML =
      `Semana del ${rotulo}${parcial}` +
      `<b>${entero.format(punto.bloqueos)} en la semana</b>` +
      `<span class="detalle">máximo ${entero.format(punto.maximo)} en un día · ` +
      `${punto.diasConBloqueo} de ${punto.dias} días con bloqueo</span>`;
  } else {
    tip.innerHTML =
      `${diaCompleto.format(fecha(punto.fecha))}<b>${entero.format(punto.bloqueos)} ` +
      `${punto.bloqueos === 1 ? "punto bloqueado" : "puntos bloqueados"}</b>`;
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

iniciar();
