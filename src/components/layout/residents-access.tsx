"use client";

import { useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { buttonClass } from "@/components/ui/button";
import { WhatsappIcon } from "@/components/ui/social-icons";
import { site, whatsappHref } from "@/lib/site";

// "Acceso residentes": links to the portal once NEXT_PUBLIC_RESIDENTS_URL is
// set. Until the portal launches it explains that instead of a dead link.
export function ResidentsAccess({ className, children }: { className?: string; children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  if (site.residentsUrl) {
    return (
      <a href={site.residentsUrl} className={className}>
        {children}
      </a>
    );
  }

  const close = () => dialogRef.current?.close();

  return (
    <>
      <button type="button" onClick={() => dialogRef.current?.showModal()} className={className}>
        {children}
      </button>
      <dialog
        ref={dialogRef}
        aria-labelledby="residentes-titulo"
        onClick={(e) => e.target === dialogRef.current && close()}
        className="w-[min(28rem,calc(100vw-2rem))] rounded-[20px] border border-line bg-surface p-6 text-body shadow-float open:animate-enter"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="residentes-titulo" className="text-xl font-bold">
            El portal de residentes llega con la Fase 1
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Cerrar"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-muted transition-colors hover:bg-surface-2 hover:text-ink"
          >
            <X aria-hidden className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 text-sm">
          Cuando tu conjunto active DomusCol, la administración te enviará el enlace para crear tu cuenta. Si tienes dudas,
          escríbenos.
        </p>
        <a
          href={whatsappHref("Hola, soy residente y quiero saber cómo acceder a DomusCol.")}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass("primary", "md", "mt-5 w-full")}
        >
          <WhatsappIcon className="h-4 w-4" />
          Escribir por WhatsApp
        </a>
      </dialog>
    </>
  );
}
