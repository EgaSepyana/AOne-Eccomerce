import type {
  CampaignBanner,
  HeroSlide,
  HomeContent,
  Lookbook,
  StyleTile,
  UGCPost,
} from "@/entities/content";
import type { Gender } from "@/entities/product";
import { categories } from "./categories";
import { products } from "./products";
import dummyImages2 from "./dummy_images2.json";

function findProductId(slug: string): string {
  const found = products.find((p) => p.slug === slug);
  if (!found) {
    throw new Error(`Product not found: ${slug}`);
  }
  return found.id;
}

const heroImagePool = dummyImages2.hero_images;
const lookbookImagePool = dummyImages2.lookbook;
const outfitImagePool = dummyImages2.outfit_by_occasion;
const eventImagePool = dummyImages2.event;

function heroImageFor(gender: Gender, index: number): string {
  const genderHero = heroImagePool.find((h) =>
    h.description.toLowerCase().includes(gender),
  );
  const saleHero = heroImagePool.find((h) => h.id === "hero_3");
  // Slide index 2 (third slide) shows the gender-neutral sale banner for variety.
  if (index === 2 && saleHero) return saleHero.url;
  return (genderHero ?? heroImagePool[0]!).url;
}

function lookbookImageFor(gender: Gender, index: number): string {
  const pool = lookbookImagePool.filter((l) => l.gender === gender);
  const fallback = lookbookImagePool;
  const list = pool.length > 0 ? pool : fallback;
  return list[index % list.length]!.url;
}

function outfitImageFor(occasion: string, gender: Gender): string {
  const pool = outfitImagePool.filter(
    (o) => o.occasion.toLowerCase() === occasion.toLowerCase(),
  );
  const byGender = pool.find((o) => o.gender === gender);
  return (byGender ?? pool[0] ?? outfitImagePool[0]!).url;
}

const heroesByGender: Record<Gender, HeroSlide[]> = {
  wanita: [
    {
      id: "hero-wanita-1",
      image: heroImageFor("wanita", 0),
      imageMobile: heroImageFor("wanita", 0),
      label: "Koleksi Baru",
      headline: "Gaya Effortless Setiap Hari",
      subheadline: "Temukan basic wardrobe wanita dari bahan premium",
      ctaLabel: "Belanja Sekarang",
      ctaHref: "/wanita",
    },
    {
      id: "hero-wanita-2",
      image: heroImageFor("wanita", 1),
      imageMobile: heroImageFor("wanita", 1),
      label: "Musim Kerja",
      headline: "Rapi Tanpa Ribet ke Kantor",
      subheadline: "Blazer, kemeja, dan celana chino serba padan",
      ctaLabel: "Lihat Koleksi",
      ctaHref: "/wanita/kategori/kemeja",
    },
    {
      id: "hero-wanita-3",
      image: heroImageFor("wanita", 2),
      imageMobile: heroImageFor("wanita", 2),
      label: "Akhir Pekan",
      headline: "Santai di Akhir Pekan",
      subheadline: "Dress dan rok nyaman untuk hangout",
      ctaLabel: "Jelajahi",
      ctaHref: "/wanita/kategori/dress",
    },
    {
      id: "hero-wanita-4",
      image: heroImageFor("wanita", 3),
      imageMobile: heroImageFor("wanita", 3),
      label: "Cuaca Dingin",
      headline: "Hangat dengan Gaya Minimalis",
      subheadline: "Sweater dan cardigan rajut untuk musim hujan",
      ctaLabel: "Belanja Sekarang",
      ctaHref: "/wanita/kategori/sweater",
    },
  ],
  pria: [
    {
      id: "hero-pria-1",
      image: heroImageFor("pria", 0),
      imageMobile: heroImageFor("pria", 0),
      label: "Koleksi Baru",
      headline: "Basic Wardrobe Pria Masa Kini",
      subheadline: "Kaos, kemeja, dan celana dengan bahan berkualitas",
      ctaLabel: "Belanja Sekarang",
      ctaHref: "/pria",
    },
    {
      id: "hero-pria-2",
      image: heroImageFor("pria", 1),
      imageMobile: heroImageFor("pria", 1),
      label: "Musim Kerja",
      headline: "Tampil Rapi di Setiap Meeting",
      subheadline: "Kemeja oxford dan celana chino andalan",
      ctaLabel: "Lihat Koleksi",
      ctaHref: "/pria/kategori/kemeja",
    },
    {
      id: "hero-pria-3",
      image: heroImageFor("pria", 2),
      imageMobile: heroImageFor("pria", 2),
      label: "Aktif Bergerak",
      headline: "Nyaman untuk Aktivitas Outdoor",
      subheadline: "Jaket water repellent dan jogger pants",
      ctaLabel: "Jelajahi",
      ctaHref: "/pria/kategori/jaket",
    },
    {
      id: "hero-pria-4",
      image: heroImageFor("pria", 3),
      imageMobile: heroImageFor("pria", 3),
      label: "Cuaca Dingin",
      headline: "Hangat dan Tetap Simpel",
      subheadline: "Hoodie fleece dan sweater rajut favorit",
      ctaLabel: "Belanja Sekarang",
      ctaHref: "/pria/kategori/hoodie",
    },
  ],
  anak: [
    {
      id: "hero-anak-1",
      image: heroImageFor("anak", 0),
      imageMobile: heroImageFor("anak", 0),
      label: "Koleksi Baru",
      headline: "Nyaman untuk si Kecil Bermain",
      subheadline: "Kaos dan celana anak berbahan lembut",
      ctaLabel: "Belanja Sekarang",
      ctaHref: "/anak",
    },
    {
      id: "hero-anak-2",
      image: heroImageFor("anak", 1),
      imageMobile: heroImageFor("anak", 1),
      label: "Jalan-jalan Keluarga",
      headline: "Kompak Sekeluarga",
      subheadline: "Kemeja flanel serasi untuk momen spesial",
      ctaLabel: "Lihat Koleksi",
      ctaHref: "/anak/kategori/kemeja",
    },
    {
      id: "hero-anak-3",
      image: heroImageFor("anak", 2),
      imageMobile: heroImageFor("anak", 2),
      label: "Aktif Bermain",
      headline: "Bebas Bergerak Sepanjang Hari",
      subheadline: "Jogger pants dan hoodie anti ribet",
      ctaLabel: "Jelajahi",
      ctaHref: "/anak/kategori/celana",
    },
    {
      id: "hero-anak-4",
      image: heroImageFor("anak", 3),
      imageMobile: heroImageFor("anak", 3),
      label: "Cuaca Dingin",
      headline: "Hangat dan Lucu",
      subheadline: "Sweater rajut anak yang lembut di kulit",
      ctaLabel: "Belanja Sekarang",
      ctaHref: "/anak/kategori/sweater",
    },
  ],
};

export const lookbooks: Lookbook[] = [
  {
    id: "lookbook-kerja-wanita",
    slug: "gaya-kerja-wanita",
    title: "Gaya Kerja Wanita",
    image: lookbookImageFor("wanita", 0),
    productIds: [
      findProductId("kemeja-linen-oversize"),
      findProductId("celana-chino-slim-fit-wanita"),
      findProductId("blazer-linen-wanita"),
      findProductId("rok-plisket"),
    ],
  },
  {
    id: "lookbook-santai-pria",
    slug: "gaya-santai-pria",
    title: "Gaya Santai Pria",
    image: lookbookImageFor("pria", 0),
    productIds: [
      findProductId("kaos-katun-supima-crew-neck-pria"),
      findProductId("jogger-pants-pria"),
      findProductId("jaket-denim-pria"),
      findProductId("hoodie-fleece-pria"),
    ],
  },
  {
    id: "lookbook-hangout-wanita",
    slug: "hangout-akhir-pekan",
    title: "Hangout Akhir Pekan",
    image: lookbookImageFor("wanita", 1),
    productIds: [
      findProductId("dress-midi-satin"),
      findProductId("jaket-denim-wanita"),
      findProductId("tank-top-rib-wanita"),
      findProductId("rok-mini-denim-wanita"),
      findProductId("sweater-rajut-turtleneck-wanita"),
    ],
  },
  {
    id: "lookbook-formal-pria",
    slug: "formal-kasual-pria",
    title: "Formal Kasual Pria",
    image: lookbookImageFor("pria", 1),
    productIds: [
      findProductId("kemeja-oxford-pria"),
      findProductId("celana-chino-slim-fit-pria"),
      findProductId("blazer-linen-pria"),
    ],
  },
];

const styles: StyleTile[] = [
  {
    id: "style-kerja",
    title: "Kerja",
    description: "Blazer, kemeja, celana bahan",
    image: outfitImageFor("Kerja", "wanita"),
    href: "/style/kerja",
  },
  {
    id: "style-santai",
    title: "Santai",
    description: "Kaos, kulot, cardigan",
    image: outfitImageFor("Santai", "wanita"),
    href: "/style/santai",
  },
  {
    id: "style-olahraga",
    title: "Olahraga",
    description: "Jogger, hoodie, tank top",
    image: outfitImageFor("Olahraga", "wanita"),
    href: "/style/olahraga",
  },
  {
    id: "style-hangout",
    title: "Hangout",
    description: "Dress, rok plisket, jeans",
    image: outfitImageFor("Hangout", "wanita"),
    href: "/style/hangout",
  },
];

const banners: CampaignBanner[] = [
  {
    id: "banner-diskon-akhir-bulan",
    image: eventImagePool[0]!.url,
    imageMobile: eventImagePool[0]!.url,
    headline: "Diskon Akhir Bulan",
    subheadline: "Hemat hingga 25% untuk koleksi pilihan",
    ctaLabel: "Belanja Sekarang",
    ctaHref: "/promo/akhir-bulan",
  },
  {
    id: "banner-gratis-ongkir",
    image: "/images/placeholder/banner/gratis-ongkir.jpg",
    imageMobile: "/images/placeholder/banner/gratis-ongkir-mobile.jpg",
    headline: "Gratis Ongkir Seluruh Indonesia",
    subheadline: "Minimum belanja Rp300.000 dengan kode ONGKIRFREE",
    ctaLabel: "Lihat Syarat",
    ctaHref: "/promo/ongkir",
  },
];

const ugc: UGCPost[] = [
  {
    id: "ugc-1",
    image: "/images/placeholder/ugc/1.jpg",
    caption: "@nadiaputri · Kaos Katun Supima",
    productId: findProductId("kaos-katun-supima-crew-neck"),
  },
  {
    id: "ugc-2",
    image: "/images/placeholder/ugc/2.jpg",
    caption: "@rinjanis · Hoodie Fleece",
    productId: findProductId("hoodie-fleece-pria"),
  },
  {
    id: "ugc-3",
    image: "/images/placeholder/ugc/3.jpg",
    caption: "@tasya.m · Dress Midi",
    productId: findProductId("dress-midi-satin"),
  },
  {
    id: "ugc-4",
    image: "/images/placeholder/ugc/4.jpg",
    caption: "@dimas.ptr · Jaket Bomber",
    productId: findProductId("jaket-bomber-water-repellent-pria"),
  },
  {
    id: "ugc-5",
    image: "/images/placeholder/ugc/5.jpg",
    caption: "@sekar.ayu · Celana Chino",
    productId: findProductId("celana-chino-slim-fit-wanita"),
  },
  {
    id: "ugc-6",
    image: "/images/placeholder/ugc/6.jpg",
    caption: "@bagas.w · Kemeja Oxford",
    productId: findProductId("kemeja-oxford-pria"),
  },
  {
    id: "ugc-7",
    image: "/images/placeholder/ugc/7.jpg",
    caption: "@laras.w · Sweater Rajut",
    productId: findProductId("sweater-rajut-turtleneck-wanita"),
  },
  {
    id: "ugc-8",
    image: "/images/placeholder/ugc/8.jpg",
    caption: "@dindaaa · Kaos Anak",
    productId: findProductId("kaos-katun-basic-anak"),
  },
];

export function getHomeContent(gender: Gender): HomeContent {
  const genderProducts = products.filter((p) => p.gender === gender);

  const newArrivals = [...genderProducts]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 8);

  const bestSellers = [...genderProducts]
    .sort((a, b) => b.soldCount - a.soldCount)
    .slice(0, 8);

  const genderCategories = categories.filter((c) => c.gender === gender);

  return {
    heroes: heroesByGender[gender],
    categories: genderCategories,
    newArrivals,
    bestSellers,
    lookbooks,
    styles,
    banners,
    ugc,
  };
}
