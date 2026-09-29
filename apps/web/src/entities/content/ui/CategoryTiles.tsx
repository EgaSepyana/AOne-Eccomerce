import Image from "next/image";
import Link from "next/link";
import { Button } from "@/shared/ui";
import type { Category } from "@/entities/category";

export function CategoryTiles({
  categories,
  gender,
}: {
  categories: Category[];
  gender: string;
}) {
  return (
    <section className="flex flex-col gap-8 px-4 lg:px-10">
      <h2 className="text-h2 text-ink lg:text-h2-lg font-bold">
        Cari Berdasarkan Kategori
      </h2>
      <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 lg:grid-cols-8">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/c/${gender}/${category.slug}`}
            className="text-ink flex flex-col gap-3"
          >
            <div className="bg-subtle relative aspect-square w-full">
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="150px"
                className="object-cover"
              />
            </div>
            <span className="text-body text-ink text-center">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
      <Link href={`/c/${gender}`}>
        <Button variant="secondary" className="w-full">
          LIHAT SEMUA KATEGORI
        </Button>
      </Link>
    </section>
  );
}
