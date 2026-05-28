# Rabbit Hole Mindmap - Roadmap

## Visi Besar

**Infinite exploration without frontend exploding.** Ganti hard limit (max depth 5) dengan **pagination-based rendering** - pohon hanya menampilkan 4-5 level per halaman, dan user bisa terus masuk lebih dalam tanpa batas.

**+ Navi Agent.** Satu agen cerdas yang menyatu di web app, aktif menuntun user belajar — bukan cuma nunggu diklik.

**+ Analytics & Consent.** Lacak usage tanpa melanggar privasi — token usage, waktu baca, aktivitas user. Dengan cookie consent yang proper karena produk publik.

---

## Konsep: Context Window Pagination

### Cara Kerja

Aturan Inti:
1. **Depth relatif**, bukan absolut. Tiap halaman punya viewRoot sendiri. Depth 0 = view root.
2. **Max render 5 level** (depth 0-4 relative). Pasti ringan.
3. **Node di depth 4** - kalau diklik dan belum tercache - **paginasi** (set sebagai viewRoot baru).
4. **Breadcrumb** selalu nunjukkin path dari root asli ke viewRoot sekarang.
5. **Klik breadcrumb** - naik ke halaman sebelumnya.
6. **Warna level** (--l0 sampai --l4) dipakai ulang tiap halaman.

---

## Konsep: Navi Agent — The Learning Companion

Navi adalah agen bawaan web app (bukan bot terpisah) yang aktif menuntun user belajar.

### Fitur Navi

#### 1. Auto-Suggest — Floating Suggestion Bubble
Setelah user selesai baca node (tutup drawer), Navi muncul sebagai **floating bubble** di pojok canvas:
- ➡️ Lanjut ke subtopik terdekat
- ➡️ Coba quiz ringan dari materi yang baru dibaca
- ➡️ Explore topik related yang belum disentuh

#### 2. Learning Path Generator — "Beri Aku Topik"
User ketik "Gw mau belajar Docker dari 0" → Navi generate **mindmap utuh** dengan struktur kurikulum:
```
Level 0: Docker
Level 1: ├─ Container Basics
         ├─ Dockerfile
         ├─ Docker Compose
         └─ Volume & Network
Level 2: ├─ (breakdown otomatis tiap subtopik)
```

#### 3. Smart Quiz Mode
Setelah user selesai baca 1-2 node dalam kluster, Navi tawarkan **quiz singkat**.
Hasil quiz → saran ulang atau lanjut level berikutnya.

#### 4. Weak Spot Detection
Navi catet pasif: node dibaca sebentar, node diklik tapi drawer ga dibuka.
Saat balik ke mindmap: "Ada 3 node yang mungkin perlu lu perdalam lagi nih..."

---

## Konsep: Analytics & Privacy

### Kenapa Analytics?
- **Developer insight**: fitur mana yang paling dipake, berapa token dikonsumsi, node paling populer
- **User insight**: user bisa liat stat belajarnya sendiri (total waktu, jumlah node, progress)
- **Cost monitoring**: token usage per session — penting kalau pake paid API

### Data Yang Dilacak
- **Node events**: created_at, view count, total read time, tokens per explanation
- **AI usage**: provider, model, prompt tokens, completion tokens, latency
- **Session**: total nodes explored, quiz attempts, quiz scores, mindmaps created
- **User activity**: active days, total learning time, nodes completed

### Consent Flow
- Cookie consent banner (GDPR-style) pas pertama kali load
- User milih: Accept All / Reject Non-Essential / Customize
- Essential cookie: session auth aja
- Analytics cookie: Google Analytics / Plausible / self-hosted tracker (opsional)
- User bisa ubah preferensi kapan aja lewat settings

---

## Task List (Prioritas)

### Phase 1: Foundation - State & Data Layer

#### Task 1.1: Tambah state pagination
File: src/js/state.js
- Tambah: viewRoot (pointer ke node root halaman ini)
- Tambah: breadcrumbs (array of {name, id} - path dari root asli)
- saveState() - persist viewRoot dan breadcrumbs
- loadState() - restore setelah reload

#### Task 1.2: Helper functions
File: src/js/state.js (atau file baru src/js/pagination.js)
- getViewRoot() - return state.viewRoot
- getRelativeDepth(d3Node) - depth relatif terhadap viewRoot
- paginateTo(node) - set node jadi viewRoot baru
- paginateBack() - balik ke viewRoot sebelumnya
- resetPagination() - balik ke root asli

---

### Phase 2: Render Changes

#### Task 2.1: Ubah updateMindmap render dari viewRoot
File: src/js/renderer.js (line 101)
Before: rootNodeData = d3.hierarchy(sourceData, d => d.collapsed ? null : d.children)
After:  const renderRoot = state.viewRoot || sourceData
        rootNodeData = d3.hierarchy(renderRoot, d => d.collapsed ? null : d.children)

#### Task 2.2: Level colors relatif
File: src/js/renderer.js (line 195)
Before: level-${d.depth} (depth absolut)
After:  level-${Math.min(d.depth, 4)} (depth relatif, capped at 4)

#### Task 2.3: Ganti hard limit jadi paginasi
File: src/js/renderer.js (line 307-314)
Hapus: if (d3Node.depth >= 5 && !state.nodeCache[nodeName]) { alert(...); return }
Ganti: Cek depth relatif >= 4, kalau ya dan belum tercache -> paginateTo(d3Node.data)

---

### Phase 3: Breadcrumb UI

#### Task 3.1: HTML + CSS Breadcrumb bar
File: index.html dan src/index.css
- Tambah div#breadcrumb-bar (.hidden default)
- CSS: flex, padding 8px 16px, overflow-x auto, font-size 13px

#### Task 3.2: Render breadcrumb JS
File: src/js/ui.js
- Fungsi renderBreadcrumbs() yang render path breadcrumb
- Klik breadcrumb -> paginateToIndex(i) -> re-render tree

---

### Phase 4: Integrasi & Edge Cases

- Task 4.1: Cached nodes di depth dalam -> buka drawer, jangan paginate
- Task 4.2: Search di seluruh state.mindmapData, bukan cuma viewRoot
- Task 4.3: collapseNonIntersectingNodes() tetap jalan di viewRoot baru
- Task 4.4: Save/restore breadcrumbs - trace ulang dari root asli pas load
- Task 4.5: Tiap paginate -> zoomFit() biar user lihat halaman baru full

---

### Phase 5: Polish & UX

- Animasi transisi halaman (fade out/in)
- Visual indicator di node depth 4 (ikon atau tooltip)
- Breadcrumb scroll horizontal di mobile
- Tooltip: Klik untuk masuk halaman berikutnya

---

### Phase 6: Analytics & Cookie Consent

#### Task 6.1: Database schema — analytics tables
File: `server.js` (initDb)
- Tambah tabel `node_events`:
  ```sql
  node_events (
    id SERIAL PRIMARY KEY,
    mindmap_id VARCHAR(255),
    node_name VARCHAR(255),
    action VARCHAR(50),  -- 'view', 'explain', 'quiz'
    duration_seconds INT,
    tokens_used INT,
    model VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
  ```
- Tambah tabel `session_events`:
  ```sql
  session_events (
    id SERIAL PRIMARY KEY,
    mindmap_id VARCHAR(255),
    event_type VARCHAR(50),  -- 'mindmap_create', 'quiz_complete', 'node_complete'
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
  ```
- Migration script buat existing users (tabel baru, nullable OK)

#### Task 6.2: API endpoints analytics
File: `server.js`
- `POST /api/track/node-event` — track individual node action
  - Payload: `{ mindmapId, nodeName, action, duration, tokens, model }`
- `POST /api/track/session-event` — track session-level event
  - Payload: `{ mindmapId, eventType, metadata }`
- `GET /api/stats/mindmap/:id` — statistik per mindmap
  - Response: `{ totalNodes, totalReadTime, totalTokens, topNodes[], quizScores[] }`
- `GET /api/stats/user` — statistik per user (rata-rata, tren)
  - Response: `{ totalMindmaps, totalStudyTime, totalTokensUsed, activeDays, avgQuizScore }`

#### Task 6.3: Cookie consent banner
File: `index.html` + `src/index.css` + `src/js/analytics.js`
- **Banner component** di index.html:
  - Fixed bottom bar
  - Teks: "Kami menggunakan cookie untuk meningkatkan pengalaman belajar Anda."
  - 3 tombol: "Terima Semua" | "Kustomisasi" | "Tolak"
- **CSS styling**: smooth slide-up animation, backdrop blur
- **Cookie preferences** di localStorage (`rabbit_hole_consent`)
  - Values: `{ analytics: boolean, essential: true }`
- **Settings modal upgrade**: tambah tab "Privasi" dengan toggle analytics
- **Link "Kebijakan Privasi"** — placeholder page untuk nanti

#### Task 6.4: Frontend tracker
File (baru): `src/js/analytics.js`
- **Function `trackNodeEvent(action, data)`**:
  - Cek consent dulu (`localStorage.rabbit_hole_consent`)
  - Kalau analytics disetujui → POST ke `/api/track/node-event`
  - Kalau ditolak → skip
- **Function `trackSessionEvent(eventType, metadata)`**:
  - Sama, cek consent dulu
- **Auto-track events**:
  - Node view: on drawer open → `trackNodeEvent('view', { nodeName, duration })`
  - AI explain: on API response → `trackNodeEvent('explain', { tokens, model })`
  - Quiz: on submit → `trackSessionEvent('quiz_complete', { score, total })`
  - Mindmap create: → `trackSessionEvent('mindmap_create', { name })`
  - Node selesai: on status 'done' → `trackSessionEvent('node_complete', { nodeName })`
- **Duration tracking**: start time pas drawer buka, hitung delta pas drawer tutup
  - skip kalau < 3 detik (accidental click)
  - Simpan per nodeName, akumulasi kalau revisit

#### Task 6.5: Stats dashboard (user-facing)
File: `src/js/analytics.js` + `index.html` + `src/index.css`
- **Stat panel** di sidebar (collapsible):
  - Total waktu belajar
  - Total node dijelajahi
  - Total token dipakai
  - Quiz average score
  - Mindmaps aktif
- **Per-mindmap stats** di drawer footer:
  - Waktu baca per node
  - Jumlah AI calls
  - Tokens per explanation
- **Visual sederhana**: progress bar, badge, sparkline nanti

#### Task 6.6: Admin/developer dashboard (opsional, internal)
File (baru): `server.js` (route `/admin/stats`)
- Auth-protected (owner only)
- Tabel overview: total users, total AI calls, total tokens, avg latency
- Top 10 most explored nodes across all mindmaps
- Token usage trend (daily/weekly)
- Cost estimation (based on provider pricing)

---

### Phase 7: Navi Foundation — Backend Agent API

#### Task 7.1: Generate learning path endpoint
File: `server.js`
- Endpoint baru `POST /api/generate-path`
- Prompt Gemini khusus: output struktur JSON tree (bukan teks bebas)
- Validasi & parse response AI → format mindmapData

#### Task 7.2: Quiz generation endpoint
File: `server.js`
- Endpoint `POST /api/generate-quiz`
- Kirim context (nama node + explanation) → Gemini balikin 3-5 pertanyaan
- Response: `{ questions: [{ question, options, answer }] }`

#### Task 7.3: Node tracking API
File: `server.js`
- Endpoint `POST /api/track-node-view`
- Payload: `{ mindmapId, nodeName, duration, drawerOpened }`
- Simpan di tabel `node_events` PostgreSQL

---

### Phase 8: Navi Frontend — Agent UI

#### Task 8.1: Navi state & constants
File (baru): `src/js/navi.js`
- `naviState = { suggestions: [], lastQuiz: null, weakNodes: [] }`
- Threshold constants: min read time, quiz cooldown, dll.

#### Task 8.2: Auto-suggest bubble component
File: `src/js/navi.js`
- Fungsi `showSuggestion(options)` — render floating card
- Styling: card kecil, pojok kanan bawah, fade in/out
- Tombol aksi: klik → execute (expand node, buka quiz, dll.)
- Auto-hide setelah 15 detik / user klik dismiss

#### Task 8.3: Quiz modal UI
File: `src/js/navi.js` + `index.html` + `src/index.css`
- Modal quiz dengan progress bar
- Single choice / multiple choice questions
- Timer opsional (30 detik per soal)
- Result screen: skor + rekomendasi

#### Task 8.4: Weak spot banner
File: `src/js/navi.js`
- Saat load mindmap, cek node_events dari DB
- Tampilkan banner subtle: "3 node butuh perhatian" dengan tombol "Lihat"
- Klik → highlight node-node tersebut di canvas

---

### Phase 9: Navi Integrasi & UX Polish

#### Task 9.1: Trigger auto-suggest dari drawer close
File: `src/js/ui.js` (atau `navi.js`)
- Hook ke `closeDetailDrawer()`
- Setelah drawer nutup, delay 2 detik → cek eligible buat suggestion
- Criteria: node baru selesai dibaca (ada di nodeCache), bukan repeat visit

#### Task 9.2: Learning path input UI
File: `index.html` + `src/js/ui.js`
- Input field di homepage: "Apa yang mau lu pelajari?"
- Auto-focus, placeholder berputar (rotate inspirasi topik)
- Tombol "Generate Mindmap" → panggil `/api/generate-path`

#### Task 9.3: Quiz trigger logic
File: `src/js/navi.js`
- Track jumlah node selesai dalam satu kluster (parent yang sama)
- Setelah 3+ node selesai, tawarkan quiz lewat suggestion bubble
- Jangan spam — cooldown 10 menit antar quiz

---

## Milestone

| Milestone | Target | Isi |
|---|---|---|
| M1: Core Pagination | Phase 1-2 | ViewRoot state, render dari viewRoot, ganti hard limit |
| M2: Breadcrumb UI | Phase 3 | Breadcrumb bar, back navigation, reset |
| M3: Stability | Phase 4 | Search lintas halaman, save/restore, collapse, zoom |
| M4: Polish | Phase 5 | Animasi, mobile, visual indicator, tooltip |
| **M5: Analytics** | **Phase 6** | **Cookie consent, event tracking, stats dashboard, admin panel** |
| **M6: Navi Core** | **Phase 7-8** | **Generate path API, quiz API, floating bubble, weak spot** |
| **M7: Navi Integration** | **Phase 9** | **Trigger logic, learning path UI, quiz flow mulus** |

---

## File Changes Summary

| File | Changes |
|---|---|
| src/js/state.js | Tambah viewRoot, breadcrumbs, helper functions |
| src/js/renderer.js | Hierarchy dari viewRoot, level class relatif, ganti hard limit ke paginasi |
| src/js/ui.js | renderBreadcrumbs(), hook close drawer → trigger Navi |
| index.html | Breadcrumb bar, quiz modal, learning path input, **cookie consent banner** |
| src/index.css | Breadcrumb CSS, Navi bubble, quiz modal styling, **cookie banner, stats panel** |
| **src/js/navi.js** | **(BARU) Navi agent: suggestion bubble, quiz modal, weak spot** |
| **src/js/analytics.js** | **(BARU) Analytics: event tracking, consent check, stats dashboard** |
| **server.js** | **+3 Navi endpoint: generate-path, generate-quiz, track-node-view** |
| **server.js** | **+4 Analytics endpoint: track-node-event, track-session-event, stats/mindmap, stats/user** |
| **server.js** | **(initDb) +2 tabel: node_events, session_events** |
