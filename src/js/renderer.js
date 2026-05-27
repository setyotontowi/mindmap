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
    if (!container) return;
    
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

    // Setup window resize listener to dynamically recalculate layout bounds
    if (!window.hasMindmapResizeListener) {
        window.addEventListener('resize', () => {
            if (state.mindmapData && typeof zoomFit === 'function') {
                zoomFit();
            }
        });
        window.hasMindmapResizeListener = true;
    }

    // Tree Layout Generator (Horizontal)
    treeLayout = d3.tree()
        .nodeSize([95, 270]) // Jarak dasar vertikal 95px, horizontal 270px
        .separation((a, b) => {
            // Jika mereka memiliki induk (parent) yang sama
            if (a.parent === b.parent) {
                return 1.2; // Jarak vertikal 1.2 * 95px = 114px
            }
            // Jika berbeda induk (cabang bersebelahan), beri jarak yang lapang
            // untuk mencegah tabrakan ketika salah satu cabang memiliki anak yang banyak
            return 2.5; // Jarak vertikal 2.5 * 95px = 237.5px
        });
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
    const hintText = document.getElementById('mindmap-hint-text');
    if (hintText) hintText.classList.add('hidden');

    // Konversi hierarchical data ke d3 hierarchy (sembunyikan anak jika di-collapse)
    rootNodeData = d3.hierarchy(sourceData, d => d.collapsed ? null : d.children);

    // Hitung posisi pohon
    treeLayout(rootNodeData);

    // 1. Hitung lebar maksimum node untuk setiap tingkat kedalaman (depth)
    const maxWidthsAtDepth = {};
    rootNodeData.descendants().forEach(d => {
        const w = getNodeWidth(d.data);
        if (!maxWidthsAtDepth[d.depth] || w > maxWidthsAtDepth[d.depth]) {
            maxWidthsAtDepth[d.depth] = w;
        }
    });

    // 2. Tentukan koordinat y (horizontal) secara kumulatif berdasarkan lebar maksimum level sebelumnya
    const levelPositions = { 0: 0 };
    rootNodeData.eachBefore(d => {
        if (d.depth === 0) {
            d.y = 0;
        } else {
            if (levelPositions[d.depth] === undefined) {
                const prevLevel = d.depth - 1;
                const prevMaxWidth = maxWidthsAtDepth[prevLevel] || 180;
                levelPositions[d.depth] = levelPositions[prevLevel] + prevMaxWidth + 75; // 75px adalah gap horizontal dinamis yang lapang
            }
            d.y = levelPositions[d.depth];
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

// Fungsi helper untuk melipat node yang tidak bersinggungan
function collapseNonIntersectingNodes(rawNode, activePathIds) {
    if (!rawNode) return;
    const isAncestor = activePathIds.has(rawNode.id) || activePathIds.has(rawNode.name);
    if (!isAncestor) {
        if (rawNode.children && rawNode.children.length > 0) {
            rawNode.collapsed = true;
        }
    } else {
        rawNode.collapsed = false;
    }
    if (rawNode.children) {
        rawNode.children.forEach(child => collapseNonIntersectingNodes(child, activePathIds));
    }
}

// Handler klik node untuk Deep Dive & Rabbit Hole
async function handleNodeClick(d3Node) {
    const nodeName = d3Node.data.name;
    const nodeDesc = d3Node.data.description || '';

    // Jika kedalaman melebihi 3, fold semua node yang tidak bersinggungan
    if (d3Node.depth > 3) {
        const activePathIds = new Set();
        let current = d3Node;
        while (current) {
            if (current.data.id) activePathIds.add(current.data.id);
            if (current.data.name) activePathIds.add(current.data.name);
            current = current.parent;
        }
        collapseNonIntersectingNodes(state.mindmapData, activePathIds);
        saveState();
    }

    // Batasi kedalaman maksimal 5 level untuk eksplorasi baru
    if (d3Node.depth >= 5 && !state.nodeCache[nodeName]) {
        const warningMsg = state.language === 'en'
            ? 'Maximum depth of 5 levels reached. You cannot explore deeper than this.'
            : 'Batas maksimal kedalaman 5 level tercapai. Anda tidak dapat menjelajah lebih dalam dari ini.';
        alert(warningMsg);
        return;
    }

    // Jika data sudah tercache (pernah di-deep dive sebelumnya)
    if (state.nodeCache[nodeName]) {
        state.activeNode = d3Node.data;
        updateMindmap(state.mindmapData);
        openDetailDrawer(nodeName);
        renderNodeDetail(nodeName, state.nodeCache[nodeName].explanation);
        return;
    }

    if (!state.isOwner) {
        alert(state.language === 'en'
            ? 'This topic is locked. You can only read topics that have been opened by the owner.'
            : 'Topik ini belum terbuka. Anda hanya bisa membaca topik yang sudah dibuka oleh pemilik mindmap.');
        return;
    }

    // Jika data sedang diload (sedang disusun di latar belakang)
    if (d3Node.data.loading) {
        state.activeNode = d3Node.data;
        updateMindmap(state.mindmapData);
        openDetailDrawer(nodeName);
        renderDrawerLoading(nodeName);
        return;
    }

    const drawer = document.getElementById('detail-drawer');
    const isDrawerOpen = drawer && drawer.classList.contains('open');
    const isReadingAnotherNode = isDrawerOpen && state.activeNode && (state.activeNode.name !== nodeName);

    if (isReadingAnotherNode) {
        // HANYA update status loading pada node di mindmap tanpa mengubah activeNode atau membuka drawer
        d3Node.data.loading = true;
        updateMindmap(state.mindmapData);
    } else {
        // Biasa: buka drawer & tampilkan loading di drawer
        state.activeNode = d3Node.data;
        updateMindmap(state.mindmapData);
        openDetailDrawer(nodeName);
        renderDrawerLoading(nodeName);
        d3Node.data.loading = true;
        updateMindmap(state.mindmapData);
    }

    // Tulis pesan robot di chat
    const exploringMsg = isReadingAnotherNode
        ? (state.language === 'en'
            ? `Opening the rabbit hole portal for **${nodeName}** in the background... I am digging up the explanation for you.`
            : `Membuka portal rabbit hole untuk **${nodeName}** di latar belakang... Aku sedang menggali penjelasannya untukmu.`)
        : (state.language === 'en'
            ? `Opening the rabbit hole portal for **${nodeName}**... I am digging up the explanation for you.`
            : `Membuka portal rabbit hole untuk **${nodeName}**... Aku sedang menggali penjelasannya untukmu.`);
    appendChatMessage('bot', exploringMsg);

    try {
        const rootTopicName = state.mindmapData.name;

        // Cari gaya penulisan terpilih atau warisi dari parent/ancestor
        let selectedStyle = 'auto';
        let selectedSubStyle = 'auto';
        let current = d3Node;
        while (current) {
            if (current.data && current.data.writingStyle && current.data.writingStyle !== 'auto') {
                selectedStyle = current.data.writingStyle;
                selectedSubStyle = current.data.writingSubStyle || 'auto';
                break;
            }
            current = current.parent;
        }

        // Resolusi auto menjadi style acak dari system
        if (selectedStyle === 'auto' && typeof getRandomStyleAndSubstyle === 'function') {
            const randomChoice = getRandomStyleAndSubstyle();
            selectedStyle = randomChoice.style;
            selectedSubStyle = randomChoice.substyle;
        }

        // Simpan gaya penulisan yang diwarisi/terpilih ini ke data node saat ini agar konsisten
        d3Node.data.writingStyle = selectedStyle;
        d3Node.data.writingSubStyle = selectedSubStyle;

        const styleInstruction = (typeof getWritingStyleInstruction === 'function')
            ? getWritingStyleInstruction(selectedStyle, selectedSubStyle)
            : '';

        const prompt = state.language === 'en' ? `You are an expert tutor. The user is currently learning the main topic "${rootTopicName}" and wants to deep-dive into the subtopic "${nodeName}" (Description: "${nodeDesc}").
        
        Your tasks are:
        1. Create an in-depth explanation/material in English using rich Markdown format (use small h3 headings, lists, and blockquotes. If there are sub-lists, use 2 or 4 spaces indentation). WRITING STYLE STYLE: ${styleInstruction}. Open with an engaging introductory story or hook if relevant (do not force it). Keep it concise, high-density, and limited to about 800-1000 words to prevent truncation.
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
        1. Buat penjelasan materi yang mendalam dalam Bahasa Indonesia menggunakan format Markdown yang kaya (gunakan judul h3 kecil, list, dan blockquote yang menarik). GAYA PENULISAN: ${styleInstruction}. Buka dengan cerita pengantar atau narasi pembuka yang menarik jika relevan (jangan dipaksakan jika tidak cocok). Tulis penjelasan secara padat, kaya informasi, dan batasi panjang penjelasan maksimal sekitar 800-1000 kata agar tidak terpotong.
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
                subtopics: result.subtopics || [],
                writingStyle: d3Node.data.writingStyle,
                writingSubStyle: d3Node.data.writingSubStyle
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
            }

            // Update visualisasi mindmap & persist (selalu jalankan untuk membersihkan spinner loading)
            updateMindmap(state.mindmapData);
            saveState();

            // Render isi penjelasan ke drawer JIKA user saat ini sedang aktif membuka node ini dan drawer terbuka
            const drawer = document.getElementById('detail-drawer');
            const isDrawerOpen = drawer && drawer.classList.contains('open');
            const isCurrentlyActive = state.activeNode && (state.activeNode.name === nodeName || state.activeNode.id === d3Node.data.id);

            if (isDrawerOpen && isCurrentlyActive) {
                renderNodeDetail(nodeName, result.explanation);
            }

            // Beri tahu di chat
            const msg = isReadingAnotherNode
                ? (state.language === 'en'
                    ? `Explanation for **${nodeName}** is ready in the background! I also added **${result.subtopics?.length || 0} new subtopics** to the mindmap. Click that node to read it when you are ready!`
                    : `Penjelasan materi untuk **${nodeName}** telah siap di latar belakang! Aku juga sudah menambahkan **${result.subtopics?.length || 0} sub-topik baru** di mindmap. Klik node tersebut untuk membacanya kapan saja Anda siap!`)
                : (state.language === 'en'
                    ? `Explanation for **${nodeName}** is ready! I also added **${result.subtopics?.length || 0} new subtopics** to the mindmap. Click those new nodes to dig deeper!`
                    : `Penjelasan materi untuk **${nodeName}** telah siap! Aku juga sudah menambahkan **${result.subtopics?.length || 0} sub-topik baru** di mindmap. Klik node baru tersebut untuk menggali lebih dalam!`);
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

        // Hanya render error ke drawer jika user sedang membuka node ini dan drawer terbuka
        const drawer = document.getElementById('detail-drawer');
        const isDrawerOpen = drawer && drawer.classList.contains('open');
        const isCurrentlyActive = state.activeNode && (state.activeNode.name === nodeName || state.activeNode.id === d3Node.data.id);
        if (isDrawerOpen && isCurrentlyActive) {
            renderDrawerError(nodeName, error.message);
        }
    }
}

// Zoom Controls
function zoomIn() { svg.transition().duration(300).call(zoomBehavior.scaleBy, 1.3); }
function zoomOut() { svg.transition().duration(300).call(zoomBehavior.scaleBy, 0.7); }
function zoomFit() {
    if (!rootNodeData) return;
    
    const container = document.getElementById('mindmap-canvas-container');
    if (!container) return;
    
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

function searchNode(query) {
    if (!rootNodeData) return;
    
    if (!query || query.trim() === '') {
        d3.selectAll('.node-card').style('box-shadow', '').style('border-color', '');
        return;
    }
    
    const term = query.toLowerCase().trim();
    let firstMatch = null;
    
    d3.selectAll('.node').each(function(d) {
        const card = d3.select(this).select('.node-card');
        const nodeName = d.data.name || '';
        const nodeDesc = d.data.description || '';
        
        // Ambil materi penjelasan dari cache jika ada
        const cache = state.nodeCache[nodeName];
        const explanation = cache ? (cache.explanation || '') : '';
        
        // Cari kecocokan di nama, deskripsi, atau penjelasan materi
        const isMatch = nodeName.toLowerCase().includes(term) || 
                        nodeDesc.toLowerCase().includes(term) || 
                        explanation.toLowerCase().includes(term);
        
        if (isMatch) {
            card.style('box-shadow', '0 0 0 4px #0f172a');
            card.style('border-color', '#0f172a');
            if (!firstMatch) {
                firstMatch = d;
            }
        } else {
            card.style('box-shadow', '').style('border-color', '');
        }
    });
    
    if (firstMatch && svg && zoomBehavior) {
        const container = document.getElementById('mindmap-canvas-container');
        if (container) {
            const width = container.clientWidth;
            const height = container.clientHeight;
            const scale = 1.1;
            
            const transform = d3.zoomIdentity
                .translate(width / 2 - firstMatch.y * scale, height / 2 - firstMatch.x * scale)
                .scale(scale);
            
            svg.transition().duration(500).call(zoomBehavior.transform, transform);
        }
    }
}

// Ekspos ke global window agar kompatibel dengan modul lain
window.initD3Canvas = initD3Canvas;
window.updateMindmap = updateMindmap;
window.zoomFit = zoomFit;
window.zoomIn = zoomIn;
window.zoomOut = zoomOut;
window.searchNode = searchNode;
window.handleNodeClick = handleNodeClick;

// Ekspos rootNodeData getter/setter
Object.defineProperty(window, 'rootNodeData', {
    get: () => rootNodeData,
    set: (v) => { rootNodeData = v; },
    configurable: true
});


