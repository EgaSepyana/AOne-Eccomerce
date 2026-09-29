"use client";

import type { Facets } from "@/entities/product";
import { formatRupiah } from "@/shared/lib/format";
import { Chip } from "@/shared/ui";
import { useCatalogFilters } from "../model/useCatalogFilters";

export function ActiveFilters({ facets }: { facets: Facets }) {
  const { filters, setFilters, activeCount, clearAll } = useCatalogFilters();

  if (activeCount === 0) return null;

  const sizeLabel = facets.size.find((s) => s.value === filters.size)?.label;
  const colorLabel = facets.color.find((c) => c.value === filters.color)?.label;
  const fitLabel = facets.fit.find((f) => f.value === filters.fit)?.label;
  const materialLabel = facets.material.find(
    (m) => m.value === filters.material,
  )?.label;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {colorLabel && (
        <Chip onRemove={() => setFilters({ color: null, page: null })}>
          {colorLabel}
        </Chip>
      )}
      {sizeLabel && (
        <Chip onRemove={() => setFilters({ size: null, page: null })}>
          Ukuran {sizeLabel}
        </Chip>
      )}
      {(filters.priceMin != null || filters.priceMax != null) && (
        <Chip
          onRemove={() =>
            setFilters({ priceMin: null, priceMax: null, page: null })
          }
        >
          {formatRupiah(filters.priceMin ?? 0)}–
          {formatRupiah(filters.priceMax ?? 1_000_000)}
        </Chip>
      )}
      {fitLabel && (
        <Chip onRemove={() => setFilters({ fit: null, page: null })}>
          {fitLabel}
        </Chip>
      )}
      {materialLabel && (
        <Chip onRemove={() => setFilters({ material: null, page: null })}>
          {materialLabel}
        </Chip>
      )}
      {filters.promo && (
        <Chip onRemove={() => setFilters({ promo: null, page: null })}>
          Promo
        </Chip>
      )}
      {filters.rating != null && (
        <Chip onRemove={() => setFilters({ rating: null, page: null })}>
          ★ {filters.rating}+
        </Chip>
      )}
      <button
        type="button"
        onClick={clearAll}
        className="text-small ml-2 underline underline-offset-4"
      >
        Hapus semua
      </button>
    </div>
  );
}
