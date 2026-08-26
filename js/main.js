/* ═══════════════════════════════════════════════════════════
   GOMAD LANDING — MAIN JS v2
   SPA router · Theme · Micro-interactions & scroll animations
   ═══════════════════════════════════════════════════════════ */

/* ==================== THEME ==================== */
const theme = {
  init() {
    const saved = localStorage.getItem('gomad-theme');
    if (!saved) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.apply(prefersDark ? 'dark' : 'light');
      return;
    }
    this.apply(saved);
  },
  toggle() {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    this.apply(next);
    localStorage.setItem('gomad-theme', next);
  },
  apply(mode) {
    document.documentElement.setAttribute('data-theme', mode);
    document.querySelectorAll('[data-logo]').forEach(img => {
      img.src = mode === 'dark'
        ? '/assets/images/logo-putih.png'
        : '/assets/images/logo-merah.png';
    });
    document.querySelectorAll('#theme-sun, #theme-sun-m').forEach(el => el.classList.toggle('hide', mode !== 'dark'));
    document.querySelectorAll('#theme-moon, #theme-moon-m').forEach(el => el.classList.toggle('hide', mode === 'dark'));
  }
};

/* ==================== MOBILE DRAWER ==================== */
const drawer = {
  open() {
    const el = document.getElementById('m-drawer');
    if (el) { el.classList.add('open'); document.body.style.overflow = 'hidden'; }
  },
  close() {
    const el = document.getElementById('m-drawer');
    if (el) { el.classList.remove('open'); document.body.style.overflow = ''; }
  }
};

/* ==================== SPA ROUTER ==================== */
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

    if (!url) {
      const el = document.getElementById(path);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      mainContent.innerHTML = `
        <section class="section" style="min-height:60vh">
          <div class="container" style="text-align:center;padding-top:120px">
            <div style="font-size:4rem;font-weight:800;color:var(--accent)">404</div>
            <h2 class="h3" style="margin:12px 0">Halaman Tidak Ditemukan</h2>
            <p class="muted">Halaman yang Anda cari tidak tersedia.</p>
            <a href="#/" class="btn btn-primary" style="margin-top:22px">← Kembali ke Beranda</a>
          </div>
        </section>`;
      return;
    }

    window.scrollTo({ top: 0, behavior: 'instant' });
    mainContent.innerHTML = `
      <div style="min-height:70vh;display:grid;place-items:center">
        <div style="text-align:center">
          <div class="spin"></div>
          <p class="faint" style="margin-top:14px;font-size:.9rem">Memuat…</p>
        </div>
      </div>`;

    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error('Page not found');
      const html = await res.text();
      mainContent.innerHTML = html;
      this.updateActiveNav(path);
      this.initPage();
    } catch (e) {
      mainContent.innerHTML = `<div style="text-align:center;padding:120px 20px" class="muted">Gagal memuat halaman (${e.message})</div>`;
    }
  },

  updateActiveNav(path) {
    document.querySelectorAll('.nav-links a, .m-drawer a').forEach(a => {
      const href = a.getAttribute('href') || '';
      const active = href === `#${path}` || (path === '/' && href === '#/');
      a.classList.toggle('active', active);
    });
  },

  initPage() {
    interactions.reveal();
    interactions.counters();
    interactions.marquee();
    interactions.tilt();
    interactions.magnetic();
    interactions.scrollProgress();
    if (window.mermaid) {
      try {
        mermaid.initialize({
          startOnLoad: true,
          theme: document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'default',
          securityLevel: 'loose'
        });
        mermaid.run();
      } catch (e) { /* skip */ }
    }
  }
};

/* ==================== INTERACTIONS ==================== */
const interactions = {
  reveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach((el, i) => {
      el.style.setProperty('--d', (i % 8) * 60);
      io.observe(el);
    });
  },

  counters() {
    const els = document.querySelectorAll('[data-count]');
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target;
        io.unobserve(el);
        const target = parseFloat(el.getAttribute('data-count')) || 0;
        const suffix = el.getAttribute('data-suffix') || '';
        const dur = 1400;
        const start = performance.now();
        const step = (now) => {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased).toLocaleString('id-ID') + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    els.forEach(el => io.observe(el));
  },

  marquee() {
    document.querySelectorAll('.marquee-track').forEach(track => {
      if (track.dataset.cloned) return;
      track.dataset.cloned = '1';
      track.innerHTML += track.innerHTML;
    });
  },

  tilt() {
    const els = document.querySelectorAll('[data-tilt]');
    els.forEach(el => {
      if (el.dataset.tiltInit) return;
      el.dataset.tiltInit = '1';
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(1000px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateY(-4px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  },

  magnetic() {
    const els = document.querySelectorAll('[data-magnetic]');
    els.forEach(el => {
      if (el.dataset.magInit) return;
      el.dataset.magInit = '1';
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.25;
        const y = (e.clientY - r.top - r.height / 2) * 0.25;
        el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  },

  scrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? (window.scrollY / h) * 100 : 0;
      bar.style.width = p + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
};

/* ==================== HEADER SCROLL ==================== */
function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ==================== LANDING DATA SYNC (opsional) ==================== */
async function syncLandingData() {
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
    const map = {
      'stat-agencies': d.stats?.total_agencies,
      'stat-routes': d.stats?.total_routes,
      'stat-bookings': d.stats?.total_bookings,
      'stat-warungs': d.stats?.total_warungs,
      'stat-customers': d.stats?.total_customers,
    };
    Object.entries(map).forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (el && val != null) el.textContent = val + '+';
    });
    if (d.popular_routes) renderPopularRoutes(d.popular_routes);
    if (d.top_agencies) renderTopAgencies(d.top_agencies);
  } catch (e) { /* backend offline — pakai data statis */ }
}

function renderPopularRoutes(routes) {
  const c = document.getElementById('popular-routes-container');
  if (!c) return;
  const fmt = new Intl.NumberFormat('id-ID');
  c.innerHTML = routes.slice(0, 4).map(r => `
    <div class="b-cell flat" style="display:flex;justify-content:space-between;align-items:center;padding:16px 18px">
      <div style="display:flex;align-items:center;gap:12px">
        <div class="b-icon" style="margin:0">📍</div>
        <div>
          <div style="font-weight:700;font-size:.92rem">${r.origin_city} → ${r.destination_city}</div>
          <div class="faint" style="font-size:.78rem">${r.schedules_count} jadwal</div>
        </div>
      </div>
      <div style="font-weight:800;color:var(--accent)">Rp ${fmt.format(r.min_price || 0)}</div>
    </div>`).join('');
}

function renderTopAgencies(agencies) {
  const c = document.getElementById('top-agencies-container');
  if (!c) return;
  c.innerHTML = agencies.slice(0, 3).map(a => `
    <div class="b-cell flat" style="display:flex;align-items:center;gap:12px;padding:16px 18px">
      <div class="avatar">${(a.agency_name || 'A')[0]}</div>
      <div style="flex:1">
        <div style="font-weight:700;font-size:.92rem">${a.agency_name}</div>
        <div style="display:flex;gap:6px;align-items:center;font-size:.8rem">
          <span class="rating">★★★★★</span><span class="faint">${a.rating || '0.0'} · ${a.total_bookings || 0} booking</span>
        </div>
      </div>
    </div>`).join('');
}

/* ==================== INIT ==================== */
document.addEventListener('DOMContentLoaded', () => {
  // Load header & footer
  Promise.all([
    fetch('components/header.html').then(r => r.text()),
    fetch('components/footer.html').then(r => r.text())
  ]).then(([h, f]) => {
    const hc = document.getElementById('header-container');
    const fc = document.getElementById('footer-container');
    if (hc) hc.innerHTML = h;
    if (fc) fc.innerHTML = f;
    setTimeout(() => {
      theme.apply(document.documentElement.getAttribute('data-theme') || 'light');
      bindChrome();
      initNavScroll();
      interactions.scrollProgress();
    }, 50);
  }).catch(e => console.error('Gagal muat header/footer', e));

  theme.init();
  bindChrome();

  window.addEventListener('hashchange', () => {
    const hash = decodeURIComponent(location.hash.slice(1)) || '/';
    router.load(hash);
  });

  const hash = decodeURIComponent(location.hash.slice(1)) || '/';
  router.load(hash);

  syncLandingData();
});

function bindChrome() {
  // Drawer
  const openBtn = document.getElementById('nav-burger');
  const drawerEl = document.getElementById('m-drawer');
  if (openBtn) openBtn.addEventListener('click', drawer.open);
  if (drawerEl) {
    drawerEl.querySelector('.overlay')?.addEventListener('click', drawer.close);
    drawerEl.querySelectorAll('a').forEach(a => a.addEventListener('click', drawer.close));
  }
  // Theme buttons
  document.querySelectorAll('[data-theme-toggle]').forEach(b => b.addEventListener('click', () => theme.toggle()));
}

/* Scroll ke section di halaman dokumentasi */
function scrollToSection(event, id) {
  if (event) event.preventDefault();
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  document.querySelectorAll('.doc-nav a').forEach(a => {
    a.classList.toggle('active', (a.getAttribute('href') || '').slice(1) === id);
  });
}
