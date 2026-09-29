import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "whatsapp" | "dark";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-bold transition-all duration-300 ease-out select-none whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 disabled:opacity-45 disabled:pointer-events-none active:scale-[0.97]";

// Primario: texto negro sobre amarillo, contraste 12:1.
const variants: Record<Variant, string> = {
  primary:
    "bg-brand-400 text-ink-950 shadow-[0_8px_30px_-8px_rgb(255_194_26/0.55)] hover:bg-brand-300 hover:shadow-[0_12px_40px_-8px_rgb(255_194_26/0.7)] hover:-translate-y-0.5",
  secondary:
    "border border-ink-600 bg-white/[0.03] text-heading backdrop-blur hover:border-brand-400/70 hover:bg-brand-400/10 hover:-translate-y-0.5",
  ghost: "bg-transparent text-body-strong hover:bg-white/5 hover:text-white",
  whatsapp:
    "bg-whatsapp text-ink-950 shadow-[0_8px_30px_-10px_rgb(37_211_102/0.6)] hover:brightness-110 hover:-translate-y-0.5",
  dark: "bg-ink-950 text-white hover:bg-ink-800 hover:-translate-y-0.5",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-[15px]",
  lg: "h-14 px-7 text-base sm:px-8",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps & {
  href: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
};

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "primary", size = "md", fullWidth, icon, iconPosition = "left", className, children } = props;

  const classes = cn(base, variants[variant], sizes[size], fullWidth && "w-full", className);

  const content = (
    <>
      {variant === "primary" && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-[120%] bg-gradient-to-r from-transparent via-white/50 to-transparent group-hover/btn:animate-shine"
        />
      )}
      {icon && iconPosition === "left" && <span className="relative flex shrink-0">{icon}</span>}
      <span className="relative">{children}</span>
      {icon && iconPosition === "right" && (
        <span className="relative flex shrink-0 transition-transform duration-300 group-hover/btn:translate-x-0.5">
          {icon}
        </span>
      )}
    </>
  );

  if ("href" in props && props.href) {
    const isExternal = /^(https?:|mailto:)/.test(props.href);
    const opensTab = props.href.startsWith("http");
    return (
      <Link
        href={props.href}
        target={props.target ?? (opensTab ? "_blank" : undefined)}
        rel={props.rel ?? (isExternal ? "noopener noreferrer" : undefined)}
        onClick={props.onClick}
        className={classes}
      >
        {content}
      </Link>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- se extraen para excluirlas del <button> nativo
  const { variant: _v, size: _s, fullWidth: _f, icon: _i, iconPosition: _ip, className: _c, children: _ch, ...nativeProps } =
    props as ButtonAsButton;

  return (
    <button {...nativeProps} className={classes}>
      {content}
    </button>
  );
}
