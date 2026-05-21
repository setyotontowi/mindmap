/* ==========================================================================
   UI HANDLERS & NAVIGATION
   ========================================================================== */
function initUIEventListeners() {
    // 1. Form Chat
    const chatForm = document.getElementById('chat-form');
    if (chatForm) chatForm.addEventListener('submit', handleChatSubmit);

    // 2. Settings Modal
    const btnOpenSettings = document.getElementById('btn-open-settings');
    const btnCloseSettings = document.getElementById('btn-close-settings');
    const btnCancelSettings = document.getElementById('btn-cancel-settings');
    const btnSaveSettings = document.getElementById('btn-save-settings');
    const settingsModal = document.getElementById('settings-modal');

    if (btnOpenSettings) btnOpenSettings.addEventListener('click', openSettingsModal);
    if (btnCloseSettings) btnCloseSettings.addEventListener('click', closeSettingsModal);
    if (btnCancelSettings) btnCancelSettings.addEventListener('click', closeSettingsModal);
    if (btnSaveSettings) btnSaveSettings.addEventListener('click', saveSettings);
    
    // Tutup modal jika klik di luar kartu modal
    if (settingsModal) {
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) closeSettingsModal();
        });
    }

    // 3. Zoom Controls
    const btnZoomIn = document.getElementById('btn-zoom-in');
    const btnZoomOut = document.getElementById('btn-zoom-out');
    const btnZoomFit = document.getElementById('btn-zoom-fit');
    if (btnZoomIn) btnZoomIn.addEventListener('click', zoomIn);
    if (btnZoomOut) btnZoomOut.addEventListener('click', zoomOut);
    if (btnZoomFit) btnZoomFit.addEventListener('click', zoomFit);

    // 4. Toggle Chat Sidebar
    const btnToggleChat = document.getElementById('btn-toggle-chat');
    if (btnToggleChat) btnToggleChat.addEventListener('click', toggleChatSidebar);

    // 5. Drawer Close
    const btnCloseDrawer = document.getElementById('btn-close-drawer');
    if (btnCloseDrawer) btnCloseDrawer.addEventListener('click', closeDetailDrawer);

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
                if (content) content.classList.remove('hidden');
                loadHistoryList(); // reload whenever opened
            } else {
                if (content) content.classList.add('hidden');
            }
        });
    }

    // 9.5. Back to History Button
    const btnBackToHistory = document.getElementById('btn-back-to-history');
    if (btnBackToHistory) {
        btnBackToHistory.addEventListener('click', () => {
            switchSidebarMode('history');
        });
    }

    // 10. New Topic Button
    const btnNewTopic = document.getElementById('btn-new-topic');
    if (btnNewTopic) {
        btnNewTopic.addEventListener('click', createNewMindmap);
    }

    // 11. Custom Node Manual CRUD Buttons
    const btnAddSubnode = document.getElementById('btn-add-subnode');
    if (btnAddSubnode) {
        btnAddSubnode.addEventListener('click', openAddNodeModal);
    }
    const btnEditNode = document.getElementById('btn-edit-node');
    if (btnEditNode) {
        btnEditNode.addEventListener('click', openEditNodeModal);
    }
    const btnRegenerateNode = document.getElementById('btn-regenerate-node');
    if (btnRegenerateNode) {
        btnRegenerateNode.addEventListener('click', openRegenerateNodeModal);
    }
    const btnDeleteNode = document.getElementById('btn-delete-node');
    if (btnDeleteNode) {
        btnDeleteNode.addEventListener('click', handleDeleteNode);
    }

    // 12. Modal Add Node Controls
    const btnCloseAddNode = document.getElementById('btn-close-add-node');
    const btnCancelAddNode = document.getElementById('btn-cancel-add-node');
    const btnSubmitAddNode = document.getElementById('btn-submit-add-node');
    const addNodeModal = document.getElementById('add-node-modal');

    if (btnCloseAddNode) btnCloseAddNode.addEventListener('click', closeAddNodeModal);
    if (btnCancelAddNode) btnCancelAddNode.addEventListener('click', closeAddNodeModal);
    if (btnSubmitAddNode) btnSubmitAddNode.addEventListener('click', submitAddNode);
    if (addNodeModal) {
        addNodeModal.addEventListener('click', (e) => {
            if (e.target === addNodeModal) closeAddNodeModal();
        });
    }

    // 13. Modal Edit Node Controls
    const btnCloseEditNode = document.getElementById('btn-close-edit-node');
    const btnCancelEditNode = document.getElementById('btn-cancel-edit-node');
    const btnSubmitEditNode = document.getElementById('btn-submit-edit-node');
    const editNodeModal = document.getElementById('edit-node-modal');

    if (btnCloseEditNode) btnCloseEditNode.addEventListener('click', closeEditNodeModal);
    if (btnCancelEditNode) btnCancelEditNode.addEventListener('click', closeEditNodeModal);
    if (btnSubmitEditNode) btnSubmitEditNode.addEventListener('click', submitEditNode);
    if (editNodeModal) {
        editNodeModal.addEventListener('click', (e) => {
            if (e.target === editNodeModal) closeEditNodeModal();
        });
    }

    // 14. Modal Regenerate Node Controls
    const btnCloseRegenerateNode = document.getElementById('btn-close-regenerate-node');
    const btnCancelRegenerateNode = document.getElementById('btn-cancel-regenerate-node');
    const btnSubmitRegenerateNode = document.getElementById('btn-submit-regenerate-node');
    const regenerateNodeModal = document.getElementById('regenerate-node-modal');

    if (btnCloseRegenerateNode) btnCloseRegenerateNode.addEventListener('click', closeRegenerateNodeModal);
    if (btnCancelRegenerateNode) btnCancelRegenerateNode.addEventListener('click', closeRegenerateNodeModal);
    if (btnSubmitRegenerateNode) btnSubmitRegenerateNode.addEventListener('click', submitRegenerateNode);
    if (regenerateNodeModal) {
        regenerateNodeModal.addEventListener('click', (e) => {
            if (e.target === regenerateNodeModal) closeRegenerateNodeModal();
        });
    }
}


// Toggle Sidebar Chat
function toggleChatSidebar() {
    const sidebar = document.getElementById('chat-sidebar-section');
    const toggleIcon = document.querySelector('#btn-toggle-chat i');
    
    state.collapsedSidebar = !state.collapsedSidebar;
    
    if (state.collapsedSidebar) {
        if (sidebar) sidebar.classList.add('collapsed');
        if (toggleIcon) toggleIcon.setAttribute('data-lucide', 'menu');
    } else {
        if (sidebar) sidebar.classList.remove('collapsed');
        if (toggleIcon) toggleIcon.setAttribute('data-lucide', 'x');
    }
    if (window.lucide) window.lucide.createIcons();
    setTimeout(zoomFit, 350); // Sesuaikan visual mindmap setelah resize
}

// Peralihan Mode Sidebar (History vs Chat)
function switchSidebarMode(mode) {
    const sidebar = document.getElementById('chat-sidebar-section');
    if (!sidebar) return;
    if (mode === 'chat') {
        sidebar.classList.remove('mode-history');
        sidebar.classList.add('mode-chat');
        // Auto focus ke input chat ketika masuk ke mode chat
        const chatInput = document.getElementById('chat-input');
        if (chatInput) setTimeout(() => chatInput.focus(), 50);
    } else {
        sidebar.classList.remove('mode-chat');
        sidebar.classList.add('mode-history');
    }
}

// Modal Control
function openSettingsModal() {
    const modal = document.getElementById('settings-modal');
    const langSelect = document.getElementById('ai-language-select');
    if (langSelect) {
        langSelect.value = state.language;
    }
    if (modal) modal.classList.add('open');
}

function closeSettingsModal() {
    const modal = document.getElementById('settings-modal');
    if (modal) modal.classList.remove('open');
}

function saveSettings() {
    const langSelect = document.getElementById('ai-language-select');
    if (langSelect) {
        state.language = langSelect.value;
        localStorage.setItem('ai_language', state.language);
    }
    
    closeSettingsModal();
    
    const message = state.language === 'en'
        ? 'Settings saved successfully!'
        : 'Pengaturan berhasil disimpan!';
    appendChatMessage('bot', message);
}

// Chat UI Controls
function appendChatMessage(sender, text) {
    const container = document.getElementById('chat-messages-container');
    if (!container) return null;
    
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
    if (!container) return;
    
    const bubble = document.createElement('div');
    bubble.className = 'thinking-bubble';
    bubble.id = 'thinking-indicator';
    
    bubble.innerHTML = `
        <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
        </div>
        <span style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.4;">AI sedang berpikir...<br><span style="font-size: 0.72rem; opacity: 0.7; display: block;">(ini biasanya membutuhkan waktu sekitar 30 detik)</span></span>
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
    if (!inputEl) return;
    const topic = inputEl.value.trim();
    if (!topic) return;

    // Reset input
    inputEl.value = '';

    // Masukkan ke chat UI
    appendChatMessage('user', topic);

    // Warning is disabled if we use backend key.
    // If state.apiKey is not present, we will try to generate via backend env key.
    // If backend doesn't have it either, it will throw an authorization error which we will catch.

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

            // Kembalikan ke mode riwayat
            switchSidebarMode('history');

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
    if (!drawer || !drawerTitle || !drawerLevel) return;

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
    if (!drawer) return;
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
    if (!content) return;
    const loadingText = state.language === 'en'
        ? `Exploring the rabbit hole for <strong>${title}</strong>... <br>Preparing deep theoretical summary & new subtopics.<br><span style="font-size:0.75rem; opacity:0.75; margin-top:0.25rem; display:block;">(this usually takes about 30 seconds)</span>`
        : `Menggali rabbit hole untuk <strong>${title}</strong>... <br>Mempersiapkan rangkuman teori mendalam & sub-topik baru.<br><span style="font-size:0.75rem; opacity:0.75; margin-top:0.25rem; display:block;">(ini biasanya membutuhkan waktu sekitar 30 detik)</span>`;
    content.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:3rem 0; gap:1rem;">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <p style="font-size:0.88rem; color:var(--text-muted); text-align:center; line-height:1.45;">${loadingText}</p>
        </div>
    `;
    const qaList = document.getElementById('qa-messages-list');
    const qaLoadingText = state.language === 'en' ? 'Loading material...' : 'Sedang memuat materi...';
    if (qaList) qaList.innerHTML = `<div style="font-size:0.78rem; color:var(--text-3); text-align:center; padding:1.25rem 0;">${qaLoadingText}</div>`;
}

function renderDrawerError(title, errorMsg) {
    const content = document.getElementById('drawer-markdown-content');
    if (!content) return;
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
    if (!content) return;
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
            : `Luar biasa! Kamu telah menyelesaikan pelajaran **${nodeName}**. Terus pertahaman semangat belajarmu! 🎓👏`;
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
        if (window.lucide) window.lucide.createIcons();
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
        
        if (window.lucide) window.lucide.createIcons();
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
    
    // Pastikan berada di mode riwayat
    switchSidebarMode('history');
    
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
    
    // Aktifkan mode chat
    switchSidebarMode('chat');
    
    // Refresh list history agar state active terupdate
    loadHistoryList();
}

/* ==========================================================================
   Fase 5: MANUAL NODE CRUD & MODAL CONTROLLERS
   ========================================================================== */

function openAddNodeModal() {
    if (!state.activeNode) return;
    const modal = document.getElementById('add-node-modal');
    const parentTitleEl = document.getElementById('add-node-parent-title');
    const titleInput = document.getElementById('add-node-title-input');
    const descInput = document.getElementById('add-node-desc-input');

    if (parentTitleEl) parentTitleEl.innerText = state.activeNode.name;
    if (titleInput) titleInput.value = '';
    if (descInput) descInput.value = '';

    if (modal) modal.classList.add('open');
}

function closeAddNodeModal() {
    const modal = document.getElementById('add-node-modal');
    if (modal) modal.classList.remove('open');
}

function openEditNodeModal() {
    if (!state.activeNode) return;
    const modal = document.getElementById('edit-node-modal');
    const titleInput = document.getElementById('edit-node-title-input');
    const descInput = document.getElementById('edit-node-desc-input');

    if (titleInput) titleInput.value = state.activeNode.name;
    if (descInput) descInput.value = state.activeNode.description || '';

    if (modal) modal.classList.add('open');
}

function closeEditNodeModal() {
    const modal = document.getElementById('edit-node-modal');
    if (modal) modal.classList.remove('open');
}

function submitAddNode(e) {
    e.preventDefault();
    if (!state.activeNode) return;

    const titleInput = document.getElementById('add-node-title-input');
    const descInput = document.getElementById('add-node-desc-input');
    if (!titleInput || !descInput) return;
    
    const title = titleInput.value.trim();
    const desc = descInput.value.trim();

    if (!title) {
        alert(state.language === 'en' ? 'Please enter a title' : 'Silakan masukkan judul sub-topik');
        return;
    }

    // Hindari duplikasi sub-node di parent yang sama
    if (!state.activeNode.children) {
        state.activeNode.children = [];
    }

    const exists = state.activeNode.children.some(child => child.name.toLowerCase() === title.toLowerCase());
    if (exists) {
        alert(state.language === 'en' 
            ? 'A subtopic with this title already exists under this node.' 
            : 'Sub-topik dengan judul ini sudah ada di bawah node ini.');
        return;
    }

    // Buat node kustom baru
    const newNode = {
        id: `custom-${state.activeNode.name}-${title}-${Date.now()}`,
        name: title,
        description: desc || (state.language === 'en' ? 'Custom Subtopic' : 'Sub-topik Kustom'),
        children: []
    };

    state.activeNode.children.push(newNode);
    
    // Simpan ke cache agar penjelasannya bisa ditulis manual atau otomatis saat di-deep dive
    state.nodeCache[title] = {
        explanation: state.language === 'en' 
            ? `### ${title}\n\nThis is a custom subtopic created manually under **${state.activeNode.name}**.\n\nDescription: *${newNode.description}*`
            : `### ${title}\n\nIni adalah sub-topik kustom yang dibuat secara manual di bawah **${state.activeNode.name}**.\n\nDeskripsi: *${newNode.description}*`,
        subtopics: []
    };

    saveState();
    updateMindmap(state.mindmapData);
    closeAddNodeModal();

    const msg = state.language === 'en'
        ? `Successfully added new subtopic **${title}** manually under **${state.activeNode.name}**! 🚀`
        : `Berhasil menambahkan sub-topik baru **${title}** secara manual di bawah **${state.activeNode.name}**! 🚀`;
    appendChatMessage('bot', msg);
}

function submitEditNode(e) {
    e.preventDefault();
    if (!state.activeNode) return;

    const titleInput = document.getElementById('edit-node-title-input');
    const descInput = document.getElementById('edit-node-desc-input');
    if (!titleInput || !descInput) return;
    
    const newTitle = titleInput.value.trim();
    const newDesc = descInput.value.trim();

    if (!newTitle) {
        alert(state.language === 'en' ? 'Please enter a title' : 'Silakan masukkan judul');
        return;
    }

    const oldTitle = state.activeNode.name;

    // Jika mengganti judul utama (root node), perbarui nama mindmap utama
    const isRoot = state.activeNode.id === 'root';
    if (isRoot) {
        state.mindmapData.name = newTitle;
    }

    // Cari node di tree dan update datanya
    state.activeNode.name = newTitle;
    state.activeNode.description = newDesc;

    // Migrasi cache & status progress jika ada perubahan nama
    if (oldTitle !== newTitle) {
        // Cache penjelasan
        if (state.nodeCache[oldTitle]) {
            state.nodeCache[newTitle] = state.nodeCache[oldTitle];
            delete state.nodeCache[oldTitle];
            
            // Perbarui judul h3 di isi markdown penjelasan jika menggunakan template bawaan
            let currentExp = state.nodeCache[newTitle].explanation;
            if (currentExp.startsWith(`### ${oldTitle}`)) {
                state.nodeCache[newTitle].explanation = currentExp.replace(`### ${oldTitle}`, `### ${newTitle}`);
            }
        }
        
        // Status progress (todo, doing, done)
        if (state.nodeStatuses[oldTitle]) {
            state.nodeStatuses[newTitle] = state.nodeStatuses[oldTitle];
            delete state.nodeStatuses[oldTitle];
        }
    }

    saveState();
    updateMindmap(state.mindmapData);
    closeEditNodeModal();

    // Perbarui drawer yang sedang terbuka
    const drawerTitle = document.getElementById('drawer-node-title');
    if (drawerTitle) drawerTitle.innerText = newTitle;

    if (state.nodeCache[newTitle]) {
        renderNodeDetail(newTitle, state.nodeCache[newTitle].explanation);
    }

    const msg = state.language === 'en'
        ? `Node **${oldTitle}** was successfully edited to **${newTitle}**! ✏️`
        : `Node **${oldTitle}** berhasil diubah menjadi **${newTitle}**! ✏️`;
    appendChatMessage('bot', msg);
    
    // Muat ulang history jika root diubah namanya
    if (isRoot) {
        loadHistoryList();
    }
}

function handleDeleteNode() {
    if (!state.activeNode) return;

    // Larang menghapus root node agar mindmap tetap utuh
    if (state.activeNode.id === 'root') {
        alert(state.language === 'en' 
            ? 'You cannot delete the root node. Create a new mindmap instead!' 
            : 'Anda tidak dapat menghapus node akar (root). Silakan buat mindmap baru jika ingin mengganti topik!');
        return;
    }

    const confirmMsg = state.language === 'en'
        ? `Are you sure you want to delete "${state.activeNode.name}" and all its subtopics? This action cannot be undone.`
        : `Apakah Anda yakin ingin menghapus "${state.activeNode.name}" dan seluruh sub-cabang di bawahnya? Tindakan ini tidak bisa dibatalkan.`;

    if (!confirm(confirmMsg)) return;

    const nodeToDelete = state.activeNode;

    // Fungsi rekursif untuk mencari parent dan menghapus child
    function removeNodeRecursively(parent, targetId) {
        if (!parent.children) return false;
        const index = parent.children.findIndex(child => child.id === targetId || child.name === targetId);
        if (index !== -1) {
            parent.children.splice(index, 1);
            return true;
        }
        for (let child of parent.children) {
            if (removeNodeRecursively(child, targetId)) {
                return true;
            }
        }
        return false;
    }

    // Fungsi rekursif untuk membersihkan cache & status dari sub-tree yang dihapus
    function cleanSubtreeData(node) {
        if (node.name) {
            delete state.nodeCache[node.name];
            delete state.nodeStatuses[node.name];
        }
        if (node.children) {
            node.children.forEach(cleanSubtreeData);
        }
    }

    // Hapus dari tree
    const deleted = removeNodeRecursively(state.mindmapData, nodeToDelete.id || nodeToDelete.name);

    if (deleted) {
        // Bersihkan seluruh data sub-tree
        cleanSubtreeData(nodeToDelete);

        saveState();
        closeDetailDrawer();
        updateMindmap(state.mindmapData);

        const msg = state.language === 'en'
            ? `Node **${nodeToDelete.name}** and all its branches were deleted successfully.`
            : `Node **${nodeToDelete.name}** beserta seluruh cabangnya berhasil dihapus.`;
        appendChatMessage('bot', msg);
    } else {
        alert(state.language === 'en' ? 'Failed to delete node.' : 'Gagal menghapus node.');
    }
}

function openRegenerateNodeModal() {
    if (!state.activeNode) return;
    const modal = document.getElementById('regenerate-node-modal');
    const displayEl = document.getElementById('regenerate-node-title-display');
    if (displayEl) displayEl.innerText = state.activeNode.name;
    if (modal) modal.classList.add('open');
}

function closeRegenerateNodeModal() {
    const modal = document.getElementById('regenerate-node-modal');
    if (modal) modal.classList.remove('open');
}

async function submitRegenerateNode(e) {
    e.preventDefault();
    if (!state.activeNode) return;

    const nodeName = state.activeNode.name;
    const nodeDesc = state.activeNode.description || '';
    const rootTopicName = state.mindmapData.name;

    // Ambil opsi dari radio input
    const radios = document.getElementsByName('regenerate-scope');
    let scope = 'keep';
    for (let r of radios) {
        if (r.checked) scope = r.value;
    }

    closeRegenerateNodeModal();

    // 1. Tampilkan loading di drawer dan canvas
    renderDrawerLoading(nodeName);
    state.activeNode.loading = true;
    updateMindmap(state.mindmapData);

    const thinkingMsg = state.language === 'en'
        ? `Regenerating material portal for **${nodeName}**... I am rebuilding the deep theoretical summary. 🔄`
        : `Membangun ulang portal materi untuk **${nodeName}**... Aku sedang merancang kembali penjelasan teorinya. 🔄`;
    appendChatMessage('bot', thinkingMsg);

    try {
        let result;
        if (scope === 'keep') {
            // Hanya buat ulang penjelasan, pertahankan sub-node di bawahnya
            const existingSubtopicList = state.activeNode.children ? state.activeNode.children.map(c => c.name).join(', ') : '';
            const prompt = state.language === 'en' ? `You are an expert tutor. The user is currently learning the main topic "${rootTopicName}" and wants you to regenerate the deep-dive explanation for the subtopic "${nodeName}" (Description: "${nodeDesc}").
            The existing subtopics under this node are: [${existingSubtopicList}].
            
            Your task is:
            Create a deep, practical, structured, and easy-to-understand explanation/material in English using rich Markdown format (including code examples/analogies if relevant, use small h3 headings, lists, and interesting blockquotes).
            IMPORTANT: To prevent the explanation from being truncated by token limits, write the explanation concisely, focusing on the most important core concepts, and limit the explanation length to a maximum of about 800-1000 words.
            
            Return the result in JSON with exactly this format:
            {
              "explanation": "Full explanation content in Markdown format here..."
            }` : `Kamu adalah tutor ahli. Pengguna sedang mempelajari topik utama "${rootTopicName}" dan ingin Anda membuat ulang penjelasan materi yang mendalam untuk sub-topik "${nodeName}" (Deskripsi: "${nodeDesc}").
            Sub-topik yang sudah ada di bawah node ini adalah: [${existingSubtopicList}].
            
            Tugasmu adalah:
            Buat penjelasan materi yang mendalam, praktis, terstruktur, dan mudah dipahami dalam Bahasa Indonesia menggunakan format Markdown yang kaya (termasuk contoh kode/analogi jika relevan, gunakan judul-judul kecil h3, list, dan blockquote yang menarik).
            PENTING: Agar penjelasan tidak terpotong (truncated) oleh batas token, tulis penjelasan secara padat, fokus pada konsep inti yang paling penting, dan batasi panjang penjelasan maksimal sekitar 800-1000 kata.
            
            Kembalikan hasilnya dalam JSON dengan format persis seperti ini:
            {
              "explanation": "Isi penjelasan lengkap dalam format Markdown di sini..."
            }`;

            result = await callRouterAI(prompt);

            // Validasi respon JSON
            if (result && result.explanation) {
                // Update cache penjelasan, tapi pertahankan subtopics lama di cache
                if (!state.nodeCache[nodeName]) {
                    state.nodeCache[nodeName] = { explanation: '', subtopics: [] };
                }
                state.nodeCache[nodeName].explanation = result.explanation;
            } else {
                throw new Error("Respon AI tidak sesuai format");
            }
        } else {
            // Buat ulang penjelasan & buat ulang sub-node baru
            const prompt = state.language === 'en' ? `You are an expert tutor. The user is currently learning the main topic "${rootTopicName}" and wants to deep-dive into the subtopic "${nodeName}" (Description: "${nodeDesc}").
            
            Your tasks are:
            1. Create a deep, practical, structured, and easy-to-understand explanation/material in English using rich Markdown format (including code examples/analogies if relevant, use small h3 headings, lists, and interesting blockquotes).
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
            1. Buat penjelasan materi yang mendalam, praktis, terstruktur, dan mudah dipahami dalam Bahasa Indonesia menggunakan format Markdown yang kaya (termasuk contoh kode/analogi jika relevan, gunakan judul-judul kecil h3, list, dan blockquote yang menarik).
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

            result = await callRouterAI(prompt);

            // Validasi respon JSON
            if (result && result.explanation) {
                // Fungsi pembantu rekursif untuk membersihkan cache anak-anak lama sebelum diganti
                function cleanSubtreeData(node) {
                    if (node.name) {
                        delete state.nodeCache[node.name];
                        delete state.nodeStatuses[node.name];
                    }
                    if (node.children) {
                        node.children.forEach(cleanSubtreeData);
                    }
                }

                // Bersihkan data lama di bawah node ini
                if (state.activeNode.children) {
                    state.activeNode.children.forEach(cleanSubtreeData);
                }

                // Kosongkan dan ganti children
                state.activeNode.children = [];

                // Simpan cache baru
                state.nodeCache[nodeName] = {
                    explanation: result.explanation,
                    subtopics: result.subtopics || []
                };

                // Tambah children baru
                if (result.subtopics && result.subtopics.length > 0) {
                    result.subtopics.forEach(sub => {
                        sub.id = `${nodeName}-${sub.name}-${Date.now()}`;
                        state.activeNode.children.push(sub);
                    });
                }
            } else {
                throw new Error("Respon AI tidak sesuai format");
            }
        }

        // Hapus loading status
        delete state.activeNode.loading;

        saveState();
        updateMindmap(state.mindmapData);

        // Render isi penjelasan baru
        renderNodeDetail(nodeName, state.nodeCache[nodeName].explanation);

        const msg = state.language === 'en'
            ? `Successfully regenerated material for **${nodeName}**! 🔄`
            : `Berhasil membangun ulang materi untuk **${nodeName}**! 🔄`;
        appendChatMessage('bot', msg);

    } catch (error) {
        console.error('Regeneration error:', error);
        delete state.activeNode.loading;
        updateMindmap(state.mindmapData);
        
        const msg = state.language === 'en'
            ? `Sorry, I failed to regenerate material for **${nodeName}**. Error message: *${error.message}*.`
            : `Maaf, aku gagal membangun ulang materi untuk **${nodeName}**. Masalah: *${error.message}*.`;
        appendChatMessage('bot', msg);
        renderDrawerError(nodeName, error.message);
    }
}
