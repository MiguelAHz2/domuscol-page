"use client";

import { useMemo, useState } from "react";
import { CONJUNTO, statusLabel, type Unit } from "@/lib/data/units";
import { cn, formatCOP, mulberry32 } from "@/lib/utils";

interface FacadeProps {
  units: Unit[];
  /** Unit shown on the demo phone; outlined until it pays. */
  residentUnitId: string;
  justPaidId: string | null;
}

const windowClass: Record<Unit["status"], string> = {
  "al-dia": "bg-emerald shadow-[0_0_10px_rgb(var(--c-emerald)/0.45)]",
  pendiente: "bg-window",
  mora: "bg-amber shadow-[0_0_8px_rgb(var(--c-amber)/0.35)]",
};

export function Facade({ units, residentUnitId, justPaidId }: FacadeProps) {
  const [hovered, setHovered] = useState<Unit | null>(null);

  // Load choreography: windows switch on floor by floor, bottom to top,
  // like a building at dusk. Delays are fixed per unit so re-renders
  // never restart the animation.
  const delays = useMemo(() => {
    const rand = mulberry32(2001);
    return new Map(
      units.map((u) => [
        u.id,
        700 + (u.floor - 1) * 95 + (u.tower - 1) * 45 + u.apt * 12 + Math.round(rand() * 140),
      ]),
    );
    // Delays depend only on the unit layout, which never changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const towers = Array.from({ length: CONJUNTO.towers }, (_, i) => units.filter((u) => u.tower === i + 1));
  const counts = {
    alDia: units.filter((u) => u.status === "al-dia").length,
    pendiente: units.filter((u) => u.status === "pendiente").length,
    mora: units.filter((u) => u.status === "mora").length,
  };

  return (
    <div>
      <div
        role="img"
        aria-label={`Fachada del conjunto: ${counts.alDia} unidades al día, ${counts.pendiente} pendientes y ${counts.mora} en mora.`}
        onMouseLeave={() => setHovered(null)}
        className="relative overflow-hidden rounded-xl bg-gradient-to-b from-navy-deep to-navy px-3 pt-5 sm:px-4"
      >
        <div className="grid grid-cols-3 items-end gap-2.5 sm:gap-3">
          {towers.map((tower, i) => (
            <div key={i} className="flex flex-col">
              {/* Rooftop: water tank + machine room, as on most Colombian towers */}
              <div aria-hidden className="mx-auto mb-0 h-2 w-1/3 rounded-t-sm bg-navy-raised" />
              <div className="grid grid-cols-4 gap-[3px] rounded-t-md bg-navy-raised p-1.5 sm:gap-1 sm:p-2">
                {tower.map((unit) => {
                  const isResident = unit.id === residentUnitId && unit.status !== "al-dia";
                  const lit = unit.status !== "pendiente";
                  return (
                    <span
                      key={unit.id}
                      onMouseEnter={() => setHovered(unit)}
                      style={{ ["--d" as string]: `${delays.get(unit.id)}ms` }}
                      className={cn(
                        "aspect-[5/6] rounded-[2px] transition-colors duration-500 sm:rounded-[3px]",
                        windowClass[unit.status],
                        unit.id === justPaidId ? "window-just-paid" : lit && "window-lit",
                        isResident && "outline outline-2 outline-offset-1 outline-white",
                        hovered?.id === unit.id && !isResident && "outline outline-1 outline-offset-1 outline-white/70",
                      )}
                    />
                  );
                })}
              </div>
              <p className="border-t border-white/15 py-1.5 text-center text-[11px] font-medium text-white/60">
                Torre {i + 1}
              </p>
            </div>
          ))}
        </div>
      </div>

      <p aria-hidden className="mt-2.5 min-h-[1.25rem] text-xs text-muted tabular">
        {hovered ? (
          <>
            <span className="font-semibold text-ink">{hovered.id}</span>, {statusLabel[hovered.status]}
            {hovered.status !== "al-dia" && `, debe ${formatCOP(CONJUNTO.cuota)}`}
          </>
        ) : (
          <>Pasa el cursor por una ventana para ver la unidad.</>
        )}
      </p>
    </div>
  );
}
