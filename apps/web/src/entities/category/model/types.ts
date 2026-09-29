import type { Gender } from "@/entities/product";

export interface Category {
  id: string;
  slug: string;
  name: string;
  gender: Gender;
  image: string;
  count: number;
}
