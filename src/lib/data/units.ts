import { mulberry32 } from "@/lib/utils";

export type UnitStatus = "al-dia" | "pendiente" | "mora";

export interface Unit {
  /** Colombian unit code: torre + piso + apartamento, e.g. T2-502 */
  id: string;
  tower: number;
  floor: number;
  apt: number;
  status: UnitStatus;
}

export const CONJUNTO = {
  name: "Conjunto Altos del Bosque",
  subdomain: "altos-del-bosque.domuscol.co",
  towers: 3,
  floors: 8,
  aptsPerFloor: 4,
  cuota: 385_000,
  period: "octubre",
} as const;

/** Units the demo phone pays for, in order. */
export const DEMO_RESIDENTS = [
  { unitId: "T2-502", name: "Laura" },
  { unitId: "T1-703", name: "Camilo" },
  { unitId: "T3-304", name: "Marcela" },
  { unitId: "T2-201", name: "Andrés" },
] as const;

const forcedPending = new Set<string>(DEMO_RESIDENTS.map((r) => r.unitId));

export function unitId(tower: number, floor: number, apt: number) {
  return `T${tower}-${floor}${String(apt).padStart(2, "0")}`;
}

export function buildUnits(): Unit[] {
  const rand = mulberry32(675);
  const units: Unit[] = [];

  for (let tower = 1; tower <= CONJUNTO.towers; tower++) {
    for (let floor = CONJUNTO.floors; floor >= 1; floor--) {
      for (let apt = 1; apt <= CONJUNTO.aptsPerFloor; apt++) {
        const id = unitId(tower, floor, apt);
        const r = rand();
        const status: UnitStatus = forcedPending.has(id)
          ? "pendiente"
          : r < 0.09
            ? "mora"
            : r < 0.27
              ? "pendiente"
              : "al-dia";
        units.push({ id, tower, floor, apt, status });
      }
    }
  }

  return units;
}

export const statusLabel: Record<UnitStatus, string> = {
  "al-dia": "al día",
  pendiente: "pendiente",
  mora: "en mora",
};

export type PaymentMethod = "PSE" | "Nequi" | "Daviplata" | "Tarjeta";

export const PAYMENT_METHODS: PaymentMethod[] = ["PSE", "Nequi", "Daviplata", "Tarjeta"];

export interface ActivityItem {
  id: string;
  kind: "pago" | "pqr" | "paquete" | "visitante";
  text: string;
  time: string;
}

export const INITIAL_ACTIVITY: ActivityItem[] = [
  { id: "a1", kind: "pago", text: "T1-803 pagó con PSE", time: "hace 12 min" },
  { id: "a2", kind: "pqr", text: "T3-204 radicó la PQR 214: filtración en el sótano", time: "hace 40 min" },
  { id: "a3", kind: "paquete", text: "Portería recibió un paquete para T2-101", time: "hace 1 h" },
];
