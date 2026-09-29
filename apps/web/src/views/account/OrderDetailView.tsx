"use client";

import Link from "next/link";
import { useOrder, type OrderStatus } from "@/entities/order";
import { formatRupiah } from "@/shared/lib/format";
import {
  Breadcrumb,
  Button,
  Divider,
  EmptyState,
  Icon,
  Skeleton,
} from "@/shared/ui";

const STATUS_STEPS: { status: OrderStatus; label: string; icon: string }[] = [
  {
    status: "menunggu_pembayaran",
    label: "Menunggu Pembayaran",
    icon: "pending",
  },
  { status: "dibayar", label: "Dibayar", icon: "check_circle" },
  { status: "dikemas", label: "Dikemas", icon: "inventory_2" },
  { status: "dikirim", label: "Dikirim", icon: "local_shipping" },
  { status: "selesai", label: "Selesai", icon: "task_alt" },
];

const STATUS_ORDER: Record<OrderStatus, number> = {
  menunggu_pembayaran: 0,
  dibayar: 1,
  dikemas: 2,
  dikirim: 3,
  selesai: 4,
};

const COURIER_LABEL: Record<string, string> = {
  reguler: "Kurir Reguler (2–4 hari)",
  express: "Kurir Express (1–2 hari)",
  instan: "Kurir Instan (hari ini)",
};

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

export function OrderDetailView({ orderId }: { orderId: string }) {
  const { data: order, isLoading } = useOrder(orderId);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[800px] px-4 py-10">
        <Skeleton className="mb-6 h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-[800px] px-4 py-16">
        <EmptyState
          icon="receipt_long"
          title="Pesanan tidak ditemukan"
          description="Pesanan ini tidak ada atau telah dihapus."
          action={
            <Link href="/account">
              <Button>KEMBALI KE AKUN</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const currentStatusIndex = STATUS_ORDER[order.status];
  const createdDate = new Date(order.createdAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="mx-auto max-w-[800px] px-4 py-10 pb-24 lg:px-0">
      <Breadcrumb
        items={[
          { label: "Akun", href: "/account" },
          { label: "Pesanan Saya", href: "/account" },
          { label: order.id },
        ]}
        className="mb-6"
      />

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-h2 text-ink font-bold">{order.id}</h1>
          <p className="text-small text-muted">Dipesan pada {createdDate}</p>
        </div>
      </div>

      {/* Timeline Status */}
      <div className="bg-subtle mt-8 p-5">
        <h2 className="text-small text-muted mb-5 font-bold tracking-wide uppercase">
          Status Pesanan
        </h2>
        <ol className="flex flex-col gap-0">
          {STATUS_STEPS.map((step, index) => {
            const isCompleted =
              STATUS_ORDER[step.status as OrderStatus] < currentStatusIndex;
            const isCurrent =
              STATUS_ORDER[step.status as OrderStatus] === currentStatusIndex;
            const isPending =
              STATUS_ORDER[step.status as OrderStatus] > currentStatusIndex;

            return (
              <li key={step.status} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex size-8 shrink-0 items-center justify-center ${
                      isCompleted || isCurrent
                        ? "bg-ink text-white"
                        : "border-border text-disabled border bg-white"
                    }`}
                  >
                    <Icon name={step.icon} size={16} />
                  </div>
                  {index < STATUS_STEPS.length - 1 && (
                    <div
                      className={`w-px flex-1 ${isCompleted ? "bg-ink" : "bg-border"}`}
                      style={{ minHeight: "24px" }}
                    />
                  )}
                </div>
                <div className="pb-5">
                  <p
                    className={`text-body font-bold ${
                      isCurrent
                        ? "text-ink"
                        : isPending
                          ? "text-disabled"
                          : "text-muted"
                    }`}
                  >
                    {step.label}
                  </p>
                  {isCurrent && (
                    <p className="text-small text-muted">
                      {step.status === "menunggu_pembayaran"
                        ? (PAYMENT_INSTRUCTIONS[order.payment] ??
                          "Segera selesaikan pembayaran.")
                        : step.status === "dikirim"
                          ? `Dikirim via ${COURIER_LABEL[order.courier] ?? order.courier}`
                          : ""}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Item Pesanan */}
      <div className="mt-6">
        <h2 className="text-small text-muted mb-4 font-bold tracking-wide uppercase">
          Produk
        </h2>
        <div className="border-border flex flex-col border">
          {order.items.map((item, i) => (
            <div
              key={i}
              className="border-border flex items-center justify-between gap-4 border-b p-4 last:border-b-0"
            >
              <div className="flex-1">
                <p className="text-body text-ink font-medium">{item.name}</p>
                <p className="text-small text-muted">
                  Ukuran {item.size} · {item.colorId} · × {item.qty}
                </p>
              </div>
              <p className="tabular text-body text-ink font-bold">
                {formatRupiah(item.price * item.qty)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Ringkasan Pembayaran */}
      <div className="mt-6">
        <h2 className="text-small text-muted mb-4 font-bold tracking-wide uppercase">
          Ringkasan Pembayaran
        </h2>
        <div className="border-border flex flex-col gap-3 border p-4">
          <div className="text-body flex justify-between">
            <span className="text-muted">Subtotal</span>
            <span className="tabular text-ink">
              {formatRupiah(order.subtotal)}
            </span>
          </div>
          {order.discount > 0 && (
            <div className="text-body flex justify-between">
              <span className="text-muted">Diskon</span>
              <span className="tabular text-ink">
                -{formatRupiah(order.discount)}
              </span>
            </div>
          )}
          <div className="text-body flex justify-between">
            <span className="text-muted">Ongkos Kirim</span>
            <span className="tabular text-ink">
              {order.shipping === 0 ? "Gratis" : formatRupiah(order.shipping)}
            </span>
          </div>
          <Divider />
          <div className="text-body flex justify-between font-bold">
            <span className="text-ink">Total</span>
            <span className="tabular text-ink">
              {formatRupiah(order.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Info Pengiriman */}
      <div className="mt-6">
        <h2 className="text-small text-muted mb-4 font-bold tracking-wide uppercase">
          Alamat Pengiriman
        </h2>
        <div className="border-border border p-4">
          <p className="text-body text-ink font-bold">{order.address.name}</p>
          <p className="text-body text-muted">{order.address.phone}</p>
          <p className="text-body text-muted mt-1">
            {order.address.detail}, {order.address.district},{" "}
            {order.address.city}, {order.address.province}{" "}
            {order.address.postalCode}
          </p>
          <p className="text-small text-muted mt-2">
            {COURIER_LABEL[order.courier] ?? order.courier} · {order.payment}
          </p>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <Link href="/account">
          <Button variant="secondary">KEMBALI KE AKUN</Button>
        </Link>
        <Link href="/">
          <Button>LANJUT BELANJA</Button>
        </Link>
      </div>
    </div>
  );
}
