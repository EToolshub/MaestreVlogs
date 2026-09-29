"use client";

import { useEffect, useRef } from "react";
import { animate, useReducedMotion } from "framer-motion";
import { intlLocale, type Locale } from "@/i18n/config";

/** Número que, cuando cambia, cuenta desde el valor anterior hasta el nuevo. */
export function AnimatedNumber({ value, locale, className }: { value: number; locale: Locale; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const previous = useRef(value);
  const reduce = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    const from = previous.current;
    previous.current = value;
    if (!node || from === value) return;
    const fmt = new Intl.NumberFormat(intlLocale[locale]);
    if (reduce) {
      node.textContent = fmt.format(value);
      return;
    }
    node.animate([{ color: value > from ? "#34d399" : "#ff8a82" }, { color: "inherit" }], { duration: 1600 });
    const controls = animate(from, value, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        node.textContent = fmt.format(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [value, locale, reduce]);

  return (
    <span ref={ref} className={className}>
      {new Intl.NumberFormat(intlLocale[locale]).format(value)}
    </span>
  );
}
