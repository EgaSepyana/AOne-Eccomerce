import Link from "next/link";
import type { Product } from "../model/types";
import { ProductCard } from "./ProductCard";

export interface ProductGridProps {
  title: string;
  products: Product[];
  seeAllHref?: string;
  wishlistedIds?: Set<string>;
  onToggleWishlist?: (productId: string) => void;
}

export function ProductGrid({
  title,
  products,
  seeAllHref,
  wishlistedIds,
  onToggleWishlist,
}: ProductGridProps) {
  if (products.length === 0) return null;

  return (
    <section className="flex flex-col gap-8 px-4 lg:px-10">
      <div className="flex items-center gap-4">
        <h2 className="text-h2 text-ink lg:text-h2-lg flex-1 font-bold">
          {title}
        </h2>
        {seeAllHref && (
          <Link
            href={seeAllHref}
            className="text-small font-medium underline underline-offset-4"
          >
            Lihat semua
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-4 lg:gap-y-10">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isWishlisted={wishlistedIds?.has(product.id)}
            onToggleWishlist={onToggleWishlist}
          />
        ))}
      </div>
    </section>
  );
}
