import { ISOTYPE, ISOTYPE_VIEWBOX } from "@/components/brand/isotype";
import { cn } from "@/lib/utils";

// Official DomusCol identity ("Torres Horizontales"). The main tower and the
// horizon line take the text colour, so the same mark works in espresso on
// light grounds and in white on dark ones; the cornice and the right tower
// are always terracota.

export function Isotipo({ className }: { className?: string }) {
  return (
    <svg viewBox={ISOTYPE_VIEWBOX} aria-hidden className={cn("h-8 w-auto", className)}>
      <path className="fill-accent" d={ISOTYPE.core} />
      <path fill="currentColor" fillRule="evenodd" d={ISOTYPE.structure} />
      <path className="fill-accent" fillRule="evenodd" d={ISOTYPE.roof} />
      <path fill="currentColor" d={ISOTYPE.keystone} />
    </svg>
  );
}

/** App icon (kit asset 09): white towers on an espresso tile, for notifications. */
export function AppIcon({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid shrink-0 place-items-center rounded-[28%] bg-[#181412] text-white ring-1 ring-inset ring-[rgb(224_109_68/0.3)]",
        className,
      )}
    >
      <Isotipo className="h-[62%] w-auto" />
    </span>
  );
}

/**
 * Isotipo + wordmark: "Domus" in ExtraBold and "Col" in Medium terracota, as
 * in the manual. Espresso on light surfaces, white in dark mode; pass a text
 * colour to force one. `tagline` adds the "Soluciones Integradas" line.
 */
export function Logo({ className, tagline = false }: { className?: string; tagline?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-espresso dark:text-white", className)}>
      <Isotipo className="h-8" />
      <span className="flex flex-col">
        <span className="text-[1.25rem] font-extrabold leading-none tracking-[-0.04em]">
          Domus<span className="font-medium text-accent">Col</span>
        </span>
        {tagline && (
          <span className="mt-1.5 flex items-center gap-1.5 text-[0.5625rem] font-bold uppercase leading-none tracking-[0.3em] text-muted dark:text-white/60">
            <span aria-hidden className="h-[2px] w-3.5 rounded-full bg-accent" />
            Soluciones Integradas
          </span>
        )}
      </span>
    </span>
  );
}
