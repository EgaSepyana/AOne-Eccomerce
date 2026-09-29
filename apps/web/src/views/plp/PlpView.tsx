"use client";

import Link from "next/link";
import { Fragment, useMemo, useState } from "react";
import { useCategories } from "@/entities/category";
import { EditorialTile, useHomeContent } from "@/entities/content";
import { useProductList, type Gender } from "@/entities/product";
import {
  ActiveFilters,
  FilterSheet,
  FilterSidebar,
  LoadMore,
  SortDropdown,
  useCatalogFilters,
  useProductGridAnimation,
} from "@/features/catalog-filter";
import { WishlistProductCard } from "@/features/wishlist";
import { useDisclosure } from "@/shared/hooks/useDisclosure";
import { Breadcrumb, Button, EmptyState, Icon, Skeleton } from "@/shared/ui";
import { cn } from "@/shared/lib/cn";

const GENDER_LABEL: Record<Gender, string> = {
  wanita: "Wanita",
  pria: "Pria",
  anak: "Anak",
};

export interface PlpViewProps {
  gender?: Gender;
  category?: string;
  q?: string;
}

export function PlpView({ gender, category, q }: PlpViewProps) {
  const { filters, clearAll } = useCatalogFilters();
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const filterSheet = useDisclosure();

  const { data: categories } = useCategories(gender ?? "wanita");
  const { data: homeContent } = useHomeContent(gender ?? "wanita");
  const activeCategory = gender
    ? categories?.find((c) => c.slug === category)
    : undefined;

  const query = useMemo(
    () => ({
      gender,
      category,
      q,
      size: filters.size ?? undefined,
      color: filters.color ?? undefined,
      priceMin: filters.priceMin ?? undefined,
      priceMax: filters.priceMax ?? undefined,
      fit: filters.fit ?? undefined,
      material: filters.material ?? undefined,
      promo: filters.promo ? true : undefined,
      rating: filters.rating ?? undefined,
      sort: filters.sort,
    }),
    [gender, category, q, filters],
  );

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useProductList(query);

  const items = data?.pages.flatMap((p) => p.items) ?? [];
  const total = data?.pages[0]?.total ?? 0;
  const facets = data?.pages[0]?.facets;
  const lookbook = gender ? homeContent?.lookbooks[0] : undefined;
  const gridRef = useProductGridAnimation(items.map((p) => p.id));

  const categoryLinkFor = gender
    ? (slug: string) => `/c/${gender}/${slug}`
    : undefined;

  const title = q
    ? `Hasil untuk "${q}"`
    : (activeCategory?.name ??
      (gender ? `Pakaian ${GENDER_LABEL[gender]}` : ""));

  const emptyTitle = q
    ? `Tidak ada hasil untuk "${q}"`
    : "Tidak ada produk yang cocok";
  const emptyDescription = q
    ? "Coba kata kunci lain atau hapus beberapa filter."
    : "Coba ubah atau hapus beberapa filter.";

  return (
    <div className="pb-24">
      <div className="mx-auto max-w-[1440px] px-4 pt-6 lg:px-10">
        {gender && (
          <Breadcrumb
            items={[
              { label: "Beranda", href: "/" },
              { label: GENDER_LABEL[gender], href: `/c/${gender}` },
              { label: title },
            ]}
          />
        )}
        <div className="flex items-baseline gap-3 pt-4">
          <h1 className="text-h1 text-ink font-bold text-balance">{title}</h1>
          <span className="text-body text-muted shrink-0">{total} produk</span>
        </div>

        {gender && categories && categories.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pt-6">
            <Link
              href={`/c/${gender}`}
              className={cn(
                "text-body flex h-9 shrink-0 items-center border px-4",
                !category
                  ? "border-ink bg-ink font-bold text-white"
                  : "border-border text-ink",
              )}
            >
              Semua
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={categoryLinkFor!(c.slug)}
                className={cn(
                  "text-body flex h-9 shrink-0 items-center border px-4",
                  c.slug === category
                    ? "border-ink bg-ink font-bold text-white"
                    : "border-border text-ink",
                )}
              >
                {c.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="border-border sticky top-14 z-30 mt-6 border-b bg-white lg:top-16">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-4 px-4 lg:px-10">
          <button
            type="button"
            onClick={() => setSidebarVisible((v) => !v)}
            className="text-body hidden w-60 shrink-0 items-center gap-2 font-medium lg:flex"
          >
            <Icon name="tune" size={20} />
            {sidebarVisible ? "Sembunyikan Filter" : "Tampilkan Filter"}
          </button>
          <button
            type="button"
            onClick={filterSheet.open}
            className="border-border text-body flex h-10 shrink-0 items-center gap-2 border px-3 lg:hidden"
          >
            <Icon name="tune" size={20} />
            Filter
          </button>
          <div className="flex-1 overflow-x-auto">
            {facets && <ActiveFilters facets={facets} />}
          </div>
          <SortDropdown />
        </div>
      </div>

      <div
        className={cn(
          "mx-auto max-w-[1440px] items-start gap-10 px-4 pt-8 lg:px-10",
          sidebarVisible ? "lg:grid lg:grid-cols-[240px_minmax(0,1fr)]" : "",
        )}
      >
        {sidebarVisible && (
          <div className="sticky top-[164px] hidden lg:block">
            {facets ? (
              <FilterSidebar
                facets={facets}
                categoryLinkFor={categoryLinkFor}
              />
            ) : (
              <Skeleton className="h-96 w-60" />
            )}
          </div>
        )}

        <main className="flex flex-col">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4] w-full" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <EmptyState
              icon="search_off"
              title={emptyTitle}
              description={emptyDescription}
              action={
                <Button variant="secondary" onClick={clearAll}>
                  HAPUS FILTER
                </Button>
              }
            />
          ) : (
            <div
              ref={gridRef}
              className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4"
            >
              {items.map((product, index) => (
                <Fragment key={product.id}>
                  <WishlistProductCard product={product} />
                  {index === 3 && lookbook && (
                    <EditorialTile lookbook={lookbook} />
                  )}
                  {index > 3 && (index - 3) % 12 === 0 && lookbook && (
                    <EditorialTile lookbook={lookbook} />
                  )}
                </Fragment>
              ))}
            </div>
          )}

          {!isLoading && items.length > 0 && (
            <LoadMore
              shown={items.length}
              total={total}
              loading={isFetchingNextPage}
              onLoadMore={() => hasNextPage && fetchNextPage()}
            />
          )}
        </main>
      </div>

      {facets && (
        <FilterSheet
          open={filterSheet.isOpen}
          onClose={filterSheet.close}
          facets={facets}
          resultCount={total}
          categoryLinkFor={categoryLinkFor}
        />
      )}
    </div>
  );
}
