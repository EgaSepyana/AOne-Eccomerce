import type { Review } from "@/entities/review";

export interface ReviewQuery {
  rating?: number;
  withPhoto?: boolean;
  page?: number;
}

export interface ReviewRepository {
  getByProduct(
    productId: string,
    query?: ReviewQuery,
  ): Promise<{ items: Review[]; total: number }>;
}
