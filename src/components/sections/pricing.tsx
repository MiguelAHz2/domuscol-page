"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { SavingsCalculator } from "@/components/sections/savings-calculator";
import { buttonClass } from "@/components/ui/button";
import { monthlyTotal, PLANS, UNITS_RANGE, type Plan } from "@/lib/data/pricing";
import { cn, formatCOP, formatNumber } from "@/lib/utils";

const INCLUDED = [
  "Migración de los datos del conjunto",
  "Capacitación a administración y portería",
  "App para residentes y portería",
  "Soporte por WhatsApp",
];

// One unit count drives the plans and the savings estimate, and travels
// to the demo form as ?unidades=.
export function Pricing() {
  const [units, setUnits] = useState<number>(UNITS_RANGE.initial);
  const fill = ((units - UNITS_RANGE.min) / (UNITS_RANGE.max - UNITS_RANGE.min)) * 100;

  return (
    <>
      <section aria-label="Planes" className="bg-bg py-16 sm:py-20">
        <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,2fr)]">
            <div className="flex flex-col rounded-[20px] border border-line bg-surface p-6 sm:p-7">
              <label htmlFor="unidades-precio" className="font-semibold text-ink">
                ¿Cuántas unidades tiene tu conjunto?
              </label>
              <p className="mt-1 text-sm text-muted">Apartamentos, casas y locales que pagan cuota de administración.</p>
              <output htmlFor="unidades-precio" className="mt-8 block text-5xl font-extrabold text-ink tabular">
                {formatNumber(units)}
                <span className="ml-2 text-lg font-semibold tracking-normal text-muted">unidades</span>
              </output>
              <input
                id="unidades-precio"
                type="range"
                min={UNITS_RANGE.min}
                max={UNITS_RANGE.max}
                step={UNITS_RANGE.step}
                value={units}
                onChange={(e) => setUnits(Number(e.target.value))}
                className="range mt-6 w-full"
                style={{ ["--fill" as string]: `${fill}%` }}
              />
              <div className="mt-2 flex justify-between text-xs text-muted tabular">
                <span>{UNITS_RANGE.min}</span>
                <span>{UNITS_RANGE.max}</span>
              </div>

              <div className="mt-10 border-t border-[rgb(var(--c-ink)/0.1)] pt-6 lg:mt-auto">
                <p className="text-sm font-semibold text-ink">Los dos planes incluyen</p>
                <ul className="mt-3 space-y-2 text-sm">
                  {INCLUDED.map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-emerald-ink" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {PLANS.map((plan) => (
                <PlanCard key={plan.id} plan={plan} units={units} featured={plan.id === "integral"} />
              ))}
            </div>
          </div>

          <p className="mt-6 text-sm text-muted">
            Valores de referencia en pesos colombianos, antes de IVA. Pueden cambiar antes del lanzamiento.
          </p>
        </div>
      </section>

      <SavingsCalculator units={units} />
    </>
  );
}

function PlanCard({ plan, units, featured }: { plan: Plan; units: number; featured: boolean }) {
  const total = monthlyTotal(plan, units);
  const atMinimum = total === plan.minimum && plan.perUnit * units < plan.minimum;

  return (
    <article
      className={cn(
        "flex flex-col rounded-[20px] p-6 sm:p-7",
        featured
          ? "on-navy bg-navy text-white/75 dark:bg-navy-raised dark:ring-1 dark:ring-[rgb(var(--c-emerald)/0.35)]"
          : "border border-line bg-surface",
      )}
    >
      <h3 className={cn("text-xl font-bold", featured && "text-white")}>{plan.name}</h3>
      <p className={cn("mt-1 text-sm", featured ? "text-white/65" : "text-muted")}>{plan.description}</p>

      <p className={cn("mt-7 text-4xl font-extrabold tabular", featured ? "text-white" : "text-ink")}>
        {formatCOP(total)}
      </p>
      <p className={cn("mt-1 text-sm", featured ? "text-white/65" : "text-muted")}>
        {atMinimum ? "al mes, valor mínimo para conjuntos pequeños" : `al mes, ${formatCOP(plan.perUnit)} por unidad`}
      </p>

      <ul className="mt-7 space-y-2.5 text-sm">
        {plan.includes.map((item) => (
          <li key={item} className="flex gap-2.5">
            <Check aria-hidden className={cn("mt-0.5 h-4 w-4 shrink-0", featured ? "text-emerald" : "text-emerald-ink")} />
            <span className={featured ? "text-white/85" : "text-body"}>{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-8">
        <Link
          href={`/contacto?unidades=${units}`}
          className={buttonClass(featured ? "primary" : "outline", "lg", "w-full")}
        >
          Solicitar demo
        </Link>
      </div>
    </article>
  );
}
