"use client";

import Link from "next/link";
import { useUIStore } from "@/shared/model/useUIStore";
import { useCartStore } from "../model/useCartStore";
import { useCartProducts } from "../api/useCartProducts";
import { Button, Drawer, EmptyState } from "@/shared/ui";
import { CartLineItem } from "./CartLineItem";
import { FreeShippingProgress } from "./FreeShippingProgress";

export function CartDrawer() {
  const open = useUIStore((s) => s.cartDrawerOpen);
  const setOpen = useUIStore((s) => s.setCartDrawerOpen);
  const items = useCartStore((s) => s.items);
  const { lines, subtotal } = useCartProducts(items);

  return (
    <Drawer
      open={open}
      onClose={() => setOpen(false)}
      side="right"
      title="Keranjang"
    >
      {items.length === 0 ? (
        <EmptyState
          icon="shopping_bag"
          title="Keranjangmu masih kosong"
          description="Yuk mulai belanja koleksi terbaru Aone"
          action={
            <Link href="/">
              <Button onClick={() => setOpen(false)}>MULAI BELANJA</Button>
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col gap-4 p-4">
          <FreeShippingProgress subtotal={subtotal} />

          <div className="divide-border flex flex-col divide-y">
            {lines.map((line) => (
              <CartLineItem
                key={`${line.item.productId}-${line.item.colorId}-${line.item.size}`}
                item={line.item}
                product={line.product}
              />
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <Link href="/cart" onClick={() => setOpen(false)}>
              <Button variant="secondary" className="w-full">
                LIHAT KERANJANG
              </Button>
            </Link>
            <Link href="/checkout" onClick={() => setOpen(false)}>
              <Button className="w-full">CHECKOUT</Button>
            </Link>
          </div>
        </div>
      )}
    </Drawer>
  );
}
