import { useMutation } from "@tanstack/react-query";
import { repositories } from "@/services";
import type { CreateOrderPayload } from "@/services/repositories/OrderRepository";

export function useCreateOrder() {
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) =>
      repositories.order.create(payload),
  });
}
