"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  useWishlistProducts,
  WishlistCard,
  WishlistProductCard,
} from "@/features/wishlist";
import { useUserStore } from "@/entities/user";
import { useHomeContent } from "@/entities/content";
import { useUIStore } from "@/shared/model/useUIStore";
import { Icon, Skeleton } from "@/shared/ui";

function LoginBanner() {
  const user = useUserStore((s) => s.user);
  if (user) return null;
  return (
    <div className="bg-subtle flex items-center gap-3 px-4 py-4 lg:px-5">
      <Icon name="info" size={22} className="text-ink shrink-0" />
      <span className="text-ink flex-1 text-[14px] leading-5">
        Wishlist hanya tersimpan di perangkat ini. Masuk untuk menyimpannya di
        semua perangkat dan dapat kabar saat harga turun.
      </span>
      <Link
        href="/login"
        className="border-ink text-ink hover:bg-subtle flex h-10 shrink-0 items-center border bg-white px-5 text-[13px] font-bold tracking-[0.04em] uppercase"
      >
        MASUK
      </Link>
    </div>
  );
}

export function WishlistView() {
  const { products, isLoading } = useWishlistProducts();
  const showToast = useUIStore((s) => s.showToast);
  const [sortOption, setSortOption] = useState<
    "terbaru" | "termurah" | "termahal"
  >("terbaru");
  const [sortOpen, setSortOpen] = useState(false);

  const sortedProducts = useMemo(() => {
    const list = [...products];
    if (sortOption === "termurah") {
      return list.sort((a, b) => a.price - b.price);
    }
    if (sortOption === "termahal") {
      return list.sort((a, b) => b.price - a.price);
    }
    return list;
  }, [products, sortOption]);

  function handleShare() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast("Tautan wishlist disalin ke clipboard");
    } else {
      showToast("Tautan wishlist disalin");
    }
  }

  const sortLabels = {
    terbaru: "Terakhir disimpan",
    termurah: "Harga terendah",
    termahal: "Harga tertinggi",
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 pt-10 pb-24 lg:px-10">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-1 items-baseline gap-3">
            <h1 className="text-ink text-[28px] leading-9 font-bold lg:text-[36px] lg:leading-[44px]">
              Wishlist
            </h1>
            <span className="text-muted text-[14px]">
              {isLoading ? "" : `${products.length} produk`}
            </span>
          </div>

          {!isLoading && products.length > 0 && (
            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSortOpen((o) => !o)}
                  className="border-border text-ink hover:border-ink flex h-10 items-center gap-2 border bg-white px-3 text-[14px]"
                >
                  <span className="text-muted">Urutkan:</span>
                  <span className="font-medium">{sortLabels[sortOption]}</span>
                  <Icon
                    name="expand_more"
                    size={20}
                    className={`transition-transform ${sortOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {sortOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setSortOpen(false)}
                    />
                    <div className="border-border shadow-overlay absolute top-full right-0 z-30 mt-1 min-w-[180px] border bg-white">
                      {(["terbaru", "termurah", "termahal"] as const).map(
                        (opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => {
                              setSortOption(opt);
                              setSortOpen(false);
                            }}
                            className={`flex h-10 w-full items-center px-4 text-left text-[14px] transition-colors ${
                              sortOption === opt
                                ? "bg-subtle text-ink font-bold"
                                : "text-ink hover:bg-subtle"
                            }`}
                          >
                            {sortLabels[opt]}
                          </button>
                        ),
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Share button */}
              <button
                type="button"
                onClick={handleShare}
                className="border-border text-ink hover:border-ink flex h-10 items-center gap-2 border bg-white px-3.5 text-[14px]"
              >
                <Icon name="ios_share" size={18} className="text-ink" />
                <span>Bagikan</span>
              </button>
            </div>
          )}
        </div>

        {/* Login Banner */}
        <LoginBanner />

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <Skeleton className="aspect-[3/4] w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-11 w-full" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <Icon
              name="favorite"
              size={64}
              className="text-border !text-[64px] [font-variation-settings:'wght'_200]"
            />
            <h2 className="text-ink mt-2 text-[28px] leading-9 font-bold">
              Wishlist-mu masih kosong
            </h2>
            <p className="text-muted mx-auto max-w-[460px] text-[16px] leading-6">
              Tekan ikon hati di produk mana pun untuk menyimpannya di sini.
            </p>
            <Link
              href="/c/wanita"
              className="bg-ink hover:bg-ink-hover mt-4 flex h-12 items-center px-10 text-[14px] font-bold tracking-[0.04em] text-white uppercase"
            >
              MULAI BELANJA
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
            {sortedProducts.map((product) => (
              <WishlistCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Recommendation Section */}
      <div className="pt-24">
        <WishlistRecommendations empty={products.length === 0} />
      </div>
    </div>
  );
}

function WishlistRecommendations({ empty }: { empty: boolean }) {
  const { data: homeContent } = useHomeContent("wanita");
  if (!homeContent) return null;

  const title = empty ? "Terlaris minggu ini" : "Mungkin kamu juga suka";
  const prods = empty
    ? homeContent.bestSellers.slice(0, 4)
    : homeContent.newArrivals.slice(0, 4);

  return (
    <section className="flex flex-col gap-8">
      <h2 className="text-ink text-[28px] leading-9 font-bold">{title}</h2>
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {prods.map((product) => (
          <WishlistProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
