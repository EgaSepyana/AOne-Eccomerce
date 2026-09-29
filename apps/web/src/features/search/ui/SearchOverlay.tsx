"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useHomeContent } from "@/entities/content";
import { ProductCard } from "@/entities/product";
import { useRecentStore } from "@/features/recently-viewed";
import { useWishlistStore } from "@/features/wishlist";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
import { useMounted } from "@/shared/hooks/useMounted";
import { useUIStore } from "@/shared/model/useUIStore";
import { POPULAR_SEARCHES } from "@/shared/config/search";
import { Icon } from "@/shared/ui";
import { useSearchSuggest } from "../api/useSearchSuggest";

export function SearchOverlay() {
  const open = useUIStore((s) => s.searchOpen);
  const mounted = useMounted();

  if (!mounted || !open) return null;

  return <SearchOverlayContent />;
}

function SearchOverlayContent() {
  const router = useRouter();
  const setOpen = useUIStore((s) => s.setSearchOpen);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 200);
  const inputRef = useRef<HTMLInputElement>(null);

  const recentSearches = useRecentStore((s) => s.recentSearches);
  const addRecentSearch = useRecentStore((s) => s.addRecentSearch);
  const removeRecentSearch = useRecentStore((s) => s.removeRecentSearch);
  const clearRecentSearches = useRecentStore((s) => s.clearRecentSearches);
  const wishlistIds = useWishlistStore((s) => s.ids);
  const toggleWishlist = useWishlistStore((s) => s.toggle);

  const { data: homeContent } = useHomeContent("wanita");
  const { data: suggestData, isFetching } = useSearchSuggest(debouncedQuery);

  const isTyping = debouncedQuery.trim().length >= 2;
  const isNoResult =
    isTyping && !isFetching && (suggestData?.products.length ?? 0) === 0;

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setOpen]);

  function goToResults(q: string) {
    const trimmed = q.trim();
    if (!trimmed) return;
    addRecentSearch(trimmed);
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  const rightTitle = isTyping
    ? isNoResult
      ? "Produk populer"
      : "Produk"
    : "Sedang tren";

  const rightProducts = isTyping
    ? isNoResult
      ? (homeContent?.bestSellers.slice(0, 4) ?? [])
      : (suggestData?.products ?? [])
    : (homeContent?.newArrivals.slice(0, 4) ?? []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      <div className="border-border relative z-10 border-b bg-white">
        <div className="mx-auto flex h-20 max-w-[1440px] items-center gap-10 px-4 lg:px-10">
          <span className="text-h3 hidden font-bold tracking-[0.14em] sm:inline">
            AONE
          </span>
          <div className="border-ink flex h-12 flex-1 items-center gap-3 border-b-[1.5px]">
            <Icon name="search" size={24} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") goToResults(query);
              }}
              placeholder="Cari kaos, kemeja, celana…"
              className="text-h3 text-ink placeholder:text-muted flex-1 font-normal focus:outline-none"
            />
            {query && (
              <button
                type="button"
                aria-label="Hapus"
                onClick={() => setQuery("")}
                className="bg-subtle flex size-8 items-center justify-center rounded-full"
              >
                <Icon name="close" size={18} />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-body shrink-0 font-medium underline underline-offset-4"
          >
            Batal
          </button>
        </div>
      </div>

      <div className="shadow-overlay relative z-10 overflow-y-auto bg-white">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-4 py-10 lg:grid-cols-[320px_minmax(0,1fr)] lg:px-10 lg:py-14">
          <div className="flex flex-col gap-8">
            {!isTyping && recentSearches.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-h3 font-bold">Pencarian terakhir</span>
                  <button
                    type="button"
                    onClick={clearRecentSearches}
                    className="text-small underline underline-offset-4"
                  >
                    Hapus
                  </button>
                </div>
                {recentSearches.map((r) => (
                  <div
                    key={r}
                    className="text-body flex h-9 cursor-pointer items-center gap-2.5"
                    onClick={() => goToResults(r)}
                  >
                    <Icon name="history" size={20} className="!text-muted" />
                    <span className="flex-1">{r}</span>
                    <button
                      type="button"
                      aria-label="Hapus pencarian"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeRecentSearch(r);
                      }}
                    >
                      <Icon name="close" size={18} className="!text-muted" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {isTyping && !isNoResult && (
              <div className="flex flex-col gap-1">
                <span className="text-h3 pb-2 font-bold">Saran</span>
                {(suggestData?.keywords ?? []).map((keyword) => (
                  <button
                    key={keyword}
                    type="button"
                    onClick={() => goToResults(keyword)}
                    className="text-body flex h-10 items-center gap-2.5 text-left"
                  >
                    <Icon name="search" size={20} className="!text-muted" />
                    <span className="flex-1">{keyword}</span>
                  </button>
                ))}
              </div>
            )}

            {isNoResult && (
              <div className="flex flex-col gap-3">
                <span className="text-h3 font-bold text-balance">
                  Tidak ada hasil untuk &ldquo;{debouncedQuery}&rdquo;
                </span>
                <div className="text-small text-muted flex flex-col gap-1.5 pt-2">
                  <span>· Periksa ejaan kata kunci</span>
                  <span>· Gunakan kata yang lebih umum</span>
                  <span>
                    · Cari berdasarkan kategori di menu Wanita, Pria, Anak
                  </span>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <span className="text-h3 font-bold">Pencarian populer</span>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => goToResults(p)}
                    className="border-border text-small flex h-9 items-center border px-3.5"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <span className="text-h3 font-bold">{rightTitle}</span>
              {isTyping && !isNoResult && (
                <button
                  type="button"
                  onClick={() => goToResults(debouncedQuery)}
                  className="text-body font-medium underline underline-offset-4"
                >
                  Lihat semua hasil
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {rightProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={wishlistIds.includes(product.id)}
                  onToggleWishlist={toggleWishlist}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-label="Tutup pencarian"
        onClick={() => setOpen(false)}
        className="bg-ink/60 flex-1"
      />
    </div>
  );
}
