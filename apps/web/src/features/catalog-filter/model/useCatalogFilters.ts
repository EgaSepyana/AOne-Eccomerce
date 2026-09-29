"use client";

import {
  parseAsFloat,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs";
import type { SortKey } from "@/entities/product";

const SORT_VALUES: SortKey[] = [
  "rekomendasi",
  "terbaru",
  "terlaris",
  "harga-terendah",
  "harga-tertinggi",
  "rating",
];

export function useCatalogFilters() {
  const [filters, setFilters] = useQueryStates(
    {
      size: parseAsString,
      color: parseAsString,
      priceMin: parseAsFloat,
      priceMax: parseAsFloat,
      fit: parseAsString,
      material: parseAsString,
      promo: parseAsString,
      rating: parseAsFloat,
      sort: parseAsStringLiteral(SORT_VALUES).withDefault("rekomendasi"),
      page: parseAsInteger.withDefault(1),
    },
    { clearOnDefault: true },
  );

  const activeCount = [
    filters.size,
    filters.color,
    filters.priceMin != null || filters.priceMax != null ? "price" : null,
    filters.fit,
    filters.material,
    filters.promo,
    filters.rating,
  ].filter(Boolean).length;

  const clearAll = () =>
    setFilters({
      size: null,
      color: null,
      priceMin: null,
      priceMax: null,
      fit: null,
      material: null,
      promo: null,
      rating: null,
      page: null,
    });

  return { filters, setFilters, activeCount, clearAll };
}
