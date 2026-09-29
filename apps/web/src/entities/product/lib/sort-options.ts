import type { SortKey } from "../model/types";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "rekomendasi", label: "Rekomendasi" },
  { value: "terbaru", label: "Terbaru" },
  { value: "terlaris", label: "Terlaris" },
  { value: "harga-terendah", label: "Harga terendah" },
  { value: "harga-tertinggi", label: "Harga tertinggi" },
  { value: "rating", label: "Rating" },
];
