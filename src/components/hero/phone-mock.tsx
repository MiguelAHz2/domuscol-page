"use client";

import { useEffect, useState } from "react";
import { Building2, CalendarDays, Check, CircleCheck, Clock, Download, LoaderCircle, Megaphone, QrCode, Wallet } from "lucide-react";
import { Isotipo } from "@/components/brand/logo";
import { CONJUNTO, PAYMENT_METHODS, type PaymentMethod } from "@/lib/data/units";
import { cn, formatCOP } from "@/lib/utils";

export type PayState = "idle" | "processing" | "approved";

interface PhoneMockProps {
  residentName: string;
  unitId: string;
  state: PayState;
  method: PaymentMethod;
  reference: string;
  isLastResident: boolean;
  onMethodChange: (method: PaymentMethod) => void;
  onPay: () => void;
  onNext: () => void;
}

export function PhoneMock({
  residentName,
  unitId,
  state,
  method,
  reference,
  isLastResident,
  onMethodChange,
  onPay,
  onNext,
}: PhoneMockProps) {
  const [tower, apt] = unitId.replace("T", "").split("-");
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => setDownloaded(false), [unitId]);

  return (
    <div className="rounded-[42px] bg-navy-deep p-2 shadow-float ring-1 ring-white/15">
      <div className="relative flex h-[508px] flex-col overflow-hidden rounded-[34px] bg-bg">
        <div aria-hidden className="absolute left-1/2 top-2 z-10 h-[22px] w-[76px] -translate-x-1/2 rounded-full bg-navy-deep" />

        {/* App header */}
        <div className="rounded-b-[22px] bg-navy px-4 pb-4 pt-3 text-white">
          <div aria-hidden className="flex items-center justify-between px-2 text-[11px] font-semibold">
            <span>9:41</span>
            <span className="flex items-center gap-1">
              <span className="flex items-end gap-[2px]">
                {[4, 6, 8, 10].map((h) => (
                  <span key={h} className="w-[3px] rounded-[1px] bg-white" style={{ height: h }} />
                ))}
              </span>
              <span className="ml-1 h-[10px] w-[20px] rounded-[3px] border border-white/70 p-[1.5px]">
                <span className="block h-full w-3/4 rounded-[1px] bg-white" />
              </span>
            </span>
          </div>
          <div className="mt-5 flex items-center gap-2">
            <Isotipo className="h-6 w-6 text-white" />
            <span className="text-[11px] text-white/70">Altos del Bosque</span>
          </div>
          <p className="mt-2 text-lg font-bold leading-tight">Hola, {residentName}</p>
          <p className="mt-1 inline-flex rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-white/80">
            Torre {tower}, apto {apt}
          </p>
        </div>

        <div className="flex-1 px-3.5 pt-3.5">
          {state === "approved" ? (
            <div key={`ok-${unitId}`} className="animate-enter rounded-2xl border border-line bg-surface p-4 text-center">
              <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-[rgb(var(--c-emerald)/0.15)] text-emerald-ink">
                <CircleCheck aria-hidden className="h-6 w-6" />
              </span>
              <p className="mt-2.5 text-base font-bold text-ink">Pago aprobado</p>
              <p className="text-[11px] text-muted tabular">
                {method}, referencia {reference}
              </p>
              <p className="mt-2.5 text-xs leading-snug text-body">
                Tu unidad quedó al día. La administración ya ve el pago en su panel.
              </p>
              <button
                type="button"
                onClick={() => setDownloaded(true)}
                className="mt-3 flex h-9 w-full items-center justify-center gap-1.5 rounded-xl border border-line bg-surface text-xs font-semibold text-ink transition-colors hover:border-[rgb(var(--c-ink)/0.3)]"
              >
                {downloaded ? (
                  <>
                    <Check aria-hidden className="h-3.5 w-3.5 text-emerald-ink" /> Paz y salvo descargado
                  </>
                ) : (
                  <>
                    <Download aria-hidden className="h-3.5 w-3.5" /> Descargar paz y salvo
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onNext}
                className="mt-2.5 text-xs font-semibold text-cobalt underline-offset-2 hover:underline"
              >
                {isLastResident ? "Reiniciar la demo" : "Pagar con otra unidad"}
              </button>
            </div>
          ) : (
            <div key={`pay-${unitId}`} className="animate-enter">
              <div className="rounded-2xl border border-line bg-surface p-3.5">
                <p className="text-[11px] text-muted">Cuota de administración, {CONJUNTO.period} 2026</p>
                <p className="mt-0.5 text-[1.625rem] font-extrabold leading-tight tracking-[-0.02em] text-ink tabular">
                  {formatCOP(CONJUNTO.cuota)}
                </p>
                <p className="mt-1 flex items-center gap-1 text-[11px] text-body">
                  <Clock aria-hidden className="h-3 w-3" /> Vence el 10 de {CONJUNTO.period}
                </p>
              </div>

              <p id="metodo-pago" className="mt-3 text-[11px] font-semibold text-ink">
                Paga con
              </p>
              <div role="radiogroup" aria-labelledby="metodo-pago" className="mt-1.5 grid grid-cols-2 gap-1.5">
                {PAYMENT_METHODS.map((m) => {
                  const checked = m === method;
                  return (
                    <button
                      key={m}
                      type="button"
                      role="radio"
                      aria-checked={checked}
                      disabled={state === "processing"}
                      onClick={() => onMethodChange(m)}
                      className={cn(
                        "flex h-9 items-center justify-center gap-1 rounded-xl border text-xs font-semibold transition-colors",
                        checked
                          ? "border-emerald bg-[rgb(var(--c-emerald)/0.1)] text-ink"
                          : "border-line bg-surface text-body hover:border-[rgb(var(--c-ink)/0.25)]",
                      )}
                    >
                      {checked && <Check aria-hidden className="h-3 w-3 text-emerald-ink" />}
                      {m}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={onPay}
                disabled={state === "processing"}
                className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald text-sm font-bold text-navy-deep transition-[background-color,transform] hover:bg-[rgb(var(--c-emerald)/0.9)] active:translate-y-px disabled:cursor-wait"
              >
                {state === "processing" ? (
                  <>
                    <LoaderCircle aria-hidden className="h-4 w-4 animate-spin" /> Procesando pago
                  </>
                ) : (
                  <>Pagar {formatCOP(CONJUNTO.cuota)}</>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Tab bar */}
        <nav aria-hidden className="grid grid-cols-5 border-t border-line bg-surface px-1 pb-4 pt-2 text-[9px] font-medium text-muted">
          {[
            { icon: Building2, label: "Inicio" },
            { icon: Wallet, label: "Pagos", active: true },
            { icon: CalendarDays, label: "Reservas" },
            { icon: QrCode, label: "Visitas" },
            { icon: Megaphone, label: "Cartelera" },
          ].map(({ icon: Icon, label, active }) => (
            <span key={label} className={cn("flex flex-col items-center gap-0.5", active && "text-emerald-ink")}>
              <Icon className="h-4 w-4" />
              {label}
            </span>
          ))}
        </nav>
      </div>
    </div>
  );
}
