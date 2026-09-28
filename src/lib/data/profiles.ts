import {
  CalendarDays,
  ChartColumn,
  ClipboardList,
  Eye,
  HandCoins,
  MessageCircle,
  QrCode,
  Smartphone,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type ProfileId = "administradores" | "residentes" | "consejo";

export interface Benefit {
  icon: LucideIcon;
  title: string;
  text: string;
}

export interface Profile {
  id: ProfileId;
  tab: string;
  headline: string;
  benefits: Benefit[];
}

export const PROFILES: Profile[] = [
  {
    id: "administradores",
    tab: "Administradores",
    headline: "Menos hojas de cálculo, más tiempo para administrar",
    benefits: [
      {
        icon: Zap,
        title: "Tareas que se hacen solas",
        text: "Cuotas, intereses de mora y recordatorios de pago se generan cada mes sin intervención.",
      },
      {
        icon: HandCoins,
        title: "Recaudo más rápido",
        text: "Los residentes pagan desde el celular y el pago llega conciliado a la cartera.",
      },
      {
        icon: ChartColumn,
        title: "Reportes en un clic",
        text: "Cartera, ejecución presupuestal e informe de gestión en PDF, listos para el consejo.",
      },
    ],
  },
  {
    id: "residentes",
    tab: "Residentes",
    headline: "El conjunto cabe en el celular",
    benefits: [
      {
        icon: Smartphone,
        title: "Pagos desde el celular",
        text: "Paga la cuota con PSE, Nequi, Daviplata o tarjeta y descarga tu paz y salvo.",
      },
      {
        icon: CalendarDays,
        title: "Reservas al instante",
        text: "Mira qué está libre y reserva el salón social o la BBQ sin llamar a la oficina.",
      },
      {
        icon: MessageCircle,
        title: "Comunicación directa",
        text: "Circulares, PQR y avisos de portería en un mismo lugar.",
      },
    ],
  },
  {
    id: "consejo",
    tab: "Consejo y portería",
    headline: "Control de la copropiedad sin perseguir a nadie",
    benefits: [
      {
        icon: Eye,
        title: "Transparencia total",
        text: "El consejo consulta ingresos, gastos y cartera cuando quiera, sin pedir informes.",
      },
      {
        icon: QrCode,
        title: "Portería eficiente",
        text: "Visitantes con QR, paquetes y minuta digital desde una tablet en la entrada.",
      },
      {
        icon: ClipboardList,
        title: "Todo queda registrado",
        text: "Cada decisión, pago y novedad guarda fecha, hora y responsable.",
      },
    ],
  },
];
