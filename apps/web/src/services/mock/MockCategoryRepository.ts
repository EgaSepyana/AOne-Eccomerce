import type { Category } from "@/entities/category";
import type { Gender } from "@/entities/product";
import { sleep } from "@/shared/lib/sleep";
import type { CategoryRepository } from "../repositories/CategoryRepository";
import { categories } from "./data/categories";

export class MockCategoryRepository implements CategoryRepository {
  constructor(private readonly options: { latency: number }) {}

  async getByGender(gender: Gender): Promise<Category[]> {
    if (this.options.latency > 0) await sleep(this.options.latency);
    return categories.filter((c) => c.gender === gender);
  }
}
