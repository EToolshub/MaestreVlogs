"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyEmail({ email, label, copiedLabel }: { email: string; label: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(email);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        } catch {
          // Sin permiso de portapapeles: el enlace mailto sigue disponible.
        }
      }}
      className="inline-flex items-center gap-1.5 rounded-full border border-ink-600 px-3 py-1.5 text-xs font-semibold text-body transition-colors hover:border-brand-400/60 hover:text-heading"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-brand-400" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
      {copied ? copiedLabel : label}
    </button>
  );
}
