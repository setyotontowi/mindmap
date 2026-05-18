# 🧠 Rabbit Hole Mindmap Learner ✨

Aplikasi web interaktif bertenaga AI (**Gemini API**) untuk memetakan jalan belajarmu secara dinamis dan mendalam. Menggunakan visualisasi **D3.js** dengan desain **Light Mode ala Perpustakaan (Scholarly Theme)** yang hangat, nyaman di mata, dan berestetika klasik.

---

## 🎨 Keunggulan Visual & Fitur
1. **Scholarly Light Mode:** Warna kertas hangat (*warm paper cream* `#f5f0e8`), font serif (*Lora* & *Georgia*), aksen cokelat kayu tua (*Auburn* `#8b4513`), dan garis tipis khas buku catatan.
2. **Infinite Rabbit Hole Expansion:** Setiap kali Anda mengklik node materi di mindmap, AI akan secara dinamis membuat sub-topik baru yang lebih spesifik di bawah node tersebut, memungkinkan Anda masuk sedalam mungkin ke materi pembelajaran.
3. **Detail Drawer (Open Book Style):** Penjelasan teori dari AI berformat Markdown lengkap (beserta contoh kode/analogi) disajikan secara rapi di panel kanan yang menyerupai halaman buku terbuka.
4. **Pembelajaran Mandiri (Progress Tracker):** Tandai setiap node sebagai *Belum Mulai*, *Sedang Belajar*, atau *Selesai*. Warna indikator node akan berubah secara real-time di canvas.
5. **State Persistence:** Semua peta pikiran, status belajar, cache artikel, dan API Key Anda tersimpan otomatis secara lokal di `localStorage` browsermu. Progress belajarmu tidak akan hilang meskipun halaman di-reload!

---

## 🚀 Cara Menjalankan Aplikasi

Aplikasi ini dibangun murni di sisi frontend (**no complex build steps**). Anda dapat menjalankannya dengan beberapa opsi mudah berikut:

### Opsi A: Langsung dari File Explorer (Paling Cepat)
1. Buka folder `/home/setyotontowi/Projects/mindmap` di File Manager Anda.
2. Klik ganda pada berkas [index.html](file:///home/setyotontowi/Projects/mindmap/index.html) untuk langsung membukanya di browser favoritmu (Chrome, Firefox, Edge).

### Opsi B: Menggunakan Local Dev Server (Disarankan)
Jika ingin performa & pemuatan aset via protokol HTTP yang lebih optimal, jalankan web server lokal sederhana:
* **Menggunakan Node.js / npx:**
  ```bash
  npx serve .
  ```
* **Menggunakan Python (bawaan Linux):**
  ```bash
  python3 -m http.server 8000
  ```
  Lalu buka [http://localhost:8000](http://localhost:8000) di browsermu.

---

## ⚙️ Cara Menghubungkan Gemini API Key
1. Dapatkan kunci API secara gratis di [Google AI Studio](https://aistudio.google.com/).
2. Jalankan aplikasi mindmap di browser Anda.
3. Klik tombol **gerigi/settings ⚙️** di pojok kanan atas Sidebar Chat.
4. Tempelkan (paste) API Key Anda dan klik **Simpan Kunci API**.
5. Kunci API tersimpan dengan aman secara lokal di browsermu (`localStorage`).

---

## 📂 Struktur Berkas
* [index.html](file:///home/setyotontowi/Projects/mindmap/index.html) - Kerangka split-screen chat & mindmap canvas.
* [index.css](file:///home/setyotontowi/Projects/mindmap/index.css) - Desain sistem Scholarly Light Mode & animasi.
* [app.js](file:///home/setyotontowi/Projects/mindmap/app.js) - Logika render D3.js, API client Gemini, dan state manager.
* [README.md](file:///home/setyotontowi/Projects/mindmap/README.md) - Panduan penggunaan aplikasi (berkas ini).
