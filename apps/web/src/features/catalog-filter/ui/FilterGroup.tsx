"use client";

import { useState } from "react";
import { Icon } from "@/shared/ui";

export function FilterGroup({
  label,
  defaultOpen = true,
  children,
  bordered = true,
}: {
  label: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  bordered?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={bordered ? "border-border border-b py-6" : "py-6"}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between"
      >
        <span className="text-h3 text-ink font-bold">{label}</span>
        <Icon name={open ? "remove" : "add"} size={20} />
      </button>
      {open && <div className="flex flex-col gap-4 pt-4">{children}</div>}
    </div>
  );
}
