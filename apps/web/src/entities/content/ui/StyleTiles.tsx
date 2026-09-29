import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/shared/ui";
import type { StyleTile } from "../model/types";

export function StyleTiles({ tiles }: { tiles: StyleTile[] }) {
  return (
    <section className="flex flex-col gap-8 px-4 lg:px-10">
      <h2 className="text-h2 text-ink lg:text-h2-lg font-bold">
        Belanja Berdasarkan Gaya
      </h2>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {tiles.map((tile) => (
          <Link
            key={tile.id}
            href={tile.href}
            className="text-ink flex flex-col gap-3"
          >
            <div className="bg-subtle relative aspect-[3/4]">
              <Image
                src={tile.image}
                alt={tile.title}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-h3 lg:text-h3-lg font-bold">
                {tile.title}
              </span>
              <Icon name="arrow_forward" size={22} />
            </div>
            <span className="text-body text-muted">{tile.description}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
