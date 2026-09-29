import { cn } from "@/lib/utils";

/** Cinta infinita horizontal. Se pausa al pasar el cursor. */
export function Marquee({
  items,
  className,
  itemClassName,
  separatorClassName,
  reverse,
}: {
  items: string[];
  className?: string;
  itemClassName?: string;
  separatorClassName?: string;
  reverse?: boolean;
}) {
  const loop = [...items, ...items];
  return (
    <div
      className={cn(
        "group relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        className
      )}
    >
      <div
        className={cn(
          "flex w-max shrink-0 items-center group-hover:[animation-play-state:paused]",
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        )}
      >
        {loop.map((item, index) => (
          <span
            key={`${item}-${index}`}
            aria-hidden={index >= items.length || undefined}
            className={cn("flex items-center whitespace-nowrap", itemClassName)}
          >
            {item}
            <span className={cn("mx-7 inline-block h-2 w-2 rounded-full bg-rec-400", separatorClassName)} />
          </span>
        ))}
      </div>
    </div>
  );
}
