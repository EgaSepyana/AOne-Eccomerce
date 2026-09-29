import type { Metadata } from "next";
import { AccountView } from "@/views/account/AccountView";

export const metadata: Metadata = {
  title: "Akun Saya | Aone",
  description: "Kelola profil, pesanan, dan alamat pengirimanmu.",
};

export default function AccountPage() {
  return <AccountView />;
}
