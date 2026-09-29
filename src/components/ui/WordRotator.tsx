"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/** Rota entre varias palabras con una transición vertical. */
export function WordRotator({
  words,
  interval = 2400,
  className,
}: {
  words: string[];
  interval?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
    return () => window.clearInterval(id);
  }, [words.length, interval, reduce]);

  // La palabra más larga reserva el ancho para que el titular no "salte".
  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), "");

  return (
    <span className="relative inline-grid align-bottom">
      <span className={`invisible col-start-1 row-start-1 ${className ?? ""}`} aria-hidden>
        {longest}
      </span>
      <span className="sr-only">{words[0]}</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={words[index]}
          aria-hidden
          initial={{ y: "70%", opacity: 0, filter: "blur(8px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-70%", opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className={`col-start-1 row-start-1 ${className ?? ""}`}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
