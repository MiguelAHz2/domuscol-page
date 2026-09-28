"use client";

import { Lock, MessageSquareWarning, Package, Wallet, type LucideIcon } from "lucide-react";
import { Facade } from "@/components/hero/facade";
import { useAnimatedNumber } from "@/hooks/use-animated-number";
import { CONJUNTO, type ActivityItem, type Unit } from "@/lib/data/units";
import { cn, formatCOP } from "@/lib/utils";

interface AdminPanelProps {
  units: Unit[];
  residentUnitId: string;
  justPaidId: string | null;
  activity: ActivityItem[];
}

const activityIcon: Record<ActivityItem["kind"], LucideIcon> = {
  pago: Wallet,
  pqr: MessageSquareWarning,
  paquete: Package,
  visitante: Package,
};

export function AdminPanel({ units, residentUnitId, justPaidId, activity }: AdminPanelProps) {
  const paid = units.filter((u) => u.status === "al-dia").length;
  const pending = units.filter((u) => u.status === "pendiente").length;
  const overdue = units.length - paid - pending;
  const expected = units.length * CONJUNTO.cuota;
  const collected = paid * CONJUNTO.cuota;
  const percent = (collected / expected) * 100;

  const animatedPercent = useAnimatedNumber(percent, { duration: 700 });
  const animatedCollected = useAnimatedNumber(collected, { duration: 700 });

  return (
    <div className="overflow-hidden rounded-[20px] border border-white/70 bg-surface shadow-float dark:border-white/10">
      {/* Browser chrome */}
      <div className="flex h-10 items-center gap-3 border-b border-line bg-surface-2 px-4">
        <div aria-hidden className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-1.5 truncate rounded-md bg-surface px-2.5 py-1 text-[11px] text-muted">
          <Lock aria-hidden className="h-3 w-3 shrink-0" />
          <span className="truncate">{CONJUNTO.subdomain}/cartera</span>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-muted">{CONJUNTO.name}</p>
            <p className="text-base font-bold text-ink">Cartera de {CONJUNTO.period}</p>
          </div>
          <p className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-medium text-body">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-emerald" />
            Actualizado ahora
          </p>
        </div>

        <div className="mt-4 flex items-end gap-4">
          <div className="shrink-0">
            <p className="text-4xl font-extrabold leading-none tracking-[-0.03em] text-ink tabular" aria-live="polite">
              {Math.round(animatedPercent)}%
            </p>
            <p className="mt-1 text-xs text-muted">recaudado</p>
          </div>
          <div className="min-w-0 flex-1 pb-1">
            <div
              className="h-2 overflow-hidden rounded-full bg-surface-2"
              role="progressbar"
              aria-label="Recaudo del mes"
              aria-valuenow={Math.round(percent)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className="h-full rounded-full bg-emerald transition-[width] duration-700" style={{ width: `${percent}%` }} />
            </div>
            <p className="mt-2 truncate text-xs text-muted tabular">
              <span className="font-semibold text-ink">{formatCOP(Math.round(animatedCollected / 1000) * 1000)}</span> de{" "}
              {formatCOP(expected)}
            </p>
          </div>
        </div>

        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-body tabular">
          <Legend swatch="bg-emerald" label="Al día" value={paid} />
          <Legend swatch="bg-window" label="Pendiente" value={pending} />
          <Legend swatch="bg-amber" label="En mora" value={overdue} />
        </ul>

        <div className="mt-4">
          <Facade units={units} residentUnitId={residentUnitId} justPaidId={justPaidId} />
        </div>

        <div className="mt-3 hidden border-t border-line pt-3 sm:block">
          <p className="text-xs font-semibold text-ink">Actividad reciente</p>
          <ul className="mt-2 space-y-2">
            {activity.map((item, i) => {
              const Icon = activityIcon[item.kind];
              return (
                <li key={item.id} className={cn("flex items-center gap-2.5", i === 0 && item.time === "ahora" && "animate-slide-in")}>
                  <span
                    className={cn(
                      "grid h-7 w-7 shrink-0 place-items-center rounded-lg",
                      item.kind === "pago" ? "bg-[rgb(var(--c-emerald)/0.14)] text-emerald-ink" : "bg-surface-2 text-body",
                    )}
                  >
                    <Icon aria-hidden className="h-3.5 w-3.5" />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[13px] text-ink">{item.text}</span>
                  <span className="shrink-0 text-[11px] text-muted">{item.time}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Legend({ swatch, label, value }: { swatch: string; label: string; value: number }) {
  return (
    <li className="flex items-center gap-1.5">
      <span aria-hidden className={cn("h-2.5 w-2 rounded-[2px]", swatch)} />
      {label} <span className="font-semibold text-ink">{value}</span>
    </li>
  );
}
