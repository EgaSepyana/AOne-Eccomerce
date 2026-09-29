"use client";

import Image from "next/image";
import Link from "next/link";
import { formatRupiah } from "@/shared/lib/format";
import { QuantityStepper, Icon } from "@/shared/ui";
import type { CartLine } from "../api/useCartProducts";
import { useCartStore } from "../model/useCartStore";

export function CartLineItem({ item, product }: CartLine) {
  const updateQty = useCartStore((s) => s.updateQty);
  const remove = useCartStore((s) => s.remove);

  const variant =
    product.variants.find((v) => v.color.id === item.colorId) ??
    product.variants[0]!;
  const image = variant.images[0];

  return (
    <div className="flex gap-3 py-4">
      <Link
        href={`/p/${product.slug}`}
        className="bg-subtle relative size-20 shrink-0"
      >
        {image && (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="80px"
            className="object-cover"
          />
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-1">
        <Link
          href={`/p/${product.slug}`}
          className="text-small text-ink line-clamp-2"
        >
          {product.name}
        </Link>
        <p className="text-caption text-muted">
          {variant.color.name} · {item.size}
        </p>
        <p className="tabular text-small font-bold">
          {formatRupiah(product.price)}
        </p>
        <div className="mt-1 flex items-center justify-between">
          <QuantityStepper
            value={item.qty}
            onChange={(qty) =>
              updateQty(item.productId, item.colorId, item.size, qty)
            }
          />
          <button
            type="button"
            aria-label="Hapus dari keranjang"
            onClick={() => remove(item.productId, item.colorId, item.size)}
          >
            <Icon name="delete" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
