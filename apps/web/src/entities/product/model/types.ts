import type { Gender } from "@/shared/types";

export type { Gender };

export interface Color {
  id: string;
  name: string;
  hex: string;
}

export interface Size {
  label: string;
  stock: number;
}

export interface ProductImage {
  src: string;
  alt: string;
  kind: "packshot" | "model" | "detail" | "styling";
  modelInfo?: string;
}

export interface Variant {
  color: Color;
  images: ProductImage[];
  sizes: Size[];
}

export interface Product {
  id: string;
  slug: string;
  code: string;
  name: string;
  gender: Gender;
  category: string;
  subcategory?: string;
  price: number;
  compareAtPrice?: number;
  badge?: { type: "new" | "sale" | "stock"; label: string };
  fit?: "Slim" | "Regular" | "Oversize" | "Relaxed";
  material: string;
  care: string[];
  description: string;
  features: string[];
  variants: Variant[];
  rating: number;
  reviewCount: number;
  tags: string[];
  completeTheLook?: string[];
  createdAt: string;
  soldCount: number;
}

export interface ProductQuery {
  gender?: Gender;
  category?: string;
  q?: string;
  size?: string;
  color?: string;
  priceMin?: number;
  priceMax?: number;
  fit?: string;
  promo?: boolean;
  rating?: number;
  sort?: SortKey;
  page?: number;
  pageSize?: number;
}

export type SortKey =
  | "rekomendasi"
  | "terbaru"
  | "terlaris"
  | "harga-terendah"
  | "harga-tertinggi"
  | "rating";

export interface FacetCount {
  value: string;
  label: string;
  count: number;
}

export interface ColorFacetCount extends FacetCount {
  hex: string;
}

export interface Facets {
  category: FacetCount[];
  size: FacetCount[];
  color: ColorFacetCount[];
  fit: FacetCount[];
  material: FacetCount[];
}

export interface ProductList {
  items: Product[];
  total: number;
  facets: Facets;
}
