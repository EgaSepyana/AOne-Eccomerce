"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useUserStore } from "@/entities/user";
import { Button, Input } from "@/shared/ui";

export function LoginView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useUserStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [isLoading, setIsLoading] = useState(false);

  function validate() {
    const errs: { email?: string; password?: string } = {};
    if (!email) {
      errs.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = "Format email tidak valid";
    }
    if (!password) {
      errs.password = "Password wajib diisi";
    } else if (password.length < 6) {
      errs.password = "Password minimal 6 karakter";
    }
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
    // Simulasi delay login
    await new Promise((r) => setTimeout(r, 800));
    login(email);
    const redirect = searchParams.get("from") ?? "/account";
    router.push(redirect);
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col items-center justify-center px-4 py-16">
      <div className="w-full">
        <h1 className="text-h1 text-ink font-bold">Masuk</h1>
        <p className="text-body text-muted mt-2">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="text-ink font-medium underline underline-offset-2"
          >
            Daftar sekarang
          </Link>
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 flex flex-col gap-5"
          noValidate
        >
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="login-email"
              className="text-small text-ink font-bold tracking-wide uppercase"
            >
              Email
            </label>
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "login-email-error" : undefined}
            />
            {errors.email && (
              <p
                id="login-email-error"
                className="text-small text-ink"
                role="alert"
              >
                {errors.email}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="login-password"
              className="text-small text-ink font-bold tracking-wide uppercase"
            >
              Password
            </label>
            <Input
              id="login-password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!errors.password}
              aria-describedby={
                errors.password ? "login-password-error" : undefined
              }
            />
            {errors.password && (
              <p
                id="login-password-error"
                className="text-small text-ink"
                role="alert"
              >
                {errors.password}
              </p>
            )}
          </div>

          <Button
            type="submit"
            loading={isLoading}
            disabled={isLoading}
            className="w-full"
          >
            MASUK
          </Button>
        </form>

        <p className="text-small text-muted mt-6 text-center">
          Gunakan email dan password apapun (min. 6 karakter) untuk masuk.
        </p>
      </div>
    </div>
  );
}
