"use client";

import {
  CategoryTiles,
  CollabBanner,
  HeroCarousel,
  LookbookBanner,
  StyleTiles,
  TrustStrip,
  UGCGrid,
  useHomeContent,
} from "@/entities/content";
import type { Gender } from "@/entities/product";
import {
  WishlistProductCarousel,
  WishlistProductGrid,
} from "@/features/wishlist";
import { Skeleton } from "@/shared/ui";

export function HomeView({ gender }: { gender: Gender }) {
  const { data, isLoading } = useHomeContent(gender);

  if (isLoading || !data) {
    return (
      <div className="flex flex-col gap-24 py-6">
        <Skeleton className="aspect-[21/9] min-h-[360px] w-full sm:min-h-[560px]" />
        <Skeleton className="mx-4 h-40 lg:mx-10" />
        <Skeleton className="mx-4 h-80 lg:mx-10" />
      </div>
    );
  }

  const productSlugById = Object.fromEntries(
    [...data.newArrivals, ...data.bestSellers].map((p) => [p.id, p.slug]),
  );
  const lookbook = data.lookbooks[0];
  const collabBanner = data.banners[1] ?? data.banners[0];

  return (
    <div className="flex flex-col gap-24 pb-24">
      {/* 1. Hero Campaign */}
      <HeroCarousel slides={data.heroes} />

      {/* 2. Category Tiles & New Arrivals */}
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-24">
        <CategoryTiles categories={data.categories} gender={gender} />
        <WishlistProductCarousel
          title="Produk Terbaru"
          products={data.newArrivals}
          seeAllHref={`/c/${gender}`}
        />
      </div>

      {/* 3. Lookbook Editorial */}
      {lookbook && <LookbookBanner lookbook={lookbook} />}

      {/* 4. Best Sellers, Styles, Collab, UGC, Trust */}
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-24">
        <WishlistProductGrid
          title="Terlaris"
          products={data.bestSellers}
          seeAllHref={`/c/${gender}`}
        />
        <StyleTiles tiles={data.styles} />
        {collabBanner && (
          <div className="px-4 lg:px-10">
            <CollabBanner banner={collabBanner} />
          </div>
        )}
        <UGCGrid posts={data.ugc} productSlugById={productSlugById} />
        <TrustStrip />
      </div>
    </div>
  );
}
