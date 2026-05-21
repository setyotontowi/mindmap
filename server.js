require('dotenv').config();
const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 4000;
const DB_PATH = path.join(__dirname, 'mindmap.db');

// Middleware
app.use(express.json({ limit: '50mb' })); // Mendukung data berukuran besar (penjelasan AI & cache)
app.use(express.static(__dirname)); // Sajikan frontend static files langsung dari root directory

// Inisialisasi Database SQLite
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Gagal membuka database SQLite:', err.message);
    } else {
        console.log('Terhubung dengan database SQLite.');
        db.run(`
            CREATE TABLE IF NOT EXISTS mindmaps (
                id TEXT PRIMARY KEY,
                name TEXT,
                tree_data TEXT,
                node_cache TEXT,
                node_statuses TEXT,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (tableErr) => {
            if (tableErr) {
                console.error('Gagal membuat tabel mindmaps:', tableErr.message);
            } else {
                console.log('Tabel database mindmaps siap digunakan.');
            }
        });
    }
});

// GET endpoint - Ambil semua mindmap (untuk history)
app.get('/api/mindmaps', (req, res) => {
    db.all('SELECT id, name, updated_at FROM mindmaps ORDER BY updated_at DESC', [], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Gagal mengambil daftar mindmap' });
        }
        res.json(rows || []);
    });
});

// GET endpoint - Ambil mindmap aktif berdasarkan ID, atau paling terakhir diupdate jika tanpa ID
app.get('/api/mindmap', (req, res) => {
    const id = req.query.id;
    
    if (id) {
        db.get('SELECT * FROM mindmaps WHERE id = ?', [id], (err, row) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Gagal mengambil data dari database SQLite' });
            }
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
        db.get('SELECT * FROM mindmaps ORDER BY updated_at DESC LIMIT 1', [], (err, row) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Gagal mengambil data dari database SQLite' });
            }
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
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET
            name = excluded.name,
            tree_data = excluded.tree_data,
            node_cache = excluded.node_cache,
            node_statuses = excluded.node_statuses,
            updated_at = CURRENT_TIMESTAMP
    `;

    const params = [
        targetId,
        name || '',
        JSON.stringify(tree_data || null),
        JSON.stringify(node_cache || {}),
        JSON.stringify(node_statuses || {})
    ];

    db.run(query, params, function (err) {
        if (err) {
            console.error('Gagal menyimpan mindmap:', err.message);
            return res.status(500).json({ error: 'Gagal menyimpan data ke database SQLite' });
        }
        res.json({ success: true, message: 'Mindmap berhasil disinkronisasi ke SQLite' });
    });
});

// DELETE endpoint - Hapus mindmap berdasarkan ID
app.delete('/api/mindmap/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM mindmaps WHERE id = ?', [id], function (err) {
        if (err) {
            console.error('Gagal menghapus mindmap:', err.message);
            return res.status(500).json({ error: 'Gagal menghapus mindmap dari database SQLite' });
        }
        res.json({ success: true, message: 'Mindmap berhasil dihapus dari SQLite' });
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
