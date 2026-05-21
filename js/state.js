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

/* ==========================================================================
   PERSISTENCE — Save & Restore from localStorage & SQLite
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
                if (typeof initD3Canvas === 'function') {
                    initD3Canvas();
                }
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
