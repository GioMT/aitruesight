document.addEventListener('DOMContentLoaded', () => {
  const sidebarMenu = document.querySelector('.nav-menu');

  /* ==========================================================================
     1. SIDEBAR & SCROLL SPY, & MOBILE DRAWER
     ========================================================================== */

  function bindNavigationActions() {
    const anchors = document.querySelectorAll('.js-nav-anchor');
    anchors.forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetHref = anchor.getAttribute('href');
        
        // Sync active highlight status across both sidebar and horizontal nav tracks
        anchors.forEach(a => {
          if (a.getAttribute('href') === targetHref) {
            a.classList.add('active');
          } else {
            a.classList.remove('active');
          }
        });
        
        // Auto-close sidebar menu and overlay on mobile click transitions
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        if (sidebar) sidebar.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
      });
    });
  }

  function bindSidebarScrollSpy() {
    const anchors = document.querySelectorAll('.js-nav-anchor');
    const sections = [];
    anchors.forEach(anchor => {
      const targetId = anchor.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const section = document.querySelector(targetId);
        if (section && !sections.some(s => s.targetId === targetId)) {
          sections.push({ targetId, section });
        }
      }
    });

    if (sections.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const activeId = '#' + entry.target.id;
          anchors.forEach(anchor => {
            if (anchor.getAttribute('href') === activeId) {
              anchor.classList.add('active');
            } else {
              anchor.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(s => observer.observe(s.section));
  }

  function bindMobileMenu() {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const overlay = document.getElementById('sidebar-overlay');
    const sidebar = document.querySelector('.sidebar');
    
    if (!toggleBtn || !overlay || !sidebar) return;
    
    function toggleMenu() {
      sidebar.classList.toggle('active');
      overlay.classList.toggle('active');
    }
    
    toggleBtn.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);
  }

  /* ==========================================================================
     2. SCROLL REVEAL ENGINES (INTERSECTION OBSERVER)
     ========================================================================== */
  function bindScrollObserver() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => revealObserver.observe(el));
  }

  /* ==========================================================================
     3. MODULE CAROUSEL SLIDER ENGINE
     ========================================================================== */
  function bindCarouselSlider() {
    const track = document.getElementById('carousel-track');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    
    if (!track || !prevBtn || !nextBtn) return;
    
    let cardIndex = 0;
    
    function getSlideMetrics() {
      const cards = track.querySelectorAll('.carousel-card');
      const cardStyle = window.getComputedStyle(cards[0]);
      const cardWidth = cards[0].offsetWidth;
      const cardGap = parseFloat(cardStyle.marginRight) || 24;
      const totalWidth = cardWidth + cardGap;
      
      const trackContainerWidth = track.parentElement.offsetWidth;
      const visibleCardsCount = Math.floor(trackContainerWidth / totalWidth) || 1;
      const maxIndex = Math.max(0, cards.length - visibleCardsCount);
      
      return { totalWidth, maxIndex };
    }
    
    function slideTo(index) {
      const { totalWidth, maxIndex } = getSlideMetrics();
      cardIndex = Math.min(Math.max(0, index), maxIndex);
      const translation = cardIndex * totalWidth;
      track.style.transform = `translateX(-${translation}px)`;
      
      prevBtn.style.opacity = cardIndex === 0 ? '0.3' : '1';
      nextBtn.style.opacity = cardIndex === maxIndex ? '0.3' : '1';
    }
    
    // Clear old event listeners by cloning buttons
    const newPrevBtn = prevBtn.cloneNode(true);
    const newNextBtn = nextBtn.cloneNode(true);
    prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
    nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
    
    newPrevBtn.addEventListener('click', () => slideTo(cardIndex - 1));
    newNextBtn.addEventListener('click', () => slideTo(cardIndex + 1));
    
    // Initial sync
    setTimeout(() => slideTo(0), 100);
  }

  /* ==========================================================================
     5. LIVE ANALYTICS SIMULATOR
     ========================================================================== */
  const userCountVal = document.getElementById('js-active-users');
  const chartBars = document.querySelectorAll('.dash-bar');
  
  if (userCountVal) {
    userCountVal.textContent = "1";
  }
  
  if (chartBars.length > 0) {
    function updateAnalyticsWidget() {
      chartBars.forEach(bar => {
        const heightPercent = Math.floor(Math.random() * 90) + 10;
        bar.style.height = `${heightPercent}%`;
        if (heightPercent > 70) {
          bar.classList.add('active');
        } else {
          bar.classList.remove('active');
        }
      });
    }
    
    setInterval(updateAnalyticsWidget, 3000);
    updateAnalyticsWidget();
  }

  /* ==========================================================================
     6. INTERACTIVE MONETIZATION CALCULATOR (SOCIAL AUTOMATION)
     ========================================================================== */
  function bindSocialCalculators() {
    const scriptInput = document.getElementById('calc-script');
    const voiceInput = document.getElementById('calc-voice');
    const editInput = document.getElementById('calc-edit');
    const thumbInput = document.getElementById('calc-thumb');
    
    const countInput = document.getElementById('calc-count');
    const viewsInput = document.getElementById('calc-views');
    const adsInput = document.getElementById('calc-ads');
    const cpmInput = document.getElementById('calc-cpm');
    
    const agencyTotalVal = document.getElementById('val-agency');
    const aiTotalVal = document.getElementById('val-ai');
    const savingsVal = document.getElementById('val-savings');
    
    const adRevVal = document.getElementById('val-ad-rev');
    const profitVal = document.getElementById('val-net-profit');

    if (!scriptInput) return; // safety check

    function calculateFinancials() {
      const valScript = parseFloat(scriptInput.value) || 0;
      const valVoice = parseFloat(voiceInput.value) || 0;
      const valEdit = parseFloat(editInput.value) || 0;
      const valThumb = parseFloat(thumbInput.value) || 0;
      const videoCount = parseFloat(countInput.value) || 0;

      const outsourcedCostPerVideo = valScript + valVoice + valEdit + valThumb;
      const monthlyAgencyCost = outsourcedCostPerVideo * videoCount;

      const monthlyAiCost = 32; 
      const monthlySavings = Math.max(0, monthlyAgencyCost - monthlyAiCost);

      const avgViews = parseFloat(viewsInput.value) || 0;
      const adsPerVideo = parseFloat(adsInput.value) || 0;
      const targetCpm = parseFloat(cpmInput.value) || 0;

      const totalMonthlyViews = avgViews * videoCount;
      const projectedAdRevenue = totalMonthlyViews * adsPerVideo * (targetCpm / 1000);
      const netProfit = Math.max(-monthlyAiCost, projectedAdRevenue - monthlyAiCost);

      agencyTotalVal.textContent = `$${monthlyAgencyCost.toLocaleString(undefined, {maximumFractionDigits:0})}`;
      aiTotalVal.textContent = `$${monthlyAiCost.toLocaleString()}`;
      savingsVal.textContent = `$${monthlySavings.toLocaleString(undefined, {maximumFractionDigits:0})}/mo Saved`;
      
      adRevVal.textContent = `$${projectedAdRevenue.toLocaleString(undefined, {maximumFractionDigits:0})}`;
      
      if (netProfit < 0) {
        profitVal.textContent = `-$${Math.abs(netProfit).toLocaleString(undefined, {maximumFractionDigits:0})}`;
        profitVal.style.color = 'var(--accent)';
      } else {
        profitVal.textContent = `$${netProfit.toLocaleString(undefined, {maximumFractionDigits:0})}/mo`;
        profitVal.style.color = 'var(--success)';
      }

      if (window.WebsiteAnalytics) {
        clearTimeout(window.calcLogTimeout);
        window.calcLogTimeout = setTimeout(() => {
          window.WebsiteAnalytics.logEvent('interaction', 'Monetization Simulator', `Recalculated Profit to $${netProfit.toLocaleString(undefined, {maximumFractionDigits:0})}/mo`, netProfit);
        }, 1000);
      }
    }

    const allInputs = [scriptInput, voiceInput, editInput, thumbInput, countInput, viewsInput, adsInput, cpmInput];
    allInputs.forEach(input => {
      if (input) input.addEventListener('input', calculateFinancials);
    });

    calculateFinancials();
  }

  /* ==========================================================================
     7. DYNAMIC GOOGLE ANALYTICS INTEGRATION
     ========================================================================== */
  const statusBadge = document.getElementById('analytics-status-badge');

  function injectGoogleAnalytics(measurementId) {
    if (!measurementId || !measurementId.startsWith('G-')) {
      console.warn("Invalid Google Analytics Measurement ID format.");
      return false;
    }
    
    if (document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${measurementId}"]`)) {
      return true;
    }

    try {
      const libScript = document.createElement('script');
      libScript.async = true;
      libScript.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(libScript);

      const configScript = document.createElement('script');
      configScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${measurementId}');
      `;
      document.head.appendChild(configScript);

      console.log(`Google Analytics Measurement tags [${measurementId}] dynamically initialized successfully!`);
      return true;
    } catch (err) {
      console.error("Failed to inject Google Analytics tags:", err);
      return false;
    }
  }

  // Load GA from storage on launch
  const savedId = localStorage.getItem('ga_measurement_id');
  if (savedId) {
    injectGoogleAnalytics(savedId);
    if (statusBadge) {
      statusBadge.textContent = 'Active (Live)';
      statusBadge.style.background = 'rgba(16, 185, 129, 0.1)';
      statusBadge.style.color = 'var(--success)';
    }
  }

  /* ==========================================================================
     8. WEB ACADEMY INTERACTIVE WIDGETS
     ========================================================================== */
  function bindWebAcademyWidgets() {
    // 1. Box Model Visualizer Tool
    const inputPadding = document.getElementById('box-padding');
    const inputBorder = document.getElementById('box-border');
    const inputMargin = document.getElementById('box-margin');
    
    const boxContent = document.getElementById('vis-content');
    const boxPadding = document.getElementById('vis-padding');
    const boxBorder = document.getElementById('vis-border');
    const boxMargin = document.getElementById('vis-margin');
    
    const txtPadding = document.getElementById('lbl-padding');
    const txtBorder = document.getElementById('lbl-border');
    const txtMargin = document.getElementById('lbl-margin');

    if (!inputPadding) return; // safety check

    function updateBoxModel() {
      const pVal = Math.min(60, Math.max(0, parseInt(inputPadding.value) || 0));
      const bVal = Math.min(20, Math.max(0, parseInt(inputBorder.value) || 0));
      const mVal = Math.min(60, Math.max(0, parseInt(inputMargin.value) || 0));

      // Visual borders adjustment
      boxPadding.style.padding = `${pVal}px`;
      boxBorder.style.padding = `${bVal}px`;
      boxMargin.style.padding = `${mVal}px`;

      // Text labels update
      txtPadding.textContent = `Padding: ${pVal}px`;
      txtBorder.textContent = `Border: ${bVal}px`;
      txtMargin.textContent = `Margin: ${mVal}px`;

      if (window.WebsiteAnalytics) {
        clearTimeout(window.boxLogTimeout);
        window.boxLogTimeout = setTimeout(() => {
          window.WebsiteAnalytics.logEvent('interaction', 'Box Model Tool', `Adjusted Box Model (Padding: ${pVal}px, Border: ${bVal}px, Margin: ${mVal}px)`, pVal);
        }, 1000);
      }
    }

    [inputPadding, inputBorder, inputMargin].forEach(input => {
      input.addEventListener('input', updateBoxModel);
    });

    updateBoxModel(); // initial run
  }

  /* ==========================================================================
     9. DYNAMIC AI PROMPT COMPILER (SOCIAL ACADEMY HOME)
     ========================================================================== */
  const promptSelect = document.getElementById('prompt-select');
  const promptOutput = document.getElementById('prompt-output');
  const copyBtn = document.getElementById('btn-copy');

  if (promptSelect && promptOutput && copyBtn) {
    const PROMPTS_DATABASE = {
      hook: `Act as a highly successful faceless video retention specialist. I need a killer 3-second hook for a video about [TOPIC].
Make it high-contrast, provocative, and build an immediate gap of curiosity. 
Provide 3 completely different variations:
1. The "Conspiracy" angle (revealing a hidden secret)
2. The "Loss Aversion" angle (stopping the viewer from making a massive mistake)
3. The "Visual Shock" angle (referencing a shocking scene immediately).`,
      
      script: `Act as Claude, a professional YouTube scriptwriting genius with over 10 million views. 
I want you to write a retention-optimized script on [TOPIC] using the Multi-Source Transcript Synthesis format.
Below are the key facts/beats to cover:
[INSERT YOUR 3-5 TOP TOPICS/KEY DETAILS]

Structure Guidelines:
- Hook (0-10s): High energy, curiosity loop.
- Hook Payoff (10-30s): Briefly reward curiosity then bridge to main outline.
- Body Beats (30s-8min): Oscillate between high-value facts and visual pattern interrupts. Every 15 seconds, inject a zoom instruction, b-roll shift, or audio-cue prompt in brackets [like this].
- Outro (8min+): High-retention CTA. Do NOT say "Thanks for watching" or "In conclusion" (major drop points). Pitch the next video as a natural continuation.
- Tone: Gripping, direct, informative, 3rd-person narration.`,
      
      thumbnail: `Prompt for text-to-image generator:
A close-up cinematic portrait of [MAIN CHARACTER/SUBJECT], looking directly at the camera with a shocked expression, dramatic studio side-lighting, highly detailed skin textures, neon cyan and deep violet smoke background, realistic, 8k resolution, photorealistic, cinematic color grading, shot with Sony Alpha III, shot on 85mm lens --ar 16:9`,
      
      repurpose: `Act as a TikTok/Instagram Reels virality expert. I am slicing an 8-minute YouTube video about [TOPIC] into 3 distinct 45-second short-form clips.
Analyze the main topics and output a repurposing strategy.
For each of the 3 clips, provide:
1. Exact timestamp topic/angle (which portion of the script to extract).
2. A viral caption optimized with hooks and emojis.
3. The visual text-overlay style (e.g., "Bold yellow key phrases, auto-captions with emojis, sound effect cuts").
4. A high-retention call-to-action that drives followers to the main channel.`
    };

    function loadTemplate() {
      const type = promptSelect.value;
      promptOutput.value = PROMPTS_DATABASE[type] || 'Select a prompt type.';
    }

    promptSelect.addEventListener('change', loadTemplate);
    
    copyBtn.addEventListener('click', () => {
      promptOutput.select();
      promptOutput.setSelectionRange(0, 99999);
      navigator.clipboard.writeText(promptOutput.value)
        .then(() => {
          if (window.WebsiteAnalytics) {
            const promptType = promptSelect.value;
            let promptLabel = 'Prompt';
            if (promptType === 'hook') promptLabel = '3-Second Viral Hook Maker';
            else if (promptType === 'script') promptLabel = 'Retention-Optimized Script Builder';
            else if (promptType === 'thumbnail') promptLabel = 'Photorealistic Thumbnail Prompter';
            else if (promptType === 'repurpose') promptLabel = 'Viral Short-Form Repurposing Planner';
            window.WebsiteAnalytics.logEvent('interaction', 'Prompt Studio', `Copied Prompt: ${promptLabel}`, promptType);
          }

          const originalText = copyBtn.textContent;
          copyBtn.textContent = 'Copied to Clipboard! ✓';
          copyBtn.style.background = 'var(--success)';
          copyBtn.style.color = '#fff';
          setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = 'rgba(0, 242, 254, 0.08)';
            copyBtn.style.color = 'var(--primary)';
          }, 2000);
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    });

    loadTemplate();
  }

  /* ==========================================================================
     10. PDF EXPORT TRIGGER
     ========================================================================== */


  // --- PRO THEME SELECTOR SWITCH ---
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const sunIcon = document.querySelector('.theme-sun-icon');
  const moonIcon = document.querySelector('.theme-moon-icon');

  function updateThemeUI(theme) {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
      if (sunIcon) sunIcon.style.display = 'inline-block';
      if (moonIcon) moonIcon.style.display = 'none';
    } else {
      document.body.classList.remove('light-theme');
      if (sunIcon) sunIcon.style.display = 'none';
      if (moonIcon) moonIcon.style.display = 'inline-block';
    }
  }

  // Load theme preference on launch
  const savedTheme = localStorage.getItem('da_theme') || 'light';
  updateThemeUI(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
      const targetTheme = currentTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('da_theme', targetTheme);
      updateThemeUI(targetTheme);
      
      if (window.WebsiteAnalytics) {
        window.WebsiteAnalytics.logEvent('click', 'Settings', `Switched theme to ${targetTheme}`);
      }
    });
  }

  // --- DYNAMIC AD BANNER INJECTION SYSTEM (AGGRESSIVE & CLEAN) ---
  function injectAdBanners() {
    const mainColumns = document.querySelectorAll('.academy-main-col');
    mainColumns.forEach(mainCol => {
      const sections = mainCol.querySelectorAll('.section-wrapper');
      
      sections.forEach((section, idx) => {
        if (idx === sections.length - 1) return; // Skip the last section since skyscraper fits there
        
        const adContainer = document.createElement('div');
        adContainer.className = 'in-content-ad-container';
        adContainer.style.padding = '0';
        adContainer.style.border = 'none';
        adContainer.innerHTML = `
          <!-- FUTURE IN-CONTENT AD PLACEHOLDER -->
          <!-- In the future, replace this placeholder with your ad network banner code snippet -->
          <div class="ad-placeholder-banner" style="display: none;"></div>
        `;
        
        section.parentNode.insertBefore(adContainer, section.nextSibling);
      });
    });
  }

  // Inject Ad Banners dynamic placements
  injectAdBanners();

  // --- INITIALIZE ALL ACTIVE MODULES SAFELY ---

  bindNavigationActions();
  bindSidebarScrollSpy();
  bindMobileMenu();
  bindScrollObserver();

  if (document.getElementById('carousel-track')) {
    bindCarouselSlider();
  }
  if (document.getElementById('calc-script')) {
    bindSocialCalculators();
  }
  if (document.getElementById('box-padding')) {
    bindWebAcademyWidgets();
  }
});
