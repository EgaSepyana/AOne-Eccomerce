"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon, SwatchGroup } from "@/shared/ui";
import { cn } from "@/shared/lib/cn";
import { formatRupiah } from "@/shared/lib/format";
import type { Product } from "../model/types";
import { getActiveVariant } from "../lib/product";

export interface ProductCardProps {
  product: Product;
  onToggleWishlist?: (productId: string) => void;
  isWishlisted?: boolean;
  onQuickView?: (productId: string) => void;
  className?: string;
}

export function ProductCard({
  product,
  onToggleWishlist,
  isWishlisted = false,
  onQuickView,
  className,
}: ProductCardProps) {
  const router = useRouter();
  const [activeColorId, setActiveColorId] = useState<string | undefined>(
    product.variants[0]?.color.id,
  );

  function handleWishlistClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    onToggleWishlist?.(product.id);
  }

  const variant = getActiveVariant(product, activeColorId);
  const primaryImage = variant.images[0];
  const secondaryImage = variant.images[1];
  const genderLabel = { wanita: "Wanita", pria: "Pria", anak: "Anak" }[
    product.gender
  ];
  const sizeRange =
    variant.sizes.length > 0
      ? `${variant.sizes[0]!.label}–${variant.sizes[variant.sizes.length - 1]!.label}`
      : "";

  return (
    <div className={cn("group text-ink flex min-w-0 flex-col", className)}>
      <Link
        href={`/p/${product.slug}${activeColorId ? `?color=${activeColorId}` : ""}`}
        className="bg-subtle relative block aspect-[3/4] w-full overflow-hidden p-4"
      >
        {product.badge && (
          <span
            className={cn(
              "absolute top-2 left-2 z-10 text-[11px] leading-[14px] font-bold tracking-[0.04em]",
              product.badge.type === "new" && "text-ink bg-white px-1.5 py-1",
              product.badge.type === "sale" && "bg-ink px-1.5 py-1 text-white",
              product.badge.type === "stock" &&
                "text-muted border-border border bg-white px-1.5 py-[3px]",
            )}
          >
            {product.badge.label}
          </span>
        )}
        {primaryImage && (
          <Image
            src={primaryImage.src}
            alt={primaryImage.alt}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className={cn(
              "duration-slow object-contain transition-opacity",
              secondaryImage && "group-hover:opacity-0",
            )}
          />
        )}
        {secondaryImage && (
          <Image
            src={secondaryImage.src}
            alt={secondaryImage.alt}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="duration-slow object-contain opacity-0 transition-opacity group-hover:opacity-100"
          />
        )}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onQuickView) {
              onQuickView(product.id);
            } else {
              router.push(
                `/p/${product.slug}${activeColorId ? `?color=${activeColorId}` : ""}`,
              );
            }
          }}
          className="text-ink shadow-overlay duration-base absolute inset-x-2 bottom-2 hidden h-10 items-center justify-center bg-white text-[12px] font-bold tracking-[0.04em] uppercase opacity-0 transition-opacity group-hover:opacity-100 lg:flex"
        >
          LIHAT CEPAT
        </button>
      </Link>

      <div className="flex flex-col gap-1 pt-3">
        {/* Swatches + Wishlist heart */}
        <div className="flex min-h-6 items-center gap-2">
          <SwatchGroup
            colors={product.variants.map((v) => ({
              id: v.color.id,
              name: v.color.name,
              hex: v.color.hex,
            }))}
            selectedId={activeColorId}
            onSelect={setActiveColorId}
          />
          <div className="flex-1" />
          <button
            type="button"
            aria-label={
              isWishlisted ? "Hapus dari wishlist" : "Tambah ke wishlist"
            }
            aria-pressed={isWishlisted}
            onClick={handleWishlistClick}
            className="text-ink flex size-6 items-center justify-center transition-transform active:scale-90"
          >
            <Icon
              name="favorite"
              size={20}
              className={cn(
                isWishlisted && "[font-variation-settings:'FILL'_1]",
              )}
            />
          </button>
        </div>

        {/* Meta: Gender · Size range */}
        <p className="text-muted text-[12px] leading-4">
          {genderLabel}
          {sizeRange && ` · ${sizeRange}`}
        </p>

        {/* Product Name */}
        <Link
          href={`/p/${product.slug}${activeColorId ? `?color=${activeColorId}` : ""}`}
        >
          <h3 className="text-ink hover:text-muted line-clamp-2 min-h-[40px] text-[14px] leading-5">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="tabular text-ink flex items-baseline gap-2 font-bold">
          <span className="text-[18px] leading-6">
            {formatRupiah(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-muted text-[13px] font-normal line-through">
              {formatRupiah(product.compareAtPrice)}
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="text-ink flex items-center gap-1 text-[12px] leading-4">
          <span>★ {product.rating.toFixed(1)}</span>
          <span className="text-muted">({product.reviewCount})</span>
        </div>
      </div>
    </div>
  );
}
