"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/shared/ui";

const TOPICS = [
  { icon: "receipt_long", label: "Pesanan", count: 12, id: "pesanan" },
  { icon: "local_shipping", label: "Pengiriman", count: 9, id: "pengiriman" },
  { icon: "sync_alt", label: "Tukar & Retur", count: 8, id: "pengembalian" },
  { icon: "credit_card", label: "Pembayaran", count: 11, id: "pembayaran" },
  { icon: "straighten", label: "Ukuran & Produk", count: 7, id: "ukuran" },
  { icon: "person", label: "Akun & Member", count: 6, id: "akun" },
];

const HOT_QUERIES = [
  "Status pesanan",
  "Tukar ukuran",
  "Bayar COD",
  "Voucher tidak bisa dipakai",
];

const CONTACTS = [
  {
    icon: "chat",
    title: "WhatsApp",
    desc: "Balasan rata-rata 5 menit · 08.00–22.00 WIB",
    href: "https://wa.me/6281234567890",
  },
  {
    icon: "mail",
    title: "Email",
    desc: "halo@aone.id · Dibalas dalam 1×24 jam",
    href: "mailto:halo@aone.id",
  },
  {
    icon: "storefront",
    title: "Toko offline",
    desc: "Temukan toko Aone terdekat",
    href: "#",
  },
];

const TOPIC_FAQ_CONTENT: Record<
  string,
  { title: string; intro: { q: string; a: string } | null; faqs: string[] }
> = {
  pengembalian: {
    title: "Tukar & Retur",
    intro: {
      q: "Bagaimana cara tukar ukuran?",
      a: "Tukar ukuran gratis dalam 14 hari sejak paket diterima, selama label masih terpasang dan produk belum dicuci.",
    },
    faqs: [
      "Berapa lama dana retur kembali?",
      "Produk apa saja yang tidak bisa ditukar?",
      "Bisakah tukar ke warna atau produk lain?",
      "Paket yang saya terima rusak atau salah kirim",
      "Bisakah retur pesanan COD?",
      "Tukar di toko offline Aone",
    ],
  },
  pengiriman: {
    title: "Pengiriman",
    intro: null,
    faqs: [
      "Berapa lama estimasi pengiriman?",
      "Apakah tersedia pengiriman instan?",
      "Bagaimana cara melacak pesanan?",
      "Paket belum tiba setelah estimasi lewat",
      "Bisakah mengubah alamat setelah order?",
      "Pengiriman ke luar Jawa",
    ],
  },
  pesanan: {
    title: "Pesanan",
    intro: null,
    faqs: [
      "Bagaimana cara membatalkan pesanan?",
      "Kapan pesanan diproses?",
      "Bisakah mengubah produk setelah bayar?",
      "Pesanan tidak muncul di akun saya",
      "Bagaimana cara cek status pesanan tanpa akun?",
      "Kenapa pesanan saya dibatalkan otomatis?",
    ],
  },
  ukuran: {
    title: "Ukuran & Produk",
    intro: null,
    faqs: [
      "Bagaimana cara memilih ukuran yang tepat?",
      "Apa perbedaan Slim Fit, Regular, dan Oversize?",
      "Apakah ukuran konsisten antar produk?",
      "Cara membaca tabel ukuran anak",
      "Material apa yang digunakan Aone?",
      "Cara merawat produk Aone",
    ],
  },
  pembayaran: {
    title: "Pembayaran",
    intro: null,
    faqs: [
      "Metode pembayaran apa saja yang tersedia?",
      "Bagaimana cara bayar dengan COD?",
      "Kenapa pembayaran saya gagal?",
      "Cara menggunakan kode voucher",
      "Bisakah cicilan 0%?",
      "Kapan tagihan kartu kredit muncul?",
    ],
  },
  akun: {
    title: "Akun & Member",
    intro: null,
    faqs: [
      "Bagaimana cara membuat akun?",
      "Lupa kata sandi",
      "Cara mengubah email atau nomor HP",
      "Kenapa wishlist saya kosong?",
      "Cara melihat riwayat pembelian",
      "Cara menghapus akun",
    ],
  },
};

type TopicId = keyof typeof TOPIC_FAQ_CONTENT;

export function HelpView({ topic }: { topic: string }) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");

  const topicData = TOPIC_FAQ_CONTENT[topic as TopicId];
  const faqTitle = topicData?.title ?? "Tukar & Retur";
  const faqs = topicData?.faqs ?? [];
  const intro = topicData?.intro ?? null;

  return (
    <>
      {/* Hero search section */}
      <section className="bg-subtle">
        <div className="mx-auto max-w-[1440px] px-4 py-16 lg:px-10">
          <nav className="text-small text-muted mb-6 flex gap-2">
            <Link href="/" className="hover:text-ink">
              Beranda
            </Link>
            <span>/</span>
            <span className="text-ink">Pusat Bantuan</span>
          </nav>
          <h1 className="text-display text-ink font-bold">
            Ada yang bisa kami bantu?
          </h1>
          <div className="border-ink mt-6 flex h-14 max-w-[720px] items-center gap-3 border bg-white px-4">
            <Icon name="search" size={24} className="text-ink shrink-0" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Cari topik, misalnya "tukar ukuran"'
              className="text-body text-ink placeholder:text-muted flex-1 bg-transparent outline-none"
            />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-small text-muted">Sering dicari:</span>
            {HOT_QUERIES.map((q) => (
              <button
                key={q}
                type="button"
                className="border-border text-small hover:border-ink flex h-8 items-center border bg-white px-3"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-4 lg:px-10">
        {/* Topic cards */}
        <section className="py-16">
          <h2 className="text-h2 text-ink mb-6 font-bold">Pilih topik</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {TOPICS.map((t) => (
              <Link
                key={t.id}
                href={`/help/${t.id}`}
                className={`text-ink hover:border-ink flex min-h-[160px] flex-col gap-3 border p-5 transition-colors ${
                  t.id === topic ? "border-ink" : "border-border"
                }`}
              >
                <Icon name={t.icon} size={32} className="text-ink" />
                <span className="text-body text-ink mt-auto font-bold">
                  {t.label}
                </span>
                <span className="text-small text-muted">{t.count} artikel</span>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ + Sidebar */}
        <section
          id="faq"
          className="grid grid-cols-1 gap-16 pb-24 lg:grid-cols-[1fr_400px]"
        >
          {/* Left: FAQ */}
          <div className="flex flex-col gap-6">
            <div className="flex items-baseline gap-3">
              <h2 className="text-h2 text-ink font-bold">{faqTitle}</h2>
              <span className="text-body text-muted">Pertanyaan umum</span>
            </div>

            <div className="flex flex-col">
              {/* Intro item (open by default) */}
              {intro && (
                <div className="border-border flex flex-col gap-3 border-t py-6">
                  <div className="flex items-center justify-between gap-6">
                    <span className="text-h3 text-ink font-bold">
                      {intro.q}
                    </span>
                    <Icon
                      name="remove"
                      size={22}
                      className="text-ink shrink-0"
                    />
                  </div>
                  <p className="text-body text-ink max-w-[720px]">{intro.a}</p>
                  <div className="text-body flex flex-col gap-2">
                    <span>
                      1. Buka{" "}
                      <Link
                        href="/account"
                        className="underline underline-offset-2"
                      >
                        Pesanan saya
                      </Link>
                      , pilih pesanan, lalu tekan Ajukan tukar.
                    </span>
                    <span>2. Pilih produk dan ukuran pengganti.</span>
                    <span>
                      3. Kurir kami menjemput paket dari alamatmu tanpa biaya.
                    </span>
                    <span>
                      4. Ukuran baru dikirim setelah paket kami terima, biasanya
                      2–4 hari kerja.
                    </span>
                  </div>
                </div>
              )}

              {/* Other FAQs (collapsed) */}
              {faqs.map((q) => {
                const id = q.toLowerCase().replace(/\s+/g, "-");
                const isOpen = openItems.has(id);
                return (
                  <button
                    key={q}
                    type="button"
                    onClick={() => {
                      setOpenItems((prev) => {
                        const next = new Set(prev);
                        if (next.has(id)) next.delete(id);
                        else next.add(id);
                        return next;
                      });
                    }}
                    className="border-border flex items-center justify-between gap-6 border-t py-6 text-left"
                  >
                    <span className="text-h3 text-ink font-bold">{q}</span>
                    <Icon
                      name={isOpen ? "remove" : "add"}
                      size={22}
                      className="text-ink shrink-0"
                    />
                  </button>
                );
              })}
              <div className="border-border border-t" />
            </div>

            {/* Helpful? */}
            <div className="text-body flex items-center gap-4">
              <span>Artikel ini membantu?</span>
              <button
                type="button"
                className="border-border hover:border-ink flex h-9 items-center gap-1.5 border px-4"
              >
                <Icon name="thumb_up" size={18} />
                Ya
              </button>
              <button
                type="button"
                className="border-border hover:border-ink flex h-9 items-center gap-1.5 border px-4"
              >
                <Icon name="thumb_down" size={18} />
                Tidak
              </button>
            </div>
          </div>

          {/* Right: Sidebar */}
          <aside className="flex flex-col gap-4 lg:sticky lg:top-[125px] lg:self-start">
            {/* Order tracker widget */}
            <div className="border-ink flex flex-col gap-4 border p-6">
              <p className="text-h3 text-ink font-bold">Lacak pesanan</p>
              <div className="flex flex-col gap-1.5">
                <label className="text-small text-ink font-medium">
                  Nomor pesanan
                </label>
                <div className="border-border flex h-12 items-center border px-3.5">
                  <input
                    type="text"
                    placeholder="Contoh: AON-260928-4812"
                    className="text-body text-ink placeholder:text-muted flex-1 bg-transparent outline-none"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-small text-ink font-medium">
                  Email atau nomor HP
                </label>
                <div className="border-border flex h-12 items-center border px-3.5">
                  <input
                    type="text"
                    placeholder="Yang dipakai saat checkout"
                    className="text-body text-ink placeholder:text-muted flex-1 bg-transparent outline-none"
                  />
                </div>
              </div>
              <button
                type="button"
                className="bg-ink text-small flex h-12 items-center justify-center font-bold tracking-wide text-white uppercase"
              >
                LACAK
              </button>
            </div>

            {/* Contact */}
            <div className="bg-subtle flex flex-col gap-4 p-6">
              <p className="text-h3 text-ink font-bold">Masih butuh bantuan?</p>
              {CONTACTS.map((c) => (
                <a
                  key={c.title}
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="text-ink hover:bg-subtle flex items-start gap-3.5 bg-white p-4"
                >
                  <Icon name={c.icon} size={24} className="shrink-0" />
                  <div className="flex-1">
                    <p className="text-body text-ink font-bold">{c.title}</p>
                    <p className="text-small text-muted">{c.desc}</p>
                  </div>
                  <Icon
                    name="chevron_right"
                    size={20}
                    className="text-muted shrink-0"
                  />
                </a>
              ))}
            </div>
          </aside>
        </section>
      </div>
    </>
  );
}
