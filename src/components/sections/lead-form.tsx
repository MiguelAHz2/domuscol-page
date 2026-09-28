"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ChevronDown, CircleCheck, LoaderCircle } from "lucide-react";
import Image from "next/image";
import bogotaCerros from "@/assets/images/bogota-cerros.jpg";
import { buttonClass } from "@/components/ui/button";
import { WhatsappIcon } from "@/components/ui/social-icons";
import { Turnstile, type TurnstileHandle } from "@/components/ui/turnstile";
import { UNITS_RANGE } from "@/lib/data/pricing";
import {
  CITIES,
  DEMO_FIELD_ORDER,
  HONEYPOT_FIELD,
  TURNSTILE_FIELD,
  validateDemoRequest,
  type DemoErrors,
  type DemoField,
  type DemoRequestInput,
} from "@/lib/demo-request";
import { whatsappHref } from "@/lib/site";
import { cn } from "@/lib/utils";

const STEPS = [
  { title: "Te contactamos en menos de un día hábil", text: "Por correo o WhatsApp, como prefieras." },
  { title: "Demo en vivo de 30 minutos", text: "Con la administración y, si quieren, con el consejo." },
  { title: "Migración y capacitación", text: "Cargamos tus datos y capacitamos a administración y portería." },
];

// Bot check, only when a Cloudflare Turnstile site key is configured.
const TURNSTILE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type Field = DemoField;
type Values = DemoRequestInput;
type Errors = DemoErrors;

export function LeadForm() {
  const [units, setUnits] = useState<number>(UNITS_RANGE.initial);
  const [values, setValues] = useState<Values>({
    nombre: "",
    correo: "",
    ciudad: "",
    conjunto: "",
    unidades: String(units),
    autorizacion: false,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const turnstileRef = useRef<TurnstileHandle>(null);
  // The bot check loads when the person starts filling the form.
  const [armed, setArmed] = useState(false);

  // /precios links here with ?unidades=N. Read it on the client so the
  // page stays static.
  useEffect(() => {
    const fromUrl = Number(new URLSearchParams(window.location.search).get("unidades"));
    if (Number.isInteger(fromUrl) && fromUrl > 0) {
      setUnits(fromUrl);
      setValues((v) => ({ ...v, unidades: String(fromUrl) }));
    }
  }, []);

  useEffect(() => {
    if (status === "sent") successRef.current?.focus();
  }, [status]);

  function update<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError(null);
    const found = validateDemoRequest(values);
    if (showErrors(found)) return;

    setStatus("sending");
    try {
      const token = TURNSTILE_KEY ? await turnstileToken() : "";
      const res = await fetch("/api/solicitud-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, [HONEYPOT_FIELD]: honeypot, [TURNSTILE_FIELD]: token }),
      });
      turnstileRef.current?.reset();
      const body = (await res.json().catch(() => ({}))) as { success?: boolean; error?: string; data?: { fields?: Errors; confirmation?: boolean } };
      if (res.ok && body.success) {
        setConfirmationSent(body.data?.confirmation === true);
        setStatus("sent");
        return;
      }
      setStatus("idle");
      if (body.data?.fields && showErrors(body.data.fields)) return;
      setServerError(body.error ?? "No pudimos enviar tu solicitud. Inténtalo de nuevo o escríbenos por WhatsApp.");
    } catch {
      setStatus("idle");
      setServerError("No hay conexión con el servidor. Revisa tu internet e inténtalo de nuevo, o escríbenos por WhatsApp.");
    }
  }

  async function turnstileToken() {
    setArmed(true);
    for (let i = 0; i < 30 && !turnstileRef.current; i++) await new Promise((r) => setTimeout(r, 100));
    return (await turnstileRef.current?.getToken()) ?? "";
  }

  /** Marks invalid fields and focuses the first one. Returns true if there were errors. */
  function showErrors(found: Errors) {
    setErrors(found);
    const firstInvalid = DEMO_FIELD_ORDER.find((f) => found[f]);
    if (!firstInvalid) return false;
    formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
    return true;
  }

  function reset() {
    setServerError(null);
    setValues({ nombre: "", correo: "", ciudad: "", conjunto: "", unidades: String(units), autorizacion: false });
    setErrors({});
    setStatus("idle");
  }

  return (
    <section id="contacto" className="relative isolate overflow-clip bg-band pb-20 pt-32 text-body sm:pb-28 sm:pt-40 dark:text-white/75">
      <Image src={bogotaCerros} alt="" fill priority sizes="100vw" placeholder="blur" className="-z-10 object-cover" style={{ objectPosition: "center 45%" }} />
      {/* Keeps the text and form legible over the photo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(var(--c-band)/0.8),rgb(var(--c-band)/0.92))] lg:bg-[linear-gradient(90deg,rgb(var(--c-band)/0.95)_0%,rgb(var(--c-band)/0.8)_45%,rgb(var(--c-band)/0.5)_100%)]"
      />
      <div className="relative mx-auto grid max-w-page gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16 lg:px-8">
        <div>
          <h1 className="text-4xl font-extrabold text-ink sm:text-5xl dark:text-white">Solicita una demo para tu conjunto</h1>
          <p className="mt-4 max-w-[32rem] text-lg">
            Te mostramos DomusCol con la estructura de tu conjunto: torres, unidades y cuotas reales.
          </p>

          <ol className="mt-10 space-y-6">
            {STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[rgb(var(--c-ink)/0.2)] text-sm font-bold text-ink tabular dark:border-white/20 dark:text-white">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold text-ink dark:text-white">{step.title}</p>
                  <p className="mt-0.5 text-sm text-muted dark:text-white/65">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-10 text-sm text-muted dark:text-white/65">
            ¿Prefieres hablar ya?{" "}
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold text-ink underline decoration-[rgb(var(--c-ink)/0.3)] underline-offset-4 hover:decoration-ink dark:text-white dark:decoration-white/30 dark:hover:decoration-white"
            >
              <WhatsappIcon className="h-4 w-4" />
              Escríbenos por WhatsApp
            </a>
          </p>
        </div>

        <div className="glass glass-strong rounded-[28px] p-6 text-body shadow-float sm:p-8">
          {status === "sent" ? (
            <div ref={successRef} tabIndex={-1} className="animate-enter flex min-h-[28rem] flex-col items-start justify-center rounded-lg">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-[rgb(var(--c-emerald)/0.15)] text-emerald-ink">
                <CircleCheck aria-hidden className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-2xl font-bold">Solicitud de demo enviada</h3>
              <p className="mt-2 max-w-md">
                Te escribimos a <span className="font-semibold text-ink">{values.correo}</span> en menos de un día hábil
                para agendar la demo de <span className="font-semibold text-ink">{values.conjunto}</span>.
                {confirmationSent && " Ya te enviamos un correo de confirmación."}
              </p>
              <p className="mt-6 text-sm font-semibold text-ink">¿Prefieres avanzar ya?</p>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <a
                  href={whatsappHref(
                    `Hola, acabo de solicitar una demo de DomusCol para ${values.conjunto} (${values.unidades} unidades, ${values.ciudad}). Mi nombre es ${values.nombre}.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClass("primary", "md")}
                >
                  <WhatsappIcon className="h-4 w-4" />
                  Continuar por WhatsApp
                </a>
                <button type="button" onClick={reset} className={buttonClass("outline", "md")}>
                  Enviar otra solicitud
                </button>
              </div>
            </div>
          ) : (
            <form
              ref={formRef}
              noValidate
              onSubmit={onSubmit}
              onFocusCapture={() => setArmed(true)}
              className="relative grid gap-5 sm:grid-cols-2"
            >
              <TextField
                name="nombre"
                label="Nombre"
                autoComplete="name"
                value={values.nombre}
                error={errors.nombre}
                onChange={(v) => update("nombre", v)}
              />
              <TextField
                name="correo"
                label="Correo"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={values.correo}
                error={errors.correo}
                onChange={(v) => update("correo", v)}
              />

              <div>
                <label htmlFor="ciudad" className="text-sm font-semibold text-ink">
                  Ciudad
                </label>
                <div className="relative mt-1.5">
                  <select
                    id="ciudad"
                    name="ciudad"
                    value={values.ciudad}
                    onChange={(e) => update("ciudad", e.target.value)}
                    aria-invalid={Boolean(errors.ciudad)}
                    aria-describedby={errors.ciudad ? "ciudad-error" : undefined}
                    className={cn(inputClass(Boolean(errors.ciudad)), "appearance-none pr-10", !values.ciudad && "text-muted")}
                  >
                    <option value="" disabled>
                      Elige una ciudad
                    </option>
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <ChevronDown aria-hidden className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                </div>
                <FieldError id="ciudad-error" message={errors.ciudad} />
              </div>

              <TextField
                name="conjunto"
                label="Nombre del conjunto"
                placeholder="Ej. Conjunto Altos del Bosque"
                value={values.conjunto}
                error={errors.conjunto}
                onChange={(v) => update("conjunto", v)}
              />
              <TextField
                name="unidades"
                label="Número de unidades"
                type="number"
                inputMode="numeric"
                min={1}
                value={values.unidades}
                error={errors.unidades}
                onChange={(v) => update("unidades", v)}
                hint="Apartamentos, casas o locales"
              />

              <div className="sm:col-span-2">
                <label className="flex cursor-pointer gap-3 text-sm">
                  <input
                    type="checkbox"
                    name="autorizacion"
                    checked={values.autorizacion}
                    onChange={(e) => update("autorizacion", e.target.checked)}
                    aria-invalid={Boolean(errors.autorizacion)}
                    aria-describedby={errors.autorizacion ? "autorizacion-error" : undefined}
                    className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded accent-[rgb(var(--c-emerald))]"
                  />
                  <span>
                    Autorizo a DomusCol a tratar mis datos para responder esta solicitud, según la{" "}
                    <a href="/legal/tratamiento-de-datos" className="font-semibold text-cobalt underline-offset-2 hover:underline">
                      Política de tratamiento de datos
                    </a>{" "}
                    y la Ley 1581 de 2012.
                  </span>
                </label>
                <FieldError id="autorizacion-error" message={errors.autorizacion} />
              </div>

              {/* Anti-spam: hidden from people and assistive tech; bots fill it */}
              <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label htmlFor={HONEYPOT_FIELD}>No llenes este campo</label>
                <input
                  id={HONEYPOT_FIELD}
                  name={HONEYPOT_FIELD}
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              {serverError && (
                <div role="alert" className="sm:col-span-2 rounded-xl border border-[rgb(var(--c-danger)/0.35)] bg-[rgb(var(--c-danger)/0.06)] p-4 text-sm">
                  <p className="font-semibold text-danger">{serverError}</p>
                  <a
                    href={whatsappHref(
                      `Hola, quiero una demo de DomusCol para ${values.conjunto || "mi conjunto"}${values.unidades ? ` (${values.unidades} unidades)` : ""}.`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 font-semibold text-ink underline underline-offset-4"
                  >
                    <WhatsappIcon className="h-4 w-4" />
                    Escribir por WhatsApp
                  </a>
                </div>
              )}

              {TURNSTILE_KEY && armed && <Turnstile ref={turnstileRef} siteKey={TURNSTILE_KEY} className="sm:col-span-2" />}

              <div className="sm:col-span-2">
                <button type="submit" disabled={status === "sending"} className={buttonClass("primary", "lg", "w-full")}>
                  {status === "sending" ? (
                    <>
                      <LoaderCircle aria-hidden className="h-4 w-4 animate-spin" /> Enviando solicitud
                    </>
                  ) : (
                    "Solicitar demo"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function inputClass(invalid: boolean) {
  return cn(
    "h-12 w-full rounded-xl border bg-surface px-4 text-[0.9375rem] text-ink shadow-pressed transition-[border-color,box-shadow] placeholder:text-muted focus:outline-none focus:ring-4",
    invalid
      ? "border-danger focus:ring-[rgb(var(--c-danger)/0.15)]"
      : "border-line focus:border-cobalt focus:ring-[rgb(var(--c-cobalt)/0.15)]",
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-sm text-danger">
      {message}
    </p>
  );
}

interface TextFieldProps {
  name: Field;
  label: string;
  value: string;
  error?: string;
  hint?: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "numeric";
  placeholder?: string;
  min?: number;
}

function TextField({ name, label, value, error, hint, onChange, ...rest }: TextFieldProps) {
  const describedBy = [error && `${name}-error`, hint && `${name}-hint`].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={name} className="text-sm font-semibold text-ink">
        {label}
      </label>
      <input
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={cn(inputClass(Boolean(error)), "mt-1.5")}
        {...rest}
      />
      {hint && !error && (
        <p id={`${name}-hint`} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      )}
      <FieldError id={`${name}-error`} message={error} />
    </div>
  );
}
