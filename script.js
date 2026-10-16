/*
 * Semesta Untukmu — website statis untuk GitHub Pages.
 * Semua konten bisa diubah di config.js. Tidak menggunakan Replit / Vite / React.
 */
(() => {
  'use strict';
  const birthday = window.BIRTHDAY_CONFIG;
  const app = document.querySelector('#app');
  if (!birthday || !app) {
    document.body.textContent = 'Konfigurasi belum ditemukan. Periksa file config.js.';
    return;
  }

  const TARGET = Date.parse(birthday.birthdayTimestamp);
  const TOTAL_STEPS = 4;
  let entered = false;
  let step = 0;
  let openNote = null;
  let dodges = 0;
  let audio = null;
  let playing = false;
  let unlockedAtLastCheck = !Number.isNaN(TARGET) && Date.now() >= TARGET;

  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));
  const isUnlocked = () => Number.isFinite(TARGET) && Date.now() >= TARGET;
  const assetUrl = (path) => {
    const safe = String(path || '').trim();
    if (/^https?:\/\//i.test(safe)) return safe;
    return `./${safe.replace(/^\/+/, '')}`;
  };
  const svg = (name, cls = '') => `<img class="${cls}" src="./assets/${name}.svg" alt="" aria-hidden="true">`;
  const decorations = (extra = '') => `
    <div class="hero-art ${extra}" aria-hidden="true">
      ${svg('saturn', 'planet floaty')}
      ${svg('astronaut', 'astro floaty')}
      ${svg('sparkle', 'sparkle-1 twinkle')}
      ${svg('sparkle', 'sparkle-2 twinkle')}
    </div>`;

  // Bintang dekoratif dibuat satu kali, tetap terlihat di semua halaman.
  const starfield = document.querySelector('#starfield');
  for (let i = 0; i < 46; i++) {
    const dot = document.createElement('span');
    const pseudoRand = (seed) => { const x = Math.sin(seed * 93.21) * 43758.5453; return x - Math.floor(x); };
    dot.style.left = `${pseudoRand(i + 11) * 100}%`;
    dot.style.top = `${pseudoRand(i + 62) * 100}%`;
    dot.style.width = dot.style.height = `${3 + pseudoRand(i + 101) * 6}px`;
    dot.style.background = ['#fff', '#f2c53d', '#ff9fcb', '#8a62d6'][i % 4];
    dot.style.animationDelay = `${pseudoRand(i + 212) * 4}s`;
    starfield?.append(dot);
  }

  function renderGate() {
    app.innerHTML = `<main class="gate page">
      <button type="button" id="skip-gate" class="gate-skip">Lewati keusilan, langsung masuk</button>
      <div class="gate-inner rise">
        ${decorations()}
        <p class="hand-pretitle">Undangan khusus dari planet ungu mungil</p>
        <h1 class="page-title small">Kamu yakin mau masuk ke semesta ini?</h1>
        <p class="muted gate-copy">Isinya kenangan, surat, dan sedikit kejutan. Hati-hati, bisa bikin senyum-senyum sendiri.</p>
        <div class="gate-actions">
          <button type="button" id="enter" class="btn-primary">Masuk ✨</button>
          <button type="button" id="nope" class="btn-ghost">Nggak dulu</button>
        </div>
        <p class="prank" id="prank" role="status" aria-live="polite"></p>
      </div>
    </main>`;
    app.querySelector('#skip-gate').addEventListener('click', enter);
    app.querySelector('#enter').addEventListener('click', enter);
    const nope = app.querySelector('#nope');
    const poke = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        app.querySelector('#prank').textContent = 'HAHAHA pencet yang ungu aja 😭';
        return;
      }
      if (dodges < 3) {
        dodges += 1;
        nope.style.transform = `translate(${((dodges % 2) ? 1 : -1) * (18 + dodges * 13)}px, ${dodges % 2 ? -13 : 12}px) rotate(${dodges * 3}deg)`;
      }
      if (dodges >= 3) app.querySelector('#prank').textContent = 'HAHAHA pencet yang ungu aja 😭';
    };
    nope.addEventListener('mouseenter', poke);
    nope.addEventListener('click', poke);
  }

  function enter() {
    entered = true;
    renderStory();
  }

  function homeContent() {
    return `<div class="container home">
      <section class="text-center rise">
        ${decorations('home-art')}
        <p class="hand-pretitle home-sub">Halo dari orbit, ${esc(birthday.friendName)}!</p>
        <h1 class="page-title">Semesta <em class="purple">Untukmu</em></h1>
        <p class="home-intro muted">${esc(birthday.heroTagline)}</p>
      </section>
      <section class="countdown-area rise" aria-labelledby="countdown-heading" style="animation-delay:.15s">
        <h2 class="section-hand" id="countdown-heading">Hitung mundur ke hari spesialmu</h2>
        <div id="countdown" role="timer" aria-live="off"></div>
        <p id="unlocked-message" class="unlocked" hidden>Yeay! Sekarang kamu boleh tekan Next untuk mulai ceritanya. ✨</p>
      </section>
      <section class="rise" style="animation-delay:.3s" aria-label="Musik">
        <div class="music paper">
          <button class="music-toggle" id="music-toggle" ${birthday.song.url.trim() ? '' : 'disabled'} type="button" aria-label="Putar atau jeda lagu" aria-pressed="false">♫</button>
          <div class="music-text"><strong>${esc(birthday.song.title)}</strong><small id="music-status">${birthday.song.url.trim() ? 'Musik mati. Tekan untuk memutar.' : 'Lagu belum dipasang. Isi song.url di config.js.'}</small></div>
        </div>
      </section>
    </div>`;
  }

  function photoFrame(photo) {
    const path = String(photo.src || '');
    const invalid = !path.trim();
    return `<div class="photo-frame ${invalid ? 'missing' : ''}">
      ${invalid ? '' : `<img src="${esc(assetUrl(path))}" alt="${esc(photo.alt)}" loading="lazy">`}
      <div class="photo-fallback" aria-hidden="true"><span class="fallback-icon">▧</span><span class="hand">foto menyusul</span><small>taruh di ${esc(path || 'photos/')}</small></div>
    </div>`;
  }

  function galleryContent() {
    const photos = birthday.photos || [];
    return `<div class="page-section">
      <header class="page-header rise">
        <p class="hand-pretitle">memory lane, versi galaksi</p>
        <h1 class="page-title small">Galeri Kenangan</h1>
        <p class="muted">Tempelan scrapbook untuk ${esc(birthday.friendName)}. Klik polaroid untuk melihatnya lebih besar.</p>
      </header>
      <ul class="gallery-grid">${photos.map((photo, i) => `
        <li class="rise" style="animation-delay:${i * .08}s">
          <button type="button" class="polaroid paper" style="transform:rotate(${Number(photo.tilt) || 0}deg)" data-photo="${i}" aria-label="Buka foto: ${esc(photo.caption)}">
            <span class="tape ${i % 2 ? 'pink' : ''}" aria-hidden="true"></span>
            ${photoFrame(photo)}
            <p class="polaroid-caption">${esc(photo.caption)}</p>
            <span class="polaroid-date">✦ ${esc(photo.date)}</span>
          </button>
        </li>`).join('')}</ul>
      <dialog id="photo-dialog" class="photo-dialog" aria-labelledby="photo-dialog-title"></dialog>
    </div>`;
  }

  function lettersContent() {
    const notes = birthday.notes || [];
    return `<div class="page-section" style="max-width:800px">
      <header class="page-header rise">
        <p class="hand-pretitle">special delivery</p>
        <h1 class="page-title small">Surat Untukmu</h1>
        <p class="muted">Pilih amplop sesuai suasana hatimu. Satu per satu aja, ya.</p>
      </header>
      <ul class="notes-list">${notes.map((note, i) => `
        <li class="rise" style="animation-delay:${i * .07}s">
          <button type="button" class="note-button paper" data-note="${i}" aria-expanded="${openNote === i}" aria-controls="note-${i}" style="transform:rotate(${openNote === i ? 0 : i % 2 ? .8 : -.8}deg)">
            <span class="stripe" aria-hidden="true"></span><span class="note-icon" aria-hidden="true">${openNote === i ? '💌' : '✉️'}</span>
            <span><span class="note-label">${esc(note.label)}</span><span class="note-hint">${openNote === i ? 'Tekan untuk menutup' : 'Tekan untuk membuka'}</span></span>
          </button>
          ${openNote === i ? `<div class="note-content paper pop" id="note-${i}" role="region" aria-label="${esc(note.title)}"><h2>${esc(note.title)}</h2><p>${esc(note.body)}</p><p class="sign">xoxo, ${esc(birthday.senderName)}</p></div>` : ''}
        </li>`).join('')}</ul>
    </div>`;
  }

  function letterContent() {
    const letter = birthday.letter;
    return `<div class="letter-wrap">
      <article class="letter-paper paper rise">
        <span class="tape" aria-hidden="true"></span>
        <p class="salutation">Untuk ${esc(birthday.friendName)},</p>
        <h1>${esc(letter.title)}</h1>
        <div class="letter-paragraphs">${letter.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
        <footer class="letter-footer"><div><p>${esc(letter.closing)},</p><p class="sender">${esc(birthday.senderName)}</p></div>${svg('astronaut', 'letter-astro floaty')}</footer>
      </article>
    </div>`;
  }

  function navContent() {
    const locked = step === 0 && !isUnlocked();
    const last = step === TOTAL_STEPS - 1;
    return `<nav class="story-nav" aria-label="Navigasi cerita ulang tahun">
      <div class="story-nav-row">
        <button type="button" id="prev" class="nav-button nav-prev" ${step === 0 ? 'disabled' : ''} aria-label="Kembali ke halaman sebelumnya">← Prev</button>
        <div class="story-progress" aria-label="Halaman ${step + 1} dari ${TOTAL_STEPS}"><div class="page-number">${step + 1} / ${TOTAL_STEPS}</div>
          <div class="progress-dots" aria-hidden="true">${Array.from({length:TOTAL_STEPS},(_,i) => `<span class="progress-dot ${step === i ? 'active' : ''}"></span>`).join('')}</div>
        </div>
        <button type="button" id="next" class="nav-button nav-next" ${locked || last ? 'disabled' : ''} aria-label="${locked ? 'Next terkunci sampai hitung mundur selesai' : last ? 'Ini halaman terakhir' : 'Lanjut ke halaman berikutnya'}">${locked ? '🔒 ' : ''}Next ${locked ? '' : '→'}</button>
      </div>
      ${locked ? '<p class="nav-note">🔒 Tunggu sampai hari ulang tahunmu tiba, ya.</p>' : ''}
      ${last ? '<p class="nav-note final">Kamu sudah sampai di akhir cerita. 💜</p>' : ''}
    </nav>`;
  }

  function renderStory() {
    // Selalu kembali ke countdown jika waktu ulang tahun belum tercapai.
    if (step > 0 && !isUnlocked()) step = 0;
    const contents = [homeContent, galleryContent, lettersContent, letterContent];
    app.innerHTML = `<div class="page">
      <main id="story-content" class="story-content" tabindex="-1">${contents[step]()}</main>
      ${navContent()}
    </div>`;
    app.querySelector('#prev').addEventListener('click', () => go(-1));
    app.querySelector('#next').addEventListener('click', () => go(1));
    if (step === 0) {
      const musicButton = app.querySelector('#music-toggle');
      musicButton?.addEventListener('click', toggleMusic);
      updateMusicDisplay();
      updateCountdown();
    }
    app.querySelectorAll('[data-photo]').forEach((button) => {
      button.addEventListener('click', () => openPhoto(Number(button.dataset.photo)));
    });
    app.querySelectorAll('[data-note]').forEach((button) => {
      button.addEventListener('click', () => {
        const index = Number(button.dataset.note);
        openNote = openNote === index ? null : index;
        // Render ulang surat tanpa memindahkan posisi scroll.
        const main = app.querySelector('#story-content');
        main.innerHTML = lettersContent();
        main.querySelectorAll('[data-note]').forEach((btn) => btn.addEventListener('click', () => noteClick(Number(btn.dataset.note))));
        main.querySelector(`[data-note="${index}"]`)?.focus({preventScroll:true});
      });
    });
  }

  function noteClick(index) {
    openNote = openNote === index ? null : index;
    const main = app.querySelector('#story-content');
    if (!main) return;
    main.innerHTML = lettersContent();
    main.querySelectorAll('[data-note]').forEach((btn) => btn.addEventListener('click', () => noteClick(Number(btn.dataset.note))));
    main.querySelector(`[data-note="${index}"]`)?.focus({preventScroll:true});
  }

  function go(direction) {
    // Validasi ulang setiap klik, tidak mengandalkan tombol disabled saja.
    if (direction > 0 && !isUnlocked() && step === 0) return;
    step = Math.min(TOTAL_STEPS - 1, Math.max(0, step + direction));
    renderStory();
    window.scrollTo({top:0,behavior:'instant'});
    app.querySelector('#story-content')?.focus({preventScroll:true});
  }

  function openPhoto(index) {
    const photo = birthday.photos?.[index];
    const dialog = app.querySelector('#photo-dialog');
    if (!photo || !dialog) return;
    dialog.innerHTML = `<div class="photo-dialog-body paper">
      <button class="photo-close" aria-label="Tutup foto" type="button">×</button>
      ${photoFrame(photo)}
      <h2 class="photo-caption" id="photo-dialog-title">${esc(photo.caption)}</h2>
      <p class="photo-date">${esc(photo.date)}</p>
    </div>`;
    dialog.querySelector('.photo-close')?.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (e) => {if (e.target === dialog) dialog.close();},{once:true});
    if (typeof dialog.showModal === 'function') dialog.showModal();
  }

  // Jika fotonya belum ditambahkan, tampilkan placeholder (bukan gambar rusak).
  document.addEventListener('error', (event) => {
    if (event.target instanceof HTMLImageElement && event.target.closest('.photo-frame')) {
      event.target.closest('.photo-frame').classList.add('missing');
    }
  }, true);

  function updateCountdown() {
    if (!entered || step !== 0) return;
    const node = app.querySelector('#countdown');
    if (!node) return;
    const diff = TARGET - Date.now();
    if (!Number.isFinite(TARGET)) {
      node.innerHTML = '<p class="muted text-center">Tanggal ulang tahun belum diatur dengan benar di config.js.</p>';
      return;
    }
    if (diff <= 0) {
      if (!node.querySelector('.celebrate')) {
        node.innerHTML = `<div class="celebrate pop" role="status">
          <p class="hand-pretitle">Hari ini harinya!</p>
          <h2>Selamat ulang tahun, ${esc(birthday.friendName)}!</h2>
          <p>Happy birthday! Semesta ini resmi terbuka untukmu.</p>
        </div>`;
        app.querySelector('#unlocked-message').hidden = false;
        const confetti = document.createElement('div');
        confetti.className = 'confetti-layer';
        confetti.setAttribute('aria-hidden','true');
        for (let i = 0; i < 24; i++) {
          const piece = document.createElement('span');
          piece.className = 'confetti';
          piece.style.left = `${(i * 4.3) % 100}%`;
          piece.style.background = ['#f2c53d','#ff9fcb','#8a62d6','#fff'][i % 4];
          piece.style.animationDuration = `${4 + (i % 5)}s`;
          piece.style.animationDelay = `${(i % 7) * .4}s`;
          confetti.append(piece);
        }
        node.append(confetti);
      }
      return;
    }
    const seconds = Math.floor(diff / 1000);
    const values = [Math.floor(seconds / 86400),Math.floor((seconds % 86400) / 3600),Math.floor((seconds % 3600) / 60),seconds % 60];
    const labels = ['hari','jam','menit','detik'];
    if (!node.querySelector('.countdown-grid')) {
      const targetLabel = new Intl.DateTimeFormat('id-ID', {timeZone:'Asia/Jakarta',day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(TARGET);
      node.innerHTML = `<div class="countdown-grid" aria-label="Sisa waktu ke ulang tahun">
        ${labels.map((label,i)=> `<div class="time-unit paper"><span class="time-number" id="time-${label}">${values[i]}</span><span class="time-label">${label}</span></div>`).join('')}
        </div><p class="countdown-until">Menuju ${esc(targetLabel)} WIB</p>`;
    }
    labels.forEach((label,i) => {
      const element = node.querySelector(`#time-${label}`);
      if (element) element.textContent = String(values[i]).padStart(2,'0');
    });
  }

  async function toggleMusic() {
    if (!birthday.song.url?.trim()) return;
    if (!audio) {
      audio = new Audio(assetUrl(birthday.song.url));
      audio.loop = true;
      audio.addEventListener('error', () => { playing = false; updateMusicDisplay('File lagu tidak bisa diputar. Cek path-nya.'); });
    }
    try {
      if (playing) { audio.pause(); playing = false; }
      else { await audio.play(); playing = true; }
      updateMusicDisplay();
    } catch (_) { playing = false; updateMusicDisplay('Lagu tidak bisa diputar. Periksa file-nya.'); }
  }

  function updateMusicDisplay(errorMessage = '') {
    const button = app.querySelector('#music-toggle');
    const status = app.querySelector('#music-status');
    if (!button || !status) return;
    button.textContent = playing ? '❚❚' : '♫';
    button.setAttribute('aria-pressed',String(playing));
    status.textContent = errorMessage || (!birthday.song.url?.trim() ? 'Lagu belum dipasang. Isi song.url di config.js.' : playing ? 'Sedang diputar' : 'Musik mati. Tekan untuk memutar.');
  }

  function tick() {
    if (!entered) return;
    const currentlyUnlocked = isUnlocked();
    if (step > 0 && !currentlyUnlocked) {
      step = 0;
      renderStory();
    } else if (step === 0) {
      updateCountdown();
      if (currentlyUnlocked !== unlockedAtLastCheck) {
        const currentNav = app.querySelector('.story-nav');
        currentNav?.insertAdjacentHTML('afterend', navContent());
        currentNav?.remove();
        app.querySelector('#prev')?.addEventListener('click', () => go(-1));
        app.querySelector('#next')?.addEventListener('click', () => go(1));
      }
    }
    unlockedAtLastCheck = currentlyUnlocked;
  }

  renderGate();
  window.setInterval(tick,1000);
  window.addEventListener('focus',tick);
  document.addEventListener('visibilitychange',tick);
})();
