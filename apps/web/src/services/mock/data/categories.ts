import type { Category } from "@/entities/category";
import type { Gender } from "@/entities/product";
import { products } from "./products";

interface CategorySpec {
  id: string;
  slug: string;
  name: string;
  gender: Gender;
}

const CATEGORY_SPECS: CategorySpec[] = [
  { id: "cat-wanita-kaos", slug: "kaos", name: "Kaos", gender: "wanita" },
  { id: "cat-wanita-kemeja", slug: "kemeja", name: "Kemeja", gender: "wanita" },
  { id: "cat-wanita-celana", slug: "celana", name: "Celana", gender: "wanita" },
  { id: "cat-wanita-jaket", slug: "jaket", name: "Jaket", gender: "wanita" },
  { id: "cat-wanita-dress", slug: "dress", name: "Dress", gender: "wanita" },
  { id: "cat-wanita-rok", slug: "rok", name: "Rok", gender: "wanita" },
  {
    id: "cat-wanita-sweater",
    slug: "sweater",
    name: "Sweater",
    gender: "wanita",
  },
  { id: "cat-wanita-hoodie", slug: "hoodie", name: "Hoodie", gender: "wanita" },

  { id: "cat-pria-kaos", slug: "kaos", name: "Kaos", gender: "pria" },
  { id: "cat-pria-kemeja", slug: "kemeja", name: "Kemeja", gender: "pria" },
  { id: "cat-pria-celana", slug: "celana", name: "Celana", gender: "pria" },
  { id: "cat-pria-jaket", slug: "jaket", name: "Jaket", gender: "pria" },
  { id: "cat-pria-sweater", slug: "sweater", name: "Sweater", gender: "pria" },
  { id: "cat-pria-hoodie", slug: "hoodie", name: "Hoodie", gender: "pria" },

  { id: "cat-anak-kaos", slug: "kaos", name: "Kaos", gender: "anak" },
  { id: "cat-anak-kemeja", slug: "kemeja", name: "Kemeja", gender: "anak" },
  { id: "cat-anak-celana", slug: "celana", name: "Celana", gender: "anak" },
  { id: "cat-anak-jaket", slug: "jaket", name: "Jaket", gender: "anak" },
  { id: "cat-anak-dress", slug: "dress", name: "Dress", gender: "anak" },
  { id: "cat-anak-sweater", slug: "sweater", name: "Sweater", gender: "anak" },
];

function countProducts(gender: Gender, slug: string): number {
  return products.filter((p) => p.gender === gender && p.category === slug)
    .length;
}

function representativeImage(gender: Gender, slug: string): string {
  const match = products.find(
    (p) => p.gender === gender && p.category === slug,
  );
  const firstVariant = match?.variants[0];
  const firstImage = firstVariant?.images[0];
  if (match && firstVariant && firstImage) {
    return `/images/placeholder/${match.slug}/${firstVariant.color.id}/1.jpg`;
  }
  return `/images/placeholder/category/${gender}/${slug}.jpg`;
}

export const categories: Category[] = CATEGORY_SPECS.map((spec) => ({
  id: spec.id,
  slug: spec.slug,
  name: spec.name,
  gender: spec.gender,
  image: representativeImage(spec.gender, spec.slug),
  count: countProducts(spec.gender, spec.slug),
})).filter((category) => category.count > 0);
