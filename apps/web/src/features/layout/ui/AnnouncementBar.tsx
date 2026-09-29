"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/shared/lib/gsap";
import { DUR, prefersReducedMotion } from "@/shared/lib/motion";
import { Icon } from "@/shared/ui";

const MESSAGES = [
  "Gratis ongkir min. belanja Rp300.000",
  "Tukar ukuran gratis 14 hari",
  "Bisa COD & cicilan 0%",
];

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (paused || prefersReducedMotion()) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [paused]);

  useGSAP(() => {
    if (!textRef.current || prefersReducedMotion()) return;
    gsap.fromTo(
      textRef.current,
      { opacity: 0 },
      { opacity: 1, duration: DUR.base },
    );
  }, [index]);

  const goTo = (next: number) => {
    setIndex((next + MESSAGES.length) % MESSAGES.length);
  };

  return (
    <div
      className="bg-ink text-small flex h-9 items-center justify-center gap-6 px-4 font-medium text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <button
        type="button"
        aria-label="Pesan sebelumnya"
        onClick={() => goTo(index - 1)}
      >
        <Icon name="chevron_left" size={18} className="cursor-pointer" />
      </button>
      <span ref={textRef} className="text-center">
        {MESSAGES[index]}
      </span>
      <button
        type="button"
        aria-label="Pesan berikutnya"
        onClick={() => goTo(index + 1)}
      >
        <Icon name="chevron_right" size={18} className="cursor-pointer" />
      </button>
    </div>
  );
}
