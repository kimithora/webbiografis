# Dokumentasi Portofolio Kimi Thora Refolino

File: `index/kimi.html` · `style/kimi.css` · `script/mainkimi.js`

---

## 1. Arsitektur HTML

### 1.1 Kerangka Utama

| Nama Teknis | Nama Umum | Fungsi | Selector |
|---|---|---|---|
| `<aside>` | Sidebar / menu samping | Navigasi tetap di kiri | `#sidebar` |
| `<main>` | Isi utama | Wadah semua bagian halaman | `#main-content` |
| `<section>` | Bagian / seksi | Satu topik per blok | `.section` |
| `<footer>` | Kaki halaman | Brand, tautan kembali, hak cipta | `#footer` |
| `<nav>` | Menu navigasi | Daftar link ke tiap seksi (anchor `#id`) | `.sidebar-navigation` |

### 1.2 Seksi Halaman (urutan di HTML)

| No | ID | Nama Umum | Isi | Komponen Utama |
|---|---|---|---|---|
| 01 | `#profil` | Hero / Beranda | Judul, deskripsi, foto, tombol | `.profile-layout`, `.profile-image-frame` |
| 02 | `#tentang` | Tentang Saya | Bio, info akademik, minat | `.about-layout`, `.interest-grid` |
| 03 | `#keahlian` | Skill / Tech stack | Bahasa, framework, library | `.skills-grid`, `.skill-card` |
| 04 | `#pendidikan` | Riwayat pendidikan | SMA, S1, rencana S2 | `.education-timeline` |
| 05 | `#organisasi` | Pengalaman organisasi | PMR, PIK-R, OSIS, dll | `.education-timeline` |
| 06 | `#kepanitiaan` | Kepanitiaan | Daftar kegiatan | `.education-timeline` |
| 07 | `#prestasi` | Prestasi / Lomba | Juara tari & kepalangmerahan | `.skills-grid` |
| 08 | `#pengalaman-lainnya` | Pengalaman lain | Asisten lab | `.education-timeline` |
| 09 | `#penelitian` | Penelitian & Proyek | 4 riset + 1 aplikasi | `.project-grid`, `.project-card` |
| 10 | `#publikasi` | Publikasi jurnal | 2 artikel | `.publication-list` |
| 11 | `#kontak` | Kontak | Email, GitHub, sosmed | `.contact-layout`, `.contact-item` |

> Catatan: label `section-number` (mis. "04 / RESEARCH") tidak berurutan dengan posisi sebenarnya di halaman, dan Penelitian/Publikasi/Kontak masih memakai nomor lama (04/05/06).

### 1.3 Komponen Berulang

| Nama Teknis | Nama Umum | Dipakai di | Isi |
|---|---|---|---|
| `.section-heading` | Judul seksi | Semua seksi | Nomor, `h2`, deskripsi |
| `.education-card` | Kartu timeline | Pendidikan, Organisasi, Kepanitiaan, Lainnya | Kolom periode + kolom konten |
| `.skill-card` | Kartu skill | Keahlian, Prestasi | Nomor, judul, daftar/teks |
| `.interest-card` | Kartu minat | Tentang | Nomor, judul, deskripsi |
| `.project-card` | Kartu proyek | Penelitian | Meta, judul, tag, link |
| `.publication-card` | Kartu publikasi | Publikasi | Nomor, detail jurnal, tahun |
| `.contact-item` | Tombol kontak | Kontak | Label + isi + panah |
| `.button` | Tombol | Hero, Kontak | Primary / secondary |

### 1.4 Elemen Buatan JS (tidak ada di HTML)

| Elemen | Nama Umum | Dibuat oleh |
|---|---|---|
| `#page-loader` | Layar loading | `buildLoader()` |
| `.ticker` | Teks berjalan | `initTicker()` |
| `.scroll-progress` | Bar progres scroll | `initSpy()` |
| `.hud` | Panel info kanan bawah | `initSpy()` |
| `.cursor-dot` / `.cursor-ring` | Kursor kustom | `initCursor()` |
| `.menu-toggle` | Tombol hamburger | `initMenu()` |
| `.toast` | Notifikasi kecil | `toast()` |
| `.sidebar-clock` | Jam WIB | `initClock()` |

---

## 2. Styling (CSS)

### 2.1 Konsep Desain

| Nama Teknis | Nama Umum | Penjelasan |
|---|---|---|
| Dark Brutalism | Gaya brutal gelap | Border tebal, bayangan keras tanpa blur, warna kontras |
| CSS Custom Properties (`:root`) | Variabel / token desain | Warna, font, ukuran dipakai ulang |
| `--accent` / `--accent-2` | Warna aksen utama / kedua | Lime `#d4ff1a` dan pink `#ff3d71` (bisa diganti lewat tombol C) |
| `--bg`, `--ink` | Warna latar / warna teks | Hitam `#0b0b0b` dan krem `#f4f1e8` |
| `--sidebar-w`, `--bw` | Lebar sidebar / tebal border | 300px / 3px |

### 2.2 Tipografi

| Variabel | Font | Dipakai untuk |
|---|---|---|
| `--display` | Archivo Black | Judul besar |
| `--sans` | Space Grotesk | Paragraf |
| `--mono` | Space Mono | Label, tombol, menu, tag |

### 2.3 Teknik Styling per Bagian

| Nama Teknis | Nama Umum | Target | Efek |
|---|---|---|---|
| `box-shadow: Xpx Ypx 0 color` | Bayangan keras (offset shadow) | Kartu, tombol, foto | Kesan "timbul" ala brutalism |
| `position: fixed` + `inset` | Menempel tetap | Sidebar, HUD, progress | Tidak ikut scroll |
| `margin-left: var(--sidebar-w)` | Geser konten | `#main-content` | Memberi ruang untuk sidebar |
| CSS Grid (`grid-template-columns`) | Tata letak kolom | Hero, About, Skills, Project (12 kolom), Publikasi | Layout responsif |
| Flexbox | Tata letak baris | Tag, tombol, kontak | Susunan fleksibel |
| `repeating-linear-gradient` | Pola garis | Header sidebar, footer, scroll bar | Tekstur diagonal / strip |
| `linear-gradient` 1px | Pola kotak-kotak | `.section` background | Efek grid kertas |
| `-webkit-text-stroke` | Teks berongga | Angka kartu, tahun | Outline tanpa isi |
| `transform: rotate()` | Miring | Foto, stamp, label seksi | Kesan tempelan |
| `writing-mode: vertical-rl` | Teks vertikal | `.publication-year` | Tahun menyamping |
| `::first-letter` | Huruf pertama besar | Paragraf About | Drop cap |
| `counter-increment` | Penomoran otomatis | `.education-card::after` | Nomor 01, 02, ... |
| `body::after` + SVG noise | Efek grain | Seluruh halaman | Tekstur film |
| `::-webkit-scrollbar` | Scrollbar kustom | Halaman | Kotak, warna aksen |
| `mix-blend-mode: difference` | Mode campur warna | Kursor | Kursor terbaca di semua warna |
| Varian kartu | Kartu khusus | `.project-featured` (kuning), `.project-wide` (krem) | Penekanan proyek |

### 2.4 Responsif

| Breakpoint | Perubahan |
|---|---|
| ≤ 1180px | Grid minat jadi 2 kolom, kartu proyek penuh |
| ≤ 1024px | Sidebar jadi menu geser (drawer), layout jadi 1 kolom, muncul tombol hamburger |
| ≤ 720px | Timeline & publikasi 1 kolom, grid minat 1 kolom |
| `prefers-reduced-motion` | Semua animasi dimatikan untuk aksesibilitas |

---

## 3. Animasi & Interaksi

### 3.1 Animasi CSS

| Nama Teknis | Nama Umum | Target | Pemicu |
|---|---|---|---|
| `@keyframes marquee` | Teks berjalan | `.ticker-track` | Otomatis (loop), pause saat hover |
| `@keyframes blink` | Kedip | `.status-indicator` | Otomatis (loop) |
| `@keyframes glitch` | Efek glitch | `h1 span` di hero | Hover judul |
| `@keyframes shake` | Getar layar | `#main-content` | Kode Konami |
| `transition` + `translate` | Efek angkat | Semua kartu saat hover | Hover |
| `transform: rotate/scale` | Efek miring / zoom | Logo, foto profil, stamp | Hover |
| Loader panel `data-state` | Tirai transisi | `#page-loader` | Load & pindah halaman |

### 3.2 Animasi & Interaksi JavaScript

| Nama Teknis | Nama Umum | Fungsi JS | Pemicu | Efek |
|---|---|---|---|---|
| Loader + counter | Layar loading 0–100 | `runIntro()` | Halaman dibuka | Hitung naik, tirai terangkat |
| Page transition | Transisi antar halaman | `leaveTo()` | Klik link internal | Tirai turun lalu pindah |
| Custom cursor | Kursor bulat | `initCursor()` | Gerak mouse | Ring mengikuti, membesar dekat objek |
| Cursor label | Label di kursor | `assignCursorLabels()` | Hover kartu/tombol | Muncul teks (BACA, KONTAK, dll) |
| Magnetic button | Tombol tertarik | `proximity()` | Mouse mendekat | Elemen bergeser ke kursor |
| Tilt 3D + spotlight | Kartu miring + sorotan | `initCards()` | Hover kartu | Rotasi 3D dan cahaya mengikuti kursor |
| Text scramble | Teks acak lalu terbaca | `scramble()` | Hover link / judul masuk layar | Huruf acak berubah ke teks asli |
| Scrollspy | Menu aktif otomatis | `initSpy()` | Scroll | Highlight menu sesuai seksi |
| Scroll progress | Bar progres | `onScroll()` | Scroll | Bar atas terisi 0–100% |
| HUD | Panel info | `initSpy()` | Scroll | Nomor seksi, nama, persen |
| Parallax | Efek kedalaman | `initParallax()` | Gerak mouse di hero | Label foto & stamp bergeser |
| Burst | Ledakan kotak kecil | `initBurst()` | Klik | 9 kotak berhamburan |
| Clock | Jam WIB | `initClock()` | Tiap detik | Jam di sidebar |
| Tab title | Judul tab berubah | `initTabTitle()` | Pindah tab | "← Balik lagi dong ✶" |
| Mobile menu | Menu hamburger | `initMenu()` | Klik tombol | Sidebar geser masuk |

### 3.3 Shortcut & Easter Egg

| Tombol | Aksi |
|---|---|
| `J` / `K` | Pindah ke seksi berikut / sebelumnya |
| `C` | Ganti warna aksen (ACID, ORANGE, CYAN, PINK, MINT), tersimpan di `localStorage` |
| `Esc` | Tutup menu mobile |
| ↑ ↑ ↓ ↓ ← → ← → B A | Mode glitch (Konami code) |

---

## 4. Alur Singkat

1. Halaman dibuka → loader menutup layar (CSS `body::before` sebagai cadangan).
2. JS membuat elemen tambahan (ticker, HUD, kursor, menu, jam).
3. Hitungan loader selesai → tirai terangkat → halaman terlihat.
4. Scroll → scrollspy, progress, dan HUD diperbarui.
5. Klik link ke halaman lain → tirai turun → pindah halaman.