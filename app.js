/* ==========================================================================
   STATE MANAGEMENT & GLOBAL CONFIG
   ========================================================================== */
const state = {
    apiKey: localStorage.getItem('router_api_key') || '',
    language: localStorage.getItem('ai_language') || 'id',
    currentMindmapId: localStorage.getItem('current_mindmap_id') || 'default',
    mindmapData: null,       // Data pohon (tree) D3
    activeNode: null,        // Node yang sedang aktif di drawer
    nodeStatuses: JSON.parse(localStorage.getItem('node_statuses') || '{}'), // nodeName -> 'todo' | 'doing' | 'done'
    nodeCache: {},           // nodeName -> { explanation, subtopics } (cache untuk rabbit hole)
    collapsedSidebar: false
};

// 9Router System Instructions
function getSystemInstructions() {
    if (state.language === 'en') {
        return `You are an expert tutor and professional learning architect. Your task is to help the user learn any topic through dynamic, structured mindmaps and interactive, deep-dive learning guides.`;
    }
    return `Anda adalah tutor ahli dan arsitek pembelajaran profesional. Tugas Anda adalah membantu pengguna mempelajari topik apa saja melalui peta pikiran (mindmap) terstruktur yang dinamis dan panduan belajar mendalam (deep dive) dalam Bahasa Indonesia yang interaktif.`;
}

/* ==========================================================================
   PERSISTENCE — Save & Restore from localStorage
   ========================================================================== */
function showSyncStatus(statusText) {
    const el = document.getElementById('sync-status');
    if (el) el.innerText = statusText;
}

async function saveState(skipDBSync = false) {
    try {
        if (state.mindmapData) {
            localStorage.setItem('mindmap_data', JSON.stringify(state.mindmapData));
        }
        localStorage.setItem('node_cache', JSON.stringify(state.nodeCache));
        localStorage.setItem('node_statuses', JSON.stringify(state.nodeStatuses));
        
        if (!skipDBSync && state.mindmapData) {
            showSyncStatus('Menyimpan... ⏳');
            const res = await fetch('/api/mindmap', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: state.currentMindmapId,
                    name: state.mindmapData.name,
                    tree_data: state.mindmapData,
                    node_cache: state.nodeCache,
                    node_statuses: state.nodeStatuses
                })
            });
            if (res.ok) {
                showSyncStatus('Tersimpan 💾');
            } else {
                throw new Error('Server error');
            }
        }
    } catch (e) {
        console.warn('Gagal menyimpan state:', e);
        showSyncStatus('Gagal Sinkron ⚠️');
    }
}

function loadState() {
    try {
        const savedMindmap = localStorage.getItem('mindmap_data');
        if (savedMindmap) {
            state.mindmapData = JSON.parse(savedMindmap);
        }
        const savedCache = localStorage.getItem('node_cache');
        if (savedCache) {
            state.nodeCache = JSON.parse(savedCache);
        }
    } catch (e) {
        console.warn('Gagal memuat state dari localStorage:', e);
    }
    // Sinkronisasi data secara asinkron dari SQLite database
    syncFromDatabase();
}

async function syncFromDatabase(id = state.currentMindmapId) {
    try {
        showSyncStatus('Sinkronisasi... ⏳');
        const url = id ? `/api/mindmap?id=${id}` : '/api/mindmap';
        const response = await fetch(url);
        if (!response.ok) throw new Error('Koneksi server gagal');
        const dbData = await response.json();
        
        if (dbData) {
            state.currentMindmapId = dbData.id || id;
            localStorage.setItem('current_mindmap_id', state.currentMindmapId);
            
            state.mindmapData = dbData.tree_data || null;
            state.nodeCache = dbData.node_cache || {};
            state.nodeStatuses = dbData.node_statuses || {};
            
            // Simpan lokal agar sinkron
            saveState(true); 
            
            if (state.mindmapData) {
                updateMindmap(state.mindmapData);
                setTimeout(zoomFit, 100);
            } else {
                // Bersihkan canvas
                d3.select('#mindmap-svg').selectAll('*').remove();
                document.getElementById('mindmap-hint-text').classList.remove('hidden');
            }
            showSyncStatus('Tersinkronisasi 💾');
        } else {
            // Jika DB Kosong tetapi localStorage berisi data, otomatis migrasikan ke SQLite!
            if (state.mindmapData) {
                showSyncStatus('Migrasi ke DB... ⏳');
                await saveState(false);
            } else {
                showSyncStatus('DB Kosong 🔌');
            }
        }
        // Muat daftar riwayat
        await loadHistoryList();
    } catch (error) {
        console.warn('Gagal sinkron dari database SQLite:', error);
        showSyncStatus('Offline (Lokal) 🔌');
    }
}

async function clearState() {
    state.mindmapData = null;
    state.nodeCache = {};
    state.nodeStatuses = {};
    state.activeNode = null;
    localStorage.removeItem('mindmap_data');
    localStorage.removeItem('node_cache');
    localStorage.removeItem('node_statuses');
    
    showSyncStatus('Menghapus... ⏳');
    try {
        await fetch('/api/mindmap', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: '',
                tree_data: null,
                node_cache: {},
                node_statuses: {}
            })
        });
        showSyncStatus('Dibersihkan ✨');
    } catch (e) {
        console.warn('Gagal menghapus data di database:', e);
        showSyncStatus('Gagal Hapus DB ⚠️');
    }
}

/* ==========================================================================
   INITIALIZATION & SETUP
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    // Jalankan inisialisasi ikon
    lucide.createIcons();

    // Setup Event Listeners
    initUIEventListeners();
    
    // Cek API Key awal
    checkApiKeyWarning();

    // Inisialisasi Canvas D3
    initD3Canvas();

    // Restore mindmap dari sesi sebelumnya jika ada
    loadState();
    if (state.mindmapData) {
        updateMindmap(state.mindmapData);
        setTimeout(zoomFit, 100);
        appendChatMessage('bot', `Selamat datang kembali! Mindmap **${state.mindmapData.name}** telah dipulihkan dari sesi terakhirmu. Lanjutkan belajar! 📚`);
    }
});

/* ==========================================================================
   9ROUTER API CLIENT (OpenAI Compatible)
   ========================================================================== */
async function callRouterAI(prompt, systemInstruction = null) {
    if (!systemInstruction) {
        systemInstruction = getSystemInstructions();
    }
    if (!state.apiKey) {
        openSettingsModal();
        throw new Error('API Key Router belum diset. Silakan masukkan kunci API Anda di menu Pengaturan.');
    }

    const url = 'http://localhost:20128/v1/chat/completions';
    const model = 'kr/claude-sonnet-4.5';

    const requestBody = {
        model: model,
        messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
        stream: false,
        max_tokens: 4000
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${state.apiKey}`
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errText = await response.text();
            let errMsg = 'Gagal terhubung ke 9Router API';
            try {
                const errData = JSON.parse(errText);
                errMsg = errData.error?.message || errMsg;
            } catch (e) {
                errMsg = errText || errMsg;
            }
            throw new Error(errMsg);
        }

        const rawText = await response.text();
        let jsonText = '';

        // Deteksi jika respon berupa format Server-Sent Events (SSE) stream
        if (rawText.trim().startsWith('data:')) {
            const lines = rawText.split('\n');
            for (const line of lines) {
                const cleanLine = line.trim();
                if (!cleanLine) continue;
                if (cleanLine.startsWith('data:')) {
                    const dataStr = cleanLine.replace(/^data:\s*/, '');
                    if (dataStr === '[DONE]') continue;
                    try {
                        const chunk = JSON.parse(dataStr);
                        const content = chunk.choices?.[0]?.delta?.content || chunk.choices?.[0]?.message?.content || '';
                        jsonText += content;
                    } catch (err) {
                        console.warn('Gagal memparsing chunk:', err, dataStr);
                    }
                }
            }
        } else {
            // Respon JSON standar
            const data = JSON.parse(rawText);
            jsonText = data.choices[0].message.content;
        }

        // Antisipasi jika LLM membungkus JSON dengan markdown code blocks ```json ... ```
        let cleanJsonText = jsonText.trim();
        if (cleanJsonText.startsWith('```')) {
            cleanJsonText = cleanJsonText.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
        }

        return JSON.parse(cleanJsonText);
    } catch (error) {
        console.error('9Router API Error:', error);
        throw error;
    }
}

// Cek warning API Key
function checkApiKeyWarning() {
    const warningEl = document.getElementById('api-warning');
    if (!state.apiKey) {
        warningEl.classList.remove('hidden');
    } else {
        warningEl.classList.add('hidden');
    }
}

/* ==========================================================================
   D3.JS VISUALIZATION ENGINE
   ========================================================================== */
let svg, g, zoomBehavior;
let treeLayout, rootNodeData;
const nodeHeight = 65;
const margin = { top: 20, right: 120, bottom: 20, left: 40 };

// Fungsi helper untuk menghitung lebar node secara dinamis berdasarkan panjang judulnya
function getNodeWidth(nodeData) {
    const title = nodeData.name || '';
    // Hitung lebar: base 100px + rata-rata 6.5px per karakter judul
    const calculated = 100 + title.length * 6.5;
    // Beri batas minimal 160px dan maksimal 280px
    return Math.min(280, Math.max(160, Math.round(calculated)));
}

function initD3Canvas() {
    const container = document.getElementById('mindmap-canvas-container');
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Reset SVG jika sudah ada
    d3.select('#mindmap-svg').selectAll('*').remove();

    svg = d3.select('#mindmap-svg')
        .attr('width', '100%')
        .attr('height', '100%');

    // Buat group utama untuk menampung zoom
    g = svg.append('g').attr('class', 'main-group');

    // Setup Zoom & Pan Behavior
    zoomBehavior = d3.zoom()
        .scaleExtent([0.1, 3])
        .on('zoom', (event) => {
            g.attr('transform', event.transform);
        });

    svg.call(zoomBehavior);

    // Tree Layout Generator (Horizontal)
    treeLayout = d3.tree()
        .nodeSize([100, 260]); // Lebar vertikal antar node ditingkatkan ke 100px agar lega
}

// Fungsi helper untuk menghitung tinggi node secara dinamis berdasarkan konten teksnya
function getNodeHeight(nodeData) {
    const title = nodeData.name || '';
    const desc = nodeData.description || '';
    const currentWidth = getNodeWidth(nodeData);
    
    // Estimasi baris judul (berdasarkan lebar dinamis node)
    const charsPerLineTitle = Math.max(12, Math.floor(currentWidth / 8.5));
    const titleLines = Math.min(2, Math.ceil(title.length / charsPerLineTitle) || 1);
    
    // Estimasi baris deskripsi (berdasarkan lebar dinamis node)
    const charsPerLineDesc = Math.max(15, Math.floor(currentWidth / 6.5));
    let descLines = 0;
    if (desc) {
        descLines = Math.min(2, Math.ceil(desc.length / charsPerLineDesc) || 1);
    }
    
    // Base padding (20px) + tinggi judul + tinggi deskripsi
    const calculated = 20 + (titleLines * 15) + (descLines * 13);
    
    // Batasi tinggi antara 60px (minimal) dan 90px (maksimal)
    return Math.min(90, Math.max(60, calculated));
}

// Fungsi utama untuk me-render / memperbarui Mindmap
function updateMindmap(sourceData) {
    if (!sourceData) return;

    // Sembunyikan hint overlay jika mindmap ada
    document.getElementById('mindmap-hint-text').classList.add('hidden');

    // Konversi hierarchical data ke d3 hierarchy (sembunyikan anak jika di-collapse)
    rootNodeData = d3.hierarchy(sourceData, d => d.collapsed ? null : d.children);

    // Hitung posisi pohon
    treeLayout(rootNodeData);

    // Kustomisasi koordinat y (horizontal) secara dinamis agar jarak antar node
    // memperhitungkan lebar dinamis dari node induknya (mencegah overlapping)
    rootNodeData.eachBefore(d => {
        if (d.depth === 0) {
            d.y = 0;
        } else {
            const parentWidth = getNodeWidth(d.parent.data);
            d.y = d.parent.y + parentWidth + 60; // 60px adalah gap horizontal antar tingkat
        }
    });

    const nodes = rootNodeData.descendants();
    const links = rootNodeData.links();

    // --- RENDERING TAUTAN (LINKS) ---
    const link = g.selectAll('.link')
        .data(links, d => d.target.data.id || d.target.data.name);

    // Link Exit (animasi hapus)
    link.exit().transition().duration(400)
        .attr('stroke-width', 0)
        .remove();

    // Link Enter
    const linkEnter = link.enter().append('path')
        .attr('class', 'link')
        .attr('d', d => {
            const parent = d.parent || d.source;
            const startX = parent.y + getNodeWidth(parent.data);
            const startY = parent.x; // Centered
            return d3.linkHorizontal()
                .source(() => ({ x: startX, y: startY }))
                .target(() => ({ x: startX, y: startY }))
                .x(p => p.x)
                .y(p => p.y)(d);
        });

    // Link Update + Enter (Animasi Transisi Posisi)
    linkEnter.merge(link)
        .transition().duration(500)
        .attr('class', d => `link ${state.activeNode && (d.target.data.id === state.activeNode.id || d.target.data.name === state.activeNode.name) ? 'active' : ''}`)
        .attr('d', d => {
            return d3.linkHorizontal()
                .source(l => ({ x: l.source.y + getNodeWidth(l.source.data), y: l.source.x })) // Centered
                .target(l => ({ x: l.target.y, y: l.target.x })) // Centered
                .x(p => p.x)
                .y(p => p.y)(d);
        });

    // --- RENDERING NODE (MENGGUNAKAN FOREIGN_OBJECT UNTUK HTML) ---
    const node = g.selectAll('.node')
        .data(nodes, d => d.data.id || d.data.name);

    // Node Exit (animasi hapus)
    node.exit().transition().duration(400)
        .style('opacity', 0)
        .remove();

    // Node Enter
    const nodeEnter = node.enter().append('g')
        .attr('class', 'node')
        .attr('transform', d => {
            const parent = d.parent || d;
            return `translate(${parent.y}, ${parent.x})`;
        })
        .style('opacity', 0);

    // Tambahkan ForeignObject agar bisa merender HTML kustom di dalam SVG
    const foreignObject = nodeEnter.append('foreignObject')
        .attr('width', d => getNodeWidth(d.data))
        .attr('height', d => getNodeHeight(d.data))
        .attr('x', 0)
        .attr('y', d => -getNodeHeight(d.data) / 2); // Centered vertically

    // Render HTML Node Card ke dalam foreignObject
    const nodeCard = foreignObject.append('xhtml:div')
        .attr('class', d => `node-card level-${d.depth} ${getNodeStatusClass(d.data.name)}`)
        .on('click', (event, d) => {
            event.stopPropagation();
            handleNodeClick(d);
        });

    nodeCard.append('div')
        .attr('class', 'node-title')
        .text(d => d.data.name);

    nodeCard.append('div')
        .attr('class', 'node-desc')
        .text(d => d.data.description || 'Klik untuk belajar');

    // Node Update + Enter (Animasi Bergerak ke Posisi Baru)
    const nodeUpdate = nodeEnter.merge(node);
    
    nodeUpdate.transition().duration(500)
        .attr('transform', d => `translate(${d.y}, ${d.x})`)
        .style('opacity', 1);

    // Pastikan foreignObject diupdate tingginya secara dinamis saat update
    nodeUpdate.select('foreignObject')
        .attr('width', d => getNodeWidth(d.data))
        .attr('height', d => getNodeHeight(d.data))
        .attr('y', d => -getNodeHeight(d.data) / 2);

    // Update style/class node yang ada (misal status progress & status collapse)
    nodeUpdate.select('.node-card')
        .attr('class', d => {
            const isLoading = d.data.loading ? 'loading' : '';
            const isCollapsed = d.data.collapsed ? 'is-collapsed' : '';
            const hasChildren = d.data.children && d.data.children.length > 0 ? 'has-children' : '';
            return `node-card level-${d.depth} ${getNodeStatusClass(d.data.name)} ${isLoading} ${isCollapsed} ${hasChildren}`;
        });

    // Tambahkan atau perbarui collapse/expand toggle button
    nodeUpdate.each(function(d) {
        const card = d3.select(this).select('.node-card');
        const hasChildren = d.data.children && d.data.children.length > 0;
        
        let toggle = card.select('.collapse-toggle');
        
        if (hasChildren) {
            if (toggle.empty()) {
                toggle = card.append('div')
                    .attr('class', 'collapse-toggle')
                    .on('click', (event) => {
                        console.log('Collapse toggle clicked for:', d.data.name);
                        event.stopPropagation(); // Mencegah drawer terbuka
                        d.data.collapsed = !d.data.collapsed;
                        saveState();
                        updateMindmap(state.mindmapData);
                    });
            }
            
            toggle.html(''); // Bersihkan ikon lama
            toggle.append('i')
                .attr('data-lucide', d.data.collapsed ? 'plus' : 'minus');
        } else {
            toggle.remove();
        }
    });

    // Re-inisialisasi ikon Lucide
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// Fungsi helper status node class
function getNodeStatusClass(nodeName) {
    const status = state.nodeStatuses[nodeName];
    if (status === 'doing') return 'status-doing';
    if (status === 'done') return 'status-done';
    return '';
}

// Handler klik node untuk Deep Dive & Rabbit Hole
async function handleNodeClick(d3Node) {
    const nodeName = d3Node.data.name;
    const nodeDesc = d3Node.data.description || '';
    state.activeNode = d3Node.data;

    // Highlight link & node aktif
    updateMindmap(state.mindmapData);

    // Buka Slide-out Drawer
    openDetailDrawer(nodeName);

    // Jika data sudah tercache (pernah di-deep dive sebelumnya)
    if (state.nodeCache[nodeName]) {
        renderNodeDetail(nodeName, state.nodeCache[nodeName].explanation);
        return;
    }

    // Tampilkan loading di drawer dan node mindmap
    renderDrawerLoading(nodeName);
    d3Node.data.loading = true;
    updateMindmap(state.mindmapData);

    // Tulis pesan robot di chat
    const exploringMsg = state.language === 'en'
        ? `Opening the rabbit hole portal for **${nodeName}**... I am digging up the explanation for you. 🔍`
        : `Membuka portal rabbit hole untuk **${nodeName}**... Aku sedang menggali penjelasannya untukmu. 🔍`;
    appendChatMessage('bot', exploringMsg);

    try {
        const rootTopicName = state.mindmapData.name;
        const prompt = state.language === 'en' ? `You are an expert tutor. The user is currently learning the main topic "${rootTopicName}" and wants to deep-dive into the subtopic "${nodeName}" (Description: "${nodeDesc}").
        
        Your tasks are:
        1. Create a deep, practical, structured, and easy-to-understand explanation/material in English using rich Markdown format (including code examples/analogies if relevant, use small h3 headings, lists, and interesting blockquotes. If there are sub-lists or nested lists, you must use correct spacing indentation like 2 or 4 spaces so that the markdown rendering is neat and properly indented).
           IMPORTANT: To prevent the explanation from being truncated by token limits, write the explanation concisely, focusing on the most important core concepts, and limit the explanation length to a maximum of about 800-1000 words.
        2. Generate several next, more specific subtopics/milestones under "${nodeName}" to dynamically expand their mindmap. Decide the most relevant number of subtopics yourself (e.g. 2, 3, 5, or more) based on the scope and complexity of the material. Do not make subtopics that are too generic.

        Return the result in JSON with exactly this format:
        {
          "explanation": "Full explanation content in Markdown format here...",
          "subtopics": [
            { "name": "Specific Subtopic 1", "description": "Brief description 1" },
            { "name": "Specific Subtopic 2", "description": "Brief description 2" }
          ]
        }` : `Kamu adalah tutor ahli. Pengguna sedang mempelajari topik utama "${rootTopicName}" dan ingin melakukan deep-dive ke sub-topik "${nodeName}" (Deskripsi: "${nodeDesc}").
        
        Tugasmu adalah:
        1. Buat penjelasan materi yang mendalam, praktis, terstruktur, dan mudah dipahami dalam Bahasa Indonesia menggunakan format Markdown yang kaya (termasuk contoh kode/analogi jika relevan, gunakan judul-judul kecil h3, list, dan blockquote yang menarik. Jika terdapat sub-list atau daftar bertingkat/nested list, wajib gunakan indentasi spasi yang benar seperti 2 atau 4 spasi agar terjemahan markdown rapi dan terindentasi dengan benar).
           PENTING: Agar penjelasan tidak terpotong (truncated) oleh batas token, tulis penjelasan secara padat, fokus pada konsep inti yang paling penting, dan batasi panjang penjelasan maksimal sekitar 800-1000 kata.
        2. Hasilkan beberapa sub-topik/milestone berikutnya yang lebih spesifik di bawah "${nodeName}" untuk memperluas mindmap mereka secara dinamis. Tentukan sendiri jumlah sub-topik yang paling relevan (misalnya 2, 3, 5, atau lebih) berdasarkan cakupan dan kompleksitas materinya. Jangan buat sub-topik yang terlalu umum.

        Kembalikan hasilnya dalam JSON dengan format persis seperti ini:
        {
          "explanation": "Isi penjelasan lengkap dalam format Markdown di sini...",
          "subtopics": [
            { "name": "Sub-topik Spesifik 1", "description": "Deskripsi singkat 1" },
            { "name": "Sub-topik Spesifik 2", "description": "Deskripsi singkat 2" }
          ]
        }`;

        const result = await callRouterAI(prompt);

        // Hapus status loading pada node
        delete d3Node.data.loading;

        // Validasi respon JSON
        if (result && result.explanation) {
            // Update cache & persist
            state.nodeCache[nodeName] = {
                explanation: result.explanation,
                subtopics: result.subtopics || []
            };
            saveState();

            // Tambahkan subtopics sebagai children baru ke dalam data D3 jika ada subtopics baru
            if (result.subtopics && result.subtopics.length > 0) {
                if (!d3Node.data.children) {
                    d3Node.data.children = [];
                }

                // Hindari duplikasi sub-node dengan nama yang sama
                result.subtopics.forEach(sub => {
                    const exists = d3Node.data.children.some(child => child.name === sub.name);
                    if (!exists) {
                        sub.id = `${nodeName}-${sub.name}-${Date.now()}`; // Unique ID
                        d3Node.data.children.push(sub);
                    }
                });

                // Update visualisasi mindmap & persist
                updateMindmap(state.mindmapData);
                saveState();
            }

            // Render isi penjelasan ke drawer
            renderNodeDetail(nodeName, result.explanation);

            // Beri tahu di chat
            const msg = state.language === 'en'
                ? `Explanation for **${nodeName}** is ready! I also added **${result.subtopics?.length || 0} new subtopics** to the mindmap. Click those new nodes to dig deeper! 🚀`
                : `Penjelasan materi untuk **${nodeName}** telah siap! Aku juga sudah menambahkan **${result.subtopics?.length || 0} sub-topik baru** di mindmap. Klik node baru tersebut untuk menggali lebih dalam! 🚀`;
            appendChatMessage('bot', msg);
        } else {
            throw new Error("Respon AI tidak sesuai format");
        }
    } catch (error) {
        console.error('Deep dive error:', error);
        delete d3Node.data.loading;
        updateMindmap(state.mindmapData);
        const msg = state.language === 'en'
            ? `Sorry, I failed to explore the rabbit hole for **${nodeName}**. Error message: *${error.message}*. Try clicking again later!`
            : `Maaf, aku gagal menjelajahi rabbit hole untuk **${nodeName}**. Pesan error: *${error.message}*. Coba klik lagi nanti!`;
        appendChatMessage('bot', msg);
        renderDrawerError(nodeName, error.message);
    }
}

// Zoom Controls
function zoomIn() { svg.transition().duration(300).call(zoomBehavior.scaleBy, 1.3); }
function zoomOut() { svg.transition().duration(300).call(zoomBehavior.scaleBy, 0.7); }
function zoomFit() {
    if (!rootNodeData) return;
    
    const container = document.getElementById('mindmap-canvas-container');
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Temukan batas-batas grafik
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    let maxNode = null;
    rootNodeData.descendants().forEach(d => {
        if (d.y < minY) minY = d.y;
        if (d.y > maxY) {
            maxY = d.y;
            maxNode = d;
        }
        if (d.x < minX) minX = d.x;
        if (d.x > maxX) maxX = d.x;
    });

    const maxNodeWidth = maxNode ? getNodeWidth(maxNode.data) : 180;
    const graphWidth = (maxY - minY) + maxNodeWidth + 100;
    const graphHeight = (maxX - minX) + nodeHeight + 100;

    const scale = Math.min(0.9, Math.min(width / graphWidth, height / graphHeight));
    
    const midX = minY + (maxY - minY) / 2 + maxNodeWidth / 2;
    const midY = minX + (maxX - minX) / 2 + nodeHeight / 2;

    const transform = d3.zoomIdentity
        .translate(width / 2 - midX * scale, height / 2 - midY * scale)
        .scale(scale);

    svg.transition().duration(500).call(zoomBehavior.transform, transform);
}

/* ==========================================================================
   UI HANDLERS & NAVIGATION
   ========================================================================== */
function initUIEventListeners() {
    // 1. Form Chat
    const chatForm = document.getElementById('chat-form');
    chatForm.addEventListener('submit', handleChatSubmit);

    // 2. Settings Modal
    const btnOpenSettings = document.getElementById('btn-open-settings');
    const btnCloseSettings = document.getElementById('btn-close-settings');
    const btnCancelSettings = document.getElementById('btn-cancel-settings');
    const btnSaveSettings = document.getElementById('btn-save-settings');
    const settingsModal = document.getElementById('settings-modal');

    btnOpenSettings.addEventListener('click', openSettingsModal);
    btnCloseSettings.addEventListener('click', closeSettingsModal);
    btnCancelSettings.addEventListener('click', closeSettingsModal);
    btnSaveSettings.addEventListener('click', saveApiKey);
    
    // Tutup modal jika klik di luar kartu modal
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) closeSettingsModal();
    });

    // 3. Zoom Controls
    document.getElementById('btn-zoom-in').addEventListener('click', zoomIn);
    document.getElementById('btn-zoom-out').addEventListener('click', zoomOut);
    document.getElementById('btn-zoom-fit').addEventListener('click', zoomFit);

    // 4. Toggle Chat Sidebar
    const btnToggleChat = document.getElementById('btn-toggle-chat');
    btnToggleChat.addEventListener('click', toggleChatSidebar);

    // 5. Drawer Close
    document.getElementById('btn-close-drawer').addEventListener('click', closeDetailDrawer);

    // 6. Status Progress Click
    const statusBtns = document.querySelectorAll('.status-btn');
    statusBtns.forEach(btn => {
        btn.addEventListener('click', handleStatusChange);
    });

    // 7. Drawer Resize
    initDrawerResize();

    // 8. Q&A Form Submit & Panel Toggle
    const qaForm = document.getElementById('drawer-qa-form');
    if (qaForm) {
        qaForm.addEventListener('submit', handleQaSubmit);
    }
    const btnToggleQa = document.getElementById('btn-toggle-drawer-qa');
    if (btnToggleQa) {
        btnToggleQa.addEventListener('click', toggleDrawerQa);
    }

    // 9. History Collapsible Toggler
    const btnToggleHistory = document.getElementById('btn-toggle-history');
    if (btnToggleHistory) {
        btnToggleHistory.addEventListener('click', () => {
            const content = document.getElementById('history-content-list');
            const isOpen = btnToggleHistory.classList.toggle('open');
            if (isOpen) {
                content.classList.remove('hidden');
                loadHistoryList(); // reload whenever opened
            } else {
                content.classList.add('hidden');
            }
        });
    }

    // 10. New Topic Button
    const btnNewTopic = document.getElementById('btn-new-topic');
    if (btnNewTopic) {
        btnNewTopic.addEventListener('click', createNewMindmap);
    }
}


// Toggle Sidebar Chat
function toggleChatSidebar() {
    const sidebar = document.getElementById('chat-sidebar-section');
    const toggleIcon = document.querySelector('#btn-toggle-chat i');
    
    state.collapsedSidebar = !state.collapsedSidebar;
    
    if (state.collapsedSidebar) {
        sidebar.classList.add('collapsed');
        toggleIcon.setAttribute('data-lucide', 'menu');
    } else {
        sidebar.classList.remove('collapsed');
        toggleIcon.setAttribute('data-lucide', 'x');
    }
    lucide.createIcons();
    setTimeout(zoomFit, 350); // Sesuaikan visual mindmap setelah resize
}

// Modal Control
function openSettingsModal() {
    const modal = document.getElementById('settings-modal');
    const input = document.getElementById('gemini-key-input');
    const langSelect = document.getElementById('ai-language-select');
    input.value = state.apiKey;
    if (langSelect) {
        langSelect.value = state.language;
    }
    modal.classList.add('open');
}

function closeSettingsModal() {
    document.getElementById('settings-modal').classList.remove('open');
}

function saveApiKey() {
    const input = document.getElementById('gemini-key-input');
    const key = input.value.trim();
    
    state.apiKey = key;
    localStorage.setItem('router_api_key', key);
    
    const langSelect = document.getElementById('ai-language-select');
    if (langSelect) {
        state.language = langSelect.value;
        localStorage.setItem('ai_language', state.language);
    }
    
    closeSettingsModal();
    checkApiKeyWarning();
    
    const message = state.language === 'en'
        ? 'Settings saved successfully! Start typing a study topic to test it. 🌟'
        : 'API Key dan pengaturan berhasil disimpan! Mulai ketik topik belajar untuk mencobanya. 🌟';
    appendChatMessage('bot', message);
}

// Chat UI Controls
function appendChatMessage(sender, text) {
    const container = document.getElementById('chat-messages-container');
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender === 'bot' ? 'bot-message' : 'user-message'}`;
    
    const content = document.createElement('div');
    content.className = 'message-content';
    // Format markdown dasar untuk pesan chat sederhana
    content.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    const time = document.createElement('span');
    time.className = 'message-time';
    const now = new Date();
    time.innerText = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    bubble.appendChild(content);
    bubble.appendChild(time);
    container.appendChild(bubble);
    
    // Scroll otomatis ke bawah
    container.scrollTop = container.scrollHeight;
    return bubble;
}

// Render "Thinking..." chat bubble
function showThinkingIndicator() {
    const container = document.getElementById('chat-messages-container');
    const bubble = document.createElement('div');
    bubble.className = 'thinking-bubble';
    bubble.id = 'thinking-indicator';
    
    bubble.innerHTML = `
        <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
        </div>
        <span style="font-size: 0.82rem; color: var(--text-muted);">AI sedang berpikir...</span>
    `;
    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
}

function removeThinkingIndicator() {
    const indicator = document.getElementById('thinking-indicator');
    if (indicator) indicator.remove();
}

// Submit Topik via Chat
async function handleChatSubmit(e) {
    e.preventDefault();
    const inputEl = document.getElementById('chat-input');
    const topic = inputEl.value.trim();
    if (!topic) return;

    // Reset input
    inputEl.value = '';

    // Masukkan ke chat UI
    appendChatMessage('user', topic);

    if (!state.apiKey) {
        const msg = state.language === 'en'
            ? 'Oops, I need a 9Router API Key to answer this. Please click the gear icon ⚙️ in the top right to set it up.'
            : 'Aduh, aku butuh API Key 9Router untuk menjawab ini. Silakan klik tombol roda gigi ⚙️ di pojok kanan atas untuk menyetelnya.';
        appendChatMessage('bot', msg);
        openSettingsModal();
        return;
    }

    // Tampilkan thinking
    showThinkingIndicator();

    try {
        const prompt = state.language === 'en' ? `Create a structured learning roadmap for the topic: "${topic}". Generate valid JSON format with a single root node and several main subtopics as its children dynamically. Decide the most relevant number of main subtopics yourself (e.g. 2, 3, 5, or more) based on the scope and complexity of the topic. Provide a brief but clear description (max 10 words) for each node.
 
        Additionally, create a deep, structured, practical, and engaging introductory explanation/article for the main topic "${topic}" (layer 0) in rich Markdown format (including examples, analogies, small h3 headings, lists, and interesting blockquotes. If there are sub-lists or nested lists, you must use correct spacing indentation like 2 or 4 spaces so that the markdown rendering is neat and properly indented).
        IMPORTANT: To prevent the explanation from being truncated by token limits, write the explanation concisely, focusing on the most important core concepts, and limit the explanation length to a maximum of about 800-1000 words.

        The JSON structure must be exactly like this:
        {
          "name": "${topic}",
          "description": "Brief description of this topic",
          "explanation": "Full explanation content in Markdown format here for the main topic...",
          "children": [
            { "name": "Specific Subtopic 1", "description": "Brief description of sub 1" },
            { "name": "Specific Subtopic 2", "description": "Brief description of sub 2" }
          ]
        }` : `Buatlah peta jalan (roadmap) belajar terstruktur untuk topik: "${topic}". Hasilkan dalam format JSON yang valid dengan satu node akar (root) dan beberapa sub-topik utama sebagai anaknya secara dinamis. Tentukan sendiri jumlah sub-topik utama yang paling relevan (misalnya 2, 3, 5, atau lebih) berdasarkan cakupan dan kompleksitas topik tersebut. Berikan deskripsi yang singkat namun jelas (maksimal 10 kata) untuk tiap node. 
 
        Selain itu, buat juga penjelasan/artikel pengantar yang mendalam, terstruktur, praktis, dan menarik untuk topik utama "${topic}" tersebut (layer 0) dalam format Markdown yang kaya (termasuk contoh, analogi, judul-judul kecil h3, list, dan blockquote yang menarik. Jika terdapat sub-list atau daftar bertingkat/nested list, wajib gunakan indentasi spasi yang benar seperti 2 atau 4 spasi agar terjemahan markdown rapi dan terindentasi dengan benar).
        PENTING: Agar penjelasan tidak terpotong (truncated) oleh batas token, tulis penjelasan secara padat, fokus pada konsep inti yang paling penting, dan batasi panjang penjelasan maksimal sekitar 800-1000 kata.

        Struktur JSON harus persis seperti ini:
        {
          "name": "${topic}",
          "description": "Deskripsi singkat topik ini",
          "explanation": "Isi penjelasan lengkap dalam format Markdown di sini untuk topik utama...",
          "children": [
            { "name": "Sub Topik 1", "description": "Deskripsi singkat sub 1" },
            { "name": "Sub Topik 2", "description": "Deskripsi singkat sub 2" }
          ]
        }`;

        const result = await callRouterAI(prompt);
        removeThinkingIndicator();

        if (result && result.name) {
            // Set ID untuk node agar D3 dapat mengontrol transisi
            result.id = 'root';
            if (result.children) {
                result.children.forEach((child, index) => {
                    child.id = `child-${index}-${Date.now()}`;
                });
            }

            // Generate unique ID untuk mindmap baru ini
            state.currentMindmapId = 'mm_' + Date.now();
            localStorage.setItem('current_mindmap_id', state.currentMindmapId);

            // Simpan ke state global & reset cache/status progress belajar
            state.mindmapData = result;
            state.nodeCache = {};
            if (result.explanation) {
                state.nodeCache[result.name] = {
                    explanation: result.explanation,
                    subtopics: result.children ? result.children.map(c => ({ name: c.name, description: c.description })) : []
                };
            }
            state.nodeStatuses = {};
            saveState();

            // Render Mindmap
            initD3Canvas();
            updateMindmap(state.mindmapData);
            zoomFit();

            // Muat ulang daftar riwayat
            loadHistoryList();

            const msg = state.language === 'en'
                ? `Initial mindmap to learn **${result.name}** is ready! 🗺️ <br><br>Use your mouse to pan & zoom the mindmap on the right panel. **Click on any node** to start deep diving into the lesson!`
                : `Peta pikiran awal untuk belajar **${result.name}** telah siap! 🗺️ <br><br>Gunakan mouse untuk menggeser & men-zoom mindmap di panel kanan. **Klik pada node manapun** untuk memulai *deep dive* pelajaran!`;
            appendChatMessage('bot', msg);
        } else {
            throw new Error("Gagal mem-parsing format JSON dari AI");
        }
    } catch (error) {
        removeThinkingIndicator();
        console.error('Initial generation error:', error);
        const msg = state.language === 'en'
            ? `Sorry, I had trouble creating a mindmap for that topic. Error: *${error.message}*. Please try again!`
            : `Maaf, aku kesulitan membuat mindmap untuk topik tersebut. Masalah: *${error.message}*. Silakan coba lagi!`;
        appendChatMessage('bot', msg);
    }
}

/* ==========================================================================
   DETAIL DRAWER & DEEP DIVE PANEL STYLING
   ========================================================================== */
function openDetailDrawer(title) {
    const drawer = document.getElementById('detail-drawer');
    const drawerTitle = document.getElementById('drawer-node-title');
    const drawerLevel = document.getElementById('drawer-node-level');

    drawerTitle.innerText = title;
    
    // Cari level kedalaman node
    let depth = 0;
    if (rootNodeData) {
        const found = rootNodeData.descendants().find(d => d.data.name === title);
        if (found) depth = found.depth;
    }
    drawerLevel.innerText = `Level ${depth}`;
    
    // Setup status tombol belajar aktif
    updateDrawerStatusSelector(title);

    drawer.classList.add('open');
}

function closeDetailDrawer() {
    const drawer = document.getElementById('detail-drawer');
    const qaCol = document.getElementById('drawer-col-qa');
    const toggleBtn = document.getElementById('btn-toggle-drawer-qa');
    
    drawer.classList.remove('open');
    state.activeNode = null;
    updateMindmap(state.mindmapData); // Matikan active border pada link

    // Kembalikan ke layout standard (kecil) setelah transisi tutup selesai agar rapi untuk pemuatan berikutnya
    setTimeout(() => {
        drawer.style.width = ''; // Hapus inline width, kembali ke default CSS
        if (qaCol) qaCol.classList.add('collapsed');
        if (toggleBtn) toggleBtn.classList.remove('active');
    }, 300);
}

function renderDrawerLoading(title) {
    const content = document.getElementById('drawer-markdown-content');
    const loadingText = state.language === 'en'
        ? `Exploring the rabbit hole for <strong>${title}</strong>... <br>Preparing deep theoretical summary & new subtopics.`
        : `Menggali rabbit hole untuk <strong>${title}</strong>... <br>Mempersiapkan rangkuman teori mendalam & sub-topik baru.`;
    content.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:3rem 0; gap:1rem;">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <p style="font-size:0.88rem; color:var(--text-muted); text-align:center;">${loadingText}</p>
        </div>
    `;
    const qaList = document.getElementById('qa-messages-list');
    const qaLoadingText = state.language === 'en' ? 'Loading material...' : 'Sedang memuat materi...';
    if (qaList) qaList.innerHTML = `<div style="font-size:0.78rem; color:var(--text-3); text-align:center; padding:1.25rem 0;">${qaLoadingText}</div>`;
}

function renderDrawerError(title, errorMsg) {
    const content = document.getElementById('drawer-markdown-content');
    const errorTitle = state.language === 'en' ? 'An Error Occurred!' : 'Terjadi Kesalahan!';
    const errorText = state.language === 'en' 
        ? `Failed to load details for "${title}".`
        : `Gagal memuat detail materi untuk "${title}".`;
    content.innerHTML = `
        <div style="padding:1.5rem; background:rgba(244,63,94,0.1); border:1px solid rgba(244,63,94,0.2); border-radius:10px; color:#f87171;">
            <h4 style="margin-bottom:0.5rem;">${errorTitle}</h4>
            <p style="font-size:0.85rem;">${errorText}</p>
            <p style="font-size:0.8rem; font-family:monospace; margin-top:0.5rem; opacity:0.8;">${errorMsg}</p>
        </div>
    `;
}

function renderNodeDetail(title, markdownText) {
    const content = document.getElementById('drawer-markdown-content');
    // Gunakan marked.js untuk merender Markdown ke HTML
    content.innerHTML = marked.parse(markdownText);
    
    // Render Q&A khusus jika kolom Q&A sedang terbuka
    const qaCol = document.getElementById('drawer-col-qa');
    if (qaCol && !qaCol.classList.contains('collapsed')) {
        renderNodeQa(title);
    }
}

function renderNodeQa(nodeName) {
    const qaList = document.getElementById('qa-messages-list');
    const qaInput = document.getElementById('drawer-qa-input');
    if (!qaList || !qaInput) return;

    qaList.innerHTML = '';
    qaInput.value = '';

    const nodeData = state.nodeCache[nodeName];
    if (!nodeData) return;

    if (!nodeData.qaHistory) {
        nodeData.qaHistory = [];
    }

    if (nodeData.qaHistory.length === 0) {
        const noDiskText = state.language === 'en'
            ? 'No discussion yet for this topic. Ask your first question below!'
            : 'Belum ada diskusi untuk topik ini. Ajukan pertanyaan pertamamu di bawah!';
        qaList.innerHTML = `
            <div style="font-size:0.78rem; color:var(--text-3); text-align:center; padding:1.25rem 0; line-height: 1.45;">
                ${noDiskText}
            </div>
        `;
    } else {
        nodeData.qaHistory.forEach(msg => {
            const bubble = document.createElement('div');
            bubble.className = `qa-bubble ${msg.role === 'user' ? 'user' : 'bot'}`;
            if (msg.role === 'bot') {
                bubble.innerHTML = marked.parse(msg.content);
            } else {
                bubble.textContent = msg.content;
            }
            qaList.appendChild(bubble);
        });
        
        // Auto scroll ke bawah
        setTimeout(() => {
            qaList.scrollTop = qaList.scrollHeight;
        }, 30);
    }
}

// Update UI tombol status progress di drawer
function updateDrawerStatusSelector(nodeName) {
    const status = state.nodeStatuses[nodeName] || 'todo';
    const statusBtns = document.querySelectorAll('.status-btn');
    
    statusBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-status') === status) {
            btn.classList.add('active');
        }
    });
}

// Handler perubahan status progress belajar (todo, doing, done)
function handleStatusChange(e) {
    if (!state.activeNode) return;
    
    const nodeName = state.activeNode.name;
    const newStatus = e.currentTarget.getAttribute('data-status');
    
    // Update state & persist
    state.nodeStatuses[nodeName] = newStatus;
    saveState();
    
    // Update tombol drawer
    updateDrawerStatusSelector(nodeName);
    
    // Update rendering warna node di mindmap
    updateMindmap(state.mindmapData);

    // Beri apresiasi di chat jika ditandai SELESAI
    if (newStatus === 'done') {
        const msg = state.language === 'en'
            ? `Excellent! You completed the topic **${nodeName}**. Keep up the great work! 🎓👏`
            : `Luar biasa! Kamu telah menyelesaikan pelajaran **${nodeName}**. Terus pertahankan semangat belajarmu! 🎓👏`;
        appendChatMessage('bot', msg);
    } else if (newStatus === 'doing') {
        const msg = state.language === 'en'
            ? `Great! You are now studying **${nodeName}**. Take notes of the important points! 📖✍️`
            : `Semangat! Sekarang kamu sedang mempelajari **${nodeName}**. Catat poin-poin pentingnya ya! 📖✍️`;
        appendChatMessage('bot', msg);
    }
}

/* ==========================================================================
   DRAWER RESIZE
   ========================================================================== */
function initDrawerResize() {
    const handle = document.getElementById('drawer-resize-handle');
    const drawer = document.getElementById('detail-drawer');
    if (!handle || !drawer) return;

    let startX, startWidth;

    handle.addEventListener('mousedown', (e) => {
        e.preventDefault();
        startX = e.clientX;
        startWidth = drawer.offsetWidth;
        drawer.classList.add('resizing');
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';

        const onMove = (e) => {
            const delta = startX - e.clientX; // dragging left = wider
            const newWidth = Math.min(
                Math.max(startWidth + delta, 280),
                window.innerWidth * 0.7
            );
            drawer.style.width = `${newWidth}px`;
        };

        const onUp = () => {
            drawer.classList.remove('resizing');
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
        };

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    });
}

/* ==========================================================================
   DRAWER Q&A SUBMIT HANDLER
   ========================================================================== */
async function handleQaSubmit(e) {
    e.preventDefault();
    const qaInput = document.getElementById('drawer-qa-input');
    const qaList = document.getElementById('qa-messages-list');
    if (!qaInput || !qaList || !state.activeNode) return;

    const question = qaInput.value.trim();
    if (!question) return;

    const nodeName = state.activeNode.name;
    const nodeData = state.nodeCache[nodeName];
    if (!nodeData) return;

    // Bersihkan placeholder jika ada
    if (nodeData.qaHistory.length === 0) {
        qaList.innerHTML = '';
    }

    // 1. Render Pertanyaan User
    const userBubble = document.createElement('div');
    userBubble.className = 'qa-bubble user';
    userBubble.textContent = question;
    qaList.appendChild(userBubble);
    
    // Auto scroll
    qaList.scrollTop = qaList.scrollHeight;

    // Bersihkan input
    qaInput.value = '';

    // Simpan ke cache & localstorage
    nodeData.qaHistory.push({ role: 'user', content: question });
    saveState();

    // 2. Render Loading Indicator Tutor AI
    const loadingBubble = document.createElement('div');
    loadingBubble.className = 'qa-bubble bot';
    loadingBubble.innerHTML = `
        <div class="typing-dots" style="padding: 4px 0;">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    qaList.appendChild(loadingBubble);
    qaList.scrollTop = qaList.scrollHeight;

    try {
        const rootTopicName = state.mindmapData.name;
        const systemInstruction = state.language === 'en' ? `You are an AI teaching assistant (AI tutor) for the subtopic "${nodeName}" under the main topic "${rootTopicName}".
Your task is to answer the learner's questions directly, concisely, and to-the-point as necessary (like a normal chat conversation).
It is STRICTLY FORBIDDEN to write answers in the form of long articles with large headings (like #, ##, or ###).
Provide a brief, concise, friendly explanation focusing directly on the question. Use only 1-2 short paragraphs or simple bullet-points if needed.
You must always return the answer in a structured JSON format:
{
  "answer": "your short chat answer content using simple Markdown format (e.g. bold, inline code, or bullet-points without large headings)"
}` : `Kamu adalah asisten pengajar (tutor AI) untuk sub-topik "${nodeName}" di bawah topik utama "${rootTopicName}".
Tugas Anda adalah menjawab pertanyaan pembelajar secara langsung, ringkas, dan to-the-point seperlunya saja (seperti percakapan chat biasa).
DILARANG keras menulis jawaban dalam bentuk format artikel panjang dengan judul besar (seperti #, ##, atau ###).
Berikan penjelasan yang singkat, padat, ramah, dan berfokus langsung pada pertanyaan. Cukup gunakan 1-2 paragraf pendek atau bullet-points sederhana bila diperlukan.
Anda wajib selalu mengembalikan jawaban dalam format JSON terstruktur dengan format:
{
  "answer": "isi jawaban chat singkat Anda menggunakan format Markdown sederhana (misalnya bold, inline code, atau bullet-point tanpa heading besar)"
}`;

        const prompt = state.language === 'en' ? `Current material explanation context:
"${nodeData.explanation}"

Learner's question:
"${question}"

Answer the question directly and concisely (to-the-point) in a friendly and casual English. Do not use large headers (#, ##, ###). Keep your answer brief as if replying to a chat message. Return in JSON format: { "answer": "..." }.` : `Konteks penjelasan materi saat ini:
"${nodeData.explanation}"

Pertanyaan pembelajar:
"${question}"

Jawablah pertanyaan tersebut secara langsung seperlunya saja (to-the-point) dengan bahasa Indonesia yang santai dan ramah. Jangan gunakan judul/header besar (#, ##, ###). Jadikan jawaban Anda singkat layaknya membalas pesan chat. Kembalikan dalam format JSON: { "answer": "..." }.`;

        // Panggil 9Router API
        const result = await callRouterAI(prompt, systemInstruction);
        const answerMarkdown = result.answer || 'Maaf, aku tidak dapat merumuskan jawaban saat ini.';

        // Hapus loading indicator
        loadingBubble.remove();

        // 3. Render Jawaban AI
        const botBubble = document.createElement('div');
        botBubble.className = 'qa-bubble bot';
        botBubble.innerHTML = marked.parse(answerMarkdown);
        qaList.appendChild(botBubble);
        
        // Auto scroll
        qaList.scrollTop = qaList.scrollHeight;

        // Simpan ke history cache & localStorage
        nodeData.qaHistory.push({ role: 'bot', content: answerMarkdown });
        saveState();

        // Re-inisialisasi ikon lucide baru
        lucide.createIcons();
    } catch (error) {
        console.error('Gagal memproses tanya jawab:', error);
        loadingBubble.remove();

        const errorBubble = document.createElement('div');
        errorBubble.className = 'qa-bubble bot';
        errorBubble.style.color = '#ef4444';
        errorBubble.style.border = '1px solid #fecaca';
        errorBubble.style.background = '#fef2f2';
        errorBubble.textContent = `Error: ${error.message || 'Gagal menghubungi tutor AI. Silakan coba lagi.'}`;
        qaList.appendChild(errorBubble);
        qaList.scrollTop = qaList.scrollHeight;
    }
}

/* ==========================================================================
   DRAWER SIDE-BY-SIDE Q&A COLLAPSIBLE TOGGLER
   ========================================================================== */
function toggleDrawerQa() {
    const qaCol = document.getElementById('drawer-col-qa');
    const drawer = document.getElementById('detail-drawer');
    const toggleBtn = document.getElementById('btn-toggle-drawer-qa');
    if (!qaCol || !drawer || !toggleBtn || !state.activeNode) return;

    const isCollapsed = qaCol.classList.contains('collapsed');
    const baseWidth = 520; // Default drawer width

    if (isCollapsed) {
        // Buka panel Q&A ke samping
        qaCol.classList.remove('collapsed');
        toggleBtn.classList.add('active');
        
        // Lebarkan drawer: ambil lebar saat ini dan tambah 440px (kolom Q&A)
        const currentWidth = drawer.offsetWidth;
        drawer.style.width = `${currentWidth + 440}px`;
        
        // Render Q&A khusus node aktif
        renderNodeQa(state.activeNode.name);
    } else {
        // Tutup panel Q&A ke samping
        qaCol.classList.add('collapsed');
        toggleBtn.classList.remove('active');
        
        // Kembalikan lebar drawer asal (kurangi 440px)
        const currentWidth = drawer.offsetWidth;
        drawer.style.width = `${Math.max(currentWidth - 440, baseWidth)}px`;
    }
}

/* ==========================================================================
   HISTORY MANAGEMENT (SIDEBAR HISTORY LIST)
   ========================================================================== */
async function loadHistoryList() {
    try {
        const res = await fetch('/api/mindmaps');
        if (!res.ok) throw new Error('Gagal mengambil riwayat');
        const mindmaps = await res.json();
        
        const container = document.getElementById('history-list-container');
        if (!container) return;
        
        container.innerHTML = '';
        if (mindmaps.length === 0) {
            container.innerHTML = `<div style="font-size: 0.72rem; color: var(--text-3); text-align: center; padding: 10px 0;">Belum ada mindmap.</div>`;
            return;
        }
        
        mindmaps.forEach(mm => {
            const item = document.createElement('div');
            const isActive = mm.id === state.currentMindmapId;
            item.className = `history-item ${isActive ? 'active' : ''}`;
            
            // Format date nicely
            let dateStr = '';
            try {
                const date = new Date(mm.updated_at);
                dateStr = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
            } catch (e) {
                dateStr = mm.updated_at;
            }
            
            item.innerHTML = `
                <div class="history-item-left">
                    <span class="history-item-title" title="${mm.name}">${mm.name}</span>
                    <span class="history-item-date">${dateStr}</span>
                </div>
                <button class="history-item-delete" title="Hapus mindmap ini" data-id="${mm.id}">
                    <i data-lucide="trash-2"></i>
                </button>
            `;
            
            // Click to load
            item.addEventListener('click', (e) => {
                if (e.target.closest('.history-item-delete')) return;
                loadMindmapById(mm.id);
            });
            
            // Delete handler
            const deleteBtn = item.querySelector('.history-item-delete');
            deleteBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                if (confirm(`Apakah Anda yakin ingin menghapus mindmap "${mm.name}"?`)) {
                    await deleteMindmapById(mm.id);
                }
            });
            
            container.appendChild(item);
        });
        
        lucide.createIcons();
    } catch (e) {
        console.error('Gagal memuat daftar riwayat:', e);
        const container = document.getElementById('history-list-container');
        if (container) {
            container.innerHTML = `<div style="font-size: 0.72rem; color: #ef4444; text-align: center; padding: 10px 0;">Gagal memuat riwayat. Silakan restart server.</div>`;
        }
    }
}

async function loadMindmapById(id) {
    state.currentMindmapId = id;
    localStorage.setItem('current_mindmap_id', id);
    
    // Sinkronkan
    await syncFromDatabase(id);
    
    // Tampilkan pesan di chat bahwa mindmap berhasil dimuat
    if (state.mindmapData) {
        appendChatMessage('bot', `Mindmap **${state.mindmapData.name}** berhasil dimuat! Mari lanjutkan belajar. 📚`);
    }
}

async function deleteMindmapById(id) {
    try {
        const res = await fetch(`/api/mindmap/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Gagal menghapus');
        
        // Jika mindmap yang dihapus adalah yang sedang aktif
        if (id === state.currentMindmapId) {
            // Coba ambil mindmap lain dari list yang tersisa
            const listRes = await fetch('/api/mindmaps');
            if (listRes.ok) {
                const list = await listRes.json();
                if (list && list.length > 0) {
                    // Load yang teratas
                    await loadMindmapById(list[0].id);
                } else {
                    // DB benar-benar kosong
                    state.currentMindmapId = 'default';
                    localStorage.removeItem('current_mindmap_id');
                    state.mindmapData = null;
                    state.nodeCache = {};
                    state.nodeStatuses = {};
                    saveState(true);
                    
                    // Bersihkan canvas
                    d3.select('#mindmap-svg').selectAll('*').remove();
                    document.getElementById('mindmap-hint-text').classList.remove('hidden');
                    
                    appendChatMessage('bot', 'Semua mindmap telah dihapus. Silakan tulis topik baru di kolom chat untuk memulai! 🧠✨');
                    
                    // Update daftar riwayat di sidebar agar terupdate
                    await loadHistoryList();
                }
            }
        } else {
            // Cukup refresh history list
            await loadHistoryList();
        }
    } catch (e) {
        console.error('Gagal menghapus mindmap:', e);
        alert('Gagal menghapus mindmap: ' + e.message);
    }
}

function createNewMindmap() {
    // Reset state local
    state.currentMindmapId = 'mm_' + Date.now();
    localStorage.setItem('current_mindmap_id', state.currentMindmapId);
    state.mindmapData = null;
    state.nodeCache = {};
    state.nodeStatuses = {};
    
    // Bersihkan canvas & status localstorage
    localStorage.removeItem('mindmap_data');
    localStorage.removeItem('node_cache');
    localStorage.removeItem('node_statuses');
    
    d3.select('#mindmap-svg').selectAll('*').remove();
    document.getElementById('mindmap-hint-text').classList.remove('hidden');
    
    appendChatMessage('bot', 'Siap membuat mindmap baru! Silakan tulis topik belajar berikutnya yang ingin kamu jelajahi di bawah ini. 🧠🚀');
    
    // Refresh list history agar state active terupdate
    loadHistoryList();
}
