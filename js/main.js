/* ==========================================================================
   INITIALIZATION & SETUP (ENTRY POINT)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    // Jalankan inisialisasi ikon
    if (window.lucide) {
        window.lucide.createIcons();
    }

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
        
        // Welcome message
        const welcomeText = state.language === 'en'
            ? `Welcome back! Mindmap **${state.mindmapData.name}** has been restored from your last session. Let's continue learning! 📚`
            : `Selamat datang kembali! Mindmap **${state.mindmapData.name}** telah dipulihkan dari sesi terakhirmu. Lanjutkan belajar! 📚`;
        appendChatMessage('bot', welcomeText);
    }
});
