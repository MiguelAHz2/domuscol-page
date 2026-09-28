import { NextResponse } from "next/server";
import {
  HONEYPOT_FIELD,
  TURNSTILE_FIELD,
  normalizeDemoRequest,
  validateDemoRequest,
  type DemoRequestInput,
} from "@/lib/demo-request";
import {
  captureServerError,
  channels,
  sendConfirmation,
  sendLeadEmail,
  sendLeadWebhook,
  sendLeadWhatsapp,
  verifyTurnstile,
} from "@/lib/server/leads";

// Receives demo requests from /contacto and delivers them to the team by
// email (Resend), webhook and/or WhatsApp (CallMeBot), whichever are
// configured, then confirms to the prospect by email. Responses follow the
// team's API convention: { success, data?, error? }.

type ApiResponse = { success: boolean; data?: unknown; error?: string };

const reply = (status: number, body: ApiResponse) => NextResponse.json(body, { status });

// Best-effort rate limit per instance: 5 requests per IP every 10 minutes.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return reply(400, { success: false, error: "La solicitud llegó incompleta. Recarga la página e inténtalo de nuevo." });
  }

  // Bots fill every field; a filled honeypot gets a quiet "ok".
  if (typeof body[HONEYPOT_FIELD] === "string" && body[HONEYPOT_FIELD]) return reply(200, { success: true });

  const input: DemoRequestInput = {
    nombre: String(body.nombre ?? ""),
    correo: String(body.correo ?? ""),
    ciudad: String(body.ciudad ?? ""),
    conjunto: String(body.conjunto ?? ""),
    unidades: String(body.unidades ?? ""),
    autorizacion: body.autorizacion === true,
  };
  const errors = validateDemoRequest(input);
  if (Object.keys(errors).length > 0) {
    return reply(422, { success: false, error: "Revisa los campos marcados.", data: { fields: errors } });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
  if (rateLimited(ip ?? "local")) {
    return reply(429, {
      success: false,
      error: "Recibimos varias solicitudes seguidas desde tu conexión. Espera unos minutos o escríbenos por WhatsApp.",
    });
  }

  if (!(await verifyTurnstile(String(body[TURNSTILE_FIELD] ?? ""), ip))) {
    return reply(403, {
      success: false,
      error: "No pudimos confirmar que la solicitud la envía una persona. Recarga la página e inténtalo de nuevo.",
      data: { turnstile: true },
    });
  }

  const demo = normalizeDemoRequest(input);
  const receivedAt = new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" });

  const deliveries: Array<Promise<void>> = [];
  if (channels.email()) deliveries.push(sendLeadEmail(demo, receivedAt));
  if (channels.webhook()) deliveries.push(sendLeadWebhook(demo, receivedAt));
  if (channels.whatsapp()) deliveries.push(sendLeadWhatsapp(demo));

  if (deliveries.length === 0) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[solicitud-demo] No delivery channel configured; request logged only:", demo);
      return reply(200, { success: true, data: { delivered: false } });
    }
    const error = new Error("No delivery channel configured (RESEND_API_KEY, LEADS_WEBHOOK_URL or CALLMEBOT_*)");
    console.error("[solicitud-demo]", error.message);
    await captureServerError(error);
    return reply(503, {
      success: false,
      error: "No pudimos recibir tu solicitud en este momento. Escríbenos por WhatsApp y te atendemos de inmediato.",
    });
  }

  const results = await Promise.allSettled(deliveries);
  const failures = results.filter((r): r is PromiseRejectedResult => r.status === "rejected").map((r) => r.reason);
  failures.forEach((reason) => console.error("[solicitud-demo] Delivery failed:", reason));

  if (failures.length === results.length) {
    await captureServerError(new AggregateError(failures, "Every delivery channel failed"));
    return reply(502, {
      success: false,
      error: "No pudimos enviar tu solicitud. Inténtalo de nuevo en un momento o escríbenos por WhatsApp.",
    });
  }

  // The team has it. The confirmation is a courtesy: if it fails we log
  // it, and the person still sees the success screen.
  let confirmed = false;
  if (channels.confirmation()) {
    try {
      await sendConfirmation(demo);
      confirmed = true;
    } catch (error) {
      console.error("[solicitud-demo] Confirmation email failed:", error);
      failures.push(error);
    }
  }
  if (failures.length > 0) await captureServerError(new AggregateError(failures, "Some delivery channels failed"));

  return reply(200, { success: true, data: { confirmation: confirmed } });
}
