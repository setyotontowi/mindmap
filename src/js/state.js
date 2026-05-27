/* ==========================================================================
   STATE MANAGEMENT & GLOBAL CONFIG
   ========================================================================== */
const state = {
    language: localStorage.getItem('ai_language') || 'id',
    aiProvider: localStorage.getItem('ai_provider') || 'gemini',
    aiModel: localStorage.getItem('ai_model') || 'gemini-2.5-flash',
    theme: localStorage.getItem('app_theme') || 'system',
    currentMindmapId: localStorage.getItem('current_mindmap_id') || null,
    mindmapData: null,       // Data pohon (tree) D3
    activeNode: null,        // Node yang sedang aktif di drawer
    nodeStatuses: JSON.parse(localStorage.getItem('node_statuses') || '{}'), // nodeName -> 'todo' | 'doing' | 'done'
    nodeCache: {},           // nodeName -> { explanation, subtopics } (cache untuk rabbit hole)
    collapsedSidebar: false,
    currentUser: null,       // User yang sedang login (OAuth)
    isOwner: true
};

/* ==========================================================================
   PERSISTENCE — Save & Restore from localStorage & PostgreSQL
   ========================================================================== */
function showSyncStatus(statusText) {
    const el = document.getElementById('sync-status');
    if (el) el.innerText = statusText;
}

async function saveState(skipDBSync = false) {
    try {
        if (!state.isOwner) {
            return;
        }
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
        localStorage.removeItem('router_api_key'); // Clean up from local storage
        
        const urlParams = new URLSearchParams(window.location.search);
        const urlId = urlParams.get('id');
        if (urlId) {
            state.currentMindmapId = urlId;
        }
        
        const savedMindmap = localStorage.getItem('mindmap_data');
        if (savedMindmap && !urlId) {
            state.mindmapData = JSON.parse(savedMindmap);
        }
        const savedCache = localStorage.getItem('node_cache');
        if (savedCache && !urlId) {
            state.nodeCache = JSON.parse(savedCache);
        }
    } catch (e) {
        console.warn('Gagal memuat state dari localStorage:', e);
    }
    // Sinkronisasi data secara asinkron dari PostgreSQL database
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
            state.isOwner = dbData.is_owner !== undefined ? dbData.is_owner : true;
            
            if (state.isOwner) {
                localStorage.setItem('current_mindmap_id', state.currentMindmapId);
            }
            
            state.mindmapData = dbData.tree_data || null;
            state.nodeCache = dbData.node_cache || {};
            state.nodeStatuses = dbData.node_statuses || {};
            
            if (state.isOwner) {
                saveState(true); 
                showSyncStatus('Tersinkronisasi 💾');
            } else {
                showSyncStatus('Mode Lihat Saja 👁️');
            }
            
            if (state.mindmapData) {
                if (typeof initD3Canvas === 'function') {
                    initD3Canvas();
                }
                updateMindmap(state.mindmapData);
                setTimeout(zoomFit, 100);
                if (typeof updateTableOfContents === 'function') {
                    updateTableOfContents();
                }
                
                const urlParams = new URLSearchParams(window.location.search);
                if (urlParams.get('id') && typeof switchScreen === 'function') {
                    switchScreen('mindmaps');
                }
            } else {
                // Bersihkan canvas
                d3.select('#mindmap-svg').selectAll('*').remove();
                document.getElementById('mindmap-hint-text').classList.remove('hidden');
            }
        } else {
            if (state.mindmapData && state.isOwner) {
                showSyncStatus('Migrasi ke DB... ⏳');
                await saveState(false);
            } else {
                showSyncStatus('DB Kosong 🔌');
            }
        }
        // Muat daftar riwayat
        await loadHistoryList();
    } catch (error) {
        console.warn('Gagal sinkron dari database PostgreSQL:', error);
        if (state.isOwner) {
            showSyncStatus('Offline (Lokal) 🔌');
        } else {
            showSyncStatus('Offline (View Only) 👁️');
        }
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

/* Theme Application Helper */
function applyTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    }
}

// Reactive System Theme Change Listener
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (state.theme === 'system') {
        applyTheme('system');
    }
});

// Ekspos ke global window agar kompatibel dengan modul lain
window.state = state;
window.saveState = saveState;
window.loadState = loadState;
window.syncFromDatabase = syncFromDatabase;
window.clearState = clearState;
window.applyTheme = applyTheme;

