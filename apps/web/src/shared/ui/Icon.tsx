import { cn } from "@/shared/lib/cn";

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  size?: number;
}

export function Icon({ name, size = 24, className, ...props }: IconProps) {
  return (
    <span
      aria-hidden="true"
      className={cn("material-symbols-outlined select-none", className)}
      style={{ fontSize: size, width: size, height: size }}
      {...props}
    >
      {name}
    </span>
  );
}
