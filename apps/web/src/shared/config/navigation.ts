import type { Gender } from "@/shared/types";

export interface NavGenderItem {
  gender: Gender;
  label: string;
  href: string;
}

export const NAV_GENDERS: NavGenderItem[] = [
  { gender: "wanita", label: "Wanita", href: "/c/wanita" },
  { gender: "pria", label: "Pria", href: "/c/pria" },
  { gender: "anak", label: "Anak", href: "/c/anak" },
];

export const FOOTER_LINKS = {
  bantuan: [
    { label: "Status pesanan", href: "/account" },
    { label: "Pengiriman", href: "/help/pengiriman" },
    { label: "Tukar & retur", href: "/help/retur" },
    { label: "Panduan ukuran", href: "/help/ukuran" },
    { label: "CS WhatsApp", href: "/help/faq" },
  ],
  tentangKami: [
    { label: "Cerita Aone", href: "/help/tentang" },
    { label: "Toko offline", href: "/help/toko" },
    { label: "Karier", href: "/help/karir" },
    { label: "Keberlanjutan", href: "/help/tentang" },
  ],
  akun: [
    { label: "Masuk / Daftar", href: "/login" },
    { label: "Pesanan saya", href: "/account" },
    { label: "Wishlist", href: "/wishlist" },
    { label: "Alamat", href: "/account" },
  ],
  ikutiKami: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "TikTok", href: "https://tiktok.com" },
    { label: "YouTube", href: "https://youtube.com" },
    { label: "Pinterest", href: "https://pinterest.com" },
  ],
} as const;

export const FOOTER_PAYMENTS = [
  "BCA",
  "Mandiri",
  "BNI",
  "BRI",
  "QRIS",
  "GoPay",
  "OVO",
  "DANA",
  "ShopeePay",
  "Visa",
  "Mastercard",
  "COD",
  "JNE",
  "J&T",
  "SiCepat",
] as const;
