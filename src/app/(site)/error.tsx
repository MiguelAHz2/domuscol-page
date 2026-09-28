"use client";

import { useEffect } from "react";
import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";
import { buttonClass } from "@/components/ui/button";
import { WhatsappIcon } from "@/components/ui/social-icons";
import { reportError } from "@/lib/monitoring";
import { whatsappHref } from "@/lib/site";

// Shown inside the site layout (navbar and footer stay) when a page fails.
export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    reportError(error);
  }, [error]);

  return (
    <PageHero
      title="Esta página no cargó"
      lead="Algo falló al mostrarla. Vuelve a intentarlo; si sigue igual, escríbenos por WhatsApp y te atendemos por ahí."
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={reset} className={buttonClass("primary", "lg")}>
          Intentar de nuevo
        </button>
        <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className={buttonClass("ghost", "lg")}>
          <WhatsappIcon className="h-4 w-4" />
          Escribir por WhatsApp
        </a>
      </div>
      <Link href="/" className="mt-6 inline-block text-sm font-semibold underline decoration-2 underline-offset-4">
        Volver al inicio
      </Link>
      {error.digest && <p className="mt-6 text-xs text-muted dark:text-white/50">Código del error: {error.digest}</p>}
    </PageHero>
  );
}
