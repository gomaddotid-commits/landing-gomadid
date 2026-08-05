/* ═══════════════════════════════════════
   GOMAD LANDING PAGE - MAIN JAVASCRIPT
   ═══════════════════════════════════════ */

// ==================== THEME MANAGER ====================
const theme = {
    init() {
        const saved = localStorage.getItem('gomad-theme') || 'light';
        // Cek preferensi sistem
        if (!localStorage.getItem('gomad-theme')) {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.apply(prefersDark ? 'dark' : 'light');
            return;
        }
        this.apply(saved);
    },
    
    toggle() {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        this.apply(next);
        localStorage.setItem('gomad-theme', next);
        
        // Update mobile theme button text
        const mobileThemeIcon = document.getElementById('mobile-theme-icon');
        const mobileThemeText = document.getElementById('mobile-theme-text');
        if (mobileThemeIcon && mobileThemeText) {
            if (next === 'dark') {
                mobileThemeIcon.textContent = '☀️';
                mobileThemeText.textContent = 'Light Mode';
            } else {
                mobileThemeIcon.textContent = '🌙';
                mobileThemeText.textContent = 'Dark Mode';
            }
        }
    },
    
    apply(mode) {
        document.documentElement.setAttribute('data-theme', mode);
        
        // Update header logo
        const logo = document.getElementById('header-logo');
        if (logo) {
            logo.src = mode === 'dark' 
                ? '/assets/images/logo-putih.png' 
                : '/assets/images/logo-merah.png';
        }
        
        // Update mobile logo
        const mobileLogo = document.getElementById('mobile-logo');
        if (mobileLogo) {
            mobileLogo.src = mode === 'dark' 
                ? '/assets/images/logo-putih.png' 
                : '/assets/images/logo-merah.png';
        }
        
        // Update mermaid theme if loaded
        if (window.mermaid) {
            this.updateMermaid(mode);
        }
    },
    
    updateMermaid(mode) {
        const mermaidElements = document.querySelectorAll('.mermaid');
        if (mermaidElements.length > 0) {
            mermaid.initialize({
                startOnLoad: true,
                theme: mode === 'dark' ? 'dark' : 'default',
                securityLevel: 'loose',
            });
            // Re-render
            mermaidElements.forEach(el => {
                if (el.getAttribute('data-processed')) {
                    el.removeAttribute('data-processed');
                }
            });
            try {
                mermaid.run();
            } catch (e) {
                console.log('Mermaid re-render skipped');
            }
        }
    }
};

// ==================== SPA ROUTER ====================
const router = {
    routes: {
        '/':              'pages/home.html',
        '/platform':      'pages/platform.html',
        '/agency':        'pages/agency.html',
        '/customer':      'pages/customer.html',
        '/contact':       'pages/contact.html',
        '/docs':          'documentations/index.html',
        '/docs/customer': 'documentations/customer.html',
        '/docs/agency':   'documentations/agency.html',
        '/docs/driver':   'documentations/driver.html',
        '/docs/warung':   'documentations/warung.html',
        '/docs/flow':     'documentations/flow.html',
    },
    
    async load(path) {
        const mainContent = document.getElementById('main-content');
        const url = this.routes[path];
        
        // ⬇️ FIX: Kalau route tidak ditemukan, cek apakah ini anchor link internal
        if (!url) {
            // Coba cari elemen dengan ID tersebut di halaman
            const element = document.getElementById(path);
            if (element) {
                // Ini anchor link di halaman yang sama — scroll ke elemen
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                
                // Update sidebar active link jika ada
                document.querySelectorAll('.doc-sidebar-link').forEach(link => {
                    link.classList.remove('active');
                    const href = link.getAttribute('onclick') || '';
                    if (href.includes(`'${path}'`)) {
                        link.classList.add('active');
                    }
                });
                return;
            }
            
            // Kalau benar-benar tidak ada, tampilkan 404
            mainContent.innerHTML = `
                <div class="text-center py-20">
                    <div class="text-6xl font-bold text-[#C1121F] mb-4">404</div>
                    <h2 class="text-xl font-bold mb-2">Halaman Tidak Ditemukan</h2>
                    <p class="text-gray-500 mb-6 font-light">Halaman yang Anda cari tidak tersedia.</p>
                    <a href="#/" class="btn-primary inline-flex">← Kembali ke Beranda</a>
                </div>
            `;
            return;
        }
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'instant' });
        
        // Show loading
        mainContent.innerHTML = `
            <div class="flex items-center justify-center h-64">
                <div class="text-center">
                    <div class="animate-spin w-10 h-10 border-4 border-[#C1121F] border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p class="text-gray-500 dark:text-gray-400 font-light">Memuat...</p>
                </div>
            </div>
        `;
        
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Page not found');
            const html = await response.text();
            mainContent.innerHTML = html;
            
            // Update active nav link
            this.updateActiveNav(path);
            
            // Re-init page scripts
            this.initPageScripts();
            
            // Scroll animations
            this.initScrollAnimations();
            
        } catch (error) {
            mainContent.innerHTML = `
                <div class="text-center py-20">
                    <div class="text-6xl font-bold text-[#C1121F] mb-4">404</div>
                    <h2 class="text-xl font-bold mb-2">Halaman Tidak Ditemukan</h2>
                    <p class="text-gray-500 mb-6 font-light">${error.message}</p>
                    <a href="#/" class="btn-primary inline-flex">← Kembali ke Beranda</a>
                </div>
            `;
        }
    },
    
    updateActiveNav(path) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${path}` || (path === '/' && href === '#/')) {
                link.classList.add('active');
            }
        });
    },
    
    initPageScripts() {
        // Re-init Mermaid jika ada
        if (window.mermaid) {
            const mermaidElements = document.querySelectorAll('.mermaid');
            if (mermaidElements.length > 0) {
                const mode = document.documentElement.getAttribute('data-theme') || 'light';
                mermaid.initialize({
                    startOnLoad: true,
                    theme: mode === 'dark' ? 'dark' : 'default',
                    securityLevel: 'loose',
                });
                try {
                    mermaid.run();
                } catch (e) {
                    console.log('Mermaid init skipped');
                }
            }
        }
        
        // Sync real data from backend
        this.syncLandingData();
    },
    
    async syncLandingData() {
        // Auto-detect API URL based on environment
        const host = location.hostname;
        const apiBase = host.includes('localhost') || host.includes('127.0.0.1')
            ? 'http://localhost:8000/api/v1/landing'
            : 'https://web.gomad.id/api/v1/landing';
        try {
            const res = await fetch(`${apiBase}/all`);
            if (!res.ok) return;
            const json = await res.json();
            if (!json.success || !json.data) return;
            const d = json.data;
            
            if (d.stats) {
                this.updateStat('stat-agencies', d.stats.total_agencies);
                this.updateStat('stat-routes', d.stats.total_routes);
                this.updateStat('stat-bookings', d.stats.total_bookings);
                this.updateStat('stat-warungs', d.stats.total_warungs);
                this.updateStat('stat-customers', d.stats.total_customers);
                this.updateStat('stat-rental', d.stats.total_rental_cars);
            }
            if (d.popular_routes) this.renderPopularRoutes(d.popular_routes);
            if (d.top_agencies) this.renderTopAgencies(d.top_agencies);
            if (d.testimonials) this.renderTestimonials(d.testimonials);
        } catch (e) {
            console.log('Landing data sync skipped (backend offline)');
        }
    },
    
    updateStat(id, val) {
        const el = document.getElementById(id);
        if (el && val != null) el.textContent = val + '+';
    },
    
    renderPopularRoutes(routes) {
        const c = document.getElementById('popular-routes-container');
        if (!c) return;
        const fmt = new Intl.NumberFormat('id-ID');
        c.innerHTML = routes.map(r => `
            <div class="card p-4 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-[#C1121F]/10 rounded-xl flex items-center justify-center text-lg">📍</div>
                    <div><p class="font-semibold text-sm">${r.origin_city} → ${r.destination_city}</p>
                    <p class="text-xs text-gray-400">${r.schedules_count} jadwal</p></div>
                </div>
                <p class="font-bold text-[#C1121F] text-sm">Rp ${fmt.format(r.min_price||0)}</p>
            </div>`).join('');
    },
    
    renderTopAgencies(agencies) {
        const c = document.getElementById('top-agencies-container');
        if (!c) return;
        c.innerHTML = agencies.map(a => `
            <div class="card p-4 text-center">
                <div class="w-16 h-16 bg-[#C1121F]/10 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl font-bold text-[#C1121F]">${(a.agency_name||'A')[0]}</div>
                <p class="font-semibold text-sm">${a.agency_name}</p>
                <div class="flex items-center justify-center gap-1 mt-1">
                    <span class="text-yellow-500 text-xs">⭐</span><span class="text-xs font-bold">${a.rating||'0.0'}</span>
                    <span class="text-xs text-gray-400">(${a.total_bookings||0})</span>
                </div>
            </div>`).join('');
    },
    
    renderTestimonials(testimonials) {
        const c = document.getElementById('testimonials-container');
        if (!c) return;
        const stars = r => '⭐'.repeat(Math.round(r));
        c.innerHTML = testimonials.map(t => `
            <div class="card p-5">
                <div class="flex items-center gap-3 mb-3">
                    <div class="w-10 h-10 bg-[#C1121F]/10 rounded-full flex items-center justify-center font-bold text-[#C1121F]">${(t.customer_name||'A')[0]}</div>
                    <div><p class="font-semibold text-sm">${t.customer_name}</p>
                    <p class="text-xs text-gray-400">${t.agency_name} · ${t.created_at}</p></div>
                </div>
                <p class="text-xs mb-2">${stars(t.rating)}</p>
                <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">"${t.review}"</p>
            </div>`).join('');
    },
    
    initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.fade-in-up').forEach(el => {
            observer.observe(el);
        });
    }
};

// ==================== MOBILE MENU ====================
const mobileMenu = {
    open() {
        const overlay = document.getElementById('mobile-overlay');
        const drawer = document.getElementById('mobile-drawer');
        if (overlay) overlay.classList.add('open');
        if (drawer) drawer.classList.add('open');
        document.body.style.overflow = 'hidden';
    },
    
    close() {
        const overlay = document.getElementById('mobile-overlay');
        const drawer = document.getElementById('mobile-drawer');
        if (overlay) overlay.classList.remove('open');
        if (drawer) drawer.classList.remove('open');
        document.body.style.overflow = '';
    }
};

// ==================== FLOATING HEADER SCROLL BEHAVIOR ====================
function initHeaderScroll() {
    let lastScrollY = 0;
    const header = document.querySelector('.floating-header');
    
    if (!header) return;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // Scroll ke bawah → sembunyikan header
            header.style.transform = 'translateY(-120%)';
            header.style.opacity = '0';
            header.style.transition = 'transform 0.4s ease, opacity 0.3s ease';
        } else {
            // Scroll ke atas → tampilkan header
            header.style.transform = 'translateY(0)';
            header.style.opacity = '1';
            header.style.transition = 'transform 0.4s ease, opacity 0.3s ease';
        }
        
        lastScrollY = currentScrollY;
    });
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
    // Load header & footer
    Promise.all([
        fetch('components/header.html').then(r => r.text()),
        fetch('components/footer.html').then(r => r.text())
    ]).then(([headerHtml, footerHtml]) => {
        const headerContainer = document.getElementById('header-container');
        const footerContainer = document.getElementById('footer-container');
        
        if (headerContainer) headerContainer.innerHTML = headerHtml;
        if (footerContainer) footerContainer.innerHTML = footerHtml;
        
        // Bind mobile menu events after header loaded
        setTimeout(() => {
            const menuBtn = document.getElementById('mobile-menu-btn');
            const overlay = document.getElementById('mobile-overlay');
            const drawerClose = document.getElementById('mobile-drawer-close');
            
            if (menuBtn) menuBtn.addEventListener('click', mobileMenu.open);
            if (overlay) overlay.addEventListener('click', mobileMenu.close);
            if (drawerClose) drawerClose.addEventListener('click', mobileMenu.close);
            
            // Init floating header scroll behavior
            initHeaderScroll();
        }, 200);
    }).catch(err => {
        console.error('Failed to load header/footer:', err);
    });
    
    // Init theme
    theme.init();
    
    // Init router on hash change
    window.addEventListener('hashchange', () => {
        const hash = decodeURIComponent(location.hash.slice(1)) || '/';
        router.load(hash);
    });

    // Load initial page
    const hash = decodeURIComponent(location.hash.slice(1)) || '/';
    router.load(hash);

    // WA tooltip - show after 3 seconds, hide after 5 more
    setTimeout(() => {
        const tooltip = document.getElementById('wa-tooltip');
        if (tooltip) {
            tooltip.style.opacity = '1';
            setTimeout(() => { 
                tooltip.style.opacity = '0'; 
            }, 5000);
        }
    }, 3000);
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('gomad-theme')) {
            theme.apply(e.matches ? 'dark' : 'light');
        }
    });
});

// ==================== KEYBOARD SHORTCUTS ====================
document.addEventListener('keydown', (e) => {
    // ESC to close mobile menu
    if (e.key === 'Escape') {
        mobileMenu.close();
    }
    
    // Ctrl/Cmd + T to toggle theme
    if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        theme.toggle();
    }
});