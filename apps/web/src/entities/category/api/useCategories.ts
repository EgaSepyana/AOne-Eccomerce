import { useQuery } from "@tanstack/react-query";
import { repositories } from "@/services";
import { queryKeys } from "@/shared/lib/query-keys";
import type { Gender } from "@/shared/types";

export function useCategories(gender: Gender) {
  return useQuery({
    queryKey: queryKeys.categories.byGender(gender),
    queryFn: () => repositories.category.getByGender(gender),
  });
}
