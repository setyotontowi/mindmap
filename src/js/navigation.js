/* ==========================================================================
   URL-BASED NODE NAVIGATION (History API)
   ==========================================================================
   Format URL: ?id=mm_xxx&node=node-uuid&s=human-readable-slug
   
   - node (UUID): primary identifier, stabil buat navigasi & share
   - s (slug): cosmetic aja biar URL-nya kebaca manusia
   - Klik/paginate node → pushState dengan UUID + slug
   - Browser back/forward → popstate → restore view via UUID
   - Pada HP, back button otomatis balik ke node sebelumnya
   ========================================================================== */

/* -------------------------------------------------------------------------
   Utility: slugify — ubah nama node jadi URL-safe
   ------------------------------------------------------------------------- */
function slugify(text) {
    if (!text) return '';
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')   // hapus karakter non-alfanumerik kecuali spasi & strip
        .replace(/[\s_]+/g, '-')     // spasi & underscore jadi strip
        .replace(/-+/g, '-')         // collapse multiple strip
        .replace(/^-+|-+$/g, '');    // trim strip di ujung
}

/* -------------------------------------------------------------------------
   Utility: cari node dalam tree berdasarkan UUID
   ------------------------------------------------------------------------- */
function findNodeByUUID(root, uuid) {
    if (!root || !uuid) return null;
    if (root.uuid === uuid) return root;
    if (root.children) {
        for (const child of root.children) {
            const found = findNodeByUUID(child, uuid);
            if (found) return found;
        }
    }
    return null;
}

/* -------------------------------------------------------------------------
   Utility: dapatkan full path (array) dari root ke node tertentu
   ------------------------------------------------------------------------- */
function getPathToNode(root, uuid, path = []) {
    if (!root) return null;
    const newPath = [...path, root];
    if (root.uuid === uuid) return newPath;
    if (root.children) {
        for (const child of root.children) {
            const result = getPathToNode(child, uuid, newPath);
            if (result) return result;
        }
    }
    return null;
}

/* -------------------------------------------------------------------------
   Push state ke browser history
   ------------------------------------------------------------------------- */
function pushNodeState(node) {
    try {
        const url = new URL(window.location);
        url.searchParams.set('id', state.currentMindmapId);
        if (node && node.uuid) {
            url.searchParams.set('node', node.uuid);
            url.searchParams.set('s', slugify(node.name));
        } else {
            url.searchParams.delete('node');
            url.searchParams.delete('s');
        }
        history.pushState({ nodeUUID: node ? node.uuid : null }, '', url.toString());
    } catch (e) {
        console.warn('[Nav] Gagal push state:', e);
    }
}

/* -------------------------------------------------------------------------
   Replace state (tanpa nambah history entry — untuk initial load)
   ------------------------------------------------------------------------- */
function replaceNodeState(node) {
    try {
        const url = new URL(window.location);
        url.searchParams.set('id', state.currentMindmapId);
        if (node && node.uuid) {
            url.searchParams.set('node', node.uuid);
            url.searchParams.set('s', slugify(node.name));
        } else {
            url.searchParams.delete('node');
            url.searchParams.delete('s');
        }
        history.replaceState({ nodeUUID: node ? node.uuid : null }, '', url.toString());
    } catch (e) {
        console.warn('[Nav] Gagal replace state:', e);
    }
}

/* -------------------------------------------------------------------------
   Popstate handler — browser back/forward
   ------------------------------------------------------------------------- */
function handlePopState(event) {
    const nodeUUID = event.state ? event.state.nodeUUID : null;
    
    if (nodeUUID && state.mindmapData) {
        // Cari node berdasarkan UUID
        const node = findNodeByUUID(state.mindmapData, nodeUUID);
        if (node) {
            // Restore view ke node tersebut
            if (typeof window.paginateTo === 'function') {
                window.paginateTo(node);
            }
            return;
        }
    }
    
    // Fallback: ga ada node di state atau node ga ketemu → balik ke root
    if (typeof window.resetPagination === 'function') {
        window.resetPagination();
    }
}

/* -------------------------------------------------------------------------
   Navigasi ke node dari URL parameter saat initial load
   ------------------------------------------------------------------------- */
function navigateToNodeFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const nodeUUID = urlParams.get('node');
    
    if (!nodeUUID || !state.mindmapData) return;
    
    const node = findNodeByUUID(state.mindmapData, nodeUUID);
    if (node) {
        // Tunggu render selesai dulu baru paginate
        setTimeout(() => {
            if (typeof window.paginateTo === 'function') {
                window.paginateTo(node);
            }
            // Trigger click buka drawer juga
            if (typeof window.handleNodeClick === 'function') {
                // Cari d3Node dari node data
                try {
                    const rootNode = d3.hierarchy(state.mindmapData, d => d.children);
                    const found = rootNode.descendants().find(d => d.data.uuid === nodeUUID);
                    if (found) {
                        window.handleNodeClick(found);
                    }
                } catch (e) {
                    console.warn('[Nav] Gagal trigger click:', e);
                }
            }
            setTimeout(zoomFit, 200);
        }, 300);
    }
}

/* -------------------------------------------------------------------------
   Init — pasang listener popstate
   ------------------------------------------------------------------------- */
function initNavigation() {
    window.addEventListener('popstate', handlePopState);
    
    // Tunggu state.mindmapData siap, lalu cek URL param
    const checkInterval = setInterval(() => {
        if (state && state.mindmapData) {
            clearInterval(checkInterval);
            navigateToNodeFromURL();
        }
    }, 200);
    
    // Safety: stop checking after 10s
    setTimeout(() => clearInterval(checkInterval), 10000);
}

/* -------------------------------------------------------------------------
   Ekspos ke global
   ------------------------------------------------------------------------- */
window.findNodeByUUID = findNodeByUUID;
window.getPathToNode = getPathToNode;
window.slugify = slugify;
window.pushNodeState = pushNodeState;
window.replaceNodeState = replaceNodeState;
window.initNavigation = initNavigation;
