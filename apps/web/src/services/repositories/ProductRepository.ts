import type { Product, ProductList, ProductQuery } from "@/entities/product";

export interface ProductRepository {
  list(query: ProductQuery): Promise<ProductList>;
  getBySlug(slug: string): Promise<Product | null>;
  getById(id: string): Promise<Product | null>;
  getRelated(productId: string, limit?: number): Promise<Product[]>;
  getCompleteTheLook(productId: string): Promise<Product[]>;
  suggest(q: string): Promise<{ keywords: string[]; products: Product[] }>;
}
