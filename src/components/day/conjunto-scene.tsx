"use client";

import { forwardRef, type ReactNode } from "react";
import { CalendarDays, Landmark, Megaphone, ShieldCheck, Wrench, type LucideIcon } from "lucide-react";
import { ZONES, type WindowMode, type ZoneId } from "@/lib/data/day";
import { boxFaces, flat, P, pts, quadX, quadY, type Box } from "@/lib/iso";
import { cn, mulberry32 } from "@/lib/utils";

// Isometric illustration of Conjunto Altos del Bosque. Colours come from
// CSS variables (--sky-*, --face-*, --ground…) that the parent section
// interpolates with scroll, so the whole scene moves through the day
// without re-rendering React.

// Extra headroom above the tallest tower keeps the roof pin inside the frame.
const VB = { x: -368, y: -236, w: 736, h: 612 };

type Owner = ZoneId | "torres" | null;

interface Tower {
  id: string;
  box: Box;
}

const TOWERS: Tower[] = [
  { id: "T1", box: { x0: 1, x1: 5, y0: 1, y1: 5, z1: 13 } },
  { id: "T2", box: { x0: 7, x1: 11, y0: 1, y1: 5, z1: 11 } },
  { id: "T3", box: { x0: 1, x1: 5, y0: 7, y1: 11, z1: 10 } },
];

interface Win {
  key: string;
  points: string;
  rank: number;
}

const WINDOWS: Record<string, Win[]> = (() => {
  const rand = mulberry32(2026);
  const out: Record<string, Win[]> = {};
  for (const { id, box } of TOWERS) {
    const list: Win[] = [];
    for (let z = 1.2; z + 0.7 <= box.z1 - 0.5; z += 1.2) {
      for (let c = 0; c < 4; c++) {
        const a = 0.5 + c * 0.95;
        list.push({ key: `${id}-x-${z}-${c}`, points: quadX(box.x1, box.y0 + a, box.y0 + a + 0.5, z, z + 0.7), rank: rand() });
        list.push({ key: `${id}-y-${z}-${c}`, points: quadY(box.y1, box.x0 + a, box.x0 + a + 0.5, z, z + 0.7), rank: rand() });
      }
    }
    out[id] = list;
  }
  return out;
})();

const WARM = "#FFD08C";
const EMERALD = "#10B981";

function windowFill(mode: WindowMode, rank: number) {
  switch (mode) {
    case "dawn":
      return rank < 0.2 ? WARM : "var(--glass)";
    case "paid":
      return rank < 0.91 ? EMERALD : "var(--glass)";
    case "dusk":
      return rank < 0.45 ? WARM : "var(--glass)";
    case "night":
      return rank < 0.72 ? WARM : "var(--glass)";
    default:
      return "var(--glass)";
  }
}

function Solid({ box, top = "var(--face-top)", left = "var(--face-left)", right = "var(--face-right)" }: {
  box: Box;
  top?: string;
  left?: string;
  right?: string;
}) {
  const f = boxFaces(box);
  return (
    <>
      <polygon points={f.left} fill={left} />
      <polygon points={f.right} fill={right} />
      <polygon points={f.top} fill={top} />
    </>
  );
}

function Tree({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const [bx, by] = P(x, y, 0);
  const [cx, cy] = P(x, y, 1.9 * s);
  return (
    <g>
      <ellipse cx={bx} cy={by} rx={9 * s} ry={4.5 * s} fill="rgb(13 34 63 / 0.12)" />
      <line x1={bx} y1={by} x2={cx} y2={cy + 6} stroke="var(--trunk)" strokeWidth={2.5} />
      <circle cx={cx} cy={cy} r={11 * s} fill="var(--tree)" />
      <circle cx={cx - 3.5 * s} cy={cy - 3.5 * s} r={4.5 * s} fill="rgb(255 255 255 / 0.14)" />
    </g>
  );
}

const PIN_ICONS: Record<ZoneId, LucideIcon> = {
  porteria: ShieldCheck,
  administracion: Landmark,
  tanques: Wrench,
  cartelera: Megaphone,
  salon: CalendarDays,
};

const PIN_ANCHORS: Record<ZoneId, [number, number, number]> = {
  porteria: [14.7, 14.7, 3.6],
  administracion: [13.8, 3, 3.8],
  tanques: [2.8, 2.8, 16],
  cartelera: [7.3, 6.85, 3.3],
  salon: [10.9, 8.8, 4],
};

const GLOW_AT: Record<ZoneId, { at: [number, number]; rx: number; ry: number }> = {
  porteria: { at: [14.7, 14.7], rx: 62, ry: 31 },
  administracion: { at: [13.8, 3], rx: 70, ry: 35 },
  tanques: { at: [6.1, 10], rx: 46, ry: 23 },
  cartelera: { at: [7.3, 6.85], rx: 50, ry: 25 },
  salon: { at: [11.4, 10.8], rx: 130, ry: 62 },
};

function toPercent([sx, sy]: [number, number]) {
  return { left: `${((sx - VB.x) / VB.w) * 100}%`, top: `${((sy - VB.y) / VB.h) * 100}%` };
}

interface SceneProps {
  mode: WindowMode;
  /** Zone lit by the current step, or by a hovered pin. */
  highlight: ZoneId | null;
  activeZone: ZoneId | null;
  clock: ReactNode;
  onPin: (zone: ZoneId) => void;
  onPinHover: (zone: ZoneId | null) => void;
}

export const ConjuntoScene = forwardRef<HTMLDivElement, SceneProps>(function ConjuntoScene(
  { mode, highlight, activeZone, clock, onPin, onPinHover },
  ref,
) {
  const dim = (owner: Owner) => {
    if (!highlight) return 1;
    if (owner === highlight) return 1;
    if (owner === "torres" && mode === "paid") return 1;
    return 0.62;
  };

  // Elements with their own fixed colours dim with the evening light.
  const shade = { filter: "brightness(var(--shade))" };

  const zoneStyle = (owner: Owner) => ({
    opacity: dim(owner),
    transition: "opacity 450ms ease",
  });

  const outline = (owner: Owner) =>
    owner !== null && owner === highlight ? { stroke: EMERALD, strokeWidth: 1.6, strokeLinejoin: "round" as const } : {};

  const lotBase = boxFaces({ x0: 0, x1: 16, y0: 0, y1: 16, z0: -0.9, z1: 0 });
  const glow = highlight ? GLOW_AT[highlight] : null;

  const elements: Array<{ depth: number; owner: Owner; node: ReactNode; key: string }> = [];

  // Towers with their windows; the roof tank belongs to maintenance.
  for (const tower of TOWERS) {
    const { box } = tower;
    const faces = boxFaces(box);
    elements.push({
      key: tower.id,
      owner: "torres",
      depth: (box.x0 + box.x1) / 2 + (box.y0 + box.y1) / 2,
      node: (
        <>
          <polygon points={faces.left} fill="var(--face-left)" />
          <polygon points={faces.right} fill="var(--face-right)" />
          <polygon points={faces.top} fill="var(--face-top)" />
          {WINDOWS[tower.id].map((w) => (
            <polygon
              key={w.key}
              points={w.points}
              style={{
                fill: windowFill(mode, w.rank),
                transition: "fill 500ms ease",
                transitionDelay: `${Math.round(w.rank * (mode === "paid" ? 900 : 400))}ms`,
              }}
            />
          ))}
          {/* Lobby door */}
          <polygon points={quadY(box.y1, box.x0 + 1.6, box.x0 + 2.4, 0, 0.95)} fill="var(--door)" />
          <text
            x={P(box.x0 + 0.3, box.y1, box.z1 - 0.2)[0]}
            y={P(box.x0 + 0.3, box.y1, box.z1 - 0.2)[1] + 14}
            className="fill-[var(--label)] text-[11px] font-bold"
          >
            {tower.id.replace("T", "Torre ")}
          </text>
        </>
      ),
    });
  }

  elements.push({
    key: "tanque",
    owner: "tanques",
    depth: 6.1,
    node: (
      <g {...outline("tanques")} style={shade}>
        <Solid box={{ x0: 2, x1: 3.6, y0: 2, y1: 3.6, z0: 13, z1: 14.6 }} top="#DCE8F7" left="#9EB7D6" right="#7F9BC2" />
      </g>
    ),
  });

  elements.push({
    key: "planta",
    owner: "tanques",
    depth: 16.2,
    node: (
      <g {...outline("tanques")} style={shade}>
        <Solid box={{ x0: 5.5, x1: 6.7, y0: 9.4, y1: 10.6, z1: 1.2 }} top="#8FA0B8" left="#6B7E99" right="#566A86" />
        <polyline points={pts([P(6.7, 9.7, 0.4), P(6.7, 10.3, 0.4)])} stroke="rgb(255 255 255 / 0.4)" strokeWidth={1.2} />
        <polyline points={pts([P(6.7, 9.7, 0.7), P(6.7, 10.3, 0.7)])} stroke="rgb(255 255 255 / 0.4)" strokeWidth={1.2} />
      </g>
    ),
  });

  elements.push({
    key: "admin",
    owner: "administracion",
    depth: 16.8,
    node: (
      <g {...outline("administracion")}>
        <Solid box={{ x0: 12.4, x1: 15.2, y0: 1.4, y1: 4.6, z1: 2.4 }} />
        <polygon points={quadY(4.6, 12.8, 14.8, 0.9, 1.9)} fill="var(--glass)" />
        <polygon points={quadX(15.2, 1.8, 4.2, 0.9, 1.9)} fill="var(--glass)" />
        <polygon points={quadY(4.6, 13.4, 14.2, 0, 0.8)} fill="var(--door)" />
      </g>
    ),
  });

  elements.push({
    key: "cartelera",
    owner: "cartelera",
    depth: 14.1,
    node: (
      <g {...outline("cartelera")} style={shade}>
        <Solid box={{ x0: 6.5, x1: 6.65, y0: 6.85, y1: 7.0, z1: 1.9 }} />
        <Solid box={{ x0: 7.95, x1: 8.1, y0: 6.85, y1: 7.0, z1: 1.9 }} />
        <Solid box={{ x0: 6.4, x1: 8.2, y0: 6.8, y1: 7.0, z0: 0.9, z1: 2.1 }} left="#F8FAFC" right="#CBD5E1" top="#E2E8F0" />
        <polygon points={quadY(7.0, 6.6, 7.2, 1.3, 1.9)} fill="#2458E6" opacity={0.7} />
        <polygon points={quadY(7.0, 7.35, 8.0, 1.5, 1.95)} fill="#10B981" opacity={0.8} />
        <polygon points={quadY(7.0, 7.35, 8.0, 1.05, 1.4)} fill="#D99A2B" opacity={0.75} />
      </g>
    ),
  });

  elements.push({
    key: "salon",
    owner: "salon",
    depth: 19.7,
    node: (
      <g {...outline("salon")}>
        <Solid box={{ x0: 9.2, x1: 12.6, y0: 7.2, y1: 10.4, z1: 2.6 }} />
        <polygon
          points={quadY(10.4, 9.6, 12.2, 0.6, 2.0)}
          style={{ fill: mode === "dusk" || mode === "night" ? WARM : "var(--glass)", transition: "fill 500ms ease" }}
        />
        <polygon
          points={quadX(12.6, 7.6, 10.0, 0.6, 2.0)}
          style={{ fill: mode === "dusk" || mode === "night" ? WARM : "var(--glass)", transition: "fill 500ms ease" }}
        />
        {/* Roof garden */}
        <polygon points={flat(9.6, 12.2, 7.6, 10.0, 2.61)} fill="var(--ground)" opacity={0.7} />
      </g>
    ),
  });

  elements.push({
    key: "bbq",
    owner: "salon",
    depth: 21.8,
    node: (
      <g {...outline("salon")}>
        <g style={shade}>
          <Solid box={{ x0: 13.2, x1: 14.2, y0: 7.6, y1: 8.6, z1: 0.9 }} top="#6B7E99" left="#8FA0B8" right="#566A86" />
        </g>
        {(mode === "dusk" || mode === "night") && (
          <circle cx={P(13.7, 8.1, 1.3)[0]} cy={P(13.7, 8.1, 1.3)[1]} r={4} fill="#FFB35C" opacity={0.9} />
        )}
      </g>
    ),
  });

  elements.push({
    key: "car1",
    owner: null,
    depth: 15.1,
    node: (
      <g style={shade}>
        <Solid box={{ x0: 1.7, x1: 2.5, y0: 12.3, y1: 13.6, z1: 0.7 }} top="#5B7FDB" left="#3D63C9" right="#2E4EA3" />
      </g>
    ),
  });
  elements.push({
    key: "car2",
    owner: null,
    depth: 17.1,
    node: <Solid box={{ x0: 3.7, x1: 4.5, y0: 12.3, y1: 13.6, z1: 0.7 }} />,
  });

  elements.push({
    key: "porteria",
    owner: "porteria",
    depth: 29.4,
    node: (
      <g {...outline("porteria")}>
        <Solid box={{ x0: 13.8, x1: 15.6, y0: 13.8, y1: 15.6, z1: 2.2 }} />
        <polygon
          points={quadY(15.6, 14.1, 15.3, 0.8, 1.8)}
          style={{ fill: mode === "dawn" || mode === "dusk" || mode === "night" ? WARM : "var(--glass)", transition: "fill 500ms ease" }}
        />
        <polygon points={quadX(15.6, 14.1, 15.3, 0.8, 1.8)} fill="var(--glass)" />
        {/* Roof overhang */}
        <Solid box={{ x0: 13.6, x1: 15.8, y0: 13.6, y1: 15.8, z0: 2.2, z1: 2.45 }} />
        {/* Boom gate across the driveway */}
        <line
          x1={P(13.75, 15.6, 1)[0]}
          y1={P(13.75, 15.6, 1)[1]}
          x2={P(10.6, 15.6, 1)[0]}
          y2={P(10.6, 15.6, 1)[1]}
          stroke="#F8FAFC"
          strokeWidth={2.4}
          strokeDasharray="7 5"
        />
        <line
          x1={P(13.75, 15.6, 1)[0]}
          y1={P(13.75, 15.6, 1)[1]}
          x2={P(10.6, 15.6, 1)[0]}
          y2={P(10.6, 15.6, 1)[1]}
          stroke="#D99A2B"
          strokeWidth={2.4}
          strokeDasharray="5 7"
          strokeDashoffset={-7}
        />
      </g>
    ),
  });

  const trees: Array<[number, number, number]> = [
    [6, 3, 1],
    [3, 6, 0.9],
    [14.8, 6.2, 1],
    [6.4, 12.9, 1.1],
    [7.7, 14.4, 0.9],
    [14.3, 11.6, 1],
    [15.2, 9.6, 0.8],
    [0.6, 6, 0.8],
  ];
  trees.forEach(([x, y, s], i) =>
    elements.push({ key: `tree-${i}`, owner: null, depth: x + y, node: <Tree x={x} y={y} s={s} /> }),
  );

  elements.sort((a, b) => a.depth - b.depth);

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-[28px] border border-white/60 bg-[linear-gradient(180deg,var(--sky-top),var(--sky-bottom))] shadow-[inset_0_1px_0_rgb(255_255_255/0.6),0_30px_60px_-30px_rgb(13_34_63/0.4)] dark:border-white/10"
    >
      {/* Sun and moon ride on CSS variables set by the scroll handler */}
      <div
        aria-hidden
        className="pointer-events-none absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFE3A3] shadow-[0_0_40px_12px_rgb(255_214_140/0.55)]"
        style={{ left: "var(--sun-x)", top: "var(--sun-y)", opacity: "var(--sun-o)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[14%] top-[12%] h-8 w-8 rounded-full bg-[#E8EEF7] shadow-[inset_-7px_-3px_0_0_rgb(160_180_210),0_0_30px_6px_rgb(200_215_240/0.25)]"
        style={{ opacity: "var(--moon-o)" }}
      />

      <svg viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`} role="img" aria-label="Ilustración del Conjunto Altos del Bosque" className="relative block w-full">
        {/* Lot as a diorama slab */}
        <polygon points={lotBase.left} fill="var(--face-left)" />
        <polygon points={lotBase.right} fill="var(--face-right)" />
        <polygon points={lotBase.top} fill="var(--ground)" />

        {/* Paving: plaza, driveway, parking, pool deck */}
        <polygon points={flat(5.6, 12.8, 5.6, 11.6, 0.01)} fill="var(--paving)" />
        <polygon points={flat(5.2, 13.8, 15.2, 16, 0.01)} fill="var(--paving)" />
        <g style={zoneStyle(null)}>
          <polygon points={flat(0.8, 5.2, 12, 15.4, 0.01)} fill="var(--paving)" />
          {[1.5, 3.0, 4.5].map((x) => (
            <polyline key={x} points={pts([P(x, 12.1, 0.02), P(x, 13.8, 0.02)])} stroke="rgb(255 255 255 / 0.7)" strokeWidth={1.2} />
          ))}
        </g>
        <g style={zoneStyle("salon")}>
          <polygon points={flat(9, 13, 12.2, 15, 0.01)} fill="var(--paving)" {...outline("salon")} />
          <polygon points={flat(9.4, 12.6, 12.6, 14.6, 0.02)} fill="var(--water)" />
          <polyline points={pts([P(9.8, 13.2, 0.03), P(12.2, 13.2, 0.03)])} stroke="rgb(255 255 255 / 0.45)" strokeWidth={1.2} />
          <polyline points={pts([P(9.8, 14.0, 0.03), P(12.2, 14.0, 0.03)])} stroke="rgb(255 255 255 / 0.3)" strokeWidth={1.2} />
        </g>

        {/* Zone glow on the ground */}
        {glow && (
          <ellipse
            cx={P(glow.at[0], glow.at[1])[0]}
            cy={P(glow.at[0], glow.at[1])[1]}
            rx={glow.rx}
            ry={glow.ry}
            fill="url(#zone-glow)"
          />
        )}
        <defs>
          <radialGradient id="zone-glow">
            <stop offset="0%" stopColor={EMERALD} stopOpacity={0.55} />
            <stop offset="100%" stopColor={EMERALD} stopOpacity={0} />
          </radialGradient>
        </defs>

        {elements.map((el) => (
          <g key={el.key} style={zoneStyle(el.owner)}>
            {el.node}
          </g>
        ))}
      </svg>

      {/* Zone pins: real buttons over the illustration */}
      {ZONES.map((zone) => {
        const Icon = PIN_ICONS[zone.id];
        const [x, y, z] = PIN_ANCHORS[zone.id];
        const active = activeZone === zone.id;
        const lit = highlight === zone.id;
        return (
          <button
            key={zone.id}
            type="button"
            onClick={() => onPin(zone.id)}
            onMouseEnter={() => onPinHover(zone.id)}
            onMouseLeave={() => onPinHover(null)}
            onFocus={() => onPinHover(zone.id)}
            onBlur={() => onPinHover(null)}
            aria-label={`${zone.label}: ${zone.module}`}
            aria-current={active ? "step" : undefined}
            style={toPercent(P(x, y, z))}
            className="group absolute z-10 -translate-x-1/2 -translate-y-full focus-visible:outline-none"
          >
            <span
              className={cn(
                "flex items-center gap-1.5 rounded-full border py-1 pl-1 pr-1 shadow-[0_6px_16px_-6px_rgb(13_34_63/0.5)] transition-[background-color,border-color,padding] duration-300 sm:pr-1",
                lit ? "border-emerald bg-emerald text-navy-deep" : "border-white/70 bg-white text-navy",
                "group-hover:pr-3 group-focus-visible:pr-3 group-focus-visible:ring-2 group-focus-visible:ring-cobalt",
                active && "pr-3",
              )}
            >
              <span className="grid h-6 w-6 place-items-center rounded-full">
                <Icon aria-hidden className="h-3.5 w-3.5" />
              </span>
              <span
                className={cn(
                  "max-w-0 overflow-hidden whitespace-nowrap text-[11px] font-semibold transition-[max-width] duration-300",
                  "group-hover:max-w-[12rem] group-focus-visible:max-w-[12rem]",
                  active && "max-w-[12rem]",
                )}
              >
                {zone.label}
              </span>
            </span>
            <span aria-hidden className={cn("mx-auto block h-2 w-px", lit ? "bg-emerald" : "bg-white")} />
          </button>
        );
      })}

      <div className="pointer-events-none absolute left-4 top-4 sm:left-5 sm:top-5">{clock}</div>
    </div>
  );
});
