import { phaseLabel, type Phase } from "@/lib/data/modules";
import { cn } from "@/lib/utils";

export function PhaseBadge({ phase, className }: { phase: Phase; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        phase === "fase-1"
          ? "bg-[rgb(var(--c-accent)/0.1)] text-accent-ink"
          : "border border-[rgb(var(--c-muted)/0.45)] text-muted",
        className,
      )}
    >
      {phase === "fase-1" && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />}
      {phaseLabel[phase]}
    </span>
  );
}
