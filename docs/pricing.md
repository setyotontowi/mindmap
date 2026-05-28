# Analisis Biaya AI — Pro Plan Rp 49.000/bulan

> Terakhir diperbarui: 2026-05-27
> Asumsi: 1 USD = Rp 16.000

---

## Asumsi Token per Node

- Token per node: **~6.000 token** (2.000 input + 4.000 output)

---

## Harga API per Provider

### Google Gemini

| Model             | Input (per 1M) | Output (per 1M) |
|-------------------|---------------|-----------------|
| Gemini 2.5 Flash  | $0.15         | $0.60           |
| Gemini 1.5 Flash  | $0.075        | $0.30           |

### Anthropic Claude

| Model               | Input (per 1M) | Output (per 1M) |
|---------------------|---------------|-----------------|
| Claude 3.5 Haiku    | $0.80         | $4.00           |
| Claude 3.5 Sonnet   | $3.00         | $15.00          |
| Claude 3 Opus       | $15.00        | $75.00          |

---

## Biaya per Node

Formula: `(2000 × input_rate + 4000 × output_rate) / 1_000_000`

| Provider & Model       | Biaya/node (USD) | Biaya/node (IDR) |
|------------------------|-----------------|------------------|
| Gemini 1.5 Flash       | $0.00135        | Rp 22            |
| Gemini 2.5 Flash       | $0.00270        | Rp 43            |
| Claude 3.5 Haiku       | $0.01760        | Rp 282           |
| Claude 3.5 Sonnet      | $0.06600        | Rp 1.056         |
| Claude 3 Opus          | $0.33000        | Rp 5.280         |

---

## Break-even per User (Revenue Rp 49.000/bulan)

> Break-even = Rp 49.000 / biaya per node

| Provider & Model       | Max node sebelum rugi |
|------------------------|----------------------|
| Gemini 1.5 Flash       | ~2.227 node          |
| Gemini 2.5 Flash       | ~1.140 node          |
| Claude 3.5 Haiku       | ~174 node            |
| Claude 3.5 Sonnet      | ~46 node             |
| Claude 3 Opus          | ~9 node              |

---

## Simulasi Gross Margin per Skenario

Revenue per user: **Rp 49.000**

### Skenario A — Casual User (100 node/bulan)

| Provider & Model       | Biaya AI   | Gross Margin       |
|------------------------|------------|--------------------|
| Gemini 1.5 Flash       | Rp 2.200   | Rp 46.800 **(95%)** ✅ |
| Gemini 2.5 Flash       | Rp 4.300   | Rp 44.700 **(91%)** ✅ |
| Claude 3.5 Haiku       | Rp 28.200  | Rp 20.800 **(42%)** ⚠️ |
| Claude 3.5 Sonnet      | Rp 105.600 | -Rp 56.600 **(-115%)** ❌ |
| Claude 3 Opus          | Rp 528.000 | -Rp 479.000 **(-977%)** ❌ |

### Skenario B — Power User (500 node/bulan)

| Provider & Model       | Biaya AI    | Gross Margin        |
|------------------------|-------------|---------------------|
| Gemini 1.5 Flash       | Rp 11.000   | Rp 38.000 **(78%)** ✅ |
| Gemini 2.5 Flash       | Rp 21.500   | Rp 27.500 **(56%)** ✅ |
| Claude 3.5 Haiku       | Rp 141.000  | -Rp 92.000 **(-188%)** ❌ |
| Claude 3.5 Sonnet      | Rp 528.000  | -Rp 479.000 **(-977%)** ❌ |

---

## Kesimpulan & Rekomendasi

1. **Gunakan Gemini** sebagai backend utama. Hanya Gemini (1.5 atau 2.5 Flash) yang viable di harga Rp 49.000/bulan.
2. **Claude tidak viable** untuk model ini kecuali harga dinaikkan signifikan atau quota sangat dibatasi:
   - Claude Haiku: butuh harga ~Rp 150.000/bulan agar aman di 500 node
   - Claude Sonnet/Opus: tidak realistis untuk consumer plan
3. **Quota aman untuk Pro**: **500 node/bulan** → margin 56–78% bahkan untuk power user Gemini
4. **Kalau ingin offer Claude**: jadikan add-on premium terpisah (~Rp 150.000/bulan) dengan kuota ketat (max 100 node)

---

## Proyeksi Pendapatan (Gemini 2.5 Flash, kuota 500 node/bulan)

| Jumlah User Pro | Revenue      | Biaya AI Est. | Net           |
|-----------------|--------------|---------------|---------------|
| 10              | Rp 490.000   | Rp 215.000    | Rp 275.000    |
| 50              | Rp 2.450.000 | Rp 1.075.000  | Rp 1.375.000  |
| 100             | Rp 4.900.000 | Rp 2.150.000  | Rp 2.750.000  |
| 500             | Rp 24.500.000| Rp 10.750.000 | Rp 13.750.000 |

---

## Optimasi Biaya: Community RAG

Ide: sebelum call AI, cari dulu di `node_cache` mindmap publik user lain yang topiknya mirip via vector similarity (pgvector).

```
User expand node
    ↓
Similarity search di node_cache komunitas
    ├─ HIT (>90%)     → return langsung         → AI cost = Rp 0
    ├─ PARTIAL (70%)  → inject sebagai context  → token lebih pendek
    └─ MISS           → AI call normal
```

### Dampak ke Margin (Gemini 2.5 Flash, 500 node/bulan)

| Cache Hit Rate | Biaya AI efektif/node | Gross Margin |
|---------------|----------------------|--------------|
| 0% (tanpa RAG) | Rp 43               | 56%          |
| 30%            | Rp 30               | 68% ✅        |
| 50%            | Rp 21               | 78% ✅        |
| 70%            | Rp 13               | 87% ✅✅       |

> **Network effect:** semakin banyak user → hit rate naik → margin naik otomatis.

### Biaya Embedding (pgvector)

- Model: `text-embedding-004` (Google) — $0.000025/1K token
- Per node (~500 token): **~Rp 0,2** → hampir gratis
- Infrastruktur: pgvector extension di PostgreSQL yang sudah ada → **tidak butuh vector DB baru**

---

## Proyeksi Harga API 5 Tahun ke Depan

Tren historis: harga untuk *capability setara* turun **5–10x per 2 tahun** akibat kompetisi dan efisiensi hardware.

| Tahun | Prediksi Flash-tier (input/1M) | Biaya/node (IDR) | Margin di 500 node |
|-------|-------------------------------|------------------|--------------------|
| 2026  | $0.15 (sekarang)              | Rp 43            | 56%                |
| 2027  | ~$0.05                        | Rp 14            | 86% ✅              |
| 2028  | ~$0.015                       | Rp 4             | 96% ✅✅             |
| 2029  | ~$0.005                       | Rp 1,3           | ~99% ✅✅            |
| 2031  | ~$0.001                       | Rp 0,3           | ~100% ✅✅           |

> Proyeksi untuk model *kelas yang setara* — model terbaru tetap mahal, tapi tier bawah terus turun.

### Implikasi Strategis

**Tailwind (positif):**
- Margin naik otomatis tanpa perlu naikkan harga ke user
- Bisa naikkan kuota Pro tanpa menambah biaya signifikan
- Di 2028+, biaya AI per user Pro mungkin hanya Rp 200–500/bulan

**Risiko:**
- Barrier to entry turun → lebih banyak kompetitor bisa masuk
- Diferensiasi tidak bisa lagi dari "punya akses AI" saja

### Strategi Berdasarkan Timeline

```
2026: Akuisisi user, bangun habit → harga Rp 49k masuk akal
2027: Bangun Community RAG → network effect jadi moat
2028: AI cost sangat murah → naikkan kuota, pertahankan harga → margin meledak
2029+: Kompetitif bukan dari AI, tapi dari:
       - Kualitas knowledge base komunitas
       - Social/collaborative learning features
       - Integrasi institusi pendidikan (B2B)
```

---

## Ringkasan Eksekutif

| Aspek | Kesimpulan |
|---|---|
| Model AI terbaik sekarang | Gemini 2.5 Flash — satu-satunya yang viable di Rp 49k |
| Quota aman Pro | 500 node/bulan → margin 56% |
| Claude | Tidak viable kecuali add-on ~Rp 150k/bulan, max 100 node |
| RAG komunitas | Bisa naikkan margin 68–87% + jadi diferensiasi kompetitif |
| Tren 5 tahun | Harga AI turun dramatis → margin naik otomatis → fokus ke moat non-AI |
