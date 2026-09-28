"use client";

import { useEffect, useState } from "react";
import { useAnimatedNumber } from "@/hooks/use-animated-number";
import { prefersReducedMotion, useInView } from "@/hooks/use-in-view";

const METRICS = [
  {
    prefix: "+",
    value: 100,
    suffix: "%",
    label: "Transparencia financiera",
    text: "Cada ingreso, gasto y saldo de cartera queda a la vista del consejo y de los residentes.",
  },
  {
    prefix: "",
    value: 40,
    suffix: "%",
    label: "Menos tiempo en tareas administrativas",
    text: "Nuestra meta al automatizar recibos, conciliación de pagos y paz y salvos.",
  },
  {
    prefix: "Ley ",
    value: 675,
    suffix: "",
    label: "Propiedad horizontal como base",
    text: "Coeficientes, cuotas, consejo y asamblea tal como los define la Ley 675 de 2001.",
  },
] as const;

type Mode = "static" | "armed" | "run";

export function Metrics() {
  const { ref, inView } = useInView<HTMLDListElement>();
  // Server HTML carries the real figures. After hydration, if the band is
  // still below the fold, reset to zero so it can count up once in view.
  const [mode, setMode] = useState<Mode>("static");

  useEffect(() => {
    const top = ref.current?.getBoundingClientRect().top ?? 0;
    if (top > window.innerHeight && !prefersReducedMotion()) setMode("armed");
  }, [ref]);

  useEffect(() => {
    if (inView && mode === "armed") setMode("run");
  }, [inView, mode]);

  return (
    <section aria-label="Lo que busca DomusCol" className="border-b border-line bg-surface">
      <dl
        ref={ref}
        className="mx-auto grid max-w-page divide-y divide-line px-4 sm:px-6 md:grid-cols-3 md:divide-x md:divide-y-0 lg:px-8"
      >
        {METRICS.map((m) => (
          <Metric key={m.label} {...m} mode={mode} />
        ))}
      </dl>
    </section>
  );
}

function Metric({
  prefix,
  value,
  suffix,
  label,
  text,
  mode,
}: (typeof METRICS)[number] & { mode: Mode }) {
  const animated = useAnimatedNumber(value, { from: 0, duration: 1400, enabled: mode === "run" });
  const current = mode === "static" ? value : animated;

  return (
    <div className="flex flex-col py-10 md:px-10 md:py-14 md:first:pl-0 md:last:pr-0">
      <dt className="order-2 mt-3 text-lg font-semibold text-ink">{label}</dt>
      <dd className="order-1 text-5xl font-extrabold text-ink tabular">
        <span className="sr-only">
          {prefix}
          {value}
          {suffix}
        </span>
        <span aria-hidden>
          {prefix}
          {Math.round(current)}
          {suffix}
        </span>
      </dd>
      <dd className="order-3 mt-1 max-w-[22rem] text-sm text-muted">{text}</dd>
    </div>
  );
}
