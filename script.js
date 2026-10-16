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
  const sectionTitle = (label, title, desc = '') => `<div class="section-heading reveal-on-scroll">
    <span class="eyebrow">${label}</span><h2>${title}</h2>${desc ? `<p>${desc}</p>` : ''}
  </div>`;

  const scenes = () => `
    <section class="album-intro reveal-on-scroll" aria-label="Pembuka album">
      <span class="little-spark">✦ &nbsp; 25 keping kenangan &nbsp; ✦</span>
      <h2>Kalau kenangan punya bentuk,<br><em>mungkin akan seperti ini.</em></h2>
      <p>Nggak harus rapi. Nggak harus sempurna. Yang penting ada kita berdua di dalamnya.</p>
    </section>

    <section class="memory-section polaroid-section" aria-labelledby="polaroid-title">
      ${sectionTitle('01 — 03 • polaroid', '<span id="polaroid-title">Tiga yang pertama</span>', 'Kita mulai dari yang sederhana: foto-foto yang pengin ditempel di dinding.')}
      <div class="polaroid-scatter">
        ${[0,1,2].map((n,j) => `<div class="polaroid-card reveal-on-scroll" style="--tilt:${[-8,5,-5][j]}deg;--delay:${j * 110}ms">
          <span class="washi ${j===1?'washi-pink':''}" aria-hidden="true"></span>
          ${photo(n)}<span class="scribble">${esc(photos[n].caption)}</span><span class="polaroid-index">№ 0${n+1} ♡</span>
        </div>`).join('')}
      </div>
      <span class="floating-label">ini kita! ↗</span>
    </section>

    <section class="memory-section booth-section" aria-labelledby="booth-title">
      ${sectionTitle('04 — 07 • photobooth','<span id="booth-title">Senyum dulu, cekrek!</span>','Empat kali jepret, empat momen yang nggak mau dibuang.')}
      <div class="booth-stage">
        <div class="booth-sticker sticker-top">say cheese! ♡</div>
        <div class="booth-strip reveal-on-scroll">
          <div class="booth-brand">OUR <b>PHOTOBOOTH</b> <span>✷</span></div>
          ${[3,4,5,6].map(n=> `<div class="booth-shot">${photo(n)}<small>✦ ${esc(photos[n].caption)}</small></div>`).join('')}
          <div class="booth-footer">together looks good on us &nbsp; ♥ &nbsp; 2026</div>
        </div>
        <span class="booth-sticker sticker-bottom">little moments,<br>big feelings ✿</span>
      </div>
    </section>

    <section class="memory-section scrapbook-section" aria-labelledby="scrapbook-title">
      ${sectionTitle('08 — 11 • scrapbook','<span id="scrapbook-title">Yang random justru berkesan</span>','Ditempel, ditumpuk, dan disimpan. Persis kayak isi kepala kalau lagi ingat kamu.')}
      <div class="scrapbook-board reveal-on-scroll">
        <span class="scrap-doodle d1">♡</span><span class="scrap-doodle d2">✳</span><span class="scrap-doodle d3">☼</span>
        ${[7,8,9,10].map((n,j)=> `<div class="scrap-item scrap-${j+1}"><div class="scrap-pin" aria-hidden="true"></div>${photo(n)}<span class="scrap-caption">${esc(photos[n].caption)}</span></div>`).join('')}
        <div class="scrap-note">Psst…<br>klik fotonya<br>biar gede! ↗</div>
      </div>
    </section>

    <section class="memory-section film-section" aria-labelledby="film-title">
      ${sectionTitle('12 — 16 • film roll','<span id="film-title">Sedikit adegan dari cerita kita</span>','Bayangin ini potongan film, dan kita pemeran utamanya.')}
      <div class="film-scroll" aria-label="Lima foto bergaya rol film, geser mendatar untuk melihat semuanya">
        <div class="film-track">
          ${[11,12,13,14,15].map((n,j)=> `<div class="film-cell"><span class="film-number">FRAME ${String(j+1).padStart(2,'0')}</span>${photo(n)}<span class="film-caption">${esc(photos[n].caption)}</span></div>`).join('')}
        </div>
      </div>
      <p class="scroll-hint">← geser filmnya ke samping →</p>
    </section>

    <section class="memory-section postcard-section" aria-labelledby="postcard-title">
      ${sectionTitle('17 — 19 • postcards','<span id="postcard-title">Salam dari hari-hari kita</span>','Tiga kartu pos dari momen yang rasanya pengin dikunjungi lagi.')}
      <div class="postcard-stack">
        ${[16,17,18].map((n,j)=> `<div class="postcard reveal-on-scroll" style="--delay:${j*110}ms"><div class="postcard-photo">${photo(n)}</div><div class="postcard-writing"><span class="postcard-stamp">✳<small>OUR DAYS</small></span><span class="postcard-to">TO: YOU ♡</span><p>${esc(photos[n].caption)}</p><span class="postcard-from">from, us</span></div></div>`).join('')}
      </div>
    </section>

    <section class="memory-section stars-section" aria-labelledby="stars-title">
      ${sectionTitle('20 — 25 • constellation','<span id="stars-title">Enam bintang terakhir</span>','Dari semua semesta yang mungkin, aku senang kita punya kenangan yang sama.')}
      <div class="constellation-grid reveal-on-scroll">
        ${[19,20,21,22,23,24].map((n,j)=> `<div class="star-photo star-pos-${j+1}">${photo(n)}<span>${String(n+1).padStart(2,'0')} ✦ ${esc(photos[n].caption)}</span></div>`).join('')}
      </div>
      <p class="constellation-ending">25 foto selesai, tapi ceritanya belum. ✧</p>
    </section>

    <section class="final-section" aria-labelledby="letter-title">
      <div class="final-cloud c1" aria-hidden="true">✿</div><div class="final-cloud c2" aria-hidden="true">✧</div>
      <div class="letter-paper reveal-on-scroll">
        <span class="washi" aria-hidden="true"></span>
        <p class="letter-for">A little note for ${esc(config.friendName)} ♡</p>
        <h2 id="letter-title">${esc(config.letter?.title || 'Untukmu')}</h2>
        <div class="letter-body">${(config.letter?.paragraphs || []).map(p=>`<p>${esc(p)}</p>`).join('')}</div>
        <p class="letter-closing">${esc(config.letter?.closing || 'Dengan sayang,')}</p>
        <p class="letter-signature">${esc(config.senderName)}</p>
        <span class="letter-seal">♡</span>
      </div>
      <div class="end-actions"><span>the end… or maybe the beginning? ✷</span>
        <button type="button" id="back-to-start" class="back-to-start">↥ Kembali ke Awal</button>
      </div>
    </section>`;

  app.innerHTML = `
    <header class="top-bar" aria-label="Tanpe's day!">
      <div class="brand"><span class="brand-star">✳</span><span>semesta <strong>kita.</strong></span></div>
      <div class="music-wrapper">
        <span id="music-toast" class="music-toast" role="status" aria-live="polite"></span>
        <button type="button" id="music-btn" class="music-btn" aria-label="Putar lagu" aria-pressed="false">
          <span id="music-symbol" class="music-symbol" aria-hidden="true">▶</span><span id="music-label">Play</span>
        </button>
      </div>
    </header>
    <main>
      <section class="hero" id="awal">
        <div class="hero-glow" aria-hidden="true"></div>
        <p class="hero-kicker">A little universe, just for you ✦</p>
        ${decorations()}
        <div class="hero-copy">
          <span class="hero-hello">Hai, ${esc(config.friendName)} ♡</span>
          <h1>Semesta kecil untuk <em>Tanpe</em></h1>
          <p>Special for your birthday!.</p>
        </div>
        <div class="countdown-panel" id="countdown-panel">
          <p class="countdown-caption" id="countdown-caption">Kejutannya terbuka dalam...</p>
          <div id="countdown" class="countdown-grid" role="timer" aria-live="off"></div>
          <p id="countdown-help" class="countdown-help">Album akan terbuka otomatis setelah hitung mundur selesai. 💜</p>
        </div>
        <div id="scroll-invite" class="scroll-invite" hidden><span>Scroll untuk buka album kenangan kita</span><span aria-hidden="true">⌄</span></div>
      </section>
      <div id="album" class="album" hidden></div>
    </main>
    <dialog id="lightbox" class="lightbox" aria-label="Foto kenangan diperbesar"></dialog>
    <audio id="background-music" preload="none" loop></audio>
  `;
  const countdownBox = document.getElementById('countdown');
  const helpBox = document.getElementById('countdown-help');
  const captionBox = document.getElementById('countdown-caption');
  const albumBox = document.getElementById('album');
  const musicButton = document.getElementById('music-btn');
  const musicLabel = document.getElementById('music-label');
  const musicSymbol = document.getElementById('music-symbol');
  const musicToast = document.getElementById('music-toast');
  audio = document.getElementById('background-music');
  // Muat lagu hanya saat tombol Play ditekan supaya tidak memunculkan error saat halaman baru dibuka.
  const errorImage = event => {
    const im = event.target;
    if (im instanceof HTMLImageElement && im.closest('.photo-image')) {
      im.closest('.photo-image').classList.add('missing');
    }
  };
  document.addEventListener('error', errorImage, true);

  function attachPhotoInteractions() {
    albumBox.addEventListener('click', event => {
      const button = event.target.closest('[data-open-photo]');
      if (button) openPhoto(Number(button.dataset.openPhoto));
    });
    albumBox.querySelector('#back-to-start')?.addEventListener('click', () => {
      document.getElementById('awal').scrollIntoView({behavior:'smooth',block:'start'});
    });
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('seen');
            observer.unobserve(entry.target);
          }
        }
      },{rootMargin:'0px 0px 60px 0px',threshold:0.05});
      albumBox.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
    } else {
      albumBox.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('seen'));
    }
  }

  function openPhoto(index) {
    const p = photos[index];
    if (!p) return;
    const dialog = document.getElementById('lightbox');
    const src = pathToUrl(p.src);
    dialog.innerHTML = `<div class="lightbox-content">
      <button type="button" class="lightbox-close" aria-label="Tutup foto">✕</button>
      <div class="lightbox-image photo-image"><img src="${esc(src)}" alt="${esc(p.caption)}"><span class="photo-placeholder"><strong>Foto ${String(p.number).padStart(2,'0')}</strong><small>Masukkan ${esc(p.src)} ke GitHub</small></span></div>
      <p><span>✦ ${String(p.number).padStart(2,'0')} / 25</span> ${esc(p.caption)}</p>
    </div>`;
    dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
    dialog.onclick = event => {if (event.target === dialog) dialog.close();};
    dialog.querySelector('img')?.addEventListener('error', event => event.target.parentElement.classList.add('missing'), {once:true});
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open','');
  }

  function unlockAlbum() {
    if (revealed) return;
    revealed = true;
    albumBox.hidden = false;
    albumBox.innerHTML = scenes();
    captionBox.textContent = 'Hari spesialmu akhirnya tiba!';
    helpBox.textContent = 'Yuk, lihat 25 keping kenangan yang sudah aku siapkan untuk kita. ✨';
    document.getElementById('countdown-panel').classList.add('is-open');
    document.getElementById('scroll-invite').hidden = false;
    attachPhotoInteractions();
  }

  function countdownTick() {
    if (!Number.isFinite(target)) {
      countdownBox.innerHTML = '<p class="countdown-error">Tanggal ulang tahun salah. Cek birthdayTimestamp di config.js.</p>';
      return;
    }
    if (isUnlocked()) {
      countdownBox.innerHTML = '<div class="birthday-message"><strong>Happy Birthday! 🎂</strong><span>Hari ini, semua kenangan kita boleh terbuka ♡</span></div>';
      unlockAlbum();
      return;
    }
    // Album tidak dibuat di DOM sebelum tanggalnya tiba.
    const remaining = Math.max(0, Math.floor((target - Date.now()) / 1000));
    const time = [Math.floor(remaining / 86400), Math.floor((remaining % 86400) / 3600), Math.floor((remaining % 3600) / 60), remaining % 60];
    const labels = ['hari','jam','menit','detik'];
    if (!countdownBox.querySelector('.count-unit')) {
      countdownBox.innerHTML = time.map((n,i) => `<div class="count-unit"><span id="count-${i}" class="count-value">${String(n).padStart(2,'0')}</span><span class="count-label">${labels[i]}</span></div>`).join('');
    } else {
      time.forEach((n,i) => {const el = document.getElementById(`count-${i}`); if (el) el.textContent = String(n).padStart(2,'0');});
    }
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
      }
      else audio.pause();
    } catch (_) {
      musicError = 'Lagu belum ada. Upload audio/lagu.mp3 ke GitHub.';
    }
    audioPlaying = !audio.paused;
    updateMusic();
  });
  audio.addEventListener('play', () => {audioPlaying = true;musicError='';updateMusic();});
  audio.addEventListener('pause', () => {audioPlaying = false;updateMusic();});
  audio.addEventListener('error', () => {audioPlaying = false;musicError='Lagu belum ada. Upload audio/lagu.mp3 ke GitHub.';updateMusic();});
  updateMusic();
  // MODE PRATINJAU
if (
  new URLSearchParams(window.location.search)
    .get('preview') === '1'
) {
  unlockAlbum();

  captionBox.textContent = 'Mode Pratinjau 💜';

  helpBox.textContent =
    'Kamu sedang melihat seluruh isi website. Countdown asli tetap berjalan.';
}
  countdownTick();
  setInterval(countdownTick, 1000);
  window.addEventListener('focus',countdownTick);
  document.addEventListener('visibilitychange', () => {if (!document.hidden) countdownTick();});
})();
