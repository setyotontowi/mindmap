# 🧠 Lubang Kelinci — AI Mindmap Learner

Aplikasi web belajar interaktif bertenaga AI: masukkan topik apa pun, dan aplikasi
akan menyusun **mindmap dinamis** yang bisa kamu eksplorasi sedalam mungkin
("rabbit hole"). Setiap node berisi penjelasan materi format Markdown dari AI,
lengkap dengan progress tracker, koleksi, markah buku, statistik belajar, dan
chat tutor.

> ⚠️ **Catatan arsitektur:** README versi lama menyebut aplikasi ini "murni
> frontend, tanpa build steps, simpan di localStorage". Itu **sudah tidak
> berlaku**. Versi sekarang adalah **full-stack**: Vite + Express + PostgreSQL.

---

## ✨ Fitur

- **Mindmap interaktif** (D3.js) dengan ekspansi node tak terbatas — klik node,
  AI membuat sub-topik baru yang lebih spesifik.
- **Detail drawer ala buku terbuka** — penjelasan materi Markdown + contoh kode/analogi.
- **Progress tracker** — tandai node *Belum Mulai / Sedang Belajar / Selesai*, warna node berubah real-time.
- **Chat Tutor** — tanya jawab detail materi di panel samping.
- **Koleksi, Markah Buku, Sorotan & Catatan, Library publik.**
- **Statistik belajar & analytics** (opt-in, bisa dimatikan di Pengaturan).
- **Login Google OAuth** untuk menyimpan peta lintas perangkat.
- **Multi-provider AI**: DeepSeek (default), Google Gemini, Anthropic Claude, 9Router — pilih di Pengaturan.
- **11 gaya penulisan AI** (Direct Copywriting, Academic & Research, Socratic, ELI5, dll.) + sub-gaya.
- **Ekspor** peta sebagai PNG / SVG / ringkasan Markdown; mode **Fullscreen**.
- **Tema** Terang / Gelap / Ikuti Sistem.
- **Persistensi**: preferensi lokal di `localStorage`; mindmap, status belajar,
  cache artikel, dan akun tersimpan di **PostgreSQL** via backend.

---

## 🏗️ Arsitektur

| Layer     | Teknologi                                             |
|-----------|-------------------------------------------------------|
| Frontend  | Vite + Vanilla JS + D3.js (entry: `src/main.js`)      |
| Backend   | Express (`server.js`, port **4000**) — REST API `/api/*` |
| Database  | PostgreSQL 16 (tabel auto-created saat server start)  |
| AI Proxy  | `/api/ai/completions` — DeepSeek / Gemini / Claude / 9Router |

CSS dimuat lewat JS (`src/js/globals.js` → `import '../index.css'`), jadi di mode
development frontend **harus** disajikan oleh Vite (bukan express static).

---

## 🚀 Cara Menjalankan

### Prasyarat
- Node.js 20+
- PostgreSQL 16 berjalan (lokal, atau via `docker compose`)
- File `.env` — salin dari `.env.example` dan isi minimal `DATABASE_URL` + 1 kunci AI

```bash
cd ~/Projects/mindmap
npm install
cp .env.example .env   # lalu isi DATABASE_URL dan API key
```

### Mode Development (disarankan saat ngoding) — 2 terminal

```bash
# Terminal 1 — Backend API (Express) di :4000
npm run dev

# Terminal 2 — Frontend (Vite dev server) di :5173
npm run dev:frontend
```

Buka **http://localhost:5173** (bukan :4000!). Vite otomatis mem-proxy `/api`
ke `localhost:4000`, jadi backend tetap kepakai. Hot-reload aktif untuk FE.

> ⚠️ Jangan buka http://localhost:4000 di mode dev untuk halaman utama:
> file `index.html` + JS/CSS mentah disajikan apa adanya tanpa diproses Vite,
> sehingga **CSS tidak ter-load** dan aplikasi tidak jalan.

### Mode Production — 1 perintah

```bash
npm run build
NODE_ENV=production node server.js
```

- `npm run build` menghasilkan `dist/` (CSS sudah di-extract ke `assets/*.css`
  dengan `<link>` normal).
- `server.js` menyajikan `dist/` di **http://localhost:4000** — port ini valid di mode produksi.
- Di `NODE_ENV=production`, server membaca `.env.production` jika ada; jika tidak ada, fallback ke `.env`.

### Docker (untuk deploy ke VPS)

```bash
docker compose up --build
```

- `db` — PostgreSQL 16 (volume `pgdata`), healthcheck otomatis.
- `mindmap` — aplikasi di port **4000**.
- Variabel DB dibaca dari `.env` (`DB_USER`, `DB_PASSWORD`, `DB_NAME`).

---

## ⚙️ Konfigurasi `.env`

| Variabel            | Fungsi                                             |
|---------------------|----------------------------------------------------|
| `DATABASE_URL`      | Koneksi PostgreSQL (wajib)                          |
| `DEEPSEEK_API_KEY`  | Provider AI default (DeepSeek)                      |
| `GEMINI_API_KEY`    | Provider AI Google Gemini                           |
| `CLAUDE_API_KEY`    | Provider AI Anthropic Claude                        |
| `ROUTER_API_KEY`    | Provider 9Router (dev/agregator)                    |
| `GOOGLE_CLIENT_ID`  | OAuth Google (login)                                |
| `GOOGLE_CLIENT_SECRET` | OAuth Google (login)                             |
| `APP_URL`           | Domain publik aplikasi (mis. `https://lubangkelinci.my.id`) |
| `PORT`              | Port server (default `4000`)                        |
| `DB_USER` / `DB_PASSWORD` / `DB_NAME` | Hanya dipakai docker-compose          |

Tabel database (`users`, `sessions`, `mindmaps`, `nodes`, `node_events`, dll.)
dibuat otomatis oleh `server.js` saat pertama kali start.

---

## 📂 Struktur Berkas

```
mindmap/
├── index.html / about.html / privacy.html   # halaman (entry Vite)
├── src/
│   ├── main.js                              # entry: import globals → CSS + urutan modul
│   ├── index.css                            # desain sistem (tema light/dark)
│   └── js/
│       ├── globals.js                       # import CSS + attach D3/Marked ke window
│       ├── state.js                         # state management
│       ├── api.js                           # client AI + API backend
│       ├── renderer.js                      # render D3 mindmap
│       ├── trivia.js / analytics.js / navigation.js / ui.js / main.js
├── server.js                                # Express API + auth OAuth + proxy AI + static
├── vite.config.js                           # build + proxy dev (/api → :4000)
├── docker-compose.yml / Dockerfile          # deploy container
├── dist/                                    # hasil build produksi (vite build)
├── docs/                                    # roadmap, pricing, dll.
└── .env / .env.example
```

---

## 🔑 Cara Mendapatkan API Key AI

1. DeepSeek: https://platform.deepseek.com — default provider.
2. Google Gemini: https://aistudio.google.com (gratis di AI Studio).
3. Anthropic Claude: https://console.anthropic.com.
4. Isi di `.env` lalu restart server, atau pilih provider di **Pengaturan ⚙️** aplikasi
   (kunci di `.env` backend dipakai otomatis; kunci yang diinput user tersimpan di `localStorage`).
