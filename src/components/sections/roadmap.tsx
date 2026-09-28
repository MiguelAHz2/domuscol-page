import { Check } from "lucide-react";
import { ROADMAP } from "@/lib/data/roadmap";
import { cn } from "@/lib/utils";

export function Roadmap() {
  return (
    <section aria-labelledby="hoja-de-ruta" className="border-t border-line bg-bg py-20 sm:py-28">
      <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 id="hoja-de-ruta" className="text-3xl font-extrabold sm:text-4xl">
            Hoja de ruta
          </h2>
          <p className="mt-3 text-lg">
            Qué llega primero y qué viene después. Los tiempos son estimados y se ajustan con lo que nos pidan los
            conjuntos piloto.
          </p>
        </div>

        <ol className="relative mt-14 grid gap-12 lg:grid-cols-3 lg:gap-14">
          {/* Connecting line between phases (desktop) */}
          <span aria-hidden className="absolute left-0 right-0 top-[21px] hidden h-px bg-line lg:block" />
          {ROADMAP.map((phase, i) => {
            const current = i === 0;
            return (
              <li key={phase.id} className="relative flex flex-col">
                <span
                  aria-hidden
                  className={cn(
                    "relative z-10 grid h-11 w-11 place-items-center rounded-full border-4 border-bg text-sm font-bold",
                    current ? "bg-emerald text-navy-deep" : "bg-surface text-muted ring-1 ring-line",
                  )}
                >
                  {i + 1}
                </span>
                <article className="mt-6 flex flex-1 flex-col">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xl font-bold">{phase.name}</h3>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        current
                          ? "bg-[rgb(var(--c-emerald)/0.16)] text-emerald-ink"
                          : "border border-[rgb(var(--c-cobalt)/0.35)] text-cobalt",
                      )}
                    >
                      {phase.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-ink">{phase.when}</p>
                  <p className="mt-3 text-sm text-muted">{phase.summary}</p>
                  <ul className="mt-5 space-y-2.5 text-sm">
                    {phase.items.map((item) => (
                      <li key={item} className="flex gap-2.5">
                        <Check
                          aria-hidden
                          className={cn("mt-0.5 h-4 w-4 shrink-0", current ? "text-emerald-ink" : "text-[rgb(var(--c-muted)/0.7)]")}
                        />
                        <span className="text-body">{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
