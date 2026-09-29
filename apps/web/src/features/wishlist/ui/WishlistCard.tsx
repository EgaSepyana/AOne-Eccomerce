"use client";

import { useState } from "react";
import {
  getActiveVariant,
  ProductCard,
  type Product,
} from "@/entities/product";
import { useCartStore } from "@/features/cart";
import { useUIStore } from "@/shared/model/useUIStore";
import { Icon } from "@/shared/ui";
import { useWishlistStore } from "../model/useWishlistStore";

export function WishlistCard({ product }: { product: Product }) {
  const variant = getActiveVariant(product);
  const firstInStock =
    variant.sizes.find((s) => s.stock > 0)?.label ??
    variant.sizes[0]?.label ??
    "M";
  const [selectedSize, setSelectedSize] = useState<string>(firstInStock);
  const [sizePickerOpen, setSizePickerOpen] = useState(false);

  const removeFromWishlist = useWishlistStore((s) => s.remove);
  const addToCart = useCartStore((s) => s.add);
  const setCartDrawerOpen = useUIStore((s) => s.setCartDrawerOpen);
  const showToast = useUIStore((s) => s.showToast);

  const isOut =
    variant.sizes.length > 0 && variant.sizes.every((s) => s.stock === 0);
  const hasPriceDrop = Boolean(
    product.compareAtPrice && product.compareAtPrice > product.price,
  );

  function handleAddToCart() {
    if (!selectedSize) {
      showToast("Pilih ukuran dulu");
      return;
    }
    addToCart({
      productId: product.id,
      colorId: variant.color.id,
      size: selectedSize,
      qty: 1,
    });
    setCartDrawerOpen(true);
    showToast("Ditambahkan ke keranjang", {
      label: "Lihat",
      onClick: () => setCartDrawerOpen(true),
    });
  }

  function handleNotify() {
    showToast("Kami akan beri tahu kamu saat produk restok");
  }

  function handleRemove() {
    removeFromWishlist(product.id);
    showToast("Dihapus dari wishlist");
  }

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <ProductCard
        product={product}
        isWishlisted={true}
        onToggleWishlist={handleRemove}
      />

      <div className="mt-auto flex flex-col gap-3">
        {hasPriceDrop && (
          <span className="text-ink flex items-center gap-1.5 text-[12px] font-medium">
            <Icon name="trending_down" size={16} />
            Harga turun sejak kamu simpan
          </span>
        )}

        {isOut ? (
          <div className="flex flex-col gap-2">
            <span className="text-ink flex items-center gap-1.5 text-[12px] font-medium">
              <Icon name="error" size={16} />
              Stok habis untuk semua ukuran
            </span>
            <button
              type="button"
              onClick={handleNotify}
              className="border-ink text-ink hover:bg-subtle flex h-11 items-center justify-center border text-[13px] font-bold tracking-[0.04em] uppercase"
            >
              BERI TAHU SAYA
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {/* Size Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setSizePickerOpen((o) => !o)}
                className="border-border text-ink hover:border-ink flex h-11 w-full items-center justify-between border bg-white px-3 text-[13px]"
              >
                <span>
                  Ukuran: <span className="font-bold">{selectedSize}</span>
                </span>
                <Icon
                  name="expand_more"
                  size={18}
                  className={`transition-transform ${sizePickerOpen ? "rotate-180" : ""}`}
                />
              </button>

              {sizePickerOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setSizePickerOpen(false)}
                  />
                  <div className="border-border shadow-overlay absolute right-0 bottom-full left-0 z-30 mb-1 max-h-48 overflow-y-auto border bg-white">
                    {variant.sizes.map((s) => {
                      const out = s.stock === 0;
                      return (
                        <button
                          key={s.label}
                          type="button"
                          disabled={out}
                          onClick={() => {
                            setSelectedSize(s.label);
                            setSizePickerOpen(false);
                          }}
                          className={`flex h-10 w-full items-center justify-between px-3 text-left text-[13px] transition-colors ${
                            s.label === selectedSize
                              ? "bg-subtle text-ink font-bold"
                              : "text-ink hover:bg-subtle"
                          } ${out ? "text-disabled cursor-not-allowed line-through" : ""}`}
                        >
                          <span>Ukuran {s.label}</span>
                          {out && (
                            <span className="text-disabled text-[11px]">
                              Habis
                            </span>
                          )}
                          {s.stock > 0 && s.stock <= 3 && (
                            <span className="text-muted text-[11px]">
                              Sisa {s.stock}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Add to Cart button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="bg-ink hover:bg-ink-hover flex h-11 w-full items-center justify-center text-[13px] font-bold tracking-[0.04em] text-white uppercase"
            >
              TAMBAH KE KERANJANG
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
