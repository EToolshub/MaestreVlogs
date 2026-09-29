"use client";

import { MotionConfig } from "framer-motion";

/** Respeta la preferencia "reducir movimiento" del sistema en todas las animaciones. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
