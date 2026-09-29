"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/shared/ui";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error tracking service (nanti)
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-[1440px] flex-col items-center justify-center px-4 py-24 text-center lg:px-10">
      <p className="text-display text-border font-bold">!</p>
      <h1 className="text-h1 text-ink mt-4 font-bold">Terjadi Kesalahan</h1>
      <p className="text-body text-muted mt-3 max-w-md">
        Maaf, ada yang tidak beres. Coba muat ulang halaman ini, atau kembali ke
        beranda.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>COBA LAGI</Button>
        <Link href="/">
          <Button variant="secondary">KE BERANDA</Button>
        </Link>
      </div>
    </main>
  );
}
