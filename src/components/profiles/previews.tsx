import { Bell, CalendarDays, Download, Megaphone, Package } from "lucide-react";
import type { ProfileId } from "@/lib/data/profiles";
import { cn } from "@/lib/utils";

// Same six-month recaudo series the web-admin dashboard mock uses.
const RECAUDO = [
  { month: "Abr", value: 98.5 },
  { month: "May", value: 104.2 },
  { month: "Jun", value: 99.8 },
  { month: "Jul", value: 112.3 },
  { month: "Ago", value: 123.1 },
  { month: "Sep", value: 128.5 },
];

function AdminReport() {
  const max = 140;
  return (
    <div className="rounded-[20px] border border-line bg-surface p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-muted">Informe de gestión</p>
          <p className="text-base font-bold text-ink">Septiembre 2026</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-white dark:bg-surface-2 dark:text-ink">
          <Download aria-hidden className="h-3.5 w-3.5" /> Exportar PDF
        </span>
      </div>

      <figure className="mt-6">
        <figcaption className="text-xs font-semibold text-ink">Recaudo mensual, millones de pesos</figcaption>
        <div className="mt-4 flex h-40 items-end gap-2.5 border-b border-line sm:gap-4">
          {RECAUDO.map((r, i) => {
            const last = i === RECAUDO.length - 1;
            return (
              <div key={r.month} className="flex h-full flex-1 flex-col justify-end">
                <span className={cn("mb-1 text-center text-[11px] tabular", last ? "font-bold text-ink" : "text-muted")}>
                  {r.value.toLocaleString("es-CO")}
                </span>
                <div
                  className={cn("rounded-t-md", last ? "bg-emerald" : "bg-[rgb(var(--c-cobalt)/0.22)]")}
                  style={{ height: `${(r.value / max) * 100}%` }}
                />
              </div>
            );
          })}
        </div>
        <div className="mt-1.5 flex gap-2.5 sm:gap-4">
          {RECAUDO.map((r) => (
            <span key={r.month} className="flex-1 text-center text-[11px] text-muted">
              {r.month}
            </span>
          ))}
        </div>
      </figure>

      <dl className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-surface-2 p-3">
          <dt className="text-[11px] text-muted">Cartera vencida</dt>
          <dd className="text-lg font-bold text-ink tabular">$8,4 M</dd>
          <dd className="text-[11px] text-emerald-ink">12 % menos que agosto</dd>
        </div>
        <div className="rounded-xl bg-surface-2 p-3">
          <dt className="text-[11px] text-muted">Ejecución presupuestal</dt>
          <dd className="text-lg font-bold text-ink tabular">74 %</dd>
          <dd className="text-[11px] text-muted">del presupuesto anual</dd>
        </div>
      </dl>
    </div>
  );
}

function ResidentFeed() {
  const items = [
    {
      icon: CalendarDays,
      tone: "emerald",
      title: "Reserva confirmada",
      text: "BBQ 2, sábado 10 de octubre, de 12:00 m. a 4:00 p. m.",
      meta: "Depósito de $50.000 pagado",
    },
    {
      icon: Megaphone,
      tone: "cobalt",
      title: "Circular 018 de la administración",
      text: "Corte de agua el martes 20 de octubre, de 8:00 a. m. a 12:00 m., por lavado de tanques.",
      meta: "Confirmar lectura",
    },
    {
      icon: Package,
      tone: "neutral",
      title: "Portería",
      text: "Llegó un paquete para tu apartamento. Recógelo en la recepción de la Torre 2.",
      meta: "Hace 5 min",
    },
  ] as const;

  return (
    <div className="relative mx-auto max-w-md">
      <div className="mb-3 flex items-center justify-between px-1">
        <p className="text-sm font-bold text-ink">Hola, Laura</p>
        <span className="relative grid h-9 w-9 place-items-center rounded-xl border border-line bg-surface text-ink">
          <Bell aria-hidden className="h-4 w-4" />
          <span aria-hidden className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-emerald" />
        </span>
      </div>
      <ul className="space-y-3">
        {items.map(({ icon: Icon, tone, title, text, meta }, i) => (
          <li
            key={title}
            className={cn("flex gap-3.5 rounded-2xl border border-line bg-surface p-4", i === 1 && "sm:ml-8", i === 2 && "sm:ml-4")}
          >
            <span
              className={cn(
                "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
                tone === "emerald" && "bg-[rgb(var(--c-emerald)/0.14)] text-emerald-ink",
                tone === "cobalt" && "bg-[rgb(var(--c-cobalt)/0.1)] text-cobalt",
                tone === "neutral" && "bg-surface-2 text-body",
              )}
            >
              <Icon aria-hidden className="h-[18px] w-[18px]" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink">{title}</p>
              <p className="mt-0.5 text-sm text-body">{text}</p>
              <p className={cn("mt-1.5 text-xs", tone === "cobalt" ? "font-semibold text-cobalt" : "text-muted")}>{meta}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BoardView() {
  const rubros = [
    { name: "Vigilancia", value: 82 },
    { name: "Aseo y jardinería", value: 76 },
    { name: "Mantenimiento", value: 58 },
    { name: "Servicios públicos", value: 91 },
  ];
  const porteria = [
    { time: "15:20", text: "Vehículo visitante para T3-102, parqueadero 14" },
    { time: "14:12", text: "Ingresó visitante de T1-804 con pase QR" },
    { time: "14:05", text: "Paquete de mensajería para T3-201" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
      <div className="rounded-[20px] border border-line bg-surface p-5">
        <p className="text-xs text-muted">Consejo de administración</p>
        <p className="text-base font-bold text-ink">Ejecución presupuestal</p>
        <ul className="mt-4 space-y-3">
          {rubros.map((r) => (
            <li key={r.name} className="text-xs">
              <div className="flex justify-between">
                <span className="text-body">{r.name}</span>
                <span className="font-semibold text-ink tabular">{r.value} %</span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-surface-2">
                <div
                  className={cn("h-full rounded-full", r.value > 90 ? "bg-amber" : "bg-cobalt")}
                  style={{ width: `${r.value}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[11px] text-muted">Servicios públicos cerca del tope anual.</p>
      </div>
      <div className="rounded-[20px] border border-line bg-surface p-5">
        <p className="text-xs text-muted">Portería, turno de la tarde</p>
        <p className="text-base font-bold text-ink">Minuta digital</p>
        <ul className="mt-4 divide-y divide-line">
          {porteria.map((p) => (
            <li key={p.time} className="flex gap-3 py-2.5 text-xs first:pt-0">
              <span className="w-9 shrink-0 font-semibold text-ink tabular">{p.time}</span>
              <span className="text-body">{p.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function ProfilePreview({ id }: { id: ProfileId }) {
  if (id === "administradores") return <AdminReport />;
  if (id === "residentes") return <ResidentFeed />;
  return <BoardView />;
}
