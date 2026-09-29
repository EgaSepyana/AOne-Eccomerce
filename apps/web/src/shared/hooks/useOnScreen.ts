import { useEffect, useState } from "react";

export function useOnScreen(ref: React.RefObject<HTMLElement | null>): boolean {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry) setIsVisible(entry.isIntersecting);
    });
    observer.observe(el);

    return () => observer.disconnect();
  }, [ref]);

  return isVisible;
}
