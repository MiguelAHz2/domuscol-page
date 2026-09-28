import { Check } from "lucide-react";
import { QrCode } from "@/components/modules/qr-code";
import type { VignetteKind } from "@/lib/data/modules";
import { cn } from "@/lib/utils";

// Compact product screens that float in glass over each module's photo:
// the paz y salvo, the visitor pass, the salón social calendar, a weighted
// vote and the maintenance plan. Content sits directly on the glass.

function PazYSalvo() {
  return (
    <div>
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 -rotate-12 place-items-center rounded-full border-2 border-emerald text-emerald-ink">
          <Check aria-hidden className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold text-ink">Certificado de paz y salvo</p>
          <p className="mt-0.5 text-xs leading-relaxed text-body">
            <span className="font-semibold text-ink">T2-502</span> al día en cuotas de administración a 30 de septiembre de
            2026.
          </p>
          <p className="mt-1.5 text-[11px] text-muted tabular">Verificación DC-7Q4K-2291</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5 border-t border-[rgb(var(--c-ink)/0.08)] pt-3">
        {["PSE", "Tarjeta", "Nequi", "Daviplata"].map((m) => (
          <span key={m} className="rounded-md bg-white/70 px-2 py-0.5 text-[11px] font-semibold text-ink dark:bg-white/10">
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}

function PaseQr() {
  return (
    <div className="flex items-center gap-4">
      <QrCode className="h-[76px] w-[76px] shrink-0 rounded-md" />
      <div className="min-w-0">
        <p className="text-[11px] text-muted">Pase de visitante</p>
        <p className="text-sm font-bold text-ink">Andrés Gómez</p>
        <p className="text-xs text-body">Torre 1, apto 804</p>
        <p className="text-xs text-body tabular">Hoy, 2:00 p. m. a 6:00 p. m.</p>
        <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-emerald-ink">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-emerald" /> Vigente
        </p>
      </div>
    </div>
  );
}

function Reservas() {
  const days = [
    { d: "Lun", n: 5, s: "libre" },
    { d: "Mar", n: 6, s: "libre" },
    { d: "Mié", n: 7, s: "ocupado" },
    { d: "Jue", n: 8, s: "libre" },
    { d: "Vie", n: 9, s: "ocupado" },
    { d: "Sáb", n: 10, s: "tuyo" },
    { d: "Dom", n: 11, s: "libre" },
  ] as const;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-sm font-bold text-ink">Salón social</p>
        <p className="text-[11px] text-muted">5 al 11 de octubre</p>
      </div>
      <ul className="mt-3 grid grid-cols-7 gap-1">
        {days.map((day) => (
          <li
            key={day.n}
            className={cn(
              "flex flex-col items-center rounded-lg py-1.5 text-[10px] tabular",
              day.s === "libre" && "bg-white/70 text-body ring-1 ring-[rgb(var(--c-emerald)/0.45)] dark:bg-white/5",
              day.s === "ocupado" && "text-muted line-through",
              day.s === "tuyo" && "bg-emerald text-navy-deep",
            )}
          >
            <span>{day.d}</span>
            <span className="text-sm font-bold">{day.n}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-body">
        <span className="font-semibold text-ink">Sábado 10 reservado para T2-502.</span> Depósito pagado.
      </p>
    </div>
  );
}

function Votacion() {
  const options = [
    { label: "Sí", value: 61.4, className: "bg-emerald" },
    { label: "No", value: 27.9, className: "bg-[rgb(var(--c-cobalt)/0.55)]" },
    { label: "Abstención", value: 10.7, className: "bg-[rgb(var(--c-muted)/0.45)]" },
  ];
  return (
    <div>
      <p className="text-[11px] text-muted">Asamblea extraordinaria, punto 3 de 5</p>
      <p className="mt-0.5 text-sm font-bold text-ink">¿Aprobar la impermeabilización de cubiertas?</p>
      <ul className="mt-3 space-y-2">
        {options.map((o) => (
          <li key={o.label} className="text-xs">
            <div className="flex justify-between text-body">
              <span>{o.label}</span>
              <span className="font-semibold text-ink tabular">{o.value.toLocaleString("es-CO")} %</span>
            </div>
            <div className="mt-1 h-1.5 rounded-full bg-[rgb(var(--c-ink)/0.08)]">
              <div className={cn("h-full rounded-full", o.className)} style={{ width: `${o.value}%` }} />
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[11px] text-muted">Votos ponderados por coeficiente. Quórum: 72,3 %.</p>
    </div>
  );
}

function Mantenimiento() {
  const plan = [
    { date: "12 oct", title: "Ascensores Torre 2", done: true },
    { date: "20 oct", title: "Lavado de tanques", done: true },
    { date: "3 nov", title: "Prueba de planta eléctrica", done: false },
  ];
  return (
    <div>
      <p className="text-sm font-bold text-ink">Próximos mantenimientos</p>
      <ul className="mt-2 divide-y divide-[rgb(var(--c-ink)/0.08)]">
        {plan.map((p) => (
          <li key={p.title} className="flex items-center gap-3 py-2 text-xs">
            <span className="w-12 shrink-0 font-semibold text-cobalt tabular">{p.date}</span>
            <span className="min-w-0 flex-1 truncate text-ink">{p.title}</span>
            <span className={cn("shrink-0 text-[11px]", p.done ? "font-semibold text-emerald-ink" : "text-muted")}>
              {p.done ? "Confirmado" : "Por confirmar"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Vignette({ kind }: { kind: VignetteKind }) {
  switch (kind) {
    case "paz-y-salvo":
      return <PazYSalvo />;
    case "pase-qr":
      return <PaseQr />;
    case "reservas":
      return <Reservas />;
    case "votacion":
      return <Votacion />;
    case "mantenimiento":
      return <Mantenimiento />;
  }
}
