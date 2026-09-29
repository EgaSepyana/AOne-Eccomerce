import { sleep } from "@/shared/lib/sleep";
import type {
  PromoRepository,
  PromoResult,
} from "../repositories/PromoRepository";
import { PROMO_CODES } from "./data/promo";

export class MockPromoRepository implements PromoRepository {
  constructor(private readonly options: { latency: number }) {}

  async validate(code: string, subtotal: number): Promise<PromoResult> {
    if (this.options.latency > 0) await sleep(this.options.latency);

    const promo = PROMO_CODES[code.toUpperCase()];
    if (!promo) {
      return { valid: false, message: "Kode tidak valid" };
    }
    if (promo.minSubtotal && subtotal < promo.minSubtotal) {
      return {
        valid: false,
        message: `Minimal belanja Rp${promo.minSubtotal.toLocaleString("id-ID")} untuk kode ini`,
      };
    }

    return {
      valid: true,
      type: promo.type,
      amount: promo.amount,
      message: promo.message,
    };
  }
}
