"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useUserStore } from "@/entities/user";
import { Icon } from "@/shared/ui";

const MEMBER_PERKS = [
  {
    icon: "sell",
    title: "Diskon 10% pembelian pertama",
    desc: "Voucher otomatis masuk ke akunmu setelah daftar.",
  },
  {
    icon: "favorite",
    title: "Wishlist di semua perangkat",
    desc: "Dapat kabar saat produk simpananmu turun harga atau restok.",
  },
  {
    icon: "bolt",
    title: "Checkout lebih cepat",
    desc: "Alamat dan metode pembayaran tersimpan aman.",
  },
];

function LoginForm({ onSwitchTab }: { onSwitchTab: () => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useUserStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [isLoading, setIsLoading] = useState(false);

  function validate() {
    const errs: { email?: string; password?: string } = {};
    if (!email) errs.email = "Email atau nomor HP wajib diisi";
    if (!password) errs.password = "Kata sandi wajib diisi";
    else if (password.length < 6)
      errs.password = "Kata sandi minimal 6 karakter";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    login(email);
    const redirect = searchParams.get("from") ?? "/account";
    router.push(redirect);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <div className="flex flex-col gap-2">
        <h1 className="text-ink text-[28px] leading-9 font-bold lg:text-[36px] lg:leading-[44px]">
          Selamat datang kembali
        </h1>
        <span className="text-muted text-[14px]">
          Masuk untuk melihat pesanan, wishlist, dan voucher.
        </span>
      </div>

      {/* Email / HP */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="login-email"
          className="text-ink text-[12px] font-medium"
        >
          Email atau nomor HP
        </label>
        <div
          className={`flex h-12 items-center border bg-white px-3.5 transition-colors ${
            errors.email
              ? "border-ink"
              : "border-border focus-within:border-ink"
          }`}
        >
          <input
            id="login-email"
            type="text"
            autoComplete="username"
            placeholder="nadia.putri@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-ink placeholder:text-disabled flex-1 bg-transparent text-[14px] outline-none"
          />
        </div>
        {errors.email && (
          <p
            className="text-ink flex items-center gap-1.5 text-[12px]"
            role="alert"
          >
            <Icon name="warning" size={16} />
            {errors.email}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="login-password"
            className="text-ink text-[12px] font-medium"
          >
            Kata sandi
          </label>
          <button
            type="button"
            className="text-ink hover:text-muted text-[12px] underline underline-offset-2"
          >
            Lupa kata sandi?
          </button>
        </div>
        <div
          className={`flex h-12 items-center border bg-white px-3.5 transition-colors ${
            errors.password
              ? "border-ink"
              : "border-border focus-within:border-ink"
          }`}
        >
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-ink placeholder:text-disabled flex-1 bg-transparent text-[14px] outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-muted hover:text-ink"
            aria-label={
              showPassword ? "Sembunyikan password" : "Tampilkan password"
            }
          >
            <Icon
              name={showPassword ? "visibility_off" : "visibility"}
              size={20}
            />
          </button>
        </div>
        {errors.password && (
          <p
            className="text-ink flex items-center gap-1.5 text-[12px]"
            role="alert"
          >
            <Icon name="warning" size={16} />
            {errors.password}
          </p>
        )}
      </div>

      {/* Remember me */}
      <button
        type="button"
        onClick={() => setRemember(!remember)}
        className="text-ink flex items-center gap-2.5 text-[14px]"
      >
        <span
          className={`flex size-5 items-center justify-center transition-colors ${
            remember ? "bg-ink text-white" : "border-border border bg-white"
          }`}
        >
          {remember && <Icon name="check" size={16} />}
        </span>
        Ingat saya di perangkat ini
      </button>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="bg-ink hover:bg-ink-hover disabled:bg-disabled flex h-[52px] w-full items-center justify-center text-[14px] font-bold tracking-[0.04em] text-white uppercase"
      >
        {isLoading ? "MEMPROSES..." : "MASUK"}
      </button>

      {/* Divider */}
      <div className="text-muted flex items-center gap-4 text-[12px]">
        <span className="bg-border h-px flex-1" />
        atau
        <span className="bg-border h-px flex-1" />
      </div>

      {/* Social / OTP */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => {
            login("google_user@gmail.com");
            router.push("/account");
          }}
          className="border-ink text-ink hover:bg-subtle flex h-12 items-center justify-center gap-2.5 border bg-white text-[14px] font-medium"
        >
          <span className="border-ink flex size-5 items-center justify-center rounded-full border-[1.5px] text-[11px] font-bold">
            G
          </span>
          Lanjutkan dengan Google
        </button>
        <button
          type="button"
          onClick={onSwitchTab}
          className="border-ink text-ink hover:bg-subtle flex h-12 items-center justify-center gap-2.5 border bg-white text-[14px] font-medium"
        >
          <Icon name="sms" size={20} />
          Masuk dengan OTP
        </button>
      </div>

      <Link
        href="/checkout"
        className="text-ink hover:text-muted self-center pt-2 text-[14px] underline underline-offset-4"
      >
        Lanjut checkout sebagai tamu
      </Link>
    </form>
  );
}

function RegisterForm() {
  const router = useRouter();
  const login = useUserStore((s) => s.login);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [shoppingFor, setShoppingFor] = useState<"Wanita" | "Pria" | "Semua">(
    "Wanita",
  );
  const [showPassword, setShowPassword] = useState(false);
  const [newsletter, setNewsletter] = useState(true);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const passwordRules = [
    { label: "Minimal 8 karakter", ok: password.length >= 8 },
    {
      label: "Mengandung huruf dan angka",
      ok: /[a-zA-Z]/.test(password) && /[0-9]/.test(password),
    },
    {
      label: "Berbeda dari email",
      ok: Boolean(password && password !== email),
    },
  ];

  function validate() {
    const errs: { name?: string; email?: string; password?: string } = {};
    if (!name.trim()) errs.name = "Nama lengkap wajib diisi";
    if (!email) errs.email = "Email wajib diisi";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Format email tidak valid";
    if (!password) errs.password = "Kata sandi wajib diisi";
    else if (password.length < 8)
      errs.password = "Kata sandi minimal 8 karakter";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    login(email);
    router.push("/account");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <div className="flex flex-col gap-2">
        <h1 className="text-ink text-[28px] leading-9 font-bold lg:text-[36px] lg:leading-[44px]">
          Buat akun Aone
        </h1>
        <span className="text-muted text-[14px]">
          Dapatkan diskon 10% untuk pembelian pertama.
        </span>
      </div>

      {/* Nama Lengkap */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="reg-name" className="text-ink text-[12px] font-medium">
          Nama lengkap
        </label>
        <div
          className={`flex h-12 items-center border bg-white px-3.5 transition-colors ${
            errors.name ? "border-ink" : "border-border focus-within:border-ink"
          }`}
        >
          <input
            id="reg-name"
            type="text"
            autoComplete="name"
            placeholder="Nadia Putri"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-ink placeholder:text-disabled flex-1 bg-transparent text-[14px] outline-none"
          />
        </div>
        {errors.name && (
          <p
            className="text-ink flex items-center gap-1.5 text-[12px]"
            role="alert"
          >
            <Icon name="warning" size={16} />
            {errors.name}
          </p>
        )}
      </div>

      {/* Email & Phone */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="reg-email"
            className="text-ink text-[12px] font-medium"
          >
            Email
          </label>
          <div
            className={`flex h-12 items-center border bg-white px-3.5 transition-colors ${
              errors.email
                ? "border-ink"
                : "border-border focus-within:border-ink"
            }`}
          >
            <input
              id="reg-email"
              type="email"
              autoComplete="email"
              placeholder="nadia.putri@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-ink placeholder:text-disabled flex-1 bg-transparent text-[14px] outline-none"
            />
          </div>
          {errors.email && (
            <p
              className="text-ink flex items-center gap-1.5 text-[12px]"
              role="alert"
            >
              <Icon name="warning" size={16} />
              {errors.email}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="reg-phone"
            className="text-ink text-[12px] font-medium"
          >
            Nomor HP
          </label>
          <div className="border-border focus-within:border-ink flex h-12 items-center border bg-white px-3.5">
            <input
              id="reg-phone"
              type="tel"
              autoComplete="tel"
              placeholder="0812 3456 7890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="text-ink placeholder:text-disabled flex-1 bg-transparent text-[14px] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Password with rules */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="reg-password"
          className="text-ink text-[12px] font-medium"
        >
          Kata sandi
        </label>
        <div
          className={`flex h-12 items-center border bg-white px-3.5 transition-colors ${
            errors.password
              ? "border-ink"
              : "border-border focus-within:border-ink"
          }`}
        >
          <input
            id="reg-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Minimal 8 karakter"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-ink placeholder:text-disabled flex-1 bg-transparent text-[14px] outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-muted hover:text-ink"
            aria-label={
              showPassword ? "Sembunyikan password" : "Tampilkan password"
            }
          >
            <Icon
              name={showPassword ? "visibility_off" : "visibility"}
              size={20}
            />
          </button>
        </div>

        <div className="flex flex-col gap-1 pt-1">
          {passwordRules.map((r) => (
            <span
              key={r.label}
              className={`flex items-center gap-1.5 text-[12px] ${
                r.ok ? "text-ink font-medium" : "text-muted"
              }`}
            >
              <Icon name={r.ok ? "check" : "close"} size={16} />
              {r.label}
            </span>
          ))}
        </div>
      </div>

      {/* Tanggal Lahir & Belanja Untuk */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="reg-birthdate"
            className="text-ink text-[12px] font-medium"
          >
            Tanggal lahir{" "}
            <span className="text-muted font-normal">(opsional)</span>
          </label>
          <div className="border-border focus-within:border-ink flex h-12 items-center justify-between border bg-white px-3.5">
            <input
              id="reg-birthdate"
              type="text"
              placeholder="HH / BB / TTTT"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="text-ink placeholder:text-muted flex-1 bg-transparent text-[14px] outline-none"
            />
            <Icon name="calendar_today" size={20} className="text-ink" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-ink text-[12px] font-medium">
            Belanja untuk
          </span>
          <div className="flex h-12">
            {(["Wanita", "Pria", "Semua"] as const).map((seg, i) => (
              <button
                key={seg}
                type="button"
                onClick={() => setShoppingFor(seg)}
                className={`flex-1 border text-[13px] font-medium transition-colors ${
                  shoppingFor === seg
                    ? "border-ink bg-ink z-10 font-bold text-white"
                    : "border-border text-ink hover:bg-subtle bg-white"
                } ${i > 0 ? "-ml-px" : ""}`}
              >
                {seg}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <button
        type="button"
        onClick={() => setNewsletter(!newsletter)}
        className="text-ink flex items-start gap-2.5 text-left text-[14px] leading-5"
      >
        <span
          className={`mt-0.5 flex size-5 shrink-0 items-center justify-center transition-colors ${
            newsletter ? "bg-ink text-white" : "border-border border bg-white"
          }`}
        >
          {newsletter && <Icon name="check" size={16} />}
        </span>
        Kirimi saya info koleksi baru dan promo lewat email
      </button>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="bg-ink hover:bg-ink-hover disabled:bg-disabled flex h-[52px] w-full items-center justify-center text-[14px] font-bold tracking-[0.04em] text-white uppercase"
      >
        {isLoading ? "MENDAFTAR..." : "DAFTAR"}
      </button>

      <p className="text-muted text-[12px] leading-[18px]">
        Dengan mendaftar, kamu menyetujui{" "}
        <Link
          href="/help/faq"
          className="text-ink underline underline-offset-2"
        >
          Syarat & Ketentuan
        </Link>{" "}
        dan{" "}
        <Link
          href="/help/faq"
          className="text-ink underline underline-offset-2"
        >
          Kebijakan Privasi
        </Link>{" "}
        Aone.
      </p>

      {/* Divider */}
      <div className="text-muted flex items-center gap-4 text-[12px]">
        <span className="bg-border h-px flex-1" />
        atau
        <span className="bg-border h-px flex-1" />
      </div>

      {/* Social / OTP */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => {
            login("google_user@gmail.com");
            router.push("/account");
          }}
          className="border-ink text-ink hover:bg-subtle flex h-12 items-center justify-center gap-2.5 border bg-white text-[14px] font-medium"
        >
          <span className="border-ink flex size-5 items-center justify-center rounded-full border-[1.5px] text-[11px] font-bold">
            G
          </span>
          Lanjutkan dengan Google
        </button>
        <button
          type="button"
          className="border-ink text-ink hover:bg-subtle flex h-12 items-center justify-center gap-2.5 border bg-white text-[14px] font-medium"
        >
          <Icon name="sms" size={20} />
          Masuk dengan OTP
        </button>
      </div>
    </form>
  );
}

export function AuthView({
  defaultTab = "masuk",
}: {
  defaultTab?: "masuk" | "daftar";
}) {
  const [tab, setTab] = useState<"masuk" | "daftar">(defaultTab);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-16 pb-24 lg:px-10">
      <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2 lg:gap-24">
        {/* Left: Form */}
        <div className="flex flex-col gap-8">
          {/* Tabs */}
          <div className="border-border flex border-b">
            {(["masuk", "daftar"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`relative flex h-14 flex-1 items-center justify-center text-[14px] font-bold tracking-[0.04em] uppercase transition-colors ${
                  tab === t ? "text-ink" : "text-muted"
                }`}
              >
                {t === "masuk" ? "MASUK" : "DAFTAR"}
                {tab === t && (
                  <span className="bg-ink absolute right-0 bottom-[-1px] left-0 h-0.5" />
                )}
              </button>
            ))}
          </div>

          {tab === "masuk" ? (
            <LoginForm onSwitchTab={() => setTab("daftar")} />
          ) : (
            <RegisterForm />
          )}
        </div>

        {/* Right: Campaign + Perks */}
        <aside className="hidden lg:sticky lg:top-[125px] lg:flex lg:flex-col lg:gap-6">
          <div className="bg-subtle text-muted flex aspect-[4/3] items-center justify-center font-mono text-[11px]">
            foto kampanye member · 4:3
          </div>
          <h2 className="text-ink text-[20px] leading-7 font-bold">
            Untung jadi member Aone
          </h2>
          <div className="flex flex-col gap-4">
            {MEMBER_PERKS.map((perk) => (
              <div key={perk.icon} className="flex items-start gap-3.5">
                <Icon
                  name={perk.icon}
                  size={24}
                  className="text-ink shrink-0"
                />
                <div className="flex flex-col gap-0.5">
                  <p className="text-ink text-[15px] font-bold">{perk.title}</p>
                  <p className="text-muted text-[13px] leading-[18px]">
                    {perk.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
