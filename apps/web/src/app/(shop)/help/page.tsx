import type { Metadata } from "next";
import { HelpView } from "@/views/help/HelpView";

export const metadata: Metadata = {
  title: "Pusat Bantuan | Aone",
  description:
    "Ada yang bisa kami bantu? Temukan jawaban seputar pesanan, pengiriman, dan penukaran produk Aone.",
};

export default function HelpRootPage() {
  return <HelpView topic="pengembalian" />;
}
