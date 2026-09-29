"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Barra superior amarilla que indica el avance de lectura. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="no-print fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-gradient-to-r from-rec-400 via-brand-400 to-brand-200"
    />
  );
}
