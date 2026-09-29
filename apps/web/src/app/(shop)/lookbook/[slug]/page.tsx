import type { Metadata } from "next";
import { LookbookView } from "@/views/lookbook/LookbookView";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return {
    title: `${title} | Lookbook Aone`,
    description: `Inspirasi gaya dari koleksi lookbook Aone: ${title}.`,
  };
}

export default async function LookbookPage({ params }: Props) {
  const { slug } = await params;
  return <LookbookView slug={slug} />;
}
