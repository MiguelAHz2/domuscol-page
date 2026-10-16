import { track } from "@vercel/analytics";

// Conversion events for Vercel Web Analytics (cookie-free). They count the
// actions that matter for sales; no personal data is sent.
type EventName = "Solicitud de demo" | "WhatsApp" | "Recorrido del día";

export function trackEvent(name: EventName, properties?: Record<string, string | number>) {
  try {
    track(name, properties);
  } catch {
    // Analytics must never get in the way of the page.
  }
}

/** Size band of a conjunto, so reports group requests without exact data. */
export function unitsBand(units: number) {
  if (units < 50) return "menos de 50";
  if (units < 150) return "50 a 149";
  if (units < 400) return "150 a 399";
  return "400 o más";
}
