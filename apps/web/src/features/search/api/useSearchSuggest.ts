import { useQuery } from "@tanstack/react-query";
import { repositories } from "@/services";
import { queryKeys } from "@/shared/lib/query-keys";

export function useSearchSuggest(query: string) {
  return useQuery({
    queryKey: queryKeys.products.suggest(query),
    queryFn: () => repositories.product.suggest(query),
    enabled: query.trim().length >= 2,
  });
}
