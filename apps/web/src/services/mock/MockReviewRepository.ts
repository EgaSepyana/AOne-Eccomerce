import { sleep } from "@/shared/lib/sleep";
import type {
  ReviewQuery,
  ReviewRepository,
} from "../repositories/ReviewRepository";
import { reviews } from "./data/reviews";

export class MockReviewRepository implements ReviewRepository {
  constructor(private readonly options: { latency: number }) {}

  async getByProduct(productId: string, query: ReviewQuery = {}) {
    if (this.options.latency > 0) await sleep(this.options.latency);

    let filtered = reviews.filter((r) => r.productId === productId);
    if (query.rating) {
      filtered = filtered.filter((r) => r.rating === query.rating);
    }
    if (query.withPhoto) {
      filtered = filtered.filter((r) => (r.photos?.length ?? 0) > 0);
    }

    const page = query.page ?? 1;
    const pageSize = 10;
    const start = (page - 1) * pageSize;

    return {
      items: filtered.slice(start, start + pageSize),
      total: filtered.length,
    };
  }
}
