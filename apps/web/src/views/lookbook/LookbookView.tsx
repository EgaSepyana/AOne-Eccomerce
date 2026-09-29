"use client";

import Image from "next/image";
import Link from "next/link";
import { useLookbook } from "@/entities/content";
import { useProductsByIds } from "@/entities/product";
import { WishlistProductCard } from "@/features/wishlist";
import { Breadcrumb, Button, EmptyState, Skeleton } from "@/shared/ui";

function LookbookProducts({ productIds }: { productIds: string[] }) {
  const { products, isLoading } = useProductsByIds(productIds);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: productIds.length || 4 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[3/4] w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <WishlistProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export function LookbookView({ slug }: { slug: string }) {
  const { data: lookbook, isLoading } = useLookbook(slug);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-10 lg:px-10">
        <Skeleton className="mb-6 h-6 w-48" />
        <Skeleton className="aspect-[21/9] w-full" />
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!lookbook) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-16 lg:px-10">
        <EmptyState
          icon="photo_album"
          title="Lookbook tidak ditemukan"
          description="Lookbook ini tidak ada atau telah diarsipkan."
          action={
            <Link href="/">
              <Button>KEMBALI KE BERANDA</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Cover Image */}
      <div className="bg-subtle relative aspect-[21/9] w-full">
        <Image
          src={lookbook.image}
          alt={lookbook.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-8 sm:p-12">
          <div className="text-white">
            <p className="text-small font-bold tracking-widest uppercase opacity-70">
              Lookbook
            </p>
            <h1 className="text-h1 lg:text-display-lg mt-1 font-bold">
              {lookbook.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 py-10 lg:px-10">
        <Breadcrumb
          items={[
            { label: "Beranda", href: "/" },
            { label: "Lookbook" },
            { label: lookbook.title },
          ]}
          className="mb-8"
        />

        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-h2 text-ink font-bold">Produk dalam Lookbook</h2>
          <span className="text-body text-muted">
            {lookbook.productIds.length} produk
          </span>
        </div>

        <LookbookProducts productIds={lookbook.productIds} />

        <div className="mt-12 flex justify-center">
          <Link href="/">
            <Button variant="secondary">JELAJAHI SEMUA PRODUK</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
