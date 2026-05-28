# 📋 To-Do List: Implementasi Tampilan Versi Mobile (Rabbit Hole Learner)

Dokumen ini berisi daftar tugas terstruktur untuk mengimplementasikan tampilan versi mobile dari aplikasi **Rabbit Hole Mindmap Learner** sesuai dengan referensi desain 4 layar utama (Riwayat Belajar, Mind Map, Baca Materi, dan Cari Materi).

---

## 🎨 1. Fondasi CSS & Layout Global Mobile
- [x] **Variabel Warna Tema (Green Emerald):**
  - Definisikan ulang/pastikan variabel CSS untuk warna hijau di `index.css`:
    - `--primary-green`: `#00a374` (Hijau Utama)
    - `--primary-green-dark`: `#0d5240` (Teks/Header)
    - `--primary-green-light`: `#e6f7f3` (Background aktif/badge)
    - `--bg-mobile`: `#f8fafc` atau `#f4f6f5` (Background layar halus)
- [x] **Desain Bottom Navigation Bar:**
  - Tambahkan elemen HTML `<nav class="mobile-bottom-nav">` di bagian bawah `index.html`.
  - Siapkan 3 menu utama:
    - **History** (Ikon: `history`)
    - **Search** (Ikon: `search` / `compass`)
    - **Create** (Ikon: `plus-circle`)
  - Buat style CSS `.mobile-bottom-nav` dengan posisi `fixed` di bawah layar, glassmorphism blur, dan bayangan halus (`box-shadow`).
- [x] **Layout Viewport Wrapper (`@media` Query):**
  - Bungkus container utama menggunakan media query `@media (max-width: 768px)` untuk mereset grid desktop menjadi layout single-column vertikal yang ramah sentuhan.

---

## 🕒 2. Halaman 1: Riwayat Belajar (Simple)
- [x] **Header Riwayat Belajar:**
  - Logo "Rabbit Hole" (kiri), ikon pencarian (tengah/kanan), dan avatar user bulat hijau (kanan).
- [x] **Hero Text:**
  - Heading `Riwayat Belajar (Simple)` dan deskripsi *"Review your recent intellectual explorations."*
- [x] **Card Item Riwayat:**
  - Buat elemen card list interaktif dengan border-radius melengkung halus (`border-radius: var(--radius-card)` atau `16px`).
  - Tambahkan ikon bulat berlatar hijau transparan di sebelah kiri.
  - Tampilkan judul topik (contoh: *Innovator's Dilemma*, *AI Bubble History*) dan tanggal belajar di sebelah kanan atas.
  - Tampilkan indikator progres:
    - **Progress Bar** hijau dengan persentase (misal: `80%`).
    - **Badge Selesai** (ikon centang hijau + tulisan "Selesai").
- [x] **Floating Action Button (FAB):**
  - Buat tombol bulat hijau `+` melayang di kanan bawah untuk membuat topik/peta pikiran baru secara instan.

---

## 🗺️ 3. Halaman 2: Mind Map (Simple)
- [x] **Header Top Bar:**
  - Tampilkan judul topik aktif (contoh: `psychology Rabbit Hole`) beserta ikon cari dan profil user di bagian atas.
- [x] **Viewport Canvas Responsive:**
  - Pastikan SVG `#mindmap-svg` dan D3.js secara dinamis mengukur lebar layar mobile (`window.innerWidth`) saat dimuat.
  - Sembunyikan sidebar panel kiri/kanan desktop secara otomatis pada mode mobile.
- [x] **Floating Controls Mindmap:**
  - Pindahkan kontrol zoom ke kanan/kiri bawah dalam bentuk vertikal pill:
    - Tombol `+` (Zoom In)
    - Tombol `-` (Zoom Out)
    - Tombol `Pas Layar` (Fit Screen)
- [x] **Status Badge:**
  - Letakkan indikator status `"● Live Sync Enabled"` melayang di kiri bawah dengan latar hijau transparan tipis.

---

## 📖 4. Halaman 3: Baca Materi (Simple)
- [x] **Navigation & Action Header:**
  - Header transparan dengan tombol kembali (`←`), judul materi yang sedang dibaca (*Innovator's Dilemma*), ikon bagikan (`share-2`), dan menu opsi (`more-vertical`).
- [x] **Reading Progress Bar:**
  - Tempatkan bar progres horizontal tipis di bawah header.
  - Tampilkan indikator persentase membaca dan estimasi waktu sisa (misal: `"Bacaan: 45%"` & `"3 min lagi"`).
- [x] **Typography & Content Area:**
  - Atur ukuran teks artikel utama agar sangat nyaman dibaca di layar HP (sekitar `16px` atau `1.05rem` dengan `line-height: 1.65`).
  - Buat style blockquote khusus berwarna latar hijau sangat muda (`--primary-green-light`) dengan garis aksen hijau tua di sisi kiri.
  - Format sub-heading dengan bobot teks yang tebal dan estetis (*"Anatomi Paradoks: Mengapa Logika Bisnis Menjebak"*).

---

## 🔍 5. Halaman 4: Cari Materi (Simple)
- [x] **Hero Section:**
  - Judul besar `Cari Materi (Simple)` dan deskripsi instruksi *"Temukan konsep baru atau buka kembali perjalanan belajarmu."*
- [x] **Search Input Bar:**
  - Input box melengkung penuh (pill-shaped) dengan placeholder *"Apa yang ingin kamu pelajari hari ini?"* dan ikon kaca pembesar terintegrasi di dalamnya.
- [x] **Section: Riwayat Belajar (Recent Searches):**
  - Sub-header `"RIWAYAT BELAJAR"` dengan tombol akselerator `"Hapus Semua"`.
  - List item pencarian terakhir dengan ikon putar balik/riwayat di kiri dan tanda panah kanan (`>`) di ujung kanan untuk navigasi cepat.
- [x] **Section: Saran Topik (Suggested Topics):**
  - Tampilkan baris horizontal pills yang dapat digeser ke samping (*horizontal scrollable tags*):
    - *Quantum Computing*, *Filosofi Stoik*, *Ekonomi Digital*, *Product Management*, dll.

---

## ⚡ 6. Interaksi, Transisi & Logika Navigasi
- [x] **Bottom Navigation Controller (JS):**
  - Di `js/ui.js` atau `js/main.js`, buat event listener untuk bottom nav agar dapat mengganti status aktif halaman:
    - Tab **History** -> Tampilkan Halaman Riwayat Belajar.
    - Tab **Search** -> Tampilkan Halaman Cari / Eksplorasi.
    - Tab **Create** -> Picu modal pembuatan topik baru secara instan.
- [x] **Transisi Halaman Mulus:**
  - Terapkan efek transisi CSS `fade-in` atau `slide-in` ringan ketika berpindah tab agar pengalaman terasa seperti aplikasi native (Android/iOS).
- [x] **Optimasi Touch/Gesture:**
  - Sesuaikan sensitivitas pan/zoom D3.js pada layar sentuh agar pengguna dapat menggeser mindmap dengan satu or dua jari secara responsif dan tanpa lag.
