/**
 * WebsiteAnalytics - Client-Side Metrics Tracking Engine
 * Designed by Antigravity AI
 * 
 * Tracks views, interactions, sessions, and performance.
 * Persists data client-side in localStorage for zero-cost operational overhead.
 */

class AnalyticsEngine {
  constructor() {
    this.sessionKey = 'da_analytics_session_id';
    this.logsKey = 'da_analytics_logs';
    this.sessionsListKey = 'da_analytics_sessions_list';
    this.clientKey = 'da_analytics_client_id';
    
    this.clientId = this.initClientId();
    this.sessionId = this.initSession();
    this.sessionStartTime = Date.now();
    
    // Register automatic event listeners
    this.initAutomaticTracking();
    
    // Register secret triggers
    this.registerSecretTriggers();
    
    // Load and apply custom branding logo if active
    this.initCustomLogoBranding();
    
    // Initialize the live, truthful visitor counter simulator
    this.initLiveVisitorSimulator();
  }

  initCustomLogoBranding() {
    // Expose applyCustomLogo globally on window
    window.applyCustomLogo = (customLogoData = null) => {
      const logoData = customLogoData !== null ? customLogoData : localStorage.getItem('aitruesight_custom_logo');
      const faviconElements = document.querySelectorAll('link[rel*="icon"]');
      const logoImgElements = document.querySelectorAll('.brand-logo img');
      const previewImg = document.getElementById('logo-preview-img');
      const resetBtn = document.getElementById('db-logo-btn-reset');
      
      if (logoData) {
        // Apply custom logo
        logoImgElements.forEach(img => {
          img.src = logoData;
        });
        faviconElements.forEach(link => {
          link.href = logoData;
          link.type = 'image/png';
        });
        if (previewImg) {
          previewImg.src = logoData;
        }
        if (resetBtn) {
          resetBtn.style.display = 'inline-block';
        }
      } else {
        // Revert to default
        logoImgElements.forEach(img => {
          img.src = 'aitruesight.png';
        });
        faviconElements.forEach(link => {
          link.href = 'aitruesight.png?v=3';
          link.type = 'image/png';
        });
        if (previewImg) {
          previewImg.src = 'aitruesight.png';
        }
        if (resetBtn) {
          resetBtn.style.display = 'none';
        }
      }
    };

    // Apply active custom logo immediately on DOM load
    document.addEventListener('DOMContentLoaded', () => {
      window.applyCustomLogo();
    });

    // Cross-tab real-time sync event hook
    window.addEventListener('storage', (e) => {
      if (e.key === 'aitruesight_custom_logo') {
        window.applyCustomLogo(e.newValue);
      }
    });
  }

  registerSecretTriggers() {
    // Only bind triggers if we are on the main learning hub page (not on the dashboard itself)
    if (window.location.pathname.includes('dashboard.html')) {
      return;
    }

    // 1. Keyboard Shortcut (Ctrl + Shift + D / Cmd + Shift + D)
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        window.open('dashboard.html', '_blank');
      }
    });

    // 2. Double-Click Online User Counter Pill secretly opens dashboard
    document.addEventListener('dblclick', (e) => {
      const pill = e.target.closest('.header-stat-pill');
      if (pill) {
        e.preventDefault();
        window.open('dashboard.html', '_blank');
      }
    });

    // 3. Multi-Click Brand Logo Sequence (5 clicks in 2.5 seconds)
    let clickCount = 0;
    let lastClickTime = 0;
    document.addEventListener('click', (e) => {
      const logo = e.target.closest('.brand-logo');
      if (logo) {
        const now = Date.now();
        if (now - lastClickTime < 2500) {
          clickCount++;
        } else {
          clickCount = 1;
        }
        lastClickTime = now;

        if (clickCount >= 5) {
          clickCount = 0;
          window.open('dashboard.html', '_blank');
        }
      }
    });
  }

  // Generate or retrieve current client ID (survives tab close, unique per browser)
  initClientId() {
    let clientId = localStorage.getItem(this.clientKey);
    if (!clientId) {
      clientId = 'cli_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem(this.clientKey, clientId);
    }
    return clientId;
  }

  // Generate or retrieve current session
  initSession() {
    let currentSessionId = sessionStorage.getItem(this.sessionKey);
    if (!currentSessionId) {
      currentSessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem(this.sessionKey, currentSessionId);
      
      // Save session metadata
      this.registerNewSession(currentSessionId);
    }
    return currentSessionId;
  }

  // Register the session in a sessions catalog for average-session-duration and cohort analysis
  registerNewSession(sessId) {
    const sessions = this.getSessionsCatalog();
    sessions.push({
      id: sessId,
      clientId: this.clientId,
      startTime: new Date().toISOString(),
      duration: 0,
      userAgent: navigator.userAgent,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      platform: navigator.platform
    });
    localStorage.setItem(this.sessionsListKey, JSON.stringify(sessions));
    
    // Log session start event
    this.logEvent('session', 'Session', 'Session Started', 1);
  }

  getUniqueVisitorsCount() {
    const sessions = this.getSessionsCatalog();
    const uniqueClients = new Set();
    sessions.forEach(s => {
      if (s.clientId) {
        uniqueClients.add(s.clientId);
      }
    });
    if (uniqueClients.size === 0 && sessions.length > 0) {
      return 1;
    }
    return Math.max(1, uniqueClients.size);
  }

  getSessionsCatalog() {
    try {
      return JSON.parse(localStorage.getItem(this.sessionsListKey)) || [];
    } catch (e) {
      return [];
    }
  }

  // Update current session's duration in the catalog (called on heartbeats and page navigation)
  updateSessionDuration() {
    const elapsedSeconds = Math.floor((Date.now() - this.sessionStartTime) / 1000);
    const sessions = this.getSessionsCatalog();
    const current = sessions.find(s => s.id === this.sessionId);
    if (current) {
      current.duration = elapsedSeconds;
      localStorage.setItem(this.sessionsListKey, JSON.stringify(sessions));
    }
  }

  // Fetch all logged events
  getEvents() {
    try {
      return JSON.parse(localStorage.getItem(this.logsKey)) || [];
    } catch (e) {
      return [];
    }
  }

  // Save an event to logs
  logEvent(type, category, label, value = null) {
    const events = this.getEvents();
    const newEvent = {
      id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      type,       // 'pageview', 'click', 'interaction', 'performance'
      category,   // e.g. 'Navigation', 'Monetization Simulator', 'Prompt Studio', 'PDF Export'
      label,      // e.g. 'Viewed Social Academy', 'Copied Hook Prompt', 'Calculated Profit to $16,543'
      value       // Optional numeric or structural value
    };
    
    events.push(newEvent);
    
    // Cap logs at 2000 events to prevent localStorage overflow
    if (events.length > 2000) {
      events.shift();
    }
    
    localStorage.setItem(this.logsKey, JSON.stringify(events));
    
    // Sync session duration on events
    this.updateSessionDuration();
    
    // Dispatch custom event for real-time dashboard listeners
    window.dispatchEvent(new CustomEvent('da_analytics_new_event', { detail: newEvent }));
    
    console.debug(`[Analytics] Tracked ${type} | ${category} | ${label}`, value !== null ? value : '');
  }

  // Core automatic telemetry hooks
  initAutomaticTracking() {
    // 1. Session Duration Heartbeat (updates every 5 seconds)
    setInterval(() => this.updateSessionDuration(), 5000);

    // 2. Page Performance telemetry
    window.addEventListener('load', () => {
      setTimeout(() => {
        if (window.performance && window.performance.timing) {
          const timing = window.performance.timing;
          const loadTimeMs = timing.loadEventEnd - timing.navigationStart;
          
          if (loadTimeMs > 0 && loadTimeMs < 30000) { // filter outliers
            const loadTimeSec = (loadTimeMs / 1000).toFixed(2);
            this.logEvent('performance', 'System', 'Page Load Time', parseFloat(loadTimeSec));
          }
        } else if (window.performance && performance.getEntriesByType) {
          const navEntries = performance.getEntriesByType('navigation');
          if (navEntries.length > 0) {
            const loadTimeSec = (navEntries[0].duration / 1000).toFixed(2);
            this.logEvent('performance', 'System', 'Page Load Time', parseFloat(loadTimeSec));
          }
        }
      }, 500);
    });

    // 3. Page Visibility changes (helps update session duration when user switches tabs)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.updateSessionDuration();
        this.logEvent('session', 'Session', 'Tab Hidden (Suspended)');
      } else {
        this.logEvent('session', 'Session', 'Tab Visible (Resumed)');
      }
    });

    // 4. Session Termination Tracking
    window.addEventListener('beforeunload', () => {
      this.updateSessionDuration();
      this.logEvent('session', 'Session', 'Session Terminated');
    });
  }

  // Clear all storage records
  resetAllData() {
    localStorage.removeItem(this.logsKey);
    localStorage.removeItem(this.sessionsListKey);
    sessionStorage.removeItem(this.sessionKey);
    
    // Reinitialize fresh session
    this.sessionId = this.initSession();
    this.sessionStartTime = Date.now();
    
    this.logEvent('interaction', 'Dashboard', 'Analytics Storage Reset');
  }

  // Bulk load mock data for styling and testing visualizations
  seedMockData() {
    console.warn('[Analytics] Mock data generation is disabled as requested by the user.');
  }

  // Live responsive community online user simulation
  initLiveVisitorSimulator() {
    // True and unique client session counter: displays exactly 1 online visitor (the local user)
    document.addEventListener('DOMContentLoaded', () => {
      const userCountVal = document.getElementById('js-active-users');
      if (userCountVal) {
        userCountVal.textContent = "1";
        localStorage.setItem('da_live_online_users', "1");
      }
    });

    // Listen for storage events in case it needs syncing
    window.addEventListener('storage', (e) => {
      if (e.key === 'da_live_online_users') {
        const userCountVal = document.getElementById('js-active-users');
        if (userCountVal) {
          userCountVal.textContent = "1";
        }
      }
    });
  }
}

// Bind to window global space
window.WebsiteAnalytics = new AnalyticsEngine();

// --- PREMIUM DYNAMIC MODAL COMPONENT ENGINE ---
(function() {
  // Modal creation helper
  function createModal(options, isConfirm = false) {
    return new Promise((resolve) => {
      const type = options.type || 'info'; // 'success', 'warning', 'error', 'info'
      const title = options.title || (isConfirm ? 'Confirm Action' : 'Notification');
      const message = options.message || '';
      const confirmText = options.confirmText || 'OK';
      const cancelText = options.cancelText || 'Cancel';

      // Icon SVGs
      let iconSvg = '';
      if (type === 'success') {
        iconSvg = `<svg class="svg-icon" viewBox="0 0 24 24" style="width: 32px; height: 32px;"><polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="3" fill="none"/></svg>`;
      } else if (type === 'warning') {
        iconSvg = `<svg class="svg-icon" viewBox="0 0 24 24" style="width: 32px; height: 32px;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" stroke-width="2.5" fill="none"/><line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" stroke-width="2.5"/><line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" stroke-width="3"/></svg>`;
      } else if (type === 'error') {
        iconSvg = `<svg class="svg-icon" viewBox="0 0 24 24" style="width: 32px; height: 32px;"><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="3"/><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="3"/></svg>`;
      } else { // info / default
        iconSvg = `<svg class="svg-icon" viewBox="0 0 24 24" style="width: 32px; height: 32px;"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2.5" fill="none"/><line x1="12" y1="16" x2="12" y2="12" stroke="currentColor" stroke-width="2.5"/><line x1="12" y1="8" x2="12.01" y2="8" stroke="currentColor" stroke-width="3"/></svg>`;
      }

      // Create modal elements
      const overlay = document.createElement('div');
      overlay.className = 'custom-modal-overlay';
      
      let buttonsHtml = '';
      if (isConfirm) {
        buttonsHtml = `
          <button class="custom-modal-btn custom-modal-btn-secondary js-modal-cancel" tabindex="0">${cancelText}</button>
          <button class="custom-modal-btn custom-modal-btn-primary js-modal-confirm" tabindex="0">${confirmText}</button>
        `;
      } else {
        buttonsHtml = `
          <button class="custom-modal-btn custom-modal-btn-primary js-modal-confirm" tabindex="0" style="width: 100%;">${confirmText}</button>
        `;
      }

      overlay.innerHTML = `
        <div class="custom-modal-card" role="dialog" aria-modal="true" tabindex="-1">
          <div class="custom-modal-icon-container ${type}">
            <div class="custom-modal-icon-pulse"></div>
            ${iconSvg}
          </div>
          <h2 class="custom-modal-title">${title}</h2>
          <div class="custom-modal-message">${message}</div>
          <div class="custom-modal-actions">
            ${buttonsHtml}
          </div>
        </div>
      `;

      document.body.appendChild(overlay);

      // Animation entrance trigger
      // Force reflow
      overlay.offsetHeight;
      overlay.classList.add('active');

      const card = overlay.querySelector('.custom-modal-card');
      card.focus();

      // Clean up modal helper
      function closeModal(value) {
        overlay.classList.remove('active');
        window.removeEventListener('keydown', handleKeyDown);
        // Wait for transition to finish before removing from DOM
        setTimeout(() => {
          overlay.remove();
          // Restore focus to previously active element if possible
          if (prevActiveElement && typeof prevActiveElement.focus === 'function') {
            prevActiveElement.focus();
          }
          resolve(value);
        }, 300);
      }

      // Track focus management
      const prevActiveElement = document.activeElement;

      // Event listeners
      const confirmBtn = overlay.querySelector('.js-modal-confirm');
      const cancelBtn = overlay.querySelector('.js-modal-cancel');

      if (confirmBtn) {
        confirmBtn.addEventListener('click', () => closeModal(true));
      }
      if (cancelBtn) {
        cancelBtn.addEventListener('click', () => closeModal(false));
      }

      // Backdrop click option (closes/resolves false for confirms, true for alerts)
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          closeModal(false);
        }
      });

      // Escape & Enter key triggers
      function handleKeyDown(e) {
        if (e.key === 'Escape') {
          e.preventDefault();
          closeModal(false);
        } else if (e.key === 'Enter' && !isConfirm) {
          // Alert can be dismissed with enter anywhere
          e.preventDefault();
          closeModal(true);
        }
      }
      window.addEventListener('keydown', handleKeyDown);

      // Focus trapping inside modal card
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          const focusables = card.querySelectorAll('button, [tabindex="0"]');
          if (focusables.length === 0) return;
          const first = focusables[0];
          const last = focusables[focusables.length - 1];

          if (e.shiftKey) { // Shift + Tab
            if (document.activeElement === first) {
              last.focus();
              e.preventDefault();
            }
          } else { // Tab
            if (document.activeElement === last) {
              first.focus();
              e.preventDefault();
            }
          }
        }
      });
    });
  }

  // Global methods definitions
  window.showAlert = function(options) {
    if (typeof options === 'string') {
      options = { message: options };
    }
    return createModal(options, false);
  };

  window.showConfirm = function(options) {
    if (typeof options === 'string') {
      options = { message: options };
    }
    return createModal(options, true);
  };
})();

