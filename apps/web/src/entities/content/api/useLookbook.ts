import { useQuery } from "@tanstack/react-query";
import { repositories } from "@/services";

export function useLookbook(slug: string) {
  return useQuery({
    queryKey: ["lookbook", slug],
    queryFn: () => repositories.content.getLookbook(slug),
    enabled: !!slug,
  });
}
