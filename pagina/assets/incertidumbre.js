(() => {
  const URL_RESUMEN = "https://raw.githubusercontent.com/BohozX/Indices-de-Incertidumbre/main/resumen.json";
  let entero;
  let corta;
  let larga;
  let mesAnio;
  function prepararFormatos() {
    entero = new Intl.NumberFormat(configuracionRegional(), { maximumFractionDigits: 0 });
    corta = new Intl.DateTimeFormat(configuracionRegional(), { timeZone: "UTC", day: "numeric", month: "short" });
    larga = new Intl.DateTimeFormat(configuracionRegional(), { timeZone: "UTC", day: "numeric", month: "long", year: "numeric" });
    mesAnio = new Intl.DateTimeFormat(configuracionRegional(), { timeZone: "UTC", month: "short", year: "2-digit" });
  }
  prepararFormatos();
  const dia = (iso) => new Date(`${iso}T00:00:00Z`);
  const $ = (s) => document.querySelector(s);
  const poner = (k, v) => document.querySelectorAll(`[data-idi="${k}"]`).forEach((el) => { el.textContent = v; });
  const animar = (el, v) => {
    if (!el) return;
    if (typeof contar === "function") contar(el, Number.isFinite(v) ? v : NaN);
    else el.textContent = Number.isFinite(v) ? entero.format(v) : "—";
  };
  const cifra = (k, v) => document.querySelectorAll(`[data-idi="${k}"]`).forEach((el) => animar(el, v));
  const NOMBRES = { "La Razon": "La Razón", "Vision 360": "Visión 360", "Opinion": "Opinión" };
  const nombre = (f) => NOMBRES[f] || f;
  const limpio = (t) => String(t).replace(/[<>&"]/g, (x) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[x]));

  function serie(porDia) {
    const svg = $("#idi-serie");
    const fechas = Object.keys(porDia).sort();
    if (!fechas.length) return;
    const W = svg.clientWidth || svg.parentNode.clientWidth, H = svg.clientHeight || 260;
    const m = { i: 4, d: 46, ar: 10, ab: 26 };
    const mayor = Math.max(1, ...fechas.map((f) => porDia[f]));
    const bruto = mayor / 4, mag = 10 ** Math.floor(Math.log10(bruto));
    const pasoEje = [1, 2, 2.5, 5, 10].map((k) => k * mag).find((v) => v >= bruto);
    const max = pasoEje * Math.ceil(mayor / pasoEje);
    const paso = (W - m.i - m.d) / fechas.length;
    const y = (v) => H - m.ab - (v / max) * (H - m.ar - m.ab);
    const grosor = Math.max(1, Math.min(paso * .72, 14));
    let s = `<defs><linearGradient id="idi-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffcf8a"/><stop offset="1" stop-color="#b8621a"/></linearGradient></defs>`;
    for (let k = 0; k <= max / pasoEje; k += 1) {
      const v = pasoEje * k, yy = y(v);
      s += `<line x1="${m.i}" x2="${W - m.d + 4}" y1="${yy.toFixed(1)}" y2="${yy.toFixed(1)}" stroke="rgba(255,255,255,${k ? .08 : .45})"/>`;
      s += `<text x="${W - m.d + 10}" y="${(yy + 3.5).toFixed(1)}" font-size="10.5" fill="#b3b4ba">${entero.format(Math.round(v))}</text>`;
    }
    fechas.forEach((f, i) => {
      const x = m.i + paso * (i + .5), yy = y(porDia[f]);
      s += `<rect data-i="${i}" x="${(x - grosor / 2).toFixed(1)}" y="${yy.toFixed(1)}" width="${grosor.toFixed(1)}" height="${Math.max(1, H - m.ab - yy).toFixed(1)}" rx="${Math.min(2, grosor / 3)}" fill="url(#idi-g)"/>`;
    });
    const lunes = fechas.map((f, i) => [f, i]).filter(([f]) => dia(f).getUTCDay() === 1);
    let ultimo = -Infinity;
    lunes.forEach(([f, i]) => {
      const x = m.i + paso * (i + .5);
      if (x - ultimo < 56 || x > W - m.d - 20) return;
      ultimo = x;
      s += `<line x1="${x.toFixed(1)}" x2="${x.toFixed(1)}" y1="${H - m.ab}" y2="${H - m.ab + 4}" stroke="rgba(255,255,255,.45)"/>`;
      s += `<text x="${x.toFixed(1)}" y="${H - 7}" font-size="10.5" fill="#b3b4ba" text-anchor="middle">${corta.format(dia(f))}</text>`;
    });
    s += `<line class="guia" y1="${m.ar}" y2="${H - m.ab}" stroke="rgba(255,255,255,.5)" stroke-dasharray="3 3" visibility="hidden"/>`;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.innerHTML = s;
    const tip = $("#tip-global"), guia = svg.querySelector(".guia");
    svg.onpointermove = (e) => {
      const r = svg.getBoundingClientRect();
      const i = Math.max(0, Math.min(fechas.length - 1, Math.floor((e.clientX - r.left - m.i) / paso)));
      const x = m.i + paso * (i + .5);
      guia.setAttribute("x1", x); guia.setAttribute("x2", x); guia.setAttribute("visibility", "visible");
      tip.innerHTML = `${larga.format(dia(fechas[i]))} · <b>${entero.format(porDia[fechas[i]])}</b> ${traducir("noticias")}`;
      tip.style.opacity = 1;
      tip.style.left = `${Math.min(e.clientX + 14, innerWidth - tip.offsetWidth - 10)}px`;
      tip.style.top = `${Math.max(8, e.clientY - tip.offsetHeight - 12)}px`;
    };
    svg.onpointerleave = () => { tip.style.opacity = 0; guia.setAttribute("visibility", "hidden"); };
  }

  function medios(porMedio) {
    const filas = Object.entries(porMedio).sort((a, b) => b[1] - a[1]);
    const max = Math.max(1, ...filas.map((f) => f[1]));
    $("#idi-medios").innerHTML = filas.map(([f, n], k) => `<li><span class="n">${limpio(nombre(f))}</span><span class="v">${entero.format(n)}</span>` +
      `<span class="b"><i style="width:${(n / max * 100).toFixed(1)}%;animation-delay:${(k * .05).toFixed(2)}s"></i></span></li>`).join("");
  }

  function titulares(lista) {
    if (!lista.length) { $("#titulares").hidden = true; return; }
    const uno = lista.map((t) => `<a class="titular" href="${limpio(t.url)}" target="_blank" rel="noopener noreferrer"><b>${limpio(nombre(t.fuente))}</b>${limpio(t.titulo)}</a>`).join("");
    $("#titulares-pista").innerHTML = uno + uno;
  }

  let datos = null;
  let errorResumen = false;

  function pintarResumen(d) {
    const porDia = {}, porMedio7 = d.ultimos_7_dias?.por_medio || {}, medios7 = d.ultimos_7_dias?.por_dia || {};
    const todosMedios = new Set(Object.keys(porMedio7));
    Object.values(d.por_anio || {}).forEach((a) => {
      Object.entries(a.por_dia || {}).forEach(([f, n]) => { porDia[f] = (porDia[f] || 0) + n; });
      Object.keys(a.por_medio || {}).forEach((f) => todosMedios.add(f));
    });
    const fechas = Object.keys(porDia).sort();
    const total = Object.values(porDia).reduce((a, b) => a + b, 0);
    const semana = Object.values(medios7).reduce((a, b) => a + b, 0);
    const d7 = Object.keys(medios7).sort();
    cifra("total", total);
    poner("desde", fechas.length ? traducir("desde el {fecha}", { fecha: larga.format(dia(fechas[0])) }) : "");
    cifra("semana", semana);
    poner("semana-rango", d7.length ? `${corta.format(dia(d7[0]))} – ${corta.format(dia(d7.at(-1)))}` : "");
    cifra("medios", todosMedios.size);
    cifra("nuevas", d.nuevas);
    poner("actualizado", d.actualizado ? `${corta.format(dia(d.actualizado.slice(0, 10)))} · ${d.actualizado.slice(11, 16)}` : "");
    poner("serie-rango", fechas.length ? `${larga.format(dia(fechas[0]))} – ${larga.format(dia(fechas.at(-1)))}` : "");
    const hero = $("#c-noticias");
    if (hero) { animar(hero, total); $("#c-noticias-desde").textContent = fechas.length ? traducir("desde {fecha}", { fecha: corta.format(dia(fechas[0])) }) : ""; }
    serie(porDia);
    medios(porMedio7);
    titulares(d.titulares || []);
  }

  addEventListener("idiomachange", () => {
    prepararFormatos();
    $("#tip-global").style.opacity = 0;
    if (datos) pintarResumen(datos);
    else if (errorResumen) $("#idi-fuente").textContent = traducir("No fue posible cargar el resumen de noticias.");
  });

  fetch(`${URL_RESUMEN}?v=${Date.now()}`, { cache: "no-store" })
    .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then((d) => {
      datos = d;
      pintarResumen(d);
    })
    .catch(() => {
      errorResumen = true;
      poner("total", "—");
      $("#idi-fuente").textContent = traducir("No fue posible cargar el resumen de noticias.");
    });

  let espera = 0;
  addEventListener("resize", () => {
    clearTimeout(espera);
    espera = setTimeout(() => {
      if (!datos) return;
      const porDia = {};
      Object.values(datos.por_anio || {}).forEach((a) => Object.entries(a.por_dia || {}).forEach(([f, n]) => { porDia[f] = (porDia[f] || 0) + n; }));
      serie(porDia);
    }, 160);
  });
})();
