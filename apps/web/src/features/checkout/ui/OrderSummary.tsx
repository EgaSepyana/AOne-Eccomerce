"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartProducts, useCartStore, useCartTotals } from "@/features/cart";
import { Icon } from "@/shared/ui";
import { formatRupiah } from "@/shared/lib/format";
import { useCheckoutStore } from "../model/useCheckoutStore";
import { useShippingOptions } from "../api/useRegion";

export function OrderSummary() {
  const items = useCartStore((s) => s.items);
  const { lines } = useCartProducts(items);
  const shipping = useCheckoutStore((s) => s.shipping);
  const courierId = useCheckoutStore((s) => s.courierId);
  const { data: shippingOptions } = useShippingOptions(shipping?.cityId ?? "");
  const courier = shippingOptions?.find((s) => s.id === courierId);

  const {
    subtotal,
    shipping: shippingCost,
    discount,
    total,
    promo,
  } = useCartTotals(courier?.price ?? 0);

  return (
    <div className="bg-subtle flex flex-col gap-5 p-6">
      <div className="flex items-center justify-between">
        <span className="text-h3 text-ink font-bold">
          Pesananmu ({items.length})
        </span>
        <Link href="/cart" className="text-small underline underline-offset-4">
          Ubah
        </Link>
      </div>

      {lines.map((line) => {
        const image = line.product.variants[0]?.images[0];
        return (
          <div
            key={`${line.item.productId}-${line.item.colorId}-${line.item.size}`}
            className="flex gap-3"
          >
            <div className="relative aspect-[3/4] w-[60px] shrink-0 bg-white">
              {image && (
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="60px"
                  className="object-cover"
                />
              )}
              <span className="bg-ink text-caption absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full font-bold text-white">
                {line.item.qty}
              </span>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="text-small text-ink line-clamp-2">
                {line.product.name}
              </span>
              <span className="text-caption text-muted">
                {line.product.variants.find(
                  (v) => v.color.id === line.item.colorId,
                )?.color.name ?? ""}{" "}
                · {line.item.size}
              </span>
            </div>
            <span className="tabular text-small shrink-0 font-bold">
              {formatRupiah(line.product.price * line.item.qty)}
            </span>
          </div>
        );
      })}

      <div className="border-border text-body tabular flex flex-col gap-2.5 border-t pt-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatRupiah(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Ongkos kirim</span>
          <span className="font-bold">
            {shippingCost === 0 ? "Gratis" : formatRupiah(shippingCost)}
          </span>
        </div>
        {promo && discount > 0 && (
          <div className="flex justify-between">
            <span>Diskon {promo.code}</span>
            <span>-{formatRupiah(discount)}</span>
          </div>
        )}
      </div>

      <div className="border-ink tabular flex items-baseline justify-between border-t pt-4">
        <span className="text-body font-bold">Total</span>
        <span className="text-h2 font-bold">{formatRupiah(total)}</span>
      </div>

      <div className="text-caption flex flex-col gap-2">
        <span className="flex items-center gap-2">
          <Icon name="sync_alt" size={18} />
          Tukar ukuran gratis 14 hari
        </span>
        <span className="flex items-center gap-2">
          <Icon name="verified_user" size={18} />
          Pembayaran terenkripsi dan aman
        </span>
      </div>
    </div>
  );
}
