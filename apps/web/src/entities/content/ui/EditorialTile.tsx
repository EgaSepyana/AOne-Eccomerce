import Image from "next/image";
import Link from "next/link";
import type { Lookbook } from "../model/types";

export function EditorialTile({ lookbook }: { lookbook: Lookbook }) {
  return (
    <Link
      href={`/lookbook/${lookbook.slug}`}
      className="bg-subtle text-ink relative col-span-2 row-span-2 block min-h-[400px] overflow-hidden sm:min-h-[640px]"
    >
      <Image
        src={lookbook.image}
        alt={lookbook.title}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover"
      />
      <div className="from-ink/60 absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t to-transparent" />
      <div className="absolute inset-8 bottom-8 flex flex-col justify-end gap-3">
        <span className="text-small font-medium tracking-[0.08em] text-white uppercase">
          Lookbook · Edisi Terbaru
        </span>
        <span className="text-h1 font-bold text-balance text-white">
          {lookbook.title}
        </span>
        <span className="text-body font-medium text-white underline underline-offset-4">
          Lihat lookbook
        </span>
      </div>
    </Link>
  );
}
