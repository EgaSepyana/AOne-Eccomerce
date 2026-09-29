"use client";

import Image from "next/image";
import { useState } from "react";
import { useCartStore } from "@/features/cart";
import { useUIStore } from "@/shared/model/useUIStore";
import type { Product } from "@/entities/product";
import { getActiveVariant } from "@/entities/product";
import { Button, Icon } from "@/shared/ui";
import { formatRupiah } from "@/shared/lib/format";

export function CompleteTheLook({
  mainProduct,
  items,
}: {
  mainProduct: Product;
  items: Product[];
}) {
  const allProducts = [mainProduct, ...items];
  const [checked, setChecked] = useState<Set<string>>(
    new Set(allProducts.map((p) => p.id)),
  );
  const addToCart = useCartStore((s) => s.add);
  const setCartDrawerOpen = useUIStore((s) => s.setCartDrawerOpen);

  const selectedProducts = allProducts.filter((p) => checked.has(p.id));
  const total = selectedProducts.reduce((sum, p) => sum + p.price, 0);

  function toggle(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function addAllToCart() {
    for (const product of selectedProducts) {
      const variant = getActiveVariant(product);
      const firstAvailable = variant.sizes.find((s) => s.stock > 0);
      if (firstAvailable) {
        addToCart({
          productId: product.id,
          colorId: variant.color.id,
          size: firstAvailable.label,
          qty: 1,
        });
      }
    }
    setCartDrawerOpen(true);
  }

  return (
    <section className="flex flex-col gap-8">
      <h2 className="text-h2 text-ink lg:text-h2-lg font-bold">
        Lengkapi Gayamu
      </h2>
      <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {allProducts.map((product, index) => {
          const variant = getActiveVariant(product);
          const image = variant.images[0];
          const isChecked = checked.has(product.id);
          return (
            <div
              key={product.id}
              className="border-border flex gap-4 border p-3"
            >
              <div className="bg-subtle relative aspect-[3/4] w-22 shrink-0">
                {image && (
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="88px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-caption text-muted">
                    {index === 0 ? "Produk ini" : "Pelengkap"}
                  </span>
                  <button
                    type="button"
                    aria-label={
                      isChecked ? "Hapus dari pilihan" : "Tambah ke pilihan"
                    }
                    onClick={() => toggle(product.id)}
                    className={`flex size-5 shrink-0 items-center justify-center border-[1.5px] ${
                      isChecked
                        ? "border-ink bg-ink text-white"
                        : "border-border"
                    }`}
                  >
                    {isChecked && <Icon name="check" size={16} />}
                  </button>
                </div>
                <span className="text-small text-ink line-clamp-2">
                  {product.name}
                </span>
                <span className="text-caption text-muted">
                  {variant.color.name}
                </span>
                <span className="text-body tabular mt-auto font-bold">
                  {formatRupiah(product.price)}
                </span>
              </div>
            </div>
          );
        })}
        <div className="bg-subtle flex flex-col justify-between gap-4 p-6">
          <div className="flex flex-col gap-1">
            <span className="text-body text-muted">
              Total {selectedProducts.length} produk
            </span>
            <span className="text-price-lg tabular font-bold">
              {formatRupiah(total)}
            </span>
            <span className="text-caption text-ink">
              Sudah termasuk gratis ongkir
            </span>
          </div>
          <Button
            variant="secondary"
            className="bg-white"
            onClick={addAllToCart}
            disabled={selectedProducts.length === 0}
          >
            TAMBAH SEMUA KE KERANJANG
          </Button>
        </div>
      </div>
    </section>
  );
}
