import { useQuery } from "@tanstack/react-query";
import { repositories } from "@/services";
import { queryKeys } from "@/shared/lib/query-keys";

export function useOrders() {
  return useQuery({
    queryKey: queryKeys.orders.all,
    queryFn: () => repositories.order.getAll(),
  });
}
