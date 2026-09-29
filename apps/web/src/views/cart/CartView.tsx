"use client";

import Link from "next/link";
import {
  CartPageItem,
  CartSummary,
  FreeShippingProgress,
  useCartStore,
  useCartTotals,
} from "@/features/cart";
import { useHomeContent } from "@/entities/content";
import { WishlistProductGrid } from "@/features/wishlist";
import { Button, EmptyState } from "@/shared/ui";

export function CartView() {
  const items = useCartStore((s) => s.items);
  const { lines, subtotal, shipping, discount, total, promo, isLoading } =
    useCartTotals();
  const { data: homeContent } = useHomeContent("wanita");

  if (!isLoading && items.length === 0) {
    return (
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-4 px-4 pt-24 text-center">
        <EmptyState
          icon="shopping_bag"
          title="Keranjangmu masih kosong"
          description="Simpan produk favoritmu di sini. Gratis ongkir untuk belanja mulai Rp300.000."
          action={
            <div className="flex gap-3">
              <Link href="/">
                <Button>MULAI BELANJA</Button>
              </Link>
              <Link href="/wishlist">
                <Button variant="secondary">LIHAT WISHLIST</Button>
              </Link>
            </div>
          }
        />
        {homeContent && (
          <div className="w-full pt-12">
            <WishlistProductGrid
              title="Terlaris Minggu Ini"
              products={homeContent.bestSellers}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="pb-24">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-4 pt-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-16 lg:px-10">
        <div className="flex flex-col gap-6">
          <div className="flex items-baseline gap-3">
            <h1 className="text-h1 text-ink font-bold">Keranjang</h1>
            <span className="text-body text-muted">{items.length} produk</span>
          </div>

          <FreeShippingProgress subtotal={subtotal} />

          <div className="flex flex-col">
            {lines.map((line) => (
              <CartPageItem
                key={`${line.item.productId}-${line.item.colorId}-${line.item.size}`}
                item={line.item}
                product={line.product}
              />
            ))}
            <div className="border-border border-t" />
          </div>
        </div>

        <aside className="flex flex-col gap-5 lg:sticky lg:top-[125px]">
          <CartSummary
            itemCount={items.length}
            subtotal={subtotal}
            shipping={shipping}
            discount={discount}
            promo={promo}
            total={total}
          />
        </aside>
      </div>

      {homeContent && (
        <div className="mx-auto max-w-[1440px] px-4 pt-24 lg:px-10">
          <WishlistProductGrid
            title="Kamu mungkin juga suka"
            products={homeContent.newArrivals}
          />
        </div>
      )}
    </div>
  );
}
