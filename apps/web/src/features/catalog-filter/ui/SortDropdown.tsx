"use client";

import { useState } from "react";
import { SORT_OPTIONS } from "@/entities/product";
import { Icon } from "@/shared/ui";
import { useCatalogFilters } from "../model/useCatalogFilters";

export function SortDropdown() {
  const { filters, setFilters } = useCatalogFilters();
  const [open, setOpen] = useState(false);
  const current =
    SORT_OPTIONS.find((o) => o.value === filters.sort) ?? SORT_OPTIONS[0]!;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="border-border text-body flex h-10 items-center gap-2 border px-3"
      >
        <span className="text-muted">Urutkan:</span>
        <span className="font-medium">{current.label}</span>
        <Icon name="expand_more" size={20} />
      </button>
      {open && (
        <>
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div className="border-border shadow-overlay absolute top-full right-0 z-20 mt-2 w-56 border bg-white">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setFilters({ sort: option.value, page: null });
                  setOpen(false);
                }}
                className={`text-body hover:bg-subtle flex w-full items-center px-4 py-3 text-left ${
                  option.value === filters.sort ? "font-bold" : ""
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
