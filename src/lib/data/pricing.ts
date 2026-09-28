// Reference launch prices (COP, before IVA). Mock values for the landing.
export interface Plan {
  id: "esencial" | "integral";
  name: string;
  description: string;
  perUnit: number;
  minimum: number;
  includes: string[];
}

export const UNITS_RANGE = { min: 20, max: 800, step: 10, initial: 120 } as const;

export const PLANS: Plan[] = [
  {
    id: "esencial",
    name: "Esencial",
    description: "Los módulos de la Fase 1 para ordenar el recaudo y la portería.",
    perUnit: 2_400,
    minimum: 120_000,
    includes: [
      "Pagos en línea y conciliación de cartera",
      "Paz y salvo y estados de cuenta",
      "Visitantes con QR y minuta digital",
      "Cartelera virtual y PQR",
      "Reservas de zonas comunes",
    ],
  },
  {
    id: "integral",
    name: "Integral",
    description: "Todo DomusCol, incluidos los módulos nuevos a medida que se lanzan.",
    perUnit: 3_600,
    minimum: 180_000,
    includes: [
      "Todo lo del plan Esencial",
      "Presupuesto, contabilidad e informes de asamblea",
      "Votaciones y asambleas virtuales",
      "Citofonía virtual",
      "Mantenimientos preventivos y proveedores",
    ],
  },
];

export function monthlyTotal(plan: Plan, units: number) {
  return Math.max(plan.perUnit * units, plan.minimum);
}
