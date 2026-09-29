import Image from "next/image";
import Link from "next/link";
import { ToastViewport, Icon } from "@/shared/ui";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-border border-b">
        <header className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 lg:px-10">
          <Link href="/" className="text-ink flex items-center gap-2.5">
            <Image
              src="/brand/logo-black.png"
              alt="Aone"
              width={28}
              height={28}
              className="h-7 w-auto"
            />
            <span className="text-h3 font-bold tracking-[0.14em]">AONE</span>
          </Link>
          <span className="text-body flex items-center gap-1.5 font-medium">
            <Icon name="lock" size={20} />
            Checkout Aman
          </span>
        </header>
      </div>
      <main className="flex-1">{children}</main>
      <ToastViewport />
    </div>
  );
}
