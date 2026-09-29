import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Gender } from "@/entities/product";
import { PlpView } from "@/views/plp/PlpView";

const GENDERS: Gender[] = ["wanita", "pria", "anak"];
const GENDER_LABEL: Record<Gender, string> = {
  wanita: "Wanita",
  pria: "Pria",
  anak: "Anak",
};

function parseGender(value: string): Gender | null {
  return GENDERS.includes(value as Gender) ? (value as Gender) : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ gender: string; category?: string[] }>;
}): Promise<Metadata> {
  const { gender, category } = await params;
  const parsedGender = parseGender(gender);
  if (!parsedGender) return {};

  const categoryLabel = category?.[0];
  const title = categoryLabel
    ? `${categoryLabel} ${GENDER_LABEL[parsedGender]}`
    : `Pakaian ${GENDER_LABEL[parsedGender]}`;

  return { title };
}

export default async function PlpPage({
  params,
}: {
  params: Promise<{ gender: string; category?: string[] }>;
}) {
  const { gender, category } = await params;
  const parsedGender = parseGender(gender);
  if (!parsedGender) notFound();

  return <PlpView gender={parsedGender} category={category?.[0]} />;
}
