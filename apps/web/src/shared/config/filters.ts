export interface FilterGroupConfig {
  key: string;
  label: string;
  defaultOpen: boolean;
}

export const FILTER_GROUPS: FilterGroupConfig[] = [
  { key: "category", label: "Kategori", defaultOpen: true },
  { key: "size", label: "Ukuran", defaultOpen: true },
  { key: "color", label: "Warna", defaultOpen: true },
  { key: "price", label: "Harga", defaultOpen: true },
  { key: "fit", label: "Fit", defaultOpen: false },
  { key: "material", label: "Bahan", defaultOpen: false },
  { key: "promo", label: "Promo", defaultOpen: false },
  { key: "rating", label: "Rating", defaultOpen: false },
];

export const PRICE_RANGE = { min: 0, max: 1_000_000, step: 10_000 } as const;
