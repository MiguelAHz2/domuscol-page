"use client";

import { useState } from "react";
import { ChevronDown, Clock } from "lucide-react";
import { useAnimatedNumber } from "@/hooks/use-animated-number";
import { cn, formatNumber } from "@/lib/utils";

// Estimate of monthly admin time DomusCol takes off the administration.
// Assumptions are shown on the page; they are deliberately conservative.
const TASKS = [
  {
    id: "cobro",
    label: "Cuentas de cobro y recordatorios",
    assumption: "2 minutos por unidad al mes; se automatiza el 90 %.",
    minutesPerUnit: 2,
    saved: 0.9,
  },
  {
    id: "conciliacion",
    label: "Conciliación de pagos",
    assumption: "3 minutos por unidad al mes cruzando extractos; se automatiza el 80 %.",
    minutesPerUnit: 3,
    saved: 0.8,
  },
  {
    id: "paz-y-salvo",
    label: "Paz y salvos y estados de cuenta",
    assumption: "El 5 % de las unidades pide uno al mes, 15 minutos cada uno; se automatiza el 95 %.",
    minutesPerUnit: 0.75,
    saved: 0.95,
  },
  {
    id: "atencion",
    label: "Reservas y PQR por teléfono o cuaderno",
    assumption: "Una consulta por cada 5 unidades al mes, 5 minutos cada una; la app resuelve el 60 %.",
    minutesPerUnit: 1,
    saved: 0.6,
  },
] as const;

export function SavingsCalculator({ units }: { units: number }) {
  const [showAssumptions, setShowAssumptions] = useState(false);
  const rows = TASKS.map((t) => ({ ...t, hours: (units * t.minutesPerUnit * t.saved) / 60 }));
  const total = rows.reduce((sum, r) => sum + r.hours, 0);
  const max = Math.max(...rows.map((r) => r.hours));
  const animated = useAnimatedNumber(total, { duration: 450 });

  return (
    <section aria-labelledby="ahorro-titulo" className="bg-bg pb-20 sm:pb-28">
      <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 rounded-[24px] border border-line bg-surface p-6 sm:p-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12 lg:p-10">
          <div>
            <h2 id="ahorro-titulo" className="text-3xl font-extrabold sm:text-4xl">
              Cuánto tiempo le devuelve a la administración
            </h2>
            <p className="mt-3">
              Para <span className="font-semibold text-ink tabular">{formatNumber(units)} unidades</span>, según el
              número que elegiste arriba.
            </p>
            <p className="mt-8 flex items-end gap-3">
              <span className="text-6xl font-extrabold leading-none text-ink tabular" aria-live="polite">
                {formatNumber(animated, 0)}
              </span>
              <span className="pb-1.5 text-lg font-semibold text-muted">horas al mes</span>
            </p>
            <p className="mt-3 flex items-center gap-2 text-sm text-body">
              <Clock aria-hidden className="h-4 w-4 text-emerald-ink" />
              Cerca de {formatNumber(total / 8, 1)} días de trabajo que puede dedicar al consejo y a los residentes.
            </p>
          </div>

          <div>
            <ul className="space-y-4">
              {rows.map((r) => (
                <li key={r.id}>
                  <div className="flex items-baseline justify-between gap-4 text-sm">
                    <span className="text-body">{r.label}</span>
                    <span className="shrink-0 font-semibold text-ink tabular">{formatNumber(r.hours, 1)} h</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[rgb(var(--c-ink)/0.08)]">
                    <div
                      className="h-full rounded-full bg-emerald transition-[width] duration-500"
                      style={{ width: `${(r.hours / max) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => setShowAssumptions((v) => !v)}
              aria-expanded={showAssumptions}
              aria-controls="supuestos"
              className="mt-6 flex items-center gap-1.5 text-sm font-semibold text-cobalt"
            >
              Ver los supuestos del cálculo
              <ChevronDown aria-hidden className={cn("h-4 w-4 transition-transform", showAssumptions && "rotate-180")} />
            </button>
            <div id="supuestos" data-open={showAssumptions} aria-hidden={!showAssumptions} className="collapsible">
              <div>
                <ul className="mt-3 space-y-1.5 text-xs text-muted">
                  {TASKS.map((t) => (
                    <li key={t.id}>
                      <span className="font-semibold text-body">{t.label}:</span> {t.assumption}
                    </li>
                  ))}
                  <li>Es una estimación de referencia; cada conjunto trabaja distinto.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
