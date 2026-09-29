"use client";

import type { Facets } from "@/entities/product";
import { Button, Drawer } from "@/shared/ui";
import { FilterSidebar } from "./FilterSidebar";

export function FilterSheet({
  open,
  onClose,
  facets,
  resultCount,
  categoryLinkFor,
}: {
  open: boolean;
  onClose: () => void;
  facets: Facets;
  resultCount: number;
  categoryLinkFor?: (categorySlug: string) => string;
}) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      side="bottom"
      title="Filter"
      className="max-h-[85vh]"
    >
      <div className="flex flex-col px-4">
        <FilterSidebar facets={facets} categoryLinkFor={categoryLinkFor} />
      </div>
      <div className="border-border sticky bottom-0 border-t bg-white p-4">
        <Button onClick={onClose} className="w-full">
          TAMPILKAN {resultCount} PRODUK
        </Button>
      </div>
    </Drawer>
  );
}
