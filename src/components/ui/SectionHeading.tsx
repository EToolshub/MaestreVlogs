import { cn } from "@/lib/utils";

/** Etiqueta tipo "capítulo" de cámara: ● 02 — AUDIENCIA */
export function Eyebrow({
  children,
  index,
  className,
}: {
  children: React.ReactNode;
  index?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-brand-300",
        className
      )}
    >
      <span className="h-2 w-2 rounded-full bg-rec-400 shadow-[0_0_12px_2px_rgb(255_69_58/0.55)]" />
      {index && <span className="text-muted">{index} —</span>}
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  index,
  title,
  highlight,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  index?: string;
  title: string;
  /** Parte final del título que se pinta en amarillo de marca. */
  highlight?: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" ? "mx-auto text-center" : "text-left", className)}>
      {eyebrow && <Eyebrow index={index}>{eyebrow}</Eyebrow>}
      <h2 className="font-display text-balance mt-5 text-[2.6rem] leading-[0.95] text-heading sm:text-6xl lg:text-7xl">
        {title}
        {highlight && (
          <>
            {" "}
            <span className="text-brand-400">{highlight}</span>
          </>
        )}
      </h2>
      {description && (
        <p
          className={cn(
            "text-pretty mt-6 max-w-2xl text-lg leading-relaxed text-body",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
