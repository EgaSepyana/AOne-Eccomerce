import Fuse from "fuse.js";
import type { Product } from "@/entities/product";
import { products } from "./data/products";

export const searchIndex = new Fuse(products, {
  keys: [
    { name: "name", weight: 2 },
    { name: "category", weight: 1 },
    { name: "tags", weight: 1 },
  ],
  threshold: 0.4,
  ignoreLocation: true,
  minMatchCharLength: 2,
});

export function searchProducts(query: string): Product[] {
  const tokens = query.trim().split(/\s+/).filter(Boolean);
  if (tokens.length <= 1) {
    return searchIndex.search(query).map((result) => result.item);
  }

  const matchesByToken = tokens.map(
    (token) =>
      new Set(searchIndex.search(token).map((result) => result.item.id)),
  );
  const intersection = products.filter((p) =>
    matchesByToken.every((set) => set.has(p.id)),
  );

  if (intersection.length > 0) return intersection;
  return searchIndex.search(query).map((result) => result.item);
}
