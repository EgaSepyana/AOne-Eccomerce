import type { Category } from "@/entities/category";
import type { Product } from "@/entities/product";

export interface HeroSlide {
  id: string;
  image: string;
  imageMobile: string;
  label: string;
  headline: string;
  subheadline: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface Lookbook {
  id: string;
  slug: string;
  title: string;
  description?: string;
  image: string;
  productIds: string[];
}

export interface StyleTile {
  id: string;
  title: string;
  description: string;
  image: string;
  href: string;
}

export interface CampaignBanner {
  id: string;
  image: string;
  imageMobile: string;
  headline: string;
  subheadline: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface UGCPost {
  id: string;
  image: string;
  caption: string;
  productId: string;
}

export interface HomeContent {
  heroes: HeroSlide[];
  categories: Category[];
  newArrivals: Product[];
  bestSellers: Product[];
  lookbooks: Lookbook[];
  styles: StyleTile[];
  banners: CampaignBanner[];
  ugc: UGCPost[];
}
