"use client";

import { useState } from "react";
import { Icon } from "@/shared/ui";
import { useCartStore } from "../model/useCartStore";
import { useValidatePromo } from "../api/useValidatePromo";

export function PromoCodeInput({ subtotal }: { subtotal: number }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const promo = useCartStore((s) => s.promo);
  const setPromo = useCartStore((s) => s.setPromo);
  const { mutate, isPending } = useValidatePromo();

  function handleApply() {
    const code = input.trim();
    if (!code) return;
    setError(null);
    mutate(
      { code, subtotal },
      {
        onSuccess: (result) => {
          if (result.valid && result.type) {
            setPromo({
              code: code.toUpperCase(),
              type: result.type,
              amount: result.amount ?? 0,
            });
            setInput("");
          } else {
            setError(result.message);
          }
        },
      },
    );
  }

  function handleRemove() {
    setPromo(null);
    setError(null);
  }

  if (promo) {
    return (
      <div className="flex flex-col gap-2">
        <span className="text-caption text-ink font-medium">Kode promo</span>
        <div className="flex">
          <span className="border-ink text-body flex h-12 flex-1 items-center border px-3.5 font-medium">
            {promo.code}
          </span>
          <button
            type="button"
            onClick={handleRemove}
            className="border-ink text-button flex h-12 items-center border border-l-0 px-5 font-bold tracking-[0.04em] uppercase"
          >
            HAPUS
          </button>
        </div>
        <span className="text-caption text-ink flex items-center gap-1.5">
          <Icon name="check" size={16} />
          Kode promo berhasil diterapkan
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-caption text-ink font-medium">Kode promo</span>
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError(null);
          }}
          placeholder="Masukkan kode"
          className="border-border text-body focus:border-ink h-12 flex-1 border px-3.5 uppercase focus:outline-none"
        />
        <button
          type="button"
          onClick={handleApply}
          disabled={!input.trim() || isPending}
          className="border-ink text-button text-ink h-12 shrink-0 border border-l-0 px-5 font-bold tracking-[0.04em] uppercase disabled:opacity-50"
        >
          PAKAI
        </button>
      </div>
      {error && <span className="text-caption text-ink">{error}</span>}
    </div>
  );
}
