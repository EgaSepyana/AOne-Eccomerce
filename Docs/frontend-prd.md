# PRD — Aone E-commerce Frontend (Phase 1: Slicing + Dummy E2E)

| | |
|---|---|
| **Produk** | Aone, fashion e-commerce |
| **Scope** | Frontend only (belum ada backend) |
| **Stack** | Next.js (App Router) + TypeScript · Bun · Tailwind CSS v4 · GSAP |
| **Sumber desain** | `DESIGN.md` + Claude Design ([artifact](https://claude.ai/artifact/9RMNsJsph1z3UPEvLaHm3W)) |
| **Owner** | Ega |
| **Status** | Draft v1.0, 28 Sep 2026 |

---

## 1. Latar Belakang

Desain Aone sudah jadi di Claude Design, mengikuti `DESIGN.md`: gaya Uniqlo, hitam-putih murni, Inter, radius 0, dan pola UX standar dari Uniqlo, Lacoste, dan Nike. Phase ini fokus mengubah desain menjadi aplikasi web yang **bisa diklik end-to-end**. Semua data dan fitur memakai **dummy/mock** sampai backend siap.

## 2. Goals

1. **Slicing 100% halaman dan komponen** dari desain, pixel-consistent dengan `DESIGN.md`.
2. **Konsistensi desain dijaga oleh sistem**, bukan manual: semua warna, font, dan spacing hanya dari design token Tailwind.
3. **User flow end-to-end jalan**, dari Homepage sampai "Pesanan Berhasil", termasuk search, filter, sort, wishlist, keranjang, dan checkout.
4. **Siap disambung ke backend**: semua akses data lewat Repository pattern, jadi nanti cukup menambah implementasi HTTP tanpa mengubah komponen.
5. **Scalable & rapi**: arsitektur feature-based berlapis, design pattern jelas, aturan import dipaksa lewat lint (lihat §12).

## 3. Non-Goals (Phase 1)

- Backend, database, dan API asli
- Autentikasi asli (login/register hanya dummy, disimpan di localStorage)
- Payment gateway asli (Midtrans/Xendit menyusul)
- CMS, admin dashboard, multi-bahasa
- SEO lanjutan (sitemap dinamis, structured data lengkap). Cukup metadata dasar per halaman.

## 4. Success Metrics / Definition of Done Phase 1

- [ ] Semua halaman di **Bagian 7** terimplementasi, responsive di 375px, 768px, 1024px, dan 1440px
- [ ] Semua user flow di **Bagian 6** bisa dijalankan tanpa error dan lolos test Playwright
- [ ] **0 hardcoded warna/ukuran** di luar token (dicek lewat lint/grep `#[0-9a-fA-F]{3,6}` dan `\[.*px\]` di `src/`)
- [ ] Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95
- [ ] CLS < 0.05, LCP < 2.5s (build production, throttled 4G)
- [ ] `bun run build` bersih tanpa error TypeScript atau ESLint

---

## 5. Tech Stack & Tooling

| Kebutuhan | Pilihan | Catatan |
|---|---|---|
| Runtime & package manager | **Bun** (≥ 1.2) | `bun install`, `bun dev`, `bun run build`, `bun test` |
| Framework | **Next.js** stable terbaru (App Router, React Server Components) | `bunx create-next-app@latest aone-web --ts --tailwind --app --src-dir --import-alias "@/*" --use-bun` |
| Bahasa | **TypeScript** strict mode | `"strict": true`, `"noUncheckedIndexedAccess": true` |
| Styling | **Tailwind CSS v4** | Token didefinisikan di `@theme` (CSS-first), lihat Bagian 9 |
| Animasi | **GSAP** + `@gsap/react` (`useGSAP`) | Plugin: `ScrollTrigger` (terbatas), `Flip` (opsional untuk filter grid) |
| Server state | **TanStack Query** | Fetching, caching, loading/error, prefetch. Tetap dipakai saat API asli masuk |
| Client state | **Zustand** + middleware `persist` (1 store per feature) | Cart, wishlist, recently viewed, user dummy, recent search, UI |
| URL state | **nuqs** | Filter, sort, page, query search tersinkron ke URL secara type-safe |
| Arsitektur lint | `eslint-plugin-boundaries` | Memaksa aturan layer & public API (lihat §12.3) |
| Form & validasi | **React Hook Form** + **Zod** | Checkout, login/register, newsletter |
| Font | `next/font/google` → **Inter** 400/500/700 | Self-host otomatis, tanpa layout shift |
| Ikon | **Material Symbols Outlined** (weight 300, sesuai desain) | Via `next/font` / self-host woff2. Buat komponen `<Icon name="search" />` |
| Gambar | `next/image` | Placeholder `#F4F4F4`, `sizes` wajib diisi |
| Search dummy | **Fuse.js** | Fuzzy search client-side atas data mock |
| Class helper | `clsx` + `tailwind-merge` → util `cn()` | Plus `class-variance-authority` (CVA) untuk varian komponen |
| Lint & format | ESLint (`next/core-web-vitals`) + Prettier + `prettier-plugin-tailwindcss` | Urutan class Tailwind otomatis |
| Testing | **Playwright** (E2E) + `bun test` (unit untuk util/store) | E2E wajib untuk semua flow Bagian 6 |
| Komponen preview (opsional) | Route internal `/_design` | Showcase semua komponen dan varian, pengganti Storybook |

**Script `package.json`:**
```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write .",
    "typecheck": "tsc --noEmit",
    "test": "bun test",
    "e2e": "playwright test",
    "check": "bun run typecheck && bun run lint && bun run test"
  }
}
```

---

## 6. User Flows (End-to-End)

Setiap flow HARUS bisa diklik penuh dan punya 1 test Playwright.

### F1. Browse → Beli (happy path utama)
1. Homepage → klik tab **PRIA** di header → konten homepage berganti ke versi Pria
2. Klik tile kategori **Kaos** → PLP `/c/pria/kaos`
3. Pilih filter **Ukuran M** + **Hitam** → grid ter-update, chip filter aktif muncul, URL jadi `?size=M&color=hitam`
4. Sort **Harga terendah**
5. Klik swatch warna di kartu → foto kartu berganti warna (tanpa pindah halaman)
6. Klik kartu → PDP `/p/kaos-katun-supima-crew-neck?color=hitam`
7. Pilih ukuran **L** → klik **TAMBAH KE KERANJANG**
8. **Cart drawer** terbuka: item, progress gratis ongkir, rekomendasi. Badge cart di header +1 (animasi bump)
9. Klik **CHECKOUT** → `/checkout` (step Pengiriman) → isi form → pilih kurir
10. Step Pembayaran → pilih metode (mis. QRIS/VA/COD)
11. Step Review → **BUAT PESANAN** → loading 1–2 detik → `/checkout/success/AONE-XXXXXX`
12. Cart dikosongkan, pesanan tersimpan di "Pesanan Saya" (dummy)

### F2. Search
1. Klik search bar di header → overlay: **Pencarian populer**, **Pencarian terakhir**, 4 produk trending
2. Ketik `kemja` (typo) → autosuggest tetap menampilkan "kemeja" (fuzzy) + 4 produk dengan foto & harga
3. Enter → `/search?q=kemja` → layout PLP dengan filter
4. Query tanpa hasil (`xyzabc`) → empty state: saran ejaan + produk populer + CTA
5. Query tersimpan di "Pencarian terakhir" (maks 5, bisa dihapus)

### F3. Quick View (desktop)
Hover kartu → **LIHAT CEPAT** → drawer/modal: foto, harga, warna, ukuran, TAMBAH KE KERANJANG, link "Lihat detail lengkap".

### F4. Wishlist
1. Klik ♡ di kartu/PDP → ikon terisi + toast "Ditambahkan ke wishlist · Lihat"
2. `/wishlist` → grid produk tersimpan → bisa pilih ukuran lalu pindah ke keranjang, atau hapus
3. Wishlist tetap ada setelah refresh (persist)

### F5. Size Finder & Stok
1. Di PDP klik **Cari ukuranmu** → drawer: tinggi, berat, preferensi fit → hasil "Rekomendasi: M" → tombol "Pilih M"
2. Klik **Panduan ukuran** → modal tabel ukuran
3. Ukuran habis → klik → modal **Beri tahu saya** (input email → toast sukses dummy)

### F6. Keranjang
1. `/cart`: ubah qty, ubah ukuran/warna langsung, hapus (dengan undo toast), pindah ke wishlist
2. Input kode promo: `AONE10` (diskon 10%), `ONGKIRFREE` (gratis ongkir), kode lain → error "Kode tidak valid"
3. Progress bar gratis ongkir (threshold Rp300.000)
4. Keranjang kosong → empty state + **MULAI BELANJA**

### F7. Akun (dummy)
1. `/login` → email + password apa saja (validasi format) → "login" → redirect ke halaman sebelumnya
2. `/account` → profil, alamat tersimpan, **Pesanan Saya** (dari F1)
3. `/account/orders/[id]` → detail & timeline status dummy (Dibayar → Dikemas → Dikirim)
4. Logout → clear user dari store (cart & wishlist tetap)
5. Checkout sebagai **guest** tetap bisa tanpa login

### F8. Navigasi & Edge
- Mega-menu desktop (hover) & menu drawer mobile (☰) ke semua kategori
- Breadcrumb bisa diklik
- URL tidak valid → halaman 404 dengan CTA + produk populer
- Refresh di halaman manapun tidak menghilangkan state (cart, wishlist, filter di URL)

---

## 7. Sitemap & Routes

| Route | Halaman | Render | Catatan |
|---|---|---|---|
| `/` | Homepage | Server + client island | Tab gender via `?g=wanita\|pria\|anak` (default wanita) |
| `/c/[gender]` | PLP gender (semua produk) | Server (baca searchParams) | |
| `/c/[gender]/[category]` | PLP kategori | Server | Filter & sort via query string |
| `/p/[slug]` | PDP | Server (`generateStaticParams` dari mock) | `?color=` untuk varian aktif |
| `/search` | Hasil pencarian | Client | `?q=` + filter |
| `/cart` | Keranjang | Client | |
| `/checkout` | Checkout (3 step) | Client | Layout khusus tanpa nav |
| `/checkout/success/[orderId]` | Pesanan berhasil | Client | |
| `/wishlist` | Wishlist | Client | |
| `/login`, `/register` | Auth dummy | Client | |
| `/account` | Akun | Client (guard dummy) | |
| `/account/orders/[id]` | Detail pesanan | Client | |
| `/lookbook/[slug]` | Editorial/lookbook | Server | Dari tile editorial di PLP/Home |
| `/help/[topic]` | Bantuan statis (ukuran, pengiriman, retur, FAQ) | Server | Konten statis |
| `/_design` | Showcase komponen (internal) | Client | Tidak di-link dari UI, `noindex` |
| `not-found`, `error` | 404 & error boundary | | |

---

## 8. Spesifikasi Halaman & Acceptance Criteria

> Semua ukuran, warna, dan perilaku mengikuti `DESIGN.md`. Bagian ini hanya menegaskan **apa yang harus berfungsi**.

### 8.1 Global Layout
- **Announcement bar**: 3 pesan, rotasi otomatis 5 detik (GSAP), panah ‹ ›, pause saat hover
- **Header sticky**: logo AONE (link ke `/`), nav WANITA/PRIA/ANAK (item aktif underline 2px), search bar, ♡, akun, bag + badge jumlah
- **Mega-menu desktop**: muncul saat hover nav (delay 120ms, tutup delay 200ms), keyboard-accessible
- **Mobile**: ☰ membuka drawer kiri (menu bertingkat slide), 🔍 membuka search full-screen
- **Footer**: newsletter (validasi email → toast), 4 kolom link, ikon pembayaran grayscale
- **Toast system** global, **cart drawer** global
- AC: header tidak menutupi konten saat anchor scroll (`scroll-margin-top`), badge cart sinkron di semua tab (event `storage`)

### 8.2 Homepage
Urutan section sesuai `DESIGN.md §5.1`: Hero → Kategori → Produk Terbaru → Banner Lookbook → Terlaris → Belanja Berdasarkan Gaya → Banner Koleksi → UGC → Trust strip.
- AC: ganti tab gender mengganti data semua section tanpa full reload
- AC: hero carousel (maks 4 slide) punya dot, pause, panah; autoplay berhenti saat hover/fokus/`prefers-reduced-motion`
- AC: carousel produk punya peek, scroll-snap, panah desktop, swipe mobile

### 8.3 PLP (sesuai screen desain "Kategori PLP")
- Breadcrumb, judul + jumlah produk, chip sub-kategori (scroll horizontal)
- **Bar sticky**: `Sembunyikan Filter` (toggle sidebar), chip filter aktif + `Hapus semua`, dropdown **Urutkan**
- **Sidebar filter (desktop, sticky)**: Kategori (dengan count), Ukuran (grid 4 kolom), Warna (swatch), Harga (range slider + input), grup tertutup: Fit, Bahan, Promo, Rating
- **Mobile**: tombol `Filter (n)` + `Urutkan` sticky → bottom sheet, tombol `TAMPILKAN n PRODUK`
- Grid 4/3/2 kolom; **tile editorial 2×2** disisipkan setelah 4 produk pertama lalu setiap 12 produk
- Pagination: `Menampilkan 24 dari 128` + progress bar + `MUAT LEBIH BANYAK` (append 12, animasi fade-in item baru)
- AC: semua state filter/sort/page ada di URL (bisa di-share & back button berfungsi)
- AC: count produk di tombol mobile ter-update real-time saat memilih filter
- AC: 0 hasil → empty state "Tidak ada produk yang cocok" + `Hapus filter`
- AC: skeleton grid saat loading (simulasi latency mock)

### 8.4 Product Card (komponen inti)
- Foto 3:4 bg `#F4F4F4`, hover desktop → foto kedua (crossfade 400ms)
- Badge (maks 1): `BARU` (putih), `SALE`/`-20%` (hitam), `STOK TERBATAS` (outline abu)
- Swatch maks 4 + `+N`, swatch aktif ber-ring; klik swatch ganti foto kartu
- ♡ toggle (tidak ikut navigasi kartu), meta, nama (clamp 2 baris), harga (+harga coret), ★ rating (jumlah ulasan)
- Desktop hover: tombol `LIHAT CEPAT`
- AC: seluruh kartu adalah link ke PDP kecuali swatch & ♡ (`stopPropagation`), fokus keyboard terlihat

### 8.5 PDP
- Galeri: desktop grid 2 kolom + lightbox zoom; mobile carousel + counter `1/8`
- Label model di foto on-model
- **Buy box sticky** (desktop): breadcrumb, nama, kode, rating (scroll ke ulasan), harga (+coret +badge), info cicilan, swatch + nama warna, size selector (+habis, +sisa stok), `Panduan ukuran`, `Cari ukuranmu`, qty stepper, **TAMBAH KE KERANJANG**, **TAMBAH KE WISHLIST**, trust block, accordion (Deskripsi, Bahan & Perawatan, Ukuran & Fit, Pengiriman & Pengembalian)
- Section bawah: Lengkapi Gayamu (checkbox + "Tambah semua"), Ulasan (ringkasan, distribusi, fit meter, filter, "Membantu", `Lihat lebih banyak`), Produk Serupa, Terakhir Dilihat
- **Mobile sticky bottom bar** muncul saat CTA utama keluar viewport (IntersectionObserver)
- AC: klik TAMBAH tanpa pilih ukuran → shake ringan pada size selector + pesan "Pilih ukuran dulu"
- AC: ganti warna mengganti galeri, stok ukuran, dan URL `?color=`
- AC: produk yang dibuka masuk "Terakhir Dilihat" (maks 12, persist)

### 8.6 Search (sesuai screen "Search")
- Overlay: populer, terakhir (hapus satuan/semua), trending
- Autosuggest debounce 200ms, highlight kata yang cocok, navigasi keyboard ↑↓ Enter Esc
- Hasil memakai komponen PLP yang sama

### 8.7 Keranjang (sesuai screen "Keranjang")
- Daftar item (edit varian inline, qty, hapus + undo, pindah ke wishlist), progress gratis ongkir
- Ringkasan sticky: subtotal, diskon, ongkir, kode promo, total, CHECKOUT, ikon pembayaran
- Rekomendasi "Kamu mungkin juga suka"

### 8.8 Checkout
- Layout minimal: logo + `🔒 Checkout Aman` + stepper **Pengiriman → Pembayaran → Review**
- Pengiriman: email, nama, telepon, alamat (provinsi → kota → kecamatan dropdown dari mock), pilihan kurir dummy (Reguler Rp15.000 / Express Rp29.000 / Instan Rp45.000 + estimasi)
- Pembayaran: VA (BCA, Mandiri, BNI, BRI), e-wallet (GoPay, OVO, DANA, ShopeePay), QRIS, Kartu kredit (form dummy dengan nomor test, tidak disimpan), COD, Cicilan 0%
- Review: ringkasan semua + edit per step, checkbox syarat & ketentuan, **BUAT PESANAN**
- Ringkasan order: sidebar desktop / collapsible mobile
- AC: validasi Zod inline per field; tidak bisa lanjut step jika invalid; data step tersimpan saat kembali
- AC: sukses → halaman success (nomor order, instruksi pembayaran dummy sesuai metode, CTA `LANJUT BELANJA` & `LIHAT PESANAN`)

### 8.9 Wishlist, Akun, Lookbook, Help, 404
- Sesuai flow F4, F7, F8. Semua empty state punya ilustrasi line/foto + CTA.

---

## 9. Design System → Kode

### 9.1 Token Tailwind v4 (`src/app/globals.css`)
```css
@import "tailwindcss";

@theme {
  /* Reset palet bawaan: hanya token Aone yang boleh dipakai */
  --color-*: initial;
  --color-white: #FFFFFF;
  --color-subtle: #F4F4F4;
  --color-border: #E3E3E3;
  --color-disabled: #B5B5B5;
  --color-muted: #6B6B6B;
  --color-ink: #111111;
  --color-ink-hover: #333333;
  --color-transparent: transparent;

  --font-sans: var(--font-inter), "Helvetica Neue", Arial, sans-serif;

  /* Type scale (mobile default; desktop via lg:) */
  --text-caption: 11px;   --text-caption--line-height: 16px;
  --text-small: 12px;     --text-small--line-height: 18px;
  --text-body: 14px;      --text-body--line-height: 22px;
  --text-h3: 16px;        --text-h3--line-height: 22px;
  --text-price: 16px;     --text-price--line-height: 22px;
  --text-h2: 20px;        --text-h2--line-height: 26px;
  --text-h1: 24px;        --text-h1--line-height: 30px;
  --text-price-lg: 24px;  --text-price-lg--line-height: 30px;
  --text-display: 32px;   --text-display--line-height: 38px;
  /* desktop */
  --text-caption-lg: 12px; --text-caption-lg--line-height: 16px;
  --text-small-lg: 14px;   --text-small-lg--line-height: 20px;
  --text-body-lg: 16px;    --text-body-lg--line-height: 24px;
  --text-h3-lg: 20px;      --text-h3-lg--line-height: 28px;
  --text-price-lg-d: 28px; --text-price-lg-d--line-height: 34px;
  --text-h2-lg: 28px;      --text-h2-lg--line-height: 36px;
  --text-h1-lg: 36px;      --text-h1-lg--line-height: 44px;
  --text-display-lg: 56px; --text-display-lg--line-height: 62px;

  --spacing: 4px; /* p-4 = 16px, p-6 = 24px, dst. */

  --radius-none: 0;
  --radius-full: 999px;

  --shadow-overlay: 0 4px 24px rgba(0, 0, 0, 0.08);

  --ease-aone: cubic-bezier(0.2, 0, 0, 1);

  --breakpoint-sm: 768px;
  --breakpoint-md: 1024px;
  --breakpoint-lg: 1440px;
}

:root {
  --header-h: 56px;
  --announce-h: 36px;
}
@media (min-width: 768px) { :root { --header-h: 64px; } }

@layer base {
  html { -webkit-font-smoothing: antialiased; }
  body { @apply bg-white text-ink font-sans text-body; }
  :focus-visible { outline: 2px solid var(--color-ink); outline-offset: 2px; }
  .tabular { font-variant-numeric: tabular-nums; }
}
```
> Catatan breakpoint: default Tailwind = mobile (< 768px). `sm:` = tablet (≥ 768), `md:` = desktop (≥ 1024), `lg:` = wide (≥ 1440), sesuai grid 2/3/4 kolom di `DESIGN.md §2.4`.

### 9.2 Aturan Konsistensi (wajib, di-review tiap PR)
1. **Dilarang** hex, `rgb()`, atau arbitrary value (`text-[13px]`, `mt-[37px]`) di komponen. Kalau butuh nilai baru, tambahkan ke `@theme` dan update `DESIGN.md`.
2. Semua elemen UI memakai **komponen dari `shared/ui`**. Tidak ada `<button>` mentah di halaman.
3. Varian komponen dibuat dengan **CVA**, bukan kondisi class manual yang tersebar.
4. Semua teks UI memakai Bahasa Indonesia dan format harga lewat `formatRupiah()` → `Rp149.000`.
5. Semua ikon lewat `<Icon />` (Material Symbols Outlined, weight 300, 20/24px).
6. Setiap komponen baru HARUS ditambahkan ke `/_design` beserta semua variannya.

### 9.3 Inventaris Komponen

**Primitives (`shared/ui`)**
`Button` (primary / secondary / link / icon; size md/lg; loading) · `Icon` · `Badge` (new / sale / stock) · `Price` (normal, sale, large) · `Rating` · `Swatch` + `SwatchGroup` · `SizeSelector` · `QuantityStepper` · `Input` · `Select` · `Checkbox` · `Radio` · `RangeSlider` · `Accordion` · `Tabs` · `Chip` (filter, removable) · `Drawer` (left/right/bottom) · `Modal` · `Toast` · `Tooltip` · `Skeleton` · `Breadcrumb` · `Divider` · `ProgressBar` · `Stepper` · `EmptyState` · `VisuallyHidden`

**Composites (di `entities/*/ui`, `features/*/ui`, section halaman di `views/*`)**
`AnnouncementBar` · `Header` · `MegaMenu` · `MobileMenu` · `SearchOverlay` · `Footer` · `NewsletterForm` · `Hero` / `HeroCarousel` · `CategoryTiles` · `ProductCard` · `ProductCarousel` · `ProductGrid` · `EditorialTile` · `CampaignBanner` · `StyleTiles` · `UGCGrid` · `TrustStrip` · `FilterSidebar` · `FilterSheet` · `SortDropdown` · `ActiveFilters` · `LoadMore` · `QuickView` · `ProductGallery` · `Lightbox` · `BuyBox` · `SizeGuideModal` · `SizeFinderDrawer` · `NotifyMeModal` · `TrustBlock` · `CompleteTheLook` · `ReviewSummary` · `ReviewList` · `StickyAddToCart` · `CartDrawer` · `CartItem` · `CartSummary` · `PromoCodeInput` · `FreeShippingProgress` · `CheckoutStepper` · `ShippingForm` · `PaymentMethodPicker` · `OrderSummary`

---

## 10. Animasi (GSAP)

`DESIGN.md §2.6` melarang parallax, bounce, dan animasi masuk per elemen saat scroll. GSAP dipakai untuk **transisi UI yang terasa halus**, bukan dekorasi.

| Elemen | Animasi | Durasi / Ease |
|---|---|---|
| Announcement bar | Slide teks horizontal (timeline loop) | 250ms, `aone` |
| Hero | Intro sekali saat load: headline & CTA fade + translateY 16px, stagger 80ms | 400ms |
| Hero carousel | Crossfade slide + progress dot | 400ms |
| Mega-menu | Height + opacity reveal | 250ms |
| Drawer (cart, filter, menu, quick view, size finder) | Slide dari sisi + backdrop fade | 250ms masuk / 200ms keluar |
| Modal / Lightbox | Scale 0.98→1 + fade | 250ms |
| Accordion | Height auto (`gsap.to(el, {height: "auto"})`) | 250ms |
| Toast | Slide-up + fade, auto dismiss 3s | 250ms |
| Cart badge | Bump scale 1→1.2→1 saat item ditambah | 300ms |
| Add to cart | Tombol → state loading → ✓ "DITAMBAHKAN" 1.2s | 150ms |
| Size belum dipilih | Shake horizontal ±4px, 3x | 300ms |
| Grid filter berubah | `Flip` (opsional) atau fade 150ms | 150–250ms |
| Load more | Item baru fade-in (satu batch, bukan per scroll) | 250ms |
| Sticky add-to-cart mobile | Slide-up dari bawah | 250ms |
| Hover foto kartu | **CSS transition** (bukan GSAP) | 400ms |

**Aturan implementasi**
- Semua animasi via hook `useGSAP()` dengan `scope` ref (auto cleanup), **bukan** `useEffect` mentah.
- Buat util `shared/lib/motion.ts`: konstanta `DUR = { fast: .15, base: .25, slow: .4 }`, `EASE = "aone"` (register `CustomEase` dari `cubic-bezier(0.2,0,0,1)`), dan helper `prefersReducedMotion()`.
- `gsap.matchMedia()` → jika `prefers-reduced-motion: reduce`, set semua durasi ke 0 dan matikan autoplay.
- Animasi hanya pada `transform` & `opacity` (kecuali accordion height).
- Register plugin sekali di `shared/lib/gsap.ts` (client-only), import dari situ.

---

## 11. Data Mock & Layer API

### 11.1 Tipe Data (`src/entities/*/model/types.ts`)
```ts
export type Gender = "wanita" | "pria" | "anak";

export interface Color { id: string; name: string; hex: string }        // "hitam", "Hitam", "#111111"
export interface Size  { label: string; stock: number }                 // stock 0 = habis

export interface Variant {
  color: Color;
  images: { src: string; alt: string; kind: "packshot" | "model" | "detail" | "styling"; modelInfo?: string }[];
  sizes: Size[];
}

export interface Product {
  id: string; slug: string; code: string;               // code: "AO-240115"
  name: string; gender: Gender; category: string; subcategory?: string;
  price: number; compareAtPrice?: number;               // angka dalam rupiah
  badge?: { type: "new" | "sale" | "stock"; label: string };
  fit?: "Slim" | "Regular" | "Oversize" | "Relaxed";
  material: string; care: string[]; description: string; features: string[];
  variants: Variant[];
  rating: number; reviewCount: number;
  tags: string[];                                       // untuk search & "gaya"
  completeTheLook?: string[]; createdAt: string; soldCount: number;
}

export interface Review {
  id: string; productId: string; rating: 1|2|3|4|5; title: string; body: string;
  author: string; heightCm?: number; sizeBought: string; fit: "kekecilan" | "pas" | "kebesaran";
  photos?: string[]; helpful: number; createdAt: string;
}

export interface CartItem { productId: string; colorId: string; size: string; qty: number }
export interface Address { name: string; phone: string; province: string; city: string; district: string; postalCode: string; detail: string }
export interface Order {
  id: string; items: (CartItem & { price: number; name: string; image: string })[];
  address: Address; courier: string; payment: string;
  subtotal: number; discount: number; shipping: number; total: number;
  status: "menunggu_pembayaran" | "dibayar" | "dikemas" | "dikirim" | "selesai"; createdAt: string;
}
```

### 11.2 Isi Data Mock (`src/services/mock/data`)
- **≥ 48 produk** (Wanita 20, Pria 20, Anak 8), dengan nama dan warna mengikuti contoh di desain (Kaos Katun Supima Crew Neck, Kemeja Linen Oversize, dst.)
- Tiap produk 2–6 warna, 4–8 gambar per warna (placeholder boleh), stok bervariasi (termasuk ukuran habis & sisa 1–3)
- Kategori per gender + count, 3–5 review per produk, 4 lookbook, 4 hero slide per gender
- Data wilayah (5 provinsi × beberapa kota/kecamatan), kurir, metode pembayaran, kode promo
- **Gambar**: placeholder bg `#F4F4F4` + label (seperti di desain) di `public/images/placeholder/`, disiapkan agar mudah diganti foto asli (path konsisten `/{slug}/{color}/{n}.webp`)

### 11.3 API Layer (Repository, lihat §12.5)
Semua komponen **hanya** mengakses data lewat hook TanStack Query yang memanggil `repositories.*`, tidak pernah import `services/mock/data` langsung. Daftar operasi yang harus tersedia:
```ts
getProducts(params: { gender?; category?; q?; size?; color?; priceMin?; priceMax?; fit?; promo?; rating?; sort?; page?; pageSize? })
  → Promise<{ items: Product[]; total: number; facets: Facets }>
getProduct(slug) → Promise<Product | null>
getRelated(productId) / getCompleteTheLook(productId)
getReviews(productId, { rating?, withPhoto?, page? })
getHomeContent(gender) → { heroes, categories, newArrivals, bestSellers, lookbooks, styles, ugc }
searchSuggest(q) → { keywords: string[]; products: Product[] }
getCategories(gender)
validatePromo(code, subtotal) → { valid; type; amount; message }
getShippingOptions(address)
createOrder(payload) → Order          // simpan ke localStorage via store
getOrders() / getOrder(id)
```
- Implementasi mock: delay acak **300–600ms** (`await sleep()`), bisa dimatikan via `NEXT_PUBLIC_MOCK_LATENCY=0`
- Flag `NEXT_PUBLIC_API_MODE=mock|live` untuk switch ke backend nanti tanpa mengubah komponen
- Facets (count per filter) dihitung dari hasil query agar count di sidebar selalu benar

### 11.4 State (Zustand, persist ke localStorage)
| Store | Isi | Key |
|---|---|---|
| `useCartStore` (`features/cart/model`) | items, promo, add/remove/updateQty/updateVariant/clear, selector subtotal/total | `aone-cart` |
| `useWishlistStore` (`features/wishlist/model`) | ids, toggle, has | `aone-wishlist` |
| `useRecentStore` (`features/recently-viewed/model`) | recentlyViewed (12), recentSearches (5) | `aone-recent` |
| `useUserStore` (`entities/user/model`) | user dummy, addresses, orders | `aone-user` |
| `useUIStore` (`shared/model`) | cartDrawerOpen, searchOpen, menuOpen, quickViewId, toasts (tidak di-persist) | – |

Hindari hydration mismatch: render badge & komponen yang bergantung pada store setelah mount (hook `useHydrated()`).

---

## 12. Arsitektur & Design Pattern (Scalable)

Tujuan: fitur baru bisa ditambah **tanpa menyentuh fitur lain**, backend bisa disambung **tanpa mengubah komponen**, dan developer baru langsung tahu file harus ditaruh di mana.

### 12.1 Prinsip Arsitektur
1. **Feature-based, bukan type-based.** Kode dikelompokkan per domain bisnis (`catalog`, `cart`, `checkout`, ...), bukan per jenis file.
2. **Layered dengan arah dependency satu arah:**
   ```
   app (routes)  →  features  →  entities  →  shared
   ```
   Layer atas boleh import layer bawah, **tidak boleh sebaliknya**. Antar-feature **tidak boleh saling import langsung**. Kalau butuh, komposisikan di level `app` atau angkat ke `entities`/`shared`.
3. **Public API per modul.** Setiap feature/entity hanya mengekspor lewat `index.ts`. Import ke file internal (`features/cart/ui/CartItem`) dilarang dari luar modul.
4. **UI bodoh, logika di hook/service.** Komponen presentational tidak tahu dari mana data berasal.
5. **Dependency inversion untuk data.** Komponen bergantung pada **interface repository**, bukan implementasi mock/HTTP.
6. **Config-driven** untuk hal yang sering berubah: filter, sort, menu, footer links, promo, section homepage.

### 12.2 Struktur Folder
```
aone-web/
├─ public/
│  ├─ brand/                     # logo-black.svg, logo-white.svg, favicon
│  └─ images/placeholder/
├─ src/
│  ├─ app/                       # ROUTING SAJA: tipis, hanya komposisi
│  │  ├─ (shop)/
│  │  │  ├─ layout.tsx           # Header + Footer + CartDrawer
│  │  │  ├─ page.tsx             # → <HomeView gender=... />
│  │  │  ├─ c/[gender]/[[...category]]/page.tsx
│  │  │  ├─ p/[slug]/page.tsx
│  │  │  ├─ search/page.tsx
│  │  │  ├─ cart/page.tsx
│  │  │  ├─ wishlist/page.tsx
│  │  │  ├─ lookbook/[slug]/page.tsx
│  │  │  ├─ help/[topic]/page.tsx
│  │  │  ├─ (auth)/login/page.tsx · register/page.tsx
│  │  │  └─ account/page.tsx · orders/[id]/page.tsx
│  │  ├─ (checkout)/checkout/page.tsx · success/[orderId]/page.tsx
│  │  ├─ _design/page.tsx
│  │  ├─ providers.tsx           # QueryClientProvider, dll.
│  │  ├─ layout.tsx · globals.css · not-found.tsx · error.tsx
│  │
│  ├─ views/                     # Komposisi 1 halaman penuh (dipanggil dari app/)
│  │  ├─ home/HomeView.tsx
│  │  ├─ plp/PlpView.tsx
│  │  ├─ pdp/PdpView.tsx
│  │  └─ ...
│  │
│  ├─ features/                  # Interaksi user / use case
│  │  ├─ cart/
│  │  │  ├─ ui/                  # CartDrawer, CartItem, CartSummary, FreeShippingProgress
│  │  │  ├─ model/               # store (Zustand), selectors, types lokal
│  │  │  ├─ lib/                 # kalkulasi total, promo rules (pure functions + unit test)
│  │  │  ├─ api/                 # hooks query/mutation (useValidatePromo)
│  │  │  └─ index.ts             # PUBLIC API
│  │  ├─ wishlist/  catalog-filter/  search/  quick-view/  size-finder/
│  │  ├─ checkout/  auth/  reviews/  recently-viewed/  newsletter/
│  │
│  ├─ entities/                  # Domain model yang dipakai banyak feature
│  │  ├─ product/
│  │  │  ├─ model/types.ts       # Product, Variant, Color, Size
│  │  │  ├─ lib/                 # getActiveVariant, isSoldOut, discountPercent
│  │  │  ├─ ui/                  # ProductCard, Price, Rating, SwatchGroup, ProductGallery
│  │  │  ├─ api/                 # useProducts, useProduct (TanStack Query)
│  │  │  └─ index.ts
│  │  ├─ category/  order/  user/  review/  content/ (hero, lookbook, banner)
│  │
│  ├─ shared/                    # Tidak tahu apa-apa soal bisnis
│  │  ├─ ui/                     # Design system primitives (Button, Drawer, Accordion, ...)
│  │  ├─ lib/                    # cn, formatRupiah, sleep, url-state, gsap, motion
│  │  ├─ hooks/                  # useHydrated, useMediaQuery, useInView, useDisclosure
│  │  ├─ config/                 # env.ts (Zod), site.ts, navigation.ts, filters.ts, sort.ts
│  │  └─ types/
│  │
│  ├─ services/                  # DATA ACCESS LAYER
│  │  ├─ repositories/           # Interface (kontrak)
│  │  │  ├─ ProductRepository.ts
│  │  │  ├─ OrderRepository.ts  ContentRepository.ts  PromoRepository.ts ...
│  │  ├─ mock/                   # Implementasi mock (data/ + latency)
│  │  │  ├─ data/                # JSON/TS mock
│  │  │  └─ MockProductRepository.ts ...
│  │  ├─ http/                   # Implementasi live (nanti): httpClient + HttpProductRepository
│  │  ├─ mappers/                # DTO backend → domain model
│  │  └─ index.ts                # Factory: pilih mock/live dari env
│  │
│  └─ styles/                    # (opsional) CSS tambahan per concern
├─ tests/
│  ├─ e2e/                       # Playwright F1–F8
│  └─ unit/                      # atau co-located *.test.ts
├─ docs/
│  ├─ adr/                       # Architecture Decision Records
│  └─ CONTRIBUTING.md
├─ DESIGN.md
└─ PRD.md
```

### 12.3 Aturan Import (dipaksa lewat ESLint)
| Dari ↓ boleh import → | shared | services | entities | features | views | app |
|---|---|---|---|---|---|---|
| **shared** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **services** | ✅ | ✅ | types saja | ❌ | ❌ | ❌ |
| **entities** | ✅ | ✅ | ✅ (entity lain via index) | ❌ | ❌ | ❌ |
| **features** | ✅ | ✅ | ✅ | ❌ (antar-feature) | ❌ | ❌ |
| **views** | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ |
| **app** | ✅ | ✅ (server only) | ✅ | ✅ | ✅ | ✅ |

Enforcement: `eslint-plugin-boundaries` (layer rules) + `no-restricted-imports` (larang deep import, wajib lewat `index.ts`). CI gagal kalau dilanggar.

### 12.4 Design Pattern yang Dipakai

| Pattern | Di mana | Kenapa |
|---|---|---|
| **Repository + Dependency Inversion** | `services/repositories` | Komponen tidak tahu data dari mock atau API. Ganti backend = tambah `Http*Repository`, ubah env. |
| **Factory** | `services/index.ts` | Satu titik memilih implementasi (`mock`/`live`) |
| **Adapter / Mapper** | `services/mappers` | Bentuk response backend boleh berubah, domain model tetap stabil |
| **Server State via TanStack Query** | `entities/*/api`, `features/*/api` | Caching, loading/error state, refetch, prefetch hover, siap untuk API asli. Query key terpusat di `shared/lib/query-keys.ts` |
| **Client State via Zustand (slice per feature)** | `features/*/model` | Cart, wishlist, UI state. Satu store per feature, bukan satu store raksasa |
| **URL as State** | `features/catalog-filter` | Filter/sort/page di query string (pakai `nuqs` atau util sendiri). Bisa di-share, back button benar |
| **Container / Presentational** | `views` & `features/*/ui` | View mengambil data, komponen UI murni menerima props → mudah dites & di-preview di `/_design` |
| **Compound Components** | `Accordion`, `Tabs`, `Drawer`, `Select`, `ProductGallery` | API fleksibel: `<Accordion><Accordion.Item>…` tanpa prop drilling |
| **Headless Hooks** | `useDisclosure`, `useCarousel`, `useSizeSelection`, `useFilters` | Logika reusable terpisah dari markup |
| **Variants via CVA** | `shared/ui/*` | Varian komponen terdefinisi & bertipe, tidak ada class kondisional liar |
| **Strategy** | Promo (`percent`, `free_shipping`, `fixed`), sort, metode pembayaran | Tambah tipe promo/sort/payment = tambah 1 strategy, tanpa `if/else` panjang |
| **Config-driven UI** | `shared/config/filters.ts`, `navigation.ts`, `home-sections.ts` | Tambah filter/menu/section tanpa sentuh komponen |
| **Pure Domain Functions** | `entities/*/lib`, `features/*/lib` | Kalkulasi harga, diskon, stok, total → pure & 100% unit-tested |
| **Error Boundary + Result type** | `error.tsx` per segment, repository mengembalikan error ter-typing | Gagal di satu section tidak merusak satu halaman |

### 12.5 Contoh Kontrak (acuan implementasi)

**Repository interface**
```ts
// services/repositories/ProductRepository.ts
import type { Product, ProductQuery, ProductList, Facets } from "@/entities/product";

export interface ProductRepository {
  list(query: ProductQuery): Promise<ProductList>;          // { items, total, facets }
  getBySlug(slug: string): Promise<Product | null>;
  getRelated(productId: string, limit?: number): Promise<Product[]>;
  getCompleteTheLook(productId: string): Promise<Product[]>;
  suggest(q: string): Promise<{ keywords: string[]; products: Product[] }>;
}
```

**Factory**
```ts
// services/index.ts
import { env } from "@/shared/config/env";
import { MockProductRepository } from "./mock/MockProductRepository";
// import { HttpProductRepository } from "./http/HttpProductRepository";

export const repositories = {
  product: env.NEXT_PUBLIC_API_MODE === "live"
    ? (() => { throw new Error("Live API belum tersedia"); })()   // nanti: new HttpProductRepository(httpClient)
    : new MockProductRepository({ latency: env.NEXT_PUBLIC_MOCK_LATENCY }),
  // order, content, promo, review, region ...
} as const;
```

**Query hook (entity)**
```ts
// entities/product/api/useProducts.ts
export const useProducts = (query: ProductQuery) =>
  useQuery({
    queryKey: queryKeys.products.list(query),
    queryFn: () => repositories.product.list(query),
    placeholderData: keepPreviousData,    // grid tidak kedip saat ganti filter
  });
```

**Config-driven filter**
```ts
// shared/config/filters.ts
export const FILTERS = [
  { key: "category", label: "Kategori", type: "list",   defaultOpen: true },
  { key: "size",     label: "Ukuran",   type: "grid",   defaultOpen: true },
  { key: "color",    label: "Warna",    type: "swatch", defaultOpen: true },
  { key: "price",    label: "Harga",    type: "range",  defaultOpen: true, min: 0, max: 1_000_000, step: 10_000 },
  { key: "fit",      label: "Fit",      type: "list" },
  { key: "material", label: "Bahan",    type: "list" },
  { key: "promo",    label: "Promo",    type: "toggle" },
  { key: "rating",   label: "Rating",   type: "rating" },
] as const satisfies FilterConfig[];
```

**Strategy promo**
```ts
// features/cart/lib/promo.ts
const strategies: Record<PromoType, (ctx: CartCtx, promo: Promo) => number> = {
  percent:       (c, p) => Math.round(c.subtotal * p.value / 100),
  fixed:         (_, p) => p.value,
  free_shipping: (c)    => c.shipping,
};
export const calcDiscount = (ctx: CartCtx, promo?: Promo) => promo ? strategies[promo.type](ctx, promo) : 0;
```

### 12.6 Konvensi

| Hal | Aturan |
|---|---|
| Nama file komponen | `PascalCase.tsx` (1 komponen utama per file) |
| Hook | `useCamelCase.ts` |
| Util / lib | `kebab-case.ts` |
| Test | co-located `*.test.ts(x)` untuk unit, `tests/e2e/*.spec.ts` untuk E2E |
| Server vs client | Default Server Component. `"use client"` hanya di komponen interaktif paling kecil (leaf) |
| Props | Tipe `XxxProps`, tanpa `any`, gunakan `ComponentPropsWithoutRef<"button">` untuk extend native |
| Env | Divalidasi Zod di `shared/config/env.ts`; aplikasi gagal start jika env salah |
| Konstanta & copy | Teks UI berulang di `shared/config/copy.ts` (siap untuk i18n nanti) |
| Ukuran file | Komponen ≤ 200 baris, fungsi ≤ 50 baris. Pecah kalau lebih |
| Git | Conventional Commits (`feat(cart): ...`, `fix(plp): ...`), branch `feat/*`, `fix/*` |
| Keputusan arsitektur | Dicatat sebagai ADR di `docs/adr/NNNN-judul.md` |

### 12.7 Quality Gate (CI, GitHub Actions + Bun)
1. `bun install --frozen-lockfile`
2. `bun run typecheck` → `bun run lint` (termasuk boundaries & token rules)
3. `bun test` (unit: domain functions, stores, mappers) – coverage `lib/` & `model/` ≥ 80%
4. `bun run build`
5. `bun run e2e` (Playwright F1–F8, headless)
6. Husky + lint-staged di pre-commit: prettier + eslint untuk file yang berubah

### 12.8 Cara Menambah Fitur Baru (contoh: "Bandingkan Produk")
1. Buat `features/compare/` dengan `ui/`, `model/`, `lib/`, `index.ts`
2. Butuh data baru? Tambah method di interface repository → implementasi di `mock/` (dan nanti `http/`)
3. Komponen UI baru → daftarkan di `/_design`
4. Pasang di `views/` atau `app/` (bukan di feature lain)
5. Tambah unit test untuk `lib/` + 1 E2E flow
6. Tidak ada file di feature lain yang berubah → **scalable**

---

## 13. Requirement Non-Fungsional

**Responsive:** mobile-first; diuji di 375, 390, 768, 1024, 1280, 1440px. Tidak ada horizontal scroll.

**Aksesibilitas (WCAG 2.1 AA):**
- Semua interaktif bisa via keyboard; focus trap di drawer/modal; `Esc` menutup overlay
- ARIA: `aria-expanded`, `aria-controls`, `aria-live="polite"` untuk toast & update jumlah hasil filter
- Target sentuh ≥ 44px, `alt` deskriptif untuk semua gambar produk
- Status tidak hanya dibedakan dengan warna (sesuai desain monokrom: ikon + teks)

**Performa:**
- Gambar `next/image` + `sizes` benar; hero `priority`; lainnya lazy
- Skeleton dengan rasio sama (tanpa CLS)
- GSAP & komponen berat (Lightbox, QuickView, SizeFinder) di-`dynamic import`
- Server Components untuk halaman konten; client component hanya untuk bagian interaktif

**SEO dasar:** `generateMetadata` per halaman (title, description, OG image), `lang="id"`, URL bersih.

**Kualitas kode:** lihat konvensi & quality gate di §12.6–12.7.

---

## 14. Milestone

| # | Milestone | Deliverable | Estimasi |
|---|---|---|---|
| M0 | **Setup & Arsitektur** | Repo Next.js + Bun, Tailwind v4 `@theme`, font Inter, Icon, struktur folder §12.2, ESLint boundaries, Prettier, Husky, CI, Playwright, TanStack Query provider, env Zod, `shared/lib/gsap.ts` + `motion.ts`, ADR-0001 arsitektur | 2 hari |
| M1 | **Design System** | Semua primitives + halaman `/_design` lengkap dengan varian | 3–4 hari |
| M2 | **Data & State** | Entity types, repository interfaces, mock repositories + data 48 produk, query hooks, Zustand stores per feature, nuqs URL state, unit test domain functions | 2–3 hari |
| M3 | **Layout Global** | Announcement bar, Header, Mega-menu, Mobile menu, Footer, Toast, Cart drawer shell | 2 hari |
| M4 | **Homepage** | Semua section + tab gender + carousel | 2 hari |
| M5 | **PLP + Search** | Filter/sort/URL sync, load more, editorial tile, filter sheet mobile, search overlay & hasil | 3–4 hari |
| M6 | **PDP** | Galeri, lightbox, buy box, size guide, size finder, notify me, reviews, rekomendasi, sticky mobile, quick view | 3–4 hari |
| M7 | **Cart & Checkout** | Keranjang, promo, 3-step checkout, success, orders | 3 hari |
| M8 | **Akun, Wishlist, Lookbook, Help, 404** | Semua halaman sisa | 2 hari |
| M9 | **Animasi & Polish** | Semua animasi GSAP Bagian 10, reduced motion, empty states, loading states | 2 hari |
| M10 | **QA** | Playwright F1–F8, audit Lighthouse, a11y (axe), cross-browser (Chrome, Safari iOS, Firefox) | 2 hari |

**Total estimasi: ±5 minggu (1 developer).**

---

## 15. QA Checklist Konsistensi Desain

- [ ] Hanya warna token (`white`, `subtle`, `border`, `disabled`, `muted`, `ink`) yang dipakai
- [ ] Radius 0 di semua elemen kecuali swatch, badge cart, dan icon button bulat
- [ ] Satu tombol primary per area pandang, CTA selalu hitam
- [ ] Semua foto kartu 3:4 bg `#F4F4F4`, skala konsisten
- [ ] Judul section rata kiri, nama produk clamp 2 baris
- [ ] Harga format `Rp149.000`, tabular-nums
- [ ] Label tombol UPPERCASE bold letter-spacing 0.04em
- [ ] Spacing section 48px mobile / 96px desktop
- [ ] Setiap halaman punya langkah berikutnya (tidak ada dead end)
- [ ] Screenshot tiap halaman dibandingkan side-by-side dengan screen Claude Design

---

## 16. Risiko & Asumsi

| Risiko / Asumsi | Mitigasi |
|---|---|
| Link artifact yang dibagikan hanya berisi screen **PLP** + komponen Header, Product Card, Footer. Screen lain (Homepage, PDP, Search, Keranjang) direferensikan tapi tidak ikut ter-export. | Export/share semua screen dari Claude Design sebelum M4. Sementara itu, implementasi mengikuti `DESIGN.md` §4–5. |
| Asset logo (`logo-black.png`, `logo-white.png`) & foto produk belum tersedia | Pakai wordmark teks "AONE" + placeholder; siapkan versi SVG logo |
| Behavior mock berbeda dengan backend nanti | Interface repository (`services/repositories`) + tipe entity jadi acuan kontrak API backend |
| Hydration mismatch karena localStorage | Hook `useHydrated()` untuk semua UI berbasis store |
| GSAP berlebihan membuat UI terasa "ramai" | Batasi ke daftar Bagian 10; review di M9 |

## 17. Next Phase (setelah Phase 1)

1. Backend API (Go/Node) mengikuti interface repository + tipe entity, lalu tambah `services/http/*Repository`
2. Auth asli (NextAuth/Auth.js atau JWT dari backend)
3. Payment gateway (Midtrans/Xendit) + webhook status order
4. CMS untuk hero, lookbook, banner
5. Analytics (GA4/PostHog) + event e-commerce (view_item, add_to_cart, begin_checkout, purchase)