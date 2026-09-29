import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductCached } from "@/entities/product";
import { repositories } from "@/services";
import { PdpView } from "@/views/pdp/PdpView";

export async function generateStaticParams() {
  const { items } = await repositories.product.list({ pageSize: 9999 });
  return items.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductCached(slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.description,
  };
}

export default async function PdpPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductCached(slug);
  if (!product) notFound();

  return <PdpView product={product} />;
}
