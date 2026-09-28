"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Play } from "lucide-react";
import { AdminPanel } from "@/components/hero/admin-panel";
import { PhoneMock, type PayState } from "@/components/hero/phone-mock";
import { Skyline } from "@/components/hero/skyline";
import { buttonClass } from "@/components/ui/button";
import { hasDemoVideo, VideoDialog, type VideoDialogHandle } from "@/components/ui/video-dialog";
import { DAY_TOUR_EVENT } from "@/lib/data/day";
import {
  buildUnits,
  DEMO_RESIDENTS,
  INITIAL_ACTIVITY,
  type ActivityItem,
  type PaymentMethod,
} from "@/lib/data/units";

export function Hero() {
  const [units, setUnits] = useState(buildUnits);
  const [residentIndex, setResidentIndex] = useState(0);
  const [payState, setPayState] = useState<PayState>("idle");
  const [method, setMethod] = useState<PaymentMethod>("Nequi");
  const [activity, setActivity] = useState<ActivityItem[]>(INITIAL_ACTIVITY);
  const [justPaidId, setJustPaidId] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const video = useRef<VideoDialogHandle>(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  // Until the video exists, the secondary button plays "Un día en Altos del
  // Bosque" from dawn: the same modules, shown working through a day.
  function startTour() {
    const target = document.getElementById("un-dia-maqueta");
    if (!target) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    window.dispatchEvent(new Event(DAY_TOUR_EVENT));
  }

  const resident = DEMO_RESIDENTS[residentIndex];
  const isLastResident = residentIndex === DEMO_RESIDENTS.length - 1;
  const reference = `${4821 + residentIndex * 137}-${3390 + residentIndex * 71}`;

  function pay() {
    setPayState("processing");
    timer.current = setTimeout(() => {
      setPayState("approved");
      setUnits((prev) => prev.map((u) => (u.id === resident.unitId ? { ...u, status: "al-dia" } : u)));
      setJustPaidId(resident.unitId);
      setActivity((prev) =>
        [
          { id: `pago-${resident.unitId}`, kind: "pago" as const, text: `${resident.unitId} pagó con ${method}`, time: "ahora" },
          ...prev.map((a) => (a.time === "ahora" ? { ...a, time: "hace 1 min" } : a)),
        ].slice(0, 3),
      );
    }, 1300);
  }

  function next() {
    setPayState("idle");
    if (isLastResident) {
      setUnits(buildUnits());
      setActivity(INITIAL_ACTIVITY);
      setJustPaidId(null);
      setResidentIndex(0);
    } else {
      setResidentIndex((i) => i + 1);
    }
  }

  return (
    <section id="inicio" className="relative overflow-clip bg-band pt-20 text-ink dark:text-white">
      <Skyline className="pointer-events-none absolute inset-0 h-full w-full" />
      {/* Scrim keeps the headline legible over the towers */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgb(var(--c-bg)/0.9)_0%,rgb(var(--c-bg)/0.55)_38%,transparent_62%)] xl:bg-[linear-gradient(90deg,rgb(var(--c-bg)/0.92)_0%,rgb(var(--c-bg)/0.6)_34%,transparent_52%)] dark:bg-[linear-gradient(90deg,rgb(var(--c-navy)/0.82)_0%,rgb(var(--c-navy)/0.45)_38%,transparent_62%)] dark:xl:bg-[linear-gradient(90deg,rgb(var(--c-navy)/0.85)_0%,rgb(var(--c-navy)/0.5)_34%,transparent_52%)]"
      />

      <div className="relative mx-auto grid max-w-page gap-14 px-4 pb-20 pt-14 sm:px-6 sm:pt-20 lg:px-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,620px)] xl:items-center xl:gap-12 xl:pb-24">
        <div className="max-w-[36rem]">
          <h1 className="animate-rise text-4xl font-extrabold text-ink sm:text-5xl xl:text-[3.25rem] xl:leading-[1.04] dark:text-white">
            La transformación digital que tu conjunto residencial necesita
          </h1>
          <p className="animate-rise mt-6 max-w-[33rem] text-lg text-body [animation-delay:120ms] dark:text-white/75">
            Gestión transparente, pagos en línea, control de accesos y convivencia en una sola plataforma adaptada a la
            Propiedad Horizontal en Colombia.
          </p>
          <div className="animate-rise mt-8 flex flex-col gap-3 [animation-delay:220ms] sm:flex-row">
            <Link href="/contacto" className={buttonClass("primary", "lg")}>
              Solicitar demo
            </Link>
            {hasDemoVideo ? (
              <button type="button" onClick={() => video.current?.open()} className={buttonClass("ghost", "lg")}>
                <Play aria-hidden className="h-4 w-4" />
                Ver video demostrativo
              </button>
            ) : (
              <button type="button" onClick={startTour} className={buttonClass("ghost", "lg")}>
                <Play aria-hidden className="h-4 w-4" />
                Ver el recorrido
              </button>
            )}
          </div>
          <p className="animate-rise mt-8 flex items-start gap-2.5 text-sm text-muted [animation-delay:320ms] dark:text-white/60">
            <span aria-hidden className="mt-[7px] h-2 w-2 shrink-0 rounded-[2px] bg-emerald" />
            La Fase 1 está en desarrollo. Los conjuntos que soliciten demo ahora entran primero al lanzamiento.
          </p>
        </div>

        <figure className="animate-rise relative mx-auto w-full max-w-[640px] [animation-delay:300ms] xl:max-w-none">
          <div className="flex flex-col items-center sm:flex-row sm:items-start">
            <div className="w-full min-w-0 sm:flex-1">
              <AdminPanel
                units={units}
                residentUnitId={resident.unitId}
                justPaidId={justPaidId}
                activity={activity}
              />
              <figcaption className="mt-5 max-w-[26rem] rounded-2xl border border-line bg-surface/85 px-4 py-3 text-sm text-body dark:border-white/10 dark:bg-navy-deep/60 dark:text-white/70">
                Paga la cuota de <span className="font-semibold text-ink dark:text-white">{resident.unitId}</span> desde el celular y
                mira cómo se enciende su ventana en el panel del administrador.
              </figcaption>
            </div>
            <div className="relative z-10 mt-8 w-[248px] shrink-0 sm:-ml-6 sm:mt-14">
              <PhoneMock
                residentName={resident.name}
                unitId={resident.unitId}
                state={payState}
                method={method}
                reference={reference}
                isLastResident={isLastResident}
                onMethodChange={setMethod}
                onPay={pay}
                onNext={next}
              />
            </div>
          </div>
        </figure>
      </div>

      <VideoDialog ref={video} />
    </section>
  );
}
