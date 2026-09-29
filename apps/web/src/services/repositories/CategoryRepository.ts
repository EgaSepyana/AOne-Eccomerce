import type { Category } from "@/entities/category";
import type { Gender } from "@/entities/product";

export interface CategoryRepository {
  getByGender(gender: Gender): Promise<Category[]>;
}
