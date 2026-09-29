import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/entities/order";

export interface PromoState {
  code: string;
  type: "percent" | "fixed" | "free_shipping";
  amount: number;
}

interface CartState {
  items: CartItem[];
  promo: PromoState | null;
  add: (item: CartItem) => void;
  remove: (productId: string, colorId: string, size: string) => void;
  updateQty: (
    productId: string,
    colorId: string,
    size: string,
    qty: number,
  ) => void;
  updateVariant: (
    productId: string,
    colorId: string,
    size: string,
    next: { colorId?: string; size?: string },
  ) => void;
  setPromo: (promo: PromoState | null) => void;
  clear: () => void;
}

function sameLine(
  a: CartItem,
  productId: string,
  colorId: string,
  size: string,
) {
  return a.productId === productId && a.colorId === colorId && a.size === size;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      promo: null,
      add: (item) =>
        set((state) => {
          const existing = state.items.find((i) =>
            sameLine(i, item.productId, item.colorId, item.size),
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                sameLine(i, item.productId, item.colorId, item.size)
                  ? { ...i, qty: i.qty + item.qty }
                  : i,
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
      remove: (productId, colorId, size) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !sameLine(i, productId, colorId, size),
          ),
        })),
      updateQty: (productId, colorId, size, qty) =>
        set((state) => ({
          items: state.items.map((i) =>
            sameLine(i, productId, colorId, size) ? { ...i, qty } : i,
          ),
        })),
      updateVariant: (productId, colorId, size, next) =>
        set((state) => ({
          items: state.items.map((i) =>
            sameLine(i, productId, colorId, size)
              ? {
                  ...i,
                  colorId: next.colorId ?? i.colorId,
                  size: next.size ?? i.size,
                }
              : i,
          ),
        })),
      setPromo: (promo) => set({ promo }),
      clear: () => set({ items: [], promo: null }),
    }),
    { name: "aone-cart" },
  ),
);
