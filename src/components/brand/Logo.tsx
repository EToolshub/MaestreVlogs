import { cn } from "@/lib/utils";

/**
 * Isotipo: visor de cámara con la "M" y el punto REC.
 * Todo en SVG para que se vea nítido en cualquier tamaño.
 */
export function LogoMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <rect width="48" height="48" rx="12" fill="#ffc21a" />
      {/* Esquinas del visor */}
      <path
        d="M9 16V11a2 2 0 0 1 2-2h5M32 9h5a2 2 0 0 1 2 2v5M39 32v5a2 2 0 0 1-2 2h-5M16 39h-5a2 2 0 0 1-2-2v-5"
        fill="none"
        stroke="#0d0d0c"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path d="M15 32V17h3.6l5.4 8.2 5.4-8.2H33v15h-3.6v-9.2L24 30.6l-5.4-7.8V32Z" fill="#0d0d0c" />
      <circle cx="35.5" cy="12.5" r="3.2" fill="#e5362b" />
    </svg>
  );
}

export function Logo({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="h-9 w-9 shrink-0" />
      {!compact && (
        <span className="font-display text-[1.45rem] leading-none tracking-wide">
          <span className="text-heading">Maestre</span>
          <span className="text-brand-400">Vlogs</span>
        </span>
      )}
    </span>
  );
}
