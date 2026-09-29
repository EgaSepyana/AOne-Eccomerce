import type { Metadata } from "next";
import { CartView } from "@/views/cart/CartView";

export const metadata: Metadata = {
  title: "Keranjang",
};

export default function CartPage() {
  return <CartView />;
}
