import { MODULES } from "@/lib/data/modules";

export interface RoadmapPhase {
  id: string;
  name: string;
  when: string;
  status: "En desarrollo" | "Planeada";
  summary: string;
  items: string[];
}

// Phase 2 and 3 split of the "Próximamente" features. Timing is an
// estimate and should be confirmed by the product team.
const LATER: Record<string, 2 | 3> = {
  "Presupuesto, contabilidad e informes para asamblea": 2,
  "Votaciones y asambleas virtuales": 2,
  "Depósitos y normas de uso": 2,
  "Citofonía virtual": 3,
  "Mantenimientos preventivos": 3,
  "Directorio de proveedores verificados": 3,
};

const features = MODULES.flatMap((m) => m.features);

export const ROADMAP: RoadmapPhase[] = [
  {
    id: "fase-1",
    name: "Fase 1",
    when: "Lanzamiento",
    status: "En desarrollo",
    summary: "Lo esencial para ordenar el recaudo, la portería y la comunicación del conjunto.",
    items: features.filter((f) => f.phase === "fase-1").map((f) => f.title),
  },
  {
    id: "fase-2",
    name: "Fase 2",
    when: "Unos seis meses después",
    status: "Planeada",
    summary: "La gestión del consejo y la asamblea: presupuesto, informes y decisiones en línea.",
    items: features.filter((f) => LATER[f.title] === 2).map((f) => f.title),
  },
  {
    id: "fase-3",
    name: "Fase 3",
    when: "Durante el primer año",
    status: "Planeada",
    summary: "Servicios alrededor del conjunto: citofonía, mantenimiento y proveedores.",
    items: features.filter((f) => LATER[f.title] === 3).map((f) => f.title),
  },
];
