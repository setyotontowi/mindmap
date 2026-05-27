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
        });
    } else {
        // Restore mindmap dari sesi sebelumnya jika ada
        loadState();
        if (state.mindmapData) {
            updateMindmap(state.mindmapData);
            setTimeout(zoomFit, 100);
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

