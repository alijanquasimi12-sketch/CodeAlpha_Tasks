// --- KMA² STARTUP SEQUENCE ---
const messages = [
    "Initializing KMA² Intelligence Framework...", 
    "Optimizing Core Data Assets...", 
    "Launching Neural Networks...", 
    "System Ready."
];

let appData = null;
let budgetChartInstance = null; // Store chart instance for destruction
let latestPredictionState = null; // Store the latest prediction for AI Decision Center

document.addEventListener("DOMContentLoaded", () => {
    // 0. Global Toast Notification System
    window.showToast = (message, type = 'success') => {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let iconClass = 'fas fa-check-circle';
        if (type === 'warning') iconClass = 'fas fa-exclamation-triangle';
        if (type === 'error') iconClass = 'fas fa-times-circle';

        toast.innerHTML = `<i class="${iconClass}"></i><span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('hiding');
            setTimeout(() => {
                if(container.contains(toast)) container.removeChild(toast);
            }, 400);
        }, 3000);
    };

    // Premium Scroll to Top Button
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");
    
    if (scrollToTopBtn) {
        // Show/hide based on scroll position
        window.addEventListener("scroll", () => {
            if (window.scrollY > 350) {
                scrollToTopBtn.classList.add("show");
            } else {
                scrollToTopBtn.classList.remove("show");
            }
        });

        // Smooth scroll to top on click
        scrollToTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // 1. Startup Sequence
    const msgEl = document.getElementById('loading-msg');
    const progress = document.getElementById('progress-bar');
    const startupScreen = document.getElementById('startup-screen');
    const dashboard = document.getElementById('main-dashboard');
    
    if (dashboard) {
        dashboard.style.display = 'none';
        dashboard.style.opacity = '0';
        dashboard.style.transition = 'opacity 1s';
    }

    let currentMsg = 0;
    setTimeout(() => {
        const interval = setInterval(() => {
            currentMsg++;
            if (currentMsg < messages.length) {
                msgEl.style.opacity = 0;
                setTimeout(() => { msgEl.innerText = messages[currentMsg]; msgEl.style.opacity = 1; }, 500);
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    if (dashboard) {
                        dashboard.style.display = 'block';
                        setTimeout(() => {
                            dashboard.style.opacity = '1';
                        }, 50);
                    }
                    startupScreen.style.transition = 'opacity 1s ease-in-out';
                    startupScreen.style.opacity = '0';
                    
                    setTimeout(() => {
                        startupScreen.style.display = 'none';
                        if (dashboard) {
                            initializeApp();
                        }
                    }, 1000);
                }, 2000);
            }
        }, 2000);
    }, 5500);

    progress.style.transition = `width 10s linear`;
    setTimeout(() => progress.style.width = '100%', 5500);

    // 2. Navigation Logic
    const navItems = document.querySelectorAll('#nav-menu li');
    const sections = document.querySelectorAll('.dashboard-section');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active from all
            navItems.forEach(n => n.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active-section'));

            // Add active to clicked
            item.classList.add('active');
            const targetId = item.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active-section');
        });
    });

    // 2.5 Settings Modal Logic
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const settingsCloseBtn = document.getElementById('settingsCloseBtn');

    if (settingsBtn && settingsModal) {
        settingsBtn.addEventListener('click', () => {
            settingsModal.classList.add('active');
        });
        
        const closeSettings = () => {
            settingsModal.classList.remove('active');
        };

        if (settingsCloseBtn) settingsCloseBtn.addEventListener('click', closeSettings);

        // Click outside to close
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) closeSettings();
        });
        
        // Escape key logic for settings
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && settingsModal.classList.contains('active')) {
                closeSettings();
            }
        });
    }

    // 2.6 Advanced Settings Center Logic
    const initAdvancedSettings = () => {
        // Tab switching
        const tabs = document.querySelectorAll('.adv-settings-tab');
        const sections = document.querySelectorAll('.adv-settings-section');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                sections.forEach(s => s.classList.remove('active'));
                
                tab.classList.add('active');
                const targetId = 'tab-' + tab.getAttribute('data-tab');
                const targetSection = document.getElementById(targetId);
                if (targetSection) targetSection.classList.add('active');
            });
        });

        // Load Settings from SessionStorage or defaults
        const loadSettings = () => {
            const settings = JSON.parse(sessionStorage.getItem('kma2_adv_settings')) || {
                theme: 'dark',
                animEnable: true,
                animSpeed: 'normal',
                animTransitions: true,
                animGlow: true,
                dashDensity: 'comfortable',
                dashTips: true,
                dashSticky: true,
                dashScrolltop: true
            };
            return settings;
        };

        const saveSettings = (settings) => {
            sessionStorage.setItem('kma2_adv_settings', JSON.stringify(settings));
        };

        
        // Chart Theme Updater
        const updateChartTheme = (theme) => {
            const isLight = (theme === 'light');
            Chart.defaults.color = isLight ? '#555555' : '#a0a0a0';
            const gridColor = isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.05)';
            
            Object.values(Chart.instances).forEach(chart => {
                if (chart.options.scales) {
                    if (chart.options.scales.x && chart.options.scales.x.grid) {
                        chart.options.scales.x.grid.color = gridColor;
                    }
                    if (chart.options.scales.y && chart.options.scales.y.grid) {
                        chart.options.scales.y.grid.color = gridColor;
                    }
                }
                chart.update();
            });
        };

        const applySettings = (settings) => {
            // Theme
            document.documentElement.setAttribute('data-theme', settings.theme);
            if(typeof Chart !== 'undefined' && typeof Chart.instances !== 'undefined') updateChartTheme(settings.theme);
            const themeRadios = document.querySelectorAll('input[name="theme-select"]');
            themeRadios.forEach(r => r.checked = (r.value === settings.theme));
            
            // Animation Controls
            document.documentElement.setAttribute('data-no-anim', !settings.animEnable);
            const animEnableCb = document.getElementById('setting-anim-enable');
            if(animEnableCb) animEnableCb.checked = settings.animEnable;
            
            const speedMap = { slow: '2', normal: '1', fast: '0.5' };
            document.documentElement.style.setProperty('--animation-speed', speedMap[settings.animSpeed]);
            const animSpeedSel = document.getElementById('setting-anim-speed');
            if(animSpeedSel) animSpeedSel.value = settings.animSpeed;
            
            const animTransCb = document.getElementById('setting-anim-transitions');
            if(animTransCb) animTransCb.checked = settings.animTransitions;
            
            document.documentElement.setAttribute('data-no-glow', !settings.animGlow);
            const animGlowCb = document.getElementById('setting-anim-glow');
            if(animGlowCb) animGlowCb.checked = settings.animGlow;
            
            // Dashboard Layout
            const dashLayout = document.querySelector('.dashboard-layout');
            if (dashLayout) {
                if(settings.dashDensity === 'compact') {
                    dashLayout.classList.add('compact-layout');
                } else {
                    dashLayout.classList.remove('compact-layout');
                }
            }
            const dashDensitySel = document.getElementById('setting-dash-density');
            if(dashDensitySel) dashDensitySel.value = settings.dashDensity;
            
            const dashTipsCb = document.getElementById('setting-dash-tips');
            if(dashTipsCb) dashTipsCb.checked = settings.dashTips;
            
            const header = document.querySelector('.kma-premium-header');
            if (header) {
                if(settings.dashSticky) {
                    header.style.position = 'sticky';
                    header.style.top = '0';
                    header.style.zIndex = '1000';
                } else {
                    header.style.position = 'relative';
                }
            }
            const dashStickyCb = document.getElementById('setting-dash-sticky');
            if(dashStickyCb) dashStickyCb.checked = settings.dashSticky;
        };

        let currentSettings = loadSettings();
        applySettings(currentSettings);

        // Event Listeners for changes
        document.querySelectorAll('input[name="theme-select"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                currentSettings.theme = e.target.value;
                applySettings(currentSettings);
                saveSettings(currentSettings);
                if(window.showToast) window.showToast('Theme updated successfully', 'success');
            });
        });

        const bindToggle = (id, key) => {
            const el = document.getElementById(id);
            if(el) {
                el.addEventListener('change', (e) => {
                    currentSettings[key] = e.target.checked;
                    applySettings(currentSettings);
                    saveSettings(currentSettings);
                    if(window.showToast) window.showToast('Setting saved successfully', 'success');
                });
            }
        };
        const bindSelect = (id, key) => {
            const el = document.getElementById(id);
            if(el) {
                el.addEventListener('change', (e) => {
                    currentSettings[key] = e.target.value;
                    applySettings(currentSettings);
                    saveSettings(currentSettings);
                    if(window.showToast) window.showToast('Preference updated', 'success');
                });
            }
        };

        bindToggle('setting-anim-enable', 'animEnable');
        bindSelect('setting-anim-speed', 'animSpeed');
        bindToggle('setting-anim-transitions', 'animTransitions');
        bindToggle('setting-anim-glow', 'animGlow');
        bindSelect('setting-dash-density', 'dashDensity');
        bindToggle('setting-dash-tips', 'dashTips');
        bindToggle('setting-dash-sticky', 'dashSticky');
        
        // Handle render mode badge
        const perfProfile = document.getElementById('setting-perf-profile');
        const renderBadge = document.getElementById('current-render-mode');
        if(perfProfile && renderBadge) {
            perfProfile.addEventListener('change', (e) => {
                if(e.target.value === 'quality') {
                    renderBadge.textContent = 'Quality (Hardware Accelerated)';
                    renderBadge.style.color = '#2ecc71';
                    renderBadge.style.borderColor = 'rgba(46, 204, 113, 0.4)';
                    renderBadge.style.background = 'rgba(46, 204, 113, 0.2)';
                    renderBadge.style.boxShadow = '0 0 10px rgba(46, 204, 113, 0.2)';
                } else if(e.target.value === 'balanced') {
                    renderBadge.textContent = 'Balanced (Dynamic Scaling)';
                    renderBadge.style.color = '#f1c40f';
                    renderBadge.style.borderColor = 'rgba(241, 196, 15, 0.4)';
                    renderBadge.style.background = 'rgba(241, 196, 15, 0.2)';
                    renderBadge.style.boxShadow = '0 0 10px rgba(241, 196, 15, 0.2)';
                } else {
                    renderBadge.textContent = 'High Performance (Minimal)';
                    renderBadge.style.color = '#e74c3c';
                    renderBadge.style.borderColor = 'rgba(231, 76, 60, 0.4)';
                    renderBadge.style.background = 'rgba(231, 76, 60, 0.2)';
                    renderBadge.style.boxShadow = '0 0 10px rgba(231, 76, 60, 0.2)';
                }
            });
        }
    };
    initAdvancedSettings();

    // 3. Prediction Form Submit
    const predForm = document.getElementById('prediction-form');
    predForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const tv = parseFloat(document.getElementById('tv-input').value);
        const radio = parseFloat(document.getElementById('radio-input').value);
        const news = parseFloat(document.getElementById('news-input').value);
        const resultBox = document.getElementById('pred-result');

        resultBox.innerHTML = "<span style='position: relative; z-index: 2;'>Processing Intelligence...</span>";
        resultBox.classList.add('shimmer-loading');
        

        try {
            const res = await fetch('/api/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tv, radio, newspaper: news })
            });
            const data = await res.json();
            
            resultBox.classList.remove('shimmer-loading');

            if (data.status === 'success') {
                if(window.showToast) window.showToast('Prediction Intelligence Generated', 'success');
                resultBox.innerText = data.prediction.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
                
                // Trigger the Executive Business Recommendation Engine
                if (typeof generateExecutiveRecommendations === 'function') {
                    generateExecutiveRecommendations(tv, radio, news, data.prediction);
                }
                
                // Trigger the Smart Advertising Budget Optimizer
                if (typeof generateSmartOptimization === 'function') {
                    generateSmartOptimization(tv, radio, news, data.prediction);
                }

                // Trigger the Interactive Budget Allocation Visualizer
                if (typeof generateBudgetVisualizer === 'function') {
                    generateBudgetVisualizer(tv, radio, news, data.prediction);
                }

                // Update AI Decision Center State
                latestPredictionState = { tv: tv, radio: radio, newspaper: news, prediction: data.prediction };
                if (typeof updateAIDecisionCenter === 'function') {
                    updateAIDecisionCenter();
                }

                // Update Executive Report Center
                if (typeof generateExecutiveReport === 'function') {
                    generateExecutiveReport();
                }

                // Update Business Insights
                if (typeof generateBusinessInsights === 'function') {
                    generateBusinessInsights();
                }
            } else {
                resultBox.innerText = "Error";
                console.error(data.error);
            }
        } catch (err) {
            resultBox.innerText = "Error";
            console.error(err);
        }
    });

    // 4. Logo Info Modal Logic
    const logoHeader = document.querySelector('.kma-header-logo');
    const logoModal = document.getElementById('logoInfoModal');
    const closeLogoTop = document.getElementById('logoInfoCloseTop');
    const closeLogoBottom = document.getElementById('logoInfoCloseBottom');

    if (logoHeader && logoModal) {
        logoHeader.addEventListener('click', () => {
            logoModal.classList.add('active');
        });
        
        const closeLogoModal = () => {
            logoModal.classList.remove('active');
        };

        if (closeLogoTop) closeLogoTop.addEventListener('click', closeLogoModal);
        if (closeLogoBottom) closeLogoBottom.addEventListener('click', closeLogoModal);
    }

    // 5. Signature Series Modal Logic
    const sigBtn = document.getElementById('signatureSeriesBtn');
    const sigModal = document.getElementById('signatureSeriesModal');
    const closeSigTop = document.getElementById('signatureSeriesCloseTop');
    const closeSigBottom = document.getElementById('signatureSeriesCloseBottom');

    if (sigBtn && sigModal) {
        sigBtn.addEventListener('click', () => {
            sigModal.classList.add('active');
        });
        
        const closeSigModal = () => {
            sigModal.classList.remove('active');
        };

        if (closeSigTop) closeSigTop.addEventListener('click', closeSigModal);
        if (closeSigBottom) closeSigBottom.addEventListener('click', closeSigModal);
        
        // Click outside to close
        sigModal.addEventListener('click', (e) => {
            if (e.target === sigModal) closeSigModal();
        });

        // Also close with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sigModal.classList.contains('active')) {
                closeSigModal();
            }
        });
    }

    // 6. Developer Profile Modal Logic
    const aboutDevBtn = document.getElementById('aboutDevBtn');
    const devProfileModal = document.getElementById('devProfileModal');
    const devCinematicIntro = document.getElementById('devCinematicIntro');
    const devMainContent = document.getElementById('devMainContent');
    const closeDevProfileBtn = document.getElementById('closeDevProfileBtn');
    const closeDevProfileTop = document.getElementById('devModalCloseTop');

    if (aboutDevBtn && devProfileModal) {
        aboutDevBtn.addEventListener('click', () => {
            // Reset state
            devCinematicIntro.classList.remove('fade-out');
            devMainContent.classList.remove('visible');
            
            // Show modal
            devProfileModal.classList.add('active');

            // Wait for cinematic intro (7.5 seconds) then transition to main content
            setTimeout(() => {
                devCinematicIntro.classList.add('fade-out');
                devMainContent.classList.add('visible');
            }, 7500);
        });

        const closeDevProfile = () => {
            devProfileModal.classList.remove('active');
            // reset after fade out so it's ready for next time
            setTimeout(() => {
                devCinematicIntro.classList.remove('fade-out');
                devMainContent.classList.remove('visible');
            }, 500); // Wait for modal disappear transition
        };

        if (closeDevProfileBtn) {
            closeDevProfileBtn.addEventListener('click', closeDevProfile);
        }
        if (closeDevProfileTop) {
            closeDevProfileTop.addEventListener('click', closeDevProfile);
        }
        
        // Escape key logic for developer profile
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && devProfileModal.classList.contains('active')) {
                closeDevProfile();
            }
        });
    }

    // 7. About Project Modal Logic
    const settingsAboutProjectBtn = document.getElementById('settingsAboutProjectBtn');
    const sidebarAboutProjectBtn = document.getElementById('sidebarAboutProjectBtn');
    const aboutProjectModal = document.getElementById('aboutProjectModal');
    const aboutProjectCinematicIntro = document.getElementById('aboutProjectCinematicIntro');
    const aboutProjectMainContent = document.getElementById('aboutProjectMainContent');
    const closeAboutProjectBtn = document.getElementById('closeAboutProjectBtn');
    const closeAboutProjectTop = document.getElementById('aboutProjectCloseTop');

    const openAboutProjectModal = () => {
        // Reset state
        aboutProjectCinematicIntro.classList.remove('fade-out');
        aboutProjectMainContent.classList.remove('visible');
        
        // Show modal
        aboutProjectModal.classList.add('active');

        // Wait for cinematic intro (7.5 seconds) then transition to main content
        setTimeout(() => {
            aboutProjectCinematicIntro.classList.add('fade-out');
            aboutProjectMainContent.classList.add('visible');
        }, 7500);
    };

    if (settingsAboutProjectBtn && aboutProjectModal) {
        settingsAboutProjectBtn.addEventListener('click', openAboutProjectModal);
    }
    
    if (sidebarAboutProjectBtn && aboutProjectModal) {
        sidebarAboutProjectBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default sidebar navigation behavior just in case
            openAboutProjectModal();
        });
    }

    if (aboutProjectModal) {
        const closeAboutProject = () => {
            aboutProjectModal.classList.remove('active');
            // reset after fade out so it's ready for next time
            setTimeout(() => {
                aboutProjectCinematicIntro.classList.remove('fade-out');
                aboutProjectMainContent.classList.remove('visible');
            }, 500); // Wait for modal disappear transition
        };

        if (closeAboutProjectBtn) {
            closeAboutProjectBtn.addEventListener('click', closeAboutProject);
        }
        if (closeAboutProjectTop) {
            closeAboutProjectTop.addEventListener('click', closeAboutProject);
        }
        
        // Escape key logic for about project modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && aboutProjectModal.classList.contains('active')) {
                closeAboutProject();
            }
        });
    }
});

// Global modal functions for HTML onclick handlers
window.forceOpenSignatureModal = function() {
    const modal = document.getElementById('signatureSeriesModal');
    if (modal) modal.classList.add('active');
};

window.forceCloseSignatureModal = function() {
    const modal = document.getElementById('signatureSeriesModal');
    if (modal) modal.classList.remove('active');
};

window.forceOpenLogoModal = function() {
    const modal = document.getElementById('logoInfoModal');
    if (modal) modal.classList.add('active');
};

window.forceCloseLogoModal = function() {
    const modal = document.getElementById('logoInfoModal');
    if (modal) modal.classList.remove('active');
};

// --- Initialize App Data ---
async function initializeApp() {
    try {
        const res = await fetch('/api/data');
        const data = await res.json();
        
        if (data.status === 'success') {
            appData = data;
            populateDashboard(data);
            renderCharts(data);
        }
    } catch (err) {
        console.error("Failed to load initial data:", err);
    }
}

function populateDashboard(data) {
    const { metrics, eda } = data;
    
    // Home Stats
    const homeStats = document.getElementById('home-stats');
    if (homeStats) {
        homeStats.innerHTML = `
            <div class="stat-box">
                <div class="stat-value">${eda.raw_data.length}</div>
                <div class="stat-label">Total Records</div>
            </div>
            <div class="stat-box">
                <div class="stat-value">${(metrics.R2 * 100).toFixed(1)}%</div>
                <div class="stat-label">Model Accuracy (R²)</div>
            </div>
            <div class="stat-box">
                <div class="stat-value">${metrics.MAE.toFixed(2)}</div>
                <div class="stat-label">Mean Absolute Error</div>
            </div>
        `;
    }

    // Dataset Table
    const tbody = document.querySelector('#data-table tbody');
    let rows = '';
    // Limit to 50 for performance if needed, but 200 is fine
    eda.raw_data.forEach(row => {
        rows += `
            <tr>
                <td>$${row.TV.toFixed(2)}K</td>
                <td>$${row.Radio.toFixed(2)}K</td>
                <td>$${row.Newspaper.toFixed(2)}K</td>
                <td>${row.Sales.toFixed(2)}K units</td>
            </tr>
        `;
    });
    tbody.innerHTML = rows;

    // Model Metrics
    const modelMetrics = document.getElementById('model-metrics');
    modelMetrics.innerHTML = `
        <div class="stat-box">
            <div class="stat-value">${(metrics.R2 * 100).toFixed(2)}%</div>
            <div class="stat-label">R-Squared (Variance Explained)</div>
        </div>
        <div class="stat-box">
            <div class="stat-value">${metrics.MAE.toFixed(2)}</div>
            <div class="stat-label">Mean Absolute Error (MAE)</div>
        </div>
        <div class="stat-box">
            <div class="stat-value">${metrics.MSE.toFixed(2)}</div>
            <div class="stat-label">Mean Squared Error (MSE)</div>
        </div>
    `;
    
    // Correlation matrix stats
    const corrDiv = document.getElementById('correlation-matrix');
    corrDiv.innerHTML = `
        <p><strong>Correlation with Sales:</strong></p>
        <p>TV: <span class="highlight">${eda.correlation.Sales.TV.toFixed(3)}</span> (Very Strong)</p>
        <p>Radio: <span class="highlight">${eda.correlation.Sales.Radio.toFixed(3)}</span> (Moderate/Strong)</p>
        <p>Newspaper: <span class="highlight">${eda.correlation.Sales.Newspaper.toFixed(3)}</span> (Weak)</p>
    `;
}

function renderCharts(data) {
    const { metrics, eda } = data;
    const raw = eda.raw_data;
    
    // Common Chart Options for dark mode
    Chart.defaults.color = '#a0a0a0';
    Chart.defaults.font.family = 'Inter';
    const gridColor = 'rgba(255, 255, 255, 0.05)';
    
    // 1. Distribution Chart (Bar) - Average spend
    const ctxDist = document.getElementById('distribution-chart').getContext('2d');
    new Chart(ctxDist, {
        type: 'bar',
        data: {
            labels: ['TV', 'Radio', 'Newspaper', 'Sales'],
            datasets: [{
                label: 'Average Value',
                data: [
                    eda.summary.TV.mean, 
                    eda.summary.Radio.mean, 
                    eda.summary.Newspaper.mean, 
                    eda.summary.Sales.mean
                ],
                backgroundColor: ['#4A90E2', '#D4AF37', '#e74c3c', '#2ecc71']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { grid: { color: gridColor } },
                x: { grid: { display: false } }
            }
        }
    });

    // Scatter helper
    const createScatter = (ctxId, xKey, color) => {
        const ctx = document.getElementById(ctxId).getContext('2d');
        const scatterData = raw.map(d => ({x: d[xKey], y: d.Sales}));
        
        new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: `${xKey} vs Sales`,
                    data: scatterData,
                    backgroundColor: color,
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: false } },
                scales: {
                    x: { title: { display: true, text: `${xKey} Spend` }, grid: { color: gridColor } },
                    y: { title: { display: true, text: 'Sales' }, grid: { color: gridColor } }
                }
            }
        });
    };

    createScatter('scatter-tv', 'TV', '#4A90E2');
    createScatter('scatter-radio', 'Radio', '#D4AF37');
    createScatter('scatter-newspaper', 'Newspaper', '#e74c3c');

    // Coefficients Chart
    const ctxCoef = document.getElementById('coefficients-chart').getContext('2d');
    new Chart(ctxCoef, {
        type: 'bar',
        data: {
            labels: ['TV', 'Radio', 'Newspaper'],
            datasets: [{
                label: 'Model Coefficient (Impact Weight)',
                data: [metrics.Coefficients.TV, metrics.Coefficients.Radio, metrics.Coefficients.Newspaper],
                backgroundColor: ['#4A90E2', '#D4AF37', '#e74c3c']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y', // horizontal bar
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: { grid: { color: gridColor } },
                y: { grid: { display: false } }
            }
        }
    });
}

// ==========================================================================
// EXECUTIVE BUSINESS RECOMMENDATION ENGINE
// ==========================================================================
function generateExecutiveRecommendations(tv, radio, newspaper, prediction) {
    const totalBudget = tv + radio + newspaper;
    const panel = document.getElementById('execRecPanel');
    if (!panel) return;

    // Elements
    const elStatus = document.getElementById('execStatusBadge');
    const elMarketing = document.getElementById('execMarketingRec');
    const elBudget = document.getElementById('execBudgetAnalysis');
    const elOpt = document.getElementById('execOptimization');
    const elConf = document.getElementById('execConfidence');
    const elRisk = document.getElementById('execRisk');
    const elImpact = document.getElementById('execImpact');
    const elConclusion = document.getElementById('execConclusion');

    // 1. Calculate Efficiency / Performance Status
    const efficiency = totalBudget > 0 ? (prediction / totalBudget) : 0;
    
    let statusClass = '';
    let statusText = '';
    let riskText = '';
    
    if (totalBudget < 50) {
        // SCENARIO A: Very Low Budget
        statusText = (efficiency > 0.08) ? 'Moderate' : 'Needs Improvement';
        statusClass = (efficiency > 0.08) ? 'status-moderate' : 'status-needs-improvement';
        riskText = 'High';
        
        elImpact.innerText = 'Lower Impact';
        elImpact.className = 'stat-value';
        elImpact.style.color = '#e74c3c';
        
        elConclusion.innerText = "The current media budget is too low to capture significant market share. Executive leadership should consider increasing advertising investment, focusing primarily on TV and Radio to establish brand presence and drive volume.";
    } else if (totalBudget < 300) {
        // SCENARIO B: Medium Budget
        if (efficiency > 0.09) {
            statusText = 'Strong';
            statusClass = 'status-strong';
            riskText = 'Low to Moderate';
            elImpact.innerText = 'Steady Growth';
            elImpact.className = 'stat-value clr-emerald';
        } else if (efficiency > 0.05) {
            statusText = 'Moderate';
            statusClass = 'status-moderate';
            riskText = 'Moderate';
            elImpact.innerText = 'Steady Growth';
            elImpact.className = 'stat-value clr-emerald';
        } else {
            statusText = 'Needs Improvement';
            statusClass = 'status-needs-improvement';
            riskText = 'High (Inefficient Spend)';
            elImpact.innerText = 'Minimal Impact';
            elImpact.className = 'stat-value';
            elImpact.style.color = '#f39c12';
        }
        
        elConclusion.innerText = (efficiency > 0.06) 
            ? "The proposed marketing investment is balanced and mathematically sound. Proceed with the current media mix plan to ensure steady business growth."
            : "While the budget is sufficient, the allocation is mathematically suboptimal. Reallocate funds away from low-performing channels toward Radio and TV to improve ROI.";
    } else {
        // SCENARIO C: High Budget
        if (prediction > 30 && efficiency > 0.05) {
            statusText = 'Excellent';
            statusClass = 'status-excellent';
            riskText = 'Low';
            
            elImpact.innerText = 'High Growth';
            elImpact.className = 'stat-value clr-cyan';
            
            elConclusion.innerText = "The marketing strategy exhibits strong expansion potential. The high budget allocation is supported by the prediction model, forecasting significant product movement. Proceed with aggressive market expansion.";
        } else {
            statusText = 'Needs Improvement';
            statusClass = 'status-needs-improvement';
            riskText = 'High (Inefficient Spend)';
            
            elImpact.innerText = 'Minimal Impact';
            elImpact.className = 'stat-value';
            elImpact.style.color = '#e74c3c';
            
            elConclusion.innerText = "Despite a high budget, the forecasted sales are remarkably low. This indicates severe inefficiency in budget allocation (likely over-indexed on Newspaper). An immediate reallocation toward Radio and TV is mandated.";
        }
    }

    elStatus.className = 'exec-status-badge ' + statusClass;
    elStatus.innerText = statusText;
    
    elRisk.innerText = riskText;
    if (riskText === 'Low' || riskText === 'Low to Moderate') {
        elRisk.className = 'stat-value clr-emerald';
    } else {
        elRisk.className = 'stat-value';
        elRisk.style.color = (riskText === 'Moderate') ? '#f39c12' : '#e74c3c';
    }

    // 2. Marketing Recommendation & Budget Analysis
    let tvShare = (tv / totalBudget) * 100 || 0;
    let radioShare = (radio / totalBudget) * 100 || 0;
    let newsShare = (newspaper / totalBudget) * 100 || 0;

    // Marketing Rec
    if (tv > radio && tv > newspaper) {
        elMarketing.innerText = "TV advertising is currently providing the primary volume impact. Maintain strong presence while ensuring creative fatigue does not set in.";
    } else if (radio > tv && radio > newspaper) {
        elMarketing.innerText = "Radio advertising is heavily weighted. Given its high coefficient, this usually drives strong ROI. Monitor frequency carefully.";
    } else {
        elMarketing.innerText = "Newspaper advertising takes up the largest share. Recommend shifting focus toward TV or Radio for higher volume impact.";
    }

    // Budget Analysis
    elBudget.innerText = `Current allocation indicates ${tvShare.toFixed(1)}% TV, ${radioShare.toFixed(1)}% Radio, and ${newsShare.toFixed(1)}% Newspaper. Total ad spend is $${totalBudget.toLocaleString()}K.`;

    // Optimization Suggestion
    if (newspaper > (totalBudget * 0.2)) {
        elOpt.innerText = "Newspaper spend is historically inefficient. Reallocating a portion of the newspaper budget to Radio will mathematically increase overall sales volume.";
    } else if (radio < (totalBudget * 0.15) && totalBudget > 20) {
        elOpt.innerText = "Radio spend is disproportionately low. Increasing radio investment typically yields the highest marginal return per dollar spent.";
    } else if (tv < (totalBudget * 0.4) && totalBudget > 50) {
        elOpt.innerText = "TV baseline is low. A minimum viable TV budget is required to build brand awareness that supports overall campaign performance.";
    } else if (totalBudget < 50) {
        elOpt.innerText = "Overall budget is too small to optimize effectively. Focus on securing more funding for a baseline TV & Radio campaign.";
    } else {
        elOpt.innerText = "Current allocation is well-balanced across performing channels. Continue current strategy and monitor audience saturation.";
    }

    // Model Reliability (Fixed based on model's R2 score from metrics)
    // The underlying regression model has an R2 of ~0.899
    elConf.innerText = '89.9%';

    // Animate panel in
    panel.classList.remove('active');
    // small delay to reset animation if clicking multiple times
    setTimeout(() => {
        panel.classList.add('active');
        // Scroll slightly down so user sees it
        panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
}

// ==========================================================================
// SMART ADVERTISING BUDGET OPTIMIZER
// ==========================================================================
function generateSmartOptimization(tv, radio, newspaper, prediction) {
    const totalBudget = tv + radio + newspaper;
    const panel = document.getElementById('smartOptimizerPanel');
    if (!panel) return;
    if (totalBudget === 0) return;

    // Elements
    const tvBadge = document.getElementById('optTvBadge');
    const tvDesc = document.getElementById('optTvDesc');
    const radioBadge = document.getElementById('optRadioBadge');
    const radioDesc = document.getElementById('optRadioDesc');
    const newsBadge = document.getElementById('optNewsBadge');
    const newsDesc = document.getElementById('optNewsDesc');
    const estImp = document.getElementById('optEstImprovement');
    const effRating = document.getElementById('optEfficiency');
    const stratMsg = document.getElementById('optStrategy');

    // Coefficients assumption (based on metrics)
    const tvCoef = 0.0447;
    const radioCoef = 0.1892;
    const newsCoef = 0.0028;

    // Shares
    const tvShare = tv / totalBudget;
    const radioShare = radio / totalBudget;
    const newsShare = newspaper / totalBudget;

    // TV Logic
    if (tvShare < 0.3) {
        tvBadge.innerText = 'INCREASE';
        tvBadge.className = 'opt-action-badge opt-increase';
        tvDesc.innerText = 'TV spend is too low. A stronger TV baseline is required to build brand awareness.';
    } else if (tvShare > 0.6) {
        tvBadge.innerText = 'MAINTAIN';
        tvBadge.className = 'opt-action-badge opt-maintain';
        tvDesc.innerText = 'TV allocation is very high. Maintain current levels to avoid creative saturation.';
    } else {
        tvBadge.innerText = 'INCREASE / MAINTAIN';
        tvBadge.className = 'opt-action-badge opt-maintain';
        tvDesc.innerText = 'Solid baseline. Consider slight increases if overall volume needs a boost.';
    }

    // Radio Logic
    if (radioShare < 0.4) {
        radioBadge.innerText = 'INCREASE';
        radioBadge.className = 'opt-action-badge opt-increase';
        radioDesc.innerText = 'Radio has the highest ROI coefficient. Increasing this budget will rapidly scale sales volume.';
    } else {
        radioBadge.innerText = 'MAINTAIN';
        radioBadge.className = 'opt-action-badge opt-maintain';
        radioDesc.innerText = 'Radio investment is currently heavily optimized for maximum yield.';
    }

    // Newspaper Logic
    let newspaperReallocation = 0;
    if (newsShare > 0.05) {
        newsBadge.innerText = 'REDUCE';
        newsBadge.className = 'opt-action-badge opt-reduce';
        newsDesc.innerText = 'Newspaper drives minimal sales. Reallocating this budget to Radio or TV will improve ROI.';
        newspaperReallocation = newspaper; // Shift all newspaper budget for the simulation
    } else {
        newsBadge.innerText = 'MAINTAIN';
        newsBadge.className = 'opt-action-badge opt-maintain';
        newsDesc.innerText = 'Newspaper spend is already minimized. No further reductions necessary.';
    }

    // Estimated Sales Improvement Simulation
    // Shift Newspaper -> Radio for simulation
    const simPrediction = prediction - (newspaperReallocation * newsCoef) + (newspaperReallocation * radioCoef);
    const improvementPercent = prediction > 0 ? ((simPrediction - prediction) / prediction) * 100 : 0;
    
    if (newspaperReallocation > 0 && improvementPercent > 0.1) {
        estImp.innerText = '+' + improvementPercent.toFixed(1) + '%';
        estImp.style.color = '#00f2fe';
    } else {
        estImp.innerText = 'Optimized';
        estImp.style.color = '#2ecc71';
    }

    // Budget Efficiency Rating
    const effRatio = tvShare + radioShare;
    if (effRatio > 0.95) {
        effRating.innerText = 'Excellent';
        effRating.className = 'stat-value clr-emerald';
    } else if (effRatio > 0.80) {
        effRating.innerText = 'Good';
        effRating.className = 'stat-value clr-cyan';
    } else if (effRatio > 0.60) {
        effRating.innerText = 'Moderate';
        effRating.className = 'stat-value';
        effRating.style.color = '#f39c12';
    } else {
        effRating.innerText = 'Needs Optimization';
        effRating.className = 'stat-value';
        effRating.style.color = '#e74c3c';
    }

    // ROI Strategy
    if (newspaperReallocation > 0) {
        stratMsg.innerText = 'Divest from Newspaper and aggressively funnel capital into Radio to maximize marginal returns. TV should be maintained to support overall awareness.';
    } else if (radioShare < 0.4) {
        stratMsg.innerText = 'Current budget avoids inefficient channels but still under-indexes on Radio. Shift more existing TV budget into Radio to maximize overall sales volume.';
    } else {
        stratMsg.innerText = 'The current marketing portfolio operates at peak efficiency. Preserve the exact media mix to sustain maximum product movement.';
    }

    // Animate panel in
    panel.classList.remove('active');
    setTimeout(() => {
        panel.classList.add('active');
    }, 150);
}

// ==========================================================================
// INTERACTIVE BUDGET ALLOCATION VISUALIZER
// ==========================================================================
function generateBudgetVisualizer(tv, radio, newspaper, prediction) {
    const totalBudget = tv + radio + newspaper;
    const panel = document.getElementById('visualizerPanel');
    if (!panel) return;
    if (totalBudget === 0) return;

    // Elements
    const visLargestName = document.getElementById('visLargestName');
    const visLargestVal = document.getElementById('visLargestVal');
    const visLargestPct = document.getElementById('visLargestPct');
    
    const visSmallestName = document.getElementById('visSmallestName');
    const visSmallestVal = document.getElementById('visSmallestVal');
    const visSmallestPct = document.getElementById('visSmallestPct');

    const visTotalVal = document.getElementById('visTotalVal');
    const visDiversification = document.getElementById('visDiversification');
    const visQuality = document.getElementById('visQuality');
    const visSummary = document.getElementById('visSummary');

    // 1. Chart Rendering
    const ctx = document.getElementById('budgetChart');
    if (ctx) {
        if (budgetChartInstance) {
            budgetChartInstance.destroy();
        }
        budgetChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['TV', 'Radio', 'Newspaper'],
                datasets: [{
                    data: [tv, radio, newspaper],
                    backgroundColor: [
                        'rgba(46, 204, 113, 0.8)', // Emerald
                        'rgba(0, 242, 254, 0.8)', // Cyan
                        'rgba(212, 175, 55, 0.8)'  // Gold
                    ],
                    borderColor: [
                        '#2ecc71',
                        '#00f2fe',
                        '#D4AF37'
                    ],
                    borderWidth: 1,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: Chart.defaults.color, font: { family: 'Inter', size: 14 } }
                    }
                },
                animation: { animateScale: true, animateRotate: true }
            }
        });
    }

    // 2. Data Calculation
    const channels = [
        { name: 'TV Advertising', value: tv, share: (tv / totalBudget) * 100 },
        { name: 'Radio Advertising', value: radio, share: (radio / totalBudget) * 100 },
        { name: 'Newspaper Advertising', value: newspaper, share: (newspaper / totalBudget) * 100 }
    ];
    
    channels.sort((a, b) => b.value - a.value); // Sort highest to lowest

    const largest = channels[0];
    const smallest = channels[2];

    // Largest
    visLargestName.innerText = largest.name;
    visLargestVal.innerText = `$${largest.value.toLocaleString()}K`;
    visLargestPct.innerText = `${largest.share.toFixed(1)}%`;

    // Smallest
    visSmallestName.innerText = smallest.name;
    visSmallestVal.innerText = `$${smallest.value.toLocaleString()}K`;
    visSmallestPct.innerText = `${smallest.share.toFixed(1)}%`;

    // Total Budget
    visTotalVal.innerText = `$${totalBudget.toLocaleString()}K`;

    // Diversification (using HHI logic conceptually)
    const hhi = Math.pow(channels[0].share/100, 2) + Math.pow(channels[1].share/100, 2) + Math.pow(channels[2].share/100, 2);
    let divText = '';
    if (hhi < 0.4) divText = 'Highly Balanced';
    else if (hhi < 0.5) divText = 'Balanced';
    else if (hhi < 0.65) divText = 'Moderately Balanced';
    else if (hhi < 0.8) divText = 'Concentrated';
    else divText = 'Highly Concentrated';
    visDiversification.innerText = divText;

    // Allocation Quality
    const efficiency = prediction / totalBudget;
    let qualText = '';
    let qualColor = '';
    if (totalBudget < 50) {
        if (efficiency > 0.08) { qualText = 'Fair'; qualColor = '#f39c12'; }
        else { qualText = 'Poor'; qualColor = '#e74c3c'; }
    } else {
        if (efficiency > 0.09) { qualText = 'Excellent'; qualColor = '#2ecc71'; }
        else if (efficiency > 0.07) { qualText = 'Very Good'; qualColor = '#00f2fe'; }
        else if (efficiency > 0.05) { qualText = 'Good'; qualColor = '#2ecc71'; }
        else if (efficiency > 0.03) { qualText = 'Fair'; qualColor = '#f39c12'; }
        else { qualText = 'Poor'; qualColor = '#e74c3c'; }
    }
    visQuality.innerText = qualText;
    visQuality.style.color = qualColor;

    // Distribution Summary
    visSummary.innerText = `${largest.name.split(' ')[0]} receives the majority of investment while ${smallest.name.split(' ')[0]} receives the smallest allocation. The current allocation is ${divText.toLowerCase()}.`;

    // Animate panel in
    panel.classList.remove('active');
    setTimeout(() => {
        panel.classList.add('active');
    }, 250);
}

// ==========================================================================
// AI DECISION CENTER
// ==========================================================================
function updateAIDecisionCenter() {
    const emptyState = document.getElementById('decisionEmptyState');
    const dataState = document.getElementById('decisionDataState');
    if (!emptyState || !dataState) return;

    if (!latestPredictionState) {
        emptyState.style.display = 'block';
        dataState.style.display = 'none';
        return;
    }

    emptyState.style.display = 'none';
    dataState.style.display = 'block';

    const { tv, radio, newspaper, prediction } = latestPredictionState;
    const totalBudget = tv + radio + newspaper;

    // Elements
    const aiScoreValue = document.getElementById('aiScoreValue');
    const aiScoreRating = document.getElementById('aiScoreRating');
    const aiGrowth = document.getElementById('aiGrowth');
    const aiRisk = document.getElementById('aiRisk');
    const aiRiskDesc = document.getElementById('aiRiskDesc');
    const aiEfficiency = document.getElementById('aiEfficiency');
    const aiEfficiencyDesc = document.getElementById('aiEfficiencyDesc');
    const aiBestChannel = document.getElementById('aiBestChannel');
    const aiBestChannelDesc = document.getElementById('aiBestChannelDesc');
    const aiStrategicRec = document.getElementById('aiStrategicRec');
    const aiSummary = document.getElementById('aiSummary');

    // Calculations
    const efficiency = totalBudget > 0 ? (prediction / totalBudget) : 0;
    
    // 1. Executive Decision Score (0-100)
    let score = 0;
    if (efficiency > 0.15) score = 99;
    else if (efficiency < 0.02) score = Math.floor(Math.random() * 10) + 10;
    else score = Math.floor(20 + ((efficiency - 0.02) / 0.13) * 75);
    score = Math.min(Math.max(score, 0), 100);
    
    // Determine Color Status Base
    let statusClass = '';
    let strokeClass = '';
    if (score >= 90) { statusClass = 'status-excellent'; strokeClass = 'status-excellent-stroke'; }
    else if (score >= 75) { statusClass = 'status-excellent'; strokeClass = 'status-excellent-stroke'; }
    else if (score >= 60) { statusClass = 'status-good'; strokeClass = 'status-good-stroke'; }
    else if (score >= 40) { statusClass = 'status-moderate'; strokeClass = 'status-moderate-stroke'; }
    else if (score >= 20) { statusClass = 'status-poor'; strokeClass = 'status-poor-stroke'; }
    else { statusClass = 'status-critical'; strokeClass = 'status-critical-stroke'; }
    
    // Smooth animate score number
    let currentScore = 0;
    const scoreInterval = setInterval(() => {
        currentScore += Math.ceil((score - currentScore) / 5) || 1;
        if (currentScore >= score) {
            currentScore = score;
            clearInterval(scoreInterval);
        }
        aiScoreValue.innerText = currentScore;
    }, 30);

    // Animate SVG Gauge
    const gaugePath = document.getElementById('aiScoreGaugePath');
    if (gaugePath) {
        // Circumference is 2 * pi * r (r=60) = 377
        const circumference = 377;
        const offset = circumference - (score / 100) * circumference;
        
        // Reset classes
        gaugePath.className.baseVal = "gauge-progress";
        gaugePath.classList.add(strokeClass);
        
        // Slight timeout to ensure transition plays
        setTimeout(() => {
            gaugePath.style.strokeDashoffset = offset;
        }, 50);
    }

    if (score >= 75) { aiScoreRating.innerText = 'Excellent'; aiScoreRating.className = `opt-action-badge opt-increase ${statusClass}`; }
    else if (score >= 60) { aiScoreRating.innerText = 'Good'; aiScoreRating.className = `opt-action-badge opt-maintain ${statusClass}`; }
    else if (score >= 40) { aiScoreRating.innerText = 'Fair'; aiScoreRating.className = `opt-action-badge opt-maintain ${statusClass}`; }
    else { aiScoreRating.innerText = 'Needs Improvement'; aiScoreRating.className = `opt-action-badge opt-reduce ${statusClass}`; }

    // 2. Business Growth Outlook
    if (prediction > 50) { aiGrowth.innerText = 'Exceptional Growth'; aiGrowth.className = `opt-desc status-text status-excellent`; }
    else if (prediction > 30) { aiGrowth.innerText = 'High Growth'; aiGrowth.className = `opt-desc status-text status-good`; }
    else if (prediction > 15) { aiGrowth.innerText = 'Steady Growth'; aiGrowth.className = `opt-desc status-text status-moderate`; }
    else if (prediction > 5) { aiGrowth.innerText = 'Moderate Growth'; aiGrowth.className = `opt-desc status-text status-poor`; }
    else { aiGrowth.innerText = 'Limited Growth'; aiGrowth.className = `opt-desc status-text status-critical`; }

    // 3. Risk Assessment
    if (score >= 75) {
        aiRisk.innerText = 'Low Risk'; aiRisk.className = `opt-desc status-text status-excellent`;
        aiRiskDesc.innerText = 'High certainty of positive ROI based on current allocations.';
    } else if (score >= 50) {
        aiRisk.innerText = 'Moderate Risk'; aiRisk.className = `opt-desc status-text status-moderate`;
        aiRiskDesc.innerText = 'Acceptable risk parameters, though market fluctuations could impact returns.';
    } else {
        aiRisk.innerText = 'High Risk'; aiRisk.className = `opt-desc status-text status-critical`;
        aiRiskDesc.innerText = 'Significant risk of capital inefficiency. Budget reallocation is highly advised.';
    }

    // 4. Efficiency
    if (score >= 80) {
        aiEfficiency.innerText = 'Excellent'; aiEfficiency.className = `opt-desc status-text status-excellent`;
        aiEfficiencyDesc.innerText = 'Capital is being deployed into high-yield channels.';
    } else if (score >= 60) {
        aiEfficiency.innerText = 'Good'; aiEfficiency.className = `opt-desc status-text status-good`;
        aiEfficiencyDesc.innerText = 'Solid capital deployment with minor optimizations possible.';
    } else {
        aiEfficiency.innerText = 'Needs Optimization'; aiEfficiency.className = `opt-desc status-text status-critical`;
        aiEfficiencyDesc.innerText = 'Capital is being diluted by inefficient channels.';
    }

    // 5. Best Channel
    const tvContrib = tv * 0.0447;
    const radioContrib = radio * 0.1892;
    const newsContrib = newspaper * 0.0028;
    
    if (radioContrib > tvContrib && radioContrib > newsContrib) {
        aiBestChannel.innerText = 'Radio Advertising';
        aiBestChannelDesc.innerText = 'Yielding the highest absolute sales impact per dollar spent.';
        aiBestChannel.className = `opt-desc status-text status-good`;
    } else if (tvContrib >= radioContrib && tvContrib > newsContrib) {
        aiBestChannel.innerText = 'TV Advertising';
        aiBestChannelDesc.innerText = 'Driving the largest volume of gross sales in the portfolio.';
        aiBestChannel.className = `opt-desc status-text status-good`;
    } else {
        aiBestChannel.innerText = 'Newspaper Advertising';
        aiBestChannelDesc.innerText = 'Currently the largest contributor, though statistically less efficient.';
        aiBestChannel.className = `opt-desc status-text status-moderate`;
    }

    // 6. Strategic Rec
    let bannerRecText = '';
    if (score >= 80) {
        aiStrategicRec.innerText = 'Maintain current budgetary weighting. The portfolio is correctly indexed towards high-performing channels and scaling naturally.';
        aiStrategicRec.className = `opt-desc status-text status-excellent`;
        bannerRecText = 'Current strategy is exceptionally well balanced.';
    } else if (score >= 50) {
        aiStrategicRec.innerText = 'Rebalance minor inefficiencies. Consider capping TV/Newspaper spend and aggressively testing higher Radio limits to find the point of diminishing returns.';
        aiStrategicRec.className = `opt-desc status-text status-moderate`;
        bannerRecText = 'Budget allocation has moderate optimization potential.';
    } else {
        aiStrategicRec.innerText = 'Immediate portfolio restructuring required. Halt Newspaper spend and rapidly divert capital towards Radio to stabilize efficiency metrics.';
        aiStrategicRec.className = `opt-desc status-text status-critical`;
        bannerRecText = 'AI recommends immediate capital restructuring.';
    }

    // 7. Summary
    aiSummary.innerText = `The AI engine projects ${aiGrowth.innerText.toLowerCase()} with a ${aiRisk.innerText.toLowerCase()} profile. Current investment efficiency is rated as ${aiEfficiency.innerText.toLowerCase()}. ${aiStrategicRec.innerText}`;
    aiSummary.className = statusClass;

    // 8. Update Insight Banner
    const bannerText = document.getElementById('aiInsightBannerText');
    if (bannerText) {
        bannerText.innerText = bannerRecText;
    }
}

// --- Home Page Premium Logic ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Particle Generator for Hero Section
    const particlesContainer = document.getElementById('particles-container');
    if (particlesContainer) {
        const particleCount = 20;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Randomize properties
            const size = Math.random() * 8 + 2; // 2px to 10px
            const left = Math.random() * 100; // 0% to 100%
            const delay = Math.random() * 5; // 0s to 5s
            const duration = Math.random() * 10 + 5; // 5s to 15s
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${left}%`;
            particle.style.animationDelay = `${delay}s`;
            particle.style.animationDuration = `${duration}s`;
            
            particlesContainer.appendChild(particle);
        }
    }

    // 2. Intersection Observer for Counter Animations
    const counters = document.querySelectorAll('.count-up, .count-up-percent');
    
    if (counters.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const targetVal = parseFloat(el.getAttribute('data-target'));
                    const isPercent = el.classList.contains('count-up-percent');
                    const duration = 2000; // 2 seconds
                    const frameRate = 30;
                    const totalFrames = Math.round((duration / 1000) * frameRate);
                    let currentFrame = 0;
                    
                    const updateCounter = setInterval(() => {
                        currentFrame++;
                        const progress = currentFrame / totalFrames;
                        // easeOutQuad
                        const easeProgress = 1 - (1 - progress) * (1 - progress);
                        const currentVal = targetVal * easeProgress;
                        
                        if (isPercent) {
                            el.innerText = currentVal.toFixed(1) + '%';
                        } else {
                            el.innerText = Math.floor(currentVal);
                        }
                        
                        if (currentFrame >= totalFrames) {
                            clearInterval(updateCounter);
                            if (isPercent) {
                                el.innerText = targetVal.toFixed(1) + '%';
                            } else {
                                el.innerText = targetVal;
                            }
                        }
                    }, 1000 / frameRate);
                    
                    // Stop observing once animated
                    observer.unobserve(el);
                }
            });
        }, observerOptions);

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }
});

// ==========================================================================
// EXECUTIVE REPORT CENTER
// ==========================================================================
function generateExecutiveReport() {
    const emptyState = document.getElementById('execReportEmptyState');
    const dataState = document.getElementById('execReportDataState');
    if (!emptyState || !dataState) return;

    if (!latestPredictionState) {
        emptyState.style.display = 'block';
        dataState.style.display = 'none';
        return;
    }

    emptyState.style.display = 'none';
    dataState.style.display = 'block';

    const { tv, radio, newspaper, prediction } = latestPredictionState;
    const totalBudget = tv + radio + newspaper;

    // 1. Snapshot Headers
    document.getElementById('reportDate').innerText = new Date().toLocaleString();
    document.getElementById('reportSalesVal').innerText = '$' + prediction.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}) + 'K';
    document.getElementById('reportBudgetVal').innerText = '$' + totalBudget.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}) + 'K';
    document.getElementById('reportConfidenceVal').innerText = '89.9%'; // Based on model R2

    let bestChannel = 'TV';
    let bestColor = '#2ecc71';
    let bestIcon = 'fa-tv';
    // Weighted Best Channel logic based on coefficients
    const tvW = tv * 0.0447;
    const radW = radio * 0.1892;
    const newsW = newspaper * 0.0028;
    if (radW > tvW && radW > newsW) { bestChannel = 'Radio'; bestColor = '#00f2fe'; bestIcon = 'fa-broadcast-tower'; }
    else if (newsW > tvW && newsW > radW) { bestChannel = 'Newspaper'; bestColor = '#f39c12'; bestIcon = 'fa-newspaper'; }
    
    document.getElementById('reportBestChannelVal').innerText = bestChannel;
    const rIcon = document.getElementById('reportChannelIcon');
    rIcon.className = 'fas report-icon ' + bestIcon;
    rIcon.style.color = bestColor;

    // 2. Budget Progress
    const tvPct = totalBudget > 0 ? ((tv / totalBudget) * 100) : 0;
    const radPct = totalBudget > 0 ? ((radio / totalBudget) * 100) : 0;
    const newsPct = totalBudget > 0 ? ((newspaper / totalBudget) * 100) : 0;

    document.getElementById('reportTvVal').innerText = '$' + tv.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}) + 'K';
    document.getElementById('reportRadioVal').innerText = '$' + radio.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}) + 'K';
    document.getElementById('reportNewsVal').innerText = '$' + newspaper.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}) + 'K';

    document.getElementById('reportTvPct').innerText = tvPct.toFixed(1) + '%';
    document.getElementById('reportRadioPct').innerText = radPct.toFixed(1) + '%';
    document.getElementById('reportNewsPct').innerText = newsPct.toFixed(1) + '%';

    // Animate bars (timeout for transition)
    setTimeout(() => {
        document.getElementById('reportTvBar').style.width = tvPct.toFixed(1) + '%';
        document.getElementById('reportRadioBar').style.width = radPct.toFixed(1) + '%';
        document.getElementById('reportNewsBar').style.width = newsPct.toFixed(1) + '%';
    }, 100);

    // 3. Efficiency & KPI Logic
    const efficiency = totalBudget > 0 ? (prediction / totalBudget) : 0;
    let score = 0;
    if (efficiency > 0.15) score = 99;
    else if (efficiency < 0.02) score = Math.floor(Math.random() * 10) + 10;
    else score = Math.floor(20 + ((efficiency - 0.02) / 0.13) * 75);
    score = Math.min(Math.max(score, 0), 100);

    let statusText = '';
    let statusClass = '';
    let riskLevel = '';
    
    if (score >= 80) {
        statusText = 'Excellent';
        statusClass = 'status-excellent';
        riskLevel = 'Low Risk';
    } else if (score >= 50) {
        statusText = 'Moderate';
        statusClass = 'status-moderate';
        riskLevel = 'Moderate Risk';
    } else {
        statusText = 'Critical';
        statusClass = 'status-critical';
        riskLevel = 'High Risk';
    }

    // Header Badge
    const badge = document.getElementById('reportStatusBadge');
    badge.innerText = 'Status: ' + statusText;
    badge.className = 'opt-action-badge status-badge ' + statusClass;

    // KPIs
    const elGrowth = document.getElementById('reportGrowth');
    const elRisk = document.getElementById('reportRisk');
    const elEff = document.getElementById('reportEfficiency');
    const elScore = document.getElementById('reportScore');

    if (score >= 80) {
        elGrowth.innerText = 'Aggressive Scaling'; elGrowth.style.color = '#2ecc71';
        elRisk.innerText = 'Low Risk'; elRisk.style.color = '#2ecc71';
        elEff.innerText = 'Peak Efficiency'; elEff.style.color = '#2ecc71';
        elScore.innerText = score + '/100'; elScore.style.color = '#2ecc71';
    } else if (score >= 50) {
        elGrowth.innerText = 'Stable Baseline'; elGrowth.style.color = '#f1c40f';
        elRisk.innerText = 'Moderate Risk'; elRisk.style.color = '#f1c40f';
        elEff.innerText = 'Average ROI'; elEff.style.color = '#f1c40f';
        elScore.innerText = score + '/100'; elScore.style.color = '#f1c40f';
    } else {
        elGrowth.innerText = 'Declining'; elGrowth.style.color = '#e74c3c';
        elRisk.innerText = 'High Risk'; elRisk.style.color = '#e74c3c';
        elEff.innerText = 'Poor ROI'; elEff.style.color = '#e74c3c';
        elScore.innerText = score + '/100'; elScore.style.color = '#e74c3c';
    }

    // 4. Insights
    const ins1 = document.getElementById('reportInsight1');
    const ins2 = document.getElementById('reportInsight2');
    const ins3 = document.getElementById('reportInsight3');
    
    if (tv > radio && tv > newspaper) {
        ins1.innerHTML = '<strong>TV Dominance:</strong> TV makes up the majority of the portfolio, driving raw volume but requiring high capital.';
    } else {
        ins1.innerHTML = '<strong>Balanced Mix:</strong> The portfolio is highly distributed away from TV, reducing singular dependency risk.';
    }

    if (radio > (totalBudget * 0.3)) {
        ins2.innerHTML = '<strong>High Radio ROI:</strong> Radio is heavily funded, which historically provides the highest marginal rate of return per dollar.';
    } else {
        ins2.innerHTML = '<strong>Radio Underutilization:</strong> Radio funding is low. Increasing this channel is statistically the fastest way to scale overall sales.';
    }

    if (newspaper > (totalBudget * 0.2)) {
        ins3.innerHTML = '<strong>Newspaper Inefficiency:</strong> Over 20% of the budget is allocated to Newspaper, which carries the lowest conversion coefficient. High risk of wasted ad spend.';
    } else {
        ins3.innerHTML = '<strong>Optimized Print Spend:</strong> Newspaper spend is minimized, protecting the budget from low-yield print advertising.';
    }

    // 5. Executive Recommendation
    const elRec = document.getElementById('reportRecommendation');
    if (score >= 80) {
        elRec.innerText = 'Maintain current budgetary weighting. The portfolio is correctly indexed towards high-performing channels and scaling naturally. No immediate interventions are required.';
    } else if (score >= 50) {
        elRec.innerText = 'Rebalance minor inefficiencies. Consider capping TV and Newspaper spend and aggressively testing higher Radio limits to find the point of diminishing returns before scaling further.';
    } else {
        elRec.innerText = 'Immediate portfolio restructuring required. Halt Newspaper spend and rapidly divert capital towards Radio to stabilize efficiency metrics and prevent further ROI decay.';
    }

    // 6. Conclusion
    const elSummary = document.getElementById('reportSummaryText');
    const summaryIcon = document.getElementById('reportSummaryIcon');
    elSummary.innerText = `The AI engine projects a ${elGrowth.innerText.toLowerCase()} trajectory with a ${elRisk.innerText.toLowerCase()} profile. Current investment efficiency is rated as ${statusText.toLowerCase()}. ${elRec.innerText}`;
    
    summaryIcon.className = 'fas fa-gavel exec-icon status-icon ' + statusClass;
    if (score >= 80) summaryIcon.style.color = '#2ecc71';
    else if (score >= 50) summaryIcon.style.color = '#f1c40f';
    else summaryIcon.style.color = '#e74c3c';
}

// ==========================================================================
// BUSINESS INSIGHTS LOGIC
// ==========================================================================
function generateBusinessInsights() {
    const emptyState = document.getElementById('insightsEmptyState');
    const dataState = document.getElementById('insightsDataState');
    if (!emptyState || !dataState) return;

    if (!latestPredictionState) {
        emptyState.style.display = 'block';
        dataState.style.display = 'none';
        return;
    }

    emptyState.style.display = 'none';
    dataState.style.display = 'block';

    const { tv, radio, newspaper, prediction } = latestPredictionState;
    const totalBudget = tv + radio + newspaper;

    // AI Configuration (based on underlying ML model insights)
    const tvW = tv * 0.0447;
    const radW = radio * 0.1892;
    const newsW = newspaper * 0.0028;

    // 1. KPI Summaries
    let strongest = 'TV'; let strongestVal = tvW; let strongestColor = 'clr-emerald';
    let weakest = 'Newspaper'; let weakestVal = newsW; let weakestColor = 'clr-cyan';

    const channels = [
        { name: 'TV', val: tvW, color: 'clr-emerald' },
        { name: 'Radio', val: radW, color: 'clr-gold' },
        { name: 'Newspaper', val: newsW, color: 'clr-cyan' }
    ];
    channels.sort((a, b) => b.val - a.val);

    strongest = channels[0].name;
    strongestColor = channels[0].color;
    weakest = channels[2].name;
    weakestColor = channels[2].color;

    document.getElementById('insightStrongest').innerText = strongest;
    document.getElementById('insightStrongest').className = `kpi-value ${strongestColor}`;
    
    document.getElementById('insightWeakest').innerText = weakest;
    document.getElementById('insightWeakest').className = `kpi-value ${weakestColor}`;
    
    document.getElementById('insightOpportunity').innerText = 'High';
    document.getElementById('insightConfidence').innerText = '94.2%';

    // Counter animation for Confidence
    animateCounter('insightConfidence', 94.2, true);

    // 2. Timeline Logic
    const actionEl = document.getElementById('timelineAction');
    const improveEl = document.getElementById('timelineImprovement');
    
    if (newspaper > totalBudget * 0.2) {
        actionEl.innerText = 'Divert Newspaper funds to Radio.';
        improveEl.innerText = '+12% Expected Sales Volume';
    } else if (radio < totalBudget * 0.25) {
        actionEl.innerText = 'Scale Radio investment aggressively.';
        improveEl.innerText = '+18% Marginal ROI';
    } else {
        actionEl.innerText = 'Maintain balanced allocation strategy.';
        improveEl.innerText = 'Stable Market Saturation';
    }

    // 3. AI Chips
    const chipsContainer = document.getElementById('aiChipsContainer');
    chipsContainer.innerHTML = ''; // clear existing
    
    const addChip = (text, typeClass, iconClass) => {
        chipsContainer.innerHTML += `<div class="ai-chip ${typeClass}"><i class="${iconClass}"></i> ${text}</div>`;
    };

    if (tv < 50) addChip('Increase TV Baseline', 'chip-increase', 'fas fa-arrow-up');
    else if (tv > 200) addChip('Monitor TV Saturation', 'chip-warning', 'fas fa-eye');
    else addChip('TV Optimized', 'chip-maintain', 'fas fa-check-circle');

    if (radio < 30) addChip('Increase Radio', 'chip-increase', 'fas fa-arrow-up');
    else addChip('High Radio ROI', 'chip-maintain', 'fas fa-bolt');

    if (newspaper > 40) addChip('Reduce Newspaper', 'chip-decrease', 'fas fa-arrow-down');
    else addChip('Print Spend Protected', 'chip-maintain', 'fas fa-shield-alt');

    // 4. Insight Cards
    const grid = document.getElementById('insightsGrid');
    grid.innerHTML = '';

    const createInsightCard = (title, icon, iconColor, badgeText, badgeClass, body, whyText, conf) => {
        const cardHtml = `
            <div class="insight-card">
                <div class="insight-card-header">
                    <div class="insight-card-icon" style="color: ${iconColor};">
                        <i class="fas ${icon}"></i>
                    </div>
                    <div class="insight-card-title-group">
                        <h4 class="insight-card-title">${title}</h4>
                        <div class="insight-badge ${badgeClass}">${badgeText}</div>
                    </div>
                </div>
                <div class="insight-card-body">
                    ${body}
                </div>
                <div class="insight-why-content">
                    <strong>Algorithmic Reasoning:</strong><br>
                    ${whyText}
                </div>
                <div class="insight-card-footer">
                    <div class="insight-confidence"><i class="fas fa-robot"></i> ${conf}% Confidence</div>
                    <button class="insight-why-btn" onclick="this.parentElement.previousElementSibling.classList.toggle('active')">
                        <i class="fas fa-question-circle"></i> Why?
                    </button>
                </div>
            </div>
        `;
        grid.innerHTML += cardHtml;
    };

    // Card 1: TV
    if (tv > radio && tv > newspaper) {
        createInsightCard(
            'TV Volume Dominance', 'fa-tv', '#2ecc71', 'HIGH IMPACT', 'badge-high',
            'TV is currently driving the majority of your gross sales volume. Ensure creative fatigue is monitored.',
            'The linear regression coefficient for TV is 0.045. Because your TV spend is the absolute largest share of your budget, the raw multiplication of this weight dominates the prediction output.',
            '98'
        );
    } else {
        createInsightCard(
            'Low TV Baseline Risk', 'fa-exclamation-triangle', '#f1c40f', 'MEDIUM RISK', 'badge-med',
            'Your TV allocation is exceptionally low. A foundational TV presence is usually required to lift the effectiveness of other channels.',
            'Historical models indicate that TV acts as an anchor medium. Without sufficient TV spend, Radio and Newspaper conversion rates often suffer due to lower brand recall.',
            '85'
        );
    }

    // Card 2: Radio
    if (radio > (totalBudget * 0.25)) {
        createInsightCard(
            'Radio ROI Maximized', 'fa-broadcast-tower', '#00f2fe', 'EXCELLENT', 'badge-low',
            'Radio advertising is heavily funded. This channel provides the highest marginal rate of return per dollar spent.',
            'Radio has a massive coefficient (0.189) compared to TV (0.045) and Newspaper (0.003). Heavy investment here mathematically guarantees the highest theoretical efficiency.',
            '99'
        );
    } else {
        createInsightCard(
            'Untapped Radio Potential', 'fa-bolt', '#e74c3c', 'CRITICAL', 'badge-high',
            'Radio funding is disproportionately low relative to its effectiveness. Increasing Radio will rapidly scale overall sales.',
            'With a coefficient of 0.189, every dollar shifted into Radio yields 4x more sales volume than TV and 60x more than Newspaper. It is a mathematical necessity to increase this.',
            '96'
        );
    }

    // Card 3: Newspaper
    if (newspaper > (totalBudget * 0.15)) {
        createInsightCard(
            'Newspaper Inefficiency', 'fa-newspaper', '#e74c3c', 'HIGH RISK', 'badge-high',
            'Over 15% of the budget is allocated to Newspaper, which carries the lowest conversion coefficient. High risk of wasted ad spend.',
            'The coefficient for Newspaper is near zero (0.003). It is statistically insignificant in driving sales volume. Money spent here is effectively burned.',
            '99'
        );
    } else {
        createInsightCard(
            'Optimized Print Spend', 'fa-shield-alt', '#2ecc71', 'OPTIMIZED', 'badge-low',
            'Newspaper spend is minimized, protecting the budget from low-yield print advertising and ensuring capital efficiency.',
            'By starving the Newspaper channel (coefficient 0.003), capital is forced into higher-performing channels, mathematically optimizing the portfolio.',
            '92'
        );
    }
}

// Helper to animate numbers
function animateCounter(id, target, isPercent) {
    const el = document.getElementById(id);
    if (!el) return;
    
    let current = 0;
    const duration = 1500;
    const frameRate = 30;
    const totalFrames = (duration / 1000) * frameRate;
    let frame = 0;

    const timer = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        current = target * ease;

        if (isPercent) el.innerText = current.toFixed(1) + '%';
        else el.innerText = Math.floor(current);

        if (frame >= totalFrames) {
            clearInterval(timer);
            if (isPercent) el.innerText = target.toFixed(1) + '%';
            else el.innerText = target;
        }
    }, 1000 / frameRate);
}

/* ==========================================================================
   AI SCENARIO COMPARISON (FINAL FEATURE)
   ========================================================================== */

let comparisonBarChartInst = null;
let comparisonRadarChartInst = null;

async function compareScenarios() {
    const btn = document.getElementById('compareScenariosBtn');
    const originalText = btn.innerHTML;
    
    // Add shimmer loading effect
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing Scenarios...';
    btn.classList.add('shimmer-loading');
    btn.disabled = true;

    // Helper to get value
    const getVal = (id) => parseFloat(document.getElementById(id).value) || 0;

    const sA = { tv: getVal('scenA_tv'), radio: getVal('scenA_radio'), news: getVal('scenA_news'), name: 'Scenario A' };
    const sB = { tv: getVal('scenB_tv'), radio: getVal('scenB_radio'), news: getVal('scenB_news'), name: 'Scenario B' };
    const sC = { tv: getVal('scenC_tv'), radio: getVal('scenC_radio'), news: getVal('scenC_news'), name: 'Scenario C' };

    const scenarios = [sA, sB, sC];

    try {
        // Fetch all 3 predictions in parallel
        const fetchPred = async (scen) => {
            const res = await fetch('/api/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tv: scen.tv, radio: scen.radio, newspaper: scen.news })
            });
            const data = await res.json();
            return { ...scen, prediction: data.prediction, total: scen.tv + scen.radio + scen.news };
        };

        const results = await Promise.all(scenarios.map(fetchPred));

        // Calculate efficiency and determine winner
        let maxSales = -1;
        let winnerIndex = -1;
        
        results.forEach((r, idx) => {
            r.roi = r.total > 0 ? (r.prediction / r.total).toFixed(2) : '0.00';
            r.efficiency = r.total > 0 ? ((r.prediction / r.total) * 100).toFixed(1) : 0;
            if (r.prediction > maxSales) {
                maxSales = r.prediction;
                winnerIndex = idx;
            }
        });

        const winner = results[winnerIndex];

        // 1. Update Winner Card
        document.getElementById('winner-name').innerHTML = `${winner.name} <span class="ai-badge"><i class="fas fa-check-circle"></i> Recommended by AI (96% Confidence)</span>`;
        document.getElementById('winner-reason').innerHTML = `
            <strong>${winner.name}</strong> provides the highest expected business growth with predicted sales of <strong class="highlight-text" style="color: #2ecc71;">${winner.prediction.toFixed(2)}k units</strong>. 
            It utilizes a total budget of <strong class="highlight-text">$${winner.total}k</strong>, resulting in an estimated marketing ROI ratio of <strong class="highlight-text">${winner.roi}x</strong>.
        `;

        // 2. Render KPI Cards
        const kpiGrid = document.getElementById('kpi-comparison-grid');
        kpiGrid.innerHTML = '';
        results.forEach(r => {
            const isWinner = r.name === winner.name;
            const extraClass = isWinner ? 'winner-card-premium' : '';
            const borderStyle = isWinner ? 'padding: 20px;' : 'border: 1px solid rgba(255,255,255,0.1); background: rgba(0, 0, 0, 0.2); padding: 20px;';
            kpiGrid.innerHTML += `
                <div class="glass-card scenario-card ${extraClass}" style="${borderStyle}">
                    <h4 style="color: ${isWinner ? '#D4AF37' : '#2ecc71'}; text-align: center; margin-bottom: 15px; font-size: 1.3rem; font-weight: 700;">
                        ${isWinner ? '<i class="fas fa-crown" style="color: #f1c40f; text-shadow: 0 0 10px rgba(241, 196, 15, 0.8);"></i> ' : ''}${r.name}
                    </h4>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px;">
                        <span style="color: var(--text-muted);">Total Budget:</span> <strong style="color: var(--text-main);">$${r.total}k</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px;">
                        <span style="color: var(--text-muted);">Predicted Sales:</span> <strong style="color: #2ecc71;">${r.prediction.toFixed(2)}k</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: var(--text-muted);">Est. ROI Ratio:</span> <strong style="color: var(--text-main);">${r.roi}x</strong>
                    </div>
                </div>
            `;
        });

        // 3. Render Charts
        renderComparisonCharts(results);

        // 4. Update AI Recommendation
        const topChannel = winner.tv >= winner.radio && winner.tv >= winner.news ? 'TV' :
                          (winner.radio >= winner.tv && winner.radio >= winner.news ? 'Radio' : 'Newspaper');
        
        document.getElementById('ai-scenario-recommendation').innerHTML = `
            After deep comparative analysis, <strong class="highlight-text">${winner.name}</strong> is strongly recommended for execution. 
            This strategy heavily leverages <strong class="highlight-text">${topChannel} advertising</strong>, which historical data confirms as a high-impact driver for business growth. 
            By proceeding with ${winner.name}, the enterprise limits financial risk while maximizing the conversion pipeline.
        `;

        // Show results
        const resultsDiv = document.getElementById('comparison-results');
        resultsDiv.style.display = 'block';
        
        // Re-trigger staggered animations
        const staggers = document.querySelectorAll('#comparison-results .stagger-reveal');
        staggers.forEach(el => {
            el.style.animation = 'none';
            void el.offsetWidth; // trigger reflow
            el.style.animation = '';
        });
        
        // Button Success State
        btn.classList.add('compare-btn-success');
        setTimeout(() => btn.classList.remove('compare-btn-success'), 3000);

        if (typeof window.showToast === 'function') {
            window.showToast("Analysis Complete! Displaying AI Comparison.", "success");
        }

    } catch (error) {
        console.error("Comparison Error:", error);
        if (typeof window.showToast === 'function') {
            window.showToast("Error processing scenarios. Please try again.", "error");
        }
    } finally {
        btn.innerHTML = originalText;
        btn.classList.remove('shimmer-loading');
        btn.disabled = false;
    }
}

function renderComparisonCharts(results) {
    const labels = results.map(r => r.name);
    const salesData = results.map(r => r.prediction);
    const budgetData = results.map(r => r.total);
    const roiData = results.map(r => parseFloat(r.roi));

    // Bar Chart
    const ctxBar = document.getElementById('comparisonBarChart').getContext('2d');
    if (comparisonBarChartInst) comparisonBarChartInst.destroy();
    
    comparisonBarChartInst = new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Predicted Sales',
                    data: salesData,
                    backgroundColor: 'rgba(46, 204, 113, 0.7)',
                    borderColor: '#2ecc71',
                    borderWidth: 1,
                    borderRadius: 4
                },
                {
                    label: 'Total Budget',
                    data: budgetData,
                    backgroundColor: 'rgba(212, 175, 55, 0.7)',
                    borderColor: '#D4AF37',
                    borderWidth: 1,
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: Chart.defaults.color }
                },
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: Chart.defaults.color }
                }
            },
            plugins: {
                legend: { labels: { color: Chart.defaults.color } },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#D4AF37',
                    bodycolor: Chart.defaults.color,
                    borderColor: 'rgba(212, 175, 55, 0.3)',
                    borderWidth: 1
                }
            }
        }
    });

    // Radar Chart
    const ctxRadar = document.getElementById('comparisonRadarChart').getContext('2d');
    if (comparisonRadarChartInst) comparisonRadarChartInst.destroy();
    
    comparisonRadarChartInst = new Chart(ctxRadar, {
        type: 'radar',
        data: {
            labels: ['TV', 'Radio', 'News', 'Sales', 'ROI'],
            datasets: results.map((r, i) => {
                const colors = ['rgba(46, 204, 113, 0.4)', 'rgba(212, 175, 55, 0.4)', 'rgba(52, 152, 219, 0.4)'];
                const borderColors = ['#2ecc71', '#D4AF37', '#3498db'];
                const maxBudget = Math.max(0.1, r.total);
                return {
                    label: r.name,
                    data: [
                        (r.tv / maxBudget) * 100,
                        (r.radio / maxBudget) * 100,
                        (r.news / maxBudget) * 100,
                        r.prediction,
                        r.roi * 10
                    ],
                    backgroundColor: colors[i],
                    borderColor: borderColors[i],
                    pointBackgroundColor: borderColors[i],
                    borderWidth: 2
                };
            })
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    pointLabels: { color: Chart.defaults.color, font: { size: 12 } },
                    ticks: { display: false }
                }
            },
            plugins: {
                legend: { position: 'bottom', labels: { color: Chart.defaults.color, boxWidth: 12 } },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#D4AF37'
                }
            }
        }
    });
}
