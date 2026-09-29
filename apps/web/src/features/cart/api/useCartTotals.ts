"use client";

import { calcDiscount } from "../lib/promo";
import { useCartStore } from "../model/useCartStore";
import { useCartProducts } from "./useCartProducts";

export function useCartTotals(shippingCost = 0) {
  const items = useCartStore((s) => s.items);
  const promo = useCartStore((s) => s.promo);
  const { lines, subtotal, isLoading } = useCartProducts(items);

  const shippingFree = promo?.type === "free_shipping";
  const shipping = shippingFree ? 0 : shippingCost;
  const discount = calcDiscount({ subtotal, shipping: shippingCost }, promo);
  const total = Math.max(
    0,
    subtotal + shipping - (shippingFree ? 0 : discount),
  );

  return { lines, subtotal, shipping, discount, total, promo, isLoading };
}
