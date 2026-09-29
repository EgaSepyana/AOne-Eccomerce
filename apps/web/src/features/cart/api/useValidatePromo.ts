import { useMutation } from "@tanstack/react-query";
import { repositories } from "@/services";

export function useValidatePromo() {
  return useMutation({
    mutationFn: ({ code, subtotal }: { code: string; subtotal: number }) =>
      repositories.promo.validate(code, subtotal),
  });
}
