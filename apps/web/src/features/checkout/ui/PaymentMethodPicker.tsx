"use client";

import {
  useCities,
  useDistricts,
  useProvinces,
  useShippingOptions,
} from "../api/useRegion";
import { Button } from "@/shared/ui";
import {
  useCheckoutStore,
  type PaymentMethod,
} from "../model/useCheckoutStore";

const PAYMENT_OPTIONS: {
  method: PaymentMethod;
  label: string;
  description: string;
  logos: string[];
}[] = [
  {
    method: "virtual_account",
    label: "Virtual Account",
    description: "Dicek otomatis, tanpa konfirmasi manual",
    logos: ["BCA", "MANDIRI", "BNI", "BRI"],
  },
  {
    method: "e_wallet",
    label: "E-wallet",
    description: "GoPay, OVO, DANA, ShopeePay",
    logos: ["GOPAY", "OVO", "DANA"],
  },
  {
    method: "qris",
    label: "QRIS",
    description: "Scan dari aplikasi bank atau e-wallet mana pun",
    logos: ["QRIS"],
  },
  {
    method: "credit_card",
    label: "Kartu kredit / debit",
    description: "Visa, Mastercard, JCB",
    logos: ["VISA", "MC"],
  },
  {
    method: "installment",
    label: "Cicilan 0%",
    description: "3, 6, atau 12 bulan dengan kartu kredit & Kredivo",
    logos: ["KREDIVO"],
  },
  {
    method: "cod",
    label: "Bayar di tempat (COD)",
    description: "Bayar tunai saat paket tiba",
    logos: ["COD"],
  },
];

const BANKS = ["BCA", "Mandiri", "BNI", "BRI"];

export function PaymentMethodPicker({
  onContinue,
  onBack,
}: {
  onContinue: () => void;
  onBack: () => void;
}) {
  const paymentMethod = useCheckoutStore((s) => s.paymentMethod);
  const setPaymentMethod = useCheckoutStore((s) => s.setPaymentMethod);
  const bankCode = useCheckoutStore((s) => s.bankCode);
  const setBankCode = useCheckoutStore((s) => s.setBankCode);
  const shipping = useCheckoutStore((s) => s.shipping);
  const courierId = useCheckoutStore((s) => s.courierId);

  const { data: provinces } = useProvinces();
  const { data: cities } = useCities(shipping?.provinceId ?? "");
  const { data: districts } = useDistricts(shipping?.cityId ?? "");
  const { data: shippingOptions } = useShippingOptions(shipping?.cityId ?? "");

  const provinceName = provinces?.find(
    (p) => p.id === shipping?.provinceId,
  )?.name;
  const cityName = cities?.find((c) => c.id === shipping?.cityId)?.name;
  const districtName = districts?.find(
    (d) => d.id === shipping?.districtId,
  )?.name;
  const courier = shippingOptions?.find((s) => s.id === courierId);

  function handleContinue() {
    if (!paymentMethod) return;
    onContinue();
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="border-border flex flex-col gap-3 border p-5">
        <div className="flex items-center justify-between">
          <span className="text-h3 text-ink flex items-center gap-2 font-bold">
            ✓ Pengiriman
          </span>
          <button
            type="button"
            onClick={onBack}
            className="text-small underline underline-offset-4"
          >
            Ubah
          </button>
        </div>
        <div className="text-body grid grid-cols-[120px_minmax(0,1fr)] gap-y-2">
          <span className="text-muted">Kontak</span>
          <span>
            {shipping?.email} · {shipping?.phone}
          </span>
          <span className="text-muted">Alamat</span>
          <span>
            {shipping?.name}, {shipping?.address}, {districtName}, {cityName}{" "}
            {shipping?.postalCode}
            {provinceName ? `, ${provinceName}` : ""}
          </span>
          <span className="text-muted">Kurir</span>
          <span>
            {courier?.label} · Estimasi tiba {courier?.etaLabel} ·{" "}
            {courier?.price === 0
              ? "Gratis"
              : `Rp${courier?.price.toLocaleString("id-ID")}`}
          </span>
        </div>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-h3 text-ink font-bold">Metode pembayaran</h2>
        <div className="flex flex-col">
          {PAYMENT_OPTIONS.map((option) => {
            const selected = paymentMethod === option.method;
            return (
              <div
                key={option.method}
                className={`-mt-px flex flex-col gap-3.5 border p-4 ${
                  selected ? "border-ink z-10 border-[1.5px]" : "border-border"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setPaymentMethod(option.method)}
                  className="flex items-center gap-3.5 text-left"
                >
                  <span
                    className={`flex size-5 shrink-0 items-center justify-center rounded-full border-[1.5px] ${
                      selected ? "border-ink" : "border-border"
                    }`}
                  >
                    {selected && (
                      <span className="bg-ink size-2.5 rounded-full" />
                    )}
                  </span>
                  <div className="flex flex-1 flex-col gap-0.5">
                    <span className="text-body font-medium">
                      {option.label}
                    </span>
                    <span className="text-caption text-muted">
                      {option.description}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {option.logos.map((logo) => (
                      <span
                        key={logo}
                        className="border-border text-caption text-muted flex h-6 items-center border px-1.5 font-bold"
                      >
                        {logo}
                      </span>
                    ))}
                  </div>
                </button>
                {selected && option.method === "virtual_account" && (
                  <div className="grid grid-cols-2 gap-2 pl-9 sm:grid-cols-4">
                    {BANKS.map((bank) => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setBankCode(bank)}
                        className={`text-small flex h-11 items-center justify-center border font-bold ${
                          bankCode === bank
                            ? "border-ink bg-ink text-white"
                            : "border-border text-ink"
                        }`}
                      >
                        {bank}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <Button
        onClick={handleContinue}
        disabled={
          !paymentMethod || (paymentMethod === "virtual_account" && !bankCode)
        }
      >
        LANJUT KE REVIEW
      </Button>
    </div>
  );
}
