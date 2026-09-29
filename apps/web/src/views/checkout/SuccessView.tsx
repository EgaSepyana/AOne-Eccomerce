"use client";

import Link from "next/link";
import { useOrder } from "@/entities/order";
import { formatRupiah } from "@/shared/lib/format";
import { Button, Icon, Skeleton } from "@/shared/ui";

const PAYMENT_INSTRUCTIONS: Record<string, string> = {
  "Virtual Account":
    "Selesaikan pembayaran melalui ATM, mobile banking, atau internet banking sebelum batas waktu.",
  "E-wallet":
    "Buka aplikasi e-wallet kamu dan selesaikan pembayaran yang tertera.",
  QRIS: "Pindai kode QRIS dari aplikasi bank atau e-wallet mana pun untuk membayar.",
  "Kartu Kredit/Debit":
    "Pembayaran kartu kamu sedang diproses oleh bank penerbit.",
  "Cicilan 0%":
    "Cicilan kamu sedang diproses. Cek email untuk detail lebih lanjut.",
  "Bayar di Tempat (COD)":
    "Siapkan uang tunai sesuai total pesanan saat paket tiba.",
};

export function SuccessView({ orderId }: { orderId: string }) {
  const { data: order, isLoading } = useOrder(orderId);

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-[640px] flex-col gap-6 px-4 py-24">
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto flex max-w-[640px] flex-col items-center gap-4 px-4 py-24 text-center">
        <h1 className="text-h1 text-ink font-bold">Pesanan tidak ditemukan</h1>
        <Link href="/">
          <Button>KEMBALI KE BERANDA</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-[640px] flex-col items-center gap-8 px-4 py-16 text-center">
      <span className="bg-subtle flex size-16 items-center justify-center rounded-full">
        <Icon name="check_circle" size={40} />
      </span>
      <div className="flex flex-col gap-2">
        <h1 className="text-h1 text-ink font-bold">Pesanan Berhasil Dibuat</h1>
        <p className="text-body text-muted">Nomor pesanan kamu</p>
        <p className="tabular text-h2 text-ink font-bold">{order.id}</p>
      </div>

      <div className="bg-subtle flex w-full flex-col gap-2 p-5 text-left">
        <span className="text-body text-ink font-bold">
          Instruksi Pembayaran
        </span>
        <p className="text-body text-muted">
          {PAYMENT_INSTRUCTIONS[order.payment] ??
            "Ikuti instruksi pembayaran yang diberikan."}
        </p>
      </div>

      <div className="border-border flex w-full flex-col gap-3 border p-5 text-left">
        {order.items.map((item) => (
          <div
            key={`${item.productId}-${item.colorId}-${item.size}`}
            className="text-body flex justify-between"
          >
            <span>
              {item.name} × {item.qty}
            </span>
            <span className="tabular font-medium">
              {formatRupiah(item.price * item.qty)}
            </span>
          </div>
        ))}
        <div className="border-border text-body flex justify-between border-t pt-3 font-bold">
          <span>Total</span>
          <span className="tabular">{formatRupiah(order.total)}</span>
        </div>
      </div>

      <div className="flex w-full gap-3">
        <Link href="/" className="flex-1">
          <Button variant="secondary" className="w-full">
            LANJUT BELANJA
          </Button>
        </Link>
        <Link href="/account" className="flex-1">
          <Button className="w-full">LIHAT PESANAN</Button>
        </Link>
      </div>
    </div>
  );
}
