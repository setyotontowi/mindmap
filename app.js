/* ==========================================================================
   STATE MANAGEMENT & GLOBAL CONFIG
   ========================================================================== */
const state = {
    apiKey: localStorage.getItem('router_api_key') || '',
    mindmapData: null,       // Data pohon (tree) D3
    activeNode: null,        // Node yang sedang aktif di drawer
    nodeStatuses: JSON.parse(localStorage.getItem('node_statuses') || '{}'), // nodeName -> 'todo' | 'doing' | 'done'
    nodeCache: {},           // nodeName -> { explanation, subtopics } (cache untuk rabbit hole)
    collapsedSidebar: false
};

// 9Router System Instructions
const SYSTEM_INSTRUCTIONS = `Anda adalah tutor ahli dan arsitek pembelajaran profesional. Tugas Anda adalah membantu pengguna mempelajari topik apa saja melalui peta pikiran (mindmap) terstruktur yang dinamis dan panduan belajar mendalam (deep dive) dalam Bahasa Indonesia yang interaktif.`;

/* ==========================================================================
   PERSISTENCE — Save & Restore from localStorage
   ========================================================================== */
function saveState() {
    try {
        if (state.mindmapData) {
            localStorage.setItem('mindmap_data', JSON.stringify(state.mindmapData));
        }
        localStorage.setItem('node_cache', JSON.stringify(state.nodeCache));
        localStorage.setItem('node_statuses', JSON.stringify(state.nodeStatuses));
    } catch (e) {
        console.warn('Gagal menyimpan state ke localStorage:', e);
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
}

function clearState() {
    state.mindmapData = null;
    state.nodeCache = {};
    state.nodeStatuses = {};
    state.activeNode = null;
    localStorage.removeItem('mindmap_data');
    localStorage.removeItem('node_cache');
    localStorage.removeItem('node_statuses');
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
async function callRouterAI(prompt, systemInstruction = SYSTEM_INSTRUCTIONS) {
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
        stream: false
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
const nodeWidth = 180;
const nodeHeight = 65;
const margin = { top: 20, right: 120, bottom: 20, left: 40 };

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
        .nodeSize([90, 260]); // Lebar vertikal antar node, Jarak horizontal antar kedalaman
}

// Fungsi utama untuk me-render / memperbarui Mindmap
function updateMindmap(sourceData) {
    if (!sourceData) return;

    // Sembunyikan hint overlay jika mindmap ada
    document.getElementById('mindmap-hint-text').classList.add('hidden');

    // Konversi hierarchical data ke d3 hierarchy
    rootNodeData = d3.hierarchy(sourceData, d => d.children);

    // Hitung posisi pohon
    treeLayout(rootNodeData);

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
            const startX = parent.y + nodeWidth;
            const startY = parent.x + nodeHeight / 2;
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
                .source(l => ({ x: l.source.y + nodeWidth, y: l.source.x + nodeHeight / 2 }))
                .target(l => ({ x: l.target.y, y: l.target.x + nodeHeight / 2 }))
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
        .attr('width', nodeWidth)
        .attr('height', nodeHeight)
        .attr('x', 0)
        .attr('y', 0);

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

    // Update style/class node yang ada (misal status progress)
    nodeUpdate.select('.node-card')
        .attr('class', d => {
            const isLoading = d.data.loading ? 'loading' : '';
            return `node-card level-${d.depth} ${getNodeStatusClass(d.data.name)} ${isLoading}`;
        });
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
    appendChatMessage('bot', `Membuka portal rabbit hole untuk **${nodeName}**... Aku sedang menggali penjelasannya untukmu. 🔍`);

    try {
        const rootTopicName = state.mindmapData.name;
        const prompt = `Kamu adalah tutor ahli. Pengguna sedang mempelajari topik utama "${rootTopicName}" dan ingin melakukan deep-dive ke sub-topik "${nodeName}" (Deskripsi: "${nodeDesc}").
        
        Tugasmu adalah:
        1. Buat penjelasan materi yang mendalam, praktis, terstruktur, dan mudah dipahami dalam Bahasa Indonesia menggunakan format Markdown yang kaya (termasuk contoh kode/analogi jika relevan, gunakan judul-judul kecil h3, list, dan blockquote yang menarik).
        2. Hasilkan 3 hingga 4 sub-topik/milestone berikutnya yang lebih spesifik di bawah "${nodeName}" untuk memperluas mindmap mereka. Jangan buat sub-topik yang terlalu umum.

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
            appendChatMessage('bot', `Penjelasan materi untuk **${nodeName}** telah siap! Aku juga sudah menambahkan **${result.subtopics?.length || 0} sub-topik baru** di mindmap. Klik node baru tersebut untuk menggali lebih dalam! 🚀`);
        } else {
            throw new Error("Respon AI tidak sesuai format");
        }
    } catch (error) {
        console.error('Deep dive error:', error);
        delete d3Node.data.loading;
        updateMindmap(state.mindmapData);
        appendChatMessage('bot', `Maaf, aku gagal menjelajahi rabbit hole untuk **${nodeName}**. Pesan error: *${error.message}*. Coba klik lagi nanti!`);
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
    rootNodeData.descendants().forEach(d => {
        if (d.y < minY) minY = d.y;
        if (d.y > maxY) maxY = d.y;
        if (d.x < minX) minX = d.x;
        if (d.x > maxX) maxX = d.x;
    });

    const graphWidth = (maxY - minY) + nodeWidth + 100;
    const graphHeight = (maxX - minX) + nodeHeight + 100;

    const scale = Math.min(0.9, Math.min(width / graphWidth, height / graphHeight));
    
    const midX = minY + (maxY - minY) / 2 + nodeWidth / 2;
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

    // 8. Q&A Form Submit
    const qaForm = document.getElementById('drawer-qa-form');
    if (qaForm) {
        qaForm.addEventListener('submit', handleQaSubmit);
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
    input.value = state.apiKey;
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
    
    closeSettingsModal();
    checkApiKeyWarning();
    
    appendChatMessage('bot', 'API Key berhasil disimpan! Mulai ketik topik belajar untuk mencobanya. 🌟');
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
        appendChatMessage('bot', 'Aduh, aku butuh API Key 9Router untuk menjawab ini. Silakan klik tombol roda gigi ⚙️ di pojok kanan atas untuk menyetelnya.');
        openSettingsModal();
        return;
    }

    // Tampilkan thinking
    showThinkingIndicator();

    try {
        const prompt = `Buatlah peta jalan (roadmap) belajar terstruktur untuk topik: "${topic}". Hasilkan dalam format JSON yang valid dengan satu node akar (root) dan 3 hingga 5 sub-topik utama sebagai anaknya. Berikan deskripsi yang singkat namun jelas (maksimal 10 kata) untuk tiap node. 

        Struktur JSON harus persis seperti ini:
        {
          "name": "${topic}",
          "description": "Deskripsi singkat topik ini",
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

            // Simpan ke state global & reset cache/status progress belajar
            state.mindmapData = result;
            state.nodeCache = {};
            state.nodeStatuses = {};
            saveState();

            // Render Mindmap
            initD3Canvas();
            updateMindmap(state.mindmapData);
            zoomFit();

            appendChatMessage('bot', `Peta pikiran awal untuk belajar **${result.name}** telah siap! 🗺️ <br><br>Gunakan mouse untuk menggeser & men-zoom mindmap di panel kanan. **Klik pada node manapun** untuk memulai *deep dive* pelajaran!`);
        } else {
            throw new Error("Gagal mem-parsing format JSON dari AI");
        }
    } catch (error) {
        removeThinkingIndicator();
        console.error('Initial generation error:', error);
        appendChatMessage('bot', `Maaf, aku kesulitan membuat mindmap untuk topik tersebut. Masalah: *${error.message}*. Silakan coba lagi!`);
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
    document.getElementById('detail-drawer').classList.remove('open');
    state.activeNode = null;
    updateMindmap(state.mindmapData); // Matikan active border pada link
}

function renderDrawerLoading(title) {
    const content = document.getElementById('drawer-markdown-content');
    content.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:3rem 0; gap:1rem;">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <p style="font-size:0.88rem; color:var(--text-muted); text-align:center;">Menggali rabbit hole untuk <strong>${title}</strong>... <br>Mempersiapkan rangkuman teori mendalam & sub-topik baru.</p>
        </div>
    `;
    // Sembunyikan Q&A saat sedang loading
    const qaSection = document.getElementById('drawer-qa-section');
    if (qaSection) qaSection.classList.add('hidden');
}

function renderDrawerError(title, errorMsg) {
    const content = document.getElementById('drawer-markdown-content');
    content.innerHTML = `
        <div style="padding:1.5rem; background:rgba(244,63,94,0.1); border:1px solid rgba(244,63,94,0.2); border-radius:10px; color:#f87171;">
            <h4 style="margin-bottom:0.5rem;">Terjadi Kesalahan!</h4>
            <p style="font-size:0.85rem;">Gagal memuat detail materi untuk "${title}".</p>
            <p style="font-size:0.8rem; font-family:monospace; margin-top:0.5rem; opacity:0.8;">${errorMsg}</p>
        </div>
    `;
    // Sembunyikan Q&A jika terjadi error pemuatan
    const qaSection = document.getElementById('drawer-qa-section');
    if (qaSection) qaSection.classList.add('hidden');
}

function renderNodeDetail(title, markdownText) {
    const content = document.getElementById('drawer-markdown-content');
    // Gunakan marked.js untuk merender Markdown ke HTML
    content.innerHTML = marked.parse(markdownText);
    
    // Tampilkan & render Tanya Jawab untuk node aktif
    renderNodeQa(title);
}

function renderNodeQa(nodeName) {
    const qaSection = document.getElementById('drawer-qa-section');
    const qaList = document.getElementById('qa-messages-list');
    const qaInput = document.getElementById('drawer-qa-input');
    if (!qaSection || !qaList || !qaInput) return;

    qaSection.classList.remove('hidden');
    qaList.innerHTML = '';
    qaInput.value = '';

    const nodeData = state.nodeCache[nodeName];
    if (!nodeData) {
        qaSection.classList.add('hidden');
        return;
    }

    if (!nodeData.qaHistory) {
        nodeData.qaHistory = [];
    }

    if (nodeData.qaHistory.length === 0) {
        qaList.innerHTML = `
            <div style="font-size:0.78rem; color:var(--text-3); text-align:center; padding:1.25rem 0;">
                Belum ada tanya jawab. Ajukan pertanyaan pertamamu di bawah!
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
        appendChatMessage('bot', `Luar biasa! Kamu telah menyelesaikan pelajaran **${nodeName}**. Terus pertahankan semangat belajarmu! 🎓👏`);
    } else if (newStatus === 'doing') {
        appendChatMessage('bot', `Semangat! Sekarang kamu sedang mempelajari **${nodeName}**. Catat poin-poin pentingnya ya! 📖✍️`);
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
        const systemInstruction = `Kamu adalah asisten pengajar (tutor AI) yang sangat ramah, cerdas, dan interaktif untuk sub-topik "${nodeName}" di bawah topik utama "${rootTopicName}". 
Tugasmu adalah menjawab pertanyaan pembelajar tentang materi ini secara ringkas, akurat, padat, dan mendalam.
Gunakan Bahasa Indonesia yang ramah.
Anda wajib selalu mengembalikan jawaban dalam format JSON terstruktur dengan format:
{
  "answer": "isi jawaban lengkap Anda menggunakan format Markdown yang rapi (seperti bullet points, bold, inline code, dan paragraf pendek)"
}`;

        const prompt = `Pembelajar sedang mempelajari materi "${nodeName}" pada mindmap "${rootTopicName}".
Materi penjelasan utama yang sedang dibaca pembelajar:
"${nodeData.explanation}"

Pertanyaan pembelajar:
"${question}"

Jawablah pertanyaan tersebut secara ramah, padat, dan jelas untuk membantu pembelajar memahami materi dengan lebih baik. Jangan lupa kembalikan dalam format JSON: { "answer": "..." }.`;

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
