# DESIGN.md — Aone Fashion E-commerce Design System

> **Untuk:** Claude Design
> **Arah visual:** Seperti **Uniqlo**: bersih, fungsional, grid rapi, **hitam-putih murni** (tanpa warna aksen).
> **Standar UX:** Gabungan pola terbaik **Uniqlo, Lacoste, Nike**.
> **Goal utama:** Produk terlihat **menarik dan jelas**, supaya user yakin dan **membeli**.
> **Bahasa UI:** Bahasa Indonesia. **Mata uang:** Rupiah (`Rp149.000`).
> **Nama brand:** **Aone** (logo/wordmark hitam di atas putih, atau putih di atas hitam).

---

## 0. Cara Pakai Dokumen Ini

- Semua aturan bertanda **HARUS** tidak boleh dilanggar. **SEBAIKNYA** boleh disesuaikan kalau ada alasan jelas.
- Kalau ragu, pilih opsi yang **lebih sederhana, lebih banyak whitespace, dan membuat produk lebih besar**.
- Gunakan hanya token di Bagian 2. Jangan mengarang warna, ukuran font, atau spacing baru.

---

## 1. Prinsip Desain (urut prioritas)

1. **Produk adalah hero.** UI harus "menghilang". Foto produk selalu menjadi elemen paling besar dan paling kontras di layar.
2. **Hitam-putih murni.** Seluruh UI, termasuk logo, promo, dan status, hanya memakai hitam, putih, dan abu netral. Satu-satunya warna di layar datang dari **foto produk**, sehingga produk selalu paling menonjol. Penekanan dibuat lewat **kontras (hitam solid vs putih), ukuran, dan ketebalan font**, bukan warna.
3. **Jelas sebelum indah.** User HARUS bisa menjawab dalam 3 detik: *ini apa, harganya berapa, warna/ukuran apa yang tersedia.*
4. **Jawab keraguan di tempat keraguan muncul.** Info ukuran ada di dekat size selector. Info ongkir, retur, dan COD ada tepat di bawah tombol beli.
5. **Tidak ada jalan buntu.** Setiap halaman punya langkah berikutnya: rekomendasi, kategori terkait, atau CTA.
6. **Ritme Besar → Kecil → Besar.** Selang-seling banner full-width dengan grid/carousel produk supaya scroll tidak membosankan.
7. **Mobile-first.** Mayoritas user belanja dari HP. Desain mobile dulu, lalu kembangkan ke desktop.

---

## 2. Design Tokens

### 2.1 Warna

| Token | Hex | Pemakaian |
|---|---|---|
| `--color-bg` | `#FFFFFF` | Background utama |
| `--color-bg-subtle` | `#F4F4F4` | Background foto produk, section alternatif, input |
| `--color-bg-inverse` | `#111111` | Announcement bar, footer, tombol primary |
| `--color-text` | `#111111` | Teks utama, harga normal |
| `--color-text-secondary` | `#6B6B6B` | Meta info (gender, range ukuran, jumlah ulasan) |
| `--color-text-disabled` | `#B5B5B5` | Ukuran habis, tombol disabled |
| `--color-text-inverse` | `#FFFFFF` | Teks di atas bg gelap/foto |
| `--color-border` | `#E3E3E3` | Garis pemisah, border input, border kotak size |
| `--color-border-strong` | `#111111` | Border terpilih (size/swatch aktif), focus |
| `--color-promo-bg` | `#111111` | Badge SALE/diskon (bg hitam, teks putih) |
| `--color-state` | `#111111` | Status sukses/peringatan/error: selalu hitam **+ ikon** (✓ / ! / ⚠) sebagai pembeda |
| `--color-rating` | `#111111` | Bintang rating (hitam, bukan kuning, supaya tetap monokrom) |

**Aturan warna**
- HARUS: ≥ 90% permukaan UI hanya putih, `#F4F4F4`, dan hitam.
- HARUS: palet hanya `#FFFFFF`, `#F4F4F4`, `#E3E3E3`, `#B5B5B5`, `#6B6B6B`, `#111111`. **Tidak ada warna lain** di UI (tidak ada merah, hijau, kuning, biru).
- HARUS: promo/diskon ditandai dengan **badge hitam solid + teks putih** dan harga bold, bukan warna.
- HARUS: status (error, sukses, stok menipis) dibedakan dengan **ikon + teks**, bukan warna.
- HARUS: kontras teks minimal WCAG AA (4.5:1 untuk teks normal).
- JANGAN: gradient, warna dekoratif, atau warna aksen apa pun.

### 2.2 Tipografi

- **Font utama:** `"Inter", "Helvetica Neue", Arial, sans-serif` (sans-serif netral dan geometris, mendekati karakter UniqloPro).
- **Angka harga:** gunakan `font-variant-numeric: tabular-nums;`.
- Hanya 3 weight: **400** (regular), **500** (medium), **700** (bold).

| Token | Size / Line-height (mobile → desktop) | Weight | Pemakaian |
|---|---|---|---|
| `--text-display` | 32/38 → 56/62 | 700 | Headline hero/kampanye |
| `--text-h1` | 24/30 → 36/44 | 700 | Judul halaman, nama produk di PDP |
| `--text-h2` | 20/26 → 28/36 | 700 | Judul section ("Produk Terbaru") |
| `--text-h3` | 16/22 → 20/28 | 700 | Sub-section, judul accordion |
| `--text-body` | 14/22 → 16/24 | 400 | Paragraf, deskripsi |
| `--text-small` | 12/18 → 14/20 | 400 | Nama produk di kartu, meta info |
| `--text-caption` | 11/16 → 12/16 | 400/500 | Label foto, badge, footer legal |
| `--text-price` | 16/22 → 18/24 | 700 | Harga di kartu |
| `--text-price-lg` | 24/30 → 28/34 | 700 | Harga di PDP |
| `--text-button` | 14/20 | 700, UPPERCASE, letter-spacing 0.04em | Label tombol |

**Aturan tipografi**
- HARUS: judul section rata kiri, bukan tengah (gaya Uniqlo/Nike).
- HARUS: nama produk di kartu maksimal 2 baris, sisanya `…`.
- JANGAN: italic, font dekoratif, atau teks di bawah 11px.

### 2.3 Spacing (basis 4px)

`--space-1: 4px` · `--space-2: 8px` · `--space-3: 12px` · `--space-4: 16px` · `--space-5: 24px` · `--space-6: 32px` · `--space-7: 48px` · `--space-8: 64px` · `--space-9: 96px`

| Konteks | Mobile | Desktop |
|---|---|---|
| Padding samping halaman | 16px | 40px (max-width konten 1440px) |
| Jarak antar section homepage | 48px | 96px |
| Gap grid produk | 8px horizontal / 24px vertikal | 16px / 40px |
| Padding dalam kartu (area teks) | 8px atas, 0 samping | 12px atas |

### 2.4 Grid & Breakpoint

| Breakpoint | Lebar | Kolom produk | Kolom layout |
|---|---|---|---|
| `sm` | < 768px | **2** | 4 |
| `md` | 768–1023px | 3 | 8 |
| `lg` | 1024–1439px | 4 | 12 |
| `xl` | ≥ 1440px | 4 (maks 5) | 12 |

### 2.5 Radius, Border, Shadow

- `--radius-none: 0` → **default untuk semua**: tombol, kartu, input, kotak size, gambar (gaya Uniqlo yang tegas).
- `--radius-full: 999px` → hanya untuk swatch warna, badge jumlah cart, avatar, tombol ikon bulat (panah carousel, wishlist).
- Border: `1px solid var(--color-border)`. State terpilih: `1.5px solid var(--color-border-strong)`.
- Shadow: **tidak dipakai** di kartu/tombol. Hanya `0 4px 24px rgba(0,0,0,.08)` untuk dropdown, drawer, modal, dan sticky bar mobile.

### 2.6 Motion

- Durasi: `150ms` (hover, toggle), `250ms` (drawer, accordion), `400ms` (fade gambar).
- Easing: `cubic-bezier(0.2, 0, 0, 1)`.
- HARUS: hormati `prefers-reduced-motion`. Matikan autoplay dan animasi besar.
- JANGAN: parallax, bounce, animasi masuk per elemen saat scroll.

### 2.7 CSS Variables (copy-paste)

```css
:root {
  --color-bg:#FFFFFF; --color-bg-subtle:#F4F4F4; --color-bg-inverse:#111111;
  --color-text:#111111; --color-text-secondary:#6B6B6B; --color-text-disabled:#B5B5B5;
  --color-text-inverse:#FFFFFF; --color-border:#E3E3E3; --color-border-strong:#111111;
  --color-promo-bg:#111111; --color-state:#111111; --color-rating:#111111;

  --font-sans:"Inter","Helvetica Neue",Arial,sans-serif;
  --fw-regular:400; --fw-medium:500; --fw-bold:700;

  --space-1:4px; --space-2:8px; --space-3:12px; --space-4:16px; --space-5:24px;
  --space-6:32px; --space-7:48px; --space-8:64px; --space-9:96px;

  --radius-none:0; --radius-full:999px;
  --shadow-overlay:0 4px 24px rgba(0,0,0,.08);
  --ease:cubic-bezier(.2,0,0,1); --dur-fast:150ms; --dur-base:250ms; --dur-slow:400ms;

  --header-h:64px; --announce-h:36px; --page-max:1440px;
}
@media (max-width:767px){ :root{ --header-h:56px; } }
```

---

## 3. Aturan Gambar (Paling Penting)

| Jenis | Rasio | Background | Aturan |
|---|---|---|---|
| Foto kartu produk (utama) | **3:4** | `#F4F4F4` polos | Produk di tengah, isi ±80% frame, konsisten antar produk |
| Foto kartu (hover, desktop) | 3:4 | Bebas | Foto on-model; crossfade 400ms saat hover |
| Galeri PDP | 3:4 | Urutan: packshot → on-model depan → belakang → detail bahan → styling | Minimal 4 foto, ideal 6–8 |
| Hero homepage | Mobile 4:5, desktop 16:9 (atau 21:9) | Foto lifestyle/on-model | Area kiri-bawah harus polos/gelap untuk teks |
| Banner kampanye | Mobile 4:5, desktop 16:9 | Lifestyle | Maks 1 headline + 1 subjudul + 1 CTA |
| Tile kategori | 1:1 | `#F4F4F4` | Packshot produk representatif, label di bawah |

**Aturan wajib**
- HARUS: semua foto kartu dalam satu grid punya rasio, background, dan skala produk yang **sama**. Konsistensi adalah yang membuat grid terlihat mahal.
- HARUS: tampilkan **label model** di pojok kiri bawah foto on-model di PDP, contoh: `Tinggi model 175 cm · Pakai ukuran L` (caption 11–12px, bg putih 85% opacity).
- HARUS: gambar pertama di atas fold `fetchpriority="high"`, sisanya `loading="lazy"`, format WebP/AVIF, pakai `srcset`.
- HARUS: skeleton `#F4F4F4` dengan rasio yang sama selama gambar dimuat (tidak boleh ada layout shift).
- JANGAN: foto dengan background ramai di kartu produk, watermark, teks promo ditanam di dalam foto produk, atau border/shadow di sekeliling foto.

---

## 4. Komponen

### 4.1 Announcement Bar
- Tinggi 36px, bg `--color-bg-inverse`, teks putih `--text-caption` 500, center.
- Isi: 1 pesan rotasi (maks 3 pesan, ganti tiap 5 detik, ada panah `‹ ›`).
- Contoh: `Gratis ongkir min. belanja Rp300.000` · `Tukar ukuran gratis 14 hari` · `Bisa COD & cicilan 0%`.

### 4.2 Header
- **Sticky**, bg putih, border-bottom `--color-border`, tinggi `--header-h`.
- **Desktop:** `[Logo AONE hitam]  WANITA  PRIA  ANAK  |  [Search bar lebar ±420px di tengah-kanan]  ♡  👤  🛍(badge)`
- **Mobile:** `☰  [Logo]  ……  🔍  🛍(badge)`. Search terbuka sebagai layar penuh.
- Nav gender: `--text-small` 700 UPPERCASE. Item aktif diberi underline 2px hitam.
- Hover nav desktop → **mega-menu** full-width: kolom kategori (teks) + 1–2 tile gambar kampanye di kanan. Maksimal **3 level** (Gender › Kategori › Sub-kategori).
- Ikon: line 1.5px, 24px, hitam. Badge cart: lingkaran hitam 16px, angka putih 10px.

### 4.3 Tombol

| Varian | Style | Pemakaian |
|---|---|---|
| **Primary** | bg `#111`, teks putih, UPPERCASE bold, tinggi 48px (mobile 52px), radius 0 | "TAMBAH KE KERANJANG", "CHECKOUT", "BELI SEKARANG" |
| **Secondary** | bg putih, border 1px `#111`, teks `#111` | "TAMBAH KE WISHLIST", "LIHAT SEMUA" |
| **Tertiary / Link** | teks `#111` underline, tanpa box | "Panduan ukuran", "Lihat detail" |
| **Icon button** | 40×40, bulat, bg putih/`#F4F4F4` | Panah carousel, wishlist, zoom |
| **Pill filter** | tinggi 36px, border 1px, radius 0 | Chip filter aktif `Hitam ✕` |

- Hover primary: bg `#333`. Disabled: bg `#E3E3E3`, teks `#B5B5B5`.
- Focus: outline 2px `#111` offset 2px.
- HARUS: hanya **1 tombol primary** per area pandang.

### 4.4 Kartu Produk (komponen paling penting)

```
┌──────────────────────────┐
│ [BARU]                   │  ← badge kiri atas (opsional)
│                          │
│     FOTO 3:4 #F4F4F4     │  ← hover desktop: foto kedua
│                          │
└──────────────────────────┘
● ○ ○ ○ +2              ♡    ← swatch 14px (maks 4 + "+N"), wishlist kanan
Pria · S–XXL                 ← meta, --text-caption, abu
Kaos Katun Oversize          ← nama, --text-small, maks 2 baris
Rp149.000                    ← --text-price, hitam bold
Rp129.000  Rp̶1̶4̶9̶.̶0̶0̶0̶         ← kalau diskon: hitam bold + harga lama coret abu + badge -13%
★ 4.8 (212)                  ← rating, --text-caption
```

- Seluruh kartu bisa diklik (kecuali swatch dan ♡).
- Klik swatch → foto kartu berganti ke warna tersebut (tanpa pindah halaman).
- ♡ toggle: outline → terisi hitam + toast "Ditambahkan ke wishlist".
- Badge (maks 1 per kartu, kiri atas, caption 11px bold UPPERCASE, padding 4×6):
  - `BARU` → bg putih, teks hitam
  - `SALE` / `-30%` / `HARGA TERBATAS` → bg hitam `#111`, teks putih
  - `STOK TERBATAS` → bg putih, teks abu `#6B6B6B`, border 1px `#E3E3E3`
- Desktop (SEBAIKNYA): tombol **"Lihat Cepat"** muncul di bawah foto saat hover → quick view drawer untuk memilih ukuran dan tambah ke keranjang.
- JANGAN: tombol "Add to cart" permanen di setiap kartu, deskripsi panjang, atau lebih dari 1 badge.

### 4.5 Swatch Warna
- Lingkaran 14px (kartu) / 32px (PDP), border 1px `#E3E3E3`.
- Terpilih: ring luar 1.5px `#111` dengan jarak 2px.
- Habis: diagonal strike abu, tetap bisa diklik untuk "Beri tahu saya".
- PDP: tampilkan nama warna di atas swatch → `Warna: 09 Hitam`.

### 4.6 Size Selector
- Kotak 48×40px, border 1px `#E3E3E3`, teks 14px, radius 0.
- Terpilih: bg `#111`, teks putih.
- Habis: teks `#B5B5B5` + garis diagonal. Klik → "Beri tahu saya saat tersedia".
- Stok menipis: teks kecil di bawah grid `! Sisa 2 untuk ukuran M` (hitam, 500, dengan ikon).
- Di atas grid: `Ukuran: M` + link kanan `📏 Panduan ukuran` · `Cari ukuranmu`.
- "Cari ukuranmu" → drawer: input tinggi, berat, preferensi fit (Pas / Regular / Longgar) → rekomendasi ukuran.

### 4.7 Carousel Produk
- Judul section kiri, `Lihat semua ›` + panah bulat `‹ ›` di kanan (desktop).
- Kartu terakhir yang terlihat **terpotong ±30%** (peek) supaya jelas bisa digeser.
- Mobile: swipe, 2.3 kartu terlihat. Desktop: 4.3 kartu.
- Scroll-snap per kartu. Tidak ada autoplay untuk carousel produk.

### 4.8 Hero / Banner Kampanye
- Full-bleed (tanpa padding samping).
- Teks di kiri bawah: label kecil (caption UPPERCASE) → headline `--text-display` → subjudul 1 baris → 1 tombol primary (atau putih kalau di atas foto gelap).
- Kalau carousel: maks 4 slide, dot indikator + tombol pause, autoplay 6 detik, berhenti saat hover/fokus.
- Video: muted, loop, `playsinline`, poster image wajib.

### 4.9 Tile Kategori
- Grid 4 kolom mobile (ikon kecil) / 8 kolom desktop.
- Foto 1:1 bg `#F4F4F4` + label `--text-small` di bawah, center.
- Diakhiri tombol secondary full-width `LIHAT SEMUA KATEGORI`.

### 4.10 Filter & Sort (PLP)
- **Desktop:** sidebar kiri 240px, bisa disembunyikan (`Sembunyikan Filter ⚙`). Grup filter berupa accordion.
- **Mobile:** bar sticky di bawah header: `[⚙ Filter (2)]  [Urutkan ▾]` → bottom sheet full-height, tombol `TAMPILKAN 128 PRODUK` di bawah.
- Grup filter: Kategori · Ukuran · Warna (swatch grid) · Harga (range slider + input) · Fit · Bahan · Promo · Rating.
- Filter aktif tampil sebagai chip di atas grid + `Hapus semua`.
- Sort: Rekomendasi · Terbaru · Terlaris · Harga terendah · Harga tertinggi · Rating.
- HARUS: filter diterapkan tanpa reload penuh, state tersimpan di URL query.

### 4.11 Buy Box (PDP)
Urutan dari atas ke bawah:
1. Breadcrumb kecil
2. Nama produk (`--text-h1`) + kode produk (caption abu)
3. ★ 4.8 · 212 ulasan (link ke section ulasan)
4. Harga (`--text-price-lg`), kalau diskon: hitam bold + harga lama coret abu + badge hitam `-20%`
5. Info cicilan: `atau 3× Rp49.667 cicilan 0%` (caption, link)
6. Swatch warna + nama warna
7. Size selector + panduan ukuran
8. Quantity stepper `– 1 +` (lebar 120px) + **tombol primary** `TAMBAH KE KERANJANG` (flex-1)
9. Tombol secondary `♡ TAMBAH KE WISHLIST`
10. **Trust block** (tepat di bawah CTA, ikon line + teks caption):
    - 🚚 `Gratis ongkir min. Rp300.000 · Estimasi tiba 2–4 hari`
    - ↩ `Tukar ukuran gratis 14 hari`
    - 💳 `COD, transfer, e-wallet, cicilan 0%`
11. Accordion (tertutup kecuali yang pertama): **Deskripsi** · **Bahan & Perawatan** · **Ukuran & Fit** · **Pengiriman & Pengembalian**

- Desktop: buy box **sticky** (`top: header-h + 24px`) di kolom kanan (±40%), galeri di kiri (±60%).
- Mobile: galeri swipe full-width di atas → buy box di bawah → **sticky bottom bar** muncul saat tombol utama keluar dari viewport: `Rp149.000 | [TAMBAH KE KERANJANG]`.

### 4.12 Galeri PDP
- Desktop: **grid 2 kolom** gambar 3:4 (gaya Uniqlo). Klik → lightbox fullscreen dengan zoom.
- Mobile: carousel swipe + counter `1/8` + dot. Double-tap untuk zoom.
- Ikon 🔍 kecil di pojok kanan bawah gambar pertama.
- Video produk (kalau ada) ditaruh di posisi ke-2 atau ke-3.

### 4.13 Ulasan
- Ringkasan: rata-rata besar (`4.8`), bintang, total ulasan, bar distribusi 5→1.
- Ringkasan fit: `Ukuran: Kekecilan ●──○──● Kebesaran` (mayoritas "Pas").
- Filter: `Dengan foto` · rating · ukuran yang dibeli.
- Kartu ulasan: bintang, judul, isi (maks 4 baris + `Selengkapnya`), `Tinggi 170 cm · Beli M · Pas`, foto thumbnail, `Membantu (12)`.

### 4.14 Rekomendasi
Di PDP, urutan section di bawah buy box:
1. **Lengkapi Gayamu** (produk pelengkap, dengan checkbox + "Tambah semua ke keranjang")
2. **Ulasan**
3. **Produk Serupa** (carousel)
4. **Terakhir Dilihat** (carousel)

### 4.15 Cart Drawer / Mini Cart
- Setelah "Tambah ke keranjang": **drawer kanan** (desktop 420px) / bottom sheet (mobile), bukan pindah halaman.
- Isi: `✓ Ditambahkan ke keranjang` → item (foto kecil, nama, warna/ukuran, harga) → progress ongkir `Tambah Rp51.000 lagi untuk gratis ongkir` (bar hitam) → `LIHAT KERANJANG` (secondary) + `CHECKOUT` (primary) → 4 rekomendasi kecil.

### 4.16 Form & Input
- Tinggi 48px, border 1px `#E3E3E3`, radius 0, label di atas (caption 500).
- Focus: border `#111`. Error: border 1.5px `#111` + ikon ⚠ + teks pesan error hitam di bawah field (tanpa warna merah).
- Validasi inline saat blur, bukan saat submit saja.

### 4.17 Feedback
- **Toast:** bottom-center (mobile) / kanan atas (desktop), bg `#111`, teks putih, 3 detik, ada aksi (`Lihat`).
- **Empty state:** ilustrasi line sederhana/foto + kalimat jelas + CTA (`Keranjangmu masih kosong` → `MULAI BELANJA`).
- **Loading:** skeleton sesuai bentuk komponen, bukan spinner di tengah layar.

### 4.18 Footer
- bg `#111` (atau `#F4F4F4`), 4 kolom: Bantuan · Tentang Kami · Akun · Ikuti Kami.
- Newsletter: input + tombol `DAFTAR` → `Dapatkan diskon 10% untuk pembelian pertama`.
- Baris bawah: ikon metode pembayaran & ekspedisi (grayscale), copyright.

---

## 5. Template Halaman

### 5.1 Homepage (urutan wajib)
1. Announcement bar
2. Header (tab gender aktif mengganti konten homepage: Wanita / Pria / Anak)
3. **Hero** full-bleed (1 kampanye utama)
4. **Cari berdasarkan kategori** (tile grid + `LIHAT SEMUA KATEGORI`)
5. **Produk Terbaru** (carousel)
6. **Banner kampanye / lookbook** full-width (gaya editorial)
7. **Terlaris** (grid 4×2 atau carousel, dengan rating)
8. **Belanja Berdasarkan Gaya**: 3–4 tile besar (Kerja, Santai, Olahraga, Hangout)
9. **Banner koleksi/kolaborasi** kedua
10. **Dari Pelanggan Kami**: grid foto UGC (klik → produk yang dipakai)
11. **Trust strip**: 4 ikon (Gratis ongkir · Retur mudah · Pembayaran aman · CS WhatsApp)
12. Footer

### 5.2 Halaman Kategori / PLP
1. Breadcrumb
2. Judul kategori + jumlah produk (`Kaos Pria · 128 produk`)
3. Chip sub-kategori horizontal (scrollable)
4. Bar filter/sort (sticky)
5. Grid produk. **Setiap 12 produk** sisipkan 1 tile editorial (span 2 kolom × 2 baris) yang berisi lookbook/promo terkait.
6. Pagination: tombol `MUAT LEBIH BANYAK` + teks `Menampilkan 24 dari 128` (bukan infinite scroll murni, supaya footer tetap bisa diakses)

### 5.3 PDP
Galeri + Buy box (4.11–4.12) → Lengkapi Gayamu → Ulasan → Produk Serupa → Terakhir Dilihat → Footer

### 5.4 Search
- Overlay saat fokus: **Pencarian populer** (chip), **Pencarian terakhir**, 4 produk trending.
- Saat mengetik: autosuggest kata kunci + 4 produk dengan foto & harga.
- Hasil: layout PLP. Kalau 0 hasil, tampilkan saran ejaan + produk populer (tidak boleh halaman kosong).

### 5.5 Keranjang
- Kiri: daftar item (foto 3:4 kecil, nama, warna, ukuran **bisa diubah langsung**, qty, hapus, pindah ke wishlist).
- Kanan (sticky): ringkasan: subtotal, ongkir, diskon, input kode promo, **total**, `CHECKOUT` primary, ikon metode pembayaran.
- Progress bar gratis ongkir di atas daftar item.

### 5.6 Checkout
- **Tanpa header navigasi** (hanya logo + `🔒 Checkout Aman`) untuk mengurangi distraksi.
- Guest checkout diizinkan. Login opsional.
- Stepper: **Pengiriman → Pembayaran → Review**.
- Ringkasan pesanan selalu terlihat (sidebar desktop / collapsible mobile).
- Metode pembayaran: VA bank, e-wallet (GoPay, OVO, DANA, ShopeePay), QRIS, kartu kredit, COD, cicilan.

---

## 6. Copywriting (Bahasa Indonesia)

- Nada: ramah, singkat, jelas. Pakai "kamu", bukan "Anda" (SEBAIKNYA, boleh diganti sesuai brand).
- Label tombol: kata kerja + objek, UPPERCASE: `TAMBAH KE KERANJANG`, `LIHAT SEMUA`, `CHECKOUT`.
- Format harga: `Rp149.000` (tanpa spasi, titik ribuan, tanpa ,00).
- Headline kampanye maksimal 6 kata.
- JANGAN: jargon teknis, huruf kapital semua untuk paragraf, atau tanda seru berlebihan.

---

## 7. Aksesibilitas

- Kontras minimal AA. Target sentuh minimal **44×44px**.
- Semua gambar produk punya `alt` deskriptif: `Kaos Katun Oversize warna hitam, tampak depan`.
- Semua interaksi bisa dilakukan dengan keyboard. Focus ring selalu terlihat.
- Carousel bisa di-pause, dikontrol keyboard, dan punya `aria-label`.
- Warna tidak boleh jadi satu-satunya penanda (ukuran habis = warna abu **+** garis diagonal).

---

## 8. Do & Don't

| ✅ DO | ❌ DON'T |
|---|---|
| Foto besar, bg `#F4F4F4` konsisten | Background foto beda-beda di satu grid |
| Satu CTA primary hitam per layar | Tombol atau elemen UI berwarna (merah, hijau, oranye, dll.) |
| Whitespace lega antar section | Banner promo menumpuk dan saling berebut perhatian |
| Info ukuran/ongkir/retur dekat tombol beli | Info penting disembunyikan di footer |
| Pop-up newsletter muncul setelah 30 detik atau exit intent, mudah ditutup | Pop-up langsung muncul saat halaman dibuka |
| Cookie banner kecil di pojok | Modal consent yang memblokir layar penuh |
| Kartu produk dengan swatch + rating | Kartu dengan deskripsi panjang / banyak badge |
| Radius 0 konsisten (gaya Uniqlo) | Campur tombol kotak dan tombol bulat |
| Skeleton loading | Spinner di tengah layar / layout shift |
| Mega-menu maksimal 3 level | Menu bertingkat 4–5 level |

---

## 9. Checklist Sebelum Desain Dianggap Selesai

- [ ] Produk jadi elemen terbesar di setiap halaman belanja
- [ ] Tidak ada warna selain hitam, putih, dan abu di UI (warna hanya dari foto produk)
- [ ] Semua kartu produk memiliki: foto 3:4, swatch, nama, harga, rating, wishlist
- [ ] PDP memiliki: galeri ≥ 4 foto, label model, panduan ukuran, trust block di bawah CTA, accordion, ulasan, rekomendasi
- [ ] Mobile memiliki sticky "Tambah ke Keranjang" di PDP dan sticky filter di PLP
- [ ] Tambah ke keranjang membuka drawer (tidak pindah halaman) + progress gratis ongkir
- [ ] Tidak ada halaman buntu (0 hasil, keranjang kosong, 404 semuanya punya CTA)
- [ ] Semua teks dalam Bahasa Indonesia, harga berformat `Rp149.000`
- [ ] Lolos kontras AA, target sentuh ≥ 44px