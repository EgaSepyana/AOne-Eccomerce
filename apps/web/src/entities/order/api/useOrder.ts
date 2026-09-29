import { useQuery } from "@tanstack/react-query";
import { repositories } from "@/services";
import { queryKeys } from "@/shared/lib/query-keys";

export function useOrder(orderId: string) {
  return useQuery({
    queryKey: queryKeys.orders.detail(orderId),
    queryFn: () => repositories.order.getById(orderId),
    enabled: !!orderId,
  });
}
