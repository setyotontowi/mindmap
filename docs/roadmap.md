# To-Do List: Rabbit Hole Mindmap Learner 📝🎯

Sebagian besar fase telah selesai diimplementasikan. Beberapa fitur baru masih dalam tahap proposal.

---

## 🟩 FASE 1: UI Foundation & Styling (SELESAI)
- [x] Rancang tata letak (Layout) Split-screen HTML5 dengan Sidebar Chat (kiri) dan Canvas Mindmap (kanan). [index.html](file:///home/setyotontowi/Projects/mindmap/index.html)
- [x] Muat pustaka eksternal utama via CDN (D3.js v7, Marked.js, Lucide Icons). [index.html](file:///home/setyotontowi/Projects/mindmap/index.html)
- [x] Terapkan sistem desain Light-Mode bertema Perpustakaan Klasik (Scholarly Theme) di CSS dengan warna kertas hangat (`#f5f0e8`). [index.css](file:///home/setyotontowi/Projects/mindmap/index.css)
- [x] Rancang visualisasi kustom untuk kartu Node (Glow pill button dengan aksen warna akademik per level) dan status belajarnya di CSS. [index.css](file:///home/setyotontowi/Projects/mindmap/index.css)
- [x] Terapkan transisi halus untuk hover, modal pop-up, dan slide-out detail panel (drawer) di CSS. [index.css](file:///home/setyotontowi/Projects/mindmap/index.css)

---

## 🟩 FASE 2: Logika Aplikasi Utama (`app.js`) (SELESAI)
- [x] **Modul 1: State Management & LocalStorage Persistence**
  - [x] Buat objek state global untuk menyimpan data mindmap (tree), riwayat node, API Key Gemini, dan status progress belajar.
  - [x] Hubungkan loadState & saveState asinkron untuk menyimpan seluruh sesi pembelajaran ke `localStorage` (tahan terhadap refresh halaman).
- [x] **Modul 2: Integrasi Gemini API**
  - [x] Buat fungsi pemanggilan API ke endpoint Gemini 2.5/1.5 Flash menggunakan model fetch client.
  - [x] Desain prompt khusus dengan `generationConfig.responseMimeType: "application/json"` untuk menjamin data mindmap & deep-dive dikembalikan dalam format JSON valid.
  - [x] Tambahkan error handling visual jika API key kosong atau respons AI gagal di-parsing.
- [x] **Modul 3: D3.js Interactive Mindmap Renderer**
  - [x] Inisialisasi SVG canvas, D3 Tree Layout, dan zoom/pan behavior yang responsif.
  - [x] Render tautan melengkung horizontal bezier yang dinamis antarnode.
  - [x] Render node dinamis menggunakan `foreignObject` SVG sehingga kartu HTML bisa di-style penuh dengan CSS premium.
  - [x] Terapkan animasi penambahan sub-node baru saat rabbit hole diperluas.
- [x] **Modul 4: UI Event Handlers & Integrasi**
  - [x] Hubungkan form submit chat untuk menginisiasi pembuatan roadmap belajar pertama.
  - [x] Integrasikan status indikator mengetik AI ("AI sedang berpikir...") yang animatif.
  - [x] Hubungkan event klik node dengan deep dive otomatis (menghasilkan sub-node baru + materi Markdown lengkap).
  - [x] Hubungkan pengubah status belajar (Belum Mulai, Sedang Belajar, Selesai) untuk mengupdate warna node di canvas seketika.
  - [x] Integrasikan tombol navigasi zoom kontrol (Zoom-In, Zoom-Out, Fit-Screen) dan penutup sidebar chat.

---

## 🟩 FASE 3: Polishing & Panduan (SELESAI)
- [x] Uji dan poles visualisasi pohon hirarki D3.js agar tetap mulus pada kedalaman node bertingkat (*rabbit hole* tak terbatas).
- [x] Tambahkan panduan visual awal (Hint Overlay) yang memandu pengguna langkah demi langkah.
- [x] Sediakan berkas [README.md](file:///home/setyotontowi/Projects/mindmap/README.md) komprehensif untuk memudahkan peluncuran aplikasi secara lokal.

---

## 🟩 FASE 4: Integrasi Database SQLite (Penyimpanan Lokal & Sync) (SELESAI)
- [x] **Langkah 1: Setup Backend Server Minimalis**
  - [x] Inisialisasi proyek Node.js backend menggunakan **Express.js**.
  - [x] Tambahkan package driver database SQLite yang ringan dan cepat seperti `better-sqlite3` atau `sqlite3`.
- [x] **Langkah 2: Perancangan Skema Database (`mindmap.db`)**
  - [x] Buat tabel `mindmaps` dengan skema sederhana untuk menyimpan status belajar dan cache AI dalam format JSON (menghindari skema relasional yang rumit):
    - `id`: TEXT (Primary Key, misal: 'default' atau slug topik)
    - `name`: TEXT (Nama topik utama)
    - `tree_data`: TEXT (JSON string seluruh struktur pohon D3)
    - `node_cache`: TEXT (JSON string cache penjelasan AI & subtopics)
    - `node_statuses`: TEXT (JSON string status kemajuan belajar node)
    - `updated_at`: DATETIME
- [x] **Langkah 3: Pembuatan REST API Endpoints**
  - [x] `GET /api/mindmap` - Mengambil data mindmap aktif beserta status dan cache-nya dari database SQLite.
  - [x] `POST /api/mindmap` - Menyimpan atau memperbarui (upsert) state mindmap saat ini dari frontend ke database.
- [x] **Langkah 4: Koneksi Frontend ke API Backend (`app.js`)**
  - [x] Modifikasi fungsi `saveState` untuk mengirim data ke `POST /api/mindmap` via `fetch` selain menyimpannya di `localStorage` sebagai fallback.
  - [x] Modifikasi fungsi `loadState` saat inisialisasi aplikasi untuk memprioritaskan pengambilan data terbaru dari database (`GET /api/mindmap`).
- [x] Langkah 5: Polishing & Sinkronisasi Visual
  - [x] Tambahkan indikator status sinkronisasi kecil di UI (misalnya: "Tersimpan di Database 💾" atau "Sedang menyinkronkan...").
  - [x] Pastikan backend & frontend dapat dijalankan bersama dengan mudah (misalnya menggunakan script `npm run dev` / `concurrently`).
  - [x] Ketika dia membuat layer 0, dia juga membuat artikel detailnya 

---

## 🟩 FASE 5: Kustomisasi Node & Struktur Fleksibel (Manual CRUD & Editing) (SELESAI SEBAGIAN)
- [x] **Modul 1: Manipulasi Node Manual di Level Manapun**
  - [x] Tambahkan tombol "Tambah Sub-Node ➕" di detail drawer atau melalui menu pintas pada canvas untuk membuat node kustom baru di bawah node terpilih secara manual.
  - [x] Sediakan form edit sederhana untuk menyunting **Judul** dan **Deskripsi Singkat** node secara langsung.
- [x] **Modul 2: Pruning / Pemotongan Cabang (Delete & Prune)**
  - [x] Tambahkan tombol "Hapus Node 🗑️" untuk menghapus node tertentu beserta seluruh sub-cabang di bawahnya jika dirasa tidak relevan dengan arah eksplorasi.
  - [x] Pastikan perubahan struktur manual tersinkronisasi dengan lancar ke LocalStorage dan SQLite/PostgreSQL backend.
- [ ] **Modul 3: Drag & Drop Re-parenting (Opsional/Maju)**
  - [ ] Implementasikan kemampuan untuk memindahkan/menggeser node dan menyambungkannya ke node induk (parent) lain secara visual pada canvas D3.js.

---

## 🟩 FASE 6: Eksplorasi Konseptual Terarah & Ekspor (SELESAI)
- [x] **Modul 1: Custom AI Expansion Prompt**
  - [x] Izinkan pengguna memberikan instruksi tambahan saat memperluas rabbit hole (misal: "Ekspansi topik ini dengan fokus pada contoh kode Rust", atau "Fokuskan sub-topik ke aspek efisiensi energi").
  - [x] Sesuaikan API call Model agar menyisipkan instruksi eksplorasi spesifik dari pengguna ini ke dalam sub-topik baru yang dihasilkan.
- [x] **Modul 2: Ekspor Peta Pikiran Kustom**
  - [x] Sediakan tombol unduh untuk mengekspor visual canvas mindmap ke format gambar (PNG/SVG) resolusi tinggi.
  - [x] Tambahkan opsi ekspor ringkasan seluruh artikel penjelasan dari node-node yang telah dijelajahi ke dalam satu file Markdown terpadu.

---

## 🟩 FASE 7: Fitur Sticky Notes / Catatan Tempel (SELESAI)
- [x] **Modul 1: Sorot Teks (Text Highlighting)**
  - [x] Izinkan pengguna memblok/menyorot teks penting pada artikel detail penjelasan di panel detail (drawer).
  - [x] Tampilkan kuas penyorot atau palet warna untuk menandai teks dengan warna berbeda.
- [x] **Modul 2: Berikan Komentar / Catatan (Add Commentary)**
  - [x] Sediakan jendela/pop-up kecil untuk menambahkan catatan kaki atau komentar pada teks yang disorot tersebut.
  - [x] Tampilkan ikon catatan tempel (sticky note) di sebelah teks sorotan untuk membaca, menyunting, atau menghapus komentar.
- [x] **Modul 3: Persistensi & Sinkronisasi**
  - [x] Simpan semua data koordinat teks yang disorot beserta komentarnya ke dalam state aplikasi.
  - [x] Sinkronisasikan data sticky notes ini secara otomatis ke LocalStorage dan database.

---

## 🟩 FASE 8: Sistem Gaya Penulisan Artikel (Writing Style System) (SELESAI)
**Tujuan:** Membuat artikel yang dihasilkan AI terasa lebih hidup dan variatif dengan menyesuaikan gaya penulisan berdasarkan topik atau preferensi pengguna.

- [x] **Modul 1: Definisi 6 Gaya Penulisan + Sub-Gaya (18 Kombinasi)**
  - [x] 🎓 **Akademik (Scholarly)** — Formal, terstruktur, berbasis bukti. Cocok untuk sains, filsafat, sejarah, matematika.
    - [x] *Ensiklopedik* — Definisi ketat, taksonomi, referensi silang antar konsep.
    - [x] *Argumentatif* — Tesis → argumen → counter-argument → kesimpulan.
    - [x] *Komparatif* — Membandingkan dua atau lebih teori/pendekatan secara sistematis.
  - [x] 🛠️ **Teknis (Technical)** — Dense, presisi, to-the-point. Banyak kode dan perbandingan spesifikasi. Cocok untuk programming & engineering.
    - [x] *Tutorial Step-by-Step* — Instruksi urut dengan output yang diharapkan di tiap langkah.
    - [x] *Deep Internals* — Fokus ke cara kerja di balik layar (under the hood).
    - [x] *Best Practices & Pitfalls* — Do's and don'ts, common mistakes, trade-offs.
  - [x] ☕ **Santai (Casual)** — Seperti ngobrol dengan teman yang pintar. Analogi sehari-hari, bahasa ringan. Cocok untuk lifestyle & psikologi populer.
    - [x] *Ngobrol Langsung* — Gaya "kamu pasti pernah ngerasain ini..." — super conversational.
    - [x] *Analogi Kreatif* — Menjelaskan konsep kompleks dengan analogi sehari-hari yang tidak biasa.
    - [x] *FAQ Style* — Menjawab pertanyaan-pertanyaan yang biasa muncul di kepala pembaca.
  - [x] 📖 **Naratif (Storytelling)** — Dimulai dengan cerita atau kejadian nyata. Alur seperti esai non-fiksi populer. Cocok untuk sejarah & tokoh.
    - [x] *Biografi / Tokoh* — Diawali kisah seseorang yang relevan dengan topik.
    - [x] *Kejadian Bersejarah* — Momen kritis dalam sejarah sebagai pintu masuk topik.
    - [x] *Fiksi Analogi* — Skenario fiktif pendek untuk menggambarkan konsep abstrak.
  - [x] 💡 **Analitik (Analytical)** — Fokus pada *kenapa* dan *bagaimana*. Banyak breakdown pola & sebab-akibat. Cocok untuk ekonomi, strategi, bisnis.
    - [x] *Framework Thinking* — Menyajikan konsep sebagai kerangka berpikir yang bisa dipakai.
    - [x] *Data-Driven* — Banyak angka, statistik, tren, dan pola empiris.
    - [x] *First Principles* — Memulai dari asumsi paling dasar lalu membangun argumen ke atas.
  - [x] 🔥 **Provocateur (Mind-Opening)** — Sengaja menantang asumsi umum. Dibuka dengan pernyataan kontra-intuitif. Gaya Malcolm Gladwell / Freakonomics.
    - [x] *Myth Buster* — Membantah satu mitos besar yang umum dipercaya.
    - [x] *Devil's Advocate* — Membela sisi yang tidak populer secara argumen.
    - [x] *Reframing* — Mengubah cara pandang tentang sesuatu yang sudah dianggap familiar.
- [x] **Modul 2: Auto-Detect Gaya Berdasarkan Topik**
  - [x] Buat logika di system prompt agar AI memilih gaya yang paling sesuai secara otomatis berdasarkan nama topik dan konteks mindmap.
- [x] **Modul 3: Manual Override oleh Pengguna**
  - [x] Sediakan UI selector gaya penulisan (dropdown atau pill toggle) di detail drawer atau modal regenerate.
  - [x] Simpan preferensi gaya yang dipilih pengguna per-node ke dalam state dan cache.
- [x] **Modul 4: Integrasi ke Semua Titik Pembuatan Artikel**
  - [x] Terapkan system prompt gaya yang dipilih pada: pembuatan artikel layer 0, deep-dive node baru, dan regenerasi node.

---

## ⬜ FASE 9: Rombak Gaya Penulisan (Stillwell Marketing & Anti-AI Slop)
**Tujuan:** Mengintegrasikan prinsip marketing dari Stillwell Marketing Skills dan mekanisme proteksi anti-AI slop guna memastikan artikel terstruktur secara profesional, SEO-friendly, dan ditulis dengan nada yang alami/manusiawi.

- [ ] **Modul 1: Restrukturisasi 6 Gaya Penulisan Berorientasi Marketing**
  - [ ] 📈 **Direct Copywriting (Conversion-Focused)** — Fokus pada konversi dan persuasi menggunakan formula teruji (seperti AIDA atau PAS).
    - [ ] *AIDA Model* — Attention (kait yang kuat) → Interest (fakta menarik) → Desire (manfaat utama) → Action.
    - [ ] *PAS Formula* — Problem (identifikasi masalah) → Agitate (perdalam emosi/implikasi) → Solution.
    - [ ] *Benefit-Driven* — Menjelaskan fitur/konsep dengan murni menterjemahkannya ke keuntungan pengguna.
  - [ ] 🔍 **Technical & SEO Content** — Padat informasi, fokus pada penyusunan heading (H2/H3) yang logis dan *Search Intent* yang tepat.
    - [ ] *Search Intent Alignment* — Menjawab niat pencarian secara spesifik (informasional/transaksional).
    - [ ] *Semantic Keyword Rich* — Menyusun artikel agar kaya istilah relevan tanpa melakukan *keyword stuffing*.
    - [ ] *Actionable Tutorial* — Mengarahkan pembaca dengan langkah-langkah praktis dan terukur.
  - [ ] 🗣️ **Conversational Persona** — Santai, hangat, dan ramah seperti mentor pribadi.
    - [ ] *Friendly Coach* — Menggunakan "saya/kamu", mengajukan pertanyaan retoris, empati tinggi.
    - [ ] *Analogi Membumi* — Menghilangkan istilah rumit dan menggantinya dengan analogi dunia nyata yang sederhana.
    - [ ] *Q&A Dialogue* — Mengalir seperti dialog tanya-jawab yang antisipatif terhadap keraguan pembaca.
  - [ ] 🎭 **Story-Driven Content (Copywriting)** — Membungkus informasi/topik menggunakan teknik penceritaan (*storytelling*) yang emosional.
    - [ ] *Hero's Journey* — Tantangan → perjuangan → titik balik → solusi.
    - [ ] *Case Story* — Menggunakan kisah nyata/studi kasus singkat untuk membuktikan poin utama.
    - [ ] *Anecdotal Hook* — Membuka dengan anekdot pendek yang relevan sebelum masuk ke konsep dasar.
  - [ ] 🔬 **Analytical Case Study** — Mendalam, objektif, dan berbasis data empiris.
    - [ ] *Data-Driven Breakdown* — Menyajikan metrik, tren, angka, dan statistik.
    - [ ] *Root-Cause Analysis* — Menganalisis *sebab-akibat* secara runut.
    - [ ] *First Principles Review* — Membongkar konsep dari elemen penyusun paling mendasar.
  - [ ] 💡 **Actionable Frameworks (Thought Leadership)** — Mengajarkan metode, model mental, atau kerangka berpikir yang bisa langsung dipraktekkan.
    - [ ] *Mental Model* — Mengaitkan topik dengan kerangka berpikir terkenal (misalnya: Pareto, SWOT, Eisenhower).
    - [ ] *SOP / Playbook* — Menyajikan panduan operasional standar yang praktis.
    - [ ] *Pitfall & Best Practices* — Do's and Don'ts yang diuji di lapangan.
- [ ] **Modul 2: Implementasi Anti-AI Slop Engine**
  - [ ] Buat *Anti-Word List* ketat dalam system prompt untuk memblokir kata-kata klise AI (misalnya: *delve*, *testament*, *tapestry*, *furthermore*, *moreover*, *in conclusion*, *crucial*, *vital*, *not only... but also*, *let's embark*, *unlock*, *journey*, dll.).
  - [ ] Buat aturan struktur kalimat: membatasi kalimat pasif berlebihan, melarang pembukaan/penutup klise (seperti *"In the fast-paced world of..."*), dan memprioritaskan gaya penulisan manusia yang aktif dan to-the-point.
- [ ] **Modul 3: Integrasi UI & Backend Prompt**
  - [ ] Perbarui objek `WRITING_STYLES` di `js/ui.js` dengan opsi marketing baru.
  - [ ] Modifikasi dropdown pemilih gaya di detail drawer agar menampilkan 6 gaya berorientasi marketing yang baru beserta sub-gayanya.
  - [ ] Gabungkan *Anti-AI Slop rules* ke dalam `getWritingStyleInstruction` sehingga diterapkan secara universal pada semua pembentukan materi oleh Gemini API.

---

## ⬜ FASE 10: Fitur Library & Pengorganisasian Materi (PROPOSAL)
**Tujuan:** Mengaktifkan tab Library pada Dashboard untuk mengurasi, menyimpan, dan mengorganisasi peta pikiran serta materi hasil eksplorasi secara permanen.

- [ ] **Modul 1: Kurasi Buku & Materi Akademik**
  - [ ] Sediakan template kurasi otomatis untuk memilah mindmap berdasarkan jenis topik (misal: "Buku", "Jurnal", "Koleksi Pribadi").
  - [ ] Tambahkan grid view yang menarik dengan cover buatan atau representasi visual peta di subview Library.
- [ ] **Modul 2: Ekspor & Gabung Catatan**
  - [ ] Sediakan opsi untuk menggabungkan seluruh penjelasan node dalam satu mindmap menjadi "E-book" ringkas berformat PDF atau Markdown langsung dari Library.
- [ ] **Modul 3: Persistensi Koleksi**
  - [ ] Buat tabel `library_collections` di SQLite untuk mengelola koleksi terkurasi secara terpisah dari riwayat pencarian mentah (history).

---

## ⬜ FASE 11: Fitur Bookmark (Penyimpanan Cepat Node & Artikel) (PROPOSAL)
**Tujuan:** Memungkinkan pengguna menandai (bookmark) materi/artikel dari node tertentu di canvas mindmap agar dapat diakses langsung dari Dashboard/Library tanpa perlu mencari node tersebut di dalam struktur mindmap.

- [ ] **Modul 1: Tombol Bookmark di Detail Drawer & Node Card**
  - [ ] Tambahkan ikon bookmark (misalnya bintang atau pita pembatas buku) di sebelah judul artikel pada detail drawer.
  - [ ] Sediakan shortcut cepat untuk menambahkan/menghapus bookmark langsung dari node di canvas.
- [ ] **Modul 2: Tab/Koleksi Khusus Bookmark di Dashboard**
  - [ ] Integrasikan subview khusus atau bagian baru di dalam Library untuk mengelompokkan semua artikel/node yang di-bookmark.
  - [ ] Tampilkan daftar bookmark yang berisi judul node, nama mindmap asal, dan tanggal ditambahkan.
- [ ] **Modul 3: Database Integration & State Sync**
  - [ ] Buat tabel `bookmarks` di SQLite dengan skema `{ id, mindmap_id, node_name, created_at }`.
  - [ ] Sinkronisasikan state bookmark ke LocalStorage sebagai fallback dan ke server secara real-time.



