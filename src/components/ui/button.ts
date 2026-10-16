import { cn } from "@/lib/utils";

type Variant = "primary" | "espresso" | "outline" | "ghost" | "ghost-on-espresso";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold whitespace-nowrap transition-[background-color,border-color,color,transform,box-shadow] duration-200 active:translate-y-px disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  // Terracota with espresso text (white on terracota is too faint to read);
  // Cobre Suave on hover, as the brand manual sets for hover states.
  primary:
    "bg-accent text-espresso-deep shadow-[0_1px_0_rgb(255_255_255/0.3)_inset,0_8px_20px_-8px_rgb(224_109_68/0.65)] hover:bg-copper hover:shadow-[0_1px_0_rgb(255_255_255/0.3)_inset,0_10px_24px_-8px_rgb(224_109_68/0.7)]",
  espresso:
    "bg-espresso text-white hover:bg-espresso-raised dark:bg-[rgb(var(--c-ink))] dark:text-espresso-deep dark:hover:bg-white",
  outline: "border border-line bg-surface text-ink hover:border-[rgb(var(--c-ink)/0.35)]",
  // Secondary action that follows the theme: ink outline on light, white outline in dark.
  ghost:
    "border border-[rgb(var(--c-ink)/0.2)] text-ink hover:border-[rgb(var(--c-ink)/0.4)] hover:bg-[rgb(var(--c-ink)/0.04)] dark:border-white/20 dark:text-white dark:hover:border-copper/60 dark:hover:bg-white/[0.06]",
  // Only for surfaces that are espresso in both themes (the phone mock, the featured plan).
  "ghost-on-espresso": "border border-white/20 text-white hover:border-copper/60 hover:bg-white/[0.06]",
};

const sizes: Record<Size, string> = {
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}
