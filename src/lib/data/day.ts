import {
  CalendarDays,
  MessageSquareWarning,
  Moon,
  Package,
  Wallet,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export type ZoneId = "porteria" | "administracion" | "tanques" | "cartelera" | "salon";

export interface Zone {
  id: ZoneId;
  label: string;
  module: string;
}

export const ZONES: Zone[] = [
  { id: "porteria", label: "Portería", module: "Seguridad y control de accesos" },
  { id: "administracion", label: "Administración", module: "Administración y finanzas" },
  { id: "tanques", label: "Tanques y planta eléctrica", module: "Mantenimiento y servicios" },
  { id: "cartelera", label: "Cartelera", module: "Convivencia y comunicación" },
  { id: "salon", label: "Salón social, BBQ y piscina", module: "Reservas y zonas comunes" },
];

export type WindowMode = "dawn" | "paid" | "day" | "dusk" | "night";

export interface DayStep {
  id: string;
  time: string;
  zone: ZoneId | null;
  category: string;
  title: string;
  text: string;
  windows: WindowMode;
  event: { icon: LucideIcon; title: string; detail: string };
}

// One day in Altos del Bosque, 6:00 a. m. to 10:00 p. m. Each moment
// shows one module at work in the place where it happens.
export const DAY_STEPS: DayStep[] = [
  {
    id: "porteria",
    time: "6:00 a. m.",
    zone: "porteria",
    category: "Seguridad y control de accesos",
    title: "Cambio de turno en portería",
    text: "El guarda de la mañana abre la minuta digital: ronda sin novedad y un paquete para T3-201. El residente recibe el aviso antes de salir.",
    windows: "dawn",
    event: { icon: Package, title: "Paquete en portería", detail: "Para T3-201, de mensajería" },
  },
  {
    id: "pagos",
    time: "9:00 a. m.",
    zone: "administracion",
    category: "Administración y finanzas",
    title: "Llegan los pagos de octubre",
    text: "Cada cuota pagada con PSE, Nequi o Daviplata se concilia sola. Las ventanas en verde son unidades al día.",
    windows: "paid",
    event: { icon: Wallet, title: "Recaudo del mes", detail: "Sube de 68 % a 91 %" },
  },
  {
    id: "mantenimiento",
    time: "11:00 a. m.",
    zone: "tanques",
    category: "Mantenimiento y servicios",
    title: "El lavado de tanques queda programado",
    text: "El proveedor confirma la visita del 20 de octubre y el calendario avisa a los residentes con una semana de anticipación.",
    windows: "day",
    event: { icon: Wrench, title: "Lavado de tanques", detail: "20 de octubre, proveedor confirmado" },
  },
  {
    id: "pqr",
    time: "2:00 p. m.",
    zone: "cartelera",
    category: "Convivencia y comunicación",
    title: "Una PQR con número y responsable",
    text: "Una residente reporta una filtración en el sótano. Recibe el radicado 214 y ve quién la atiende. La circular del corte de agua ya está en la cartelera.",
    windows: "day",
    event: { icon: MessageSquareWarning, title: "PQR 214 radicada", detail: "Asignada a mantenimiento" },
  },
  {
    id: "reservas",
    time: "6:00 p. m.",
    zone: "salon",
    category: "Reservas y zonas comunes",
    title: "La BBQ del sábado ya está reservada",
    text: "La familia de T2-502 reservó la BBQ, pagó el depósito y aceptó el reglamento desde la app. Nadie tuvo que buscar el cuaderno.",
    windows: "dusk",
    event: { icon: CalendarDays, title: "BBQ 2 reservada", detail: "Sábado 10, de 12:00 m. a 4:00 p. m." },
  },
  {
    id: "noche",
    time: "10:00 p. m.",
    zone: null,
    category: "Consejo de administración",
    title: "Cierra el día y todo quedó registrado",
    text: "91 % de recaudo, tres visitantes registrados y una PQR en trámite. El consejo lo consulta sin pedir informes.",
    windows: "night",
    event: { icon: Moon, title: "Resumen del día", detail: "Disponible para el consejo" },
  },
];

// Time-of-day palette, one key per step (6 a. m. → 10 p. m.).
export const SKY_TOP = ["#9CB3D6", "#CADCF3", "#D3E4F8", "#C9DAF1", "#34507F", "#0A1B33"] as const;
export const SKY_BOTTOM = ["#F1D2AE", "#EDF3FB", "#F1F6FC", "#E8EFF8", "#D9955A", "#15294A"] as const;
export const FACE_TOP = ["#E4EAF3", "#F7F9FC", "#F8FAFC", "#F2F5F9", "#8E9BB6", "#223E63"] as const;
export const FACE_LEFT = ["#C6D1E1", "#E1E8F1", "#E3E9F2", "#DBE3EE", "#63759A", "#172F50"] as const;
export const FACE_RIGHT = ["#A9B7CD", "#C8D3E3", "#CAD5E4", "#C3CFE0", "#485B80", "#0F2340"] as const;
export const GROUND = ["#B4C8AC", "#CFE0C5", "#D3E4C9", "#CADCC0", "#6E7F72", "#18302B"] as const;
export const PAVING = ["#D6DCE6", "#E8ECF2", "#EBEEF3", "#E4E9F0", "#8D96A8", "#223249"] as const;
export const WATER = ["#8DB6E6", "#7CB1F0", "#77AEF2", "#7BB0EE", "#4C6DA1", "#1B3E72"] as const;
export const GLASS = ["#9DB0CB", "#B6CAE2", "#BACFE7", "#B1C5DF", "#51658A", "#1A3252"] as const;
export const TREE = ["#6E9A76", "#5FA178", "#5EA478", "#5E9E76", "#3F5E51", "#16352C"] as const;
export const SUN_X = [8, 30, 52, 72, 92, 70] as const;
export const SUN_Y = [62, 22, 10, 16, 58, 18] as const;
export const SUN_OPACITY = [0.85, 1, 1, 1, 0.9, 0] as const;
export const MOON_OPACITY = [0, 0, 0, 0, 0, 1] as const;
