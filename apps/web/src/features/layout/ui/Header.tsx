"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCartStore } from "@/features/cart";
import type { Gender } from "@/entities/product";
import { useHydrated } from "@/shared/hooks/useHydrated";
import { useUIStore } from "@/shared/model/useUIStore";
import { NAV_GENDERS } from "@/shared/config/navigation";
import { Icon } from "@/shared/ui";
import { cn } from "@/shared/lib/cn";
import { CartBadge } from "./CartBadge";
import { MegaMenu } from "./MegaMenu";

const OPEN_DELAY = 120;
const CLOSE_DELAY = 200;

export function Header() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const cartCount = useCartStore((s) =>
    s.items.reduce((sum, item) => sum + item.qty, 0),
  );
  const setMenuOpen = useUIStore((s) => s.setMenuOpen);
  const setSearchOpen = useUIStore((s) => s.setSearchOpen);
  const setCartDrawerOpen = useUIStore((s) => s.setCartDrawerOpen);

  const [openGender, setOpenGender] = useState<Gender | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearTimer() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function scheduleOpen(gender: Gender) {
    clearTimer();
    timerRef.current = setTimeout(() => setOpenGender(gender), OPEN_DELAY);
  }

  function scheduleClose() {
    clearTimer();
    timerRef.current = setTimeout(() => setOpenGender(null), CLOSE_DELAY);
  }

  useEffect(() => {
    if (!openGender) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenGender(null);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [openGender]);

  useEffect(() => clearTimer, []);

  return (
    <div className="border-border relative border-b bg-white">
      <header className="mx-auto flex h-14 max-w-[1440px] items-center gap-4 px-4 lg:h-16 lg:gap-[clamp(16px,3vw,48px)] lg:px-10">
        <button
          type="button"
          aria-label="Buka menu"
          className="lg:hidden"
          onClick={() => setMenuOpen(true)}
        >
          <Icon name="menu" />
        </button>

        <Link href="/" className="text-ink flex shrink-0 items-center gap-2.5">
          <Image
            src="/brand/logo-black.png"
            alt="Aone"
            width={28}
            height={28}
            className="h-6 w-auto lg:h-7"
          />
          <span className="text-h3 hidden font-bold tracking-[0.14em] sm:inline lg:text-[20px]">
            AONE
          </span>
        </Link>

        <nav className="hidden h-16 shrink-0 items-center gap-[clamp(16px,2.2vw,32px)] lg:flex">
          {NAV_GENDERS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.gender}
                href={item.href}
                onMouseEnter={() => scheduleOpen(item.gender)}
                onMouseLeave={scheduleClose}
                onFocus={() => scheduleOpen(item.gender)}
                onBlur={scheduleClose}
                aria-expanded={openGender === item.gender}
                aria-haspopup="menu"
                className={cn(
                  "text-small text-ink relative flex h-16 items-center font-bold tracking-[0.04em] uppercase",
                  isActive &&
                    "after:bg-ink after:absolute after:inset-x-0 after:-bottom-px after:h-0.5",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden flex-1 lg:block" />

        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="bg-subtle text-muted hidden h-10 w-[420px] min-w-0 shrink items-center gap-2.5 px-3.5 lg:flex"
        >
          <Icon name="search" size={22} className="!text-ink" />
          <span className="text-body truncate">Cari kaos, kemeja, celana…</span>
        </button>

        <button
          type="button"
          aria-label="Cari"
          onClick={() => setSearchOpen(true)}
          className="ml-auto lg:hidden"
        >
          <Icon name="search" />
        </button>

        <div className="hidden shrink-0 items-center gap-1 lg:flex">
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="flex size-11 items-center justify-center"
          >
            <Icon name="favorite" />
          </Link>
          <Link
            href="/account"
            aria-label="Akun"
            className="flex size-11 items-center justify-center"
          >
            <Icon name="person" />
          </Link>
          <button
            type="button"
            aria-label="Keranjang"
            onClick={() => setCartDrawerOpen(true)}
            className="relative flex size-11 items-center justify-center"
          >
            <Icon name="shopping_bag" />
            {hydrated && <CartBadge count={cartCount} />}
          </button>
        </div>

        <button
          type="button"
          aria-label="Keranjang"
          onClick={() => setCartDrawerOpen(true)}
          className="relative flex size-11 items-center justify-center lg:hidden"
        >
          <Icon name="shopping_bag" />
          {hydrated && <CartBadge count={cartCount} />}
        </button>
      </header>

      {NAV_GENDERS.map((item) => (
        <div
          key={item.gender}
          onMouseEnter={() => scheduleOpen(item.gender)}
          onMouseLeave={scheduleClose}
        >
          <MegaMenu gender={item.gender} open={openGender === item.gender} />
        </div>
      ))}
    </div>
  );
}
