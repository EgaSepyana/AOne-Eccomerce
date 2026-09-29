import Image from "next/image";
import Link from "next/link";
import { FOOTER_LINKS, FOOTER_PAYMENTS } from "@/shared/config/navigation";
import { NewsletterForm } from "@/features/newsletter";

const COLUMNS: {
  title: string;
  links: readonly { label: string; href: string }[];
}[] = [
  { title: "BANTUAN", links: FOOTER_LINKS.bantuan },
  { title: "TENTANG KAMI", links: FOOTER_LINKS.tentangKami },
  { title: "AKUN", links: FOOTER_LINKS.akun },
  { title: "IKUTI KAMI", links: FOOTER_LINKS.ikutiKami },
];

export function Footer() {
  return (
    <footer className="bg-ink mt-auto text-white">
      <div className="mx-auto max-w-[1440px] px-4 pt-12 pb-8 lg:px-10 lg:pt-16">
        <div className="border-ink-hover grid grid-cols-1 gap-10 border-b pb-8 sm:grid-cols-2 lg:grid-cols-[1.3fr_repeat(4,1fr)] lg:gap-10 lg:pb-12">
          <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <Image
                src="/brand/logo-white.png"
                alt="Aone"
                width={28}
                height={28}
                className="h-7 w-auto"
              />
              <span className="text-h3 font-bold tracking-[0.14em]">AONE</span>
            </div>
            <p className="text-body max-w-[320px] font-bold">
              Dapatkan diskon 10% untuk pembelian pertama
            </p>
            <NewsletterForm />
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title} className="flex flex-col gap-3.5">
              <h3 className="text-small font-bold tracking-[0.04em]">
                {col.title}
              </h3>
              {col.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-body text-disabled hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-6 pt-8">
          <div className="flex flex-wrap gap-2">
            {FOOTER_PAYMENTS.map((pay) => (
              <span
                key={pay}
                className="border-ink-hover text-caption text-disabled flex h-7 items-center border px-2.5 font-medium"
              >
                {pay}
              </span>
            ))}
          </div>
          <p className="text-small text-disabled">
            © {new Date().getFullYear()} Aone. Semua hak dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
