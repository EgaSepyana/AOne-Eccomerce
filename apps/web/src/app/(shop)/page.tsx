import type { Metadata } from "next";
import type { Gender } from "@/entities/product";
import { HomeView } from "@/views/home/HomeView";

export const metadata: Metadata = {
  title: "Aone — Fashion untuk Gaya Hidupmu",
};

function parseGender(value: string | string[] | undefined): Gender {
  if (value === "pria" || value === "anak") return value;
  return "wanita";
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ g?: string }>;
}) {
  const params = await searchParams;
  const gender = parseGender(params.g);

  return <HomeView gender={gender} />;
}
