import Image from "next/image";
import Link from "next/link";
import { Button } from "@/shared/ui";
import type { Lookbook } from "../model/types";

export function LookbookBanner({ lookbook }: { lookbook: Lookbook }) {
  return (
    <section className="bg-subtle relative mx-auto aspect-[21/9] min-h-[360px] w-full max-w-[1440px] overflow-hidden sm:min-h-[560px]">
      <Image
        src={lookbook.image}
        alt={lookbook.title}
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="from-ink/70 absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6 sm:left-10 sm:max-w-[520px] sm:p-0 sm:pb-14">
        <span className="text-[12px] font-medium tracking-[0.08em] text-white uppercase">
          LOOKBOOK · EDISI TERBARU
        </span>
        <h2 className="text-[28px] leading-[34px] font-bold text-balance text-white md:text-[56px] md:leading-[62px]">
          {lookbook.title}
        </h2>
        {lookbook.description && (
          <p className="max-w-[420px] text-[16px] leading-6 text-white">
            {lookbook.description}
          </p>
        )}
        <Link href={`/lookbook/${lookbook.slug}`} className="mt-2 self-start">
          <Button className="bg-ink hover:bg-ink-hover h-12 px-8 text-white">
            LIHAT LOOKBOOK
          </Button>
        </Link>
      </div>
    </section>
  );
}
