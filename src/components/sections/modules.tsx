"use client";

import { useState } from "react";
import Image, { type StaticImageData } from "next/image";
import acceso from "@/assets/images/acceso-conjunto.jpg";
import administracion from "@/assets/images/administracion.jpg";
import mantenimiento from "@/assets/images/mantenimiento.jpg";
import piscina from "@/assets/images/piscina-conjunto.jpg";
import residente from "@/assets/images/residente-celular.jpg";
import { Vignette } from "@/components/modules/vignettes";
import { PhaseBadge } from "@/components/ui/phase-badge";
import { featureCount, MODULES, type ModuleCategory, type Phase } from "@/lib/data/modules";
import { cn } from "@/lib/utils";

type Filter = "todo" | Phase;

const FILTERS: { id: Filter; label: string; count: number }[] = [
  { id: "todo", label: "Todo", count: featureCount() },
  { id: "fase-1", label: "Fase 1", count: featureCount("fase-1") },
  { id: "proximamente", label: "Próximamente", count: featureCount("proximamente") },
];

// The place each module lives in, photographed.
const PHOTOS: Record<string, { src: StaticImageData; alt: string; position: string; credit: string }> = {
  finanzas: {
    src: administracion,
    alt: "Administradora revisando la cartera del conjunto en su portátil",
    position: "38% 40%",
    credit: "Vitaly Gariev",
  },
  seguridad: {
    src: acceso,
    alt: "Entrada de un edificio residencial con portón de acceso",
    position: "50% 72%",
    credit: "H D",
  },
  reservas: {
    src: piscina,
    alt: "Piscina de un conjunto residencial rodeada de torres de apartamentos",
    position: "50% 70%",
    credit: "Lia Angg",
  },
  convivencia: {
    src: residente,
    alt: "Residente leyendo una circular del conjunto en su celular",
    position: "46% 35%",
    credit: "Julio López",
  },
  mantenimiento: {
    src: mantenimiento,
    alt: "Electricista revisando el tablero eléctrico de un edificio",
    position: "50% 35%",
    credit: "colsan ltda",
  },
};

export function Modules() {
  const [filter, setFilter] = useState<Filter>("todo");
  const current = FILTERS.find((f) => f.id === filter)!;

  return (
    <section id="modulos" aria-label="Módulos por categoría" className="bg-surface">
      {/* Floating filter: glass, because content scrolls under it */}
      <div className="pointer-events-none sticky top-[5.25rem] z-30 px-4 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-page justify-end">
          <div role="group" aria-label="Ver funciones" className="glass glass-strong pointer-events-auto inline-flex rounded-2xl p-1">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={filter === f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "flex h-9 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold transition-colors duration-200 sm:px-4",
                  filter === f.id ? "bg-navy text-white dark:bg-white/15" : "text-muted hover:text-ink",
                )}
              >
                {f.label}
                <span className={cn("text-xs font-medium tabular", filter === f.id ? "text-white/70" : "text-muted")}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {filter === "todo" ? `Mostrando las ${current.count} funciones` : `Resaltando ${current.count} funciones de ${current.label}`}
      </p>

      <div className="mx-auto max-w-page px-4 pb-10 sm:px-6 lg:px-8">
        {MODULES.map((category, i) => (
          <Chapter key={category.id} category={category} filter={filter} reverse={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}

function Chapter({ category, filter, reverse }: { category: ModuleCategory; filter: Filter; reverse: boolean }) {
  const Icon = category.icon;
  const photo = PHOTOS[category.id];

  return (
    <article
      id={category.id}
      aria-labelledby={`${category.id}-titulo`}
      className="grid scroll-mt-40 items-center gap-14 border-b border-line py-16 last:border-0 sm:py-20 lg:grid-cols-2 lg:gap-20"
    >
      <div className={cn("relative pb-10", reverse && "lg:order-2")}>
        <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-navy sm:aspect-[4/3]">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            placeholder="blur"
            className="object-cover"
            style={{ objectPosition: photo.position }}
          />
          <p className={cn("absolute top-3 text-[11px] text-white/80 [text-shadow:0_1px_2px_rgb(0_0_0/0.6)]", reverse ? "left-4" : "right-4")}>
            Foto: {photo.credit}, Unsplash
          </p>
        </div>
        <div
          className={cn(
            "glass glass-strong absolute bottom-0 w-[min(88%,21rem)] rounded-[20px] p-4",
            reverse ? "left-4 sm:left-6" : "right-4 sm:right-6",
          )}
        >
          <Vignette kind={category.vignette} />
        </div>
      </div>

      <div>
        <div className="flex items-center gap-3 text-cobalt">
          <Icon aria-hidden className="h-5 w-5" />
          <span className="text-sm font-semibold">
            {category.features.filter((f) => f.phase === "fase-1").length} de {category.features.length} en Fase 1
          </span>
        </div>
        <h2 id={`${category.id}-titulo`} className="mt-3 text-3xl font-extrabold sm:text-4xl">
          {category.title}
        </h2>
        <p className="mt-3 text-lg">{category.summary}</p>

        <ul className="mt-8 border-t border-line">
          {category.features.map((feature) => {
            const dimmed = filter !== "todo" && feature.phase !== filter;
            return (
              <li key={feature.title} className={cn("border-b border-line py-4 transition-opacity duration-300", dimmed && "opacity-30")}>
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-semibold leading-snug">{feature.title}</h3>
                  <PhaseBadge phase={feature.phase} />
                </div>
                <p className="mt-1 text-sm text-muted">{feature.description}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </article>
  );
}
