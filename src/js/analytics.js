/* ==========================================================================
   PHASE 6: ANALYTICS & COOKIE CONSENT
   Privacy-first analytics tracker for Rabbit Hole Mindmap
   ========================================================================== */

/**
 * Get consent preference from localStorage
 * Returns: { analytics: boolean, essential: true }
 */
function getConsent() {
    try {
        const raw = localStorage.getItem('rabbit_hole_consent');
        if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return null;
}

/**
 * Save consent preference to localStorage
 */
function saveConsent(analytics) {
    const pref = { analytics: !!analytics, essential: true };
    localStorage.setItem('rabbit_hole_consent', JSON.stringify(pref));
    return pref;
}

/**
 * Show cookie consent banner if not yet decided
 */
function initCookieConsent() {
    const consent = getConsent();
    if (consent) return; // Already decided

    const banner = document.getElementById('cookie-consent-banner');
    if (!banner) return;

    // Remove hidden class to show banner with slide-up animation
    banner.classList.remove('hidden');

    // Accept all
    document.getElementById('cookie-accept')?.addEventListener('click', () => {
        saveConsent(true);
        banner.classList.add('hidden');
    });

    // Reject
    document.getElementById('cookie-reject')?.addEventListener('click', () => {
        saveConsent(false);
        banner.classList.add('hidden');
    });
}

/**
 * Set the privacy toggle in settings modal based on current consent
 */
function syncPrivacyToggle() {
    const consent = getConsent();
    const toggle = document.getElementById('privacy-analytics-toggle');
    if (toggle && consent) {
        toggle.checked = consent.analytics;
    }
}

/**
 * Check if analytics tracking is allowed
 */
function isAnalyticsAllowed() {
    const consent = getConsent();
    return consent ? consent.analytics : false;
}

/**
 * Track a node-level event (view, explain, etc.)
 * Only fires if consent is given.
 */
function trackNodeEvent(mindmapId, nodeName, action, durationSeconds, tokensUsed, model) {
    if (!isAnalyticsAllowed()) return;
    if (!mindmapId || !nodeName || !action) return;

    fetch('/api/track/node-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            mindmap_id: mindmapId,
            node_name: nodeName,
            action: action,
            duration_seconds: durationSeconds || 0,
            tokens_used: tokensUsed || 0,
            model: model || null
        })
    }).catch(e => console.warn('[Analytics] trackNodeEvent error:', e));
}

/**
 * Track a session-level event (mindmap_create, quiz_complete, etc.)
 * Only fires if consent is given.
 */
function trackSessionEvent(mindmapId, eventType, metadata) {
    if (!isAnalyticsAllowed()) return;
    if (!mindmapId || !eventType) return;

    fetch('/api/track/session-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            mindmap_id: mindmapId,
            event_type: eventType,
            metadata: metadata || {}
        })
    }).catch(e => console.warn('[Analytics] trackSessionEvent error:', e));
}

/**
 * Fetch user stats for the dashboard
 */
async function fetchUserStats() {
    try {
        const res = await fetch('/api/stats/user');
        if (!res.ok) return null;
        return await res.json();
    } catch (e) {
        console.warn('[Analytics] fetchUserStats error:', e);
        return null;
    }
}

/**
 * Fetch mindmap-specific stats
 */
async function fetchMindmapStats(mindmapId) {
    try {
        const res = await fetch(`/api/stats/mindmap/${encodeURIComponent(mindmapId)}`);
        if (!res.ok) return null;
        return await res.json();
    } catch (e) {
        console.warn('[Analytics] fetchMindmapStats error:', e);
        return null;
    }
}

/* ==========================================================================
   AUTOMATIC TRACKING — hook into existing event flow
   ========================================================================== */

/**
 * Duration tracker for drawer open -> close
 * Usage: startDrawerTimer(nodeName) when drawer opens, stopDrawerTimer() when closes
 */
let _drawerTimer = null;
let _drawerNodeName = null;

function startDrawerTimer(nodeName) {
    _drawerNodeName = nodeName;
    _drawerTimer = Date.now();
}

function stopDrawerTimer() {
    if (!_drawerTimer || !_drawerNodeName) return 0;
    const elapsed = Math.floor((Date.now() - _drawerTimer) / 1000);
    // Skip accidental clicks (< 3 seconds)
    if (elapsed >= 3 && window.state && window.state.mindmapData) {
        trackNodeEvent(window.state.mindmapData.id, _drawerNodeName, 'view', elapsed);
    }
    _drawerTimer = null;
    _drawerNodeName = null;
    return elapsed;
}

/* ==========================================================================
   USER SESSION DURATION TRACKING
   ========================================================================== */

let _sessionStartTime = null;

function initSessionTracker() {
    _sessionStartTime = Date.now();

    // Use pagehide for better mobile support (fires reliably on tab close)
    window.addEventListener('pagehide', () => {
        if (!_sessionStartTime) return;
        const durationSeconds = Math.floor((Date.now() - _sessionStartTime) / 1000);
        // Only track meaningful sessions (> 10 seconds)
        if (durationSeconds < 10) return;

        const consent = getConsent();
        if (!consent || !consent.analytics) return;

        const payload = JSON.stringify({
            mindmap_id: window.state?.mindmapData?.id || null,
            event_type: 'session_duration',
            metadata: { duration_seconds: durationSeconds }
        });

        navigator.sendBeacon('/api/track/session-event', new Blob([payload], { type: 'application/json' }));
    });
}

// Auto-init on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initCookieConsent();
        syncPrivacyToggle();
        initStatsEventListeners();
        initSessionTracker();
    });
} else {
    initCookieConsent();
    syncPrivacyToggle();
    initStatsEventListeners();
    initSessionTracker();
}

/* ==========================================================================
   STATS DASHBOARD RENDERER
   ========================================================================== */

function initStatsEventListeners() {
    const statsBtn = document.getElementById('history-menu-item-stats');
    if (statsBtn) {
        statsBtn.addEventListener('click', () => {
            if (typeof switchSidebarMode === 'function') {
                switchSidebarMode('stats');
            }
            renderStatsDashboard();
        });
    }

    // Also listen for the custom event from ui.js switchSidebarMode
    document.addEventListener('stats-view-opened', renderStatsDashboard);
}

function renderStatsDashboard() {
    const area = document.getElementById('stats-content-area');
    if (!area) return;

    // Show loading
    area.innerHTML = `<div style="font-size: 0.85rem; color: var(--text-3); text-align: center; padding: 3rem 0;">
        <i data-lucide="bar-chart-2" style="width: 48px; height: 48px; color: var(--border-color); margin-bottom: 12px; display: block; margin-left: auto; margin-right: auto;"></i>
        <div>Memuat statistik...</div>
    </div>`;

    fetchUserStats().then(stats => {
        if (!stats) {
            area.innerHTML = `<div style="font-size: 0.85rem; color: var(--text-3); text-align: center; padding: 3rem 0;">
                <i data-lucide="cloud-off" style="width: 48px; height: 48px; color: var(--border-color); margin-bottom: 12px; display: block; margin-left: auto; margin-right: auto;"></i>
                <div>Gagal memuat statistik. Pastikan analytics diizinkan.</div>
            </div>`;
            return;
        }

        if (!stats.authenticated) {
            area.innerHTML = `<div style="font-size: 0.85rem; color: var(--text-3); text-align: center; padding: 3rem 0;">
                <i data-lucide="log-in" style="width: 48px; height: 48px; color: var(--border-color); margin-bottom: 12px; display: block; margin-left: auto; margin-right: auto;"></i>
                <div>Login untuk melihat statistik belajar Anda.</div>
            </div>`;
            return;
        }

        // Format duration
        const hours = Math.floor(stats.total_study_time / 3600);
        const minutes = Math.floor((stats.total_study_time % 3600) / 60);
        const timeStr = hours > 0 ? `${hours}j ${minutes}m` : `${minutes}m`;

        // Format session time
        const sessHours = Math.floor((stats.total_session_seconds || 0) / 3600);
        const sessMinutes = Math.floor(((stats.total_session_seconds || 0) % 3600) / 60);
        const sessionTimeStr = sessHours > 0 ? `${sessHours}j ${sessMinutes}m` : `${sessMinutes}m`;

        area.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-card-icon"><i data-lucide="brain" style="width: 16px; height: 16px;"></i></div>
                    <div class="stat-card-value">${stats.total_mindmaps}</div>
                    <div class="stat-card-label">Mindmap Dibuat</div>
                </div>
                <div class="stat-card">
                    <div class="stat-card-icon"><i data-lucide="eye" style="width: 16px; height: 16px;"></i></div>
                    <div class="stat-card-value">${stats.total_events}</div>
                    <div class="stat-card-label">Node Dijelajahi</div>
                </div>
                <div class="stat-card">
                    <div class="stat-card-icon"><i data-lucide="clock" style="width: 16px; height: 16px;"></i></div>
                    <div class="stat-card-value">${timeStr}</div>
                    <div class="stat-card-label">Waktu Baca Node</div>
                </div>
                <div class="stat-card">
                    <div class="stat-card-icon"><i data-lucide="activity" style="width: 16px; height: 16px;"></i></div>
                    <div class="stat-card-value">${sessionTimeStr}</div>
                    <div class="stat-card-label">Total Sesi Online</div>
                </div>
                <div class="stat-card">
                    <div class="stat-card-icon"><i data-lucide="zap" style="width: 16px; height: 16px;"></i></div>
                    <div class="stat-card-value">${stats.total_tokens.toLocaleString()}</div>
                    <div class="stat-card-label">Token AI</div>
                </div>
                <div class="stat-card">
                    <div class="stat-card-icon"><i data-lucide="calendar" style="width: 16px; height: 16px;"></i></div>
                    <div class="stat-card-value">${stats.active_days}</div>
                    <div class="stat-card-label">Hari Aktif</div>
                </div>
                <div class="stat-card">
                    <div class="stat-card-icon"><i data-lucide="help-circle" style="width: 16px; height: 16px;"></i></div>
                    <div class="stat-card-value">${stats.total_quizzes}</div>
                    <div class="stat-card-label">Quiz Dikerjakan</div>
                </div>
                <div class="stat-card">
                    <div class="stat-card-icon"><i data-lucide="layers" style="width: 16px; height: 16px;"></i></div>
                    <div class="stat-card-value">${stats.total_sessions || 0}</div>
                    <div class="stat-card-label">Total Kunjungan</div>
                </div>
            </div>
        `;

        // Re-initialize lucide icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
    });
}
