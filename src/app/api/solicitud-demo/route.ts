import { NextResponse } from "next/server";
import {
  HONEYPOT_FIELD,
  normalizeDemoRequest,
  validateDemoRequest,
  type DemoRequest,
  type DemoRequestInput,
} from "@/lib/demo-request";
import { site } from "@/lib/site";

// Receives demo requests from /contacto and delivers them by email (Resend)
// and/or webhook, whichever is configured. Responses follow the team's API
// convention: { success, data?, error? }.

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

const escapeHtml = (value: string | number) =>
  String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function emailContent(r: DemoRequest, receivedAt: string) {
  const rows: Array<[string, string | number]> = [
    ["Nombre", r.nombre],
    ["Correo", r.correo],
    ["Ciudad", r.ciudad],
    ["Conjunto", r.conjunto],
    ["Unidades", r.unidades],
    ["Autorización de datos (Ley 1581)", "Sí"],
    ["Recibida", receivedAt],
  ];
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#0D223F;max-width:560px">
      <h2 style="margin:0 0 4px">Nueva solicitud de demo</h2>
      <p style="margin:0 0 16px;color:#5E708A">Llegó desde ${escapeHtml(site.url)}/contacto</p>
      <table style="border-collapse:collapse;width:100%">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="padding:8px 12px 8px 0;border-bottom:1px solid #DCE3EE;color:#5E708A;white-space:nowrap">${escapeHtml(k)}</td><td style="padding:8px 0;border-bottom:1px solid #DCE3EE;font-weight:600">${escapeHtml(v)}</td></tr>`,
          )
          .join("")}
      </table>
      <p style="margin:16px 0 0;color:#5E708A">Responde a este correo para escribirle directamente a ${escapeHtml(r.nombre)}.</p>
    </div>`;
  return { text, html };
}

async function sendEmail(r: DemoRequest, receivedAt: string) {
  const to = (process.env.LEADS_EMAIL_TO ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (to.length === 0) throw new Error("LEADS_EMAIL_TO is empty");
  const { text, html } = emailContent(r, receivedAt);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.LEADS_EMAIL_FROM || "DomusCol <onboarding@resend.dev>",
      to,
      reply_to: r.correo,
      subject: `Solicitud de demo: ${r.conjunto} (${r.unidades} unidades, ${r.ciudad})`,
      text,
      html,
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
}

async function sendWebhook(r: DemoRequest, receivedAt: string) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (process.env.LEADS_WEBHOOK_SECRET) headers.Authorization = `Bearer ${process.env.LEADS_WEBHOOK_SECRET}`;

  const res = await fetch(process.env.LEADS_WEBHOOK_URL!, {
    method: "POST",
    headers,
    body: JSON.stringify({
      evento: "solicitud_demo",
      recibida: receivedAt,
      origen: `${site.url}/contacto`,
      nombre: r.nombre,
      correo: r.correo,
      ciudad: r.ciudad,
      conjunto: r.conjunto,
      unidades: r.unidades,
      autorizacion_datos: r.autorizacion,
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
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

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip)) {
    return reply(429, {
      success: false,
      error: "Recibimos varias solicitudes seguidas desde tu conexión. Espera unos minutos o escríbenos por WhatsApp.",
    });
  }

  const demo = normalizeDemoRequest(input);
  const receivedAt = new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" });

  const channels: Array<Promise<void>> = [];
  if (process.env.RESEND_API_KEY) channels.push(sendEmail(demo, receivedAt));
  if (process.env.LEADS_WEBHOOK_URL) channels.push(sendWebhook(demo, receivedAt));

  if (channels.length === 0) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[solicitud-demo] No delivery channel configured; request logged only:", demo);
      return reply(200, { success: true, data: { delivered: false } });
    }
    console.error("[solicitud-demo] No delivery channel configured (RESEND_API_KEY or LEADS_WEBHOOK_URL).");
    return reply(503, {
      success: false,
      error: "No pudimos recibir tu solicitud en este momento. Escríbenos por WhatsApp y te atendemos de inmediato.",
    });
  }

  const results = await Promise.allSettled(channels);
  results
    .filter((r): r is PromiseRejectedResult => r.status === "rejected")
    .forEach((r) => console.error("[solicitud-demo] Delivery failed:", r.reason));

  if (results.some((r) => r.status === "fulfilled")) return reply(200, { success: true });

  return reply(502, {
    success: false,
    error: "No pudimos enviar tu solicitud. Inténtalo de nuevo en un momento o escríbenos por WhatsApp.",
  });
}
