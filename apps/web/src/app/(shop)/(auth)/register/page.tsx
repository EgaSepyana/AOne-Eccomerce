import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthView } from "@/views/auth/AuthView";

export const metadata: Metadata = {
  title: "Daftar | Aone",
  description: "Buat akun Aone baru dan mulai belanja.",
};

export default function RegisterPage() {
  return (
    <Suspense>
      <AuthView defaultTab="daftar" />
    </Suspense>
  );
}
