import {
  buildFacets,
  filterProducts,
  sortProducts,
  type Product,
  type ProductList,
  type ProductQuery,
} from "@/entities/product";
import { sleep } from "@/shared/lib/sleep";
import type { ProductRepository } from "../repositories/ProductRepository";
import { products } from "./data/products";
import { searchProducts } from "./search-index";

export class MockProductRepository implements ProductRepository {
  constructor(private readonly options: { latency: number }) {}

  private async delay() {
    if (this.options.latency > 0) {
      await sleep(this.options.latency * (0.7 + Math.random() * 0.6));
    }
  }

  async list(query: ProductQuery): Promise<ProductList> {
    await this.delay();
    const base = query.q ? searchProducts(query.q) : products;
    const filtered = filterProducts(base, query);
    const facets = buildFacets(filtered);
    const sorted = sortProducts(filtered, query.sort);

    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 24;
    const start = (page - 1) * pageSize;
    const items = sorted.slice(start, start + pageSize);

    return { items, total: sorted.length, facets };
  }

  async getBySlug(slug: string): Promise<Product | null> {
    await this.delay();
    return products.find((p) => p.slug === slug) ?? null;
  }

  async getById(id: string): Promise<Product | null> {
    await this.delay();
    return products.find((p) => p.id === id) ?? null;
  }

  async getRelated(productId: string, limit = 8): Promise<Product[]> {
    await this.delay();
    const product = products.find((p) => p.id === productId);
    if (!product) return [];
    return products
      .filter((p) => p.id !== productId && p.category === product.category)
      .slice(0, limit);
  }

  async getCompleteTheLook(productId: string): Promise<Product[]> {
    await this.delay();
    const product = products.find((p) => p.id === productId);
    if (!product?.completeTheLook) return [];
    return product.completeTheLook
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is Product => !!p);
  }

  async suggest(
    q: string,
  ): Promise<{ keywords: string[]; products: Product[] }> {
    await this.delay();
    const query = q.trim();
    if (!query) return { keywords: [], products: [] };

    const matched = searchProducts(query);

    const keywords = Array.from(
      new Set(matched.flatMap((p) => [p.category, ...p.tags])),
    ).slice(0, 6);

    return { keywords, products: matched.slice(0, 4) };
  }
}
