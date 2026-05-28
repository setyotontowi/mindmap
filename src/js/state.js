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
    isOwner: true,
    viewRoot: null,          // Root node untuk halaman pagination saat ini (null = root asli)
    breadcrumbs: []          // Array {name, id} — path dari root asli ke viewRoot sekarang
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
        localStorage.setItem('pagination_viewRoot', state.viewRoot ? state.viewRoot.name : null);
        localStorage.setItem('pagination_breadcrumbs', JSON.stringify(state.breadcrumbs));
        
        if (!skipDBSync && state.mindmapData) {
            showSyncStatus('Menyimpan...');
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
                showSyncStatus('Tersimpan');
            } else {
                throw new Error('Server error');
            }
        }
    } catch (e) {
        console.warn('Gagal menyimpan state:', e);
        showSyncStatus('Gagal Sinkron');
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
        
        // Restore pagination state
        const savedBreadcrumbs = localStorage.getItem('pagination_breadcrumbs');
        if (savedBreadcrumbs) {
            try {
                state.breadcrumbs = JSON.parse(savedBreadcrumbs);
            } catch (e) {
                state.breadcrumbs = [];
            }
        }
        const savedViewRootName = localStorage.getItem('pagination_viewRoot');
        if (savedViewRootName && savedViewRootName !== 'null' && state.mindmapData) {
            state.viewRoot = findNodeByName(state.mindmapData, savedViewRootName);
        }
    } catch (e) {
        console.warn('Gagal memuat state dari localStorage:', e);
    }
    // Sinkronisasi data secara asinkron dari PostgreSQL database
    syncFromDatabase();
}

async function syncFromDatabase(id = state.currentMindmapId) {
    try {
        showSyncStatus('Sinkronisasi...');
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
                showSyncStatus('Tersinkronisasi');
            } else {
                showSyncStatus('Mode Lihat Saja');
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
                showSyncStatus('Migrasi ke DB...');
                await saveState(false);
            } else {
                showSyncStatus('DB Kosong');
            }
        }
        // Muat daftar riwayat
        await loadHistoryList();
    } catch (error) {
        console.warn('Gagal sinkron dari database PostgreSQL:', error);
        if (state.isOwner) {
            showSyncStatus('Offline (Lokal)');
        } else {
            showSyncStatus('Offline (View Only)');
        }
    }
}

async function clearState() {
    state.mindmapData = null;
    state.nodeCache = {};
    state.nodeStatuses = {};
    state.activeNode = null;
    state.viewRoot = null;
    state.breadcrumbs = [];
    localStorage.removeItem('mindmap_data');
    localStorage.removeItem('node_cache');
    localStorage.removeItem('node_statuses');
    localStorage.removeItem('pagination_viewRoot');
    localStorage.removeItem('pagination_breadcrumbs');
    
    showSyncStatus('Menghapus...');
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
        showSyncStatus('Dibersihkan');
    } catch (e) {
        console.warn('Gagal menghapus data di database:', e);
        showSyncStatus('Gagal Hapus DB');
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

/* ==========================================================================
   PHASE 1: PAGINATION — State & Data Layer
   ========================================================================== */

/**
 * Cari node di pohon berdasarkan nama (depth-first search).
 * @param {Object} node - Node tree yg mau dicari
 * @param {string} name - Nama node yg dicari
 * @returns {Object|null} Node yg ditemukan, atau null
 */
function findNodeByName(node, name) {
    if (!node || !name) return null;
    if (node.name === name) return node;
    if (node.children && Array.isArray(node.children)) {
        for (let i = 0; i < node.children.length; i++) {
            const found = findNodeByName(node.children[i], name);
            if (found) return found;
        }
    }
    return null;
}

/**
 * Return node yg jadi viewRoot saat ini.
 * @returns {Object|null}
 */
function getViewRoot() {
    return state.viewRoot;
}

/**
 * Hitung depth node relatif terhadap viewRoot.
 * Kalau viewRoot = null, return depth absolut.
 * Kalau viewRoot bukan ancestor node tsb, return depth absolut.
 * @param {Object} d3Node - D3 hierarchy node
 * @returns {number} Depth relatif (0 = viewRoot itu sendiri)
 */
function getRelativeDepth(d3Node) {
    if (!state.viewRoot || !d3Node) {
        return d3Node ? d3Node.depth : 0;
    }
    // Cari viewRoot di ancestor chain
    let current = d3Node;
    while (current) {
        if (current.data === state.viewRoot || current.data.name === state.viewRoot.name) {
            return d3Node.depth - current.depth;
        }
        current = current.parent;
    }
    // viewRoot bukan ancestor node ini
    return d3Node.depth;
}

/**
 * Pindah ke halaman node baru.
 * ViewRoot diganti ke node ini, dan viewRoot sebelumnya jadi breadcrumb.
 * @param {Object} node - D3 hierarchy node (.data) atau raw data node
 */
function paginateTo(node) {
    const nodeData = node.data || node;
    if (!nodeData || !nodeData.name) return;

    // Catat viewRoot saat ini sebagai breadcrumb
    if (state.viewRoot) {
        state.breadcrumbs.push({
            name: state.viewRoot.name,
            id: state.viewRoot.name
        });
    } else if (state.mindmapData) {
        // Pertama kali paginate — catat root asli
        state.breadcrumbs.push({
            name: state.mindmapData.name,
            id: state.currentMindmapId || state.mindmapData.name
        });
    }

    state.viewRoot = nodeData;
    saveState(true); // Skip DB sync — pagination murni UI
}

/**
 * Balik ke halaman sebelumnya (pop breadcrumb terakhir).
 * Kalau breadcrumbs habis, viewRoot = null (kembali ke root asli).
 */
function paginateBack() {
    if (state.breadcrumbs.length === 0) {
        state.viewRoot = null;
        saveState(true);
        return;
    }

    const prev = state.breadcrumbs.pop();

    // Kembali ke root asli
    if (!state.mindmapData || prev.name === state.mindmapData.name) {
        state.viewRoot = null;
    } else {
        // Cari node dari breadcrumb di pohon
        state.viewRoot = findNodeByName(state.mindmapData, prev.name);
    }

    saveState(true);
}

/**
 * Reset pagination — kembali ke root asli, kosongkan breadcrumbs.
 */
function resetPagination() {
    state.viewRoot = null;
    state.breadcrumbs = [];
    saveState(true);
}

// Ekspos ke global
window.getViewRoot = getViewRoot;
window.getRelativeDepth = getRelativeDepth;
window.paginateTo = paginateTo;
window.paginateBack = paginateBack;
window.resetPagination = resetPagination;

/* ==========================================================================
   PHASE 3: HELPER GRANULAR NODE SYNC
   ========================================================================== */
async function syncNodeStatus(mindmapId, nodeName, status) {
    if (!mindmapId || !nodeName) return;
    const nodeId = encodeURIComponent(`${mindmapId}::${nodeName}`);
    try {
        await fetch(`/api/node/${nodeId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
    } catch (e) {
        console.warn('[Node] Gagal sync status granular:', e);
    }
}

async function saveNodeExplanation(mindmapId, nodeName, explanation) {
    if (!mindmapId || !nodeName) return;
    const nodeId = encodeURIComponent(`${mindmapId}::${nodeName}`);
    try {
        await fetch(`/api/node/${nodeId}/explanation`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ explanation })
        });
    } catch (e) {
        console.warn('[Node] Gagal simpan explanation granular:', e);
    }
}

async function fetchNodeExplanation(mindmapId, nodeName) {
    if (!mindmapId || !nodeName) return null;
    const nodeId = encodeURIComponent(`${mindmapId}::${nodeName}`);
    try {
        const res = await fetch(`/api/node/${nodeId}/explanation`);
        if (!res.ok) return null;
        const data = await res.json();
        return data.explanation || null;
    } catch (e) {
        console.warn('[Node] Gagal fetch explanation granular:', e);
        return null;
    }
}

window.syncNodeStatus = syncNodeStatus;
window.saveNodeExplanation = saveNodeExplanation;
window.fetchNodeExplanation = fetchNodeExplanation;
