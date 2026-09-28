import { phaseLabel, type Phase } from "@/lib/data/modules";
import { cn } from "@/lib/utils";

export function PhaseBadge({ phase, className }: { phase: Phase; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        phase === "fase-1"
          ? "bg-[rgb(var(--c-emerald)/0.14)] text-emerald-ink"
          : "border border-[rgb(var(--c-cobalt)/0.35)] text-cobalt",
        className,
      )}
    >
      {phase === "fase-1" && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-emerald" />}
      {phaseLabel[phase]}
    </span>
  );
}
