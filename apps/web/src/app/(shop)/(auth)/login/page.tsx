import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthView } from "@/views/auth/AuthView";

export const metadata: Metadata = {
  title: "Masuk | Aone",
  description: "Masuk ke akun Aone kamu.",
};

export default function LoginPage() {
  return (
    <Suspense>
      <AuthView defaultTab="masuk" />
    </Suspense>
  );
}
