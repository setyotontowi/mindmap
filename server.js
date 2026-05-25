require('dotenv').config();
const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json({ limit: '50mb' })); // Mendukung data berukuran besar (penjelasan AI & cache)
app.use(express.static(__dirname)); // Sajikan frontend static files langsung dari root directory

// Inisialisasi Database PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

pool.query(`
    CREATE TABLE IF NOT EXISTS mindmaps (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255),
        tree_data TEXT,
        node_cache TEXT,
        node_statuses TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`, (tableErr) => {
    if (tableErr) {
        console.error('Gagal membuat tabel mindmaps di PostgreSQL:', tableErr.message);
    } else {
        console.log('Tabel database mindmaps di PostgreSQL siap digunakan.');
    }
});

// GET endpoint - Ambil semua mindmap (untuk history)
app.get('/api/mindmaps', (req, res) => {
    pool.query('SELECT id, name, updated_at FROM mindmaps ORDER BY updated_at DESC', (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Gagal mengambil daftar mindmap' });
        }
        res.json(result.rows || []);
    });
});

// GET endpoint - Ambil mindmap aktif berdasarkan ID, atau paling terakhir diupdate jika tanpa ID
app.get('/api/mindmap', (req, res) => {
    const id = req.query.id;
    
    if (id) {
        pool.query('SELECT * FROM mindmaps WHERE id = $1', [id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Gagal mengambil data dari database PostgreSQL' });
            }
            const row = result.rows[0];
            if (!row) {
                return res.json(null);
            }
            res.json({
                id: row.id,
                name: row.name,
                tree_data: JSON.parse(row.tree_data || 'null'),
                node_cache: JSON.parse(row.node_cache || '{}'),
                node_statuses: JSON.parse(row.node_statuses || '{}'),
                updated_at: row.updated_at
            });
        });
    } else {
        pool.query('SELECT * FROM mindmaps ORDER BY updated_at DESC LIMIT 1', (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Gagal mengambil data dari database PostgreSQL' });
            }
            const row = result.rows[0];
            if (!row) {
                return res.json(null);
            }
            res.json({
                id: row.id,
                name: row.name,
                tree_data: JSON.parse(row.tree_data || 'null'),
                node_cache: JSON.parse(row.node_cache || '{}'),
                node_statuses: JSON.parse(row.node_statuses || '{}'),
                updated_at: row.updated_at
            });
        });
    }
});

// POST endpoint - Simpan / Sinkronisasi mindmap ke database
app.post('/api/mindmap', (req, res) => {
    const { id, name, tree_data, node_cache, node_statuses } = req.body;
    const targetId = id || 'default';

    const query = `
        INSERT INTO mindmaps (id, name, tree_data, node_cache, node_statuses, updated_at)
        VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET
            name = EXCLUDED.name,
            tree_data = EXCLUDED.tree_data,
            node_cache = EXCLUDED.node_cache,
            node_statuses = EXCLUDED.node_statuses,
            updated_at = CURRENT_TIMESTAMP
    `;

    const params = [
        targetId,
        name || '',
        JSON.stringify(tree_data || null),
        JSON.stringify(node_cache || {}),
        JSON.stringify(node_statuses || {})
    ];

    pool.query(query, params, (err, result) => {
        if (err) {
            console.error('Gagal menyimpan mindmap:', err.message);
            return res.status(500).json({ error: 'Gagal menyimpan data ke database PostgreSQL' });
        }
        res.json({ success: true, message: 'Mindmap berhasil disinkronisasi ke PostgreSQL' });
    });
});

// DELETE endpoint - Hapus mindmap berdasarkan ID
app.delete('/api/mindmap/:id', (req, res) => {
    const id = req.params.id;
    pool.query('DELETE FROM mindmaps WHERE id = $1', [id], (err, result) => {
        if (err) {
            console.error('Gagal menghapus mindmap:', err.message);
            return res.status(500).json({ error: 'Gagal menghapus mindmap dari database PostgreSQL' });
        }
        res.json({ success: true, message: 'Mindmap berhasil dihapus dari PostgreSQL' });
    });
});

// Proxy endpoint untuk callRouterAI (keamanan API Key)
app.post('/api/ai/completions', async (req, res) => {
    try {
        const { messages, response_format, temperature, stream, max_tokens } = req.body;
        
        // Ambil API Key dari .env, fallback ke Authorization header dari client
        let apiKey = process.env.ROUTER_API_KEY;
        if (!apiKey && req.headers.authorization) {
            apiKey = req.headers.authorization.replace('Bearer ', '');
        }

        if (!apiKey) {
            return res.status(401).json({ 
                error: { message: 'API Key Router belum dikonfigurasi di server (.env) maupun client.' } 
            });
        }

        const url = 'http://localhost:20128/v1/chat/completions';
        const model = 'kr/claude-sonnet-4.5';

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model,
                messages,
                response_format,
                temperature,
                stream,
                max_tokens
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            return res.status(response.status).send(errText);
        }

        const rawText = await response.text();
        res.send(rawText);
    } catch (error) {
        console.error('Error on AI proxy endpoint:', error);
        res.status(500).json({ error: { message: error.message || 'Internal Server Error' } });
    }
});


// Jalankan Server
app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`🧠 Rabbit Hole Mindmap Learner is running!`);
    console.log(`🌐 Silakan buka di browser: http://localhost:${PORT}`);
    console.log(`=================================================`);
});
