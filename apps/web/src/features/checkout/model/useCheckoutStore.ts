import { create } from "zustand";
import type { Address } from "@/entities/order";

export type CheckoutStep = "pengiriman" | "pembayaran" | "review";

export interface ShippingFormValues {
  email: string;
  name: string;
  phone: string;
  address: string;
  provinceId: string;
  cityId: string;
  districtId: string;
  postalCode: string;
}

export type PaymentMethod =
  | "virtual_account"
  | "e_wallet"
  | "qris"
  | "credit_card"
  | "installment"
  | "cod";

interface CheckoutState {
  step: CheckoutStep;
  shipping: ShippingFormValues | null;
  courierId: string | null;
  paymentMethod: PaymentMethod | null;
  bankCode: string | null;
  setStep: (step: CheckoutStep) => void;
  setShipping: (values: ShippingFormValues) => void;
  setCourierId: (id: string) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setBankCode: (code: string) => void;
  toAddress: () => Address | null;
  reset: () => void;
}

export const useCheckoutStore = create<CheckoutState>((set, get) => ({
  step: "pengiriman",
  shipping: null,
  courierId: null,
  paymentMethod: null,
  bankCode: null,
  setStep: (step) => set({ step }),
  setShipping: (values) => set({ shipping: values }),
  setCourierId: (id) => set({ courierId: id }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  setBankCode: (code) => set({ bankCode: code }),
  toAddress: () => {
    const { shipping } = get();
    if (!shipping) return null;
    return {
      name: shipping.name,
      phone: shipping.phone,
      province: shipping.provinceId,
      city: shipping.cityId,
      district: shipping.districtId,
      postalCode: shipping.postalCode,
      detail: shipping.address,
    };
  },
  reset: () =>
    set({
      step: "pengiriman",
      shipping: null,
      courierId: null,
      paymentMethod: null,
      bankCode: null,
    }),
}));
