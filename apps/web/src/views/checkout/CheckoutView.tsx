"use client";

import { useRouter } from "next/navigation";
import {
  CheckoutStepper,
  OrderSummary,
  PaymentMethodPicker,
  ReviewStep,
  ShippingForm,
  useCheckoutStore,
} from "@/features/checkout";

export function CheckoutView() {
  const router = useRouter();
  const step = useCheckoutStore((s) => s.step);
  const setStep = useCheckoutStore((s) => s.setStep);

  return (
    <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-16 px-4 pt-10 pb-24 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-10">
      <div className="flex flex-col gap-8">
        <CheckoutStepper current={step} />

        {step === "pengiriman" && (
          <ShippingForm onContinue={() => setStep("pembayaran")} />
        )}
        {step === "pembayaran" && (
          <PaymentMethodPicker
            onContinue={() => setStep("review")}
            onBack={() => setStep("pengiriman")}
          />
        )}
        {step === "review" && (
          <ReviewStep
            onBack={() => setStep("pembayaran")}
            onSuccess={(orderId) => router.push(`/checkout/success/${orderId}`)}
          />
        )}
      </div>

      <aside className="lg:sticky lg:top-6">
        <OrderSummary />
      </aside>
    </div>
  );
}
