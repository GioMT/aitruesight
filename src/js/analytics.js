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
    
    this.sessionId = this.initSession();
    this.sessionStartTime = Date.now();
    
    // Register automatic event listeners
    this.initAutomaticTracking();
    
    // Register secret triggers
    this.registerSecretTriggers();
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

    // 2. Double-Click Analytics Status Badge (in header)
    document.addEventListener('dblclick', (e) => {
      const badge = e.target.closest('#analytics-status-badge');
      if (badge) {
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
    this.resetAllData();
    
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const categories = ['Navigation', 'Monetization Simulator', 'Prompt Studio', 'PDF Export', 'Box Model Tool', 'System'];
    const views = ['home', 'social', 'website'];
    
    // 1. Seed sessions over the last 7 days
    const mockSessions = [];
    const totalMockSessions = 48;
    
    for (let i = 0; i < totalMockSessions; i++) {
      const sessAge = Math.random() * 7 * oneDay;
      const startTime = new Date(now - sessAge);
      const duration = Math.floor(Math.random() * 600) + 30; // 30s to 10m
      const sId = 'sess_mock_' + i;
      
      mockSessions.push({
        id: sId,
        startTime: startTime.toISOString(),
        duration,
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        screenWidth: [1440, 1920, 1280, 375, 412][Math.floor(Math.random() * 5)],
        screenHeight: [900, 1080, 800, 812, 892][Math.floor(Math.random() * 5)],
        platform: 'MacIntel'
      });
    }
    
    mockSessions.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    localStorage.setItem(this.sessionsListKey, JSON.stringify(mockSessions));

    // 2. Seed events distributed across those sessions
    const mockEvents = [];
    
    mockSessions.forEach(session => {
      const sessTime = new Date(session.startTime).getTime();
      
      // Page load time
      const loadTimeSec = (Math.random() * 1.2 + 0.3).toFixed(2);
      mockEvents.push({
        id: 'evt_mock_' + Math.random().toString(36).substr(2, 9),
        sessionId: session.id,
        timestamp: new Date(sessTime).toISOString(),
        type: 'performance',
        category: 'System',
        label: 'Page Load Time',
        value: parseFloat(loadTimeSec)
      });
      
      // Initial home view
      mockEvents.push({
        id: 'evt_mock_' + Math.random().toString(36).substr(2, 9),
        sessionId: session.id,
        timestamp: new Date(sessTime + 500).toISOString(),
        type: 'pageview',
        category: 'Navigation',
        label: 'Viewed Available Academies',
        value: 'home'
      });

      // Randomized academy exploration
      let currentOffset = 5000;
      const exploreChoice = Math.random();
      
      if (exploreChoice > 0.3) {
        // Explored social academy
        currentOffset += Math.random() * 4000;
        mockEvents.push({
          id: 'evt_mock_' + Math.random().toString(36).substr(2, 9),
          sessionId: session.id,
          timestamp: new Date(sessTime + currentOffset).toISOString(),
          type: 'click',
          category: 'Navigation',
          label: 'Started Content Automation Masterclass',
          value: 'social'
        });

        // Prompt interactions
        if (Math.random() > 0.4) {
          currentOffset += Math.random() * 15000;
          const promptType = ['Hook Maker', 'Script Builder', 'Thumbnail Prompter'][Math.floor(Math.random() * 3)];
          mockEvents.push({
            id: 'evt_mock_' + Math.random().toString(36).substr(2, 9),
            sessionId: session.id,
            timestamp: new Date(sessTime + currentOffset).toISOString(),
            type: 'interaction',
            category: 'Prompt Studio',
            label: `Copied Prompt: ${promptType}`,
            value: promptType.toLowerCase().replace(' ', '_')
          });
        }

        // Calculator interactions
        if (Math.random() > 0.4) {
          currentOffset += Math.random() * 20000;
          const profit = Math.floor(Math.random() * 20000) + 5000;
          mockEvents.push({
            id: 'evt_mock_' + Math.random().toString(36).substr(2, 9),
            sessionId: session.id,
            timestamp: new Date(sessTime + currentOffset).toISOString(),
            type: 'interaction',
            category: 'Monetization Simulator',
            label: `Recalculated Profit to $${profit.toLocaleString()}/mo`,
            value: profit
          });
        }
        
        // PDF exports
        if (Math.random() > 0.8) {
          currentOffset += Math.random() * 30000;
          mockEvents.push({
            id: 'evt_mock_' + Math.random().toString(36).substr(2, 9),
            sessionId: session.id,
            timestamp: new Date(sessTime + currentOffset).toISOString(),
            type: 'click',
            category: 'PDF Export',
            label: 'Exported Slide PDF',
            value: 1
          });
        }
      }

      if (exploreChoice < 0.7) {
        // Explored website academy
        currentOffset += Math.random() * 25000;
        mockEvents.push({
          id: 'evt_mock_' + Math.random().toString(36).substr(2, 9),
          sessionId: session.id,
          timestamp: new Date(sessTime + currentOffset).toISOString(),
          type: 'click',
          category: 'Navigation',
          label: 'Started Zero-Cost Web Development',
          value: 'website'
        });

        // Box model adjustment
        if (Math.random() > 0.3) {
          currentOffset += Math.random() * 10000;
          const padding = Math.floor(Math.random() * 50) + 10;
          mockEvents.push({
            id: 'evt_mock_' + Math.random().toString(36).substr(2, 9),
            sessionId: session.id,
            timestamp: new Date(sessTime + currentOffset).toISOString(),
            type: 'interaction',
            category: 'Box Model Tool',
            label: `Adjusted Box Padding to ${padding}px`,
            value: padding
          });
        }
      }
    });

    localStorage.setItem(this.logsKey, JSON.stringify(mockEvents));
    console.log('[Analytics] Successfully seeded mock telemetry data.');
    
    // Trigger window update
    window.dispatchEvent(new CustomEvent('da_analytics_mock_seeded'));
  }
}

// Bind to window global space
window.WebsiteAnalytics = new AnalyticsEngine();
