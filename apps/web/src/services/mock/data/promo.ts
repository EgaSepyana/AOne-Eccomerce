import type { PromoType } from "@/services/repositories/PromoRepository";

export interface PromoCode {
  code: string;
  type: PromoType;
  amount: number;
  message: string;
  minSubtotal?: number;
}

export const PROMO_CODES: Record<string, PromoCode> = {
  AONE10: {
    code: "AONE10",
    type: "percent",
    amount: 10,
    message: "Diskon 10% berhasil diterapkan",
    minSubtotal: 150000,
  },
  ONGKIRFREE: {
    code: "ONGKIRFREE",
    type: "free_shipping",
    amount: 0,
    message: "Gratis ongkir berhasil diterapkan",
    minSubtotal: 300000,
  },
};
