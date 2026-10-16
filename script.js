/* Semesta Kita — HTML/CSS/JS murni untuk GitHub Pages. */
(() => {
  'use strict';
  const config = window.BIRTHDAY_CONFIG;
  const app = document.getElementById('app');
  if (!config || !app) {
    document.body.textContent = 'config.js tidak terbaca. Upload config.js bersama index.html.';
    return;
  }
  const target = Date.parse(config.birthdayTimestamp);
  const photos = Array.from({ length: 25 }, (_, i) => {
    const item = config.photos?.[i] || {};
    return {
      src: String(item.src || `photos/foto-${String(i + 1).padStart(2, '0')}.jpg`),
      caption: String(item.caption || `Kenangan #${i + 1}`),
      number: i + 1,
    };
  });
  let revealed = false;
  let audio;
  let audioPlaying = false;
  let musicError = '';
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
  const pathToUrl = value => {
    const val = String(value || '').trim();
    if (/^https:\/\//i.test(val)) return val;
    if (/^(?:javascript:|data:|\/\/)/i.test(val)) return '';
    return './' + val.replace(/^\.?\/+/, '');
  };
  const isUnlocked = () => Number.isFinite(target) && Date.now() >= target;
  const ILLUSTRATIONS = {"saturn":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 240 200\" role=\"img\" aria-label=\"Planet Saturnus lavender yang tersenyum\">\n  <defs><radialGradient id=\"sat-body\" cx=\"35%\" cy=\"30%\" r=\"80%\"><stop offset=\"0\" stop-color=\"#e4d3ff\"/><stop offset=\"0.6\" stop-color=\"#b896f2\"/><stop offset=\"1\" stop-color=\"#8a62d6\"/></radialGradient></defs>\n  <ellipse cx=\"120\" cy=\"104\" rx=\"108\" ry=\"26\" fill=\"none\" stroke=\"#f7d96b\" stroke-width=\"10\" transform=\"rotate(-16 120 104)\" opacity=\"0.5\" />\n  <circle cx=\"120\" cy=\"100\" r=\"58\" fill=\"url(#sat-body)\" stroke=\"#4a2a85\" stroke-width=\"3\"/>\n  <path d=\"M72 82 Q120 70 168 84\" stroke=\"#fff\" stroke-opacity=\"0.5\" stroke-width=\"5\" fill=\"none\" stroke-linecap=\"round\"/>\n  <path d=\"M66 116 Q120 130 174 114\" stroke=\"#7a4fc9\" stroke-opacity=\"0.5\" stroke-width=\"5\" fill=\"none\" stroke-linecap=\"round\"/>\n  <circle cx=\"100\" cy=\"98\" r=\"5\" fill=\"#3a1f6b\"/><circle cx=\"142\" cy=\"98\" r=\"5\" fill=\"#3a1f6b\"/>\n  <circle cx=\"90\" cy=\"110\" r=\"7\" fill=\"#ffadd2\" opacity=\"0.8\"/><circle cx=\"152\" cy=\"110\" r=\"7\" fill=\"#ffadd2\" opacity=\"0.8\"/>\n  <path d=\"M108 108 Q121 122 134 108\" stroke=\"#3a1f6b\" stroke-width=\"3.5\" fill=\"none\" stroke-linecap=\"round\"/>\n  <path d=\"M14 118 A108 26 -16 0 0 226 90\" fill=\"none\" stroke=\"#f2c53d\" stroke-width=\"10\" stroke-linecap=\"round\" transform=\"rotate(-16 120 104) translate(0 -2)\" opacity=\"0.95\"/>\n</svg>","astronaut":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 160 190\" role=\"img\" aria-label=\"Doodle astronot lucu melayang\">\n  <path d=\"M80 150 C60 175 100 175 120 188\" stroke=\"#4a2a85\" stroke-width=\"2.5\" fill=\"none\" stroke-dasharray=\"5 5\" stroke-linecap=\"round\"/>\n  <rect x=\"48\" y=\"78\" width=\"64\" height=\"62\" rx=\"26\" fill=\"#fffaf0\" stroke=\"#4a2a85\" stroke-width=\"3\"/>\n  <rect x=\"62\" y=\"102\" width=\"36\" height=\"16\" rx=\"6\" fill=\"#d9c4ff\" stroke=\"#4a2a85\" stroke-width=\"2\"/>\n  <circle cx=\"70\" cy=\"110\" r=\"3\" fill=\"#ff8fc0\"/><circle cx=\"90\" cy=\"110\" r=\"3\" fill=\"#f2c53d\"/>\n  <rect x=\"54\" y=\"132\" width=\"20\" height=\"26\" rx=\"10\" fill=\"#fffaf0\" stroke=\"#4a2a85\" stroke-width=\"3\"/>\n  <rect x=\"86\" y=\"132\" width=\"20\" height=\"26\" rx=\"10\" fill=\"#fffaf0\" stroke=\"#4a2a85\" stroke-width=\"3\"/>\n  <rect x=\"22\" y=\"92\" width=\"30\" height=\"16\" rx=\"8\" fill=\"#fffaf0\" stroke=\"#4a2a85\" stroke-width=\"3\" transform=\"rotate(25 37 100)\"/>\n  <rect x=\"108\" y=\"76\" width=\"30\" height=\"16\" rx=\"8\" fill=\"#fffaf0\" stroke=\"#4a2a85\" stroke-width=\"3\" transform=\"rotate(-35 123 84)\"/>\n  <circle cx=\"80\" cy=\"50\" r=\"40\" fill=\"#fffaf0\" stroke=\"#4a2a85\" stroke-width=\"3\"/>\n  <rect x=\"52\" y=\"34\" width=\"56\" height=\"38\" rx=\"19\" fill=\"#5b3aa6\" stroke=\"#4a2a85\" stroke-width=\"3\"/>\n  <path d=\"M60 42 Q68 38 74 42\" stroke=\"#fff\" stroke-opacity=\"0.6\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/>\n  <circle cx=\"70\" cy=\"54\" r=\"3\" fill=\"#fff\"/><circle cx=\"90\" cy=\"54\" r=\"3\" fill=\"#fff\"/>\n  <path d=\"M74 61 Q80 66 86 61\" stroke=\"#fff\" stroke-width=\"2.5\" fill=\"none\" stroke-linecap=\"round\"/>\n  <line x1=\"80\" y1=\"10\" x2=\"80\" y2=\"1\" stroke=\"#4a2a85\" stroke-width=\"3\" stroke-linecap=\"round\"/>\n  <circle cx=\"80\" cy=\"3\" r=\"4\" fill=\"#ff8fc0\" stroke=\"#4a2a85\" stroke-width=\"2\"/>\n</svg>","sparkle":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 40 40\" aria-hidden=\"true\"><path d=\"M20 2 Q22 18 38 20 Q22 22 20 38 Q18 22 2 20 Q18 18 20 2Z\" fill=\"#f2c53d\" stroke=\"#4a2a85\" stroke-width=\"1.5\" stroke-linejoin=\"round\"/></svg>"};
  const art = (name, className = '') => (ILLUSTRATIONS[name] || '').replace('<svg ', `<svg class="${className}" `);
  const decorations = () => `<div class="planet-art" aria-hidden="true">
    ${art('saturn','saturn floating')}${art('astronaut','astronaut floating')}
    ${art('sparkle','sparkle sparkle-a')}${art('sparkle','sparkle sparkle-b')}
  </div>`;

  // Dekorasi tetap tersedia offline, tanpa folder assets.
  const stars = document.getElementById('starfield');
  for (let i = 0; i < 54; i++) {
    const star = document.createElement('span');
    const rand = n => { const x = Math.sin(n * 93.21) * 43758.5453; return x - Math.floor(x); };
    star.style.left = `${rand(i + 10) * 100}%`;
    star.style.top = `${rand(i + 67) * 100}%`;
    star.style.width = star.style.height = `${2 + rand(i + 104) * 5}px`;
    star.style.animationDelay = `${rand(i + 202) * 5}s`;
    star.style.background = ['#ffffff','#f2c53d','#ed9ccd','#a48ad5'][i % 4];
    stars?.append(star);
  }

  const photo = (i, label = 'Lihat foto lebih besar') => {
    const p = photos[i];
    return `<button class="photo-tile" type="button" data-open-photo="${i}" aria-label="${esc(label)}: foto ${p.number}, ${esc(p.caption)}">
      <span class="photo-image"><img src="${esc(pathToUrl(p.src))}" loading="lazy" alt="${esc(p.caption)}" decoding="async">
        <span class="photo-placeholder" aria-hidden="true"><span class="placeholder-star">✦</span><strong>Foto ${String(p.number).padStart(2,'0')}</strong><small>photos/foto-${String(p.number).padStart(2,'0')}.jpg</small></span>
      </span>
      <span class="photo-zoom" aria-hidden="true">↗</span>
    </button>`;
  };

  let stage;
  let unlocked = false;
  let chapter = 0;
  let isTransitioning = false;
  let lastEffect = -1;
  const preview = new URLSearchParams(window.location.search).get('preview') === '1';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const chapters = [
    {title:'Tiga yang pertama', sub:'01—03 · Polaroid', desc:'Ini bukan bukti kita fotogenik. Tapi tetap aku simpan. 😭', action:'📸 Jepret lagi, tapi jangan kedip!', style:'polaroid'},
    {title:'Senyum dulu, cekrek!', sub:'04—07 · Photobooth', desc:'Empat foto, ekspresi kita makin mencurigakan.', action:'🫣 Awas, ada yang salting!', style:'booth'},
    {title:'Random tapi favorit', sub:'08—11 · Scrapbook', desc:'Foto boleh berantakan, yang penting orangnya sama.', action:'🛸 Diculik alien dulu bentar', style:'scrap'},
    {title:'Film paling nggak jelas', sub:'12—16 · Film roll', desc:'Kita pemeran utama. Budget filmnya: dua cilok.', action:'🎬 CUT! Aktornya kabur!', style:'film'},
    {title:'Kartu pos nyasar', sub:'17—19 · Postcard', desc:'Dikirim dari tempat yang isinya cuma kenangan kita.', action:'💌 Kirim ke planet sebelah', style:'postcard'},
    {title:'Kita di antara bintang', sub:'20—25 · Rasi bintang', desc:'Bintang banyak. Tapi album ini cuma tentang kita.', action:'✨ Bintangnya pada rusuh!', style:'stars'},
  ];
  const frames = [[0,1,2],[3,4,5,6],[7,8,9,10],[11,12,13,14,15],[16,17,18],[19,20,21,22,23,24]];
  const effects = [
    {name:'boing', emoji:'🐸', title:'BOING!', note:'Kodok antariksa ikut campur.'},
    {name:'error', emoji:'🤡', title:'ERROR 404: JAIM NOT FOUND', note:'Ketahuan senyum sendiri, ya?'},
    {name:'orbit', emoji:'🪐', title:'NYASAR KE PLANET LAIN', note:'Tenang, GPS-nya pake perasaan.'},
    {name:'toss', emoji:'🧻', title:'FOTO-NYA TERBANGGG', note:'Anginnya dari mana coba 😭'},
    {name:'stamp', emoji:'💌', title:'DI-STEMPEL GEMES', note:'Dilarang protes, capnya permanen.'},
    {name:'shake', emoji:'🥔', title:'LOADING KENTANG…', note:'Kentang ini sedang bekerja keras.'},
    {name:'rocket', emoji:'🚀', title:'WUSSS KEBABLASAN!', note:'Ups… ini masih jalurnya, kok.'},
  ];

  const head = (chapterInfo, i) => `<div class="chapter-heading">
      <div class="eyebrow">${esc(chapterInfo.sub)}</div>
      <h2>${esc(chapterInfo.title)}</h2>
      <p>${esc(chapterInfo.desc)}</p>
    </div>`;
  const footer = (buttonText, isEnd = false) => `<div class="scene-footer">
    <span class="scene-mini">${isEnd ? 'udah sampai ujung semesta ♡' : 'Ketuk foto untuk melihat lebih dekat ✨'}</span>
    <button type="button" class="surprise-button" data-go="${isEnd ? 'restart' : 'advance'}">${esc(buttonText)} <span aria-hidden="true">✦</span></button>
  </div>`;
  const figure = (n, cls = '') => `<div class="memory-photo ${cls}">${photo(n)}<span class="memory-caption" title="${esc(photos[n].caption)}">${esc(photos[n].caption)}</span></div>`;

  const bodyOfChapter = (i) => {
    if (i === 0) return `<div class="photo-stage polaroid-stage" aria-label="Tiga foto bergaya polaroid">
      ${frames[i].map((n,k) => `<div class="polaroid" style="--i:${k}"><span class="tape"></span>${figure(n)}<span class="polaroid-mark">♡ 0${k+1}</span></div>`).join('')}
      <span class="float-note">kok lucu ya kita?? ↗</span>
    </div>`;
    if (i === 1) return `<div class="photo-stage booth-stage-new" aria-label="Empat foto photobooth">
      <div class="booth-sticker-new">SAY CHEESE! 📷</div>
      ${[0,1].map(k => `<div class="booth-column" style="--tilt:${k ? 4 : -4}deg"><div class="booth-title">KITA . PHOTOBOOTH ✷</div>
        ${frames[i].slice(k*2,k*2+2).map(n => figure(n,'booth-memory')).join('')}
        <div class="booth-bottom">♥ &nbsp; one more, please! &nbsp; ♥</div>
      </div>`).join('')}
      <div class="booth-star">✳</div>
    </div>`;
    if (i === 2) return `<div class="photo-stage scrapbook-stage" aria-label="Empat foto scrapbook">
      <span class="scrap-decoration deco-a">✿</span><span class="scrap-decoration deco-b">♡</span>
      ${frames[i].map((n,k) => `<div class="scrap-photo scrap-n-${k+1}"><span class="pin" aria-hidden="true"></span>${figure(n)}</div>`).join('')}
      <span class="scrap-label">ketempel terus<br>di ingatan ♡</span>
    </div>`;
    if (i === 3) return `<div class="photo-stage cinema-stage" aria-label="Lima foto rol film">
      <div class="sprocket top"></div>
      <div class="film-memories">${frames[i].map((n,k) => `<div class="film-photo"><span class="frame-counter">FRAME 0${k+1}</span>${figure(n)}</div>`).join('')}</div>
      <div class="sprocket bottom"></div>
    </div>`;
    if (i === 4) return `<div class="photo-stage postcards-stage" aria-label="Tiga foto kartu pos">
      ${frames[i].map((n,k) => `<div class="postcard-new card-${k+1}"><div class="stamp">✳<small>OUR DAYS</small></div>
      ${figure(n)}<span class="postcard-line">Wish you were here ♡</span></div>`).join('')}
      <span class="postal-mark">PRIORITY MAIL ✦</span>
    </div>`;
    return `<div class="photo-stage constellations-stage" aria-label="Enam foto di antara bintang">
      <span class="asterism star-a">✦</span><span class="asterism star-b">✷</span><span class="asterism star-c">✳</span>
      ${frames[i].map((n,k) => `<div class="star-card star-card-${k+1}">${figure(n)}</div>`).join('')}
    </div>`;
  };
  const chapterScene = i => `<section class="scene chapter-scene scene-${chapters[i].style}" data-chapter="${i+1}" aria-label="${esc(chapters[i].title)}">
    ${head(chapters[i],i)}
    ${bodyOfChapter(i)}
    ${footer(chapters[i].action)}
  </section>`;

  const heroScene = () => `<section class="scene hero-scene" id="awal" aria-label="Pembuka dan hitung mundur">
    <div class="hero-center">
      <p class="hero-kicker">A little universe, just for you ✦</p>
      ${decorations()}
      <div class="hero-copy"><span class="hero-hello">Hai, ${esc(config.friendName)} ♡</span><h1>Semesta <em>Kita</em></h1>
      <p>25 foto kita berdua. Satu hadiah kecil yang sengaja dibuat agak nggak waras. 💜</p></div>
      <div class="countdown-panel" id="countdown-panel"><p class="countdown-caption" id="countdown-caption">Kejutannya terbuka dalam...</p>
      <div id="countdown" class="countdown-grid" role="timer" aria-live="off"></div>
      <p id="countdown-help" class="countdown-help">Album baru bisa dibuka tanggal 27 Oktober 2026, pukul 00.00 WIB.</p></div>
      ${preview ? '<p class="preview-chip">👀 MODE PRATINJAU • hanya untuk mengecek tampilan</p>' : ''}
    </div>
    <div class="scene-footer hero-footer" id="hero-footer" hidden>
      <span class="scene-mini">Ada 25 foto dan 7 kejutan kecil di depan…</span>
      <button class="surprise-button" type="button" data-go="advance">🚀 Gas ke album kita! <span aria-hidden="true">✦</span></button>
    </div>
  </section>`;

  const letterScene = () => `<section class="scene final-scene" aria-label="Surat ulang tahun">
    <div class="chapter-heading"><div class="eyebrow">Sampai juga di akhir perjalanan</div><h2>Eh… ada satu lagi! 💌</h2>
      <p>Foto sudah selesai. Tapi ini mau aku bilang langsung ke kamu.</p></div>
    <div class="letter-shell"><article class="letter-paper">
       <span class="letter-tape" aria-hidden="true"></span>
       <p class="letter-for">A little note for ${esc(config.friendName)} ♡</p>
       <h3>${esc(config.letter?.title || 'Untukmu')}</h3>
       <div class="letter-body">${(config.letter?.paragraphs || []).map(p=>`<p>${esc(p)}</p>`).join('')}</div>
       <p class="letter-closing">${esc(config.letter?.closing || 'Dengan sayang,')}</p>
       <p class="letter-signature">${esc(config.senderName)}</p>
       <span class="letter-seal">♡</span>
    </article></div>
    ${footer('↩ Kembali ke Awal', true)}
  </section>`;

  app.innerHTML = `<header class="top-bar"><div class="brand"><span class="brand-star">✳</span>semesta <strong>kita.</strong></div>
    <div class="music-wrapper"><span id="music-toast" class="music-toast" role="status" aria-live="polite"></span>
      <button type="button" id="music-btn" class="music-btn" aria-label="Putar lagu" aria-pressed="false"><span id="music-symbol" class="music-symbol">▶</span><span id="music-label">Play</span></button></div>
    </header>
    <main id="stage" class="stage" aria-live="off"></main>
    <div class="chapter-index" id="chapter-index" aria-label="Posisi dalam album"></div>
    <div class="transition-layer" id="transition-layer" hidden aria-hidden="true">
      <div class="transition-sparks" aria-hidden="true">✦ &nbsp; ✳ &nbsp; ♡ &nbsp; ✷</div>
      <div class="transition-emoji" id="transition-emoji">🪐</div><strong id="transition-title">WUSSS!</strong>
      <p id="transition-note">Kita ke foto berikutnya…</p>
    </div>
    <dialog id="lightbox" class="lightbox" aria-label="Foto kenangan diperbesar"></dialog>
    <audio id="background-music" preload="none" loop></audio>`;
  stage = document.getElementById('stage');
  audio = document.getElementById('background-music');
  const musicButton = document.getElementById('music-btn');
  const musicLabel = document.getElementById('music-label');
  const musicSymbol = document.getElementById('music-symbol');
  const musicToast = document.getElementById('music-toast');
  const transitionLayer = document.getElementById('transition-layer');

  function showProgress() {
    const label = chapter === 0 ? 'Hadiah untukmu' : chapter === 7 ? 'Surat terakhir' : `${chapter} / 6 · ${chapters[chapter - 1].style}`;
    document.getElementById('chapter-index').textContent = label;
  }
  function openPhoto(index) {
    const p = photos[index];
    if (!p || !unlocked) return;
    const dialog = document.getElementById('lightbox');
    dialog.innerHTML = `<div class="lightbox-content">
      <button type="button" class="lightbox-close" aria-label="Tutup foto">✕</button>
      <div class="lightbox-image photo-image"><img src="${esc(pathToUrl(p.src))}" alt="${esc(p.caption)}"><span class="photo-placeholder"><strong>Foto ${String(p.number).padStart(2,'0')}</strong><small>Upload ${esc(p.src)}</small></span></div>
      <p><span>✦ ${String(p.number).padStart(2,'0')} / 25</span> ${esc(p.caption)}</p>
    </div>`;
    dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
    dialog.onclick = event => { if (event.target === dialog) dialog.close(); };
    dialog.querySelector('img').addEventListener('error',e=>e.currentTarget.parentElement.classList.add('missing'),{once:true});
    if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open','');
  }
  document.addEventListener('error', e => {
    if (e.target instanceof HTMLImageElement) e.target.closest('.photo-image')?.classList.add('missing');
  },true);
  document.addEventListener('click', e => {
    const photoButton = e.target.closest('[data-open-photo]');
    if (photoButton) return openPhoto(Number(photoButton.dataset.openPhoto));
    const go = e.target.closest('[data-go]');
    if (go) navigate(go.dataset.go);
  });

  function render() {
    stage.innerHTML = chapter === 0 ? heroScene() : chapter === 7 ? letterScene() : chapterScene(chapter-1);
    showProgress();
    stage.querySelectorAll('img').forEach(img => {
      if (img.complete && img.naturalWidth === 0) img.closest('.photo-image')?.classList.add('missing');
    });
    if (chapter === 0) countdownTick();
    stage.querySelector('.scene')?.focus?.({preventScroll:true});
  }
  function chooseEffect() {
    // Hindari animasi yang sama dua kali berturut-turut.
    const index = lastEffect === -1 ? Math.floor(Math.random() * effects.length) : (lastEffect + 1 + Math.floor(Math.random() * (effects.length - 1))) % effects.length;
    lastEffect = index;
    return effects[index];
  }
  function navigate(action) {
    if (isTransitioning) return;
    if (action === 'advance' && !unlocked) return; // Bukan sekadar tombol yang terkunci.
    if (action === 'advance' && chapter >= 7) return;
    if (action !== 'advance' && action !== 'restart') return;
    isTransitioning = true;
    const next = action === 'restart' ? 0 : chapter + 1;
    const effect = chooseEffect();
    const swapScene = () => { chapter = next; render(); };
    if (reducedMotion.matches) {swapScene();isTransitioning=false;return;}
    transitionLayer.hidden = false;
    transitionLayer.className = `transition-layer effect-${effect.name}`;
    document.getElementById('transition-emoji').textContent = effect.emoji;
    document.getElementById('transition-title').textContent = effect.title;
    document.getElementById('transition-note').textContent = effect.note;
    requestAnimationFrame(() => transitionLayer.classList.add('is-active'));
    setTimeout(() => {
      swapScene();
      transitionLayer.classList.add('is-leaving');
      setTimeout(() => {
        transitionLayer.hidden = true;
        transitionLayer.className = 'transition-layer';
        isTransitioning = false;
      }, 480);
    }, 930);
  }

  function countdownTick() {
    if (chapter !== 0) return;
    const countdownBox = document.getElementById('countdown');
    const help = document.getElementById('countdown-help');
    const caption = document.getElementById('countdown-caption');
    const footer = document.getElementById('hero-footer');
    if (!countdownBox || !help || !caption || !footer) return;
    if (!Number.isFinite(target)) { countdownBox.innerHTML = '<p class="countdown-error">Tanggal salah. Periksa birthdayTimestamp di config.js.</p>'; return; }
    unlocked = preview || isUnlocked();
    footer.hidden = !unlocked;
    if (unlocked) {
      countdownBox.innerHTML = '<div class="birthday-message"><strong>Happy Birthday! 🎂</strong><span>Album 25 foto sudah bisa dibuka ♡</span></div>';
      help.textContent = preview && !isUnlocked() ? 'Pratinjau aktif. Link biasa tetap menunggu tanggal ulang tahun.' : 'Akhirnya boleh lihat kenangan kita!';
      caption.textContent = preview && !isUnlocked() ? 'Lihat-lihat dulu, yuk!' : 'Hari spesialmu akhirnya tiba!';
      return;
    }
    const seconds = Math.max(0, Math.ceil((target - Date.now()) / 1000));
    const time = [Math.floor(seconds/86400),Math.floor(seconds%86400/3600),Math.floor(seconds%3600/60),seconds%60];
    const labels = ['hari','jam','menit','detik'];
    countdownBox.innerHTML = time.map((v,i)=>`<div class="count-unit"><span class="count-value">${String(v).padStart(2,'0')}</span><span class="count-label">${labels[i]}</span></div>`).join('');
  }
  function updateMusic() {
    musicLabel.textContent = audioPlaying ? 'Pause' : 'Play';
    musicSymbol.textContent = audioPlaying ? '❚❚' : '▶';
    musicButton.setAttribute('aria-label',audioPlaying ? 'Jeda lagu' : 'Putar lagu');
    musicButton.setAttribute('aria-pressed',String(audioPlaying));
    musicButton.classList.toggle('is-playing',audioPlaying);
    musicToast.textContent = musicError;
  }
  musicButton.addEventListener('click', async () => {
    musicError = '';
    try {
      if (audio.paused) {
        if (!audio.getAttribute('src')) audio.src = pathToUrl(config.song?.url || 'audio/lagu.mp3');
        await audio.play();
      } else audio.pause();
    } catch (_) {musicError='Lagunya belum ada. Upload audio/lagu.mp3 ke GitHub.';}
    audioPlaying = !audio.paused;
    updateMusic();
  });
  audio.addEventListener('play',()=>{audioPlaying=true;musicError='';updateMusic()});
  audio.addEventListener('pause',()=>{audioPlaying=false;updateMusic()});
  audio.addEventListener('error',()=>{audioPlaying=false;musicError='Lagunya belum ada. Upload audio/lagu.mp3 ke GitHub.';updateMusic()});
  updateMusic();
  render();
  setInterval(countdownTick,1000);
  window.addEventListener('focus',countdownTick);
  document.addEventListener('visibilitychange',()=>{if (!document.hidden) countdownTick()});
})();
