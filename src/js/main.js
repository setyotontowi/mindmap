/* ==========================================================================
   INITIALIZATION & SETUP (ENTRY POINT)
   ========================================================================== */
function initApp() {
    // Inisialisasi tema
    if (typeof applyTheme === 'function') {
        applyTheme(state.theme);
    }

    // Jalankan inisialisasi ikon
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Set sapaan dinamis acak setiap reload
    setRandomGreeting();

    // Inisialisasi efek mouse hover glow spotlight
    initHoverGlowEffect();

    // Setup Event Listeners
    initUIEventListeners();
    
    // Inisialisasi Canvas D3
    initD3Canvas();

    // Periksa status login sebelum loadState
    if (typeof checkAuthStatus === 'function') {
        checkAuthStatus().then(() => {
            // Restore mindmap dari sesi sebelumnya jika ada
            loadState();
            if (state.mindmapData) {
                updateMindmap(state.mindmapData);
                setTimeout(zoomFit, 100);
                    
                // Welcome message
                const welcomeText = state.language === 'en'
                    ? `Welcome back! Mindmap **${state.mindmapData.name}** has been restored from your last session. Let's continue learning! 📚`
                    : `Selamat datang kembali! Mindmap **${state.mindmapData.name}** telah dipulihkan dari sesi terakhirmu. Lanjutkan belajar! 📚`;
                appendChatMessage('bot', welcomeText);
            }
                
            // Inisialisasi URL-based navigation
            if (typeof initNavigation === 'function') {
                initNavigation();
            }
        });
    } else {
        // Restore mindmap dari sesi sebelumnya jika ada
        loadState();
        if (state.mindmapData) {
            updateMindmap(state.mindmapData);
            setTimeout(zoomFit, 100);
        }
        
        // Inisialisasi URL-based navigation
        if (typeof initNavigation === 'function') {
            initNavigation();
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

/**
 * Mengatur sapaan sambutan dan placeholder acak di halaman utama setiap kali dimuat/direload
 */
function setRandomGreeting() {
    const greetings = [
        {
            subtitle: "Apa yang ingin kamu pelajari hari ini?",
            placeholder: "Ketik topik atau skill di sini..."
        },
        {
            subtitle: "Topik apa yang ingin kamu gali secara visual?",
            placeholder: "Contoh: Mekanika Kuantum, Blockchain..."
        },
        {
            subtitle: "Yuk, masuk ke rabbit hole topik belajarmu.",
            placeholder: "Ketik topik yang ingin kamu kuasai..."
        },
        {
            subtitle: "Siap membuat mindmap interaktif hari ini?",
            placeholder: "Ketik apa saja yang membuatmu penasaran..."
        },
        {
            subtitle: "Mari buat mindmap topik belajarmu dengan AI.",
            placeholder: "Ketik subjek belajarmu di sini..."
        }
    ];

    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    
    const subtitleEl = document.querySelector('.home-subtitle');
    if (subtitleEl) {
        subtitleEl.textContent = randomGreeting.subtitle;
    }
    
    const inputEl = document.getElementById('chat-input');
    if (inputEl) {
        inputEl.placeholder = randomGreeting.placeholder;
    }
}

/**
 * Menginisialisasi efek sorotan glow (spotlight) interaktif yang mengikuti gerakan kursor mouse
 */
function initHoverGlowEffect() {
    const selector = '.home-search-btn, .btn-sidebar-new-research, .control-btn, .status-btn, .history-menu-item, .nav-tab, .suggested-pill-dashboard, .node-card';
    
    document.addEventListener('mousemove', (e) => {
        const target = e.target.closest(selector);
        if (!target) return;
        
        const rect = target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        target.style.setProperty('--mouse-x', `${x}px`);
        target.style.setProperty('--mouse-y', `${y}px`);
    });
}

