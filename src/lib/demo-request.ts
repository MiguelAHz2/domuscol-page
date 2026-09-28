// Demo request form: fields, limits and validation shared by the browser
// (instant feedback) and the API route (the check that counts).

export const CITIES = [
  "Bogotá",
  "Medellín",
  "Cali",
  "Barranquilla",
  "Cartagena",
  "Bucaramanga",
  "Pereira",
  "Manizales",
  "Santa Marta",
  "Ibagué",
  "Villavicencio",
  "Cúcuta",
  "Otra ciudad",
] as const;

export type DemoField = "nombre" | "correo" | "ciudad" | "conjunto" | "unidades" | "autorizacion";
export type DemoErrors = Partial<Record<DemoField, string>>;

export interface DemoRequestInput {
  nombre: string;
  correo: string;
  ciudad: string;
  conjunto: string;
  unidades: string;
  autorizacion: boolean;
}

export interface DemoRequest {
  nombre: string;
  correo: string;
  ciudad: string;
  conjunto: string;
  unidades: number;
  autorizacion: true;
}

export const DEMO_FIELD_ORDER: DemoField[] = ["nombre", "correo", "ciudad", "conjunto", "unidades", "autorizacion"];

const MAX = { nombre: 120, correo: 254, conjunto: 160, unidades: 20000 } as const;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateDemoRequest(v: DemoRequestInput): DemoErrors {
  const errors: DemoErrors = {};
  // NFC so an accent typed as two code points still matches ("Medellín").
  const nombre = v.nombre.normalize("NFC").trim();
  const correo = v.correo.trim();
  const conjunto = v.conjunto.normalize("NFC").trim();
  const ciudad = v.ciudad.normalize("NFC");
  const unidades = Number(v.unidades);

  if (!nombre) errors.nombre = "Escribe tu nombre.";
  else if (nombre.length > MAX.nombre) errors.nombre = `Usa máximo ${MAX.nombre} caracteres.`;

  if (!EMAIL.test(correo) || correo.length > MAX.correo)
    errors.correo = "Escribe un correo válido, por ejemplo nombre@conjunto.com.";

  if (!(CITIES as readonly string[]).includes(ciudad)) errors.ciudad = "Elige la ciudad del conjunto.";

  if (!conjunto) errors.conjunto = "Escribe el nombre del conjunto.";
  else if (conjunto.length > MAX.conjunto) errors.conjunto = `Usa máximo ${MAX.conjunto} caracteres.`;

  if (!Number.isInteger(unidades) || unidades < 1 || unidades > MAX.unidades)
    errors.unidades = "Escribe el número de unidades, por ejemplo 120.";

  if (v.autorizacion !== true) errors.autorizacion = "Necesitamos tu autorización para contactarte.";

  return errors;
}

/** Trimmed, typed request. Call only after validateDemoRequest returned no errors. */
export function normalizeDemoRequest(v: DemoRequestInput): DemoRequest {
  return {
    nombre: v.nombre.normalize("NFC").trim(),
    correo: v.correo.trim().toLowerCase(),
    ciudad: v.ciudad.normalize("NFC"),
    conjunto: v.conjunto.normalize("NFC").trim(),
    unidades: Number(v.unidades),
    autorizacion: true,
  };
}

/** Name of the hidden anti-spam field. People never see it; bots fill it. */
export const HONEYPOT_FIELD = "sitio_web";

/** Body key for the Cloudflare Turnstile token, when the check is enabled. */
export const TURNSTILE_FIELD = "turnstile";
