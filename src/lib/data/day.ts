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
  // Warm white concrete and limestone, espresso at night
  "--face-top": ["#EEE5DC", "#FBF9F6", "#FDFCFA", "#F8F5F1", "#A99A90", "#3B3230"],
  "--face-left": ["#E2D7CD", "#F2EDE7", "#F5F1EC", "#EEE8E1", "#8F8078", "#302826"],
  "--face-right": ["#C6B8AC", "#DDD4CB", "#E1D8CF", "#D8CEC4", "#6E6059", "#241D1C"],
  "--brick-left": ["#B97353", "#C6774F", "#C97A51", "#BF744E", "#8E5A4A", "#4A3431"],
  "--brick-right": ["#98593F", "#A45E3E", "#A8613F", "#9F5D3E", "#6E4537", "#352526"],
  "--slab": ["#F6F0EA", "#FFFFFF", "#FFFFFF", "#FEFCFA", "#B4A79E", "#463B38"],
  "--roof": ["#D6CBC1", "#E6DFD8", "#E8E2DB", "#E2DAD2", "#7E7068", "#2A2321"],
  "--glass": ["#8E9DB0", "#A6B5C7", "#ABB9CB", "#A2B1C3", "#4B5568", "#1F2430"],
  "--lobby": ["#5E6675", "#6C7484", "#707989", "#6A7282", "#3B404C", "#15171C"],
  "--ground": ["#9EBB8F", "#B2CF9D", "#B7D4A2", "#AECA98", "#5F7560", "#1A302A"],
  "--tree-lo": ["#4B7C56", "#4C8B5B", "#4F905E", "#4B875A", "#314D3F", "#0F2620"],
  "--tree-hi": ["#78A778", "#79BA82", "#7DBE86", "#77B37F", "#4B6A56", "#1D3B31"],
  "--trunk": ["#6E5A48", "#7A634E", "#7A634E", "#7A634E", "#4A3E35", "#1E1A18"],
  "--paving": ["#DDD6CE", "#EEEAE4", "#F0ECE7", "#E9E4DD", "#8E8782", "#2C2624"],
  "--deck": ["#B98E68", "#C99D74", "#CCA077", "#C49870", "#7D6352", "#2E2A2C"],
  "--water": ["#6FA6DB", "#58B4E8", "#55B7EC", "#5AB0E4", "#3E6A9E", "#16396B"],
  "--water-hi": ["#A9CDEE", "#9AD6F5", "#98D9F7", "#9BD3F2", "#6F95C2", "#2B5690"],
  "--asphalt": ["#76716D", "#86817C", "#89847F", "#827D78", "#4E4A47", "#1B1918"],
  // The diorama stands on an espresso base
  "--base-left": ["#3A2F2A", "#41352F", "#433731", "#3F332E", "#2E2521", "#171210"],
  "--base-right": ["#2A221E", "#2F2722", "#312924", "#2D2520", "#211A17", "#0F0C0B"],
  "--door": ["#5A524E", "#655C57", "#655C57", "#655C57", "#3D3633", "#141110"],
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
    // The ground under the model is warm limestone, like the page
    "--stage-bottom": ["#EEE6E0", "#F1ECE6", "#F2EDE8", "#F0EAE4", "#EEE3DC", "#CBC8D2"],
    "--ridge-far": ["#D8CEDE", "#CBD5E3", "#C8D3E2", "#CAD4E2", "#D1B6C5", "#8E93B0"],
    "--ridge-near": ["#C9BFCF", "#BFC5D0", "#BBC2CE", "#BEC4CF", "#B7A1B8", "#7A7F9E"],
    "--cloud": ["#FDEBDD", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FBDCC9", "#FFFFFF"],
  },
  dark: {
    "--stage-top": ["#14111C", "#1B2B42", "#1E3048", "#1B2B42", "#1A1420", "#0B0A10"],
    "--stage-horizon": ["#3D2E3E", "#3B5675", "#405C7C", "#3A5573", "#5A3242", "#17141B"],
    // Espresso ground, so the card sits in the dark page
    "--stage-bottom": ["#1D1816", "#211C19", "#221D1A", "#211C19", "#1D1816", "#120F0D"],
    "--ridge-far": ["#2C2533", "#2E3B4E", "#313F52", "#2E3B4E", "#35262F", "#141219"],
    "--ridge-near": ["#221D27", "#262A33", "#282C36", "#262A33", "#271D24", "#0F0D11"],
    "--cloud": ["#7E7090", "#B9C3D1", "#C2CBD8", "#B9C3D1", "#90728A", "#3A3A46"],
  },
};

/** Window event that starts the guided walk through the day (sent by the home hero). */
export const DAY_TOUR_EVENT = "domuscol:recorrido-del-dia";

// Callouts: what each zone reports at each hour. `state` colours the value:
// ok (green, al día), warn (amber, needs attention) or info (sky blue).
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
