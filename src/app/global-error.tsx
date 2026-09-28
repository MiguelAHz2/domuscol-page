"use client";

import { useEffect } from "react";
import { reportError } from "@/lib/monitoring";
import { whatsappHref } from "@/lib/site";
import "./globals.css";

// Last resort when the root layout itself fails: no navbar, no fonts, just
// a way forward.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    reportError(error);
  }, [error]);

  return (
    <html lang="es-CO">
      <body className="grid min-h-screen place-items-center bg-bg px-4 font-sans text-body">
        <main className="max-w-md py-16">
          <h1 className="text-4xl font-extrabold text-ink">DomusCol no cargó</h1>
          <p className="mt-4 text-lg">
            Algo falló al abrir el sitio. Vuelve a intentarlo; si sigue igual, escríbenos por WhatsApp.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={reset}
              className="h-12 rounded-xl bg-emerald px-6 font-semibold text-navy-deep"
            >
              Intentar de nuevo
            </button>
            <a
              href={whatsappHref()}
              className="inline-flex h-12 items-center rounded-xl border border-line px-6 font-semibold text-ink"
            >
              Escribir por WhatsApp
            </a>
          </div>
          {error.digest && <p className="mt-6 text-xs text-muted">Código del error: {error.digest}</p>}
        </main>
      </body>
    </html>
  );
}
