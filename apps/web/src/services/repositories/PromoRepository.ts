export type PromoType = "percent" | "fixed" | "free_shipping";

export interface PromoResult {
  valid: boolean;
  type?: PromoType;
  amount?: number;
  message: string;
}

export interface PromoRepository {
  validate(code: string, subtotal: number): Promise<PromoResult>;
}
