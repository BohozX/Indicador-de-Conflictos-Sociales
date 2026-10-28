(() => {
  const lienzo = document.getElementById("portada-rutas");
  const zona = document.getElementById("portada");
  if (!lienzo || !zona || !lienzo.getContext) return;
  const c = lienzo.getContext("2d");
  const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const CIUDADES = {
    desaguadero: [-69.04, -16.57], la_paz: [-68.13, -16.5], patacamaya: [-67.92, -17.24],
    tambo_quemado: [-69.03, -18.29], caracollo: [-67.22, -17.64], oruro: [-67.11, -17.97],
    pisiga: [-68.63, -19.25], cochabamba: [-66.16, -17.39], santa_cruz: [-63.18, -17.78],
    sucre: [-65.26, -19.04], potosi: [-65.75, -19.58], uyuni: [-66.82, -20.46],
    tupiza: [-65.72, -21.44], villazon: [-65.59, -22.09], tarija: [-64.73, -21.53],
    villamontes: [-63.47, -21.26], yacuiba: [-63.68, -22.02], camiri: [-63.52, -20.04],
    monteagudo: [-63.96, -19.8], san_jose: [-60.08, -17.85], puerto_suarez: [-57.8, -18.96],
    san_ignacio: [-60.96, -16.37], trinidad: [-64.9, -14.83], caranavi: [-67.57, -15.83],
    rurrenabaque: [-67.53, -14.44], san_borja: [-66.85, -14.86], riberalta: [-66.07, -11.0],
    guayaramerin: [-65.36, -10.82], cobija: [-68.77, -11.03], aiquile: [-65.18, -18.2],
  };
  const RUTAS = [
    ["desaguadero", "la_paz"], ["la_paz", "patacamaya"], ["patacamaya", "caracollo"],
    ["caracollo", "oruro"], ["caracollo", "cochabamba"], ["patacamaya", "tambo_quemado"],
    ["oruro", "pisiga"], ["cochabamba", "santa_cruz"], ["cochabamba", "aiquile"],
    ["aiquile", "sucre"], ["oruro", "potosi"], ["potosi", "sucre"], ["potosi", "uyuni"],
    ["uyuni", "tupiza"], ["potosi", "tupiza"], ["tupiza", "villazon"], ["potosi", "tarija"],
    ["tarija", "villamontes"], ["villamontes", "yacuiba"], ["santa_cruz", "camiri"],
    ["camiri", "villamontes"], ["sucre", "monteagudo"], ["monteagudo", "camiri"],
    ["santa_cruz", "san_jose"], ["san_jose", "puerto_suarez"], ["santa_cruz", "san_ignacio"],
    ["santa_cruz", "trinidad"], ["la_paz", "caranavi"], ["caranavi", "rurrenabaque"],
    ["rurrenabaque", "san_borja"], ["san_borja", "trinidad"], ["rurrenabaque", "riberalta"],
    ["riberalta", "guayaramerin"], ["riberalta", "cobija"],
  ];

  let ancho = 0, alto = 0, escala = 1, origen = [0, 0];
  let deptos = [], rutas = [], bloqueos = [], particulas = [];
  let geo = null, puntos = [];
  let cinta = null, cintaAncho = 0;
  const ALTO_CINTA = 44, ESTIRA = 1.6, FRANJA_CINTA = ALTO_CINTA * ESTIRA;
  const raton = { x: -9999, y: -9999, fuerza: 0, dentro: false };
  const cl = Math.cos(16.5 * Math.PI / 180);
  const proyectar = ([lon, lat]) => [origen[0] + (lon + 69.7) * cl * escala, origen[1] + (-9.6 - lat) * escala];

  function medir() {
    const r = zona.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    ancho = r.width; alto = r.height;
    lienzo.width = Math.max(1, Math.round(ancho * dpr));
    lienzo.height = Math.max(1, Math.round(alto * dpr));
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    const anchoMapa = (69.7 - 57.4) * cl, altoMapa = 22.9 - 9.6;
    const franja = alto - 2 * (FRANJA_CINTA + 8);
    escala = Math.min(franja / altoMapa, ancho * .92 / anchoMapa);
    origen = [(ancho - anchoMapa * escala) / 2, FRANJA_CINTA + 8 + (franja - altoMapa * escala) / 2];
  }

  function curva(a, b, k) {
    const [x1, y1] = a, [x2, y2] = b;
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1;
    const off = (k % 2 ? 1 : -1) * .08;
    const cx = mx - dy * off, cy = my + dx * off;
    const pts = [];
    for (let i = 0; i <= 48; i += 1) {
      const t = i / 48, u = 1 - t;
      pts.push([u * u * x1 + 2 * u * t * cx + t * t * x2, u * u * y1 + 2 * u * t * cy + t * t * y2]);
    }
    const largos = [0];
    for (let i = 1; i < pts.length; i += 1) largos.push(largos[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    return { pts, largos, total: largos.at(-1) };
  }

  function enRuta(r, d) {
    const L = r.largos;
    let i = 1;
    while (i < L.length - 1 && L[i] < d) i += 1;
    const t = (d - L[i - 1]) / ((L[i] - L[i - 1]) || 1);
    const a = r.pts[i - 1], b = r.pts[i];
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  }

  function armarCinta() {
    const paso = 13;
    cintaAncho = Math.max(paso * 2, Math.ceil(ancho / paso + 2) * paso);
    cinta = document.createElement("canvas");
    cinta.width = cintaAncho; cinta.height = ALTO_CINTA;
    const k = cinta.getContext("2d");
    k.font = '11px "Geist Mono", ui-monospace, monospace';
    k.fillStyle = "#ffd9a3";
    for (let f = 0; f < 3; f += 1)
      for (let x = 0; x < cintaAncho; x += paso)
        k.fillText(Math.random() < .5 ? "0" : "1", x, 12 + f * 14);
  }

  function armar() {
    medir();
    armarCinta();
    deptos = geo ? geo.features.map((f) => {
      const p = new Path2D();
      f.geometry.coordinates.forEach((poli) => poli.forEach((anillo) => {
        anillo.forEach((q, i) => { const [x, y] = proyectar(q); i ? p.lineTo(x, y) : p.moveTo(x, y); });
        p.closePath();
      }));
      return p;
    }) : [];
    rutas = RUTAS.map(([a, b], k) => {
      const r = curva(proyectar(CIUDADES[a]), proyectar(CIUDADES[b]), k);
      r.path = new Path2D();
      r.pts.forEach(([x, y], i) => (i ? r.path.lineTo(x, y) : r.path.moveTo(x, y)));
      r.cortes = [];
      return r;
    });
    bloqueos = puntos.map((p) => {
      const [x, y] = proyectar([p.lon, p.lat]);
      let mejor = null;
      rutas.forEach((r, ir) => {
        r.pts.forEach((q, iq) => {
          const d = Math.hypot(q[0] - x, q[1] - y);
          if (!mejor || d < mejor.d) mejor = { d, ir, dist: r.largos[iq] };
        });
      });
      const b = { x, y, reciente: p.reciente, cola: 0, fase: Math.random() * 6.28 };
      if (mejor && mejor.d < escala * .9) {
        b.ruta = mejor.ir; b.dist = mejor.dist;
        const [rx, ry] = enRuta(rutas[mejor.ir], mejor.dist);
        b.rx = rx; b.ry = ry;
        rutas[mejor.ir].cortes.push(b);
      }
      return b;
    });
    const n = Math.round(Math.min(190, Math.max(70, ancho / 7)));
    particulas = Array.from({ length: n }, () => nueva(true));
  }

  function nueva(alAzar) {
    const r = Math.floor(Math.random() * rutas.length);
    const ruta = rutas[r];
    const dir = Math.random() < .5 ? 1 : -1;
    return {
      r, dir, d: alAzar ? Math.random() * ruta.total : (dir > 0 ? 0 : ruta.total),
      v: (.35 + Math.random() * .55) * Math.max(.6, escala / 40), espera: 0, rastro: [], frenado: false,
    };
  }

  function mover(p, dt) {
    const ruta = rutas[p.r];
    if (p.espera > 0) {
      p.espera -= dt;
      if (p.espera <= 0) { p.dir *= -1; p.frenado = false; if (p.corte) p.corte.cola = Math.max(0, p.corte.cola - 1); p.corte = null; }
      return;
    }
    let delante = null;
    ruta.cortes.forEach((b) => {
      if (!b.reciente) return;
      const falta = (b.dist - p.d) * p.dir;
      if (falta > 0 && (!delante || falta < delante.falta)) delante = { b, falta };
    });
    const hueco = 6 + (delante ? delante.b.cola * 4.5 : 0);
    if (delante && delante.falta < hueco + p.v * dt) {
      p.d = delante.b.dist - p.dir * hueco;
      p.frenado = true; p.corte = delante.b; delante.b.cola += 1;
      p.espera = 3 + Math.random() * 5;
      return;
    }
    p.d += p.dir * p.v * dt;
    if (p.d < 0 || p.d > ruta.total) Object.assign(p, nueva(false));
  }

  function cuadro(t, dt) {
    c.clearRect(0, 0, ancho, alto);
    const fondo = c.createRadialGradient(ancho * .5, alto * .45, 0, ancho * .5, alto * .45, Math.max(ancho, alto) * .7);
    fondo.addColorStop(0, "#140c05");
    fondo.addColorStop(1, "#000000");
    c.fillStyle = fondo; c.fillRect(0, 0, ancho, alto);

    if (cinta) {
      c.globalAlpha = .5;
      const c1 = -((t * 9) % cintaAncho), c2 = ((t * 6) % cintaAncho) - cintaAncho;
      c.drawImage(cinta, c1, 3, cintaAncho, FRANJA_CINTA);
      c.drawImage(cinta, c1 + cintaAncho, 3, cintaAncho, FRANJA_CINTA);
      c.drawImage(cinta, c2, alto - FRANJA_CINTA, cintaAncho, FRANJA_CINTA);
      c.drawImage(cinta, c2 + cintaAncho, alto - FRANJA_CINTA, cintaAncho, FRANJA_CINTA);
      c.globalAlpha = 1;
    }

    c.lineWidth = 1;
    c.strokeStyle = "rgba(242,160,61,.24)";
    deptos.forEach((p) => c.stroke(p));

    c.lineWidth = 1.4;
    c.strokeStyle = "rgba(255,214,160,.2)";
    rutas.forEach((r) => c.stroke(r.path));

    c.globalCompositeOperation = "lighter";
    bloqueos.forEach((b) => {
      c.fillStyle = b.reciente ? "rgba(242,160,61,.9)" : "rgba(242,160,61,.4)";
      c.beginPath(); c.arc(b.x, b.y, b.reciente ? 2.8 : 1.8, 0, 6.283); c.fill();
      if (b.reciente && b.rx != null) {
        const s = ((t * .45 + b.fase) % 1);
        c.strokeStyle = `rgba(242,160,61,${.8 * (1 - s)})`;
        c.lineWidth = 1.6;
        c.beginPath(); c.arc(b.rx, b.ry, 4 + s * 30, 0, 6.283); c.stroke();
      }
    });

    particulas.forEach((p) => {
      if (!quieto) mover(p, dt);
      const [x, y] = enRuta(rutas[p.r], p.d);
      p.rastro.push([x, y]);
      if (p.rastro.length > 9) p.rastro.shift();
      const cerca = Math.exp(-(((x - raton.x) ** 2 + (y - raton.y) ** 2) / (2 * 90 * 90))) * raton.fuerza;
      if (!p.frenado && p.rastro.length > 1) {
        c.strokeStyle = `rgba(255,226,184,${.38 + .4 * cerca})`;
        c.lineWidth = 1.6;
        c.beginPath();
        p.rastro.forEach(([a, b], i) => (i ? c.lineTo(a, b) : c.moveTo(a, b)));
        c.stroke();
      }
      const brillo = p.frenado ? .55 + .35 * Math.sin(t * 6 + p.d) : .75;
      c.fillStyle = p.frenado ? `rgba(242,160,61,${brillo})` : `rgba(255,236,210,${Math.min(1, brillo + cerca)})`;
      c.beginPath(); c.arc(x, y, p.frenado ? 2.4 : 1.9, 0, 6.283); c.fill();
    });

    if (raton.fuerza > .01) {
      const halo = c.createRadialGradient(raton.x, raton.y, 0, raton.x, raton.y, 180);
      halo.addColorStop(0, `rgba(242,160,61,${.16 * raton.fuerza})`);
      halo.addColorStop(1, "rgba(242,160,61,0)");
      c.fillStyle = halo;
      c.fillRect(raton.x - 180, raton.y - 180, 360, 360);
    }
    c.globalCompositeOperation = "source-over";
  }

  let lazo = 0, previo = 0, visible = true;
  function paso(ahora) {
    const dt = Math.min(.05, (ahora - (previo || ahora)) / 1000);
    previo = ahora;
    raton.fuerza += ((raton.dentro ? 1 : 0) - raton.fuerza) * .08;
    cuadro(ahora / 1000, dt * 60);
    lazo = requestAnimationFrame(paso);
  }
  const andar = () => { if (!lazo && !quieto) { previo = 0; lazo = requestAnimationFrame(paso); } };
  const parar = () => { if (lazo) { cancelAnimationFrame(lazo); lazo = 0; } };
  const decidir = () => (visible && !document.hidden ? andar() : parar());

  zona.addEventListener("pointermove", (e) => {
    if (e.pointerType === "touch") return;
    const r = zona.getBoundingClientRect();
    raton.x = e.clientX - r.left; raton.y = e.clientY - r.top; raton.dentro = true;
  });
  zona.addEventListener("pointerleave", () => { raton.dentro = false; });
  if ("IntersectionObserver" in window) new IntersectionObserver((f) => { visible = f[0].isIntersecting; decidir(); }).observe(zona);
  document.addEventListener("visibilitychange", decidir);
  let espera = 0;
  addEventListener("resize", () => { clearTimeout(espera); espera = setTimeout(() => { armar(); if (quieto) cuadro(0, 0); }, 150); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (ancho) armarCinta(); });
  if ("ResizeObserver" in window) new ResizeObserver(() => { clearTimeout(espera); espera = setTimeout(() => { if (rutas.length) { armar(); if (quieto) cuadro(0, 0); } }, 150); }).observe(zona);

  const leer = (texto) => {
    const [cab, ...filas] = texto.replace(/^﻿/, "").trim().split(/\r?\n/);
    const k = cab.split(",");
    return filas.map((f) => { const v = f.split(","); return Object.fromEntries(k.map((n, i) => [n, v[i]])); });
  };
  Promise.allSettled([
    fetch("assets/bolivia.json").then((r) => r.json()),
    fetch("data/puntos_90_dias.csv", { cache: "no-store" }).then((r) => r.text()),
  ]).then(([g, p]) => {
    if (g.status === "fulfilled") geo = g.value;
    if (p.status === "fulfilled") {
      const filas = leer(p.value).filter((f) => Number.isFinite(+f.latitud) && Number.isFinite(+f.longitud) && +f.latitud < 0);
      const fechas = filas.map((f) => f.fecha).sort();
      const ultima = fechas.at(-1) || "";
      const corte = ultima ? new Date(Date.parse(ultima) - 21 * 864e5).toISOString().slice(0, 10) : "";
      const vistas = new Map();
      filas.forEach((f) => {
        const clave = `${(+f.latitud).toFixed(2)},${(+f.longitud).toFixed(2)}`;
        const previo = vistas.get(clave);
        const reciente = f.fecha >= corte;
        if (!previo) vistas.set(clave, { lat: +f.latitud, lon: +f.longitud, reciente });
        else previo.reciente = previo.reciente || reciente;
      });
      puntos = [...vistas.values()];
      if (!puntos.some((q) => q.reciente)) puntos.forEach((q) => { q.reciente = true; });
    }
    armar();
    if (quieto) cuadro(0, 0); else decidir();
  });
  medir();
})();
