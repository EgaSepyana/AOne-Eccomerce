"use client";

import { useState } from "react";
import { Button, Drawer, Input, Radio } from "@/shared/ui";
import { recommendSize, type FitPreference } from "../model/recommend";

export interface SizeFinderDrawerProps {
  open: boolean;
  onClose: () => void;
  availableSizes: string[];
  onSelectSize: (size: string) => void;
}

export function SizeFinderDrawer({
  open,
  onClose,
  availableSizes,
  onSelectSize,
}: SizeFinderDrawerProps) {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [preference, setPreference] = useState<FitPreference>("regular");
  const [result, setResult] = useState<string | null>(null);

  const canSubmit = Number(height) > 0 && Number(weight) > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setResult(recommendSize(Number(height), Number(weight), preference));
  }

  function handleSelect(size: string) {
    onSelectSize(size);
    onClose();
  }

  return (
    <Drawer open={open} onClose={onClose} side="right" title="Cari Ukuranmu">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-4">
        <Input
          label="Tinggi badan (cm)"
          type="number"
          placeholder="Contoh: 165"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
        <Input
          label="Berat badan (kg)"
          type="number"
          placeholder="Contoh: 55"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        <div className="flex flex-col gap-3">
          <span className="text-caption text-ink font-medium">
            Preferensi fit
          </span>
          <div className="flex flex-col gap-2">
            <Radio
              name="preference"
              label="Pas di badan"
              checked={preference === "pas"}
              onChange={() => setPreference("pas")}
            />
            <Radio
              name="preference"
              label="Regular"
              checked={preference === "regular"}
              onChange={() => setPreference("regular")}
            />
            <Radio
              name="preference"
              label="Longgar"
              checked={preference === "longgar"}
              onChange={() => setPreference("longgar")}
            />
          </div>
        </div>
        <Button type="submit" disabled={!canSubmit}>
          LIHAT REKOMENDASI
        </Button>

        {result && (
          <div className="border-border flex flex-col gap-3 border-t pt-6">
            <p className="text-body text-ink">
              Rekomendasi ukuran: <span className="font-bold">{result}</span>
            </p>
            {availableSizes.includes(result) ? (
              <Button
                type="button"
                variant="secondary"
                onClick={() => handleSelect(result)}
              >
                PILIH {result}
              </Button>
            ) : (
              <p className="text-caption text-muted">
                Ukuran {result} sedang tidak tersedia untuk produk ini.
              </p>
            )}
          </div>
        )}
      </form>
    </Drawer>
  );
}
