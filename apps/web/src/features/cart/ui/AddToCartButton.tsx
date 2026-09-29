"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Icon, type ButtonProps } from "@/shared/ui";

export interface AddToCartButtonProps extends Omit<ButtonProps, "onClick" | "children"> {
  onAddToCart: () => boolean | Promise<boolean>;
  idleLabel: string;
  successLabel?: string;
}

export function AddToCartButton({
  onAddToCart,
  idleLabel,
  successLabel = "DITAMBAHKAN",
  disabled,
  ...props
}: AddToCartButtonProps) {
  const [state, setState] = useState<"idle" | "loading" | "success">("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  async function handleClick() {
    if (state !== "idle") return;
    setState("loading");
    const success = await onAddToCart();
    if (success) {
      setState("success");
      timeoutRef.current = setTimeout(() => setState("idle"), 1200);
    } else {
      setState("idle");
    }
  }

  return (
    <Button
      {...props}
      type="button"
      onClick={handleClick}
      loading={state === "loading"}
      disabled={disabled || state !== "idle"}
    >
      {state === "success" ? (
        <>
          <Icon name="check" size={20} />
          {successLabel}
        </>
      ) : (
        idleLabel
      )}
    </Button>
  );
}
