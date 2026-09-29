"use client";

import type { PointerEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Tarjeta con borde y brillo amarillo que siguen al cursor (ver `.spotlight`
 * en globals.css). Actualiza variables CSS directamente, sin re-render.
 */
export function SpotlightCard({ children, className }: { children: ReactNode; className?: string }) {
  function handleMove(e: PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }

  return (
    <div
      onPointerMove={handleMove}
      className={cn("spotlight rounded-3xl border border-default bg-card transition-colors duration-300", className)}
    >
      {children}
    </div>
  );
}
