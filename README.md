# Semesta Kita 💜 — Website Ulang Tahun dengan 25 Foto

Website **statis** (HTML, CSS, JavaScript) untuk GitHub Pages. **Tidak membutuhkan Replit, React, instalasi, npm, atau build.**

## Yang ada di dalam website

- Tema ungu dengan planet & astronot langsung di `script.js` (tidak perlu file gambar ilustrasi tambahan).
- Countdown menuju **27 Oktober 2026, pukul 00.00 WIB**.
- Sebelum waktunya, **album tidak ditampilkan** dan tidak bisa dinavigasikan melalui tombol. Setelah waktunya, album muncul otomatis tanpa perlu refresh.
- **25 foto** dipisahkan ke 6 gaya yang berbeda, semuanya dalam **satu halaman scroll**:
  1. 3 foto polaroid (foto-01 sampai foto-03)
  2. 4 foto photobooth vertikal (foto-04 sampai foto-07)
  3. 4 foto scrapbook/kolase (foto-08 sampai foto-11)
  4. 5 foto film roll yang bisa digeser secara horizontal (foto-12 sampai foto-16)
  5. 3 foto kartu pos (foto-17 sampai foto-19)
  6. 6 foto rasi bintang/kolase (foto-20 sampai foto-25)
- Klik foto untuk membukanya lebih besar, tekan tanda X untuk menutup.
- Tombol **Play/Pause kecil di kanan atas**, bukan pemutar musik besar.
- **Tidak ada tombol Next/Prev**, tidak ada halaman notes “Buka saat kamu...” dan tidak ada tombol “Lewati Keusilan”.
- Di bagian akhir ada surat serta tombol **Kembali ke Awal**.

## Pasang foto

1. Siapkan **25 foto kalian berdua** (lebih bagus jika foto resolusinya tidak terlalu besar; idealnya 200–600 KB per foto).
2. Nama file **harus sesuai** huruf besar/kecil dan ekstensinya. Misalnya:
   - `photos/foto-01.jpg`
   - `photos/foto-02.jpg`
   - ...
   - `photos/foto-25.jpg`
3. Upload file-file tersebut ke folder `photos` di repo GitHub. **Jangan upload file foto ke root** jika di `config.js` tertulis `photos/foto-01.jpg`.
4. Kalau file aslinya `.png`, `.jpeg`, atau `.webp`, **ubah nilai `src` di `config.js`** sesuai nama aslinya. Tidak perlu memaksa ganti ekstensi nama tanpa mengonversi file.
5. Sebelum upload foto, website menampilkan placeholder nomor foto. Ini sengaja agar tidak muncul kotak gambar rusak.

## Pasang lagu

1. Masukkan file audio berizin (misalnya MP3 milikmu atau yang kamu punya izin untuk dipakai) ke folder `audio` dan beri nama `lagu.mp3`.
2. Tombol kecil di pojok kanan atas bisa dipakai untuk **Play** dan **Pause** setelah lagunya ada.
3. Bila memakai nama lagu lain, ubah `song.url` di `config.js`, misalnya `audio/lagu-kita.mp3`.
4. Musik **tidak otomatis berbunyi**, karena browser biasanya memerlukan interaksi pengguna untuk memulai audio.

## Edit nama, caption, surat, tanggal

Buka **`config.js`**. Yang bisa diubah: `friendName`, `senderName`, `birthdayTimestamp`, `song`, `photos[].caption`, `photos[].src`, `letter`.

> Catatan: Penguncian tanggal memakai **jam perangkat pengunjung**, bukan sistem keamanan server. Untuk hadiah kejutan biasa cukup, tetapi seseorang yang mengubah jam perangkat atau memeriksa berkas public repo secara manual masih bisa melihat kontennya. Repository GitHub Pages yang public juga membuat foto dapat diakses publik lewat URL. Jangan upload foto yang tidak ingin dibagikan secara publik.

## Upload ke GitHub Pages

1. Buat repository di GitHub, contoh: `semesta-kita`.
2. Di repository pilih **Add file → Upload files** dan upload **semua isi ZIP setelah diekstrak**, bukan ZIP-nya saja. File `index.html` harus di root repository.
3. Folder `photos` dan `audio` boleh kosong saat awal, tetapi Git tidak menyimpan folder kosong: **upload fotonya/lagunya** supaya folder muncul. Tidak perlu upload `README.txt` kalau sudah ada foto.
4. Pilih **Settings → Pages → Build and deployment → Deploy from a branch → main → /(root) → Save**.
5. Website akan bisa diakses pada `https://USERNAME.github.io/semesta-kita/` setelah GitHub Pages selesai deploy.
6. Untuk update, ganti `config.js` dan/atau upload gambar baru, lalu Commit changes.

## Test sebelum tanggal ulang tahun

Karena ulang tahun belum tiba, album sengaja tidak terlihat. Untuk melihat preview semua foto **sementara**, ubah tanggal di `config.js` menjadi `2026-01-01T00:00:00+07:00`; setelah pengecekan, **kembalikan** ke `2026-10-27T00:00:00+07:00` sebelum hadiah dikirim.
