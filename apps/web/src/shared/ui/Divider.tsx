import { cn } from "@/shared/lib/cn";

export function Divider({ className }: { className?: string }) {
  return <hr className={cn("border-border border-t", className)} />;
}
