import type { DemoRequest } from "@/lib/demo-request";
import { company, site, whatsappHref } from "@/lib/site";

// Delivery channels for demo requests. Each one is enabled by its own
// environment variables (see .env.example) and throws when it fails, so
// the API route can tell whether the request reached the team.

const TIMEOUT_MS = 8000;

const escapeHtml = (value: string | number) =>
  String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const list = (value: string | undefined) =>
  (value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const fromAddress = () => process.env.LEADS_EMAIL_FROM || "DomusCol <onboarding@resend.dev>";

export const channels = {
  email: () => Boolean(process.env.RESEND_API_KEY && list(process.env.LEADS_EMAIL_TO).length),
  webhook: () => Boolean(process.env.LEADS_WEBHOOK_URL),
  whatsapp: () => Boolean(process.env.CALLMEBOT_PHONE && process.env.CALLMEBOT_APIKEY),
  confirmation: () => Boolean(process.env.RESEND_API_KEY) && process.env.LEADS_CONFIRMATION_EMAIL !== "false",
};

async function resend(payload: Record<string, unknown>) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`Resend respondió ${res.status}: ${await res.text()}`);
}

function rowsOf(r: DemoRequest, receivedAt: string): Array<[string, string | number]> {
  return [
    ["Nombre", r.nombre],
    ["Correo", r.correo],
    ["Ciudad", r.ciudad],
    ["Conjunto", r.conjunto],
    ["Unidades", r.unidades],
    ["Autorización de datos (Ley 1581)", "Sí"],
    ["Recibida", receivedAt],
  ];
}

const table = (rows: Array<[string, string | number]>) => `
  <table style="border-collapse:collapse;width:100%">
    ${rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:8px 12px 8px 0;border-bottom:1px solid #DCE3EE;color:#5E708A;white-space:nowrap">${escapeHtml(k)}</td><td style="padding:8px 0;border-bottom:1px solid #DCE3EE;font-weight:600">${escapeHtml(v)}</td></tr>`,
      )
      .join("")}
  </table>`;

/** Email to the sales team, with reply-to set to the prospect. */
export async function sendLeadEmail(r: DemoRequest, receivedAt: string) {
  const rows = rowsOf(r, receivedAt);
  await resend({
    from: fromAddress(),
    to: list(process.env.LEADS_EMAIL_TO),
    reply_to: r.correo,
    subject: `Solicitud de demo: ${r.conjunto} (${r.unidades} unidades, ${r.ciudad})`,
    text: rows.map(([k, v]) => `${k}: ${v}`).join("\n"),
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;color:#0D223F;max-width:560px">
        <h2 style="margin:0 0 4px">Nueva solicitud de demo</h2>
        <p style="margin:0 0 16px;color:#5E708A">Llegó desde ${escapeHtml(site.url)}/contacto</p>
        ${table(rows)}
        <p style="margin:16px 0 0;color:#5E708A">Responde a este correo para escribirle directamente a ${escapeHtml(r.nombre)}.</p>
      </div>`,
  });
}

/** JSON POST for Google Sheets, Make, Zapier or a CRM. */
export async function sendLeadWebhook(r: DemoRequest, receivedAt: string) {
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
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`El webhook respondió ${res.status}`);
}

/**
 * WhatsApp message to the team's own phone through CallMeBot, a free
 * service for personal notifications (https://www.callmebot.com). It only
 * delivers to the number that activated the API key.
 */
export async function sendLeadWhatsapp(r: DemoRequest) {
  const text = [
    "Nueva solicitud de demo en DomusCol",
    `Nombre: ${r.nombre}`,
    `Conjunto: ${r.conjunto} (${r.unidades} unidades)`,
    `Ciudad: ${r.ciudad}`,
    `Correo: ${r.correo}`,
  ].join("\n");
  const url =
    "https://api.callmebot.com/whatsapp.php" +
    `?phone=${encodeURIComponent(process.env.CALLMEBOT_PHONE!)}` +
    `&text=${encodeURIComponent(text)}` +
    `&apikey=${encodeURIComponent(process.env.CALLMEBOT_APIKEY!)}`;

  const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  const body = await res.text();
  // CallMeBot answers 200 with an HTML page even for errors; success says
  // "Message queued" or "Message Sent".
  if (!res.ok || !/message (queued|sent)/i.test(body)) {
    throw new Error(`CallMeBot respondió ${res.status}: ${body.replace(/<[^>]+>/g, " ").trim().slice(0, 200)}`);
  }
}

/** Confirmation to the person who asked for the demo. */
export async function sendConfirmation(r: DemoRequest) {
  const firstName = r.nombre.split(/\s+/)[0];
  const whatsapp = whatsappHref(`Hola, solicité una demo de DomusCol para ${r.conjunto}. Mi nombre es ${r.nombre}.`);
  const privacy = `${site.url}/legal/tratamiento-de-datos`;
  const text = [
    `Hola, ${firstName}:`,
    "",
    `Recibimos tu solicitud de demo para ${r.conjunto} (${r.unidades} unidades, ${r.ciudad}).`,
    "Te escribimos en menos de un día hábil para agendarla: son 30 minutos, con la estructura real de tu conjunto.",
    "",
    `Si prefieres avanzar ya, escríbenos por WhatsApp: ${whatsapp}`,
    "",
    "Equipo DomusCol",
    "",
    `Recibes este correo porque solicitaste una demo en ${site.url}. Tratamos tus datos según nuestra política (${privacy}). Para consultarlos, corregirlos o pedir que los eliminemos, escribe a ${company.privacyEmail}.`,
  ].join("\n");

  await resend({
    from: fromAddress(),
    to: [r.correo],
    reply_to: site.salesEmail,
    subject: "Recibimos tu solicitud de demo de DomusCol",
    text,
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;color:#3A4C66;max-width:560px;line-height:1.6">
        <p style="margin:0 0 20px;font-size:20px;font-weight:700;color:#0D223F">DomusCol</p>
        <p style="margin:0 0 12px">Hola, ${escapeHtml(firstName)}:</p>
        <p style="margin:0 0 12px">Recibimos tu solicitud de demo para <strong style="color:#0D223F">${escapeHtml(r.conjunto)}</strong> (${escapeHtml(r.unidades)} unidades, ${escapeHtml(r.ciudad)}).</p>
        <p style="margin:0 0 20px">Te escribimos en menos de un día hábil para agendarla: son 30 minutos, con la estructura real de tu conjunto.</p>
        <p style="margin:0 0 28px"><a href="${escapeHtml(whatsapp)}" style="display:inline-block;background:#10B981;color:#071527;font-weight:700;text-decoration:none;padding:12px 20px;border-radius:12px">Escribir por WhatsApp</a></p>
        <p style="margin:0 0 28px">Equipo DomusCol</p>
        <p style="margin:0;padding-top:16px;border-top:1px solid #DCE3EE;font-size:12px;color:#5E708A">
          Recibes este correo porque solicitaste una demo en ${escapeHtml(site.url)}. Tratamos tus datos según nuestra
          <a href="${privacy}" style="color:#2458E6">Política de tratamiento de datos</a>. Para consultarlos, corregirlos o pedir que los eliminemos, escribe a
          <a href="mailto:${escapeHtml(company.privacyEmail)}" style="color:#2458E6">${escapeHtml(company.privacyEmail)}</a>.
        </p>
      </div>`,
  });
}

/**
 * Cloudflare Turnstile check. Returns false only when Cloudflare says the
 * token is bad; if Cloudflare can't be reached, the request goes through
 * (the honeypot and rate limit still apply) rather than losing a lead.
 */
export async function verifyTurnstile(token: string, ip: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  const form = new URLSearchParams({ secret, response: token });
  if (ip) form.set("remoteip", ip);
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form,
      signal: AbortSignal.timeout(5000),
    });
    const data = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    if (!data.success) console.warn("[solicitud-demo] Turnstile rejected the token:", data["error-codes"]);
    return Boolean(data.success);
  } catch (error) {
    console.error("[solicitud-demo] Turnstile unreachable, letting the request through:", error);
    return true;
  }
}

/** Sends a server error to Sentry when it's configured. */
export async function captureServerError(error: unknown) {
  if (!process.env.SENTRY_DSN) return;
  try {
    const Sentry = await import("@sentry/nextjs");
    Sentry.captureException(error);
    await Sentry.flush(2000);
  } catch {
    // Monitoring must never break the form.
  }
}
