import type {
  ColorFacetCount,
  Facets,
  FacetCount,
  Product,
  ProductQuery,
} from "../model/types";

export function filterProducts(
  products: Product[],
  query: ProductQuery,
): Product[] {
  return products.filter((p) => {
    if (query.gender && p.gender !== query.gender) return false;
    if (query.category && p.category !== query.category) return false;
    if (query.fit && p.fit !== query.fit) return false;
    if (query.rating && p.rating < query.rating) return false;
    if (query.promo && !p.compareAtPrice) return false;
    if (query.priceMin != null && p.price < query.priceMin) return false;
    if (query.priceMax != null && p.price > query.priceMax) return false;
    if (
      query.size &&
      !p.variants.some((v) =>
        v.sizes.some((s) => s.label === query.size && s.stock > 0),
      )
    ) {
      return false;
    }
    if (query.color && !p.variants.some((v) => v.color.id === query.color)) {
      return false;
    }
    return true;
  });
}

function countBy<T extends string>(
  products: Product[],
  extract: (p: Product) => T[],
): Map<T, number> {
  const counts = new Map<T, number>();
  for (const product of products) {
    for (const value of new Set(extract(product))) {
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
  }
  return counts;
}

function toFacetCounts(
  counts: Map<string, number>,
  labelFor: (v: string) => string,
): FacetCount[] {
  return Array.from(counts.entries())
    .map(([value, count]) => ({ value, label: labelFor(value), count }))
    .sort((a, b) => b.count - a.count);
}

export function buildFacets(products: Product[]): Facets {
  const categoryCounts = countBy(products, (p) => [p.category]);
  const sizeCounts = countBy(products, (p) =>
    p.variants.flatMap((v) =>
      v.sizes.filter((s) => s.stock > 0).map((s) => s.label),
    ),
  );
  const colorCounts = countBy(products, (p) =>
    p.variants.map((v) => v.color.id),
  );
  const fitCounts = countBy(products, (p) => (p.fit ? [p.fit] : []));
  const materialCounts = countBy(products, (p) => [p.material]);

  const colorNameById = new Map<string, string>();
  const colorHexById = new Map<string, string>();
  for (const p of products) {
    for (const v of p.variants) {
      colorNameById.set(v.color.id, v.color.name);
      colorHexById.set(v.color.id, v.color.hex);
    }
  }

  const colorFacets: ColorFacetCount[] = toFacetCounts(
    colorCounts,
    (v) => colorNameById.get(v) ?? v,
  ).map((facet) => ({
    ...facet,
    hex: colorHexById.get(facet.value) ?? "#E3E3E3",
  }));

  return {
    category: toFacetCounts(categoryCounts, (v) => v),
    size: toFacetCounts(sizeCounts, (v) => v),
    color: colorFacets,
    fit: toFacetCounts(fitCounts, (v) => v),
    material: toFacetCounts(materialCounts, (v) => v),
  };
}
