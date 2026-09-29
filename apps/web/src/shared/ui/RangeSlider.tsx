"use client";

import { formatRupiah } from "@/shared/lib/format";

export interface RangeSliderProps {
  min: number;
  max: number;
  step?: number;
  valueMin: number;
  valueMax: number;
  onChange: (valueMin: number, valueMax: number) => void;
}

export function RangeSlider({
  min,
  max,
  step = 10000,
  valueMin,
  valueMax,
  onChange,
}: RangeSliderProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative h-5">
        <span className="bg-border absolute inset-x-0 top-2 h-0.5" />
        <span
          className="bg-ink absolute top-2 h-0.5"
          style={{
            left: `${((valueMin - min) / (max - min)) * 100}%`,
            right: `${100 - ((valueMax - min) / (max - min)) * 100}%`,
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMin}
          aria-label="Harga minimum"
          onChange={(e) =>
            onChange(
              Math.min(Number(e.target.value), valueMax - step),
              valueMax,
            )
          }
          className="[&::-webkit-slider-thumb]:border-ink pointer-events-none absolute inset-0 h-5 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[1.5px] [&::-webkit-slider-thumb]:bg-white"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMax}
          aria-label="Harga maksimum"
          onChange={(e) =>
            onChange(
              valueMin,
              Math.max(Number(e.target.value), valueMin + step),
            )
          }
          className="[&::-webkit-slider-thumb]:border-ink pointer-events-none absolute inset-0 h-5 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[1.5px] [&::-webkit-slider-thumb]:bg-white"
        />
      </div>
      <div className="tabular flex items-center gap-2">
        <span className="border-border text-small flex h-10 min-w-0 flex-1 items-center border px-2.5">
          {formatRupiah(valueMin)}
        </span>
        <span className="text-muted shrink-0">–</span>
        <span className="border-border text-small flex h-10 min-w-0 flex-1 items-center border px-2.5">
          {formatRupiah(valueMax)}
        </span>
      </div>
    </div>
  );
}
