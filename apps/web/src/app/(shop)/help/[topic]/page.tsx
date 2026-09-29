import type { Metadata } from "next";
import { HelpView } from "@/views/help/HelpView";

interface Props {
  params: Promise<{ topic: string }>;
}

const TOPIC_TITLES: Record<string, string> = {
  ukuran: "Panduan Ukuran",
  pengiriman: "Pengiriman",
  pengembalian: "Pengembalian & Tukar",
  faq: "FAQ",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic } = await params;
  const title = TOPIC_TITLES[topic] ?? "Bantuan";
  return {
    title: `${title} | Aone`,
    description: `Informasi ${title.toLowerCase()} dari Aone.`,
  };
}

export default async function HelpPage({ params }: Props) {
  const { topic } = await params;
  return <HelpView topic={topic} />;
}
