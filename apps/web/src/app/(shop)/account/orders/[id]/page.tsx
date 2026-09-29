import type { Metadata } from "next";
import { OrderDetailView } from "@/views/account/OrderDetailView";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Pesanan ${id} | Aone`,
  };
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  return <OrderDetailView orderId={id} />;
}
