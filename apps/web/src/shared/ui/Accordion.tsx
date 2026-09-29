"use client";

import {
  createContext,
  useContext,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useGSAP } from "@gsap/react";
import { cn } from "@/shared/lib/cn";
import { gsap } from "@/shared/lib/gsap";
import { DUR, EASE, prefersReducedMotion } from "@/shared/lib/motion";
import { Icon } from "./Icon";

interface AccordionContextValue {
  openItems: Set<string>;
  toggle: (id: string) => void;
  multiple: boolean;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

export interface AccordionProps {
  children: ReactNode;
  defaultOpen?: string[];
  multiple?: boolean;
  className?: string;
}

function AccordionRoot({
  children,
  defaultOpen = [],
  multiple = true,
  className,
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(defaultOpen));

  const toggle = (id: string) => {
    setOpenItems((prev) => {
      const next = new Set(multiple ? prev : []);
      if (prev.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggle, multiple }}>
      <div className={cn("flex flex-col", className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemContextValue {
  id: string;
  isOpen: boolean;
  triggerId: string;
  panelId: string;
}

const AccordionItemContext = createContext<AccordionItemContextValue | null>(
  null,
);

function AccordionItem({
  id,
  children,
  className,
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error("Accordion.Item must be used within Accordion");
  const isOpen = ctx.openItems.has(id);
  const triggerId = useId();
  const panelId = useId();

  return (
    <AccordionItemContext.Provider
      value={{ id, isOpen, triggerId, panelId }}
    >
      <div className={cn("border-border border-b", className)}>{children}</div>
    </AccordionItemContext.Provider>
  );
}

function AccordionTrigger({ children }: { children: ReactNode }) {
  const ctx = useContext(AccordionContext);
  const itemCtx = useContext(AccordionItemContext);
  if (!ctx || !itemCtx)
    throw new Error("Accordion.Trigger must be used within Accordion.Item");

  return (
    <button
      type="button"
      id={itemCtx.triggerId}
      aria-expanded={itemCtx.isOpen}
      aria-controls={itemCtx.panelId}
      onClick={() => ctx.toggle(itemCtx.id)}
      className="text-h3 text-ink flex w-full items-center justify-between py-4 text-left font-bold"
    >
      {children}
      <Icon
        name={itemCtx.isOpen ? "remove" : "add"}
        size={24}
        className="shrink-0"
      />
    </button>
  );
}

function AccordionContent({ children }: { children: ReactNode }) {
  const itemCtx = useContext(AccordionItemContext);
  if (!itemCtx)
    throw new Error("Accordion.Content must be used within Accordion.Item");
  const isOpen = itemCtx.isOpen;
  const ref = useRef<HTMLDivElement>(null);
  const isMounted = useRef(false);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (!isMounted.current) {
        isMounted.current = true;
        el.style.height = isOpen ? "auto" : "0px";
        return;
      }

      if (prefersReducedMotion()) {
        el.style.height = isOpen ? "auto" : "0px";
      } else if (isOpen) {
        gsap.set(el, { height: "auto" });
        const autoHeight = el.offsetHeight;
        gsap.fromTo(
          el,
          { height: 0 },
          { height: autoHeight, duration: DUR.base, ease: EASE },
        );
      } else {
        gsap.to(el, { height: 0, duration: DUR.base, ease: EASE });
      }
    },
    { scope: ref, dependencies: [isOpen] },
  );

  return (
    <div
      ref={ref}
      id={itemCtx.panelId}
      role="region"
      aria-labelledby={itemCtx.triggerId}
      className="overflow-hidden"
      style={{ height: isOpen ? "auto" : 0 }}
    >
      <div className="text-body text-muted pb-4">{children}</div>
    </div>
  );
}

export const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
});
