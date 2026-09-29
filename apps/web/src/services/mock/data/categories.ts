import type { Category } from "@/entities/category";
import type { Gender } from "@/entities/product";
import { products } from "./products";
import dummyImages2 from "./dummy_images2.json";

const categoryImagePool = dummyImages2.categories;

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

// cat_hoodie's Unsplash photo (1556821840-3a63f15732ce) returns 404 upstream; skip it.
const BROKEN_CATEGORY_IMAGE_IDS = new Set(["cat_hoodie"]);

function representativeImage(gender: Gender, slug: string): string {
  const dummyEntry = categoryImagePool.find((c) => c.id === `cat_${slug}`);
  const fromDummyPool =
    dummyEntry && !BROKEN_CATEGORY_IMAGE_IDS.has(dummyEntry.id)
      ? dummyEntry.image.url
      : undefined;
  if (fromDummyPool) return fromDummyPool;

  const match = products.find(
    (p) => p.gender === gender && p.category === slug,
  );
  const firstImage = match?.variants[0]?.images[0];
  if (firstImage) return firstImage.src;

  return "/images/placeholder/fallback.jpg";
}

export const categories: Category[] = CATEGORY_SPECS.map((spec) => ({
  id: spec.id,
  slug: spec.slug,
  name: spec.name,
  gender: spec.gender,
  image: representativeImage(spec.gender, spec.slug),
  count: countProducts(spec.gender, spec.slug),
})).filter((category) => category.count > 0);
