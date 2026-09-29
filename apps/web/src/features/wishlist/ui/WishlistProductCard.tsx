"use client";

import { useRouter } from "next/navigation";
import { ProductCard, type ProductCardProps } from "@/entities/product";
import { useUIStore } from "@/shared/model/useUIStore";
import { useWishlistStore } from "../model/useWishlistStore";

export function WishlistProductCard({
  product,
  isWishlisted: propIsWishlisted,
  onToggleWishlist,
  ...rest
}: ProductCardProps) {
  const router = useRouter();
  const storeHas = useWishlistStore((s) => s.has(product.id));
  const toggle = useWishlistStore((s) => s.toggle);
  const showToast = useUIStore((s) => s.showToast);

  const isWishlisted =
    propIsWishlisted !== undefined ? propIsWishlisted : storeHas;

  const handleToggle = (productId: string) => {
    if (onToggleWishlist) {
      onToggleWishlist(productId);
    } else {
      toggle(productId);
      if (!isWishlisted) {
        showToast("Ditambahkan ke wishlist", {
          label: "Lihat",
          onClick: () => {
            router.push("/wishlist");
          },
        });
      } else {
        showToast("Dihapus dari wishlist");
      }
    }
  };

  return (
    <ProductCard
      {...rest}
      product={product}
      isWishlisted={isWishlisted}
      onToggleWishlist={handleToggle}
    />
  );
}
