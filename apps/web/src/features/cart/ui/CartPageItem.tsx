"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useWishlistStore } from "@/features/wishlist";
import { useUIStore } from "@/shared/model/useUIStore";
import { formatRupiah } from "@/shared/lib/format";
import { Icon, QuantityStepper } from "@/shared/ui";
import type { CartLine } from "../api/useCartProducts";
import { useCartStore } from "../model/useCartStore";

export function CartPageItem({ item, product }: CartLine) {
  const updateQty = useCartStore((s) => s.updateQty);
  const updateVariant = useCartStore((s) => s.updateVariant);
  const remove = useCartStore((s) => s.remove);
  const addWishlist = useWishlistStore((s) => s.toggle);
  const showToast = useUIStore((s) => s.showToast);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [sizePickerOpen, setSizePickerOpen] = useState(false);

  const variant =
    product.variants.find((v) => v.color.id === item.colorId) ??
    product.variants[0]!;
  const image = variant.images[0];

  function handleRemove() {
    const snapshot = { ...item };
    remove(item.productId, item.colorId, item.size);
    showToast(`${product.name} dihapus dari keranjang`, {
      label: "Urungkan",
      onClick: () => useCartStore.getState().add(snapshot),
    });
  }

  function handleMoveToWishlist() {
    addWishlist(product.id);
    handleRemove();
  }

  return (
    <div className="border-border flex gap-6 border-t py-6">
      <Link
        href={`/p/${product.slug}`}
        className="bg-subtle relative aspect-[3/4] w-[132px] shrink-0"
      >
        {image && (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="132px"
            className="object-cover"
          />
        )}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex justify-between gap-6">
          <div className="flex flex-col gap-1">
            <Link
              href={`/p/${product.slug}`}
              className="text-body text-ink font-medium"
            >
              {product.name}
            </Link>
            <span className="text-caption text-muted">Kode {product.code}</span>
          </div>
          <div className="tabular flex shrink-0 flex-col items-end gap-0.5">
            <span className="text-price font-bold">
              {formatRupiah(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-small text-muted line-through">
                {formatRupiah(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setColorPickerOpen((o) => !o)}
              className="border-border text-small flex h-10 items-center gap-2 border px-3"
            >
              <span
                className="border-border size-4 rounded-full border"
                style={{ backgroundColor: variant.color.hex }}
              />
              {variant.color.name}
              <Icon name="expand_more" size={18} />
            </button>
            {colorPickerOpen && (
              <div className="border-border shadow-overlay absolute top-full left-0 z-10 mt-1 flex flex-col gap-1 border bg-white p-2">
                {product.variants.map((v) => (
                  <button
                    key={v.color.id}
                    type="button"
                    onClick={() => {
                      updateVariant(item.productId, item.colorId, item.size, {
                        colorId: v.color.id,
                      });
                      setColorPickerOpen(false);
                    }}
                    className="text-small hover:bg-subtle flex items-center gap-2 px-2 py-1.5 text-left"
                  >
                    <span
                      className="border-border size-4 rounded-full border"
                      style={{ backgroundColor: v.color.hex }}
                    />
                    {v.color.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setSizePickerOpen((o) => !o)}
              className="border-border text-small flex h-10 items-center gap-2 border px-3"
            >
              Ukuran: <span className="font-bold">{item.size}</span>
              <Icon name="expand_more" size={18} />
            </button>
            {sizePickerOpen && (
              <div className="border-border shadow-overlay absolute top-full left-0 z-10 mt-1 flex flex-col gap-1 border bg-white p-2">
                {variant.sizes.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    disabled={s.stock === 0}
                    onClick={() => {
                      updateVariant(item.productId, item.colorId, item.size, {
                        size: s.label,
                      });
                      setSizePickerOpen(false);
                    }}
                    className="text-small hover:bg-subtle disabled:text-disabled px-2 py-1.5 text-left"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <QuantityStepper
            value={item.qty}
            onChange={(qty) =>
              updateQty(item.productId, item.colorId, item.size, qty)
            }
          />
        </div>

        <div className="text-small mt-auto flex gap-6">
          <button
            type="button"
            onClick={handleMoveToWishlist}
            className="flex items-center gap-1.5 underline underline-offset-4"
          >
            <Icon name="favorite" size={18} />
            Pindah ke wishlist
          </button>
          <button
            type="button"
            onClick={handleRemove}
            className="flex items-center gap-1.5 underline underline-offset-4"
          >
            <Icon name="delete" size={18} />
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
