import { useQuery } from "@tanstack/react-query";
import { repositories } from "@/services";
import { queryKeys } from "@/shared/lib/query-keys";
import type { Gender } from "@/entities/product";

export function useHomeContent(gender: Gender) {
  return useQuery({
    queryKey: queryKeys.home.content(gender),
    queryFn: () => repositories.content.getHomeContent(gender),
  });
}
