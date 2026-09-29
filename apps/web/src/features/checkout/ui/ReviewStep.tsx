"use client";

import { useState } from "react";
import { useCartProducts, useCartStore, useCartTotals } from "@/features/cart";
import { Button, Checkbox } from "@/shared/ui";
import {
  useCities,
  useDistricts,
  useProvinces,
  useShippingOptions,
} from "../api/useRegion";
import { useCreateOrder } from "../api/useCreateOrder";
import { useCheckoutStore } from "../model/useCheckoutStore";
import type { CreateOrderPayload } from "@/services/repositories/OrderRepository";

const PAYMENT_LABELS: Record<string, string> = {
  virtual_account: "Virtual Account",
  e_wallet: "E-wallet",
  qris: "QRIS",
  credit_card: "Kartu Kredit/Debit",
  installment: "Cicilan 0%",
  cod: "Bayar di Tempat (COD)",
};

export function ReviewStep({
  onBack,
  onSuccess,
}: {
  onBack: () => void;
  onSuccess: (orderId: string) => void;
}) {
  const [agreed, setAgreed] = useState(false);
  const shipping = useCheckoutStore((s) => s.shipping);
  const courierId = useCheckoutStore((s) => s.courierId);
  const paymentMethod = useCheckoutStore((s) => s.paymentMethod);
  const toAddress = useCheckoutStore((s) => s.toAddress);

  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clear);
  const { lines } = useCartProducts(items);

  const { data: provinces } = useProvinces();
  const { data: cities } = useCities(shipping?.provinceId ?? "");
  const { data: districts } = useDistricts(shipping?.cityId ?? "");
  const { data: shippingOptions } = useShippingOptions(shipping?.cityId ?? "");
  const courier = shippingOptions?.find((s) => s.id === courierId);

  const {
    subtotal,
    shipping: shippingCost,
    discount,
    total,
  } = useCartTotals(courier?.price ?? 0);

  const { mutate, isPending } = useCreateOrder();

  const provinceName = provinces?.find(
    (p) => p.id === shipping?.provinceId,
  )?.name;
  const cityName = cities?.find((c) => c.id === shipping?.cityId)?.name;
  const districtName = districts?.find(
    (d) => d.id === shipping?.districtId,
  )?.name;

  function handleSubmit() {
    const address = toAddress();
    if (!address || !paymentMethod || !agreed) return;

    const payload: CreateOrderPayload = {
      items: lines.map((line) => ({
        productId: line.item.productId,
        colorId: line.item.colorId,
        size: line.item.size,
        qty: line.item.qty,
        price: line.product.price,
        name: line.product.name,
        image: line.product.variants[0]?.images[0]?.src ?? "",
      })),
      address,
      courier: courier?.label ?? "",
      payment: PAYMENT_LABELS[paymentMethod] ?? paymentMethod,
      subtotal,
      discount,
      shipping: shippingCost,
      total,
    };

    mutate(payload, {
      onSuccess: (order) => {
        clearCart();
        onSuccess(order.id);
      },
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="border-border flex flex-col gap-3 border p-5">
        <div className="flex items-center justify-between">
          <span className="text-h3 text-ink font-bold">✓ Pengiriman</span>
          <button
            type="button"
            onClick={onBack}
            className="text-small underline underline-offset-4"
          >
            Ubah
          </button>
        </div>
        <div className="text-body grid grid-cols-[120px_minmax(0,1fr)] gap-y-2">
          <span className="text-muted">Kontak</span>
          <span>
            {shipping?.email} · {shipping?.phone}
          </span>
          <span className="text-muted">Alamat</span>
          <span>
            {shipping?.name}, {shipping?.address}, {districtName}, {cityName}{" "}
            {shipping?.postalCode}
            {provinceName ? `, ${provinceName}` : ""}
          </span>
          <span className="text-muted">Kurir</span>
          <span>{courier?.label}</span>
          <span className="text-muted">Pembayaran</span>
          <span>{paymentMethod ? PAYMENT_LABELS[paymentMethod] : ""}</span>
        </div>
      </div>

      <div className="border-border flex flex-col gap-4 border p-5">
        <span className="text-h3 text-ink font-bold">Ringkasan Item</span>
        {lines.map((line) => (
          <div
            key={`${line.item.productId}-${line.item.colorId}-${line.item.size}`}
            className="text-body flex justify-between"
          >
            <span>
              {line.product.name} × {line.item.qty}
            </span>
            <span className="tabular font-medium">
              {(line.product.price * line.item.qty).toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              })}
            </span>
          </div>
        ))}
      </div>

      <Checkbox
        label="Saya menyetujui syarat dan ketentuan yang berlaku"
        checked={agreed}
        onChange={(e) => setAgreed(e.target.checked)}
      />

      <Button onClick={handleSubmit} loading={isPending} disabled={!agreed}>
        BUAT PESANAN
      </Button>
    </div>
  );
}
