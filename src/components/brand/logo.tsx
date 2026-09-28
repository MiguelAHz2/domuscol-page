import { cn } from "@/lib/utils";

// Isotipo: two towers drawn only by their windows, one of them lit in
// emerald — the same "unidad al día" signal used across the product.
const windows: Array<[number, number]> = [
  [7, 6], [11.5, 6],
  [7, 10.5],
  [7, 15], [11.5, 15], [17, 15], [21.5, 15],
  [7, 19.5], [11.5, 19.5], [17, 19.5], [21.5, 19.5],
];

export function Isotipo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn("h-8 w-8", className)}>
      <rect width="32" height="32" rx="8" className="fill-white/[0.08]" />
      <rect x=".5" y=".5" width="31" height="31" rx="7.5" fill="none" className="stroke-white/15" />
      <g className="fill-white">
        {windows.map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="3.5" height="3.5" rx=".8" />
        ))}
      </g>
      <rect x="11.5" y="10.5" width="3.5" height="3.5" rx=".8" className="fill-emerald" />
      <rect x="6" y="24.5" width="20" height="1.5" rx=".75" className="fill-white/50" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Isotipo />
      <span className="text-[1.1875rem] font-extrabold tracking-[-0.02em] text-white">DomusCol</span>
    </span>
  );
}
