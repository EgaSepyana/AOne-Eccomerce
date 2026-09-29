import Link from "next/link";
import { formatRupiah } from "@/shared/lib/format";
import { Button, Icon } from "@/shared/ui";
import type { PromoState } from "../model/useCartStore";
import { PromoCodeInput } from "./PromoCodeInput";

const PAYMENT_ICONS = [
  "BCA",
  "Mandiri",
  "QRIS",
  "GoPay",
  "OVO",
  "DANA",
  "ShopeePay",
  "Visa",
  "COD",
];

export interface CartSummaryProps {
  itemCount: number;
  subtotal: number;
  shipping: number;
  discount: number;
  promo: PromoState | null;
  total: number;
  checkoutHref?: string;
  showPromoInput?: boolean;
  showPaymentIcons?: boolean;
}

export function CartSummary({
  itemCount,
  subtotal,
  shipping,
  discount,
  promo,
  total,
  checkoutHref = "/checkout",
  showPromoInput = true,
  showPaymentIcons = true,
}: CartSummaryProps) {
  return (
    <div className="flex flex-col gap-5">
      <span className="text-h3 text-ink font-bold">Ringkasan Pesanan</span>
      <div className="text-body tabular flex flex-col gap-3">
        <div className="flex justify-between">
          <span>Subtotal ({itemCount} produk)</span>
          <span>{formatRupiah(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Ongkos kirim</span>
          <span className="font-bold">
            {shipping === 0 ? "Gratis" : formatRupiah(shipping)}
          </span>
        </div>
        {promo && discount > 0 && (
          <div className="flex justify-between">
            <span>Diskon kode {promo.code}</span>
            <span>-{formatRupiah(discount)}</span>
          </div>
        )}
      </div>
      {showPromoInput && <PromoCodeInput subtotal={subtotal} />}
      <div className="border-ink tabular flex items-baseline justify-between border-t pt-4">
        <span className="text-body font-bold">Total</span>
        <span className="text-price-lg font-bold">{formatRupiah(total)}</span>
      </div>
      <Link href={checkoutHref}>
        <Button className="w-full gap-2">
          <Icon name="lock" size={18} />
          CHECKOUT
        </Button>
      </Link>
      <span className="text-caption text-muted text-center">
        atau cicilan 0% mulai {formatRupiah(total / 3)}/bulan
      </span>
      {showPaymentIcons && (
        <div className="flex flex-wrap justify-center gap-1.5">
          {PAYMENT_ICONS.map((p) => (
            <span
              key={p}
              className="border-border text-caption text-muted flex h-6 items-center border px-2 font-medium"
            >
              {p}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
