/* Semesta Kita — album 25 foto per layar. GitHub Pages, tanpa dependensi. */
(() => {
  'use strict';
  const config = window.BIRTHDAY_CONFIG;
  const root = document.getElementById('app');
  if (!root || !config) {
    document.body.textContent = 'config.js belum terbaca. Pastikan config.js ada di folder yang sama dengan index.html.';
    return;
  }
  const safe = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));
  const asset = value => {
    const val = String(value || '').trim();
    if (/^https:\/\//i.test(val)) return val;
    if (!val || /^(?:data:|javascript:|\/\/|http:)/i.test(val)) return '';
    return './' + val.replace(/^\.?\/+/, '');
  };
  const photoList = Array.from({length:25}, (_,i) => {
    const item = config.photos?.[i] || {};
    return {
      num:i+1,
      src:asset(item.src || `photos/foto-${String(i+1).padStart(2,'0')}.jpg`),
      caption:String(item.caption || `Kenangan ${i+1}`),
    };
  });
  const target = Date.parse(config.birthdayTimestamp);
  const preview = new URLSearchParams(location.search).get('preview') === '1';
  const unlockedNow = () => preview || (Number.isFinite(target) && Date.now() >= target);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const ILLUSTRATIONS = {"saturn":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 240 200\" role=\"img\" aria-label=\"Planet Saturnus lavender yang tersenyum\">\n  <defs><radialGradient id=\"sat-body\" cx=\"35%\" cy=\"30%\" r=\"80%\"><stop offset=\"0\" stop-color=\"#e4d3ff\"/><stop offset=\"0.6\" stop-color=\"#b896f2\"/><stop offset=\"1\" stop-color=\"#8a62d6\"/></radialGradient></defs>\n  <ellipse cx=\"120\" cy=\"104\" rx=\"108\" ry=\"26\" fill=\"none\" stroke=\"#f7d96b\" stroke-width=\"10\" transform=\"rotate(-16 120 104)\" opacity=\"0.5\" />\n  <circle cx=\"120\" cy=\"100\" r=\"58\" fill=\"url(#sat-body)\" stroke=\"#4a2a85\" stroke-width=\"3\"/>\n  <path d=\"M72 82 Q120 70 168 84\" stroke=\"#fff\" stroke-opacity=\"0.5\" stroke-width=\"5\" fill=\"none\" stroke-linecap=\"round\"/>\n  <path d=\"M66 116 Q120 130 174 114\" stroke=\"#7a4fc9\" stroke-opacity=\"0.5\" stroke-width=\"5\" fill=\"none\" stroke-linecap=\"round\"/>\n  <circle cx=\"100\" cy=\"98\" r=\"5\" fill=\"#3a1f6b\"/><circle cx=\"142\" cy=\"98\" r=\"5\" fill=\"#3a1f6b\"/>\n  <circle cx=\"90\" cy=\"110\" r=\"7\" fill=\"#ffadd2\" opacity=\"0.8\"/><circle cx=\"152\" cy=\"110\" r=\"7\" fill=\"#ffadd2\" opacity=\"0.8\"/>\n  <path d=\"M108 108 Q121 122 134 108\" stroke=\"#3a1f6b\" stroke-width=\"3.5\" fill=\"none\" stroke-linecap=\"round\"/>\n  <path d=\"M14 118 A108 26 -16 0 0 226 90\" fill=\"none\" stroke=\"#f2c53d\" stroke-width=\"10\" stroke-linecap=\"round\" transform=\"rotate(-16 120 104) translate(0 -2)\" opacity=\"0.95\"/>\n</svg>","astronaut":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 160 190\" role=\"img\" aria-label=\"Doodle astronot lucu melayang\">\n  <path d=\"M80 150 C60 175 100 175 120 188\" stroke=\"#4a2a85\" stroke-width=\"2.5\" fill=\"none\" stroke-dasharray=\"5 5\" stroke-linecap=\"round\"/>\n  <rect x=\"48\" y=\"78\" width=\"64\" height=\"62\" rx=\"26\" fill=\"#fffaf0\" stroke=\"#4a2a85\" stroke-width=\"3\"/>\n  <rect x=\"62\" y=\"102\" width=\"36\" height=\"16\" rx=\"6\" fill=\"#d9c4ff\" stroke=\"#4a2a85\" stroke-width=\"2\"/>\n  <circle cx=\"70\" cy=\"110\" r=\"3\" fill=\"#ff8fc0\"/><circle cx=\"90\" cy=\"110\" r=\"3\" fill=\"#f2c53d\"/>\n  <rect x=\"54\" y=\"132\" width=\"20\" height=\"26\" rx=\"10\" fill=\"#fffaf0\" stroke=\"#4a2a85\" stroke-width=\"3\"/>\n  <rect x=\"86\" y=\"132\" width=\"20\" height=\"26\" rx=\"10\" fill=\"#fffaf0\" stroke=\"#4a2a85\" stroke-width=\"3\"/>\n  <rect x=\"22\" y=\"92\" width=\"30\" height=\"16\" rx=\"8\" fill=\"#fffaf0\" stroke=\"#4a2a85\" stroke-width=\"3\" transform=\"rotate(25 37 100)\"/>\n  <rect x=\"108\" y=\"76\" width=\"30\" height=\"16\" rx=\"8\" fill=\"#fffaf0\" stroke=\"#4a2a85\" stroke-width=\"3\" transform=\"rotate(-35 123 84)\"/>\n  <circle cx=\"80\" cy=\"50\" r=\"40\" fill=\"#fffaf0\" stroke=\"#4a2a85\" stroke-width=\"3\"/>\n  <rect x=\"52\" y=\"34\" width=\"56\" height=\"38\" rx=\"19\" fill=\"#5b3aa6\" stroke=\"#4a2a85\" stroke-width=\"3\"/>\n  <path d=\"M60 42 Q68 38 74 42\" stroke=\"#fff\" stroke-opacity=\"0.6\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/>\n  <circle cx=\"70\" cy=\"54\" r=\"3\" fill=\"#fff\"/><circle cx=\"90\" cy=\"54\" r=\"3\" fill=\"#fff\"/>\n  <path d=\"M74 61 Q80 66 86 61\" stroke=\"#fff\" stroke-width=\"2.5\" fill=\"none\" stroke-linecap=\"round\"/>\n  <line x1=\"80\" y1=\"10\" x2=\"80\" y2=\"1\" stroke=\"#4a2a85\" stroke-width=\"3\" stroke-linecap=\"round\"/>\n  <circle cx=\"80\" cy=\"3\" r=\"4\" fill=\"#ff8fc0\" stroke=\"#4a2a85\" stroke-width=\"2\"/>\n</svg>","sparkle":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 40 40\" aria-hidden=\"true\"><path d=\"M20 2 Q22 18 38 20 Q22 22 20 38 Q18 22 2 20 Q18 18 20 2Z\" fill=\"#f2c53d\" stroke=\"#4a2a85\" stroke-width=\"1.5\" stroke-linejoin=\"round\"/></svg>"};
  const art = (name, className = '') => (ILLUSTRATIONS[name] || '').replace('<svg ', `<svg class="${className}" `);
  const chapterData = [
    {name:'Our sunny days',kind:'polaroid',eyebrow:'01 / Polaroid',subtitle:'Dari sekian banyak hari, tiga ini selalu bikin senyum.',cta:'Coba lihat yang berikutnya ↗'},
    {name:'Just take a cutesy photo',kind:'booth',eyebrow:'02 / Photobooth',subtitle:'Pokoknya gaya aja duluuu.',cta:'Hayuu, lanjut dulu 😭'},
    {name:'Sedikit berantakan',kind:'scrap',eyebrow:'03 / Scrapbook',subtitle:'Nggak selalu sempurna, tapi selalu berkesan.',cta:'Buka halaman selanjutnya ↗'},
    {name:'Random Scnene!',kind:'film',eyebrow:'04 / Film strip',subtitle:'Masih inget adegan-adegan ini?.',cta:'Putar adegan berikutnya 🎬'},
    {name:'Dikirim dari ingatan',kind:'post',eyebrow:'05 / Kartu pos',subtitle:'versi hp kok jadi gini yaa? kamu buka pake apa? versi desktop lebih better bagus.',cta:'Ada pesan dari bintang ✉'},
    {name:'Ini random banget sii',kind:'stars',eyebrow:'06 / Rasi bintang',subtitle:'Mungkin fotonya banyak, tapi favoritku tetap orangnya ea ea eaaa. Btw ini juga versi desktop disarankan.',cta:'Eh, masih ada satu pesan ♡'},
  ];
  const sets = [[0,1,2],[3,4,5,6],[7,8,9,10],[11,12,13,14,15],[16,17,18],[19,20,21,22,23,24]];
  // Transisi kejutan. Dua pertama dibuat pasti (CRASH -> 404), sisanya acak.
  const transitions = [
    {kind:'crash', eyebrow:'LAPORAN DARI GALAKSI', title:'CRASH! 💥', message:'Memori penuh. Isinya kamu semua.', tiny:'Tenang, ini cuma drama website. 😂', icon:'💥'},
    {kind:'error404', eyebrow:'UPS... SALAH ALAMAT', title:'KOK HILANG?!', message:'Sikap jaim tidak ditemukan.', tiny:'Yang ditemukan malah foto kita lagi. 💜', icon:'🫠'},
    {kind:'potato', eyebrow:'MOHON BERSABAR', title:'LOADING KENTANG...', message:'Otaknya sedang dipanaskan.', tiny:'Kualitas kentang: 11/10', icon:'🥔'},
    {kind:'alien', eyebrow:'BERITA ANTARIKSA', title:'DICULIK ALIEN?!', message:'Katanya mau pinjam foto kita.', tiny:'Bentar, UFO-nya parkir dulu.', icon:'🛸'},
    {kind:'rocket', eyebrow:'KECEPATAN BERLEBIH', title:'WUSSS! 🚀', message:'Roketnya malah kebablasan.', tiny:'Putar balik dalam 3... eh udah!', icon:'🚀'},
    {kind:'popup', eyebrow:'PERINGATAN PALSU', title:'VIRUS SAYANG!', message:'Terdeteksi salting tingkat tinggi.', tiny:'Tidak berbahaya. Cuma bikin senyum.', icon:'💗'},
    {kind:'popcorn', eyebrow:'IKLAN TIDAK PENTING', title:'JEDA IKLAN 🍿', message:'Pesan sponsor: kamu lucu banget.', tiny:'Skip? Nggak bisa. Bercanda, lanjut yuk!', icon:'🍿'},
    {kind:'frog', eyebrow:'PERMISI NUMPANG LEWAT', title:'BOING! 🐸', message:'Ada kodok loncat dari galaksi sebelah.', tiny:'Maaf mengganggu keuwuan.', icon:'🐸'},
  ];
  let transitionCount = 0;
  let page = 0; // 0 pembuka, 1-6 galeri, 7 surat
  let transitioning = false;
  let previousEffect = -1;
  let timer = null;
  const isLongTitle = v => String(v ?? '').length > 80;
  const photoCard = (i, extra='') => {
    const p=photoList[i];
    return `<div class="memory ${extra}">
      <button type="button" class="memory-photo" data-photo="${i}" aria-label="Perbesar foto ${p.num}: ${safe(p.caption)}">
        <span class="image-wrap"><img src="${safe(p.src)}" loading="eager" decoding="async" alt="${safe(p.caption)}"><span class="missing-image" aria-hidden="true"><span class="missing-spark">✧</span><span class="missing-count">${String(p.num).padStart(2,'0')}</span><span class="missing-hint">tempat foto kita</span></span></span>
        <span class="zoom-icon" aria-hidden="true">↗</span>
      </button>
      <span class="photo-caption">${safe(p.caption)}</span>
    </div>`;
  };
  const photoLayouts = [
    (v) => `<div class="album-layout layout-polaroid"><div class="polaroid-main">${photoCard(v[0])}</div><div class="polaroid-top">${photoCard(v[1])}</div><div class="polaroid-bottom">${photoCard(v[2])}</div><span class="doodle doodle-polaroid">♡</span></div>`,
    (v) => `<div class="album-layout layout-booth">${[0,1].map(j=>`<div class="booth-strip"><span class="booth-label">KITA / PHOTOBOOTH <span>✦</span></span>${photoCard(v[j*2])}${photoCard(v[j*2+1])}<span class="booth-tail">made with <span>♡</span></span></div>`).join('')}<span class="doodle doodle-booth">say cheese !</span></div>`,
    (v) => `<div class="album-layout layout-scrap"><span class="paper-tape tape-one"></span><span class="paper-tape tape-two"></span>${v.map((i,j)=>`<div class="scrap-cell sc-${j}">${photoCard(i)}</div>`).join('')}<span class="doodle doodle-scrap">our little chaos ✿</span></div>`,
    (v) => `<div class="album-layout layout-film"><div class="film-ribbon"><div class="perforation"></div><div class="film-grid">${v.map((i,j)=>`<div class="film-cell">${photoCard(i)}<span class="film-count">0${j+1}</span></div>`).join('')}</div><div class="perforation"></div></div><span class="doodle doodle-film">scene by scene ✧</span></div>`,
    (v) => `<div class="album-layout layout-post">${v.map((i,j)=>`<div class="postcard card-${j}"><span class="post-stamp">✿<small>LOVE<br>MAIL</small></span>${photoCard(i)}<span class="post-foot">sent with ♡</span></div>`).join('')}</div>`,
    (v) => `<div class="album-layout layout-stars">${v.map((i,j)=>`<div class="star-memory sm-${j}">${photoCard(i)}</div>`).join('')}<span class="constellation-star s-one">✦</span><span class="constellation-star s-two">✧</span><span class="constellation-star s-three">✦</span></div>`
  ];
  const planet = `<div class="hero-planet" aria-hidden="true"><span class="planet-halo"></span>${art('saturn','planet-svg')}${art('astronaut','astronaut-svg')}<span class="planet-doodle p1">✧</span><span class="planet-doodle p2">✦</span><span class="planet-doodle p3">♡</span></div>`;
  const hero = () => `<section class="screen intro-screen" aria-label="Pembuka dan hitung mundur">
      <div class="hero-grid"><div class="intro-copy"><div class="chapter-overline">A little universe, just for you · ✦</div><div class="salutation">Hai, ${safe(config.friendName)} ♡</div><h1>Little<br><i>Saturn</i><span class="title-spark">✳</span></h1><p class="intro-desc">This is special for you to see, a random thing hehehe.</p></div>${planet}</div>
      <div class="countdown-panel"><span class="countdown-label" id="countdown-label">Menunggu hari spesialmu…</span><div class="countdown-values" id="countdown-values"></div><div class="countdown-foot" id="countdown-foot"></div></div>
      <div class="screen-action" id="intro-action" hidden><button class="continue-btn" type="button" data-step="forward">Buka album kita <span>↗</span></button></div>
      ${preview ? '<span class="preview-mark">MODE PRATINJAU</span>' : ''}
    </section>`;
  const gallery = i => `<section class="screen gallery-screen gallery-${chapterData[i].kind}" aria-label="${safe(chapterData[i].name)}">
    <div class="screen-heading"><div class="chapter-overline">${safe(chapterData[i].eyebrow)} <span class="dot">·</span> ${String(sets[i].length).padStart(2,'0')} foto</div><h2>${safe(chapterData[i].name)}</h2><p>${safe(chapterData[i].subtitle)}</p></div>
    <div class="layout-host">${photoLayouts[i](sets[i])}</div>
    <div class="screen-action"><button class="continue-btn" type="button" data-step="forward">${safe(chapterData[i].cta)} <span aria-hidden="true">↗</span></button></div>
  </section>`;
  const letter = () => `<section class="screen letter-screen" aria-label="Surat ulang tahun">
    <div class="screen-heading"><div class="chapter-overline">07 / Sampai di ujung semesta</div><h2>Satu hal lagi… ♡</h2><p>Sebelum selesai, aku mau bilang ini.</p></div>
    <div class="letter-scroll"><article class="letter-paper"><span class="letter-tag">💌 UNTUK ${safe(config.friendName).toUpperCase()}</span><h3>${safe(config.letter?.title || 'Untukmu')}</h3><div class="letter-text">${(config.letter?.paragraphs || []).map(p=>`<p>${safe(p)}</p>`).join('')}</div><p class="letter-end">${safe(config.letter?.closing || 'Dengan sayang,')}<br><strong>${safe(config.senderName)}</strong></p><span class="letter-sticker">♡</span></article></div>
    <div class="screen-action"><button class="continue-btn return-btn" type="button" data-step="restart">↶ Kembali ke Awal</button></div>
  </section>`;
  root.innerHTML = `<div class="ambient" aria-hidden="true"><span class="amb-dot ad-1">✦</span><span class="amb-dot ad-2">✳</span><span class="amb-dot ad-3">✧</span></div>
    <header class="site-header"><div class="logo"><span>✳</span> Little saturn <span class="logo-period">.</span></div><div class="music-cluster"><span id="music-feedback" role="status" aria-live="polite"></span><button id="music-control" type="button" class="music-control" aria-label="Putar musik" aria-pressed="false"><span id="music-icon">▶</span><span id="music-text">Play</span></button></div></header>
    <main id="screen-root" class="screen-root"></main><div id="screen-counter" class="screen-counter" aria-live="polite"></div>
    <div id="transition-cover" class="transition-cover" hidden aria-hidden="true"></div>
    <dialog id="photo-dialog" class="photo-dialog"><div class="dialog-card"><button class="dialog-close" type="button" aria-label="Tutup foto">✕</button><div class="dialog-visual image-wrap"></div><div class="dialog-caption"></div></div></dialog>
    <audio id="bg-audio" preload="none" loop></audio>`;
  const screenRoot = document.getElementById('screen-root');
  const cover = document.getElementById('transition-cover');
  const counter = document.getElementById('screen-counter');
  const music = document.getElementById('bg-audio');
  const musicControl = document.getElementById('music-control');
  const musicText = document.getElementById('music-text');
  const musicIcon = document.getElementById('music-icon');
  const musicFeedback = document.getElementById('music-feedback');
  const dialog = document.getElementById('photo-dialog');
  function updateBrokenImages(scope) {
    scope.querySelectorAll('.image-wrap img').forEach(img=>{
      const setMissing = () => img.closest('.image-wrap')?.classList.add('is-missing');
      img.addEventListener('error',setMissing,{once:true});
      if (img.complete && img.naturalWidth === 0) setMissing();
    });
  }
  function render() {
    screenRoot.innerHTML = page === 0 ? hero() : page === 7 ? letter() : gallery(page-1);
    screenRoot.classList.remove('entering');
    void screenRoot.offsetWidth;
    screenRoot.classList.add('entering');
    counter.innerHTML = page === 0 ? '<span>✧ &nbsp; sebuah hadiah kecil</span>' : page === 7 ? '<span>♡ &nbsp; akhir yang manis</span>' : `<span>${page} <em>/ 6</em></span><div class="progress-dots">${Array.from({length:6},(_,i)=>`<i class="${i === page-1 ? 'active' : ''}"></i>`).join('')}</div>`;
    updateBrokenImages(screenRoot);
    if (page === 0) drawCountdown();
  }
  function drawCountdown() {
    if (page !== 0) return;
    const values = document.getElementById('countdown-values');
    const label = document.getElementById('countdown-label');
    const foot = document.getElementById('countdown-foot');
    const action = document.getElementById('intro-action');
    if (!values || !label || !foot || !action) return;
    if (!Number.isFinite(target)) { values.textContent = 'Periksa tanggal di config.js';return; }
    const isBirthday = Date.now() >= target;
    const open = unlockedNow();
    action.hidden = !open;
    if (open) {
      label.textContent = isBirthday ? 'Selamat ulang tahun! 🎂' : 'Psst… kamu sedang melihat pratinjau!';
      values.innerHTML = `<span class="birthday-greeting">${isBirthday ? 'Hari ini, semesta merayakan kamu ♡' : 'Seluruh album bisa kamu jelajahi ♡'}</span>`;
      foot.textContent = isBirthday ? 'Semoga senyumnya banyak hari ini.' : 'Link biasa tetap terkunci sampai tanggal ulang tahun.';
      return;
    }
    const delta = Math.max(0,Math.ceil((target - Date.now())/1000));
    const vals = [Math.floor(delta/86400),Math.floor(delta%86400/3600),Math.floor(delta%3600/60),delta%60];
    values.innerHTML = vals.map((v,i)=>`<div class="clock-piece"><strong>${String(v).padStart(2,'0')}</strong><small>${['hari','jam','menit','detik'][i]}</small></div>`).join('');
    foot.textContent='Albumnya terbuka 27 Oktober 2026 · 00.00 WIB';
  }
  function pickTransition() {
    // Pertama CRASH, kedua 404. Sesudah itu random tanpa efek sama dua kali berturut.
    if (transitionCount < 2) {
      const selected = transitions[transitionCount];
      previousEffect = transitionCount;
      transitionCount += 1;
      return selected;
    }
    let index = Math.floor(Math.random() * (transitions.length - 1));
    if (index >= previousEffect) index += 1;
    previousEffect = index;
    transitionCount += 1;
    return transitions[index];
  }
  function transitionMarkup(effect) {
    let visual = '';
    switch (effect.kind) {
      case 'crash':
        visual = `<div class="fake-chrome"><span>● ● ●</span><strong>memories.exe</strong><span>×</span></div><div class="transition-graphic crash-graphic"><span class="crash-emoji">💥</span><span class="crash-bits">✳ &nbsp; ✦ &nbsp; ✳</span></div>`;
        break;
      case 'error404':
        visual = `<div class="transition-graphic error-graphic"><span class="error-big">404</span><span class="error-small">JAIM_NOT_FOUND</span></div>`;
        break;
      case 'potato':
        visual = `<div class="transition-graphic"><span class="transition-mascot">🥔</span><div class="potato-progress"><span></span></div><span class="progress-caption">menyiapkan kenangan...</span></div>`;
        break;
      case 'alien':
        visual = `<div class="transition-graphic ufo-graphic"><span class="transition-mascot">🛸</span><span class="ufo-beam"></span><span class="ufo-cargo">♡</span></div>`;
        break;
      case 'rocket':
        visual = `<div class="transition-graphic rocket-graphic"><span class="speed-line speed-one"></span><span class="transition-mascot">🚀</span><span class="speed-line speed-two"></span></div>`;
        break;
      case 'popup':
        visual = `<div class="transition-graphic popup-graphic"><span class="mini-window back">♡ ERROR CINTA ♡</span><span class="mini-window front">💗 Salting detected!</span><span class="popup-heart">💕</span></div>`;
        break;
      case 'rewind':
        visual = `<div class="transition-graphic rewind-graphic"><span class="transition-mascot">📼</span><span class="rewind-spin">⏪</span></div>`;
        break;
      case 'popcorn':
        visual = `<div class="transition-graphic popcorn-graphic"><span class="transition-mascot">🍿</span><span class="ad-tag">IKLAN PALSU · 0:01</span></div>`;
        break;
      case 'frog':
        visual = `<div class="transition-graphic frog-graphic"><span class="transition-mascot">🐸</span><span class="frog-shadow"></span></div>`;
        break;
      default:
        visual = `<div class="transition-graphic"><span class="transition-mascot">${safe(effect.icon)}</span></div>`;
    }
    return `<div class="transition-confetti" aria-hidden="true"><span>✧</span><span>✳</span><span>♡</span><span>✦</span></div><div class="transition-card"><div class="transition-eyebrow">${safe(effect.eyebrow)}</div>${visual}<h2 class="transition-heading">${safe(effect.title)}</h2><p class="transition-message">${safe(effect.message)}</p><span class="transition-tiny">${safe(effect.tiny)}</span></div>`;
  }
  function move(action) {
    if (transitioning) return;
    if (action === 'forward' && (!unlockedNow() || page >= 7)) return;
    if (action !== 'forward' && action !== 'restart') return;
    transitioning = true;
    const next = action === 'restart' ? 0 : page + 1;
    const effect = action === 'restart'
      ? {kind:'rewind', eyebrow:'ULANG DARI AWAL', title:'REWIND DULU! ⏪', message:'Kenangannya masih boleh diputar lagi.', tiny:'Putaran kedua lebih seru. 💜', icon:'📼'}
      : pickTransition();
    const swap = () => {page = next; render();};
    if (reduced.matches) {swap(); transitioning = false; return;}
    cover.innerHTML = transitionMarkup(effect);
    cover.hidden = false;
    cover.className = `transition-cover effect-${effect.kind}`;
    requestAnimationFrame(() => cover.classList.add('active'));
    setTimeout(() => {
      swap();
      cover.classList.add('leaving');
      setTimeout(() => {
        cover.hidden = true;
        cover.className = 'transition-cover';
        cover.innerHTML = '';
        transitioning = false;
      }, 350);
    }, 1550);
  }
  function enlarge(index) {
    const p=photoList[index];
    if (!p || !unlockedNow()) return;
    const visual = dialog.querySelector('.dialog-visual');
    visual.className = 'dialog-visual image-wrap';
    visual.innerHTML = `<img src="${safe(p.src)}" alt="${safe(p.caption)}"><div class="missing-image"><span class="missing-spark">✧</span><span class="missing-count">${String(p.num).padStart(2,'0')}</span><span class="missing-hint">foto belum di-upload</span></div>`;
    dialog.querySelector('.dialog-caption').innerHTML = `<span>${String(p.num).padStart(2,'0')} / 25</span><strong>${safe(p.caption)}</strong>`;
    updateBrokenImages(dialog);
    if (!dialog.open) dialog.showModal();
  }
  document.addEventListener('click', e=>{
    const button = e.target.closest('[data-step]');
    if (button) return move(button.dataset.step);
    const image = e.target.closest('[data-photo]');
    if (image) return enlarge(Number(image.dataset.photo));
  });
  dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if (e.target === dialog) dialog.close();});
  function updateAudio() {
    const playing = !music.paused;
    musicText.textContent=playing?'Pause':'Play';
    musicIcon.textContent=playing?'Ⅱ':'▶';
    musicControl.setAttribute('aria-label',playing?'Jeda musik':'Putar musik');
    musicControl.setAttribute('aria-pressed',String(playing));
    musicControl.classList.toggle('playing',playing);
  }
  musicControl.addEventListener('click',async()=>{
    musicFeedback.textContent='';
    try {
      if (music.paused) {
        if (!music.getAttribute('src')) music.src=asset(config.song?.url || 'audio/lagu.mp3');
        await music.play();
      } else music.pause();
    } catch(e) {musicFeedback.textContent='Lagu belum ada di folder audio.';}
    updateAudio();
  });
  music.addEventListener('play',updateAudio);
  music.addEventListener('pause',updateAudio);
  music.addEventListener('error',()=>{musicFeedback.textContent='Upload audio/lagu.mp3 dahulu.';updateAudio();});
  render();
  timer=setInterval(drawCountdown,1000);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)drawCountdown()});
})();
