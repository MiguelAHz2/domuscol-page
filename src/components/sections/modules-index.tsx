import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MODULES } from "@/lib/data/modules";
import { PLANS } from "@/lib/data/pricing";
import { formatCOP } from "@/lib/utils";

// Home index of the five modules: a list, not a card grid. Each row says
// what the module covers and how much of it arrives in Fase 1.
export function ModulesIndex() {
  const cheapest = Math.min(...PLANS.map((p) => p.perUnit));

  return (
    <section aria-labelledby="indice-modulos" className="bg-surface py-20 sm:py-28">
      <div className="mx-auto grid max-w-page gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20 lg:px-8">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 id="indice-modulos" className="text-4xl font-extrabold sm:text-5xl">
            Cinco módulos, un solo lugar
          </h2>
          <p className="mt-4 text-lg">
            Todo lo que hoy vive en hojas de cálculo, cuadernos y grupos de WhatsApp, organizado por frente.
          </p>
          <p className="mt-8 text-sm text-muted">
            Desde <span className="font-semibold text-ink tabular">{formatCOP(cheapest)}</span> por unidad al mes.{" "}
            <Link href="/precios" className="font-semibold text-cobalt underline-offset-4 hover:underline">
              Ver precios
            </Link>
          </p>
        </div>

        <ul className="border-t border-line">
          {MODULES.map((m) => {
            const first = m.features.filter((f) => f.phase === "fase-1").length;
            const Icon = m.icon;
            return (
              <li key={m.id} className="border-b border-line">
                <Link href={`/modulos#${m.id}`} className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-5 py-6 sm:py-7">
                  <Icon aria-hidden className="mt-1 h-5 w-5 text-cobalt" />
                  <div>
                    <h3 className="text-xl font-bold decoration-2 underline-offset-4 group-hover:underline">{m.title}</h3>
                    <p className="mt-1.5 text-body">{m.summary}</p>
                    <p className="mt-3 text-sm text-muted">
                      {m.features.length} funciones
                      {first > 0 ? `, ${first} en Fase 1` : ", todas en las fases siguientes"}
                    </p>
                  </div>
                  <ArrowUpRight
                    aria-hidden
                    className="mt-1 h-5 w-5 text-muted transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
