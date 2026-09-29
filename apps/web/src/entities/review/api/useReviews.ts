import { useQuery } from "@tanstack/react-query";
import { repositories } from "@/services";
import type { ReviewQuery } from "@/services/repositories/ReviewRepository";
import { queryKeys } from "@/shared/lib/query-keys";

export function useReviews(productId: string, query: ReviewQuery = {}) {
  return useQuery({
    queryKey: queryKeys.reviews.byProduct(productId, { ...query }),
    queryFn: () => repositories.review.getByProduct(productId, query),
    enabled: !!productId,
  });
}
