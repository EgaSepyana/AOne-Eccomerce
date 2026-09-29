import type { Metadata } from "next";
import { WishlistView } from "@/views/wishlist/WishlistView";

export const metadata: Metadata = {
  title: "Wishlist | Aone",
  description: "Produk-produk yang kamu simpan untuk dibeli nanti.",
};

export default function WishlistPage() {
  return <WishlistView />;
}
