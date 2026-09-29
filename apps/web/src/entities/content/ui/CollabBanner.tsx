import Image from "next/image";
import Link from "next/link";
import { Button } from "@/shared/ui";
import type { CampaignBanner } from "../model/types";

export function CollabBanner({ banner }: { banner: CampaignBanner }) {
  return (
    <section className="bg-subtle grid grid-cols-1 sm:grid-cols-2">
      <div className="bg-border relative aspect-[4/5]">
        <Image
          src={banner.imageMobile}
          alt={banner.headline}
          fill
          sizes="(min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col justify-end gap-4 p-8 sm:p-16">
        <span className="text-ink text-[12px] font-medium tracking-[0.08em] uppercase">
          KOLABORASI TERBATAS
        </span>
        <h2 className="text-ink text-[28px] leading-[34px] font-bold text-balance md:text-[56px] md:leading-[62px]">
          {banner.headline}
        </h2>
        <p className="text-ink max-w-[420px] text-[16px] leading-6">
          {banner.subheadline}
        </p>
        <Link href={banner.ctaHref} className="mt-2 self-start">
          <Button
            variant="secondary"
            className="border-ink text-ink h-12 border px-8 text-[14px] font-bold tracking-[0.04em]"
          >
            {banner.ctaLabel}
          </Button>
        </Link>
      </div>
    </section>
  );
}
