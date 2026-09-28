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

// Time-of-day palette for the isometric scene: one key per step
// (6 a. m., 9 a. m., 11 a. m., 2 p. m., 6 p. m., 10 p. m.). Each entry is a
// CSS variable the scene reads; the section interpolates them with time.
// The lit face (+y, facing the viewer's left) is brighter than the +x face.
export const SCENE_PALETTE: Record<string, readonly string[]> = {
  "--face-top": ["#E9EDF3", "#F8FAFC", "#FAFBFD", "#F4F6FA", "#9AA6BE", "#23385A"],
  "--face-left": ["#D9E0EA", "#EEF2F7", "#F1F4F8", "#EAEEF4", "#8090AD", "#1B2F4E"],
  "--face-right": ["#B9C4D4", "#D2DAE5", "#D6DEE8", "#CDD6E2", "#5F7091", "#132541"],
  "--brick-left": ["#B97353", "#C6774F", "#C97A51", "#BF744E", "#8E5A4A", "#4A3431"],
  "--brick-right": ["#98593F", "#A45E3E", "#A8613F", "#9F5D3E", "#6E4537", "#352526"],
  "--slab": ["#F2F5F9", "#FFFFFF", "#FFFFFF", "#FBFCFE", "#AAB5CA", "#2C4267"],
  "--roof": ["#CBD3DE", "#DDE3EB", "#DFE5ED", "#D7DEE7", "#717F99", "#1A2C48"],
  "--glass": ["#8FA3BF", "#A9BCD6", "#AEC1DA", "#A4B8D2", "#46597C", "#1A2F50"],
  "--lobby": ["#5B6F8E", "#6B81A2", "#6F86A7", "#687F9F", "#34466A", "#0F1F38"],
  "--ground": ["#9EBB8F", "#B2CF9D", "#B7D4A2", "#AECA98", "#5F7560", "#1A302A"],
  "--tree-lo": ["#4B7C56", "#4C8B5B", "#4F905E", "#4B875A", "#314D3F", "#0F2620"],
  "--tree-hi": ["#78A778", "#79BA82", "#7DBE86", "#77B37F", "#4B6A56", "#1D3B31"],
  "--trunk": ["#6E5A48", "#7A634E", "#7A634E", "#7A634E", "#4A3E35", "#1C2226"],
  "--paving": ["#DDD9D3", "#EEEBE6", "#F0EDE8", "#E9E5DF", "#8D8D93", "#243249"],
  "--deck": ["#B98E68", "#C99D74", "#CCA077", "#C49870", "#7D6352", "#2E2A2C"],
  "--water": ["#6FA6DB", "#58B4E8", "#55B7EC", "#5AB0E4", "#3E6A9E", "#16396B"],
  "--water-hi": ["#A9CDEE", "#9AD6F5", "#98D9F7", "#9BD3F2", "#6F95C2", "#2B5690"],
  "--asphalt": ["#707886", "#818998", "#848C9A", "#7D8593", "#4B5364", "#141C2A"],
  "--base-left": ["#2B4B7A", "#2F5484", "#305687", "#2E5282", "#1F365A", "#0D1C33"],
  "--base-right": ["#1D3860", "#213E69", "#22416C", "#203C66", "#152844", "#081426"],
  "--door": ["#51627E", "#5E708A", "#5E708A", "#5E708A", "#34455F", "#0A1B33"],
};

export const SCENE_NUMBERS: Record<string, readonly number[]> = {
  // The sun rises behind the cerros on the left, crosses the top of the
  // sky (clear of the callouts) and sets behind the ones on the right.
  // Positions are in the model's viewBox units.
  "--sun-x": [-300, -262, -160, 168, 318, 318],
  "--sun-y": [32, -52, -150, -158, 40, 130],
  "--sun-o": [0.95, 1, 1, 1, 0.95, 0],
  "--moon-o": [0, 0, 0, 0, 0.2, 1],
  "--star-o": [0.3, 0, 0, 0, 0.35, 1],
  "--cloud-o": [0.55, 0.9, 0.95, 0.9, 0.6, 0],
  // Brightness for elements with fixed colours (cars, tank, pergola)
  "--shade": [0.92, 1, 1, 1, 0.72, 0.42],
  // Ground shadows fade out after sunset
  "--shadow-o": [0.16, 0.2, 0.22, 0.2, 0.1, 0],
  // Street lamps switch on at dusk
  "--lamp-o": [0.55, 0, 0, 0, 0.85, 1],
};

// Numbers written with a unit (the rest are unitless).
export const SCENE_UNITS: Record<string, string> = { "--sun-x": "px", "--sun-y": "px" };

// The sun changes colour through the day, whatever the theme.
export const SUN_PALETTE: Record<string, readonly string[]> = {
  "--sun-core": ["#FFD7A1", "#FFF1C4", "#FFF8DC", "#FFF3CC", "#FFB477", "#FFB477"],
  "--sun-halo": ["#FFB06A", "#FFD98A", "#FFE6A6", "#FFDF95", "#FF8B55", "#FF8B55"],
};

// The sky behind the model follows the site theme and the hour: a sky
// gradient, Bogotá's cerros in two layers and the ground the model sits on.
export const STAGE: Record<"light" | "dark", Record<string, readonly string[]>> = {
  light: {
    "--stage-top": ["#B7C8E6", "#B1CFF2", "#A8CBF3", "#AFCDF0", "#93A7D3", "#7084B1"],
    "--stage-horizon": ["#F7D5BA", "#E2EEFA", "#E5F0FC", "#E1ECF9", "#F4C09D", "#A7B5D6"],
    "--stage-bottom": ["#ECE8EE", "#EDF2F8", "#EEF3F9", "#ECF1F7", "#ECE3E5", "#CAD3E5"],
    "--ridge-far": ["#D8CEDE", "#C8D7EB", "#C6D6EB", "#C7D6EA", "#D1B6C5", "#8F9EC5"],
    "--ridge-near": ["#C7BED4", "#B6C8E1", "#B3C6E0", "#B5C7E0", "#B7A1B8", "#7D8CB6"],
    "--cloud": ["#FDEBDD", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FBDCC9", "#FFFFFF"],
  },
  dark: {
    "--stage-top": ["#0B1830", "#12305A", "#153663", "#12305A", "#131A38", "#040B18"],
    "--stage-horizon": ["#3D2E4A", "#2A5A8C", "#2F6297", "#2A5989", "#56314A", "#0D1B33"],
    "--stage-bottom": ["#0F1A2F", "#10223D", "#112541", "#10223D", "#141A2F", "#070F1E"],
    "--ridge-far": ["#2A2944", "#244870", "#274C78", "#244870", "#33273F", "#0D1A33"],
    "--ridge-near": ["#1E1D35", "#1B3A5E", "#1D3E65", "#1B3A5E", "#251C33", "#09152B"],
    "--cloud": ["#7E7090", "#C4D4EA", "#CFDCEF", "#C4D4EA", "#90728A", "#3A4A66"],
  },
};

/** Window event that starts the guided walk through the day (sent by the home hero). */
export const DAY_TOUR_EVENT = "domuscol:recorrido-del-dia";

// Callouts: what each zone reports at each hour. `state` colours the value:
// ok (emerald), warn (amber, needs attention) or info (cobalt).
export type CalloutState = "ok" | "warn" | "info";

export interface Callout {
  zone: ZoneId;
  label: string;
  values: readonly string[];
  states: readonly CalloutState[];
}

export const CALLOUTS: Callout[] = [
  {
    zone: "tanques",
    label: "Lavado de tanques",
    values: ["Por programar", "Por programar", "20 oct, confirmado", "20 oct, confirmado", "20 oct, confirmado", "20 oct, confirmado"],
    states: ["warn", "warn", "ok", "ok", "ok", "ok"],
  },
  {
    zone: "administracion",
    label: "Recaudo del mes",
    values: ["68 %", "91 %", "91 %", "91 %", "91 %", "91 %"],
    states: ["warn", "ok", "ok", "ok", "ok", "ok"],
  },
  {
    zone: "cartelera",
    label: "PQR abiertas",
    values: ["0", "0", "0", "1", "1", "1"],
    states: ["ok", "ok", "ok", "warn", "warn", "warn"],
  },
  {
    zone: "salon",
    label: "BBQ del sábado",
    values: ["Libre", "Libre", "Libre", "Libre", "Reservada", "Reservada"],
    states: ["info", "info", "info", "info", "ok", "ok"],
  },
  {
    zone: "porteria",
    label: "Visitantes hoy",
    values: ["0", "1", "1", "2", "3", "3"],
    states: ["info", "info", "info", "info", "info", "info"],
  },
];
