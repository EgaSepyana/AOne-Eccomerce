import type { Product, SortKey } from "../model/types";

const sortStrategies: Record<SortKey, (a: Product, b: Product) => number> = {
  rekomendasi: (a, b) => b.soldCount - a.soldCount,
  terbaru: (a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  terlaris: (a, b) => b.soldCount - a.soldCount,
  "harga-terendah": (a, b) => a.price - b.price,
  "harga-tertinggi": (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating,
};

export function sortProducts(
  products: Product[],
  sort: SortKey = "rekomendasi",
): Product[] {
  return [...products].sort(sortStrategies[sort]);
}
