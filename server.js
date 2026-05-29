const path = require('path');
const fs = require('fs');

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
const envPath = path.resolve(__dirname, envFile);
if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
} else {
    require('dotenv').config();
}

const express = require('express');

const { Pool } = require('pg');
const crypto = require('crypto');

const app = express();
app.set('trust proxy', true);
const PORT = process.env.PORT || 4000;

// Helper to parse cookies
const parseCookies = (cookieHeader) => {
    const list = {};
    if (!cookieHeader) return list;
    cookieHeader.split(';').forEach((cookie) => {
        const parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });
    return list;
};

// Middleware
app.use(express.json({ limit: '50mb' })); // Mendukung data berukuran besar (penjelasan AI & cache)
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
} else {
    app.use(express.static(__dirname));
}


// Global Logger Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ➡️  ${req.method} ${req.url}`);
    next();
});

// Inisialisasi Database PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// Database Schema Initialization
const initDb = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                google_id VARCHAR(255) UNIQUE,
                email VARCHAR(255) UNIQUE,
                name VARCHAR(255),
                picture VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Tabel database users siap/berhasil dibuat.');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS sessions (
                id VARCHAR(255) PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                expires_at TIMESTAMP
            )
        `);
        console.log('Tabel database sessions siap/berhasil dibuat.');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS mindmaps (
                id VARCHAR(255) PRIMARY KEY,
                name VARCHAR(255),
                tree_data TEXT,
                node_cache TEXT,
                node_statuses TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        await pool.query(`
            ALTER TABLE mindmaps ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
        `);
        console.log('Tabel database mindmaps dan relasi siap digunakan.');

        // Phase 3: Tabel nodes relasional (additive, tidak menghapus data lama)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS nodes (
                id VARCHAR(500) PRIMARY KEY,
                mindmap_id VARCHAR(255) REFERENCES mindmaps(id) ON DELETE CASCADE,
                parent_id VARCHAR(500),
                name VARCHAR(500),
                status VARCHAR(50) DEFAULT 'todo',
                explanation TEXT,
                depth INTEGER DEFAULT 0,
                position INTEGER DEFAULT 0,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_nodes_mindmap_id ON nodes(mindmap_id)`);
        console.log('Tabel nodes relasional siap digunakan.');

        // Phase 6: Analytics tables
        await pool.query(`
            CREATE TABLE IF NOT EXISTS node_events (
                id SERIAL PRIMARY KEY,
                mindmap_id VARCHAR(255) REFERENCES mindmaps(id) ON DELETE CASCADE,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                node_name VARCHAR(500),
                action VARCHAR(50),
                duration_seconds INT DEFAULT 0,
                tokens_used INT DEFAULT 0,
                model VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Tabel node_events siap digunakan.');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS session_events (
                id SERIAL PRIMARY KEY,
                mindmap_id VARCHAR(255) REFERENCES mindmaps(id) ON DELETE CASCADE,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                event_type VARCHAR(50),
                metadata JSONB,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_session_events_mindmap ON session_events(mindmap_id)`);
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_node_events_mindmap ON node_events(mindmap_id)`);
        console.log('Tabel session_events siap digunakan.');

        // Phase 10: library_collections table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS library_collections (
                id SERIAL PRIMARY KEY,
                mindmap_id VARCHAR(255) REFERENCES mindmaps(id) ON DELETE CASCADE,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                category VARCHAR(100) DEFAULT 'Buku',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT unique_mindmap_user UNIQUE(mindmap_id, user_id)
            )
        `);
        console.log('Tabel library_collections siap digunakan.');

        // Phase 11: bookmarks table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS bookmarks (
                id SERIAL PRIMARY KEY,
                mindmap_id VARCHAR(255) REFERENCES mindmaps(id) ON DELETE CASCADE,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                node_name VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT unique_mindmap_node_user UNIQUE(mindmap_id, node_name, user_id)
            )
        `);
        console.log('Tabel bookmarks siap digunakan.');
    } catch (err) {
        console.error('Gagal menginisialisasi skema database:', err.message);
    }
};
initDb();

// Session Authenticator Middleware
app.use(async (req, res, next) => {
    req.user = null;
    const cookies = parseCookies(req.headers.cookie);
    const sessionId = cookies.session_id;
    if (sessionId) {
        try {
            const result = await pool.query(
                `SELECT u.* FROM sessions s 
                 JOIN users u ON s.user_id = u.id 
                 WHERE s.id = $1 AND s.expires_at > CURRENT_TIMESTAMP`,
                [sessionId]
            );
            if (result.rows.length > 0) {
                req.user = result.rows[0];
            }
        } catch (e) {
            console.error('Error validating session:', e.message);
        }
    }
    next();
});

// Helper: Ratakan tree rekursif menjadi array flat nodes
function flattenTree(node, mindmapId, parentId = null, depth = 0, position = 0, result = []) {
    if (!node || !node.name) return result;
    const nodeId = `${mindmapId}::${node.name}`;
    result.push({ id: nodeId, mindmap_id: mindmapId, parent_id: parentId, name: node.name, depth, position });
    if (Array.isArray(node.children)) {
        node.children.forEach((child, i) => flattenTree(child, mindmapId, nodeId, depth + 1, i, result));
    }
    return result;
}

// GET endpoint - Ambil semua mindmap (untuk history)
app.get('/api/mindmaps', (req, res) => {
    const userId = req.user ? req.user.id : null;
    console.log(`[Mindmaps] Fetching all mindmaps list for user ID: ${userId || 'guest'}`);
    const query = userId 
        ? 'SELECT id, name, tree_data, node_statuses, updated_at FROM mindmaps WHERE user_id = $1 ORDER BY updated_at DESC'
        : 'SELECT id, name, tree_data, node_statuses, updated_at FROM mindmaps WHERE user_id IS NULL ORDER BY updated_at DESC';
    const params = userId ? [userId] : [];

    pool.query(query, params, (err, result) => {
        if (err) {
            console.error(`[Mindmaps] Error fetching mindmaps:`, err);
            return res.status(500).json({ error: 'Gagal mengambil daftar mindmap' });
        }
        console.log(`[Mindmaps] Found ${result.rows?.length || 0} mindmaps in history.`);
        res.json(result.rows || []);
    });
});

// GET endpoint - Ambil mindmap aktif berdasarkan ID, atau paling terakhir diupdate jika tanpa ID
app.get('/api/mindmap', (req, res) => {
    const id = req.query.id;
    const userId = req.user ? req.user.id : null;
    console.log(`[Mindmap] Request to load mindmap. ID = ${id || 'active/latest'}, User ID = ${userId || 'guest'}`);
    
    if (id) {
        const query = 'SELECT * FROM mindmaps WHERE id = $1';
        const params = [id];

        pool.query(query, params, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Gagal mengambil data dari database PostgreSQL' });
            }
            const row = result.rows[0];
            if (!row) {
                return res.json(null);
            }
            
            const isOwner = row.user_id ? (row.user_id === userId) : true;

            res.json({
                id: row.id,
                name: row.name,
                tree_data: JSON.parse(row.tree_data || 'null'),
                node_cache: JSON.parse(row.node_cache || '{}'),
                node_statuses: JSON.parse(row.node_statuses || '{}'),
                user_id: row.user_id,
                is_owner: isOwner,
                updated_at: row.updated_at
            });
        });
    } else {
        const query = userId
            ? 'SELECT * FROM mindmaps WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1'
            : 'SELECT * FROM mindmaps WHERE user_id IS NULL ORDER BY updated_at DESC LIMIT 1';
        const params = userId ? [userId] : [];

        pool.query(query, params, (err, result) => {
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
                user_id: row.user_id,
                is_owner: true,
                updated_at: row.updated_at
            });
        });
    }
});

// POST endpoint - Simpan / Sinkronisasi mindmap ke database
app.post('/api/mindmap', async (req, res) => {
    const { id, name, tree_data, node_cache, node_statuses } = req.body;
    const targetId = id || ('mm_' + Date.now());
    const userId = req.user ? req.user.id : null;
    console.log(`[Mindmap] Syncing mindmap ID: ${targetId} ("${name || 'untitled'}") for user ID: ${userId || 'guest'}`);

    try {
        const checkRes = await pool.query('SELECT user_id FROM mindmaps WHERE id = $1', [targetId]);
        if (checkRes.rows.length > 0) {
            const existingOwnerId = checkRes.rows[0].user_id;
            if (existingOwnerId !== null && existingOwnerId !== userId) {
                console.warn(`[Mindmap] Unauthorized sync attempt for ID: ${targetId} by user ID: ${userId || 'guest'}`);
                return res.status(403).json({ error: 'Anda tidak memiliki hak untuk mengubah mindmap ini.' });
            }
        }

        const query = `
            INSERT INTO mindmaps (id, name, tree_data, node_cache, node_statuses, user_id, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
            ON CONFLICT(id) DO UPDATE SET
                name = EXCLUDED.name,
                tree_data = EXCLUDED.tree_data,
                node_cache = EXCLUDED.node_cache,
                node_statuses = EXCLUDED.node_statuses,
                user_id = COALESCE(mindmaps.user_id, EXCLUDED.user_id),
                updated_at = CURRENT_TIMESTAMP
        `;

        const params = [
            targetId,
            name || '',
            JSON.stringify(tree_data || null),
            JSON.stringify(node_cache || {}),
            JSON.stringify(node_statuses || {}),
            userId
        ];

        await pool.query(query, params);

        // Phase 3: Dual-write ke tabel nodes relasional
        if (tree_data) {
            const flatNodes = flattenTree(tree_data, targetId);
            const statuses = node_statuses || {};
            const cache = node_cache || {};
            for (const node of flatNodes) {
                const nodeStatus = statuses[node.name] || 'todo';
                const nodeExplanation = cache[node.name]?.explanation || null;
                await pool.query(`
                    INSERT INTO nodes (id, mindmap_id, parent_id, name, status, explanation, depth, position, updated_at)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)
                    ON CONFLICT(id) DO UPDATE SET
                        status = EXCLUDED.status,
                        explanation = COALESCE(EXCLUDED.explanation, nodes.explanation),
                        depth = EXCLUDED.depth,
                        position = EXCLUDED.position,
                        updated_at = CURRENT_TIMESTAMP
                `, [node.id, node.mindmap_id, node.parent_id, node.name, nodeStatus, nodeExplanation, node.depth, node.position]);
            }
            console.log(`[Mindmap] Dual-wrote ${flatNodes.length} nodes to relational table.`);
        }

        console.log(`[Mindmap] Successfully synced mindmap ID: ${targetId}`);
        res.json({ success: true, message: 'Mindmap berhasil disinkronisasi ke PostgreSQL' });
    } catch (err) {
        console.error(`[Mindmap] Failed to save/sync mindmap ID: ${targetId}:`, err.message);
        res.status(500).json({ error: 'Gagal menyimpan data ke database PostgreSQL' });
    }
});

// DELETE endpoint - Hapus mindmap berdasarkan ID
app.delete('/api/mindmap/:id', async (req, res) => {
    const id = req.params.id;
    const userId = req.user ? req.user.id : null;
    console.log(`[Mindmap] Deleting mindmap ID: ${id} for user ID: ${userId || 'guest'}`);

    try {
        const checkRes = await pool.query('SELECT user_id FROM mindmaps WHERE id = $1', [id]);
        if (checkRes.rows.length > 0) {
            const existingOwnerId = checkRes.rows[0].user_id;
            if (existingOwnerId !== null && existingOwnerId !== userId) {
                console.warn(`[Mindmap] Unauthorized delete attempt for ID: ${id} by user ID: ${userId || 'guest'}`);
                return res.status(403).json({ error: 'Anda tidak memiliki hak untuk menghapus mindmap ini.' });
            }
        }

        const query = 'DELETE FROM mindmaps WHERE id = $1';
        await pool.query(query, [id]);
        console.log(`[Mindmap] Successfully deleted mindmap ID: ${id}`);
        res.json({ success: true, message: 'Mindmap berhasil dihapus dari PostgreSQL' });
    } catch (err) {
        console.error(`[Mindmap] Failed to delete mindmap ID: ${id}:`, err.message);
        res.status(500).json({ error: 'Gagal menghapus mindmap dari database PostgreSQL' });
    }
});

// GET endpoint - Ambil semua mindmap yang disimpan di library
app.get('/api/library', async (req, res) => {
    const userId = req.user ? req.user.id : null;
    console.log(`[Library] Fetching library collections for user ID: ${userId || 'guest'}`);
    try {
        const query = userId 
            ? `SELECT lc.category, lc.created_at as saved_at, mm.* 
               FROM library_collections lc
               JOIN mindmaps mm ON lc.mindmap_id = mm.id
               WHERE lc.user_id = $1
               ORDER BY lc.created_at DESC`
            : `SELECT lc.category, lc.created_at as saved_at, mm.* 
               FROM library_collections lc
               JOIN mindmaps mm ON lc.mindmap_id = mm.id
               WHERE lc.user_id IS NULL
               ORDER BY lc.created_at DESC`;
        const params = userId ? [userId] : [];
        const result = await pool.query(query, params);
        
        const collections = result.rows.map(row => ({
            id: row.id,
            name: row.name,
            category: row.category,
            saved_at: row.saved_at,
            tree_data: JSON.parse(row.tree_data || 'null'),
            node_cache: JSON.parse(row.node_cache || '{}'),
            node_statuses: JSON.parse(row.node_statuses || '{}')
        }));
        res.json(collections);
    } catch (e) {
        console.error('[Library] Gagal mengambil koleksi:', e);
        res.status(500).json({ error: 'Gagal mengambil data library' });
    }
});

// POST endpoint - Tambah/Hapus mindmap dari library
app.post('/api/library', async (req, res) => {
    const { mindmap_id, category, action } = req.body;
    const userId = req.user ? req.user.id : null;
    if (!mindmap_id) return res.status(400).json({ error: 'mindmap_id diperlukan.' });
    
    console.log(`[Library] ${action === 'remove' ? 'Removing' : 'Adding'} mindmap ID: ${mindmap_id} for user ID: ${userId || 'guest'}`);
    try {
        if (action === 'remove') {
            const deleteQuery = userId
                ? 'DELETE FROM library_collections WHERE mindmap_id = $1 AND user_id = $2'
                : 'DELETE FROM library_collections WHERE mindmap_id = $1 AND user_id IS NULL';
            const params = userId ? [mindmap_id, userId] : [mindmap_id];
            await pool.query(deleteQuery, params);
            return res.json({ success: true, is_saved: false });
        } else {
            const insertQuery = `
                INSERT INTO library_collections (mindmap_id, user_id, category)
                VALUES ($1, $2, $3)
                ON CONFLICT (mindmap_id, user_id) DO UPDATE SET category = EXCLUDED.category
            `;
            await pool.query(insertQuery, [mindmap_id, userId, category || 'Buku']);
            return res.json({ success: true, is_saved: true });
        }
    } catch (e) {
        console.error('[Library] Gagal menyimpan/menghapus dari library:', e);
        res.status(500).json({ error: 'Gagal memproses request library.' });
    }
});

// GET endpoint - Ambil semua bookmarks user
app.get('/api/bookmarks', async (req, res) => {
    const userId = req.user ? req.user.id : null;
    console.log(`[Bookmarks] Fetching bookmarks list for user ID: ${userId || 'guest'}`);
    try {
        const query = userId
            ? `SELECT b.id as bookmark_id, b.node_name, b.created_at, mm.id as mindmap_id, mm.name as mindmap_name, mm.node_cache
               FROM bookmarks b
               JOIN mindmaps mm ON b.mindmap_id = mm.id
               WHERE b.user_id = $1
               ORDER BY b.created_at DESC`
            : `SELECT b.id as bookmark_id, b.node_name, b.created_at, mm.id as mindmap_id, mm.name as mindmap_name, mm.node_cache
               FROM bookmarks b
               JOIN mindmaps mm ON b.mindmap_id = mm.id
               WHERE b.user_id IS NULL
               ORDER BY b.created_at DESC`;
        const params = userId ? [userId] : [];
        const result = await pool.query(query, params);
        
        const bookmarks = result.rows.map(row => {
            const cache = JSON.parse(row.node_cache || '{}');
            const nodeExplanation = cache[row.node_name]?.explanation || '';
            return {
                id: row.bookmark_id,
                mindmap_id: row.mindmap_id,
                mindmap_name: row.mindmap_name,
                node_name: row.node_name,
                explanation: nodeExplanation,
                created_at: row.created_at
            };
        });
        res.json(bookmarks);
    } catch (e) {
        console.error('[Bookmarks] Gagal mengambil bookmark:', e);
        res.status(500).json({ error: 'Gagal mengambil bookmarks' });
    }
});

// POST endpoint - Tambah/Hapus bookmarks node
app.post('/api/bookmarks', async (req, res) => {
    const { mindmap_id, node_name, action } = req.body;
    const userId = req.user ? req.user.id : null;
    if (!mindmap_id || !node_name) return res.status(400).json({ error: 'mindmap_id dan node_name diperlukan.' });
    
    console.log(`[Bookmarks] ${action === 'remove' ? 'Removing' : 'Adding'} bookmark for node: ${node_name} in mindmap ID: ${mindmap_id} for user ID: ${userId || 'guest'}`);
    try {
        if (action === 'remove') {
            const deleteQuery = userId
                ? 'DELETE FROM bookmarks WHERE mindmap_id = $1 AND node_name = $2 AND user_id = $3'
                : 'DELETE FROM bookmarks WHERE mindmap_id = $1 AND node_name = $2 AND user_id IS NULL';
            const params = userId ? [mindmap_id, node_name, userId] : [mindmap_id, node_name];
            await pool.query(deleteQuery, params);
            return res.json({ success: true, is_bookmarked: false });
        } else {
            const insertQuery = `
                INSERT INTO bookmarks (mindmap_id, user_id, node_name)
                VALUES ($1, $2, $3)
                ON CONFLICT (mindmap_id, node_name, user_id) DO NOTHING
            `;
            await pool.query(insertQuery, [mindmap_id, userId, node_name]);
            return res.json({ success: true, is_bookmarked: true });
        }
    } catch (e) {
        console.error('[Bookmarks] Gagal memproses bookmark:', e);
        res.status(500).json({ error: 'Gagal memproses request bookmark.' });
    }
});

// --- PHASE 3: NODE GRANULAR ENDPOINTS ---

// PATCH /api/node/:id/status - Update status satu node
app.patch('/api/node/:id/status', async (req, res) => {
    const nodeId = decodeURIComponent(req.params.id);
    const { status } = req.body;
    if (!['todo', 'doing', 'done'].includes(status)) {
        return res.status(400).json({ error: 'Status tidak valid.' });
    }
    try {
        await pool.query(
            `UPDATE nodes SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
            [status, nodeId]
        );
        res.json({ success: true });
    } catch (err) {
        console.error('[Node] Failed to update status:', err.message);
        res.status(500).json({ error: 'Gagal update status node.' });
    }
});

// GET /api/node/:id/explanation - Lazy-load penjelasan satu node
app.get('/api/node/:id/explanation', async (req, res) => {
    const nodeId = decodeURIComponent(req.params.id);
    try {
        const result = await pool.query(`SELECT explanation FROM nodes WHERE id = $1`, [nodeId]);
        if (!result.rows.length) return res.status(404).json({ error: 'Node tidak ditemukan.' });
        res.json({ explanation: result.rows[0].explanation || null });
    } catch (err) {
        console.error('[Node] Failed to get explanation:', err.message);
        res.status(500).json({ error: 'Gagal mengambil explanation.' });
    }
});

// POST /api/node/:id/explanation - Simpan penjelasan satu node
app.post('/api/node/:id/explanation', async (req, res) => {
    const nodeId = decodeURIComponent(req.params.id);
    const { explanation } = req.body;
    try {
        await pool.query(
            `UPDATE nodes SET explanation = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
            [explanation, nodeId]
        );
        res.json({ success: true });
    } catch (err) {
        console.error('[Node] Failed to save explanation:', err.message);
        res.status(500).json({ error: 'Gagal menyimpan explanation.' });
    }
});

// Proxy endpoint untuk callRouterAI (keamanan API Key)
app.post('/api/ai/completions', async (req, res) => {
    try {
        const { messages, response_format, temperature, stream, max_tokens, provider, model } = req.body;
        console.log(`[AI] Completion Request: Provider = ${provider || 'gemini'}, Model = ${model || 'gemini-2.5-flash'}, Messages Count = ${messages?.length || 0}`);
        
        const isProduction = process.env.NODE_ENV === 'production';
        const geminiApiKey = process.env.GEMINI_API_KEY;
        
        // Tentukan provider berdasarkan body parameter dari client, fallback ke deteksi default
        let useGemini = true;
        if (provider) {
            useGemini = (provider === 'gemini');
        } else {
            useGemini = isProduction || (geminiApiKey && geminiApiKey !== 'your_google_gemini_api_key_here');
        }
        
        if (useGemini) {
            if (!geminiApiKey || geminiApiKey === 'your_google_gemini_api_key_here') {
                console.warn('[AI] Gemini Api Key is missing or default placeholder');
                return res.status(401).json({ 
                    error: { message: 'GEMINI_API_KEY belum dikonfigurasi di file env (.env atau .env.production).' } 
                });
            }

            const systemInstructionText = messages.find(m => m.role === 'system')?.content || '';
            const userMessageText = messages.find(m => m.role === 'user')?.content || '';

            const geminiPayload = {
                contents: [
                    {
                        role: "user",
                        parts: [
                            { text: userMessageText }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: temperature !== undefined ? temperature : 0.2,
                    maxOutputTokens: max_tokens || 8192
                }
            };

            if (systemInstructionText) {
                geminiPayload.systemInstruction = {
                    parts: [
                        { text: systemInstructionText }
                    ]
                };
            }

            if (response_format && response_format.type === 'json_object') {
                geminiPayload.generationConfig.responseMimeType = 'application/json';
            }

            const geminiModel = model || 'gemini-2.5-flash';
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(geminiPayload)
            });

            if (!response.ok) {
                const errText = await response.text();
                let errMsg = 'Gagal terhubung ke Google Gemini API';
                try {
                    const errData = JSON.parse(errText);
                    errMsg = errData.error?.message || errMsg;
                } catch (e) {
                    errMsg = errText || errMsg;
                }
                console.error(`[AI] Google Gemini API HTTP Error: ${response.status} - ${errMsg}`);
                return res.status(response.status).json({ error: { message: errMsg } });
            }

            const responseData = await response.json();
            
            if (responseData.error) {
                console.error(`[AI] Google Gemini API returned error:`, responseData.error);
                return res.status(responseData.error.code || 500).json({
                    error: { message: responseData.error.message }
                });
            }

            const responseText = responseData.candidates?.[0]?.content?.parts?.[0]?.text || '';
            
            // Log usage details (Gemini 2.5 automatically handles implicit context caching)
            const usage = responseData.usageMetadata || {};
            console.log(`[AI] Google Gemini API Completion Success. Response length: ${responseText?.length || 0} chars.`);
            console.log(`[AI] Token Usage - Input: ${usage.promptTokenCount || 0}, Output: ${usage.candidatesTokenCount || 0}, Total: ${usage.totalTokenCount || 0}, Cached: ${usage.cachedContentTokenCount || 0}`);

            const mappedResponse = {
                choices: [
                    {
                        message: {
                            role: 'assistant',
                            content: responseText
                        }
                    }
                ]
            };
            res.json(mappedResponse);

        } else if (provider === 'deepsek' || provider === 'deepseek') {
            // DeepSeek API (OpenAI-compatible)
            const apiKey = process.env.DEEPSEK_API_KEY;
            
            if (!apiKey) {
                console.warn('[AI] DeepSeek API Key is missing');
                return res.status(401).json({ 
                    error: { message: 'DEEPSEK_API_KEY belum dikonfigurasi di file .env.' } 
                });
            }

            const url = 'https://api.deepseek.com/chat/completions';
            const modelName = model || 'deepseek-chat';

            const deepseekPayload = {
                model: modelName,
                messages: messages.map(m => ({
                    role: m.role,
                    content: m.content
                })),
                temperature: temperature !== undefined ? temperature : 0.2,
                max_tokens: max_tokens || 8192,
                stream: false
            };

            if (response_format && response_format.type === 'json_object') {
                deepseekPayload.response_format = { type: 'json_object' };
            }

            console.log(`[AI] DeepSeek Request: Model=${modelName}, Messages=${messages?.length || 0}`);
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify(deepseekPayload)
            });

            if (!response.ok) {
                const errText = await response.text();
                let errMsg = 'Gagal terhubung ke DeepSeek API';
                try {
                    const errData = JSON.parse(errText);
                    errMsg = errData.error?.message || errMsg;
                } catch (e) {
                    errMsg = errText || errMsg;
                }
                console.error(`[AI] DeepSeek API HTTP Error: ${response.status} - ${errMsg}`);
                return res.status(response.status).json({ error: { message: errMsg } });
            }

            const responseData = await response.json();
            const responseText = responseData.choices?.[0]?.message?.content || '';
            
            const usage = responseData.usage || {};
            console.log(`[AI] DeepSeek API Success. Response length: ${responseText?.length || 0} chars.`);
            console.log(`[AI] Token Usage - Input: ${usage.prompt_tokens || 0}, Output: ${usage.completion_tokens || 0}, Total: ${usage.total_tokens || 0}`);

            const mappedResponse = {
                choices: [
                    {
                        message: {
                            role: 'assistant',
                            content: responseText
                        }
                    }
                ]
            };
            res.json(mappedResponse);

        } else {
            // Langsung menggunakan Claude API dari Anthropic
            const apiKey = process.env.CLAUDE_API_KEY;
            
            if (!apiKey || apiKey === 'your_anthropic_claude_api_key_here') {
                console.warn('[AI] Claude API Key is missing or default placeholder');
                return res.status(401).json({ 
                    error: { message: 'CLAUDE_API_KEY belum dikonfigurasi di file env (.env atau .env.production).' } 
                });
            }

            const url = 'https://api.anthropic.com/v1/messages';
            const claudeModel = model || 'claude-3-5-sonnet-20241022';

            const systemInstructionText = messages.find(m => m.role === 'system')?.content || '';
            const userMessages = messages.filter(m => m.role === 'user' || m.role === 'assistant').map(m => ({
                role: m.role,
                content: m.content
            }));

            const anthropicPayload = {
                model: claudeModel,
                max_tokens: max_tokens || 8192,
                temperature: temperature !== undefined ? temperature : 0.2,
                messages: userMessages
            };
            if (systemInstructionText) {
                anthropicPayload.system = [
                    {
                        type: 'text',
                        text: systemInstructionText,
                        cache_control: { type: 'ephemeral' }
                    }
                ];
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                    'anthropic-beta': 'prompt-caching-2024-07-31'
                },
                body: JSON.stringify(anthropicPayload)
            });

            if (!response.ok) {
                const errText = await response.text();
                let errMsg = 'Gagal terhubung ke Anthropic Claude API';
                try {
                    const errData = JSON.parse(errText);
                    errMsg = errData.error?.message || errMsg;
                } catch (e) {
                    errMsg = errText || errMsg;
                }
                console.error(`[AI] Anthropic Claude API HTTP Error: ${response.status} - ${errMsg}`);
                return res.status(response.status).json({ error: { message: errMsg } });
            }

            const responseData = await response.json();
            const responseText = responseData.content?.[0]?.text || '';
            
            // Log caching usage details
            const usage = responseData.usage || {};
            console.log(`[AI] Anthropic Claude API Completion Success. Response length: ${responseText?.length || 0} chars.`);
            console.log(`[AI] Token Usage - Input: ${usage.input_tokens || 0}, Output: ${usage.output_tokens || 0}, Cache Creation: ${usage.cache_creation_input_tokens || 0}, Cache Read: ${usage.cache_read_input_tokens || 0}`);

            const mappedResponse = {
                choices: [
                    {
                        message: {
                            role: 'assistant',
                            content: responseText
                        }
                    }
                ]
            };
            res.json(mappedResponse);
        }
    } catch (error) {
        console.error('Error on AI proxy endpoint:', error);
        res.status(500).json({ error: { message: error.message || 'Internal Server Error' } });
    }
});


// --- AUTH ENDPOINTS ---

// GET /api/auth/google - Mulai OAuth login
app.get('/api/auth/google', (req, res) => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
        return res.status(500).send('GOOGLE_CLIENT_ID belum dikonfigurasi di file .env Anda.');
    }
    const appUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    const redirectUri = `${appUrl}/api/auth/google/callback`;
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` + new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'openid profile email',
        prompt: 'select_account'
    }).toString();
    res.redirect(authUrl);
});

// GET /api/auth/google/callback - Callback OAuth Google
app.get('/api/auth/google/callback', async (req, res) => {
    const { code } = req.query;
    if (!code) {
        return res.redirect('/');
    }
    
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const appUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    const redirectUri = `${appUrl}/api/auth/google/callback`;
    
    try {
        // Tukar kode autentikasi dengan access_token
        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code'
            })
        });
        
        if (!tokenRes.ok) {
            const errText = await tokenRes.text();
            console.error('Tukar token gagal:', errText);
            return res.status(400).send('Autentikasi gagal.');
        }
        
        const tokenData = await tokenRes.json();
        
        // Ambil data profil user dari Google API
        const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` }
        });
        
        if (!userRes.ok) {
            return res.status(400).send('Gagal mengambil data profil Google.');
        }
        
        const userData = await userRes.json();
        const { sub: google_id, name, email, picture } = userData;
        
        // Simpan / update user ke database PostgreSQL
        const userQuery = `
            INSERT INTO users (google_id, email, name, picture)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (google_id) DO UPDATE SET
                name = EXCLUDED.name,
                picture = EXCLUDED.picture,
                email = EXCLUDED.email
            RETURNING *
        `;
        const dbUserRes = await pool.query(userQuery, [google_id, email, name, picture]);
        const user = dbUserRes.rows[0];
        
        // Buat session baru di database
        const sessionId = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 Hari
        await pool.query(
            'INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3)',
            [sessionId, user.id, expiresAt]
        );
        
        // Set cookie session dan redirect ke homepage
        res.setHeader('Set-Cookie', `session_id=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`);
        res.redirect('/');
    } catch (err) {
        console.error('Error di Callback OAuth:', err);
        res.status(500).send('Kesalahan sistem internal saat login.');
    }
});

// GET /api/auth/me - Cek status login
app.get('/api/auth/me', (req, res) => {
    if (req.user) {
        res.json({ authenticated: true, user: req.user });
    } else {
        res.json({ authenticated: false });
    }
});

// POST /api/auth/logout - Logout user
app.post('/api/auth/logout', async (req, res) => {
    const cookies = parseCookies(req.headers.cookie);
    const sessionId = cookies.session_id;
    if (sessionId) {
        try {
            await pool.query('DELETE FROM sessions WHERE id = $1', [sessionId]);
        } catch (e) {
            console.error('Gagal menghapus session saat logout:', e.message);
        }
    }
    res.setHeader('Set-Cookie', 'session_id=; Path=/; HttpOnly; Max-Age=0');
    res.json({ success: true });
});

// Jalankan Server
app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`🧠 Rabbit Hole Mindmap Learner is running!`);
    console.log(`🌐 Silakan buka di browser: http://localhost:${PORT}`);
    console.log(`=================================================`);
});
