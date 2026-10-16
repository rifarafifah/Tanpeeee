# Semesta Untukmu 💜 — Versi GitHub Pages

Website hadiah ulang tahun dengan tampilan planet ungu, astronot lucu, bintang-bintang, countdown, galeri polaroid, surat kecil, dan surat terakhir. Ini **website statis**: tidak perlu Replit, React, npm, database, server API, atau proses build.

## Alur website

1. **Halaman pembuka** — ilustrasi Saturnus, astronot, tombol *Masuk*.
2. **Countdown** — tombol **Next** dikunci sampai tanggal ulang tahun; tanggal bawaan **27 Oktober 2026 pukul 00.00 WIB**.
3. **Galeri Kenangan** — klik polaroid untuk melihat foto lebih besar.
4. **Surat Untukmu** — klik amplop untuk membaca surat.
5. **Surat panjang dari aku** — bagian terakhir.

Tidak ada menu untuk melompat. Pada bagian 2–5, hanya ada navigasi **Prev / Next**. Setelah countdown selesai, Next aktif secara otomatis tanpa reload.

**Catatan:** karena ini website statis, hitung mundur dan kunci Next mengikuti **jam perangkat pengunjung**. Kunci ini untuk kejutan visual, bukan perlindungan keamanan yang tahan manipulasi waktu.

## Cara upload ke GitHub Pages (tanpa coding)

1. Ekstrak file ZIP terlebih dahulu di HP atau laptop.
2. Buka [github.com](https://github.com/), buat repository baru (misalnya `ulang-tahun`) dan pilih **Public** jika ingin GitHub Pages tersedia tanpa pengaturan khusus.
3. Masuk ke repository, pilih **Add file → Upload files**. Upload **isi folder ZIP**, bukan file ZIP-nya, ke akar/root repository. `index.html` harus ada di root, sejajar dengan `style.css`, `config.js`, dan `script.js`. Pastikan folder `assets/` juga ikut ter-upload.
4. Klik **Commit changes**.
5. Di repository, buka **Settings → Pages**. Pada *Build and deployment*, pilih **Deploy from a branch**. Pilih `main` dan folder `/(root)`, kemudian **Save**.
6. Tunggu sampai GitHub Pages selesai dipublikasikan. Linknya biasanya `https://USERNAME.github.io/NAMA-REPO/`.

**Jangan upload folder pembungkus** `semesta-untukmu-github/` saja ke root tanpa memindahkan isinya, karena GitHub Pages harus bisa menemukan `index.html` di root.

## Cara personalisasi

Buka **`config.js`** dengan editor teks. Bisa diubah di GitHub lewat ikon pensil setelah repository dibuat.

- `friendName`: nama yang berulang tahun.
- `senderName`: nama pengirim.
- `birthdayTimestamp`: target countdown, format contohnya `2026-10-27T00:00:00+07:00` (WIB).
- `heroTagline`: tulisan di halaman countdown.
- `photos`: caption, tanggal, dan lokasi foto.
- `notes`: isi amplop-amplop.
- `letter`: isi surat panjang.
- `song.url`: lokasi musik. Kosong berarti tombol musik tidak aktif.

### Tambah foto

Taruh foto di folder `photos/` dengan nama `foto-1.jpg` sampai `foto-6.jpg`, sesuai pengaturan default di `config.js`. Atau sesuaikan nama dan jumlah fotonya di sana. Jika foto belum ada, website akan menampilkan kotak **foto menyusul** (bukan crash).

### Tambah lagu

Taruh file lagu di `audio/lagu.mp3`, kemudian ubah `song.url` menjadi `'audio/lagu.mp3'` di `config.js`. Audio baru bisa mulai dimainkan setelah pengunjung menekan tombol musik; browser biasanya melarang autoplay.

## Susunan file

```text
index.html       → halaman utama GitHub Pages
style.css        → desain dan animasi ungu
script.js        → logika Next/Prev, countdown, foto, dan surat
config.js        → isi yang dapat dipersonalisasi
assets/          → ilustrasi SVG (planet, astronot, bintang)
photos/          → tambahkan foto kamu di sini
audio/           → tambahkan lagu jika ingin
favicon.svg      → ikon tab
.nojekyll        → agar GitHub Pages melayani file apa adanya
```

## Cara cek tanpa upload

Buka `index.html` di browser (klik ganda). Website sudah dapat berjalan tanpa internet, **kecuali font Google** yang memakai fallback jika offline. Untuk melihat Next terbuka sekarang tanpa mengubah kode permanen, salin dulu website ke folder percobaan dan ubah `birthdayTimestamp` di `config.js` menjadi waktu yang sudah lewat. Kembalikan tanggal aslinya sebelum dipublikasikan.

## Troubleshooting

- **Halaman kosong:** cek apakah `index.html`, `script.js`, dan `config.js` di direktori yang sama dan sudah ter-upload.
- **Ilustrasi tidak tampil:** cek folder `assets/` dan gunakan huruf kecil pada nama file.
- **Next masih dikunci:** cek `birthdayTimestamp`, pengaturan waktu perangkat, dan tunggu sampai waktunya tiba.
- **Foto tidak muncul:** cek ejaan nama dan ekstensi foto; GitHub Pages membedakan huruf besar/kecil.
- **Musik tidak jalan:** pastikan `audio/lagu.mp3` sudah diunggah dan `song.url` cocok.
