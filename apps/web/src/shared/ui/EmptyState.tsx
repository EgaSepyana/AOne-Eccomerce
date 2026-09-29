import { cn } from "@/shared/lib/cn";
import { Icon } from "./Icon";

export interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon = "inbox",
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 py-16 text-center",
        className,
      )}
    >
      <Icon
        name={icon}
        size={64}
        className="text-border !text-[64px] [font-variation-settings:'wght'_200]"
      />
      <div className="flex flex-col gap-2">
        <h2 className="text-ink text-[28px] leading-9 font-bold lg:text-[36px] lg:leading-[44px]">
          {title}
        </h2>
        {description && (
          <p className="text-muted mx-auto max-w-[460px] text-[16px] leading-6">
            {description}
          </p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
