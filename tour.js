/* Virtual tour outdoor kawasan (Pannellum).
   Geser untuk melihat sekeliling, klik panah untuk "berjalan" maju/mundur.
   Foto saat ini: 1 foto kawasan dan 2 potongan zoom-nya (kawasan-1/2/3.jpg).
   Jika nanti punya foto 360 asli (drone / render 3D), ganti file di SCENES dan ubah FLAT menjadi false. */
(function () {
  var el = document.getElementById('vt-pano');
  if (!el || !window.pannellum) return;

  var FLAT = true;            // true = foto biasa (bukan 360)
  var W = 1400, H = 1488;     // ukuran foto
  var HAOV = 80, VAOV = HAOV * H / W; // sudut pandang foto (derajat)

  // Potongan foto: x0, y0, lebar (piksel pada foto asli) untuk tiap scene
  var SCENES = {
    gerbang: { title: 'Gerbang & jalan utama', img: 'kawasan-1.jpg', crop: [0, 0, 1400] },
    tengah:  { title: 'Tengah kawasan',        img: 'kawasan-2.jpg', crop: [290, 400, 840] },
    ujung:   { title: 'Ujung kawasan',         img: 'kawasan-3.jpg', crop: [490, 540, 440] }
  };

  // Ubah titik piksel foto asli (x,y) menjadi yaw/pitch pada scene tertentu
  function pos(key, x, y) {
    var c = SCENES[key].crop, h = c[2] * H / W;
    return { yaw: ((x - c[0]) / c[2] - 0.5) * HAOV, pitch: (0.5 - (y - c[1]) / h) * VAOV };
  }
  // Panah berpindah: dari scene -> ke scene, diletakkan di jalan (piksel foto asli)
  var LINKS = {
    gerbang: [{ to: 'tengah', x: 715, y: 840, text: 'Maju ke tengah kawasan' }],
    tengah:  [{ to: 'ujung',  x: 715, y: 800, text: 'Maju ke ujung kawasan' }, { to: 'gerbang', back: true, text: 'Mundur ke gerbang' }],
    ujung:   [{ to: 'tengah', back: true, text: 'Mundur' }]
  };
  // Label info pada bangunan (piksel foto asli)
  var INFO = {
    gerbang: [{ x: 250, y: 1060, text: 'Carport & taman depan' }, { x: 1010, y: 950, text: 'Jalan lingkungan beton' }]
  };

  var cfg = { default: { firstScene: 'gerbang', sceneFadeDuration: 900, autoLoad: true, compass: false, showFullscreenCtrl: true, showZoomCtrl: true, mouseZoom: true, hfov: 80, minHfov: 40, maxHfov: 80 }, scenes: {} };

  Object.keys(SCENES).forEach(function (k) {
    var s = SCENES[k], spots = [];
    (LINKS[k] || []).forEach(function (l) {
      var p = l.back ? { yaw: 0, pitch: -VAOV / 2 + 7 } : pos(k, l.x, l.y);
      spots.push({ yaw: p.yaw, pitch: p.pitch, type: 'scene', sceneId: l.to, text: l.text, cssClass: l.back ? 'vt-hot vt-back' : 'vt-hot' });
    });
    (INFO[k] || []).forEach(function (i) {
      var p = pos(k, i.x, i.y);
      spots.push({ yaw: p.yaw, pitch: p.pitch, type: 'info', text: i.text, cssClass: 'vt-info' });
    });
    var sc = { title: s.title, type: 'equirectangular', panorama: s.img, hotSpots: spots, yaw: 0, pitch: 0 };
    if (FLAT) {
      sc.haov = HAOV; sc.vaov = VAOV; sc.vOffset = 0;
      sc.minYaw = -HAOV / 2; sc.maxYaw = HAOV / 2; sc.minPitch = -VAOV / 2; sc.maxPitch = VAOV / 2;
    }
    cfg.scenes[k] = sc;
  });

  var viewer = pannellum.viewer('vt-pano', cfg);

  var bar = document.getElementById('vt-scenes');
  Object.keys(SCENES).forEach(function (k) {
    var b = document.createElement('button');
    b.type = 'button'; b.textContent = SCENES[k].title; b.dataset.scene = k;
    b.addEventListener('click', function () { viewer.loadScene(k); });
    bar.appendChild(b);
  });
  function mark() { var cur = viewer.getScene(); [].forEach.call(bar.children, function (b) { b.classList.toggle('on', b.dataset.scene === cur); }); }
  viewer.on('scenechange', mark); viewer.on('load', mark);

  var tabs = document.querySelectorAll('.vt-tabs button');
  [].forEach.call(tabs, function (t) {
    t.addEventListener('click', function () {
      var map = t.dataset.vt === 'map';
      [].forEach.call(tabs, function (x) { x.setAttribute('aria-selected', x === t ? 'true' : 'false'); });
      document.getElementById('vt-tour').hidden = map;
      document.getElementById('vt-map').hidden = !map;
      bar.hidden = map;
      if (!map) viewer.resize();
    });
  });
})();
