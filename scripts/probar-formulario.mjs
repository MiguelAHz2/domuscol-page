// Prueba de punta a punta del formulario de demo con testmail.app:
// envía una solicitud a /api/solicitud-demo con un correo de testmail y
// espera el correo de confirmación que debe recibir el interesado.
//
// Uso (PowerShell):
//   $env:TESTMAIL_APIKEY="..."; $env:TESTMAIL_NAMESPACE="..."
//   node scripts/probar-formulario.mjs                  # http://localhost:3100
//   node scripts/probar-formulario.mjs https://domuscol.me
//
// Si LEADS_EMAIL_TO también es una dirección de testmail
// (<namespace>.equipo@inbox.testmail.app), pasa --equipo para esperar
// además el correo que le llega al equipo de ventas.
//
// Con Turnstile activo, el sitio exige un token real. Prueba en local o en
// un preview con las claves de prueba de Cloudflare (ver .env.example).

const base = (process.argv.find((a) => a.startsWith("http")) ?? "http://localhost:3100").replace(/\/$/, "");
const checkTeam = process.argv.includes("--equipo");
const { TESTMAIL_APIKEY: apikey, TESTMAIL_NAMESPACE: namespace } = process.env;

if (!apikey || !namespace) {
  console.error("Faltan TESTMAIL_APIKEY y TESTMAIL_NAMESPACE (los encuentras en https://testmail.app/console).");
  process.exit(1);
}

const tag = `demo${Date.now()}`;
const correo = `${namespace}.${tag}@inbox.testmail.app`;
const startedAt = Date.now();

console.log(`1/3  Enviando una solicitud a ${base}/api/solicitud-demo como ${correo}`);
const res = await fetch(`${base}/api/solicitud-demo`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    nombre: "Prueba Automática",
    correo,
    ciudad: "Bogotá",
    conjunto: "Conjunto de Prueba testmail",
    unidades: "120",
    autorizacion: true,
    // Token de prueba que aceptan las claves de prueba de Cloudflare.
    turnstile: process.env.TURNSTILE_TEST_TOKEN ?? "XXXX.DUMMY.TOKEN.XXXX",
  }),
});
const body = await res.json().catch(() => ({}));
console.log(`     Respuesta ${res.status}:`, JSON.stringify(body));
if (!res.ok || !body.success) {
  if (res.status === 403) console.error("     Turnstile rechazó el token: prueba en local o en un preview con las claves de prueba.");
  process.exit(1);
}
if (body.data?.delivered === false) {
  console.error("     El servidor no tiene canales configurados (modo desarrollo): no se envió ningún correo.");
  process.exit(1);
}

async function waitFor(emailTag, label) {
  const url = new URL("https://api.testmail.app/api/json");
  url.search = new URLSearchParams({
    apikey,
    namespace,
    tag: emailTag,
    livequery: "true",
    timestamp_from: String(startedAt),
  }).toString();
  console.log(`${label}  Esperando el correo en testmail (etiqueta "${emailTag}")...`);
  // livequery mantiene la conexión abierta hasta que llega un correo.
  for (let attempt = 0; attempt < 3; attempt++) {
    const r = await fetch(url, { signal: AbortSignal.timeout(90_000) }).catch((e) => ({ ok: false, statusText: e.message }));
    if (!r.ok) {
      console.log(`     testmail respondió ${r.status ?? ""} ${r.statusText}; reintentando...`);
      continue;
    }
    const data = await r.json();
    if (data.result !== "success") throw new Error(data.message ?? "testmail devolvió un error");
    if (data.count > 0) return data.emails[0];
  }
  return null;
}

const confirmation = await waitFor(tag, "2/3");
if (!confirmation) {
  console.error("     No llegó la confirmación. Revisa RESEND_API_KEY, LEADS_EMAIL_FROM (dominio verificado) y los logs.");
  process.exit(1);
}
console.log(`     Llegó: "${confirmation.subject}" de ${confirmation.from}`);
const ok = /Recibimos tu solicitud/.test(confirmation.subject) && confirmation.text?.includes("Conjunto de Prueba testmail");
console.log(ok ? "     El contenido es el esperado." : "     Ojo: el asunto o el contenido no son los esperados.");

if (checkTeam) {
  const team = await waitFor("equipo", "3/3");
  if (!team) {
    console.error("     No llegó el correo al equipo. Revisa LEADS_EMAIL_TO.");
    process.exit(1);
  }
  console.log(`     Llegó al equipo: "${team.subject}" (responder a: ${team.replyTo ?? "?"})`);
} else {
  console.log("3/3  Omitido: pasa --equipo si LEADS_EMAIL_TO es una dirección de testmail.");
}

console.log(ok ? "\nListo: el formulario funciona de punta a punta." : "\nTerminó con advertencias.");
process.exit(ok ? 0 : 1);
