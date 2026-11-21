// Menu mobile
const burger = document.getElementById('burger');
const menu = document.getElementById('menu');
burger.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menu.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
}));

// Garis bawah navbar saat scroll + menu aktif
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 10);
window.addEventListener('scroll', onScroll); onScroll();
const links = [...menu.querySelectorAll('a:not(.btn-sm)')];
const hit = new Set();
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => e.isIntersecting ? hit.add(e.target.id) : hit.delete(e.target.id));
  const cur = hit.has('siteplan') ? 'siteplan' : [...hit][0];
  links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + cur));
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id], #siteplan').forEach(s => obs.observe(s));

// Formulir → WhatsApp (ganti nomor di bawah, format 62 tanpa tanda +)
const NOMOR_WA = '628816299831';
document.getElementById('kirim').addEventListener('click', () => {
  const nama = document.getElementById('nama').value.trim();
  const minat = document.getElementById('minat').value;
  const pesan = document.getElementById('pesan').value.trim();
  const note = document.getElementById('note');
  if (!nama) { note.textContent = 'Isi nama Anda terlebih dahulu.'; return; }
  note.textContent = '';
  const teks = `Halo PT. Amerta Raya Perkasa, saya ${nama}. Saya tertarik dengan ${minat}. ${pesan}`;
  window.open(`https://wa.me/${NOMOR_WA}?text=${encodeURIComponent(teks)}`, '_blank');
});

document.getElementById('tahun').textContent = new Date().getFullYear();

// ===== Siteplan 200 unit =====
// Ubah data di bawah ini sesuai kondisi sebenarnya (tipe, harga, status unit).
(() => {
  const svg = document.getElementById('sp-svg');
  if (!svg) return;
  const NS = 'http://www.w3.org/2000/svg';
  const el = (tag, attrs = {}, text) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (text !== undefined) n.textContent = text;
    return n;
  };

  // Tipe rumah: luas bangunan / luas tanah (m²), harga dalam juta rupiah
  // Tipe 30 adalah rumah subsidi (harga acuan FLPP, silakan sesuaikan)
  const TIPE = {
    30: { lt: 60,  harga: 166, subsidi: true },
    36: { lt: 72,  harga: 450 },
    45: { lt: 84,  harga: 550 }
  };
  // 10 blok × 20 unit = 200 unit. Kolom kiri: A–E, kolom kanan: F–J.
  const BLOK = ['A','B','C','D','E','F','G','H','I','J'];
  // Blok A: baris 1 (unit 1-10) tipe 36, baris 2 (unit 11-20) tipe 45. Blok B-J: tipe 30 subsidi.
  const tipeUnit = (bi, k) => bi === 0 ? (k < 10 ? 36 : 45) : 30;
  const STATUS = { a: 'Tersedia', b: 'Dipesan', s: 'Terjual' };

  // Semua unit tampil 'Tersedia'. Isi status asli di statusManual, misalnya: { 'A-1': 's', 'A-2': 'b' }
  // s = Terjual, b = Dipesan. Unit yang tidak diisi dianggap Tersedia.
  const statusManual = {};
  const rnd = i => { const x = Math.sin(i * 9301 + 49297) * 233280; return x - Math.floor(x); };
  const statusDefault = () => 'a';

  // Jalan, taman, dan fasilitas
  const road = (x, y, w, h) => svg.appendChild(el('rect', { x, y, width: w, height: h, class: 'sp-road' }));
  const ROW = [76, 184, 488, 596, 704];
  const put = (t, a, txt) => svg.appendChild(el(t, a, txt));
  const R = (x, y, w, h, fill) => put('rect', { x, y, width: w, height: h, rx: 8, fill, class: 'sp-fac' });
  const T = (x, y, s, cls = 'sp-fac-t') => put('text', { x, y, class: cls }, s);
  const C = (cx, cy, r, fill, o = {}) => put('circle', { cx, cy, r, fill, ...o });
  road(50, 24, 800, 48); road(410, 24, 80, 788);
  [148, 256, 452, 560, 668, 776].forEach(y => road(50, y, 800, 36));
  put('line', { x1: 60, y1: 48, x2: 840, y2: 48, class: 'sp-line' });
  [[24, 318], [426, 812]].forEach(([a, b]) => put('line', { x1: 450, y1: a, x2: 450, y2: b, class: 'sp-line' }));
  T(450, 14, 'Pintu masuk ↓', 'sp-gate');
  // Jantung kawasan: bundaran taman, masjid, taman bermain, lapangan, clubhouse
  C(450, 372, 44, '#F0EEE8'); C(450, 372, 32, '#CFDDC4'); C(450, 372, 9, '#BFD8E6'); T(450, 434, 'Taman pusat', 'sp-fac-s');
  R(50, 300, 150, 144, '#EADFC6');
  put('path', { d: 'M99 372a26 26 0 0 1 52 0z', fill: '#A8865A' });
  put('rect', { x: 95, y: 372, width: 60, height: 34, fill: '#F6EEDB' });
  put('rect', { x: 171, y: 338, width: 10, height: 68, fill: '#F6EEDB' });
  put('path', { d: 'M171 338l5-14 5 14z', fill: '#A8865A' });
  T(125, 430, 'Masjid');
  R(208, 300, 196, 144, '#DCE5D5');
  put('rect', { x: 218, y: 310, width: 176, height: 108, rx: 18, fill: 'none', stroke: '#fff', 'stroke-width': 2, 'stroke-dasharray': '6 5' });
  [[232, 326], [380, 326], [232, 402], [380, 402], [306, 330], [270, 372], [342, 372]].forEach(([x, y], i) => C(x, y, i < 4 ? 10 : 6, i < 4 ? '#A9C39A' : '#EDE3C8'));
  T(306, 436, 'Taman & jogging track');
  R(496, 300, 140, 144, '#D2E0C9');
  put('rect', { x: 508, y: 312, width: 116, height: 84, fill: 'none', stroke: '#fff', 'stroke-width': 2 });
  put('line', { x1: 508, y1: 354, x2: 624, y2: 354, stroke: '#fff', 'stroke-width': 2 });
  C(566, 354, 14, 'none', { stroke: '#fff', 'stroke-width': 2 });
  T(566, 424, 'Lapangan olahraga', 'sp-fac-s');
  R(644, 300, 206, 144, '#E6DCCB');
  put('rect', { x: 660, y: 318, width: 108, height: 62, rx: 4, fill: '#F6EEDB' });
  put('rect', { x: 786, y: 318, width: 48, height: 84, rx: 6, fill: '#BFD8E6' });
  T(747, 430, 'Clubhouse & kolam');

  // Unit
  const counts = { a: 0, b: 0, s: 0 };
  const units = {};
  BLOK.forEach((b, bi) => {
    const col = bi < 5 ? 0 : 1, rowB = bi % 5;
    const x0 = col ? 490 : 50, y0 = ROW[rowB];
    svg.appendChild(el('text', { x: col ? 874 : 26, y: y0 + 36, class: 'sp-blok' }, b));
    svg.appendChild(el('text', { x: col ? 874 : 26, y: y0 + 58, class: 'sp-blok-t' }, bi === 0 ? 'T36/45' : 'T30'));
    for (let k = 0; k < 20; k++) {
      const no = k + 1, id = `${b}-${no}`;
      const st = statusManual[id] || statusDefault(bi * 20 + k);
      counts[st]++;
      const x = x0 + (k % 10) * 36 + 1, y = y0 + Math.floor(k / 10) * 36 + 1;
      const g = el('g', { class: `unit st-${st}`, tabindex: 0, role: 'button', 'data-id': id, 'aria-label': `Unit ${id}, ${STATUS[st]}` });
      g.appendChild(el('rect', { x, y, width: 34, height: 34 }));
      g.appendChild(el('text', { x: x + 17, y: y + 21 }, no));
      svg.appendChild(g);
      units[id] = { id, blok: b, no, st, tipe: tipeUnit(bi, k), g };
    }
  });

  document.getElementById('sp-legend').innerHTML =
    `<span><i class="i-a"></i>Tersedia (${counts.a})</span>` +
    `<span><i class="i-b"></i>Dipesan (${counts.b})</span>` +
    `<span><i class="i-s"></i>Terjual (${counts.s})</span>` +
    `<span class="sp-note">Blok A: Tipe 36 &amp; 45 &nbsp;·&nbsp; Blok B–J: Tipe 30 Subsidi &nbsp;·&nbsp; Masjid, taman &amp; fasilitas umum di tengah kawasan &nbsp;·&nbsp; Ketersediaan dapat berubah, konfirmasi ke tim kami</span>`;

  // Detail unit
  const panel = document.getElementById('sp-detail');
  let aktif = null;
  const pilih = id => {
    const u = units[id]; if (!u) return;
    if (aktif) aktif.g.classList.remove('sel');
    u.g.classList.add('sel'); aktif = u;
    const t = TIPE[u.tipe];
    const pesan = encodeURIComponent(`Halo PT. Amerta Raya Perkasa, saya tertarik dengan unit ${u.id} (Tipe ${u.tipe}/${t.lt}). Mohon info selengkapnya.`);
    panel.innerHTML =
      `<h3>Unit ${u.id}</h3><span class="badge st-${u.st}">${STATUS[u.st]}</span>` +
      `<dl><div><dt>Tipe</dt><dd>${u.tipe}/${t.lt}</dd></div>` +
      `<div><dt>Luas bangunan</dt><dd>${u.tipe} m²</dd></div>` +
      `<div><dt>Luas tanah</dt><dd>${t.lt} m²</dd></div>` +
      (t.subsidi ? `<div><dt>Skema</dt><dd>Subsidi (FLPP)</dd></div>` : '') +
      `<div><dt>Harga</dt><dd>Rp ${t.harga} juta</dd></div></dl>` +
      (u.st === 's'
        ? `<p class="sp-sold">Unit ini sudah terjual. Silakan pilih unit lain.</p>`
        : `<a class="btn" href="https://wa.me/${NOMOR_WA}?text=${pesan}" target="_blank" rel="noopener">${u.st === 'b' ? 'Tanya ketersediaan' : 'Tanya unit ini'}</a>`);
    if (window.innerWidth < 980) panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };
  svg.addEventListener('click', e => { const g = e.target.closest('.unit'); if (g) pilih(g.dataset.id); });
  svg.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const g = e.target.closest('.unit'); if (g) { e.preventDefault(); pilih(g.dataset.id); }
  });
})();

// ===== Rumah 3D interaktif di dalam 3 bingkai proyek =====
(() => {
  // ===== Alat tekstur prosedural (di-cache agar tidak dibuat ulang untuk tiap kanvas) =====
  const CC = {};
  const hash = (x, y, sd) => { let h = (Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(sd, 982451653)) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
  const vnoise = (x, y, px, py, sd) => {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    const mx = n => ((n % px) + px) % px, my = n => ((n % py) + py) % py, g = (a, b) => hash(mx(xi + a), my(yi + b), sd);
    return (g(0, 0) * (1 - u) + g(1, 0) * u) * (1 - v) + (g(0, 1) * (1 - u) + g(1, 1) * u) * v;
  };
  const fbm = (u, v, sd, oct = 4, base = 4) => {
    let a = 0, amp = 0.5, f = base, n = 0;
    for (let o = 0; o < oct; o++) { a += amp * vnoise(u * f, v * f, f, f, sd + o * 7); n += amp; amp *= 0.5; f *= 2; }
    return a / n;
  };
  const canv = (name, size, draw, h) => {
    if (!CC[name]) { const c = document.createElement('canvas'); c.width = size; c.height = h || size; draw(c.getContext('2d'), size, c.height); CC[name] = c; }
    return CC[name];
  };
  const paint = (x, s, fn) => {
    const im = x.createImageData(s, s), d = im.data, o = [0, 0, 0];
    for (let j = 0; j < s; j++) for (let i = 0; i < s; i++) {
      fn(i / s, j / s, o, i, j); const k = (j * s + i) * 4;
      d[k] = o[0]; d[k + 1] = o[1]; d[k + 2] = o[2]; d[k + 3] = 255;
    }
    x.putImageData(im, 0, 0);
  };
  const gr = (o, v) => { v = v < 0 ? 0 : v > 255 ? 255 : v; o[0] = o[1] = o[2] = v; };
  const up = (name, n, fn, post) => canv(name, 512, (x, s) => { // gambar di resolusi n lalu perbesar halus ke 512
    const t = document.createElement('canvas'); t.width = t.height = n; const tx = t.getContext('2d'); paint(tx, n, fn);
    x.imageSmoothingEnabled = true; x.drawImage(t, 0, 0, s, s); if (post) post(x, s);
  });
  const rnd = (() => { let sd = 77; return () => (sd = sd * 16807 % 2147483647) / 2147483647; })();
  const buat = (canvas, idx) => {
    const wrap = canvas.parentElement;
    let renderer;
    try {
      if (!window.THREE) throw new Error('three.js tidak termuat');
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch (e) { wrap.classList.add('no-gl'); return; }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.86;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 16 / 9, 0.1, 100);
    const CZ = [-0.9, -0.9, -0.9, 0.3][idx]; // pusat rumah (memanjang ke belakang)
    const target = new THREE.Vector3(0, idx === 3 ? 1.9 : 1.4, CZ);

    // Langit berawan + garis pepohonan sebagai cahaya lingkungan (pantulan alami pada kaca, logam, dan plester)
    const envC = canv('env', 1024, (x, w, h) => {
      const g = x.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, '#2f6db3'); g.addColorStop(0.3, '#6fa3d6'); g.addColorStop(0.46, '#cfe0ee'); g.addColorStop(0.5, '#e8eef0');
      g.addColorStop(0.5, '#7b786a'); g.addColorStop(1, '#3c3a33'); x.fillStyle = g; x.fillRect(0, 0, w, h);
      for (let i = 0; i < 26; i++) {
        const cx = rnd() * w, cy = h * (0.08 + rnd() * 0.32), r = 40 + rnd() * 90, rg = x.createRadialGradient(cx, cy, 0, cx, cy, r);
        rg.addColorStop(0, 'rgba(255,255,255,.55)'); rg.addColorStop(1, 'rgba(255,255,255,0)');
        x.save(); x.translate(cx, cy); x.scale(1.8, 0.55); x.translate(-cx, -cy); x.fillStyle = rg; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill(); x.restore();
      }
      const sg = x.createRadialGradient(w * 0.58, h * 0.24, 0, w * 0.58, h * 0.24, 90);
      sg.addColorStop(0, 'rgba(255,250,235,1)'); sg.addColorStop(0.2, 'rgba(255,240,200,.7)'); sg.addColorStop(1, 'rgba(255,240,200,0)');
      x.fillStyle = sg; x.fillRect(0, 0, w, h);
      for (let i = 0; i < 70; i++) { x.fillStyle = `rgba(${28 + rnd() * 25},${60 + rnd() * 40},${28 + rnd() * 20},.95)`; x.beginPath(); x.arc(rnd() * w, h * 0.5 - rnd() * 14, 10 + rnd() * 26, 0, 7); x.fill(); }
    }, 512);
    const skyTex = new THREE.CanvasTexture(envC); skyTex.encoding = THREE.sRGBEncoding;
    const envScene = new THREE.Scene();
    envScene.add(new THREE.Mesh(new THREE.SphereGeometry(50, 32, 24), new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide })));
    const pm = new THREE.PMREMGenerator(renderer);
    scene.environment = pm.fromScene(envScene, 0.015).texture; pm.dispose();

    const hemi = new THREE.HemisphereLight(0xdfeaf7, 0xb9b19c, 0.3); hemi.color.convertSRGBToLinear(); hemi.groundColor.convertSRGBToLinear(); scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xfff0d8, 1.7); sun.color.convertSRGBToLinear();
    sun.position.set(6, 12, 8 + CZ); sun.target.position.set(0, 0, CZ); scene.add(sun.target); sun.castShadow = true;
    sun.shadow.mapSize.set(idx === 3 ? 4096 : 2048, idx === 3 ? 4096 : 2048); sun.shadow.normalBias = 0.03; sun.shadow.bias = -0.0004;
    Object.assign(sun.shadow.camera, { left: -11, right: 11, top: 11, bottom: -11, near: 1, far: 40 });
    scene.add(sun);

    // Tekstur prosedural: plester, genteng, rumput, paving, kayu
    let seed = 11; const rand = () => (seed = seed * 16807 % 2147483647) / 2147483647;
    const tex = (draw, rep) => {
      const c = document.createElement('canvas'); c.width = c.height = 256; draw(c.getContext('2d'), 256);
      const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(rep, rep); t.anisotropy = 4; t.encoding = THREE.sRGBEncoding; return t;
    };
    const grain = tex((x, s) => { x.fillStyle = '#fff'; x.fillRect(0, 0, s, s); for (let i = 0; i < 3000; i++) { x.fillStyle = `rgba(0,0,0,${rand() * 0.08})`; x.fillRect(rand() * s, rand() * s, 2, 2); } }, 1);
    const tiles = tex((x, s) => {
      const n = 8, h = s / n, w = s / 6;
      for (let r = 0; r < n; r++) {
        const g = x.createLinearGradient(0, r * h, 0, (r + 1) * h);
        g.addColorStop(0, '#f2f2f2'); g.addColorStop(1, '#a9a9a9'); x.fillStyle = g; x.fillRect(0, r * h, s, h);
        x.fillStyle = 'rgba(0,0,0,.35)'; for (let c = 0; c <= 6; c++) x.fillRect(c * w + (r % 2) * w / 2 - 1, r * h, 2, h);
      }
    }, 1);
    const grassT = tex((x, s) => { x.fillStyle = '#fff'; x.fillRect(0, 0, s, s); for (let i = 0; i < 6000; i++) { x.fillStyle = rand() < 0.5 ? 'rgba(0,0,0,.10)' : 'rgba(255,255,255,.12)'; x.fillRect(rand() * s, rand() * s, 2, 3); } }, 5);
    const paveT = tex((x, s) => { x.fillStyle = '#ddd'; x.fillRect(0, 0, s, s); x.fillStyle = 'rgba(0,0,0,.28)'; for (let i = 0; i <= 4; i++) { x.fillRect(0, i * s / 4 - 1, s, 2); x.fillRect(i * s / 4 - 1, 0, 2, s); } }, 1);
    const woodT = tex((x, s) => { x.fillStyle = '#fff'; x.fillRect(0, 0, s, s); for (let i = 0; i < 70; i++) { x.fillStyle = `rgba(0,0,0,${0.04 + rand() * 0.1})`; x.fillRect(rand() * s, 0, 1 + rand() * 2, s); } }, 1);

    // ----- Tekstur realistis (peta warna + peta relief) -----
    const T = (name, size, draw, color = true, h) => {
      const t = new THREE.CanvasTexture(canv(name, size, draw, h)); t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.anisotropy = 8; if (color) t.encoding = THREE.sRGBEncoding; return t;
    };
    const U = (name, n, fn, post, color = true) => { const t = new THREE.CanvasTexture(up(name, n, fn, post)); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; if (color) t.encoding = THREE.sRGBEncoding; return t; };
    // Plester cat tembok: bercak halus, noda hujan, butir pasir
    const plasterT = U('plasterC', 256, (u, v, o, i, j) => gr(o, 255 * (0.87 + 0.13 * fbm(u, v, 1, 4, 3)) - 5 * hash(i, j, 3) - (fbm(u, v, 9, 3, 5) > 0.64 ? 6 : 0)));
    const plasterB = U('plasterB', 256, (u, v, o, i, j) => gr(o, 255 * (0.35 + 0.4 * hash(i, j, 5) + 0.25 * fbm(u, v, 2, 2, 32))), null, false);
    // Beton: agregat, bercak, noda oli, sambungan slab, retakan halus
    const concT = U('concC', 256, (u, v, o, i, j) => {
      const a = hash(i, j, 13); let w = 255 * (0.8 + 0.2 * fbm(u, v, 11, 4, 3));
      if (a > 0.99) w *= 0.7; else if (a < 0.01) w *= 1.05;
      if (fbm(u, v, 17, 2, 2) > 0.6) w *= 0.88; if (i < 2 || j < 2) w *= 0.42; gr(o, w);
    }, (x, s) => { x.strokeStyle = 'rgba(40,40,40,.45)'; x.lineWidth = 1.2; for (let c = 0; c < 4; c++) { let px = rnd() * s, py = rnd() * s; x.beginPath(); x.moveTo(px, py); for (let k = 0; k < 9; k++) { px += (rnd() - 0.45) * 26; py += (rnd() - 0.5) * 26; x.lineTo(px, py); } x.stroke(); } });
    const concB = U('concB', 256, (u, v, o, i, j) => gr(o, (i < 3 || j < 3 ? 40 : 255 * (0.5 + 0.35 * hash(i, j, 14) + 0.15 * fbm(u, v, 15, 3, 6)))), null, false);
    // Terrazzo teras dengan nat
    const terrT = U('terrC', 256, (u, v, o) => { const fu = (u * 4) % 1, fv = (v * 4) % 1; gr(o, fu < 0.03 || fv < 0.03 ? 118 : 238 - 26 * fbm(u, v, 21, 3, 4)); },
      (x, s) => { const pal = ['#8a8378', '#b9ad98', '#6f6a62', '#f2ece0', '#a4623f', '#c9c3b6']; for (let c = 0; c < 900; c++) { const cx = rnd() * s, cy = rnd() * s; if ((cx / s * 4) % 1 < 0.04 || (cy / s * 4) % 1 < 0.04) continue; x.fillStyle = pal[(rnd() * pal.length) | 0]; x.globalAlpha = 0.55; x.beginPath(); x.ellipse(cx, cy, 1 + rnd() * 3.2, 1 + rnd() * 2.4, rnd() * 3, 0, 7); x.fill(); } x.globalAlpha = 1; });
    const terrB = U('terrB', 256, (u, v, o) => { const fu = (u * 4) % 1, fv = (v * 4) % 1; gr(o, fu < 0.03 || fv < 0.03 ? 20 : 200); }, null, false);
    // Papan kayu (plafon teras / soffit): 8 papan, serat bergelombang, nat gelap
    const woodDraw = (n, grooveW, freq) => (u, v, o, i, j) => {
      const bi = Math.floor(u * n), fu = u * n - bi, tone = 0.8 + 0.2 * hash(bi, 0, 21);
      const gn = 0.5 + 0.5 * Math.sin(fu * freq + 6 * vnoise(u * 40, v * 4, 40, 4, 23) + hash(bi, 1, 22) * 6);
      gr(o, fu < grooveW || fu > 1 - grooveW * 0.4 ? 70 : 255 * tone * (0.78 + 0.22 * gn) - 6 * hash(i, j, 24));
    };
    const boardWT = U('boardC', 256, woodDraw(8, 0.035, 38), (x, s) => { x.fillStyle = 'rgba(0,0,0,.05)'; for (let c = 0; c < 40; c++) x.fillRect(rnd() * s, rnd() * s, 1, 8 + rnd() * 30); });
    const boardWB = U('boardB', 256, (u, v, o) => { const fu = (u * 8) % 1; gr(o, fu < 0.04 ? 15 : 150 + 90 * vnoise(u * 40, v * 4, 40, 4, 25)); }, null, false);
    // Panel kayu lis vertikal (6 lis, celah gelap)
    const slatT = U('slatC', 256, (u, v, o, i, j) => {
      const bi = Math.floor(u * 6), fu = u * 6 - bi, tone = 0.8 + 0.2 * hash(bi, 3, 27);
      const gn = 0.5 + 0.5 * Math.sin(fu * 30 + 5 * vnoise(u * 30, v * 3, 30, 3, 29));
      gr(o, fu < 0.07 || fu > 0.95 ? 40 : 255 * tone * (0.8 + 0.2 * gn) - 5 * hash(i, j, 30));
    });
    const slatB = U('slatB', 256, (u, v, o) => { const fu = (u * 6) % 1; gr(o, fu < 0.07 || fu > 0.95 ? 10 : 150 + 80 * vnoise(u * 30, v * 3, 30, 3, 31)); }, null, false);
    // Atap metal standing-seam: rusuk memanjang searah lereng
    const seamT = U('seamC', 256, (u, v, o) => { const ph = (v * 4) % 1, pan = Math.floor(v * 4); gr(o, (ph < 0.07 ? 252 : ph < 0.14 ? 125 : 208 + 7 * vnoise(u * 8, v * 8, 8, 8, 33)) + hash(pan, 0, 32) * 10); });
    const seamB = U('seamB', 256, (u, v, o) => { const ph = (v * 4) % 1; gr(o, ph < 0.07 ? 255 : ph < 0.14 ? 255 * (1 - (ph - 0.07) / 0.07) * 0.8 + 20 : 130); }, null, false);
    // Gorden berlipat dengan serat kain
    const curtT = U('curtC', 256, (u, v, o, i, j) => gr(o, 255 * (0.72 + 0.28 * (0.5 + 0.5 * Math.cos(u * Math.PI * 6))) * (0.97 + 0.03 * hash(i, j, 41)) - (j % 2) * 4));
    const curtB = U('curtB', 256, (u, v, o) => gr(o, 255 * (0.5 + 0.5 * Math.cos(u * Math.PI * 6))), null, false);
    // Rumput, daun, tanah
    const grassT2 = U('grassC', 256, (u, v, o) => { const n = fbm(u, v, 51, 4, 4); o[0] = 255 * (0.68 + 0.32 * n); o[1] = 255 * (0.78 + 0.22 * n); o[2] = 255 * (0.52 + 0.32 * n); },
      (x, s) => { for (let c = 0; c < 5000; c++) { x.strokeStyle = rnd() < 0.5 ? 'rgba(255,255,230,.10)' : 'rgba(0,25,0,.14)'; x.lineWidth = 1; const px = rnd() * s, py = rnd() * s, l = 3 + rnd() * 5; x.beginPath(); x.moveTo(px, py); x.lineTo(px + (rnd() - 0.5) * 3, py - l); x.stroke(); } });
    const grassB = U('grassB', 256, (u, v, o, i, j) => gr(o, 255 * (0.3 + 0.7 * hash(i, j, 57))), null, false);
    const leafT = U('leafC', 256, (u, v, o) => gr(o, 255 * (0.55 + 0.45 * fbm(u, v, 61, 3, 6))), (x, s) => { x.strokeStyle = 'rgba(255,255,255,.10)'; x.lineWidth = 1.5; for (let c = 0; c < 9; c++) { x.beginPath(); x.moveTo(c * s / 9, 0); x.lineTo(c * s / 9 + 20, s); x.stroke(); } });
    const soilT = U('soilC', 256, (u, v, o) => gr(o, 255 * (0.58 + 0.28 * fbm(u, v, 71, 3, 4)) + 22 * Math.sin(v * 38 + fbm(u, v, 72, 2, 3) * 7)));
    // Foto interior (terlihat dari pintu yang terbuka): dinding hangat, meja makan, lampu gantung
    const roomT = T('room', 256, (x, w, h) => {
      let g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#f1e2c0'); g.addColorStop(0.7, '#d8b27c'); g.addColorStop(1, '#a8794a'); x.fillStyle = g; x.fillRect(0, 0, w, h);
      g = x.createLinearGradient(0, h * 0.74, 0, h); g.addColorStop(0, '#6a4b32'); g.addColorStop(1, '#2e2016'); x.fillStyle = g; x.fillRect(0, h * 0.74, w, h * 0.26);
      g = x.createLinearGradient(0, 80, 0, 250); g.addColorStop(0, '#fffbe8'); g.addColorStop(1, '#f2d9a0'); x.fillStyle = g; x.fillRect(150, 80, 80, 170);
      x.fillStyle = '#2b1d14'; x.fillRect(150, 148, 80, 3); x.fillRect(188, 80, 3, 170);
      x.fillStyle = '#2b1d14'; x.fillRect(48, 268, 160, 12); x.fillRect(60, 280, 7, 62); x.fillRect(190, 280, 7, 62);
      [70, 150].forEach(cx => { x.fillStyle = '#1d140e'; x.fillRect(cx, 296, 34, 8); x.fillRect(cx + 2, 250, 6, 50); x.fillRect(cx + 4, 304, 4, 36); x.fillRect(cx + 26, 304, 4, 36); });
      x.fillStyle = '#3a2a1c'; x.fillRect(120, 0, 2, 70); x.fillStyle = '#ffd98a'; x.beginPath(); x.arc(121, 78, 15, 0, 7); x.fill();
      g = x.createRadialGradient(121, 78, 0, 121, 78, 80); g.addColorStop(0, 'rgba(255,225,150,.6)'); g.addColorStop(1, 'rgba(255,225,150,0)'); x.fillStyle = g; x.fillRect(0, 0, w, 220);
    }, true, 400);
    // Cahaya lampu (sprite) dan bayangan kontak (AO palsu)
    const glowMat = new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canv('glow', 64, (x, s) => { const g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, 'rgba(255,228,160,.95)'); g.addColorStop(0.3, 'rgba(255,200,110,.35)'); g.addColorStop(1, 'rgba(255,190,90,0)'); x.fillStyle = g; x.fillRect(0, 0, s, s); })), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.55, toneMapped: false });
    const aoMat = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canv('ao', 64, (x, s) => { const g = x.createRadialGradient(32, 32, 4, 32, 32, 32); g.addColorStop(0, 'rgba(0,0,0,.62)'); g.addColorStop(0.55, 'rgba(0,0,0,.28)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, s, s); })), transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
    const glow = (g, x, y, z, sz) => { const sp = new THREE.Sprite(glowMat); sp.position.set(x, y, z); sp.scale.set(sz, sz, 1); g.add(sp); };
    const ao = (g, w, d, x, y, z) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), aoMat); m.rotation.x = -Math.PI / 2; m.position.set(x, y, z); m.renderOrder = 1; g.add(m); };

    // Warna hex dikonversi ke ruang linear agar tidak pucat pada output sRGB
    const lin = (m, env = 0.5) => { m.color.convertSRGBToLinear(); m.emissive.convertSRGBToLinear(); m.envMapIntensity = env; return m; };
    const std = (c, r = 0.9, m = 0, map = null, bump = null, bs = 1) => lin(new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m, map, bumpMap: bump, bumpScale: bs }));
    const roofM = c => lin(new THREE.MeshStandardMaterial({ color: c, roughness: 0.85, map: tiles, bumpMap: tiles, bumpScale: 1.5 }));
    const pl = (c, r = 0.93) => std(c, r, 0, plasterT, plasterB, 0.07);
    const white = pl(0xf2efe8), cream = pl(0xe8d9b4), blue = pl(0x8fa7bd),
      gray = pl(0xc9ccd0), frame = std(0xf2f2f2, 0.5, 0.2), dark = std(0x1f2226, 0.4, 0.7),
      glass = lin(new THREE.MeshStandardMaterial({ color: 0x33454f, roughness: 0.03, metalness: 0.92 }), 1.6),
      woodM = std(0x7a5233, 0.7, 0, woodT), woodL = std(0xb88455, 0.7, 0, woodT), pave = std(0xd9d5cb, 0.95, 0, paveT),
      roofRed = roofM(0xb4593d), roofDark = roofM(0x555a62), silver = std(0xc9ced4, 0.3, 0.6),
      leafA = std(0x4f8a3f, 0.85, 0, leafT), leafB = std(0x6a9f4a, 0.85, 0, leafT), leafC = std(0x3f7536, 0.85, 0, leafT), bark = std(0x7a6a56, 0.95, 0, soilT),
      shutter = std(0x4f6f58, 0.8), lampM = lin(new THREE.MeshStandardMaterial({ color: 0xffe6b0, emissive: 0xffd488, emissiveIntensity: 1.0 }), 0.4);

    // Box dengan UV mengikuti ukuran dunia (kerapatan tekstur seragam). tile = ukuran 1 ubin tekstur
    const box = (w, h, d, tile = 1) => {
      const g = new THREE.BoxGeometry(w, h, d), uv = g.attributes.uv, tu = Array.isArray(tile) ? tile[0] : tile, tv = Array.isArray(tile) ? tile[1] : tile;
      const dm = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
      for (let f = 0; f < 6; f++) for (let i = 0; i < 4; i++) { const k = f * 4 + i; uv.setXY(k, uv.getX(k) * dm[f][0] / tu, uv.getY(k) * dm[f][1] / tv); }
      return g;
    };
    const add = (g, geo, m, x, y, z) => {
      const o = new THREE.Mesh(geo, m);
      o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; g.add(o); return o;
    };
    const prism = (pts, d) => {
      const sh = new THREE.Shape();
      pts.forEach(([x, y], i) => i ? sh.lineTo(x, y) : sh.moveTo(x, y));
      sh.closePath();
      const geo = new THREE.ExtrudeGeometry(sh, { depth: d, bevelEnabled: false });
      geo.translate(0, 0, -d / 2); return geo;
    };
    const side = (g, x, z, ry) => { const o = new THREE.Group(); o.position.set(x, 0, z); o.rotation.y = ry; g.add(o); return o; };
    const win = (g, x, y, z, w, h, fm = frame) => {
      add(g, box(w, h, 0.06), fm, x, y, z);
      add(g, box(w - 0.12, h - 0.12, 0.05), glass, x, y, z + 0.02);
      add(g, box(0.035, h - 0.1, 0.07), fm, x, y, z + 0.02);
      if (h > 0.85) add(g, box(w - 0.1, 0.035, 0.07), fm, x, y + h * 0.12, z + 0.02);
      add(g, box(w + 0.16, 0.05, 0.15), gray, x, y - h / 2 - 0.02, z + 0.05);
    };
    const door = (g, x, z, w, h, m = woodM) => {
      add(g, box(w + 0.14, h + 0.07, 0.08), frame, x, (h + 0.07) / 2, z);
      add(g, box(w, h, 0.06), m, x, h / 2, z + 0.025);
      [0.27, 0.74].forEach(f => add(g, box(w * 0.72, h * 0.38, 0.02), woodL, x, h * f, z + 0.06));
      add(g, box(0.03, 0.16, 0.03), dark, x + w * 0.36, h * 0.5, z + 0.1);
      add(g, box(w + 0.5, 0.1, 0.4), gray, x, 0.05, z + 0.22);
    };
    const plinth = (g, w, d) => add(g, box(w + 0.06, 0.14, d + 0.06), gray, 0, 0.07, 0);
    const fence = (g, x1, x2, z) => {
      add(g, box(x2 - x1, 0.45, 0.12), white, (x1 + x2) / 2, 0.22, z);
      add(g, box(x2 - x1 + 0.04, 0.05, 0.18), gray, (x1 + x2) / 2, 0.47, z);
    };
    const post = (g, x, z) => add(g, box(0.14, 0.7, 0.14), white, x, 0.35, z);
    const blob = (g, r, m, x, y, z) => {
      const geo = new THREE.SphereGeometry(r, 14, 10), p = geo.attributes.position, v = new THREE.Vector3();
      for (let i = 0; i < p.count; i++) {
        v.fromBufferAttribute(p, i);
        const k = 1 + 0.16 * Math.sin(v.x * 4.1 + v.y * 3.3) * Math.cos(v.z * 3.7 + v.x * 2.1);
        p.setXYZ(i, v.x * k, v.y * k, v.z * k);
      }
      geo.computeVertexNormals(); return add(g, geo, m, x, y, z);
    };
    const tree = (g, x, z, h) => {
      add(g, new THREE.CylinderGeometry(0.05, 0.1, h, 8), bark, x, h / 2, z);
      [[0, h + 0.15, 0, 0.55, leafA], [0.3, h - 0.05, 0.1, 0.42, leafB], [-0.28, h, 0.05, 0.4, leafC], [0.05, h + 0.45, -0.15, 0.35, leafB]]
        .forEach(([dx, y, dz, r, m]) => blob(g, r * (h / 2.2 + 0.25), m, x + dx, y, z + dz));
    };
    const bush = (g, x, z, r, flower) => {
      blob(g, r, leafC, x, r * 0.7, z); blob(g, r * 0.75, leafA, x + r * 0.7, r * 0.55, z + r * 0.2);
      if (flower) for (let i = 0; i < 6; i++) {
        const a = i * 1.1;
        add(g, new THREE.SphereGeometry(0.05, 6, 6), std(flower, 0.6), x + Math.cos(a) * r * 0.8, r * (0.7 + 0.3 * Math.sin(i * 2)), z + Math.sin(a) * r * 0.8 + r * 0.2);
      }
    };
    const lamp = (g, x, z) => { add(g, new THREE.CylinderGeometry(0.03, 0.04, 1, 8), dark, x, 0.5, z); add(g, new THREE.SphereGeometry(0.09, 12, 10), lampM, x, 1.08, z); };

    // Jendela di dinding samping: dir = 1 (kanan, menghadap +x) atau -1 (kiri, menghadap -x)
    const sw = (g, x, z, dir, y, w, h, fm) => win(side(g, x, z, dir * Math.PI / 2), 0, y, 0, w, h, fm);
    // Ventilasi atap (turbin) tempat udara panas keluar
    const vent = (g, x, y, z) => {
      add(g, new THREE.CylinderGeometry(0.15, 0.17, 0.12, 12), dark, x, y + 0.06, z);
      add(g, new THREE.CylinderGeometry(0.16, 0.16, 0.3, 14), silver, x, y + 0.27, z);
      add(g, new THREE.ConeGeometry(0.23, 0.15, 14), dark, x, y + 0.5, z);
    };

    // ===== Rumah modern minimalis sesuai foto contoh =====
    // Atap pelana bertingkat (plafon kayu + lampu), kanopi teras, jendela miring di gable,
    // pintu kayu ganda dengan sidelight hitam, dinding panel, bak sansevieria.
    // Semua ukuran dibaca dari foto (piksel) lalu dikonversi ke satuan 3D agar proporsinya sama.
    const sand = pl(0xe6dccb), paleGray = pl(0xdcdee0),
      soffit = std(0xd2a878, 0.52, 0, boardWT, boardWB, 0.2), doorWood = std(0xc4915c, 0.55, 0, slatT, slatB, 0.25),
      gpan = pl(0x8f9498, 0.9), gpanL = pl(0xb2b5b8, 0.9),
      terr = std(0xded9cf, 0.4, 0, terrT, terrB, 0.1), grooveM = std(0x2a2a2a, 0.9),
      steel = std(0x565d69, 0.42, 0.55), slate = pl(0x6a7182, 0.88),
      roofMetal = std(0x4d535c, 0.4, 0.6, seamT, seamB, 0.35),
      room = new THREE.MeshBasicMaterial({ map: roomT, color: 0xcfcfcf }),
      conc = std(0xc4c2bc, 0.96, 0, concT, concB, 0.12);
    steel.envMapIntensity = 1.0; roofMetal.envMapIntensity = 1.1;

    const modern = (g, o) => {
      const { ox, z0, u, wall } = o;  // o.hero = true memperpanjang halaman depan
      const k = 0.0044 * u, X = px => (px - 478) * k, Y = py => (800 - py) * k + 0.1;
      const CD = 1.3 * u, D = 5.0 * u;
      const P = pts => pts.map(([px, py]) => [X(px), Y(py)]);
      const h = new THREE.Group(); h.position.set(ox, 0, z0); g.add(h);
      const bx0 = X(213), bx1 = X(922), cx = (bx0 + bx1) / 2, bH = Y(435);
      const cyl = (r, hh, n = 12) => new THREE.CylinderGeometry(r, r, hh, n);
      const mid = (a, b) => (Y(a) + Y(b)) / 2;

      // --- Teras terrazzo + anak tangga, halaman beton bersambungan ---
      add(h, box(X(590) - X(225), 0.1, CD + 0.15, 1.2), terr, (X(225) + X(590)) / 2, 0.05, (CD + 0.15) / 2);
      add(h, box(X(585) - X(235), 0.05, 0.22, 1.2), terr, (X(235) + X(585)) / 2, 0.025, CD + 0.26);
      const dl = o.hero ? 3.4 : 1.5;
      add(h, box(bx1 - bx0, 0.08, dl, 1.6), conc, cx, 0.04, CD + 0.15 + dl / 2);
      add(h, box(bx1 - bx0, 0.1, 0.05, 1), steel, cx, 0.05, CD + 0.15 + dl + 0.02);    // list tepi halaman

      // --- Badan rumah memanjang ke belakang + volume atap pelana ---
      add(h, box(bx1 - bx0, bH, D), wall, cx, bH / 2, -D / 2);
      add(h, prism(P([[300, 435], [300, 386], [595, 143], [884, 386], [884, 435]]), D), wall, 0, 0, -D / 2);

      // --- Dinding gable depan ---
      add(h, prism(P([[355, 482], [355, 432], [588, 205], [850, 424], [850, 482]]), 0.1), wall, 0, 0, 0);

      // --- Rangka atap pelana: bingkai baja abu-abu + plafon kayu berlampu ---
      add(h, prism(P([[288, 482], [288, 392], [595, 140], [895, 392], [895, 436], [877, 436], [877, 398], [595, 166], [308, 402], [308, 482]]), 0.55), steel, 0, 0, 0.325);
      add(h, prism(P([[308, 482], [308, 402], [595, 166], [877, 398], [877, 436], [850, 436], [850, 424], [588, 205], [355, 432], [355, 482]]), 0.35), soffit, 0, 0, 0.225);
      [[465, 308], [720, 285], [330, 450], [866, 410]].forEach(([px, py]) => {
        add(h, cyl(0.04, 0.012, 16), dark, X(px), Y(py), 0.405).rotation.x = Math.PI / 2;
        add(h, cyl(0.028, 0.012, 16), lampM, X(px), Y(py), 0.412).rotation.x = Math.PI / 2;
        glow(h, X(px), Y(py), 0.5, 0.42);
      });

      // --- Penutup atap metal standing-seam ---
      const slab = (p0, p1, zF, zB) => {
        const x0 = X(p0[0]), y0 = Y(p0[1]), x1 = X(p1[0]), y1 = Y(p1[1]);
        const L = Math.hypot(x1 - x0, y1 - y0), th = Math.atan2(y1 - y0, x1 - x0), t = 0.1;
        const grp = new THREE.Group();
        add(grp, box(L + 0.03, t, zF - zB, [2.2, 2.0]), roofMetal, 0, 0, (zF + zB) / 2);
        grp.position.set((x0 + x1) / 2 - Math.sin(th) * t / 2, (y0 + y1) / 2 + Math.cos(th) * t / 2, 0);
        grp.rotation.z = th; h.add(grp);
      };
      slab([288, 392], [595, 140], 0.6, -D - 0.3); slab([595, 140], [895, 392], 0.6, -D - 0.3);
      const cap = add(h, box(0.11, 0.11, 0.6 + D + 0.3), steel, X(595), Y(140) + 0.06, (0.6 - D - 0.3) / 2); cap.rotation.z = Math.PI / 4;

      // --- Jendela miring besar di gable (kaca tinted, memantulkan langit) ---
      add(h, prism(P([[360, 482], [360, 457], [503, 352], [503, 482]]), 0.06), dark, 0, 0, 0.06);
      add(h, prism(P([[372, 480], [372, 463], [491, 362], [491, 480]]), 0.04), glass, 0, 0, 0.095);
      add(h, box(0.03, Y(402) - Y(480), 0.05), dark, X(435), mid(402, 480), 0.12);

      // --- Kanopi teras putih tebal + downlight ---
      const kx0 = X(262), kx1 = X(590);
      add(h, box(kx1 - kx0, 0.07, CD), white, (kx0 + kx1) / 2, Y(490), CD / 2);
      add(h, box(kx1 - kx0, 0.012, CD - 0.1, [1, 1]), soffit, (kx0 + kx1) / 2, Y(490) - 0.04, CD / 2);
      [425, 520].forEach(px => {
        add(h, cyl(0.038, 0.01, 16), dark, X(px), Y(490) - 0.047, CD * 0.55);
        add(h, cyl(0.027, 0.012, 16), lampM, X(px), Y(490) - 0.052, CD * 0.55);
        glow(h, X(px), Y(490) - 0.1, CD * 0.55, 0.5);
      });

      // --- Panel kayu lis vertikal, sirip putih kiri, lampu dinding ---
      add(h, box(X(262) - X(213), bH, CD), white, (X(213) + X(262)) / 2, bH / 2, CD / 2);
      add(h, box(X(340) - X(262), Y(510) - Y(790), 0.09, [X(340) - X(262), Y(510) - Y(790)]), doorWood, X(301), mid(510, 790), 0.065);
      const lantern = (x, y, z) => {
        add(h, box(0.055, 0.13, 0.07), dark, x, y, z);
        add(h, cyl(0.016, 0.07, 10), lampM, x, y - 0.1, z);
        glow(h, x, y - 0.1, z + 0.08, 0.55);
      };
      lantern(X(299), Y(605), 0.15);
      add(h, box(X(340) - X(262) + 0.1, 0.09, 0.3), white, X(301), 0.15, 0.2);       // bak tanaman
      for (let i = 0; i < 11; i++) {
        const hg = 0.26 + 0.26 * rand(), cn = add(h, new THREE.ConeGeometry(0.032, hg, 4), i % 3 ? leafC : leafA, X(266) + (X(334) - X(266)) * i / 10, 0.2 + hg / 2, 0.2 + (rand() - 0.5) * 0.1);
        cn.rotation.z = (rand() - 0.5) * 0.3; cn.scale.z = 0.45;
      }

      // --- Pintu kaca hitam + gorden berlipat + interior terlihat dari pintu terbuka ---
      add(h, box(X(580) - X(365), Y(550) - Y(772), 0.08), dark, X(472.5), mid(550, 772), 0.04);
      add(h, new THREE.PlaneGeometry(X(575) - X(500), Y(556) - Y(768)), room, X(537), mid(556, 768), 0.082);
      [[374, 428], [436, 490]].forEach(([a, b]) => {
        const cu = add(h, box(X(b) - X(a), Y(558) - Y(766), 0.03, [0.2, Y(558) - Y(766)]), curtain, (X(a) + X(b)) / 2, mid(558, 766), 0.115);
        cu.castShadow = false;
      });
      [430, 497, 365, 580].forEach(px => add(h, box(0.03, Y(550) - Y(772), 0.05), dark, X(px), mid(550, 772), 0.1));
      add(h, box(X(580) - X(365), 0.03, 0.05), dark, X(472.5), Y(554), 0.1);
      add(h, cyl(0.009, 0.3, 8), steel, X(493), Y(668), 0.135);                       // handel pintu
      add(h, box(0.34, 0.012, 0.22), dark, X(537), 0.106, 0.2);                       // keset
      [X(520), X(548)].forEach((sx, i) => add(h, box(0.06, 0.022, 0.11), i ? dark : steel, sx + (i ? 0.01 : -0.01), 0.111, 0.45 + i * 0.03)); // sandal

      // --- Blok dinding abu-abu kebiruan + lampu dinding + tanaman ---
      const BD = 1.25;
      add(h, box(X(710) - X(590), Y(440) - 0.1, BD), slate, X(650), (Y(440) + 0.1) / 2, BD / 2);
      add(h, box(0.012, Y(440) - Y(800), 0.01), grooveM, X(650), mid(440, 800), BD + 0.006);
      lantern(X(650), Y(597), BD + 0.035);
      add(h, box(X(740) - X(592), 0.05, 0.28), dark, X(666), 0.125, BD + 0.14);
      [-0.05, 0.02, 0.07].forEach((dx, i) => {
        const hh = 0.42 + 0.14 * i, st = add(h, cyl(0.014, hh, 8), bark, X(650) + dx, 0.15 + hh / 2, BD + 0.14); st.rotation.z = -dx * 1.5;
        fan(h, X(650) + dx * 2.2, 0.15 + hh, BD + 0.14, 6, 0.2, 0.7, 0.06, bigLeaf, leafA);
      });
      bush(h, X(626), BD + 0.17, 0.08); bush(h, X(692), BD + 0.17, 0.07);

      // --- Kusen putih tebal di kanan: jendela hitam bergorden di dalam ceruk ---
      const FD = 1.25, fl = X(710), fr = X(922), ft = Y(428), fb = 0.1;
      add(h, box(X(735) - fl, ft - fb, FD), white, (fl + X(735)) / 2, (ft + fb) / 2, FD / 2);
      add(h, box(fr - X(895), ft - fb, FD), white, (X(895) + fr) / 2, (ft + fb) / 2, FD / 2);
      add(h, box(fr - fl, Y(428) - Y(450), FD), white, (fl + fr) / 2, mid(428, 450), FD / 2);
      add(h, box(X(895) - X(735), 0.06, FD), white, (X(735) + X(895)) / 2, Y(796), FD / 2);
      add(h, box(X(895) - X(735), Y(450) - Y(796), 0.06), white, (X(735) + X(895)) / 2, mid(450, 796), 0.5);
      const wL = X(737), wR = X(885), wC = (wL + wR) / 2;
      add(h, box(wR - wL, Y(540) - Y(790), 0.07), dark, wC, mid(540, 790), 0.56);
      add(h, box(wR - wL - 0.08, Y(540) - Y(790) - 0.08, 0.05), glass, wC, mid(540, 790), 0.595);
      [[746, 802], [818, 877]].forEach(([a, b]) => add(h, box(X(b) - X(a), Y(548) - Y(782), 0.03, [0.2, Y(548) - Y(782)]), curtain, (X(a) + X(b)) / 2, mid(548, 782), 0.63).castShadow = false);
      add(h, box(0.03, Y(540) - Y(790), 0.05), dark, X(810), mid(540, 790), 0.64);

      // --- Tanaman hijau di kanan ---
      add(h, box(X(922) - X(895) + 0.02, 0.06, 0.2), dark, X(908), 0.13, FD + 0.1);
      tropic(h, X(930), FD + 0.35, 0.55);

      // --- Bayangan kontak (ambient occlusion) agar bangunan tampak menapak ---
      ao(h, kx1 - kx0 + 0.3, CD + 0.5, (kx0 + kx1) / 2, 0.106, CD * 0.5);
      ao(h, X(740) - X(590) + 0.5, 0.9, X(665), 0.107, BD + 0.15);
      ao(h, 0.9, 1.4, X(240), 0.107, CD + 0.1);
      ao(h, bx1 - bx0 + 0.6, 0.55, cx, 0.085, CD + 0.35);

      // --- Dinding belakang: jendela untuk ventilasi silang ---
      const bk = side(h, 0, -D - 0.01, Math.PI);
      [-0.6, 0.6].forEach(x => win(bk, x * u, 0.9 * u, 0, 0.8 * u, 0.75 * u, dark));

      // --- Jalur udara hangat ---
      const wx = X(395), wy = Y(405), warm = [];
      [0, 0.2 * u].forEach(dx => warm.push([[wx + dx, wy, 0.1], [wx + dx, wy + 0.02, 0.45 * u], [wx + dx - 0.02, wy + 0.06, 0.8 * u],
        [wx + dx - 0.3, wy + 0.45 * u, 1.05 * u], [wx + dx - 0.8, wy + 1.0 * u, 1.15 * u], [wx + dx - 1.4, wy + 1.6 * u, 0.95 * u]]));
      [-0.6, 0.6].forEach(bxx => { const bx = bxx * u, y = 0.9 * u; warm.push([[bx, y, -D - 0.03], [bx, y + 0.1, -D - 0.4 * u], [bx - 0.1, y + 0.7 * u, -D - 0.8 * u],
        [bx - 0.4, y + 1.5 * u, -D - 1.1 * u], [bx - 1.0, y + 2.4 * u, -D - 1.3 * u]]); });
      warm.forEach(p => p.forEach(q => { q[0] += ox; q[2] += z0; }));
      return { X, Y, ox, z0, D, CD, bx0, bx1, warm, top: Y(140) + 0.7 };
    };

    // profil lintasan angin di atas atap (z, y)
    const overProfile = (zf, zb, top) => [[zf + 3.0, 1.4], [zf + 1.2, top * 0.6], [zf - 0.5, top], [(zf + zb) / 2, top], [zb + 0.6, top - 0.1], [zb - 1.8, top * 0.6], [zb - 3.8, 1.3]];

    // Deretan 3 rumah berhimpitan (memanjang ke belakang)

    const row = (g, o) => {
      const sp = 3.56, z0 = 0.4, hs = [-1, 0, 1].map((kk, i) => modern(g, { ox: kk * sp, z0, u: 1, wall: o.walls[i], hero: o.garage }));
      const a = hs[0], zf = z0 + a.CD + 0.5, zb = z0 - a.D - 0.3;
      const gw = sp - (a.bx1 - a.bx0), bh = a.Y(435);   // dinding penghubung abu-abu antar rumah
      [0, 1].forEach(i => add(g, box(gw, bh, a.D), slate, hs[i].ox + a.bx1 + gw / 2, bh / 2, z0 - a.D / 2));
      [0, 1].forEach(i => ao(g, 1.5, a.D + 0.7, hs[i].ox + a.bx1 + gw / 2, 0.125, z0 - a.D / 2));
      ao(g, 1.2, a.D + 0.7, hs[0].ox + a.bx0 - 0.35, 0.125, z0 - a.D / 2); ao(g, 1.2, a.D + 0.7, hs[2].ox + a.bx1 + 0.35, 0.125, z0 - a.D / 2);
      [-1, 1].forEach(s => tree(g, s * 5.9, -1.5, 1.7));
      return {
        zf, zb, sideX: [6.7, -6.7], xs: hs.flatMap(h => [h.ox - 0.8, h.ox + 0.8]),
        over: overProfile(zf, zb, a.top),
        cross: hs.flatMap(h => [[h.X(430), -0.6, 0.9], [h.X(810), 0.6, 0.87]].map(([fx, bx, y]) => ({ x: h.ox + fx, bx: h.ox + bx, y, z0, D: a.D, CD: a.CD }))),
        warm: hs.flatMap(h => h.warm)
      };
    };

    const MODELS = [
      g => row(g, { walls: [white, white, white] }),     // Amerta Residence
      g => row(g, { walls: [white, cream, white] }),     // Raya Garden Village
      g => row(g, { walls: [paleGray, white, paleGray] }) // Perkasa Park
    ];

    // ===== Model hero: rumah modern klasik putih satu lantai (acuan foto contoh) =====
    const boardT = tex((x, s) => { x.fillStyle = '#fff'; x.fillRect(0, 0, s, s); x.fillStyle = 'rgba(0,0,0,.22)'; for (let i = 0; i < 10; i++) x.fillRect(i * s / 10, 0, 2, s); }, 1);
    boardT.repeat.set(3, 1);
    const board = std(0xf4f1ea, 0.95, 0, boardT), slatBase = std(0x8d9096, 0.8), slat = std(0xdcdde0, 0.7),
      asphalt = std(0x6b6e73, 0.95, 0, paveT), palmG1 = std(0x3f7a38, 0.75, 0, leafT), palmG2 = std(0x5f9a45, 0.75, 0, leafT),
      bigLeaf = std(0x3f8a3c, 0.65, 0, leafT), topi = std(0x8a9a3e, 0.95);
    const archGeo = (w, h, d) => {
      const sh = new THREE.Shape(), r = w / 2;
      sh.moveTo(-r, 0); sh.lineTo(-r, h - r); sh.absarc(0, h - r, r, Math.PI, 0, true); sh.lineTo(r, 0); sh.closePath();
      return new THREE.ExtrudeGeometry(sh, { depth: d, bevelEnabled: false, curveSegments: 24 });
    };
    const dentil = (g, x, y, z, len, n) => { for (let i = 0; i < n; i++) add(g, box(0.06, 0.11, 0.05), white, x - len / 2 + (i + 0.5) * len / n, y, z); };
    const fan = (g, x, y, z, n, len, tilt, w, m1, m2) => { // rosette daun
      for (let i = 0; i < n; i++) {
        const piv = new THREE.Group(); piv.position.set(x, y, z); piv.rotation.y = i / n * Math.PI * 2 + (i % 2) * 0.2; g.add(piv);
        const geo = w ? new THREE.SphereGeometry(1, 8, 6) : new THREE.ConeGeometry(0.06, len, 4);
        if (w) geo.scale(w, len / 2, 0.03);
        geo.translate(0, len / 2, 0);
        const lf = add(piv, geo, i % 2 ? m1 : m2, 0, 0, 0); lf.rotation.z = -(tilt + (i % 3) * 0.12);
        if (!w) lf.scale.z = 0.4;
      }
    };
    const palm = (g, x, z, h, lean) => {
      const grp = new THREE.Group(); grp.position.set(x, 0, z); grp.rotation.z = lean; g.add(grp);
      add(grp, new THREE.CylinderGeometry(0.06, 0.1, h, 10), bark, 0, h / 2, 0);
      fan(grp, 0, h, 0, 16, 1.15, 0.95, 0, palmG1, palmG2);
    };
    const tropic = (g, x, z, k) => { fan(g, x, 0.05, z, 9, 0.9 * k, 0.35, 0.2 * k, bigLeaf, leafA); blob(g, 0.12, leafC, x, 0.1, z); };

    // Bahan khusus model hero (mengikuti foto: dinding putih, panel abu, gorden, paving)
    boardT.repeat.set(1.8, 1);
    const curtain = std(0xece9e1, 0.95, 0, curtT, curtB, 0.15), grayWall = std(0x8d9096, 0.9, 0, grain);
    const brickT = tex((x, s) => {
      x.fillStyle = '#fff'; x.fillRect(0, 0, s, s);
      const n = 8, h = s / n, w = s / 4;
      for (let r = 0; r < n; r++) for (let c = 0; c < 4; c++) {
        x.fillStyle = `rgba(0,0,0,${rand() * 0.14})`; x.fillRect(c * w + (r % 2) * w / 2, r * h, w, h);
      }
      x.fillStyle = 'rgba(0,0,0,.4)';
      for (let r = 0; r < n; r++) { x.fillRect(0, r * h, s, 1.5); for (let c = 0; c < 4; c++) x.fillRect(c * w + (r % 2) * w / 2, r * h, 1.5, h); }
    }, 1);
    brickT.repeat.set(6, 1.3);
    const street = std(0x7b7e84, 0.95, 0, brickT);

    // ===== Model hero: 3 rumah berjajar (menghadap timur, +z) =====
    MODELS.push(g => {
      const cfg = row(g, { walls: [white, white, white], garage: true, sz: 5.5 });
      palm(g, -6.3, 4.3, 2.8, -0.16); palm(g, 6.3, 4.5, 2.4, 0.14); tropic(g, -5.6, 4.6, 1.2); tropic(g, 5.6, 4.7, 1.1);
      return cfg;
    });

    // ===== Animasi aliran udara =====
    // Titik-titik halus yang meluncur di sepanjang lintasan (ekor memudar).
    // Biru = udara segar masuk lewat jendela (ventilasi silang) dan mengalir di sekitar rumah;
    // oranye = udara hangat naik dan keluar lewat ventilasi atap.
    let wind = null;
    const buildWind = (g, cfg) => {
      const V = a => new THREE.Vector3(a[0], a[1], a[2]);
      const COOL = [0.16, 0.55, 0.86], WARM = [0.96, 0.52, 0.16];
      const S = []; let total = 0, n = 0;
      const mk = (pts, o) => {
        const curve = new THREE.CatmullRomCurve3(pts.map(V), false, 'centripetal');
        const N = 120, L = curve.getLength(), K = 22;
        S.push({
          sp: curve.getSpacedPoints(N), N, K, step: o.tail / (K * L), speed: o.speed,
          phase: (n * 0.382) % 1, streaks: 2, col: o.col, size: o.size, amax: o.a, base: total
        });
        total += 2 * K; n++;
      };
      // 1) Ventilasi silang depan-belakang: masuk lewat pintu/jendela depan, keluar lewat jendela belakang
      cfg.cross.forEach(c => [-0.09, 0.09].forEach(dx => {
        const x = c.x + dx, b = c.bx + dx, y = c.y, zb = c.z0 - c.D;
        mk([[x, y + 0.45, c.z0 + c.CD + 2.9], [x, y + 0.2, c.z0 + c.CD + 1.3], [x, y + 0.05, c.z0 + 0.3], [x, y, c.z0 + 0.03],
            [(x + b) / 2, y + 0.02, c.z0 - c.D / 2], [b, y, zb + 0.02], [b, y + 0.1, zb - 0.4], [b - 0.1, y + 0.5, zb - 1.3], [b - 0.2, y + 0.9, zb - 2.4]],
          { speed: 0.1, tail: 1.6, col: COOL, size: 0.12, a: 0.8 });
      }));
      // 2) Angin mengalir di atas atap tiap rumah
      cfg.xs.forEach(x0 => mk(cfg.over.map(([z, y], i) => [x0 + 0.12 * Math.sin(i * 1.7), y, z]),
        { speed: 0.085, tail: 2.2, col: COOL, size: 0.12, a: 0.7 }));
      // 3) Angin menyusuri sisi kiri dan kanan rumah
      cfg.sideX.forEach((sx, i) => {
        const d = Math.sign(sx), m = (cfg.zf + cfg.zb) / 2;
        mk([[sx + d * 1.2, 1.0, cfg.zf + 3.8], [sx + d * 0.1, 1.55 + i * 0.1, cfg.zf + 0.8], [sx - d * 0.2, 1.35, m],
            [sx + d * 0.1, 1.7, cfg.zb - 0.4], [sx + d * 1.2, 1.1, cfg.zb - 3.6]],
          { speed: 0.08, tail: 1.8, col: COOL, size: 0.12, a: 0.65 });
      });
      // 4) Udara hangat keluar dari jendela atas (miring) dan jendela belakang, lalu naik
      cfg.warm.forEach(p => mk(p, { speed: 0.19, tail: 1.1, col: WARM, size: 0.15, a: 0.85 }));

      const pos = new Float32Array(total * 3), al = new Float32Array(total), sz = new Float32Array(total), cl = new Float32Array(total * 3);
      S.forEach(s => { for (let i = 0; i < s.streaks * s.K; i++) cl.set(s.col, (s.base + i) * 3); });
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage));
      geo.setAttribute('aAlpha', new THREE.BufferAttribute(al, 1).setUsage(THREE.DynamicDrawUsage));
      geo.setAttribute('aSize', new THREE.BufferAttribute(sz, 1).setUsage(THREE.DynamicDrawUsage));
      geo.setAttribute('aColor', new THREE.BufferAttribute(cl, 3));
      const mat = new THREE.ShaderMaterial({
        uniforms: { uScale: { value: 800 } },
        vertexShader: 'attribute float aAlpha; attribute float aSize; attribute vec3 aColor; uniform float uScale; varying float vA; varying vec3 vC;' +
          'void main(){ vA = aAlpha; vC = aColor; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_PointSize = aSize * uScale / -mv.z; gl_Position = projectionMatrix * mv; }',
        fragmentShader: 'varying float vA; varying vec3 vC;' +
          'void main(){ float d = length(gl_PointCoord - 0.5) * 2.0; float a = smoothstep(1.0, 0.15, d) * vA; if (a < 0.01) discard; gl_FragColor = vec4(vC, a); }',
        transparent: true, depthWrite: false
      });
      const points = new THREE.Points(geo, mat); points.frustumCulled = false; g.add(points);

      const update = t => {
        for (const s of S) for (let j = 0; j < s.streaks; j++) {
          const head = ((t * s.speed + s.phase + j / s.streaks) % 1) * (1 + s.K * s.step);
          for (let k = 0; k < s.K; k++) {
            const i = s.base + j * s.K + k, u = head - k * s.step;
            if (u <= 0 || u >= 1) { al[i] = 0; continue; }
            const f = u * s.N, i0 = Math.min(Math.floor(f), s.N - 1), w = f - i0, a = s.sp[i0], b = s.sp[i0 + 1];
            pos[i * 3] = a.x + (b.x - a.x) * w; pos[i * 3 + 1] = a.y + (b.y - a.y) * w; pos[i * 3 + 2] = a.z + (b.z - a.z) * w;
            const fade = Math.pow(1 - k / s.K, 1.5);
            al[i] = fade * Math.min(1, u / 0.1, (1 - u) / 0.1) * s.amax;
            sz[i] = s.size * (0.5 + 0.5 * fade);
          }
        }
        geo.attributes.position.needsUpdate = geo.attributes.aAlpha.needsUpdate = geo.attributes.aSize.needsUpdate = true;
      };
      update(3);
      return { mat, update };
    };

    // Alas tanah berumput, lalu rumah sesuai proyek
    const ground = new THREE.Group(); scene.add(ground);
    const grass = std(0x7c9b70, 0.98, 0, grassT2, grassB, 0.12);
    grassT2.repeat.set(12, 12); grassB.repeat.set(12, 12);
    // Alas minimalis: hanya petak taman
    const soil = std(0x6b5a45, 0.95, 0, soilT); soilT.repeat.set(5, 1);
    ground.position.z = CZ;
    add(ground, new THREE.BoxGeometry(idx === 3 ? 14.4 : 12.8, 0.3, idx === 3 ? 12 : 8.8), [soil, soil, grass, soil, soil, soil], 0, -0.03, 0);
    // Rumput liar (instancing) di area taman, di luar bangunan dan halaman
    {
      const N = idx === 3 ? 2200 : 900, HW = idx === 3 ? 7.1 : 6.3, HD = idx === 3 ? 5.9 : 4.3, dlen = idx === 3 ? 3.4 : 1.5;
      const zFront = 0.4 + 1.3 + 0.15 + dlen + 0.1, zBack = 0.4 - 5.0 - 0.45;
      const tg = new THREE.ConeGeometry(0.014, 0.1, 3); tg.translate(0, 0.05, 0);
      const im = new THREE.InstancedMesh(tg, std(0xffffff, 0.9), N), m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), sc = new THREE.Vector3(), p = new THREE.Vector3(), col = new THREE.Color();
      let c = 0;
      for (let t = 0; t < N * 3 && c < N; t++) {
        const x = (rand() * 2 - 1) * HW, z = CZ + (rand() * 2 - 1) * HD;
        if (Math.abs(x) < 5.5 && z > zBack && z < zFront) continue;
        e.set((rand() - 0.5) * 0.6, rand() * 6.28, (rand() - 0.5) * 0.6); q.setFromEuler(e);
        const sz = 0.7 + rand() * 0.9; sc.set(sz, sz * (0.8 + rand() * 0.9), sz); p.set(x, 0.12, z);
        im.setMatrixAt(c, m4.compose(p, q, sc)); col.setHSL(0.23 + rand() * 0.07, 0.38, 0.2 + rand() * 0.12).convertSRGBToLinear(); im.setColorAt(c, col); c++;
      }
      im.count = c; im.receiveShadow = true; scene.add(im);
    }
    const house = new THREE.Group(); house.position.y = 0.12; scene.add(house);
    const cfg = MODELS[idx](house);
    wind = cfg ? buildWind(house, cfg) : null;

    // ===== Matahari: terbit di timur (+z), terbenam di barat (-z); cahaya dan bayangan ikut bergerak =====
    let sunUpdate = null, sunT = 4;
    if (idx === 3) {
      const R = 8.6, Z = new THREE.Vector3(0, 0, CZ), sp = new THREE.Vector3(), dir = new THREE.Vector3(), UP = new THREE.Vector3(0, 1, 0);
      const cLow = new THREE.Color(0xffb870).convertSRGBToLinear(), cHigh = new THREE.Color(0xfff4e2).convertSRGBToLinear();
      const arcPts = Array.from({ length: 49 }, (_, i) => new THREE.Vector3(2, 0.3 + R * Math.sin(Math.PI * i / 48), CZ + R * Math.cos(Math.PI * i / 48)));
      const arc = new THREE.Line(new THREE.BufferGeometry().setFromPoints(arcPts), new THREE.LineDashedMaterial({ color: 0xe0a93a, dashSize: 0.35, gapSize: 0.3 }));
      arc.computeLineDistances(); scene.add(arc);
      const gc = document.createElement('canvas'); gc.width = gc.height = 128;
      const gx = gc.getContext('2d'), gg = gx.createRadialGradient(64, 64, 0, 64, 64, 64);
      gg.addColorStop(0, 'rgba(255,236,170,1)'); gg.addColorStop(0.25, 'rgba(255,214,110,.5)'); gg.addColorStop(1, 'rgba(255,200,90,0)');
      gx.fillStyle = gg; gx.fillRect(0, 0, 128, 128);
      const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(gc), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, toneMapped: false }));
      halo.scale.set(6.5, 6.5, 1);
      const disc = new THREE.Mesh(new THREE.SphereGeometry(0.5, 20, 16), new THREE.MeshBasicMaterial({ color: 0xffe08a, transparent: true, toneMapped: false }));
      scene.add(halo, disc);
      // Berkas sinar dari matahari ke atap dan teras tiap rumah
      const beamM = new THREE.MeshBasicMaterial({ color: 0xffe3a0, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false });
      const beams = [-3.56, 0, 3.56].flatMap(x => [[x, 3.3, -1.4], [x + 0.2, 0.3, 1.6]]).map(t => {
        const m = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.5, 1, 12, 1, true), beamM);
        m.userData.t = new THREE.Vector3(...t); scene.add(m); return m;
      });
      const NAMA = ['Pagi', 'Siang', 'Sore'], KET = [
        'Cahaya pagi dari timur menyinari teras depan: hangat dan tidak menyengat.',
        'Matahari tinggi: kanopi dan atap menaungi dinding, panas tidak langsung masuk.',
        'Sisi barat minim bukaan, sehingga panas sore tertahan di luar.'];
      const bgEl = document.getElementById('hero-bg'), tmp = new THREE.Color(); let lastBg = -1;
      const sky = [[0x25314d, 0x3f86c9], [0x8a6a7a, 0x8fc0e8], [0xf3a46a, 0xd7ebf7]].map(([a, b]) => [new THREE.Color(a), new THREE.Color(b)]);
      const eP = document.getElementById('sun-phase'), eT = document.getElementById('sun-text'); let ph = -1;
      sunUpdate = p => {
        const th = Math.PI * p, s = Math.sin(th), k = Math.min(1, s / 0.3), ke = k * k * (3 - 2 * k);
        sp.set(2, 0.3 + R * s, CZ + R * Math.cos(th));
        disc.position.copy(sp); halo.position.copy(sp); disc.material.opacity = halo.material.opacity = ke;
        dir.copy(sp).sub(Z).normalize(); sun.position.copy(Z).addScaledVector(dir, 20);
        sun.intensity = 0.12 + 1.45 * ke; sun.color.lerpColors(cLow, cHigh, Math.min(1, s * 1.3));
        beamM.opacity = 0.08 * ke;
        beams.forEach(b => {
          const d = dir.copy(sp).sub(b.userData.t), L = d.length();
          b.position.copy(b.userData.t).addScaledVector(d, 0.5); b.quaternion.setFromUnitVectors(UP, d.normalize()); b.scale.y = L;
        });
        if (bgEl && Math.abs(p - lastBg) > 0.01) {
          lastBg = p;
          ['--sk1', '--sk2', '--sk3'].forEach((v, n) => bgEl.style.setProperty(v, tmp.copy(sky[n][0]).lerp(sky[n][1], ke).getStyle()));
          bgEl.style.setProperty('--ambo', (0.3 * (1 - ke)).toFixed(2));
        }
        const i = p < 0.3 ? 0 : p < 0.7 ? 1 : 2;
        if (i !== ph && eP && eT) { ph = i; eP.textContent = NAMA[i]; eT.textContent = KET[i]; }
      };
    }

  // Kamera mengorbit rumah
  let yaw = [-0.5, -0.4, -0.6, -0.3][idx], pitch = idx === 3 ? 0.2 : 0.32, dist = idx === 3 ? 30 : 28, auto = true, dragging = false, lx = 0, ly = 0;
  const place = () => {
    camera.position.set(
      target.x + dist * Math.cos(pitch) * Math.sin(yaw),
      target.y + dist * Math.sin(pitch),
      target.z + dist * Math.cos(pitch) * Math.cos(yaw));
    camera.lookAt(target);
  };
  const resize = () => {
    const w = wrap.clientWidth, h = wrap.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    if (wind) wind.mat.uniforms.uScale.value = renderer.domElement.height / (2 * Math.tan(camera.fov * Math.PI / 360));
  };
  new ResizeObserver(resize).observe(wrap); resize();

  // Geser untuk memutar (kiri-kanan) dan memiringkan (atas-bawah)
  const hint = wrap.querySelector('.thumb-hint, .hint');
  canvas.addEventListener('pointerdown', e => {
    dragging = true; lx = e.clientX; ly = e.clientY;
    canvas.setPointerCapture(e.pointerId); hint && hint.classList.add('hide');
  });
  canvas.addEventListener('pointermove', e => {
    if (!dragging) return;
    yaw -= (e.clientX - lx) * 0.01;
    pitch = Math.max(0.05, Math.min(1.2, pitch + (e.clientY - ly) * 0.006));
    lx = e.clientX; ly = e.clientY;
  });
  ['pointerup', 'pointercancel'].forEach(ev => canvas.addEventListener(ev, () => { dragging = false; }));
  canvas.addEventListener('wheel', e => {
    if (!e.ctrlKey && !e.metaKey) return; // scroll biasa tetap menggulir halaman
    e.preventDefault();
    dist = Math.max(8, Math.min(36, dist + e.deltaY * 0.01));
  }, { passive: false });

  const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (calm) auto = false;
  let last = performance.now(), wt = 3;
  let raf = 0;
  const loop = () => {
    raf = requestAnimationFrame(loop);
    const now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (!calm) wt += dt;
    if (wind) wind.update(wt);
    if (sunUpdate) sunUpdate(calm ? 0.2 : ((sunT += dt) / 32) % 1);
    if (auto && !dragging) yaw += 0.004;
    place(); renderer.render(scene, camera);
  };
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { if (!raf) loop(); } else { cancelAnimationFrame(raf); raf = 0; }
  }).observe(wrap);
  };
  document.querySelectorAll('.thumb canvas').forEach((c, i) => buat(c, i));
  const hc = document.getElementById('house-canvas'); if (hc) buat(hc, 3);
})();



// ===== Slider pesan hero, angka berjalan, form penawaran, tombol WhatsApp =====
(() => {
  const slides = [...document.querySelectorAll('.slide')], dots = [...document.querySelectorAll('.dots button')];
  if (slides.length) {
    let i = 0, t, started = false;
    const bgEl = document.getElementById('hero-bg');
    const go = n => {
      const prev = i;
      i = (n + slides.length) % slides.length;
      if (started && prev !== i && bgEl) bgEl.classList.toggle('to2');
      started = true;
      slides.forEach((s, k) => s.classList.toggle('on', k === i));
      dots.forEach((d, k) => d.classList.toggle('on', k === i));
      clearTimeout(t);
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) t = setTimeout(() => go(i + 1), 6500);
    };
    dots.forEach((d, k) => d.addEventListener('click', () => go(k)));
    go(0);
  }
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    cio.unobserve(e.target);
    const el = e.target, n = +el.dataset.n, t0 = performance.now();
    const tick = t => { const k = Math.min(1, (t - t0) / 1400); el.textContent = Math.round(n * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }), { threshold: .6 });
  document.querySelectorAll('[data-n]').forEach(el => cio.observe(el));
  const of = document.getElementById('offer');
  if (of) of.addEventListener('submit', ev => {
    ev.preventDefault();
    const v = id => document.getElementById(id).value.trim();
    const teks = `Halo PT. Amerta Raya Perkasa, saya ${v('of-nama')} (${v('of-hp')}). Saya ingin penawaran untuk ${v('of-proyek')}.`;
    window.open(`https://wa.me/${NOMOR_WA}?text=${encodeURIComponent(teks)}`, '_blank');
  });
  const wa = document.getElementById('wa-float');
  if (wa) wa.href = `https://wa.me/${NOMOR_WA}?text=${encodeURIComponent('Halo PT. Amerta Raya Perkasa, saya ingin bertanya tentang proyek perumahan.')}`;
})();


// Legalitas: pratinjau dokumen SK AHU (lightbox)
(function(){
  const lb=document.getElementById('lb'); if(!lb) return;
  const img=document.getElementById('lb-img'), cap=document.getElementById('lb-cap'), x=document.getElementById('lb-x');
  let last=null;
  const close=()=>{lb.hidden=true;document.body.style.overflow='';if(last)last.focus();};
  document.querySelectorAll('.lg-doc').forEach(b=>b.addEventListener('click',()=>{
    last=b; img.src=b.dataset.src; img.alt=b.dataset.cap; cap.textContent=b.dataset.cap;
    lb.hidden=false; document.body.style.overflow='hidden'; x.focus();
  }));
  x.addEventListener('click',close);
  lb.addEventListener('click',e=>{ if(e.target===lb) close(); });
  document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&!lb.hidden) close(); });
})();


// ===== Simulasi cicilan KPR =====
(() => {
  const $ = id => document.getElementById(id);
  const tipe = $('sim-tipe');
  if (!tipe) return;
  const dp = $('sim-dp'), tenor = $('sim-tenor'), bunga = $('sim-bunga');
  const rp = n => 'Rp ' + Math.round(n).toLocaleString('id-ID');
  const sub = () => tipe.selectedOptions[0].dataset.subsidi === '1';
  const nilai = () => {
    const s = sub();
    return {
      harga: +tipe.selectedOptions[0].dataset.harga * 1e6,
      d: Math.min(90, Math.max(s ? 1 : 0, +dp.value || 0)),
      t: Math.min(s ? 20 : 30, Math.max(1, Math.round(+tenor.value) || 1)),
      b: Math.min(30, Math.max(0, +bunga.value || 0))
    };
  };
  const hitung = () => {
    const { harga, d, t, b } = nilai();
    const uangMuka = harga * d / 100, pokok = harga - uangMuka, n = t * 12, r = b / 100 / 12;
    const cicilan = r === 0 ? pokok / n : pokok * r / (1 - Math.pow(1 + r, -n));
    $('sim-cicilan').textContent = rp(cicilan);
    $('sim-harga').textContent = rp(harga);
    $('sim-uang-muka').textContent = rp(uangMuka) + ' (' + d + '%)';
    $('sim-pokok').textContent = rp(pokok);
    $('sim-total').textContent = rp(cicilan * n);
    $('sim-note').textContent = sub()
      ? 'Skema subsidi FLPP: bunga tetap 5% sepanjang tenor, tenor hingga 20 tahun, uang muka mulai 1%. Hanya berlaku bagi pembeli yang memenuhi syarat dan disetujui bank pelaksana; ketentuan pemerintah dapat berubah.'
      : 'Skema KPR bank: uang muka, tenor, dan bunga di atas hanyalah asumsi. Bunga mengikuti kebijakan bank dan dapat berubah selama tenor.';
    const teks = `Halo PT. Amerta Raya Perkasa, saya ingin konsultasi KPR untuk Tipe ${tipe.value} (harga ${rp(harga)}), uang muka ${d}%, tenor ${t} tahun. Estimasi cicilan ${rp(cicilan)} per bulan.`;
    $('sim-wa').href = `https://wa.me/${NOMOR_WA}?text=${encodeURIComponent(teks)}`;
  };
  const preset = () => {
    const s = sub();
    dp.value = s ? 1 : 20; tenor.value = s ? 20 : 15; bunga.value = s ? 5 : 8;
    tenor.max = s ? 20 : 30; dp.min = s ? 1 : 0;
    hitung();
  };
  tipe.addEventListener('change', preset);
  [dp, tenor, bunga].forEach(i => {
    i.addEventListener('input', hitung);
    i.addEventListener('change', () => { const v = nilai(); dp.value = v.d; tenor.value = v.t; bunga.value = v.b; hitung(); });
  });
  preset();
})();
