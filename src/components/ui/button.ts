import { cn } from "@/lib/utils";

type Variant = "primary" | "navy" | "outline" | "ghost-on-navy";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold whitespace-nowrap transition-[background-color,border-color,color,transform,box-shadow] duration-200 active:translate-y-px disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-emerald text-navy-deep shadow-[0_1px_0_rgb(255_255_255/0.35)_inset,0_8px_20px_-8px_rgb(16_185_129/0.7)] hover:bg-[rgb(var(--c-emerald)/0.9)] hover:shadow-[0_1px_0_rgb(255_255_255/0.35)_inset,0_10px_24px_-8px_rgb(16_185_129/0.85)]",
  navy: "bg-navy text-white hover:bg-navy-raised dark:bg-cobalt dark:text-navy-deep dark:hover:bg-[rgb(var(--c-cobalt)/0.9)]",
  outline: "border border-line bg-surface text-ink hover:border-[rgb(var(--c-ink)/0.35)]",
  "ghost-on-navy": "border border-white/20 text-white hover:border-white/40 hover:bg-white/[0.07]",
};

const sizes: Record<Size, string> = {
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}
