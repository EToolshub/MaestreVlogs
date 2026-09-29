"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { intlLocale, type Locale } from "@/i18n/config";

/** Número que cuenta desde 0 cuando entra en pantalla, con formato local. */
export function CountUp({
  to,
  locale,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1.6,
}: {
  to: number;
  locale: Locale;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();

  const format = (value: number) =>
    `${prefix}${new Intl.NumberFormat(intlLocale[locale], {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value)}${suffix}`;

  useEffect(() => {
    const node = ref.current;
    if (!inView || !node || reduce) return;
    const fmt = new Intl.NumberFormat(intlLocale[locale], {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (value) => {
        node.textContent = `${prefix}${fmt.format(value)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, reduce, to, prefix, suffix, duration, decimals, locale]);

  // El HTML del servidor ya trae el valor final (sirve sin JS, para SEO y para imprimir).
  return <span ref={ref}>{format(to)}</span>;
}
