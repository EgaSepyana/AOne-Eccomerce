import Link from "next/link";
import { cn } from "@/shared/lib/cn";
import { Icon } from "./Icon";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({
  items,
  className,
}: {
  items: BreadcrumbItem[];
  className?: string;
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "text-caption text-muted flex items-center gap-1",
        className,
      )}
    >
      {items.map((item, index) => (
        <span
          key={`${item.label}-${index}`}
          className="flex items-center gap-1"
        >
          {index > 0 && (
            <Icon name="chevron_right" size={20} className="!text-[14px]" />
          )}
          {item.href ? (
            <Link href={item.href} className="hover:text-ink">
              {item.label}
            </Link>
          ) : (
            <span className="text-ink">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
