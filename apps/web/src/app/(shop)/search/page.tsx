import type { Metadata } from "next";
import { PlpView } from "@/views/plp/PlpView";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q } = await searchParams;
  return { title: q ? `Hasil untuk "${q}"` : "Pencarian" };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  return <PlpView q={q ?? ""} />;
}
