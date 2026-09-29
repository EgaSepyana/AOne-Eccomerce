import type { PromoState } from "../model/useCartStore";

export interface CartCtx {
  subtotal: number;
  shipping: number;
}

type PromoType = PromoState["type"];

const strategies: Record<
  PromoType,
  (ctx: CartCtx, promo: PromoState) => number
> = {
  percent: (c, p) => Math.round((c.subtotal * p.amount) / 100),
  fixed: (_, p) => p.amount,
  free_shipping: (c) => c.shipping,
};

export function calcDiscount(ctx: CartCtx, promo?: PromoState | null): number {
  return promo ? strategies[promo.type](ctx, promo) : 0;
}
