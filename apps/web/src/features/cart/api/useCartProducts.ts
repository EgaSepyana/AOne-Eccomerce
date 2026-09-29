import { useQueries } from "@tanstack/react-query";
import { repositories } from "@/services";
import type { CartItem } from "@/entities/order";
import type { Product } from "@/entities/product";

export interface CartLine {
  item: CartItem;
  product: Product;
}

export function useCartProducts(items: CartItem[]) {
  const results = useQueries({
    queries: items.map((item) => ({
      queryKey: ["cart-product", item.productId],
      queryFn: () => repositories.product.getById(item.productId),
    })),
  });

  const isLoading = results.some((r) => r.isLoading);
  const lines: CartLine[] = items
    .map((item, index) => {
      const product = results[index]?.data;
      return product ? { item, product } : null;
    })
    .filter((line): line is CartLine => line !== null);

  const subtotal = lines.reduce(
    (sum, line) => sum + line.product.price * line.item.qty,
    0,
  );

  return { lines, subtotal, isLoading };
}
