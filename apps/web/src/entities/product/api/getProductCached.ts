import { cache } from "react";
import { repositories } from "@/services";

export const getProductCached = cache(async (slug: string) => {
  return repositories.product.getBySlug(slug);
});
