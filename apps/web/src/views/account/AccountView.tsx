"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUserStore } from "@/entities/user";
import { useOrders } from "@/entities/order";
import { useWishlistStore } from "@/features/wishlist";
import { formatRupiah } from "@/shared/lib/format";
import { Button, EmptyState, Icon, Skeleton } from "@/shared/ui";
import type { Order, OrderStatus } from "@/entities/order";

const STATUS_ICON: Record<OrderStatus, string> = {
  menunggu_pembayaran: "pending",
  dibayar: "check_circle",
  dikemas: "inventory_2",
  dikirim: "local_shipping",
  selesai: "task_alt",
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  menunggu_pembayaran: "Menunggu Pembayaran",
  dibayar: "Dibayar",
  dikemas: "Dikemas",
  dikirim: "Dalam pengiriman",
  selesai: "Selesai",
};

const ORDER_STATUS_INDEX: Record<OrderStatus, number> = {
  menunggu_pembayaran: 0,
  dibayar: 1,
  dikemas: 2,
  dikirim: 3,
  selesai: 4,
};

const TRACK_STEPS: { status: OrderStatus; label: string }[] = [
  { status: "dibayar", label: "Dibayar" },
  { status: "dikemas", label: "Dikemas" },
  { status: "dikirim", label: "Dikirim" },
  { status: "selesai", label: "Tiba" },
];

const NAV_ITEMS = [
  { icon: "dashboard", label: "Ringkasan", tab: "ringkasan" },
  { icon: "receipt_long", label: "Pesanan", tab: "pesanan" },
  { icon: "favorite", label: "Wishlist", tab: null, href: "/wishlist" },
  { icon: "location_on", label: "Alamat", tab: "alamat" },
  { icon: "person", label: "Detail akun", tab: "detail" },
  { icon: "help", label: "Bantuan", tab: null, href: "/help/faq" },
];

const ORDER_FILTERS = [
  "Semua",
  "Belum bayar",
  "Dikemas",
  "Dikirim",
  "Selesai",
  "Dibatalkan",
];

// ─── Order Tracker Card ───────────────────────────────────────────────────────
function OrderTrackerCard({ order }: { order: Order }) {
  const curIdx = ORDER_STATUS_INDEX[order.status] ?? 0;
  const createdDate = new Date(order.createdAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="border-ink flex flex-col gap-6 border p-6">
      <div className="flex flex-wrap justify-between gap-6">
        <div>
          <p className="text-body text-ink font-bold">{order.id}</p>
          <p className="text-small text-muted">
            {createdDate} · {order.items.length} produk ·{" "}
            {formatRupiah(order.total)}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-body text-ink flex items-center gap-1.5 font-bold">
            <Icon name={STATUS_ICON[order.status]} size={20} />
            {STATUS_LABEL[order.status]}
          </span>
          {order.status === "dikirim" && (
            <span className="text-small text-muted">
              {order.courier} · Estimasi 2–4 hari
            </span>
          )}
        </div>
      </div>

      {/* Horizontal step tracker */}
      <div className="grid grid-cols-4">
        {TRACK_STEPS.map(({ status, label }, i) => {
          const stepIdx = ORDER_STATUS_INDEX[status];
          const isCompleted = stepIdx <= curIdx;
          const isCurrent = stepIdx === curIdx;
          return (
            <div key={status} className="flex flex-col gap-2.5">
              <div className="flex items-center">
                <span
                  className={`size-3.5 shrink-0 rounded-full border-[1.5px] ${
                    isCompleted
                      ? "border-ink bg-ink"
                      : "border-disabled bg-white"
                  }`}
                />
                {i < TRACK_STEPS.length - 1 && (
                  <span
                    className={`h-0.5 flex-1 ${i < curIdx - 1 ? "bg-ink" : "bg-border"}`}
                  />
                )}
              </div>
              <p
                className={`text-small ${
                  isCurrent
                    ? "text-ink font-bold"
                    : isCompleted
                      ? "text-muted"
                      : "text-disabled"
                }`}
              >
                {label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Product thumbnails */}
      <div className="flex items-center gap-3">
        {order.items.slice(0, 3).map((item, i) => (
          <div
            key={i}
            className="bg-subtle flex aspect-[3/4] w-[60px] shrink-0 items-center justify-center"
          >
            {item.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-muted font-mono text-[9px]">3:4</span>
            )}
          </div>
        ))}
        <div className="flex-1" />
        <Link href={`/account/orders/${order.id}`}>
          <Button variant="secondary">LACAK PAKET</Button>
        </Link>
      </div>
    </div>
  );
}

// ─── Ringkasan Tab ───────────────────────────────────────────────────────────
function RingkasanTab({ name }: { name: string }) {
  const { data: orders = [] } = useOrders();
  const wishlistCount = useWishlistStore((s) => s.ids.length);
  const activeOrder = orders.find(
    (o) => o.status === "dikirim" || o.status === "dikemas",
  );

  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-h1 text-ink font-bold">Halo, {name}</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="#" className="bg-subtle text-ink flex flex-col gap-2 p-6">
          <span className="text-small text-muted">Voucher aktif</span>
          <span className="tabular text-[28px] leading-[34px] font-bold">
            0
          </span>
          <span className="text-small underline underline-offset-2">
            Lihat voucher
          </span>
        </Link>
        <Link
          href="/wishlist"
          className="bg-subtle text-ink flex flex-col gap-2 p-6"
        >
          <span className="text-small text-muted">Wishlist</span>
          <span className="tabular text-[28px] leading-[34px] font-bold">
            {wishlistCount}
          </span>
          <span className="text-small underline underline-offset-2">
            Buka wishlist
          </span>
        </Link>
      </div>

      {/* Active Order */}
      {activeOrder && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-ink text-[20px] leading-7 font-bold">
              Pesanan berjalan
            </h2>
            <button
              type="button"
              onClick={() => {
                // switch to pesanan
                window.location.hash = "pesanan";
              }}
              className="text-small hover:text-muted font-medium underline underline-offset-2"
            >
              Semua pesanan
            </button>
          </div>
          <OrderTrackerCard order={activeOrder} />
        </section>
      )}

      {/* Sesuai ukuranmu */}
      <section className="flex flex-col gap-4">
        <h2 className="text-ink text-[20px] leading-7 font-bold">
          Sesuai ukuranmu
        </h2>
        <div className="bg-subtle flex flex-wrap items-center gap-6 p-5 lg:px-6">
          <Icon name="straighten" size={28} className="text-ink" />
          <div className="flex min-w-[240px] flex-1 flex-col gap-0.5">
            <span className="text-ink text-[15px] font-bold">
              Tinggi 162 cm · Berat 52 kg · Fit Regular
            </span>
            <span className="text-muted text-[13px]">
              Rekomendasi: Atasan M, Bawahan M (27)
            </span>
          </div>
          <button
            type="button"
            className="text-ink hover:text-muted text-[14px] underline underline-offset-4"
          >
            Ubah profil ukuran
          </button>
        </div>
      </section>
    </div>
  );
}

// ─── Pesanan Tab ────────────────────────────────────────────────────────────
function PesananTab() {
  const [activeFilter, setActiveFilter] = useState("Semua");
  const { data: orders = [], isLoading } = useOrders();

  const filtered =
    activeFilter === "Semua"
      ? orders
      : orders.filter((o) => {
          const map: Record<string, OrderStatus[]> = {
            "Belum bayar": ["menunggu_pembayaran"],
            Dikemas: ["dikemas"],
            Dikirim: ["dikirim"],
            Selesai: ["selesai"],
          };
          return (map[activeFilter] ?? []).includes(o.status);
        });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-h1 text-ink font-bold">Pesanan saya</h1>
      <div className="flex flex-wrap gap-2">
        {ORDER_FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setActiveFilter(f)}
            className={`text-small flex h-9 items-center px-3.5 transition-colors ${
              activeFilter === f
                ? "bg-ink text-white"
                : "border-border text-ink hover:border-ink border"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="receipt_long"
          title="Belum ada pesanan"
          description="Mulai belanja dan pesananmu akan muncul di sini."
          action={
            <Link href="/">
              <Button>MULAI BELANJA</Button>
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((order) => (
            <div
              key={order.id}
              className="border-border flex flex-col gap-5 border p-6"
            >
              <div className="flex flex-wrap justify-between gap-6">
                <div>
                  <p className="text-body text-ink font-bold">{order.id}</p>
                  <p className="text-small text-muted">
                    {new Date(order.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <span className="text-body text-ink flex items-center gap-1.5 font-bold">
                  <Icon name={STATUS_ICON[order.status]} size={20} />
                  {STATUS_LABEL[order.status]}
                </span>
              </div>

              <div className="border-border flex items-center gap-4 border-t pt-5">
                <div className="bg-subtle flex aspect-[3/4] w-[72px] shrink-0 items-center justify-center">
                  <span className="text-muted font-mono text-[9px]">3:4</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-body text-ink">{order.items[0]?.name}</p>
                  {order.items.length > 1 && (
                    <p className="text-small text-muted">
                      + {order.items.length - 1} produk lain
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-small text-muted">Total</span>
                  <span className="tabular text-ink text-[18px] leading-[24px] font-bold">
                    {formatRupiah(order.total)}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                {order.status === "selesai" && (
                  <Button variant="secondary">TULIS ULASAN</Button>
                )}
                <Link href={`/account/orders/${order.id}`}>
                  <Button>LIHAT DETAIL</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Alamat Tab ─────────────────────────────────────────────────────────────
function AlamatTab({
  addresses,
}: {
  addresses: import("@/entities/order").Address[];
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-h1 text-ink font-bold">Alamat</h1>
        <button
          type="button"
          className="border-ink text-small flex h-11 items-center gap-2 border px-5 font-bold tracking-wide uppercase"
        >
          <Icon name="add" size={18} />
          TAMBAH ALAMAT
        </button>
      </div>

      {addresses.length === 0 ? (
        <EmptyState
          icon="location_on"
          title="Belum ada alamat"
          description="Tambahkan alamat pengiriman untuk mempercepat checkout."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((addr, i) => (
            <div
              key={i}
              className={`flex flex-col gap-3 border p-6 ${i === 0 ? "border-ink" : "border-border"}`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-body text-ink flex-1 font-bold">
                  Alamat {i + 1}
                </span>
                {i === 0 && (
                  <span className="bg-ink text-caption px-1.5 py-1 font-bold tracking-wide text-white uppercase">
                    UTAMA
                  </span>
                )}
              </div>
              <p className="text-body text-ink font-medium">
                {addr.name} · {addr.phone}
              </p>
              <p className="text-body text-muted">
                {addr.detail}, {addr.district}, {addr.city}, {addr.province}{" "}
                {addr.postalCode}
              </p>
              <div className="text-small flex gap-5">
                <button type="button" className="underline underline-offset-2">
                  Ubah
                </button>
                <button type="button" className="underline underline-offset-2">
                  Hapus
                </button>
                {i > 0 && (
                  <button
                    type="button"
                    className="underline underline-offset-2"
                  >
                    Jadikan utama
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Detail Akun Tab ─────────────────────────────────────────────────────────
function DetailAkunTab({ user }: { user: { name: string; email: string } }) {
  return (
    <div className="flex max-w-[640px] flex-col gap-8">
      <h1 className="text-h1 text-ink font-bold">Detail akun</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 flex flex-col gap-1.5">
          <label className="text-small text-ink font-medium">
            Nama lengkap
          </label>
          <div className="border-border text-body text-ink flex h-12 items-center border px-3.5">
            {user.name}
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-small text-ink font-medium">Email</label>
          <div className="border-border flex h-12 items-center justify-between border px-3.5">
            <span className="text-body text-ink">{user.email}</span>
            <span className="text-small text-muted flex items-center gap-1">
              <Icon name="verified" size={16} />
              Terverifikasi
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-small text-ink font-medium">Nomor HP</label>
          <div className="border-border text-body text-muted flex h-12 items-center border px-3.5">
            Belum diisi
          </div>
        </div>
      </div>
      <Button className="self-start px-10">SIMPAN PERUBAHAN</Button>

      <div className="border-border flex flex-col gap-4 border-t pt-8">
        <p className="text-h3 text-ink font-bold">Keamanan</p>
        <div className="text-body flex items-center justify-between">
          <div>
            <p className="text-ink font-medium">Kata sandi</p>
            <p className="text-small text-muted">Terakhir diubah hari ini</p>
          </div>
          <button
            type="button"
            className="text-body underline underline-offset-2"
          >
            Ubah
          </button>
        </div>
        <button
          type="button"
          className="text-small text-muted mt-2 self-start underline underline-offset-2"
        >
          Hapus akun
        </button>
      </div>
    </div>
  );
}

// ─── Main AccountView ─────────────────────────────────────────────────────────
type Tab = "ringkasan" | "pesanan" | "alamat" | "detail";

export function AccountView({
  initialTab = "ringkasan",
}: {
  initialTab?: Tab;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>(initialTab);
  const user = useUserStore((s) => s.user);
  const logout = useUserStore((s) => s.logout);
  const addresses = useUserStore((s) => s.addresses);

  // Not logged in
  if (!user) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-[1440px] flex-col items-center justify-center gap-6 px-4 py-24 text-center lg:px-10">
        <Icon name="person" size={64} className="text-border !text-[64px]" />
        <h1 className="text-h1 text-ink font-bold">Masuk ke akun kamu</h1>
        <p className="text-body text-muted">
          Lihat pesanan, wishlist, dan kelola profilmu.
        </p>
        <div className="flex gap-3">
          <Link href="/login">
            <Button>MASUK</Button>
          </Link>
          <Link href="/register">
            <Button variant="secondary">DAFTAR</Button>
          </Link>
        </div>
      </div>
    );
  }

  const initials = user.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 pb-24 lg:px-10">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-[125px] lg:self-start">
          <div className="flex items-center gap-3.5">
            <span className="bg-ink flex size-14 shrink-0 items-center justify-center rounded-full text-[20px] font-bold text-white">
              {initials}
            </span>
            <div>
              <p className="text-body text-ink font-bold">{user.name}</p>
              <p className="text-small text-muted">Member Aone</p>
            </div>
          </div>

          <nav className="border-border mt-6 flex flex-col border-t">
            {NAV_ITEMS.map(({ icon, label, tab: t, href }) => {
              const isActive = t === tab;
              if (href) {
                return (
                  <Link
                    key={label}
                    href={href}
                    className="border-border text-body text-ink flex h-[52px] items-center gap-3 border-b"
                  >
                    <Icon name={icon} size={22} />
                    <span className="flex-1">{label}</span>
                  </Link>
                );
              }
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setTab(t as Tab)}
                  className={`border-border text-body flex h-[52px] items-center gap-3 border-b ${
                    isActive ? "text-ink font-bold" : "text-ink"
                  }`}
                >
                  <Icon
                    name={icon}
                    size={22}
                    className={
                      isActive ? "[font-variation-settings:'FILL'_1]" : ""
                    }
                  />
                  <span className="flex-1 text-left">{label}</span>
                  {isActive && <span className="bg-ink h-5 w-0.5" />}
                </button>
              );
            })}
            <button
              type="button"
              onClick={handleLogout}
              className="text-body text-muted flex h-[52px] items-center gap-3"
            >
              <Icon name="logout" size={22} />
              Keluar
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="min-w-0">
          {tab === "ringkasan" && <RingkasanTab name={user.name} />}
          {tab === "pesanan" && <PesananTab />}
          {tab === "alamat" && <AlamatTab addresses={addresses} />}
          {tab === "detail" && <DetailAkunTab user={user} />}
        </main>
      </div>
    </div>
  );
}
