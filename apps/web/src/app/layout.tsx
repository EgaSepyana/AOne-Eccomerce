import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Aone — Fashion untuk Gaya Hidupmu",
    template: "%s · Aone",
  },
  description:
    "Aone, e-commerce fashion dengan koleksi pakaian pria, wanita, dan anak.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className={`${inter.variable} h-full antialiased`}
    >
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- Material Symbols isn't in next/font/google's curated list; root layout applies to every route. */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20,300,0,0&display=swap"
        />
      </head>
      <body className="text-ink flex min-h-full flex-col bg-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
