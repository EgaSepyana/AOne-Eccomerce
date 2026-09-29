import type { Product, ProductImage, Size, Variant } from "@/entities/product";

interface ColorSpec {
  id: string;
  name: string;
  hex: string;
}

const COLORS: Record<string, ColorSpec> = {
  hitam: { id: "hitam", name: "Hitam", hex: "#111111" },
  putih: { id: "putih", name: "Putih", hex: "#FFFFFF" },
  abuAbu: { id: "abu-abu", name: "Abu-abu", hex: "#6B6B6B" },
  navy: { id: "navy", name: "Navy", hex: "#1B2A4A" },
  krem: { id: "krem", name: "Krem", hex: "#E8DCC8" },
  cokelat: { id: "cokelat", name: "Cokelat", hex: "#5C4433" },
  olive: { id: "olive", name: "Olive", hex: "#4A4A3A" },
  abuMuda: { id: "abu-muda", name: "Abu Muda", hex: "#C9C9C9" },
  maroon: { id: "maroon", name: "Maroon", hex: "#5E2129" },
  dustyPink: { id: "dusty-pink", name: "Dusty Pink", hex: "#C9A3A0" },
  sage: { id: "sage", name: "Sage", hex: "#8A9678" },
  mustard: { id: "mustard", name: "Mustard", hex: "#B8912F" },
};

const CARE_BASIC = [
  "Cuci dengan air dingin",
  "Jangan gunakan pemutih",
  "Setrika suhu rendah",
  "Jangan dry clean",
];

const CARE_KNIT = [
  "Cuci dengan tangan atau siklus halus",
  "Jangan diperas atau digantung basah",
  "Jemur mendatar di tempat teduh",
  "Setrika suhu rendah dengan kain pelapis",
];

const CARE_OUTER = [
  "Cuci dengan air dingin secara terpisah",
  "Gunakan deterjen lembut",
  "Jangan gunakan pengering panas tinggi",
  "Gantung untuk mengeringkan",
];

let sizeCounter = 0;
let lowStockAssigned = false;
let soldOutAssigned = false;

function makeSizes(labels: string[]): Size[] {
  return labels.map((label) => {
    sizeCounter += 1;
    let stock: number;
    if (!soldOutAssigned && sizeCounter % 17 === 0) {
      stock = 0;
      soldOutAssigned = true;
    } else if (!lowStockAssigned && sizeCounter % 11 === 0) {
      stock = 2;
      lowStockAssigned = true;
    } else {
      stock = ((sizeCounter * 7) % 48) + 1;
    }
    return { label, stock };
  });
}

const SIZE_SETS: string[][] = [
  ["S", "M", "L", "XL"],
  ["XS", "S", "M", "L"],
  ["S", "M", "L", "XL", "XXL"],
  ["M", "L", "XL"],
  ["XS", "S", "M", "L", "XL"],
];

function pickSizeSet(seed: number): string[] {
  const set = SIZE_SETS[seed % SIZE_SETS.length];
  return set ?? ["S", "M", "L"];
}

function makeImages(
  slug: string,
  colorId: string,
  name: string,
  colorName: string,
  count: number,
): ProductImage[] {
  const kinds: ProductImage["kind"][] = [
    "packshot",
    "model",
    "detail",
    "styling",
  ];
  const images: ProductImage[] = [];
  for (let n = 1; n <= count; n += 1) {
    const kind = kinds[(n - 1) % kinds.length] ?? "packshot";
    const views = [
      "tampak depan",
      "tampak belakang",
      "detail bahan",
      "gaya sehari-hari",
    ];
    const view = views[(n - 1) % views.length] ?? "tampak depan";
    const img: ProductImage = {
      src: `/images/placeholder/${slug}/${colorId}/${n}.jpg`,
      alt: `${name} warna ${colorName}, ${view}`,
      kind,
    };
    if (kind === "model") {
      const heights = [168, 170, 172, 175, 178, 180, 182];
      const height = heights[(n + colorId.length) % heights.length] ?? 175;
      const sizeLabels = ["S", "M", "L"];
      const sizeLabel =
        sizeLabels[(n + colorId.length) % sizeLabels.length] ?? "M";
      img.modelInfo = `Tinggi model ${height} cm · Pakai ukuran ${sizeLabel}`;
    }
    images.push(img);
  }
  return images;
}

function makeVariants(
  slug: string,
  name: string,
  colorKeys: string[],
  sizeSeed: number,
  imageCount: number,
): Variant[] {
  return colorKeys.map((key, idx) => {
    const color = COLORS[key];
    if (!color) {
      throw new Error(`Unknown color key: ${key}`);
    }
    const sizes = makeSizes(pickSizeSet(sizeSeed + idx));
    return {
      color: { id: color.id, name: color.name, hex: color.hex },
      images: makeImages(slug, color.id, name, color.name, imageCount),
      sizes,
    };
  });
}

interface ProductSpec {
  id: string;
  slug: string;
  name: string;
  gender: Product["gender"];
  category: string;
  subcategory?: string;
  price: number;
  compareAtPrice?: number;
  badge?: Product["badge"];
  fit?: Product["fit"];
  material: string;
  care: string[];
  description: string;
  features: string[];
  colorKeys: string[];
  imageCount: number;
  tags: string[];
  rating: number;
  reviewCount: number;
  createdAt: string;
  soldCount: number;
}

function code(n: number): string {
  return `AO-${String(n).padStart(6, "0")}`;
}

const wanita: ProductSpec[] = [
  {
    id: "p001",
    slug: "kaos-katun-supima-crew-neck",
    name: "Kaos Katun Supima Crew Neck",
    gender: "wanita",
    category: "kaos",
    price: 149000,
    compareAtPrice: 199000,
    badge: { type: "sale", label: "-25%" },
    fit: "Regular",
    material: "100% Katun Supima",
    care: CARE_BASIC,
    description:
      "Kaos dasar dengan bahan katun supima yang lembut dan adem. Potongan regular fit membuatnya nyaman dipakai sehari-hari dan mudah dipadukan.",
    features: [
      "Katun supima premium",
      "Jahitan rapi anti melar",
      "Leher crew neck",
      "Warna tidak mudah pudar",
    ],
    colorKeys: ["hitam", "putih", "abuAbu"],
    imageCount: 6,
    tags: ["basic", "santai", "kerja"],
    rating: 4.6,
    reviewCount: 210,
    createdAt: "2026-08-02",
    soldCount: 1560,
  },
  {
    id: "p002",
    slug: "kemeja-linen-oversize",
    name: "Kemeja Linen Oversize",
    gender: "wanita",
    category: "kemeja",
    price: 329000,
    fit: "Oversize",
    material: "100% Linen",
    care: CARE_BASIC,
    description:
      "Kemeja linen dengan potongan oversize yang sejuk dan ringan untuk cuaca tropis. Cocok dipakai kerja maupun santai dengan sedikit sentuhan gaya.",
    features: [
      "Linen breathable",
      "Potongan oversize",
      "Kancing mutiara",
      "Saku depan",
    ],
    colorKeys: ["krem", "putih", "olive"],
    imageCount: 5,
    tags: ["kerja", "santai", "formal"],
    rating: 4.4,
    reviewCount: 98,
    createdAt: "2026-07-20",
    soldCount: 640,
  },
  {
    id: "p003",
    slug: "celana-chino-slim-fit-wanita",
    name: "Celana Chino Slim Fit",
    gender: "wanita",
    category: "celana",
    price: 279000,
    fit: "Slim",
    material: "98% Katun 2% Elastane",
    care: CARE_BASIC,
    description:
      "Celana chino slim fit dengan sedikit elastisitas untuk kenyamanan bergerak. Desain klasik yang cocok untuk kerja maupun acara kasual.",
    features: [
      "Sedikit stretch",
      "Slim fit",
      "Saku fungsional",
      "Pinggang nyaman",
    ],
    colorKeys: ["hitam", "krem", "navy"],
    imageCount: 5,
    tags: ["kerja", "formal", "basic"],
    rating: 4.5,
    reviewCount: 156,
    createdAt: "2026-06-11",
    soldCount: 920,
  },
  {
    id: "p004",
    slug: "jaket-bomber-water-repellent-wanita",
    name: "Jaket Bomber Water Repellent",
    gender: "wanita",
    category: "jaket",
    price: 549000,
    compareAtPrice: 649000,
    badge: { type: "new", label: "BARU" },
    fit: "Regular",
    material: "Polyester Ripstop Water Repellent",
    care: CARE_OUTER,
    description:
      "Jaket bomber ringan dengan lapisan water repellent yang melindungi dari gerimis. Desain minimalis cocok untuk aktivitas luar ruangan.",
    features: [
      "Water repellent",
      "Ringan dan ringkas",
      "Resleting YKK",
      "Saku dalam",
    ],
    colorKeys: ["hitam", "navy"],
    imageCount: 6,
    tags: ["olahraga", "hangout", "santai"],
    rating: 4.7,
    reviewCount: 76,
    createdAt: "2026-09-10",
    soldCount: 310,
  },
  {
    id: "p005",
    slug: "dress-midi-satin",
    name: "Dress Midi Satin",
    gender: "wanita",
    category: "dress",
    price: 459000,
    compareAtPrice: 549000,
    badge: { type: "sale", label: "-16%" },
    fit: "Relaxed",
    material: "95% Polyester Satin 5% Elastane",
    care: [
      "Cuci dengan tangan air dingin",
      "Jangan diperas",
      "Setrika suhu rendah dari balik kain",
      "Jangan gunakan pemutih",
    ],
    description:
      "Dress midi berbahan satin dengan jatuhan kain yang elegan. Potongan relaxed membuat siluet tetap nyaman untuk acara formal maupun santai.",
    features: [
      "Bahan satin lembut",
      "Potongan midi",
      "Resleting belakang",
      "Lapisan dalam",
    ],
    colorKeys: ["hitam", "maroon", "dustyPink"],
    imageCount: 6,
    tags: ["formal", "hangout"],
    rating: 4.5,
    reviewCount: 132,
    createdAt: "2026-08-25",
    soldCount: 430,
  },
  {
    id: "p006",
    slug: "rok-plisket",
    name: "Rok Plisket",
    gender: "wanita",
    category: "rok",
    price: 249000,
    fit: "Regular",
    material: "100% Polyester",
    care: CARE_BASIC,
    description:
      "Rok plisket dengan lipatan rapi yang memberikan gerakan dinamis saat dipakai. Panjang midi membuatnya serbaguna untuk berbagai acara.",
    features: [
      "Lipatan plisket",
      "Panjang midi",
      "Elastis di pinggang",
      "Ringan",
    ],
    colorKeys: ["hitam", "krem", "navy"],
    imageCount: 5,
    tags: ["kerja", "formal", "hangout"],
    rating: 4.3,
    reviewCount: 64,
    createdAt: "2026-05-18",
    soldCount: 280,
  },
  {
    id: "p007",
    slug: "sweater-rajut-turtleneck-wanita",
    name: "Sweater Rajut Turtleneck",
    gender: "wanita",
    category: "sweater",
    price: 399000,
    fit: "Regular",
    material: "80% Akrilik 20% Wol",
    care: CARE_KNIT,
    description:
      "Sweater rajut turtleneck yang hangat dan lembut di kulit. Cocok dipakai lapisan tunggal maupun dipadukan dengan outer saat cuaca dingin.",
    features: ["Rajutan tebal", "Leher turtleneck", "Hangat", "Tidak gatal"],
    colorKeys: ["krem", "abuAbu", "maroon"],
    imageCount: 5,
    tags: ["hangout", "santai"],
    rating: 4.6,
    reviewCount: 88,
    createdAt: "2026-04-30",
    soldCount: 510,
  },
  {
    id: "p008",
    slug: "hoodie-fleece-wanita",
    name: "Hoodie Fleece",
    gender: "wanita",
    category: "hoodie",
    price: 329000,
    fit: "Oversize",
    material: "80% Katun 20% Polyester Fleece",
    care: CARE_BASIC,
    description:
      "Hoodie fleece dengan bagian dalam yang lembut dan hangat. Potongan oversize memberikan gaya kasual yang tetap nyaman dipakai beraktivitas.",
    features: [
      "Fleece tebal",
      "Kantong depan",
      "Tali hood serut",
      "Oversize fit",
    ],
    colorKeys: ["hitam", "abuAbu", "putih"],
    imageCount: 6,
    tags: ["santai", "olahraga", "hangout"],
    rating: 4.7,
    reviewCount: 245,
    createdAt: "2026-07-05",
    soldCount: 1340,
  },
  {
    id: "p009",
    slug: "jogger-pants-wanita",
    name: "Jogger Pants",
    gender: "wanita",
    category: "celana",
    subcategory: "jogger",
    price: 259000,
    fit: "Relaxed",
    material: "95% Katun 5% Elastane",
    care: CARE_BASIC,
    description:
      "Jogger pants dengan karet di pinggang dan pergelangan kaki untuk kenyamanan maksimal. Ideal untuk olahraga ringan maupun santai di rumah.",
    features: [
      "Karet elastis",
      "Saku dengan resleting",
      "Bahan lembut",
      "Relaxed fit",
    ],
    colorKeys: ["hitam", "abuAbu", "navy"],
    imageCount: 5,
    tags: ["olahraga", "santai"],
    rating: 4.4,
    reviewCount: 112,
    createdAt: "2026-06-28",
    soldCount: 680,
  },
  {
    id: "p010",
    slug: "blazer-linen-wanita",
    name: "Blazer Linen",
    gender: "wanita",
    category: "jaket",
    subcategory: "blazer",
    price: 599000,
    compareAtPrice: 699000,
    badge: { type: "sale", label: "-14%" },
    fit: "Regular",
    material: "70% Linen 30% Rayon",
    care: CARE_BASIC,
    description:
      "Blazer berbahan campuran linen yang ringan dan jatuh dengan baik. Menambahkan kesan rapi untuk gaya kerja maupun formal kasual.",
    features: [
      "Bahan linen blend",
      "Kancing tunggal",
      "Saku depan",
      "Lapisan dalam tipis",
    ],
    colorKeys: ["hitam", "krem", "navy"],
    imageCount: 6,
    tags: ["kerja", "formal"],
    rating: 4.5,
    reviewCount: 71,
    createdAt: "2026-05-02",
    soldCount: 240,
  },
  {
    id: "p011",
    slug: "kemeja-flanel-wanita",
    name: "Kemeja Flanel",
    gender: "wanita",
    category: "kemeja",
    price: 299000,
    fit: "Regular",
    material: "100% Katun Flanel",
    care: CARE_BASIC,
    description:
      "Kemeja flanel dengan motif kotak klasik yang hangat dan nyaman. Cocok dipakai sendiri atau sebagai outer lapisan luar.",
    features: [
      "Motif kotak klasik",
      "Katun flanel tebal",
      "Kancing depan penuh",
      "Dua saku dada",
    ],
    colorKeys: ["cokelat", "abuAbu", "hitam"],
    imageCount: 5,
    tags: ["santai", "hangout"],
    rating: 4.3,
    reviewCount: 54,
    createdAt: "2026-03-15",
    soldCount: 300,
  },
  {
    id: "p012",
    slug: "kaos-polo-pique-wanita",
    name: "Kaos Polo Pique",
    gender: "wanita",
    category: "kaos",
    subcategory: "polo",
    price: 219000,
    compareAtPrice: 259000,
    fit: "Slim",
    material: "100% Katun Pique",
    care: CARE_BASIC,
    description:
      "Kaos polo berbahan pique yang bertekstur dan mudah menyerap keringat. Desain klasik dengan kerah rapi untuk gaya semi formal.",
    features: ["Katun pique", "Kerah rapi", "Slim fit", "Kancing tiga buah"],
    colorKeys: ["putih", "navy", "hitam"],
    imageCount: 5,
    tags: ["kerja", "santai"],
    rating: 4.2,
    reviewCount: 47,
    createdAt: "2026-04-08",
    soldCount: 260,
  },
  {
    id: "p013",
    slug: "cardigan-rajut-wanita",
    name: "Cardigan Rajut",
    gender: "wanita",
    category: "sweater",
    subcategory: "cardigan",
    price: 349000,
    compareAtPrice: 399000,
    fit: "Relaxed",
    material: "70% Akrilik 30% Wol",
    care: CARE_KNIT,
    description:
      "Cardigan rajut dengan kancing depan yang mudah dipadukan sebagai outer. Bahan lembut dan hangat cocok untuk gaya berlapis.",
    features: ["Rajutan lembut", "Kancing depan", "Dua saku samping", "Hangat"],
    colorKeys: ["krem", "abuAbu", "olive"],
    imageCount: 5,
    tags: ["kerja", "santai", "hangout"],
    rating: 4.4,
    reviewCount: 66,
    createdAt: "2026-02-20",
    soldCount: 320,
  },
  {
    id: "p014",
    slug: "celana-kulot-wanita",
    name: "Celana Kulot",
    gender: "wanita",
    category: "celana",
    subcategory: "kulot",
    price: 269000,
    fit: "Relaxed",
    material: "100% Katun Twill",
    care: CARE_BASIC,
    description:
      "Celana kulot dengan potongan lebar yang memberi kesan feminin dan tetap nyaman. Cocok untuk gaya kerja maupun santai akhir pekan.",
    features: [
      "Potongan lebar",
      "Pinggang elastis di belakang",
      "Saku samping",
      "Bahan twill",
    ],
    colorKeys: ["hitam", "krem", "navy"],
    imageCount: 5,
    tags: ["kerja", "santai"],
    rating: 4.3,
    reviewCount: 58,
    createdAt: "2026-06-02",
    soldCount: 290,
  },
  {
    id: "p015",
    slug: "jaket-denim-wanita",
    name: "Jaket Denim",
    gender: "wanita",
    category: "jaket",
    price: 429000,
    compareAtPrice: 499000,
    fit: "Regular",
    material: "100% Katun Denim",
    care: CARE_OUTER,
    description:
      "Jaket denim klasik dengan potongan regular yang mudah dipadukan dengan berbagai gaya. Pilihan tepat sebagai outer sehari-hari.",
    features: ["Denim tebal", "Kancing logam", "Dua saku dada", "Regular fit"],
    colorKeys: ["navy", "hitam"],
    imageCount: 5,
    tags: ["santai", "hangout"],
    rating: 4.5,
    reviewCount: 84,
    createdAt: "2026-03-28",
    soldCount: 410,
  },
  {
    id: "p016",
    slug: "kaos-crop-rib-wanita",
    name: "Kaos Crop Rib",
    gender: "wanita",
    category: "kaos",
    price: 159000,
    badge: { type: "new", label: "BARU" },
    fit: "Slim",
    material: "95% Katun 5% Spandex Rib",
    care: CARE_BASIC,
    description:
      "Kaos crop berbahan rib yang mengikuti bentuk tubuh dengan nyaman. Cocok dipadukan dengan celana high waist untuk tampilan kasual modern.",
    features: ["Bahan rib stretch", "Potongan crop", "Slim fit", "Leher bulat"],
    colorKeys: ["hitam", "putih", "abuMuda"],
    imageCount: 5,
    tags: ["santai", "hangout"],
    rating: 4.1,
    reviewCount: 39,
    createdAt: "2026-09-15",
    soldCount: 190,
  },
  {
    id: "p017",
    slug: "long-dress-rajut-wanita",
    name: "Long Dress Rajut",
    gender: "wanita",
    category: "dress",
    price: 379000,
    fit: "Relaxed",
    material: "90% Akrilik 10% Wol",
    care: CARE_KNIT,
    description:
      "Long dress berbahan rajut yang hangat dan nyaman dipakai. Potongan relaxed memberikan siluet effortless untuk gaya sehari-hari.",
    features: [
      "Rajutan hangat",
      "Potongan panjang",
      "Lengan panjang",
      "Relaxed fit",
    ],
    colorKeys: ["krem", "abuAbu", "hitam"],
    imageCount: 5,
    tags: ["santai", "hangout"],
    rating: 4.4,
    reviewCount: 45,
    createdAt: "2026-01-22",
    soldCount: 200,
  },
  {
    id: "p018",
    slug: "rok-mini-denim-wanita",
    name: "Rok Mini Denim",
    gender: "wanita",
    category: "rok",
    price: 229000,
    fit: "Slim",
    material: "98% Katun 2% Elastane Denim",
    care: CARE_BASIC,
    description:
      "Rok mini denim dengan sedikit stretch agar nyaman dipakai bergerak. Gaya kasual yang mudah dipadukan dengan kaos maupun kemeja.",
    features: ["Denim stretch", "Kancing depan", "Saku fungsional", "Slim fit"],
    colorKeys: ["navy", "hitam"],
    imageCount: 4,
    tags: ["santai", "hangout"],
    rating: 4.0,
    reviewCount: 28,
    createdAt: "2026-08-10",
    soldCount: 150,
  },
  {
    id: "p019",
    slug: "tank-top-rib-wanita",
    name: "Tank Top Rib",
    gender: "wanita",
    category: "kaos",
    subcategory: "tank top",
    price: 99000,
    fit: "Slim",
    material: "95% Katun 5% Spandex",
    care: CARE_BASIC,
    description:
      "Tank top berbahan rib yang ringan dan sejuk untuk dipakai sehari-hari. Cocok sebagai inner maupun dipakai langsung saat santai.",
    features: [
      "Bahan rib ringan",
      "Tanpa lengan",
      "Slim fit",
      "Mudah dipadukan",
    ],
    colorKeys: ["hitam", "putih", "abuMuda", "sage"],
    imageCount: 4,
    tags: ["santai", "olahraga"],
    rating: 4.2,
    reviewCount: 33,
    createdAt: "2026-07-30",
    soldCount: 220,
  },
  {
    id: "p020",
    slug: "celana-wide-leg-wanita",
    name: "Celana Wide Leg",
    gender: "wanita",
    category: "celana",
    subcategory: "wide leg",
    price: 289000,
    compareAtPrice: 339000,
    badge: { type: "sale", label: "-15%" },
    fit: "Relaxed",
    material: "100% Katun Twill",
    care: CARE_BASIC,
    description:
      "Celana wide leg dengan potongan lebar yang memberi kesan santai namun tetap rapi. Nyaman dipakai untuk kerja maupun jalan-jalan.",
    features: [
      "Potongan wide leg",
      "Pinggang tinggi",
      "Saku samping",
      "Bahan twill",
    ],
    colorKeys: ["hitam", "krem", "abuAbu"],
    imageCount: 5,
    tags: ["kerja", "santai"],
    rating: 4.5,
    reviewCount: 90,
    createdAt: "2026-05-25",
    soldCount: 480,
  },
];

const pria: ProductSpec[] = [
  {
    id: "p021",
    slug: "kaos-katun-supima-crew-neck-pria",
    name: "Kaos Katun Supima Crew Neck",
    gender: "pria",
    category: "kaos",
    price: 149000,
    fit: "Regular",
    material: "100% Katun Supima",
    care: CARE_BASIC,
    description:
      "Kaos dasar pria berbahan katun supima yang lembut dan tahan lama. Regular fit yang mudah dipadukan untuk gaya sehari-hari.",
    features: [
      "Katun supima premium",
      "Jahitan rapi",
      "Leher crew neck",
      "Tidak mudah melar",
    ],
    colorKeys: ["hitam", "putih", "abuAbu", "navy"],
    imageCount: 6,
    tags: ["basic", "santai", "kerja"],
    rating: 4.6,
    reviewCount: 260,
    createdAt: "2026-08-05",
    soldCount: 1820,
  },
  {
    id: "p022",
    slug: "kemeja-flanel-pria",
    name: "Kemeja Flanel",
    gender: "pria",
    category: "kemeja",
    price: 299000,
    fit: "Regular",
    material: "100% Katun Flanel",
    care: CARE_BASIC,
    description:
      "Kemeja flanel pria dengan motif kotak klasik yang hangat. Cocok dipakai sendiri maupun sebagai outer di cuaca dingin.",
    features: [
      "Motif kotak klasik",
      "Katun flanel tebal",
      "Dua saku dada",
      "Kancing penuh",
    ],
    colorKeys: ["cokelat", "abuAbu", "hitam", "navy"],
    imageCount: 6,
    tags: ["santai", "hangout"],
    rating: 4.5,
    reviewCount: 143,
    createdAt: "2026-06-14",
    soldCount: 760,
  },
  {
    id: "p023",
    slug: "celana-chino-slim-fit-pria",
    name: "Celana Chino Slim Fit",
    gender: "pria",
    category: "celana",
    price: 279000,
    fit: "Slim",
    material: "98% Katun 2% Elastane",
    care: CARE_BASIC,
    description:
      "Celana chino pria dengan potongan slim dan sedikit stretch. Cocok untuk kerja maupun tampil kasual di akhir pekan.",
    features: [
      "Sedikit stretch",
      "Slim fit",
      "Saku fungsional",
      "Pinggang nyaman",
    ],
    colorKeys: ["hitam", "krem", "navy", "olive"],
    imageCount: 6,
    tags: ["kerja", "formal", "basic"],
    rating: 4.6,
    reviewCount: 198,
    createdAt: "2026-05-30",
    soldCount: 1120,
  },
  {
    id: "p024",
    slug: "jaket-bomber-water-repellent-pria",
    name: "Jaket Bomber Water Repellent",
    gender: "pria",
    category: "jaket",
    price: 579000,
    compareAtPrice: 679000,
    badge: { type: "sale", label: "-15%" },
    fit: "Regular",
    material: "Polyester Ripstop Water Repellent",
    care: CARE_OUTER,
    description:
      "Jaket bomber pria dengan lapisan water repellent yang ringan dan fungsional. Cocok dipakai untuk aktivitas luar ruangan maupun harian.",
    features: [
      "Water repellent",
      "Ringan",
      "Resleting YKK",
      "Saku dalam dan luar",
    ],
    colorKeys: ["hitam", "navy", "olive"],
    imageCount: 6,
    tags: ["olahraga", "hangout"],
    rating: 4.7,
    reviewCount: 121,
    createdAt: "2026-09-02",
    soldCount: 540,
  },
  {
    id: "p025",
    slug: "hoodie-fleece-pria",
    name: "Hoodie Fleece",
    gender: "pria",
    category: "hoodie",
    price: 339000,
    badge: { type: "new", label: "BARU" },
    fit: "Oversize",
    material: "80% Katun 20% Polyester Fleece",
    care: CARE_BASIC,
    description:
      "Hoodie fleece pria dengan bagian dalam lembut dan hangat. Oversize fit memberikan gaya kasual yang santai namun tetap stylish.",
    features: [
      "Fleece tebal",
      "Kantong depan",
      "Tali hood serut",
      "Oversize fit",
    ],
    colorKeys: ["hitam", "abuAbu", "putih", "navy"],
    imageCount: 6,
    tags: ["santai", "olahraga", "hangout"],
    rating: 4.8,
    reviewCount: 312,
    createdAt: "2026-09-20",
    soldCount: 1980,
  },
  {
    id: "p026",
    slug: "jogger-pants-pria",
    name: "Jogger Pants",
    gender: "pria",
    category: "celana",
    subcategory: "jogger",
    price: 259000,
    fit: "Relaxed",
    material: "95% Katun 5% Elastane",
    care: CARE_BASIC,
    description:
      "Jogger pants pria dengan karet di pinggang dan pergelangan kaki. Nyaman dipakai untuk olahraga ringan maupun santai.",
    features: [
      "Karet elastis",
      "Saku resleting",
      "Bahan lembut",
      "Relaxed fit",
    ],
    colorKeys: ["hitam", "abuAbu", "navy"],
    imageCount: 5,
    tags: ["olahraga", "santai"],
    rating: 4.5,
    reviewCount: 176,
    createdAt: "2026-07-08",
    soldCount: 890,
  },
  {
    id: "p027",
    slug: "blazer-linen-pria",
    name: "Blazer Linen",
    gender: "pria",
    category: "jaket",
    subcategory: "blazer",
    price: 649000,
    fit: "Regular",
    material: "70% Linen 30% Rayon",
    care: CARE_BASIC,
    description:
      "Blazer pria berbahan linen blend yang ringan dan jatuh rapi. Menambah kesan formal kasual untuk kerja maupun acara khusus.",
    features: [
      "Bahan linen blend",
      "Kancing tunggal",
      "Saku depan",
      "Lapisan dalam tipis",
    ],
    colorKeys: ["hitam", "navy", "abuAbu"],
    imageCount: 6,
    tags: ["kerja", "formal"],
    rating: 4.4,
    reviewCount: 58,
    createdAt: "2026-04-12",
    soldCount: 210,
  },
  {
    id: "p028",
    slug: "kaos-polo-pique-pria",
    name: "Kaos Polo Pique",
    gender: "pria",
    category: "kaos",
    subcategory: "polo",
    price: 219000,
    fit: "Slim",
    material: "100% Katun Pique",
    care: CARE_BASIC,
    description:
      "Kaos polo pria berbahan pique yang bertekstur dan menyerap keringat. Kerah rapi cocok untuk gaya semi formal maupun santai.",
    features: ["Katun pique", "Kerah rapi", "Slim fit", "Tiga kancing"],
    colorKeys: ["putih", "navy", "hitam", "maroon"],
    imageCount: 5,
    tags: ["kerja", "santai"],
    rating: 4.3,
    reviewCount: 87,
    createdAt: "2026-03-22",
    soldCount: 470,
  },
  {
    id: "p029",
    slug: "sweater-rajut-turtleneck-pria",
    name: "Sweater Rajut Turtleneck",
    gender: "pria",
    category: "sweater",
    price: 409000,
    fit: "Regular",
    material: "80% Akrilik 20% Wol",
    care: CARE_KNIT,
    description:
      "Sweater rajut turtleneck pria yang hangat dan nyaman untuk cuaca dingin. Bisa dipakai sendiri atau dilapis dengan outer.",
    features: ["Rajutan tebal", "Leher turtleneck", "Hangat", "Tidak gatal"],
    colorKeys: ["abuAbu", "navy", "hitam"],
    imageCount: 5,
    tags: ["hangout", "santai"],
    rating: 4.5,
    reviewCount: 64,
    createdAt: "2026-02-14",
    soldCount: 300,
  },
  {
    id: "p030",
    slug: "kemeja-oxford-pria",
    name: "Kemeja Oxford",
    gender: "pria",
    category: "kemeja",
    price: 349000,
    compareAtPrice: 399000,
    badge: { type: "sale", label: "-13%" },
    fit: "Slim",
    material: "100% Katun Oxford",
    care: CARE_BASIC,
    description:
      "Kemeja oxford pria dengan bahan bertekstur khas yang rapi untuk kerja. Slim fit memberikan siluet modern dan profesional.",
    features: [
      "Katun oxford",
      "Slim fit",
      "Kerah button-down",
      "Dua saku dada",
    ],
    colorKeys: ["putih", "krem", "navy"],
    imageCount: 5,
    tags: ["kerja", "formal"],
    rating: 4.6,
    reviewCount: 132,
    createdAt: "2026-06-20",
    soldCount: 610,
  },
  {
    id: "p031",
    slug: "celana-cargo-pria",
    name: "Celana Cargo",
    gender: "pria",
    category: "celana",
    subcategory: "cargo",
    price: 309000,
    fit: "Relaxed",
    material: "100% Katun Ripstop",
    care: CARE_BASIC,
    description:
      "Celana cargo pria dengan banyak kantong fungsional. Bahan ripstop kuat cocok untuk aktivitas outdoor maupun harian.",
    features: [
      "Banyak kantong",
      "Bahan ripstop",
      "Relaxed fit",
      "Tali serut di ujung kaki",
    ],
    colorKeys: ["hitam", "olive", "cokelat"],
    imageCount: 5,
    tags: ["santai", "hangout"],
    rating: 4.3,
    reviewCount: 76,
    createdAt: "2026-05-05",
    soldCount: 340,
  },
  {
    id: "p032",
    slug: "jaket-denim-pria",
    name: "Jaket Denim",
    gender: "pria",
    category: "jaket",
    price: 449000,
    fit: "Regular",
    material: "100% Katun Denim",
    care: CARE_OUTER,
    description:
      "Jaket denim pria klasik dengan potongan regular yang tahan lama. Mudah dipadukan sebagai outer harian.",
    features: ["Denim tebal", "Kancing logam", "Dua saku dada", "Regular fit"],
    colorKeys: ["navy", "hitam"],
    imageCount: 5,
    tags: ["santai", "hangout"],
    rating: 4.4,
    reviewCount: 69,
    createdAt: "2026-03-01",
    soldCount: 380,
  },
  {
    id: "p033",
    slug: "kaos-oblong-basic-pria",
    name: "Kaos Oblong Basic",
    gender: "pria",
    category: "kaos",
    price: 119000,
    fit: "Regular",
    material: "100% Katun Combed",
    care: CARE_BASIC,
    description:
      "Kaos oblong basic pria dengan katun combed yang halus dan adem. Pilihan tepat untuk kebutuhan sehari-hari dengan harga terjangkau.",
    features: ["Katun combed 24s", "Jahitan rapi", "Leher rib", "Regular fit"],
    colorKeys: ["hitam", "putih", "abuAbu", "navy", "olive"],
    imageCount: 6,
    tags: ["basic", "santai"],
    rating: 4.4,
    reviewCount: 289,
    createdAt: "2026-07-18",
    soldCount: 2000,
  },
  {
    id: "p034",
    slug: "celana-pendek-chino-pria",
    name: "Celana Pendek Chino",
    gender: "pria",
    category: "celana",
    subcategory: "pendek",
    price: 189000,
    fit: "Regular",
    material: "100% Katun Twill",
    care: CARE_BASIC,
    description:
      "Celana pendek chino pria dengan bahan twill yang adem dan nyaman. Cocok dipakai santai maupun jalan-jalan di cuaca panas.",
    features: ["Bahan twill", "Saku samping", "Panjang selutut", "Regular fit"],
    colorKeys: ["krem", "navy", "hitam"],
    imageCount: 4,
    tags: ["santai", "olahraga"],
    rating: 4.2,
    reviewCount: 54,
    createdAt: "2026-08-18",
    soldCount: 260,
  },
  {
    id: "p035",
    slug: "sweater-rajut-half-zip-pria",
    name: "Sweater Rajut Half Zip",
    gender: "pria",
    category: "sweater",
    price: 419000,
    badge: { type: "new", label: "BARU" },
    fit: "Regular",
    material: "85% Akrilik 15% Wol",
    care: CARE_KNIT,
    description:
      "Sweater rajut half zip pria dengan detail resleting yang modern. Hangat dipakai untuk aktivitas kerja maupun santai.",
    features: [
      "Rajutan hangat",
      "Resleting setengah",
      "Kerah tinggi",
      "Regular fit",
    ],
    colorKeys: ["abuAbu", "navy", "hitam"],
    imageCount: 5,
    tags: ["kerja", "hangout"],
    rating: 4.5,
    reviewCount: 41,
    createdAt: "2026-09-24",
    soldCount: 150,
  },
  {
    id: "p036",
    slug: "jaket-parka-pria",
    name: "Jaket Parka",
    gender: "pria",
    category: "jaket",
    subcategory: "parka",
    price: 699000,
    compareAtPrice: 799000,
    badge: { type: "sale", label: "-13%" },
    fit: "Oversize",
    material: "Polyester dengan Lapisan Fleece",
    care: CARE_OUTER,
    description:
      "Jaket parka pria dengan lapisan fleece hangat di bagian dalam. Cocok dipakai saat musim hujan maupun cuaca dingin.",
    features: [
      "Lapisan fleece",
      "Hood dapat dilepas",
      "Tahan angin",
      "Oversize fit",
    ],
    colorKeys: ["hitam", "olive", "navy"],
    imageCount: 6,
    tags: ["hangout", "santai"],
    rating: 4.6,
    reviewCount: 55,
    createdAt: "2026-01-15",
    soldCount: 190,
  },
  {
    id: "p037",
    slug: "kemeja-denim-pria",
    name: "Kemeja Denim",
    gender: "pria",
    category: "kemeja",
    price: 339000,
    compareAtPrice: 379000,
    fit: "Regular",
    material: "100% Katun Denim Ringan",
    care: CARE_BASIC,
    description:
      "Kemeja denim pria berbahan ringan yang nyaman dipakai sepanjang hari. Gaya kasual yang mudah dipadukan dengan celana chino atau jeans.",
    features: ["Denim ringan", "Dua saku dada", "Kancing logam", "Regular fit"],
    colorKeys: ["navy", "abuMuda"],
    imageCount: 5,
    tags: ["santai", "hangout"],
    rating: 4.1,
    reviewCount: 37,
    createdAt: "2026-02-28",
    soldCount: 170,
  },
  {
    id: "p038",
    slug: "celana-jeans-slim-pria",
    name: "Celana Jeans Slim",
    gender: "pria",
    category: "celana",
    subcategory: "jeans",
    price: 329000,
    fit: "Slim",
    material: "99% Katun 1% Elastane Denim",
    care: CARE_BASIC,
    description:
      "Celana jeans slim pria dengan sedikit stretch untuk kenyamanan bergerak. Warna solid yang mudah dipadukan dengan atasan apa saja.",
    features: [
      "Denim stretch",
      "Slim fit",
      "Lima saku klasik",
      "Warna tahan lama",
    ],
    colorKeys: ["hitam", "navy"],
    imageCount: 5,
    tags: ["santai", "kerja"],
    rating: 4.5,
    reviewCount: 108,
    createdAt: "2026-04-25",
    soldCount: 520,
  },
  {
    id: "p039",
    slug: "kaos-lengan-panjang-pria",
    name: "Kaos Lengan Panjang",
    gender: "pria",
    category: "kaos",
    subcategory: "lengan panjang",
    price: 179000,
    fit: "Regular",
    material: "100% Katun Combed",
    care: CARE_BASIC,
    description:
      "Kaos lengan panjang pria dari katun combed yang lembut dan adem. Cocok dipakai sebagai layer dalam maupun tampil sendiri.",
    features: ["Katun combed", "Lengan panjang", "Leher rib", "Regular fit"],
    colorKeys: ["hitam", "putih", "abuAbu"],
    imageCount: 5,
    tags: ["santai", "basic"],
    rating: 4.3,
    reviewCount: 62,
    createdAt: "2026-06-08",
    soldCount: 340,
  },
  {
    id: "p040",
    slug: "rompi-quilted-pria",
    name: "Rompi Quilted",
    gender: "pria",
    category: "jaket",
    subcategory: "rompi",
    price: 389000,
    fit: "Regular",
    material: "Polyester dengan Isian Sintetis",
    care: CARE_OUTER,
    description:
      "Rompi quilted pria yang ringan dan hangat untuk lapisan luar. Praktis dipakai untuk aktivitas outdoor maupun harian.",
    features: [
      "Isian sintetis ringan",
      "Motif quilted",
      "Resleting depan",
      "Dua saku",
    ],
    colorKeys: ["hitam", "navy", "olive"],
    imageCount: 5,
    tags: ["santai", "olahraga"],
    rating: 4.2,
    reviewCount: 29,
    createdAt: "2026-01-30",
    soldCount: 130,
  },
];

const anak: ProductSpec[] = [
  {
    id: "p041",
    slug: "kaos-katun-basic-anak",
    name: "Kaos Katun Basic Anak",
    gender: "anak",
    category: "kaos",
    price: 89000,
    fit: "Regular",
    material: "100% Katun Combed",
    care: CARE_BASIC,
    description:
      "Kaos basic anak dari katun combed yang lembut dan aman untuk kulit sensitif. Nyaman dipakai bermain sepanjang hari.",
    features: [
      "Katun combed lembut",
      "Jahitan aman",
      "Leher rib",
      "Regular fit",
    ],
    colorKeys: ["putih", "hitam", "navy", "sage"],
    imageCount: 5,
    tags: ["santai", "basic"],
    rating: 4.6,
    reviewCount: 98,
    createdAt: "2026-07-12",
    soldCount: 780,
  },
  {
    id: "p042",
    slug: "kemeja-flanel-anak",
    name: "Kemeja Flanel Anak",
    gender: "anak",
    category: "kemeja",
    price: 159000,
    fit: "Regular",
    material: "100% Katun Flanel",
    care: CARE_BASIC,
    description:
      "Kemeja flanel anak dengan motif kotak yang hangat dan nyaman. Cocok dipakai untuk acara santai maupun jalan-jalan keluarga.",
    features: ["Motif kotak", "Katun flanel", "Kancing depan", "Regular fit"],
    colorKeys: ["cokelat", "abuAbu", "navy"],
    imageCount: 4,
    tags: ["santai", "hangout"],
    rating: 4.4,
    reviewCount: 42,
    createdAt: "2026-05-16",
    soldCount: 210,
  },
  {
    id: "p043",
    slug: "celana-jogger-anak",
    name: "Celana Jogger Anak",
    gender: "anak",
    category: "celana",
    subcategory: "jogger",
    price: 129000,
    fit: "Relaxed",
    material: "95% Katun 5% Elastane",
    care: CARE_BASIC,
    description:
      "Celana jogger anak dengan karet pinggang yang elastis dan nyaman. Ideal untuk bermain aktif maupun kegiatan sehari-hari.",
    features: ["Karet elastis", "Bahan lembut", "Saku samping", "Relaxed fit"],
    colorKeys: ["hitam", "abuAbu", "navy"],
    imageCount: 4,
    tags: ["olahraga", "santai"],
    rating: 4.5,
    reviewCount: 66,
    createdAt: "2026-06-22",
    soldCount: 350,
  },
  {
    id: "p044",
    slug: "jaket-hoodie-anak",
    name: "Jaket Hoodie Anak",
    gender: "anak",
    category: "jaket",
    subcategory: "hoodie",
    price: 189000,
    badge: { type: "new", label: "BARU" },
    fit: "Regular",
    material: "80% Katun 20% Polyester Fleece",
    care: CARE_BASIC,
    description:
      "Jaket hoodie anak berbahan fleece yang hangat dan ringan. Cocok dipakai saat cuaca dingin maupun aktivitas outdoor.",
    features: [
      "Fleece hangat",
      "Tali hood serut",
      "Kantong depan",
      "Regular fit",
    ],
    colorKeys: ["hitam", "abuAbu", "putih"],
    imageCount: 5,
    tags: ["santai", "hangout"],
    rating: 4.6,
    reviewCount: 74,
    createdAt: "2026-08-14",
    soldCount: 420,
  },
  {
    id: "p045",
    slug: "dress-katun-anak",
    name: "Dress Katun Anak",
    gender: "anak",
    category: "dress",
    price: 149000,
    compareAtPrice: 179000,
    badge: { type: "sale", label: "-17%" },
    fit: "Relaxed",
    material: "100% Katun",
    care: CARE_BASIC,
    description:
      "Dress katun anak dengan potongan sederhana dan nyaman dipakai bermain. Motif polos yang mudah dipadukan dengan aksesoris.",
    features: [
      "Katun lembut",
      "Potongan simpel",
      "Resleting belakang",
      "Relaxed fit",
    ],
    colorKeys: ["dustyPink", "putih", "krem"],
    imageCount: 4,
    tags: ["santai", "hangout"],
    rating: 4.3,
    reviewCount: 38,
    createdAt: "2026-04-20",
    soldCount: 190,
  },
  {
    id: "p046",
    slug: "kaos-polo-anak",
    name: "Kaos Polo Anak",
    gender: "anak",
    category: "kaos",
    subcategory: "polo",
    price: 109000,
    fit: "Regular",
    material: "100% Katun Pique",
    care: CARE_BASIC,
    description:
      "Kaos polo anak berbahan pique yang adem dan menyerap keringat. Kerah rapi cocok untuk acara semi formal anak.",
    features: ["Katun pique", "Kerah rapi", "Dua kancing", "Regular fit"],
    colorKeys: ["putih", "navy", "hitam"],
    imageCount: 4,
    tags: ["santai", "formal"],
    rating: 4.2,
    reviewCount: 27,
    createdAt: "2026-03-10",
    soldCount: 140,
  },
  {
    id: "p047",
    slug: "celana-pendek-katun-anak",
    name: "Celana Pendek Katun Anak",
    gender: "anak",
    category: "celana",
    subcategory: "pendek",
    price: 89000,
    fit: "Regular",
    material: "100% Katun Twill",
    care: CARE_BASIC,
    description:
      "Celana pendek katun anak yang ringan dan adem untuk aktivitas bermain. Pinggang elastis memudahkan anak memakainya sendiri.",
    features: [
      "Bahan twill ringan",
      "Pinggang elastis",
      "Saku samping",
      "Regular fit",
    ],
    colorKeys: ["krem", "navy", "hitam"],
    imageCount: 4,
    tags: ["santai", "olahraga"],
    rating: 4.4,
    reviewCount: 31,
    createdAt: "2026-07-26",
    soldCount: 220,
  },
  {
    id: "p048",
    slug: "sweater-rajut-anak",
    name: "Sweater Rajut Anak",
    gender: "anak",
    category: "sweater",
    price: 169000,
    fit: "Regular",
    material: "80% Akrilik 20% Wol",
    care: CARE_KNIT,
    description:
      "Sweater rajut anak yang hangat dan lembut di kulit. Cocok dipakai saat cuaca dingin atau berpergian ke tempat sejuk.",
    features: ["Rajutan lembut", "Hangat", "Tidak gatal", "Regular fit"],
    colorKeys: ["krem", "abuAbu", "dustyPink"],
    imageCount: 4,
    tags: ["hangout", "santai"],
    rating: 4.5,
    reviewCount: 24,
    createdAt: "2026-02-05",
    soldCount: 110,
  },
];

const ALL_SPECS: ProductSpec[] = [...wanita, ...pria, ...anak];

export const products: Product[] = ALL_SPECS.map((spec, index) => {
  const variants = makeVariants(
    spec.slug,
    spec.name,
    spec.colorKeys,
    index,
    spec.imageCount,
  );
  const product: Product = {
    id: spec.id,
    slug: spec.slug,
    code: code(index + 1),
    name: spec.name,
    gender: spec.gender,
    category: spec.category,
    price: spec.price,
    material: spec.material,
    care: spec.care,
    description: spec.description,
    features: spec.features,
    variants,
    rating: spec.rating,
    reviewCount: spec.reviewCount,
    tags: spec.tags,
    createdAt: spec.createdAt,
    soldCount: spec.soldCount,
  };
  if (spec.subcategory) {
    product.subcategory = spec.subcategory;
  }
  if (spec.compareAtPrice) {
    product.compareAtPrice = spec.compareAtPrice;
  }
  if (spec.badge) {
    product.badge = spec.badge;
  }
  if (spec.fit) {
    product.fit = spec.fit;
  }
  return product;
});

function findProductBySlug(slug: string): Product {
  const found = products.find((p) => p.slug === slug);
  if (!found) {
    throw new Error(`Product not found for completeTheLook: ${slug}`);
  }
  return found;
}

const completeTheLookMap: Record<string, string[]> = {
  "kaos-katun-supima-crew-neck": [
    "celana-chino-slim-fit-wanita",
    "blazer-linen-wanita",
  ],
  "kemeja-linen-oversize": ["celana-chino-slim-fit-wanita", "rok-plisket"],
  "celana-chino-slim-fit-wanita": [
    "kaos-katun-supima-crew-neck",
    "blazer-linen-wanita",
  ],
  "dress-midi-satin": ["jaket-denim-wanita"],
  "kaos-katun-supima-crew-neck-pria": [
    "celana-chino-slim-fit-pria",
    "jaket-denim-pria",
  ],
  "kemeja-oxford-pria": ["celana-chino-slim-fit-pria", "blazer-linen-pria"],
  "hoodie-fleece-pria": [
    "jogger-pants-pria",
    "jaket-bomber-water-repellent-pria",
  ],
  "kaos-katun-basic-anak": ["celana-jogger-anak"],
  "jaket-hoodie-anak": ["celana-jogger-anak", "kaos-katun-basic-anak"],
};

for (const [slug, targets] of Object.entries(completeTheLookMap)) {
  const source = findProductBySlug(slug);
  const ids = targets.map((t) => findProductBySlug(t).id);
  source.completeTheLook = ids;
}
