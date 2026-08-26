# GoMad Landing Page

Landing page resmi **GoMad** — Platform mobilitas Madura.
Desain ulang total dengan gaya **Bento Grid + Minimalism Modern**, aksen
**Glassmorphism**, dan **micro-interaction / scroll animation**.

## Struktur

```
landing-gomadid/
├── index.html              → shell SPA (navbar, footer, WA float, scroll-progress)
├── css/style.css           → design system v2 (bento, glass, reveal, marquee, dll.)
├── js/main.js              → router hash-SPA, theme, reveal/counter/tilt/magnetic
├── components/
│   ├── header.html         → floating glass navbar + mobile drawer
│   └── footer.html         → footer
├── pages/
│   ├── home.html           → hero + bento utama
│   ├── platform.html       → ekosistem platform
│   ├── agency.html         → untuk agency
│   ├── customer.html       → untuk customer
│   └── contact.html        → kontak
├── documentations/
│   ├── index.html          → hub dokumentasi
│   ├── customer.html       → panduan customer
│   ├── agency.html         → panduan agency
│   ├── driver.html         → panduan driver
│   ├── warung.html         → panduan warung
│   └── flow.html           → diagram alur (Mermaid)
└── assets/images/
    ├── logo*.png / favicon / og-image
    └── mockup/             → placeholder SVG → GANTI dengan screenshot asli
```

## Ganti Mockup dengan Gambar Asli

Semua screenshot produk memakai placeholder SVG di `assets/images/mockup/`.
Untuk mengganti dengan screenshot asli, **simpan file dengan nama yang sama**
(dan ekstensi .png/.jpg bila mau):

| File | Bagian |
|---|---|
| `hero-app.svg` | Hero (dashboard customer) |
| `travel-search.svg` | Cari travel |
| `seat-select.svg` | Denah kursi |
| `rental-lepas-kunci.svg` | Rental lepas kunci |
| `driver-app.svg` | Aplikasi driver |
| `agency-dashboard.svg` | Dashboard agency |
| `warung-pos.svg` | Warung / POS |
| `eticket.svg` | E-ticket |

## Menjalankan Lokal

```bash
cd landing-gomadid
python3 -m http.server 8081
# buka http://localhost:8081
```

## Desain

- **Bento Grid**: `.bento` (grid 12 kolom) + `.b-cell` + span `.c-3..c-12`.
- **Glassmorphism**: `.glass`, `.glass-chip`, navbar `.nav`, `.mock-float`.
- **Animasi**: `.reveal` (+ `.reveal-left/right/scale/blur`), marquee `.marquee`,
  counter `[data-count]`, tilt `[data-tilt]`, magnetic `[data-magnetic]`.
- **Tema**: light/dark via `data-theme`, disimpan di localStorage.
