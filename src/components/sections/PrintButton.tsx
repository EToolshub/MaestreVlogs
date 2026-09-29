"use client";

import { FileDown } from "lucide-react";

/** Abre el diálogo de impresión: la hoja de estilos "print" genera el PDF. */
export function PrintButton({ label, hint }: { label: string; hint: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="group flex w-full items-center gap-4 rounded-2xl border border-ink-600 p-4 text-left transition-colors hover:border-brand-400/60"
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-400 text-ink-950">
        <FileDown className="h-5 w-5" aria-hidden />
      </span>
      <span>
        <span className="block font-bold text-heading group-hover:text-brand-300">{label}</span>
        <span className="block text-sm text-muted">{hint}</span>
      </span>
    </button>
  );
}
