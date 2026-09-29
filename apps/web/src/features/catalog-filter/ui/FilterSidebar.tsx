"use client";

import type { Facets } from "@/entities/product";
import { PRICE_RANGE } from "@/shared/config/filters";
import { RangeSlider, Swatch } from "@/shared/ui";
import { cn } from "@/shared/lib/cn";
import { useCatalogFilters } from "../model/useCatalogFilters";
import { FilterGroup } from "./FilterGroup";

export function FilterSidebar({
  facets,
  categoryLinkFor,
}: {
  facets: Facets;
  categoryLinkFor?: (categorySlug: string) => string;
}) {
  const { filters, setFilters } = useCatalogFilters();

  const priceMin = filters.priceMin ?? PRICE_RANGE.min;
  const priceMax = filters.priceMax ?? PRICE_RANGE.max;

  return (
    <aside className="flex flex-col">
      {facets.category.length > 0 && (
        <FilterGroup label="Kategori">
          {facets.category.map((c) => (
            <a
              key={c.value}
              href={categoryLinkFor?.(c.value)}
              className="text-body text-ink flex items-center justify-between"
            >
              <span>{c.label}</span>
              <span className="text-muted">{c.count}</span>
            </a>
          ))}
        </FilterGroup>
      )}

      {facets.size.length > 0 && (
        <FilterGroup label="Ukuran">
          <div className="grid grid-cols-4 gap-2">
            {facets.size.map((s) => {
              const selected = filters.size === s.value;
              return (
                <button
                  key={s.value}
                  type="button"
                  onClick={() =>
                    setFilters({ size: selected ? null : s.value, page: null })
                  }
                  className={cn(
                    "border-border text-body flex h-10 items-center justify-center border",
                    selected && "border-ink bg-ink text-white",
                  )}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </FilterGroup>
      )}

      {facets.color.length > 0 && (
        <FilterGroup label="Warna">
          <div className="grid grid-cols-4 gap-x-1 gap-y-3.5">
            {facets.color.map((c) => {
              const selected = filters.color === c.value;
              return (
                <div
                  key={c.value}
                  className="flex flex-col items-center gap-1.5"
                >
                  <Swatch
                    hex={c.hex}
                    name={c.label}
                    size="lg"
                    selected={selected}
                    onClick={() =>
                      setFilters({
                        color: selected ? null : c.value,
                        page: null,
                      })
                    }
                  />
                  <span className="text-caption text-muted">{c.label}</span>
                </div>
              );
            })}
          </div>
        </FilterGroup>
      )}

      <FilterGroup label="Harga">
        <RangeSlider
          min={PRICE_RANGE.min}
          max={PRICE_RANGE.max}
          step={PRICE_RANGE.step}
          valueMin={priceMin}
          valueMax={priceMax}
          onChange={(min, max) =>
            setFilters({
              priceMin: min === PRICE_RANGE.min ? null : min,
              priceMax: max === PRICE_RANGE.max ? null : max,
              page: null,
            })
          }
        />
      </FilterGroup>

      {facets.fit.length > 0 && (
        <FilterGroup label="Fit" defaultOpen={false}>
          {facets.fit.map((f) => {
            const selected = filters.fit === f.value;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() =>
                  setFilters({ fit: selected ? null : f.value, page: null })
                }
                className="text-body text-ink flex items-center justify-between"
              >
                <span className={cn(selected && "font-bold")}>{f.label}</span>
                <span className="text-muted">{f.count}</span>
              </button>
            );
          })}
        </FilterGroup>
      )}

      {facets.material.length > 0 && (
        <FilterGroup label="Bahan" defaultOpen={false}>
          {facets.material.map((m) => {
            const selected = filters.material === m.value;
            return (
              <button
                key={m.value}
                type="button"
                onClick={() =>
                  setFilters({
                    material: selected ? null : m.value,
                    page: null,
                  })
                }
                className="text-body text-ink flex items-center justify-between"
              >
                <span className={cn(selected && "font-bold")}>{m.label}</span>
                <span className="text-muted">{m.count}</span>
              </button>
            );
          })}
        </FilterGroup>
      )}

      <FilterGroup label="Promo" defaultOpen={false}>
        <button
          type="button"
          onClick={() =>
            setFilters({ promo: filters.promo ? null : "1", page: null })
          }
          className="text-body text-ink flex items-center justify-between"
        >
          <span className={cn(filters.promo && "font-bold")}>
            Sedang diskon
          </span>
        </button>
      </FilterGroup>

      <FilterGroup label="Rating" defaultOpen={false} bordered={false}>
        {[4, 3].map((r) => {
          const selected = filters.rating === r;
          return (
            <button
              key={r}
              type="button"
              onClick={() =>
                setFilters({ rating: selected ? null : r, page: null })
              }
              className="text-body text-ink flex items-center gap-1"
            >
              <span className={cn(selected && "font-bold")}>
                ★ {r}+ ke atas
              </span>
            </button>
          );
        })}
      </FilterGroup>
    </aside>
  );
}
