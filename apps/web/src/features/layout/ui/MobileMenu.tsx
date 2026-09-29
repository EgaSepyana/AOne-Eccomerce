"use client";

import Link from "next/link";
import { useUIStore } from "@/shared/model/useUIStore";
import { NAV_GENDERS } from "@/shared/config/navigation";
import { Drawer, Icon } from "@/shared/ui";

export function MobileMenu() {
  const menuOpen = useUIStore((s) => s.menuOpen);
  const setMenuOpen = useUIStore((s) => s.setMenuOpen);

  return (
    <Drawer
      open={menuOpen}
      onClose={() => setMenuOpen(false)}
      side="left"
      title="Menu"
    >
      <nav className="flex flex-col">
        {NAV_GENDERS.map((item) => (
          <Link
            key={item.gender}
            href={item.href}
            onClick={() => setMenuOpen(false)}
            className="border-border text-h3 flex items-center justify-between border-b px-4 py-4 font-bold uppercase"
          >
            {item.label}
            <Icon name="chevron_right" />
          </Link>
        ))}
        <Link
          href="/wishlist"
          onClick={() => setMenuOpen(false)}
          className="border-border text-body flex items-center justify-between border-b px-4 py-4"
        >
          Wishlist
          <Icon name="chevron_right" size={20} />
        </Link>
        <Link
          href="/account"
          onClick={() => setMenuOpen(false)}
          className="border-border text-body flex items-center justify-between border-b px-4 py-4"
        >
          Akun
          <Icon name="chevron_right" size={20} />
        </Link>
      </nav>
    </Drawer>
  );
}
