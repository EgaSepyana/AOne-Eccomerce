import { useQuery } from "@tanstack/react-query";
import { repositories } from "@/services";
import { queryKeys } from "@/shared/lib/query-keys";

export function useProduct(slug: string) {
  return useQuery({
    queryKey: queryKeys.products.detail(slug),
    queryFn: () => repositories.product.getBySlug(slug),
  });
}

export function useRelatedProducts(productId: string) {
  return useQuery({
    queryKey: queryKeys.products.related(productId),
    queryFn: () => repositories.product.getRelated(productId),
    enabled: !!productId,
  });
}

export function useCompleteTheLook(productId: string) {
  return useQuery({
    queryKey: queryKeys.products.completeTheLook(productId),
    queryFn: () => repositories.product.getCompleteTheLook(productId),
    enabled: !!productId,
  });
}
