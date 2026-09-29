import type { Gender } from "@/shared/types";

export const queryKeys = {
  products: {
    all: ["products"] as const,
    list: (params: Record<string, unknown>) =>
      ["products", "list", params] as const,
    detail: (slug: string) => ["products", "detail", slug] as const,
    related: (id: string) => ["products", "related", id] as const,
    completeTheLook: (id: string) =>
      ["products", "complete-the-look", id] as const,
    suggest: (q: string) => ["products", "suggest", q] as const,
  },
  categories: {
    byGender: (gender: Gender) => ["categories", gender] as const,
  },
  reviews: {
    byProduct: (productId: string, params: Record<string, unknown>) =>
      ["reviews", productId, params] as const,
  },
  home: {
    content: (gender: Gender) => ["home-content", gender] as const,
  },
  orders: {
    all: ["orders"] as const,
    detail: (id: string) => ["orders", id] as const,
  },
  shipping: {
    options: (addressKey: string) => ["shipping-options", addressKey] as const,
  },
  promo: {
    validate: (code: string, subtotal: number) =>
      ["promo", code, subtotal] as const,
  },
} as const;
