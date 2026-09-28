import { CalendarDays, Landmark, Megaphone, ShieldCheck, Wrench, type LucideIcon } from "lucide-react";

export type Phase = "fase-1" | "proximamente";

export const phaseLabel: Record<Phase, string> = {
  "fase-1": "Fase 1",
  proximamente: "Próximamente",
};

export interface Feature {
  title: string;
  description: string;
  phase: Phase;
}

export type VignetteKind = "paz-y-salvo" | "pase-qr" | "reservas" | "votacion" | "mantenimiento";

export interface ModuleCategory {
  id: string;
  title: string;
  summary: string;
  icon: LucideIcon;
  vignette: VignetteKind;
  features: Feature[];
}

export const MODULES: ModuleCategory[] = [
  {
    id: "finanzas",
    title: "Administración y finanzas",
    summary: "El recaudo y la contabilidad del conjunto en un solo lugar, visibles para quien corresponde.",
    icon: Landmark,
    vignette: "paz-y-salvo",
    features: [
      {
        title: "Pago en línea de la cuota de administración",
        description: "PSE, tarjetas, Nequi y Daviplata. Cada pago queda conciliado con la unidad que lo hizo.",
        phase: "fase-1",
      },
      {
        title: "Paz y salvo y estado de cuenta al instante",
        description: "El residente los descarga en PDF cuando los necesite, sin pedirlos en la oficina.",
        phase: "fase-1",
      },
      {
        title: "Presupuesto, contabilidad e informes para asamblea",
        description: "Ejecución presupuestal mes a mes e informe de gestión listo para presentar.",
        phase: "proximamente",
      },
    ],
  },
  {
    id: "seguridad",
    title: "Seguridad y control de accesos",
    summary: "Portería sabe quién entra, a qué unidad va y qué llegó para cada apartamento.",
    icon: ShieldCheck,
    vignette: "pase-qr",
    features: [
      {
        title: "Visitantes con código QR temporal",
        description: "El residente genera el pase, el guarda lo escanea y el ingreso queda registrado.",
        phase: "fase-1",
      },
      {
        title: "Citofonía virtual",
        description: "Portería llama directo al celular del residente, sin citófono en el apartamento.",
        phase: "proximamente",
      },
      {
        title: "Minuta digital y correspondencia",
        description: "Novedades del turno, rondas y paquetes recibidos, con aviso inmediato al residente.",
        phase: "fase-1",
      },
    ],
  },
  {
    id: "reservas",
    title: "Reservas y zonas comunes",
    summary: "Salón social, BBQ, gimnasio, zonas húmedas y canchas, sin cuaderno de reservas.",
    icon: CalendarDays,
    vignette: "reservas",
    features: [
      {
        title: "Reserva en línea",
        description: "Disponibilidad en tiempo real y confirmación inmediata.",
        phase: "fase-1",
      },
      {
        title: "Depósitos y normas de uso",
        description: "Cobro del depósito al reservar y aceptación del reglamento de cada zona.",
        phase: "proximamente",
      },
    ],
  },
  {
    id: "convivencia",
    title: "Convivencia y comunicación",
    summary: "Lo que antes se pegaba junto al ascensor ahora le llega a todos.",
    icon: Megaphone,
    vignette: "votacion",
    features: [
      {
        title: "Cartelera virtual",
        description: "Circulares y anuncios oficiales de la administración, con confirmación de lectura.",
        phase: "fase-1",
      },
      {
        title: "PQR con seguimiento",
        description: "Cada petición, queja o reclamo recibe número de radicado y un responsable.",
        phase: "fase-1",
      },
      {
        title: "Votaciones y asambleas virtuales",
        description: "Encuestas y votos ponderados por coeficiente de copropiedad, con quórum en vivo.",
        phase: "proximamente",
      },
    ],
  },
  {
    id: "mantenimiento",
    title: "Mantenimiento y servicios",
    summary: "El mantenimiento preventivo deja de depender de la memoria de alguien.",
    icon: Wrench,
    vignette: "mantenimiento",
    features: [
      {
        title: "Mantenimientos preventivos",
        description: "Calendario de ascensores, tanques, planta eléctrica y bombas, con alertas y soportes.",
        phase: "proximamente",
      },
      {
        title: "Directorio de proveedores verificados",
        description: "Técnicos y servicios para el hogar con referencias de otros conjuntos.",
        phase: "proximamente",
      },
    ],
  },
];

export const featureCount = (phase?: Phase) =>
  MODULES.flatMap((m) => m.features).filter((f) => !phase || f.phase === phase).length;
