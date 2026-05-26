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
app.use(express.static(__dirname)); // Sajikan frontend static files langsung dari root directory

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

// GET endpoint - Ambil semua mindmap (untuk history)
app.get('/api/mindmaps', (req, res) => {
    const userId = req.user ? req.user.id : null;
    const query = userId 
        ? 'SELECT id, name, tree_data, node_statuses, updated_at FROM mindmaps WHERE user_id = $1 ORDER BY updated_at DESC'
        : 'SELECT id, name, tree_data, node_statuses, updated_at FROM mindmaps WHERE user_id IS NULL ORDER BY updated_at DESC';
    const params = userId ? [userId] : [];

    pool.query(query, params, (err, result) => {
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
    const userId = req.user ? req.user.id : null;
    
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

    try {
        const checkRes = await pool.query('SELECT user_id FROM mindmaps WHERE id = $1', [targetId]);
        if (checkRes.rows.length > 0) {
            const existingOwnerId = checkRes.rows[0].user_id;
            if (existingOwnerId !== null && existingOwnerId !== userId) {
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
        res.json({ success: true, message: 'Mindmap berhasil disinkronisasi ke PostgreSQL' });
    } catch (err) {
        console.error('Gagal menyimpan mindmap:', err.message);
        res.status(500).json({ error: 'Gagal menyimpan data ke database PostgreSQL' });
    }
});

// DELETE endpoint - Hapus mindmap berdasarkan ID
app.delete('/api/mindmap/:id', async (req, res) => {
    const id = req.params.id;
    const userId = req.user ? req.user.id : null;

    try {
        const checkRes = await pool.query('SELECT user_id FROM mindmaps WHERE id = $1', [id]);
        if (checkRes.rows.length > 0) {
            const existingOwnerId = checkRes.rows[0].user_id;
            if (existingOwnerId !== null && existingOwnerId !== userId) {
                return res.status(403).json({ error: 'Anda tidak memiliki hak untuk menghapus mindmap ini.' });
            }
        }

        const query = 'DELETE FROM mindmaps WHERE id = $1';
        await pool.query(query, [id]);
        res.json({ success: true, message: 'Mindmap berhasil dihapus dari PostgreSQL' });
    } catch (err) {
        console.error('Gagal menghapus mindmap:', err.message);
        res.status(500).json({ error: 'Gagal menghapus mindmap dari database PostgreSQL' });
    }
});

// Proxy endpoint untuk callRouterAI (keamanan API Key)
app.post('/api/ai/completions', async (req, res) => {
    try {
        const { messages, response_format, temperature, stream, max_tokens, provider, model } = req.body;
        
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
                return res.status(response.status).json({ error: { message: errMsg } });
            }

            const responseData = await response.json();
            
            if (responseData.error) {
                return res.status(responseData.error.code || 500).json({
                    error: { message: responseData.error.message }
                });
            }

            const responseText = responseData.candidates?.[0]?.content?.parts?.[0]?.text || '';

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
                anthropicPayload.system = systemInstructionText;
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01'
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
                return res.status(response.status).json({ error: { message: errMsg } });
            }

            const responseData = await response.json();
            const responseText = responseData.content?.[0]?.text || '';

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
