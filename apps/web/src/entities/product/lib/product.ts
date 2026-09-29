import type { Product, Variant } from "../model/types";

export function getActiveVariant(product: Product, colorId?: string): Variant {
  const found = colorId
    ? product.variants.find((v) => v.color.id === colorId)
    : undefined;
  return found ?? product.variants[0]!;
}

export function isSoldOut(variant: Variant): boolean {
  return variant.sizes.every((s) => s.stock === 0);
}

export function isLowStock(variant: Variant, threshold = 3): boolean {
  return variant.sizes.some((s) => s.stock > 0 && s.stock <= threshold);
}

export function discountPercent(product: Product): number {
  if (!product.compareAtPrice || product.compareAtPrice <= product.price) {
    return 0;
  }
  return Math.round((1 - product.price / product.compareAtPrice) * 100);
}
