import Link from "next/link";
import { AnnouncementBar, Footer, Header } from "@/features/layout";
import { WishlistProductCard } from "@/features/wishlist";
import { repositories } from "@/services";

const CATEGORY_LINKS = [
  { label: "Wanita", href: "/c/wanita" },
  { label: "Pria", href: "/c/pria" },
  { label: "Anak", href: "/c/anak" },
  { label: "Kemeja & Blus", href: "/c/wanita/kemeja-blus" },
  { label: "Celana", href: "/c/wanita/celana" },
  { label: "Outer & Jaket", href: "/c/wanita/outer-jaket" },
  { label: "Sale", href: "/c/wanita?promo=true" },
];

export default async function NotFound() {
  let bestsellers: Awaited<
    ReturnType<typeof repositories.product.list>
  >["items"] = [];
  try {
    const result = await repositories.product.list({
      sort: "terlaris",
      pageSize: 4,
    });
    bestsellers = result.items;
  } catch {}

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="pb-24">
        {/* Hero section: 2-column */}
        <div className="mx-auto max-w-[1440px] px-4 pt-16 lg:px-10 lg:pt-24">
          <div className="grid grid-cols-1 items-end gap-16 lg:grid-cols-2">
            {/* Left: Copy */}
            <div className="flex flex-col gap-5">
              <span className="text-muted text-[12px] font-medium tracking-[0.08em] uppercase">
                ERROR 404
              </span>
              <h1 className="text-ink text-[32px] leading-[38px] font-bold text-balance lg:text-[56px] lg:leading-[62px]">
                Halaman ini tidak ditemukan
              </h1>
              <p className="text-ink max-w-[480px] text-[16px] leading-6">
                Tautannya mungkin sudah kedaluwarsa atau produknya sudah tidak
                dijual. Coba cari lagi, atau mulai dari salah satu kategori di
                bawah.
              </p>
              <div className="mt-2 flex flex-wrap gap-3">
                <Link
                  href="/"
                  className="bg-ink hover:bg-ink-hover flex h-12 items-center px-8 text-[14px] font-bold tracking-[0.04em] text-white uppercase"
                >
                  KE BERANDA
                </Link>
                <Link
                  href="/help/faq"
                  className="border-ink text-ink hover:bg-subtle flex h-12 items-center border bg-white px-8 text-[14px] font-bold tracking-[0.04em] uppercase"
                >
                  PUSAT BANTUAN
                </Link>
              </div>
            </div>

            {/* Right: Search + categories */}
            <div className="flex flex-col gap-5">
              <Link
                href="/search"
                className="border-ink text-muted flex h-14 items-center gap-3 border bg-white px-4 text-[16px]"
              >
                <span
                  className="material-symbols-outlined text-ink text-[24px]"
                  aria-hidden
                >
                  search
                </span>
                Cari produk
              </Link>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_LINKS.map(({ label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    className="border-border text-ink hover:border-ink flex h-9 items-center border bg-white px-3.5 text-[13px]"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Best sellers */}
        {bestsellers.length > 0 && (
          <div className="mx-auto max-w-[1440px] px-4 pt-24 lg:px-10">
            <div className="mb-8 flex items-center gap-4">
              <h2 className="text-ink flex-1 text-[28px] leading-9 font-bold">
                Terlaris minggu ini
              </h2>
              <Link
                href="/c/wanita"
                className="text-ink hover:text-muted text-[14px] font-medium underline underline-offset-4"
              >
                Lihat semua
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
              {bestsellers.map((product) => (
                <WishlistProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
