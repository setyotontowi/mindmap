/* ==========================================================================
   STATE MANAGEMENT & GLOBAL CONFIG
   ========================================================================== */
const state = {
    language: localStorage.getItem('ai_language') || 'id',
    aiProvider: localStorage.getItem('ai_provider') || 'deepseek',
    aiModel: localStorage.getItem('ai_model') || 'deepseek-chat',
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
    breadcrumbs: [],         // Array {name, id} — path dari root asli ke viewRoot sekarang
    bookmarks: JSON.parse(localStorage.getItem('app_bookmarks') || '[]'),
    library: JSON.parse(localStorage.getItem('app_library') || '[]'),
    collections: JSON.parse(localStorage.getItem('app_collections') || '[]')
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
        await fetchUserLibraryAndBookmarks();
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

function findNodeByName(root, name) {
    if (!root) return null;
    if (root.name === name) return root;
    if (root.children) {
        for (const child of root.children) {
            const found = findNodeByName(child, name);
            if (found) return found;
        }
    }
    return null;
}

function findParentNode(root, targetName) {
    if (!root) return null;
    if (root.children) {
        for (const child of root.children) {
            if (child.name === targetName) return root;
            const parent = findParentNode(child, targetName);
            if (parent) return parent;
        }
    }
    return null;
}

function getViewRoot() {
    return state.viewRoot;
}

function paginateTo(node) {
    if (!node) return;
    state.viewRoot = node;
    node.collapsed = false; // Ensure the node is uncollapsed so its children render in the new view
    
    const path = [];
    const buildPath = (curr, target, currentPath) => {
        if (!curr) return false;
        const newPath = [...currentPath, { name: curr.name, id: curr.id }];
        if (curr.name === target.name) {
            path.push(...newPath);
            return true;
        }
        if (curr.children) {
            for (const child of curr.children) {
                if (buildPath(child, target, newPath)) return true;
            }
        }
        return false;
    };
    buildPath(state.mindmapData, node, []);
    state.breadcrumbs = path;
    
    if (typeof window.renderBreadcrumbs === 'function') {
        window.renderBreadcrumbs();
    }
    if (typeof window.updateMindmap === 'function') {
        window.updateMindmap(state.mindmapData);
    }
    setTimeout(() => {
        if (typeof window.zoomFit === 'function') {
            window.zoomFit();
        }
    }, 100);
    saveState(true);
}

function resetPagination() {
    state.viewRoot = null;
    state.breadcrumbs = [];
    if (typeof window.renderBreadcrumbs === 'function') {
        window.renderBreadcrumbs();
    }
    if (typeof window.updateMindmap === 'function') {
        window.updateMindmap(state.mindmapData);
    }
    setTimeout(() => {
        if (typeof window.zoomFit === 'function') {
            window.zoomFit();
        }
    }, 100);
    saveState(true);
}

function autoAdjustViewRoot(node) {
    if (!node) return;
    if (typeof window.getAncestorNodePath !== 'function') return;
    const path = window.getAncestorNodePath(state.mindmapData, node.name);
    if (path.length > 0) {
        const depth = path.length - 1; // 0-based depth
        if (depth >= 3) {
            const targetFocusNode = path[depth - 1];
            state.viewRoot = targetFocusNode;
            if (state.viewRoot) {
                state.viewRoot.collapsed = false;
            }
            
            const breadcrumbsPath = [];
            const focusIndex = depth - 1;
            for (let i = 0; i <= focusIndex; i++) {
                breadcrumbsPath.push({ name: path[i].name, id: path[i].id });
            }
            state.breadcrumbs = breadcrumbsPath;
        } else {
            state.viewRoot = null;
            state.breadcrumbs = [];
        }
    }
}

function collapseDescendants(node, depth = 0) {
    if (!node) return;
    if (depth > 0) {
        if (node.children && node.children.length > 0) {
            node.collapsed = true;
        }
    }
    if (node.children) {
        node.children.forEach(c => collapseDescendants(c, depth + 1));
    }
}

function expandAndFocusNode(node) {
    if (!node) return;
    node.collapsed = false;
    if (typeof window.getAncestorNodePath === 'function') {
        const path = window.getAncestorNodePath(state.mindmapData, node.name);
        path.forEach(n => {
            n.collapsed = false;
        });
    }
    autoAdjustViewRoot(node);
    saveState(true);
}

window.findNodeByName = findNodeByName;
window.findParentNode = findParentNode;
window.getViewRoot = getViewRoot;
window.paginateTo = paginateTo;
window.resetPagination = resetPagination;
window.autoAdjustViewRoot = autoAdjustViewRoot;
window.collapseDescendants = collapseDescendants;
window.expandAndFocusNode = expandAndFocusNode;


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

/* ==========================================================================
   PHASE 10 & 11: LIBRARY & BOOKMARKS SYNC & MUTATIONS
   ========================================================================== */

async function toggleBookmarkState(mindmapId, nodeName, isRemove = false) {
    if (!mindmapId || !nodeName) return;
    
    // Optimistic UI update
    if (isRemove) {
        state.bookmarks = state.bookmarks.filter(b => !(b.mindmap_id === mindmapId && b.node_name === nodeName));
    } else {
        const exists = state.bookmarks.some(b => b.mindmap_id === mindmapId && b.node_name === nodeName);
        if (!exists) {
            state.bookmarks.push({
                mindmap_id: mindmapId,
                node_name: nodeName,
                mindmap_name: state.mindmapData ? state.mindmapData.name : 'Untitled',
                explanation: state.nodeCache[nodeName]?.explanation || '',
                created_at: new Date().toISOString()
            });
        }
    }
    localStorage.setItem('app_bookmarks', JSON.stringify(state.bookmarks));
    
    // Refresh UI immediately
    if (typeof window.renderBookmarksList === 'function') {
        window.renderBookmarksList();
    }
    
    try {
        await fetch('/api/bookmarks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                mindmap_id: mindmapId,
                node_name: nodeName,
                action: isRemove ? 'remove' : 'add'
            })
        });
    } catch (e) {
        console.warn('Gagal sinkronisasi bookmark ke database:', e);
    }
}

async function toggleLibraryState(mindmapId, category = 'Buku', isRemove = false) {
    if (!mindmapId) return;
    
    // For backward compatibility, map category string to collection ID if found, otherwise create it.
    let col = state.collections.find(c => c.name === category);
    if (!col && !isRemove) {
        col = await createCollection(category);
    }
    
    if (col) {
        await toggleCollectionMindmap(col.id, mindmapId, isRemove ? 'remove' : 'add');
    }
}

async function fetchUserLibraryAndBookmarks() {
    await fetchUserCollections();
}

// --- PHASE 12: DYNAMIC COLLECTIONS STATE ACTIONS ---

async function fetchUserCollections() {
    try {
        const res = await fetch('/api/collections');
        if (res.ok) {
            const dbCollections = await res.json();
            if (dbCollections) {
                state.collections = dbCollections;
                localStorage.setItem('app_collections', JSON.stringify(state.collections));
                
                // Populating state.library backward compatible array
                state.library = state.collections.flatMap(col => 
                    col.mindmaps.map(mm => ({ ...mm, category: col.name }))
                );
                localStorage.setItem('app_library', JSON.stringify(state.library));
            }
        }
    } catch (e) {
        console.warn('Gagal fetch data collections dari DB:', e);
    }
    
    // Bookmark fetch
    try {
        const bmkRes = await fetch('/api/bookmarks');
        if (bmkRes.ok) {
            const dbBookmarks = await bmkRes.json();
            if (dbBookmarks) {
                state.bookmarks = dbBookmarks;
                localStorage.setItem('app_bookmarks', JSON.stringify(state.bookmarks));
            }
        }
    } catch (e) {
        console.warn('Gagal fetch data bookmarks dari DB:', e);
    }
    
    if (typeof window.renderLibraryGrid === 'function') {
        window.renderLibraryGrid();
    }
    if (typeof window.renderBookmarksList === 'function') {
        window.renderBookmarksList();
    }
}

async function createCollection(name) {
    if (!name) return null;
    try {
        const res = await fetch('/api/collections', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });
        if (res.ok) {
            const data = await res.json();
            await fetchUserCollections();
            return data.collection;
        }
    } catch (e) {
        console.warn('Gagal membuat koleksi:', e);
    }
    return null;
}

async function renameCollection(id, name) {
    if (!id || !name) return false;
    try {
        const res = await fetch(`/api/collections/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });
        if (res.ok) {
            await fetchUserCollections();
            return true;
        }
    } catch (e) {
        console.warn('Gagal mengedit koleksi:', e);
    }
    return false;
}

async function deleteCollection(id) {
    if (!id) return false;
    try {
        const res = await fetch(`/api/collections/${id}`, {
            method: 'DELETE'
        });
        if (res.ok) {
            await fetchUserCollections();
            return true;
        }
    } catch (e) {
        console.warn('Gagal menghapus koleksi:', e);
    }
    return false;
}

async function toggleCollectionMindmap(collectionId, mindmapId, action = 'add') {
    if (!collectionId || !mindmapId) return false;
    try {
        const res = await fetch('/api/collections/mindmaps', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ collection_id: collectionId, mindmap_id: mindmapId, action })
        });
        if (res.ok) {
            await fetchUserCollections();
            return true;
        }
    } catch (e) {
        console.warn('Gagal mengubah mindmap di koleksi:', e);
    }
    return false;
}

window.toggleBookmarkState = toggleBookmarkState;
window.toggleLibraryState = toggleLibraryState;
window.fetchUserLibraryAndBookmarks = fetchUserLibraryAndBookmarks;
window.fetchUserCollections = fetchUserCollections;
window.createCollection = createCollection;
window.renameCollection = renameCollection;
window.deleteCollection = deleteCollection;
window.toggleCollectionMindmap = toggleCollectionMindmap;
