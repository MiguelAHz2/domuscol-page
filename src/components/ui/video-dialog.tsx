"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { Play, X } from "lucide-react";
import { buttonClass } from "@/components/ui/button";

export interface VideoDialogHandle {
  open: () => void;
}

// The walkthrough video ships with the Fase 1 launch; until then the dialog
// says so plainly and offers the live demo instead.
export const VideoDialog = forwardRef<VideoDialogHandle>(function VideoDialog(_, ref) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    open: () => dialogRef.current?.showModal(),
  }));

  const close = () => dialogRef.current?.close();

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="video-titulo"
      onClick={(e) => e.target === dialogRef.current && close()}
      className="w-[min(46rem,calc(100vw-2rem))] rounded-[20px] border border-line bg-surface p-0 text-body shadow-float open:animate-enter"
    >
      <div className="relative aspect-video overflow-hidden bg-navy">
        <div aria-hidden className="blueprint absolute inset-0" />
        <div className="relative grid h-full place-items-center">
          <span className="grid h-16 w-16 place-items-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur">
            <Play aria-hidden className="ml-1 h-7 w-7" />
          </span>
        </div>
        <button
          type="button"
          onClick={close}
          aria-label="Cerrar"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-white transition-colors hover:bg-white/20"
        >
          <X aria-hidden className="h-4 w-4" />
        </button>
      </div>
      <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-md">
          <h2 id="video-titulo" className="text-xl font-bold">
            Recorrido de 2 minutos por DomusCol
          </h2>
          <p className="mt-1 text-sm">
            El video se publica con el lanzamiento de la Fase 1. Mientras tanto, te mostramos la plataforma en vivo con
            la estructura de tu conjunto.
          </p>
        </div>
        <a href="/contacto" onClick={close} className={buttonClass("primary", "md", "shrink-0")}>
          Solicitar demo
        </a>
      </div>
    </dialog>
  );
});
