import Image from "next/image";
import Link from "next/link";
import type { UGCPost } from "../model/types";

export interface UGCGridProps {
  posts: UGCPost[];
  productSlugById: Record<string, string>;
}

export function UGCGrid({ posts, productSlugById }: UGCGridProps) {
  return (
    <section className="flex flex-col gap-8 px-4 lg:px-10">
      <div className="flex flex-col gap-2">
        <h2 className="text-h2 text-ink lg:text-h2-lg font-bold">
          Dari Pelanggan Kami
        </h2>
        <span className="text-body text-muted">
          Tag @aoneidwearx untuk tampil di sini
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {posts.map((post) => {
          const slug = productSlugById[post.productId];
          return (
            <Link
              key={post.id}
              href={slug ? `/p/${slug}` : "#"}
              className="bg-subtle relative aspect-square overflow-hidden"
            >
              <Image
                src={post.image}
                alt="Foto dari pelanggan Aone"
                fill
                sizes="(min-width: 640px) 16vw, 33vw"
                className="object-cover"
              />
              <span className="text-caption text-ink absolute bottom-2 left-2 bg-white/85 px-1.5 py-0.5 font-medium">
                {post.caption}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
