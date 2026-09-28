import type { Metadata } from "next";
import { FinalCta } from "@/components/layout/final-cta";
import brickTower from "@/assets/images/edificio-ladrillo.jpg";
import { PageHero } from "@/components/layout/page-hero";
import { Modules } from "@/components/sections/modules";
import { Roadmap } from "@/components/sections/roadmap";
import { featureCount } from "@/lib/data/modules";

const description =
  "Pagos en línea, paz y salvos, visitantes con QR, reservas, PQR, asambleas virtuales y mantenimiento: los módulos de DomusCol por fase.";

export const metadata: Metadata = {
  title: "Módulos",
  description,
  alternates: { canonical: "/modulos" },
  openGraph: { title: "Módulos de DomusCol", description, url: "/modulos" },
};

export default function ModulosPage() {
  return (
    <>
      <PageHero
        title="Todo lo que traerá DomusCol"
        lead="Cinco frentes de la vida en copropiedad. Lo marcado como Fase 1 llega con el lanzamiento; el resto se suma en las fases siguientes."
        image={{ src: brickTower, alt: "Torre residencial de ladrillo en Bogotá", position: "70% 45%", credit: "Victor Rosario" }}
      >
        <ul className="flex flex-wrap gap-2">
          <li className="rounded-full border border-white/20 px-3.5 py-1.5 text-sm font-medium text-white">
            <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-emerald" aria-hidden />
            {featureCount("fase-1")} funciones en Fase 1
          </li>
          <li className="rounded-full border border-white/20 px-3.5 py-1.5 text-sm font-medium text-white/80">
            {featureCount("proximamente")} en las fases siguientes
          </li>
        </ul>
      </PageHero>
      <Modules />
      <Roadmap />
      <FinalCta title="¿Qué módulo necesita primero tu conjunto?" />
    </>
  );
}
