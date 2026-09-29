import type { Review } from "@/entities/review";
import { products } from "./products";

const AUTHORS = [
  "Dewi",
  "Rina",
  "Sari",
  "Putri",
  "Ayu",
  "Fitri",
  "Maya",
  "Indah",
  "Wulan",
  "Lestari",
  "Budi",
  "Andi",
  "Rizky",
  "Fajar",
  "Dimas",
  "Bayu",
  "Agus",
  "Yoga",
  "Irfan",
  "Hendra",
  "Nadia",
  "Citra",
  "Tari",
  "Bella",
  "Kirana",
  "Reza",
  "Aldi",
  "Gilang",
  "Dian",
  "Satria",
];

const TITLES_POSITIVE = [
  "Bahan bagus dan nyaman",
  "Sesuai ekspektasi",
  "Kualitas oke untuk harganya",
  "Jadi langganan beli di sini",
  "Ukuran pas dan rapi",
  "Recommended banget",
  "Suka banget sama modelnya",
  "Worth it dipakai sehari-hari",
];

const TITLES_NEUTRAL = [
  "Lumayan tapi ada catatan",
  "Cukup memuaskan",
  "Standar saja",
  "Oke tapi pengiriman lama",
];

const BODIES_POSITIVE = [
  "Bahannya adem dan tidak gampang kusut, dipakai seharian juga nyaman.",
  "Jahitannya rapi, tidak ada benang yang menjuntai. Sangat puas dengan pembelian ini.",
  "Warnanya sesuai foto, bahan juga tebal dan berkualitas. Bakal beli warna lain juga.",
  "Ukurannya pas sesuai size chart, tidak kebesaran atau kekecilan.",
  "Modelnya kekinian dan mudah dipadukan dengan outfit lain. Pengiriman juga cepat.",
  "Sudah beberapa kali cuci masih bagus, tidak melar atau luntur.",
  "Packingnya rapi dan aman, barang sampai dalam kondisi bagus.",
  "Bahan tidak panas dipakai meski cuaca lagi terik, cocok untuk daily wear.",
];

const BODIES_NEUTRAL = [
  "Bahannya lumayan bagus tapi pengiriman agak lama dari perkiraan.",
  "Sesuai harga, tidak mengecewakan tapi juga tidak istimewa.",
  "Warna sedikit beda dari foto tapi masih dalam toleransi wajar.",
  "Ukuran agak longgar dari biasanya, mungkin perlu order satu size lebih kecil.",
];

const FITS: Review["fit"][] = ["kekecilan", "pas", "kebesaran"];

function pick<T>(arr: readonly T[], seed: number): T {
  const idx = ((seed % arr.length) + arr.length) % arr.length;
  const value = arr[idx];
  if (value === undefined) {
    throw new Error("pick: empty array");
  }
  return value;
}

function dateOffset(baseIso: string, daysAfter: number): string {
  const base = new Date(baseIso);
  base.setDate(base.getDate() + daysAfter);
  return base.toISOString().slice(0, 10);
}

let globalSeed = 0;

function buildReviewsForProduct(
  productId: string,
  slug: string,
  createdAt: string,
  sizeLabels: string[],
): Review[] {
  const count = 3 + (globalSeed % 3);
  const reviews: Review[] = [];
  for (let i = 0; i < count; i += 1) {
    globalSeed += 1;
    const rating5050 = globalSeed % 10;
    const rating: Review["rating"] =
      rating5050 < 6 ? 5 : rating5050 < 8 ? 4 : rating5050 < 9 ? 3 : 2;
    const isPositive = rating >= 4;
    const author = pick(AUTHORS, globalSeed * 3 + i);
    const title = isPositive
      ? pick(TITLES_POSITIVE, globalSeed)
      : pick(TITLES_NEUTRAL, globalSeed);
    const body = isPositive
      ? pick(BODIES_POSITIVE, globalSeed + 1)
      : pick(BODIES_NEUTRAL, globalSeed + 1);
    const fit = pick(FITS, globalSeed + i);
    const sizeBought = pick(sizeLabels, globalSeed + i * 2);
    const includeHeight = globalSeed % 2 === 0;
    const helpful = (globalSeed * 13) % 81;
    const review: Review = {
      id: `rv-${productId}-${i + 1}`,
      productId,
      rating,
      title,
      body,
      author,
      sizeBought,
      fit,
      helpful,
      createdAt: dateOffset(createdAt, 5 + i * 9 + (globalSeed % 5)),
    };
    if (includeHeight) {
      review.heightCm = 155 + ((globalSeed * 7) % 35);
    }
    if (globalSeed % 5 === 0) {
      review.photos = [`/images/placeholder/${slug}/review/${i + 1}.jpg`];
    }
    reviews.push(review);
  }
  return reviews;
}

export const reviews: Review[] = products.flatMap((product) => {
  const sizeLabels = product.variants[0]?.sizes.map((s) => s.label) ?? ["M"];
  return buildReviewsForProduct(
    product.id,
    product.slug,
    product.createdAt,
    sizeLabels,
  );
});
