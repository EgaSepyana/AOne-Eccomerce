import type { Metadata } from "next";
import { SuccessView } from "@/views/checkout/SuccessView";

export const metadata: Metadata = {
  title: "Pesanan Berhasil",
};

export default async function CheckoutSuccessPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  return <SuccessView orderId={orderId} />;
}
