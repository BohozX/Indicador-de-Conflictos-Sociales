/* Indicador de Conflictos Sociales - Bolivia
   Solo dibuja. Los valores se muestran tal como los publica la serie: aqui no
   se recalcula, interpola ni completa ningun dia. */

const $ = (s) => document.querySelector(s);

const entero = new Intl.NumberFormat("es-BO", { maximumFractionDigits: 0 });
const conDecimal = new Intl.NumberFormat("es-BO", {
  minimumFractionDigits: 1, maximumFractionDigits: 1,
});
const diaMes = new Intl.DateTimeFormat("es-BO", {
  timeZone: "UTC", day: "2-digit", month: "short",
});
const diaCompleto = new Intl.DateTimeFormat("es-BO", {
  timeZone: "UTC", weekday: "long", day: "2-digit", month: "long", year: "numeric",
});

let serie = [];
let vista = "dia";

function fecha(iso) {
  return new Date(`${iso}T00:00:00Z`);
}

/* Agrupa en semanas de lunes a domingo. El valor de la barra es la suma de los
   puntos bloqueados de cada dia de la semana. No se completa ningun dia: una
   semana incompleta suma solo los dias observados y se dibuja atenuada. */
function porSemana(datos) {
  const semanas = new Map();
  datos.forEach((p) => {
    const d = fecha(p.fecha);
    const diaSemana = (d.getUTCDay() + 6) % 7;          // 0 = lunes
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

async function cargar() {
  const respuesta = await fetch(`data/ultimos_90_dias.csv?v=${Date.now()}`, { cache: "no-store" });
  if (!respuesta.ok) throw new Error(`no se pudo leer la serie (${respuesta.status})`);

  const lineas = (await respuesta.text()).trim().split(/\r?\n/);
  const cabecera = lineas[0].split(",").map((c) => c.trim());
  if (cabecera[0] !== "fecha" || cabecera[1] !== "bloqueos") {
    throw new Error("el archivo publico no tiene el formato esperado");
  }

  serie = lineas.slice(1).map((l) => {
    const [f, b] = l.split(",");
    return { fecha: f.trim(), bloqueos: Number(b) };
  }).filter((p) => p.fecha && Number.isFinite(p.bloqueos));

  if (!serie.length) throw new Error("la serie llego vacia");
}

function pintarCifras() {
  const ultimo = serie.at(-1);
  const valores = serie.map((p) => p.bloqueos);
  const conBloqueo = valores.filter((v) => v > 0).length;
  const promedio = valores.reduce((a, b) => a + b, 0) / valores.length;

  $("#c-hoy").textContent = entero.format(ultimo.bloqueos);
  $("#c-hoy-fecha").textContent = diaMes.format(fecha(ultimo.fecha));
  $("#c-max").textContent = entero.format(Math.max(...valores));
  $("#c-dias").textContent = entero.format(conBloqueo);
  $("#c-prom").textContent = conDecimal.format(promedio);

  $("#rango").textContent =
    `${diaMes.format(fecha(serie[0].fecha))} — ${diaMes.format(fecha(ultimo.fecha))}`;
  $("#pie-actualizado").textContent =
    `Última actualización: ${diaCompleto.format(fecha(ultimo.fecha))}`;
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
  const acento = estilo.getPropertyValue("--acento").trim() || "#d6a860";
  const tenue = estilo.getPropertyValue("--ink-3").trim() || "#7d735f";

  // niveles de referencia
  const rejilla = svg("g");
  const pasos = 4;
  for (let k = 0; k <= pasos; k += 1) {
    const valor = (maximo * k) / pasos;
    const yy = y(valor);
    rejilla.append(svg("line", {
      x1: 0, x2: ancho - der + 4, y1: yy.toFixed(1), y2: yy.toFixed(1),
      stroke: "rgba(214,168,96,.08)", "stroke-width": 1,
    }));
    const etiqueta = svg("text", {
      x: ancho - der + 9, y: (yy + 3.6).toFixed(1),
      fill: tenue, "font-size": 11,
    });
    etiqueta.textContent = entero.format(Math.round(valor));
    rejilla.append(etiqueta);
  }
  lienzo.append(rejilla);

  // una barra por dia o por semana, segun la vista
  const barras = svg("g");
  const grosor = Math.max(2, Math.min(paso * 0.66, 34));
  datos.forEach((p, i) => {
    if (p.bloqueos <= 0) return;
    const yy = y(p.bloqueos);
    barras.append(svg("rect", {
      x: (x(i) - grosor / 2).toFixed(1), y: yy.toFixed(1),
      width: grosor.toFixed(1), height: Math.max(1.5, base - yy).toFixed(1),
      rx: Math.min(3, grosor / 4), fill: acento,
      opacity: p.completa === false ? .45 : .88,
    }));
  });
  lienzo.append(barras);

  lienzo.append(svg("line", {
    x1: 0, x2: ancho - der + 4, y1: base, y2: base,
    stroke: "rgba(214,168,96,.2)", "stroke-width": 1,
  }));

  // eje de fechas
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
    stroke: "rgba(242,236,225,.25)", "stroke-width": 1, "stroke-dasharray": "3 3",
    visibility: "hidden",
  });
  lienzo.append(guia);

  lienzo.__geo = { x, y, base, ancho, der };
  lienzo.__datos = datos;
}

function mostrarTip(evento) {
  const lienzo = $("#grafico");
  const geo = lienzo.__geo;
  const datos = lienzo.__datos;
  if (!geo || !datos || !datos.length) return;

  const caja = lienzo.getBoundingClientRect();
  const px = evento.clientX - caja.left;
  let i = 0;
  let mejor = Infinity;
  datos.forEach((_, k) => {
    const d = Math.abs(geo.x(k) - px);
    if (d < mejor) { mejor = d; i = k; }
  });

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
    await cargar();
  } catch (error) {
    mostrarError(error.message);
    return;
  }
  pintarCifras();
  dibujar();

  const lienzo = $("#grafico");
  lienzo.addEventListener("pointermove", mostrarTip);
  lienzo.addEventListener("pointerdown", mostrarTip);
  lienzo.addEventListener("pointerleave", ocultarTip);
  lienzo.addEventListener("pointerup", ocultarTip);
  lienzo.addEventListener("contextmenu", (e) => e.preventDefault());

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
    ocultarTip();
    dibujar();
  });

  let temporizador = 0;
  window.addEventListener("resize", () => {
    window.clearTimeout(temporizador);
    temporizador = window.setTimeout(dibujar, 160);
  });
}

iniciar();
