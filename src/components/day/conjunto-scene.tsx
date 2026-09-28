"use client";

import { Fragment, forwardRef, memo, type CSSProperties, type ReactNode } from "react";
import { CalendarDays, Landmark, Megaphone, ShieldCheck, Wrench, type LucideIcon } from "lucide-react";
import { CALLOUTS, ZONES, type CalloutState, type WindowMode, type ZoneId } from "@/lib/data/day";
import { boxFaces, flat, ISO, P, pts, quadX, quadY, type Box, type Pt } from "@/lib/iso";
import { cn, mulberry32 } from "@/lib/utils";

// Isometric model of Conjunto Altos del Bosque: three brick towers with
// balconies, the administration office, the clubhouse with pool and BBQ,
// parking and the gatehouse. Every colour is a CSS variable that the
// parent section interpolates with the hour, so moving through the day
// never re-renders React. All geometry is computed once, at module load.

const VB = { x: -420, y: -270, w: 840, h: 750 };
const LOT = 18;
const FLOOR = 1.45;
const PLINTH = 2;
const WARM = "#FFD08C";
const EMERALD = "#10B981";
const FILL_T = "fill 500ms ease";
// Things with their own fixed colours (cars, tank, panels) dim at dusk.
const SHADE: CSSProperties = { filter: "brightness(var(--shade))" };

// ---------------------------------------------------------------- helpers

interface Poly {
  points: string;
  fill: string;
  opacity?: number;
}

function Polys({ list }: { list: Poly[] }) {
  return (
    <>
      {list.map((p, i) => (
        <polygon key={i} points={p.points} fill={p.fill} opacity={p.opacity} />
      ))}
    </>
  );
}

function Solid({
  box,
  top = "var(--face-top)",
  left = "var(--face-left)",
  right = "var(--face-right)",
}: {
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

/** Outline of a box as seen from the camera (a hexagon). */
function silhouette({ x0, x1, y0, y1, z0 = 0, z1 }: Box) {
  return pts([P(x0, y0, z1), P(x1, y0, z1), P(x1, y0, z0), P(x1, y1, z0), P(x0, y1, z0), P(x0, y1, z1)]);
}

/** Radii of a world-space circle once projected. */
const isoR = (r: number) => ({ rx: r * Math.SQRT2 * ISO.hx, ry: r * Math.SQRT2 * ISO.hy });

function Cylinder({ x, y, r, z0, z1, side, top }: { x: number; y: number; r: number; z0: number; z1: number; side: string; top: string }) {
  const [cx, yb] = P(x, y, z0);
  const yt = yb - (z1 - z0) * ISO.hz;
  const { rx, ry } = isoR(r);
  const n = (v: number) => v.toFixed(1);
  return (
    <>
      <path d={`M${n(cx - rx)} ${n(yt)}V${n(yb)}A${n(rx)} ${n(ry)} 0 0 0 ${n(cx + rx)} ${n(yb)}V${n(yt)}Z`} fill={side} />
      <ellipse cx={cx} cy={yt} rx={rx} ry={ry} fill={top} />
    </>
  );
}

/** Convex hull (monotone chain), used for cast shadows. */
function hull(points: Pt[]): Pt[] {
  const p = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const build = (list: Pt[]) => {
    const out: Pt[] = [];
    for (const q of list) {
      while (out.length >= 2 && cross(out[out.length - 2], out[out.length - 1], q) <= 0) out.pop();
      out.push(q);
    }
    out.pop();
    return out;
  };
  return [...build(p), ...build([...p].reverse())];
}

/** Ground shadow of a box lit from the left (shadows fall to the right). */
function castShadow(x0: number, x1: number, y0: number, y1: number, h: number) {
  const dx = h * 0.26;
  const dy = -h * 0.1;
  const base: Pt[] = [
    [x0, y0],
    [x1, y0],
    [x1, y1],
    [x0, y1],
  ];
  const all = [...base, ...base.map(([x, y]) => [x + dx, y + dy] as Pt)];
  return pts(hull(all).map(([x, y]) => P(x, y, 0.02)));
}

/** A thin horizontal slab sticking out of a +y face (canopy, balcony floor). */
function ledgeY(y: number, xa: number, xb: number, z: number, d: number): Poly[] {
  return [
    { points: flat(xa, xb, y, y + d, z + 0.16), fill: "var(--face-top)" },
    { points: quadY(y + d, xa, xb, z, z + 0.16), fill: "var(--slab)" },
    { points: quadX(xb, y, y + d, z, z + 0.16), fill: "var(--face-right)" },
  ];
}

/** The same, sticking out of a +x face. */
function ledgeX(x: number, ya: number, yb: number, z: number, d: number): Poly[] {
  return [
    { points: flat(x, x + d, ya, yb, z + 0.16), fill: "var(--face-top)" },
    { points: quadX(x + d, ya, yb, z, z + 0.16), fill: "var(--face-right)" },
    { points: quadY(yb, x, x + d, z, z + 0.16), fill: "var(--slab)" },
  ];
}

function balconyY(y: number, xa: number, xb: number, z: number): Poly[] {
  const d = 0.5;
  return [
    ...ledgeY(y, xa, xb, z - 0.02, d),
    { points: quadY(y + d, xa, xb, z + 0.14, z + 0.8), fill: "var(--glass)", opacity: 0.55 },
    { points: quadY(y + d, xa, xb, z + 0.76, z + 0.84), fill: "var(--slab)" },
  ];
}

function balconyX(x: number, ya: number, yb: number, z: number): Poly[] {
  const d = 0.5;
  return [
    ...ledgeX(x, ya, yb, z - 0.02, d),
    { points: quadX(x + d, ya, yb, z + 0.14, z + 0.8), fill: "var(--glass)", opacity: 0.45 },
    { points: quadX(x + d, ya, yb, z + 0.76, z + 0.84), fill: "var(--slab)" },
  ];
}

/** Flat roof with a parapet: rim, sunken deck, the two inner walls we can see, front rim. */
function roofPolys(x0: number, x1: number, y0: number, y1: number, top: number, floor = "var(--roof)"): Poly[] {
  const i = 0.2;
  const d = 0.3;
  return [
    { points: flat(x0, x1, y0, y1, top), fill: "var(--slab)" },
    { points: flat(x0 + i, x1 - i, y0 + i, y1 - i, top - d), fill: floor },
    { points: quadY(y0 + i, x0 + i, x1 - i, top - d, top), fill: "var(--face-left)" },
    { points: quadX(x0 + i, y0 + i, y1 - i, top - d, top), fill: "var(--face-right)" },
    { points: flat(x1 - i, x1, y0, y1, top), fill: "var(--slab)" },
    { points: flat(x0, x1, y1 - i, y1, top), fill: "var(--slab)" },
  ];
}

// ---------------------------------------------------------------- towers

interface TowerDef {
  id: string;
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  floors: number;
  roof: "tank" | "garden" | "solar";
  door: "x" | "y";
}

const TOWER_DEFS: TowerDef[] = [
  { id: "T1", x0: 1, x1: 4.8, y0: 1, y1: 4.8, floors: 8, roof: "tank", door: "y" },
  { id: "T2", x0: 8.4, x1: 12, y0: 1, y1: 4.6, floors: 7, roof: "garden", door: "y" },
  { id: "T3", x0: 1, x1: 4.6, y0: 8.4, y1: 12, floors: 6, roof: "solar", door: "x" },
];

const towerTop = (t: TowerDef) => PLINTH + t.floors * FLOOR + 0.4;
const T1_TOP = towerTop(TOWER_DEFS[0]);

interface Win {
  key: string;
  points: string;
  rank: number;
}

interface TowerGeo {
  def: TowerDef;
  top: number;
  body: Poly[];
  windows: Win[];
  ao: string[];
  front: Poly[];
  edge: string;
  roof: Poly[];
}

function buildTower(def: TowerDef, rand: () => number): TowerGeo {
  const { x0, x1, y0, y1, floors } = def;
  const top = towerTop(def);
  const pz = PLINTH + floors * FLOOR;
  const body: Poly[] = [
    { points: quadY(y1, x0, x1, PLINTH, top), fill: "var(--brick-left)" },
    { points: quadX(x1, y0, y1, PLINTH, top), fill: "var(--brick-right)" },
    // Concrete ground floor with a glazed lobby
    { points: quadY(y1, x0, x1, 0, PLINTH), fill: "var(--face-left)" },
    { points: quadX(x1, y0, y1, 0, PLINTH), fill: "var(--face-right)" },
    { points: quadY(y1, x0 + 0.3, x1 - 0.3, 0.12, PLINTH - 0.4), fill: "var(--lobby)" },
    { points: quadX(x1, y0 + 0.3, y1 - 0.3, 0.12, PLINTH - 0.4), fill: "var(--lobby)" },
  ];
  for (let a = x0 + 1.05; a < x1 - 0.5; a += 0.95) {
    body.push({ points: quadY(y1, a, a + 0.07, 0.12, PLINTH - 0.4), fill: "var(--face-left)" });
  }
  for (let a = y0 + 1.05; a < y1 - 0.5; a += 0.95) {
    body.push({ points: quadX(x1, a, a + 0.07, 0.12, PLINTH - 0.4), fill: "var(--face-right)" });
  }
  if (def.door === "y") {
    const m = (x0 + x1) / 2;
    body.push({ points: quadY(y1, m - 0.45, m + 0.45, 0, 1.25), fill: "var(--door)" });
    body.push(...ledgeY(y1, m - 0.85, m + 0.85, 1.4, 0.75));
  } else {
    const m = (y0 + y1) / 2;
    body.push({ points: quadX(x1, m - 0.45, m + 0.45, 0, 1.25), fill: "var(--door)" });
    body.push(...ledgeX(x1, m - 0.85, m + 0.85, 1.4, 0.75));
  }

  const windows: Win[] = [];
  const front: Poly[] = [];
  const bayY = (x1 - x0) / 3;
  const bayX = (y1 - y0) / 3;
  for (let f = 0; f < floors; f++) {
    const z = PLINTH + f * FLOOR;
    // White slab edge on every floor
    body.push({ points: quadY(y1, x0, x1, z - 0.1, z + 0.14), fill: "var(--slab)" });
    body.push({ points: quadX(x1, y0, y1, z - 0.1, z + 0.14), fill: "var(--face-right)" });
    for (let b = 0; b < 3; b++) {
      const ax = x0 + b * bayY;
      const ay = y0 + b * bayX;
      windows.push({ key: `${def.id}y${f}${b}`, points: quadY(y1, ax + 0.26, ax + bayY - 0.26, z + 0.38, z + 1.2), rank: rand() });
      windows.push({ key: `${def.id}x${f}${b}`, points: quadX(x1, ay + 0.26, ay + bayX - 0.26, z + 0.38, z + 1.2), rank: rand() });
      // Balconies on the outer bays of the +y face and the middle bay of the +x face
      if (b === 1) front.push(...balconyX(x1, ay + 0.12, ay + bayX - 0.12, z));
      else front.push(...balconyY(y1, ax + 0.12, ax + bayY - 0.12, z));
    }
  }
  body.push({ points: quadY(y1, x0, x1, pz - 0.1, top), fill: "var(--slab)" });
  body.push({ points: quadX(x1, y0, y1, pz - 0.1, top), fill: "var(--face-right)" });

  return {
    def,
    top,
    body,
    windows,
    ao: [quadY(y1, x0, x1, 0, top), quadX(x1, y0, y1, 0, top)],
    front,
    edge: pts([P(x1, y1, 0), P(x1, y1, top)]),
    roof: roofPolys(x0, x1, y0, y1, top, def.roof === "garden" ? "var(--ground)" : "var(--roof)"),
  };
}

const TOWERS: TowerGeo[] = (() => {
  const rand = mulberry32(2026);
  return TOWER_DEFS.map((d) => buildTower(d, rand));
})();

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

function Shrub({ x, y, z, s = 1 }: { x: number; y: number; z: number; s?: number }) {
  const [cx, cy] = P(x, y, z);
  return (
    <>
      <circle cx={cx} cy={cy - 4 * s} r={7 * s} fill="var(--tree-lo)" />
      <circle cx={cx - 2 * s} cy={cy - 6 * s} r={4.5 * s} fill="var(--tree-hi)" />
    </>
  );
}

function RoofFeatures({ geo }: { geo: TowerGeo }) {
  const { def, top } = geo;
  const { x0, x1, y0, y1 } = def;
  const deck = top - 0.3;
  if (def.roof === "tank") {
    return (
      <>
        <g style={SHADE}>
          <Cylinder x={x0 + 1.3} y={y0 + 1.3} r={0.72} z0={deck} z1={top + 1.5} side="url(#cs-tank)" top="#EEF3F9" />
        </g>
        <Solid box={{ x0: x1 - 1.5, x1: x1 - 0.5, y0: y0 + 0.5, y1: y0 + 1.6, z0: deck, z1: top + 0.9 }} />
        <polygon points={quadY(y0 + 1.6, x1 - 1.2, x1 - 0.8, deck, top + 0.5)} fill="var(--door)" />
      </>
    );
  }
  if (def.roof === "garden") {
    return (
      <>
        <polygon points={flat(x0 + 0.6, x1 - 0.6, y1 - 1.3, y1 - 0.5, deck + 0.02)} fill="var(--deck)" />
        <Shrub x={x0 + 0.8} y={y0 + 0.9} z={deck} />
        <Shrub x={x1 - 0.9} y={y0 + 0.8} z={deck} s={0.9} />
        <Shrub x={x0 + 0.8} y={y1 - 1.6} z={deck} s={0.8} />
        <Shrub x={(x0 + x1) / 2} y={(y0 + y1) / 2 - 0.3} z={deck} s={1.1} />
      </>
    );
  }
  const panels: string[] = [];
  for (const a of [x0 + 0.55, x0 + 1.9]) {
    for (const b of [y0 + 0.55, y0 + 1.9]) {
      panels.push(pts([P(a, b, deck + 0.7), P(a + 1.15, b, deck + 0.7), P(a + 1.15, b + 1.1, deck + 0.2), P(a, b + 1.1, deck + 0.2)]));
    }
  }
  return (
    <g style={SHADE}>
      {panels.map((p) => (
        <polygon key={p} points={p} fill="#2A4A7F" stroke="#A9C0E0" strokeWidth={0.6} strokeOpacity={0.55} />
      ))}
    </g>
  );
}

function TowerNode({ geo, mode }: { geo: TowerGeo; mode: WindowMode }) {
  const delay = mode === "paid" ? 900 : 400;
  return (
    <>
      <Polys list={geo.body} />
      {/* Windows switch one by one after a staggered delay, like lights
          coming on; the short fade keeps repaints brief. */}
      {geo.windows.map((w) => (
        <polygon
          key={w.key}
          points={w.points}
          style={{ fill: windowFill(mode, w.rank), transition: "fill 120ms ease", transitionDelay: `${Math.round(w.rank * delay)}ms` }}
        />
      ))}
      {geo.ao.map((p) => (
        <polygon key={p} points={p} fill="url(#cs-ao)" />
      ))}
      <Polys list={geo.front} />
      <polyline points={geo.edge} fill="none" stroke="var(--slab)" strokeWidth={0.8} opacity={0.5} />
      <Polys list={geo.roof} />
      <RoofFeatures geo={geo} />
    </>
  );
}

// ---------------------------------------------------------------- low buildings

function AdminOffice() {
  const x0 = 13.6;
  const x1 = 17.2;
  const y0 = 1.2;
  const y1 = 4.8;
  const z1 = 3.3;
  const mullions: string[] = [];
  for (let a = x0 + 1; a < x1 - 0.4; a += 0.8) mullions.push(quadY(y1, a, a + 0.06, 0.3, 2.9));
  const mullionsX: string[] = [];
  for (let a = y0 + 1; a < y1 - 0.4; a += 0.8) mullionsX.push(quadX(x1, a, a + 0.06, 0.3, 2.9));
  return (
    <>
      <Solid box={{ x0, x1, y0, y1, z1 }} />
      {[0.3, 1.9].map((z) => (
        <Fragment key={z}>
          <polygon points={quadY(y1, x0 + 0.3, x1 - 0.3, z, z + 1)} fill="var(--glass)" />
          <polygon points={quadX(x1, y0 + 0.3, y1 - 0.3, z, z + 1)} fill="var(--glass)" />
        </Fragment>
      ))}
      {mullions.map((p) => (
        <polygon key={p} points={p} fill="var(--face-left)" />
      ))}
      {mullionsX.map((p) => (
        <polygon key={p} points={p} fill="var(--face-right)" />
      ))}
      <polygon points={quadY(y1, x0, x1, 1.5, 1.7)} fill="var(--slab)" />
      <polygon points={quadX(x1, y0, y1, 1.5, 1.7)} fill="var(--face-right)" />
      <polygon points={quadY(y1, 15, 15.8, 0, 1.3)} fill="var(--door)" />
      <Polys list={ledgeY(y1, 14.5, 16.3, 1.35, 0.8)} />
      <Polys list={roofPolys(x0, x1, y0, y1, z1)} />
      <Solid box={{ x0: x0 + 0.6, x1: x0 + 1.4, y0: y0 + 0.6, y1: y0 + 1.3, z0: z1 - 0.3, z1: z1 + 0.35 }} />
      <Solid box={{ x0: x0 + 1.8, x1: x0 + 2.6, y0: y0 + 0.6, y1: y0 + 1.3, z0: z1 - 0.3, z1: z1 + 0.35 }} />
    </>
  );
}

function Clubhouse({ mode }: { mode: WindowMode }) {
  const x0 = 10;
  const x1 = 13.8;
  const y0 = 7.4;
  const y1 = 10.4;
  const glass = { fill: mode === "dusk" || mode === "night" ? WARM : "var(--glass)", transition: FILL_T };
  const mullions: string[] = [];
  for (let a = x0 + 0.95; a < x1 - 0.3; a += 0.75) mullions.push(quadY(y1, a, a + 0.06, 0.1, 2.45));
  const mullionsX: string[] = [];
  for (let a = y0 + 0.95; a < y1 - 0.3; a += 0.75) mullionsX.push(quadX(x1, a, a + 0.06, 0.1, 2.45));
  return (
    <>
      <Solid box={{ x0, x1, y0, y1, z1: 2.8 }} />
      <polygon points={quadY(y1, x0 + 0.25, x1 - 0.25, 0.1, 2.45)} style={glass} />
      <polygon points={quadX(x1, y0 + 0.25, y1 - 0.25, 0.1, 2.45)} style={glass} />
      {mullions.map((p) => (
        <polygon key={p} points={p} fill="var(--face-left)" />
      ))}
      {mullionsX.map((p) => (
        <polygon key={p} points={p} fill="var(--face-right)" />
      ))}
      {/* Flat roof slab with a planted top */}
      <Solid box={{ x0: 9.8, x1: 14.1, y0: 7.2, y1: 10.9, z0: 2.8, z1: 3.1 }} top="var(--slab)" left="var(--slab)" right="var(--face-right)" />
      <polygon points={flat(10.15, 13.75, 7.55, 10.55, 3.11)} fill="var(--ground)" />
      <Shrub x={10.8} y={8.2} z={3.1} s={0.9} />
      <Shrub x={12.9} y={8.1} z={3.1} s={0.8} />
      <Shrub x={11.2} y={9.9} z={3.1} s={0.7} />
    </>
  );
}

function Pergola({ mode }: { mode: WindowMode }) {
  const fire = mode === "dusk" || mode === "night";
  const post = (x: number, y: number) => (
    <Solid box={{ x0: x - 0.08, x1: x + 0.08, y0: y - 0.08, y1: y + 0.08, z1: 2.3 }} top="var(--deck)" left="var(--deck)" right="var(--trunk)" />
  );
  const slats: number[] = [];
  for (let a = 14.85; a < 17.4; a += 0.32) slats.push(a);
  const [gx, gy] = P(16.75, 7.75, 1.05);
  return (
    <>
      {post(14.9, 7.3)}
      <g style={SHADE}>
        <Solid box={{ x0: 16.4, x1: 17.1, y0: 7.45, y1: 8.05, z1: 0.95 }} top="#5B677A" left="#76839A" right="#4A5568" />
      </g>
      {fire && <circle cx={gx} cy={gy} r={9} fill="url(#cs-lamp)" />}
      {fire && <circle cx={gx} cy={gy + 2} r={2.6} fill="#FFB35C" />}
      <Solid box={{ x0: 15.2, x1: 16.2, y0: 7.65, y1: 7.85, z0: 0.36, z1: 0.46 }} top="var(--deck)" left="var(--deck)" right="var(--trunk)" />
      <Solid box={{ x0: 15.2, x1: 16.2, y0: 8.05, y1: 9.15, z0: 0.62, z1: 0.74 }} top="var(--deck)" left="var(--deck)" right="var(--trunk)" />
      <Solid box={{ x0: 15.2, x1: 16.2, y0: 9.35, y1: 9.55, z0: 0.36, z1: 0.46 }} top="var(--deck)" left="var(--deck)" right="var(--trunk)" />
      {post(17.3, 7.3)}
      {post(14.9, 9.7)}
      {post(17.3, 9.7)}
      <Solid box={{ x0: 14.75, x1: 17.45, y0: 7.22, y1: 7.38, z0: 2.1, z1: 2.3 }} top="var(--deck)" left="var(--deck)" right="var(--trunk)" />
      <Solid box={{ x0: 14.75, x1: 17.45, y0: 9.62, y1: 9.78, z0: 2.1, z1: 2.3 }} top="var(--deck)" left="var(--deck)" right="var(--trunk)" />
      {slats.map((a) => (
        <Solid key={a} box={{ x0: a, x1: a + 0.1, y0: 7.05, y1: 9.95, z0: 2.3, z1: 2.42 }} top="var(--deck)" left="var(--deck)" right="var(--trunk)" />
      ))}
    </>
  );
}

function Porteria({ mode }: { mode: WindowMode }) {
  const x0 = 15.8;
  const x1 = 17.6;
  const y0 = 12.8;
  const y1 = 15.2;
  const lit = mode === "dawn" || mode === "dusk" || mode === "night";
  const [ax, ay] = P(16.2, 15.6, 0.95);
  const [bx, by] = P(16.2, 17.75, 0.95);
  return (
    <>
      <Solid box={{ x0, x1, y0, y1, z1: 2.4 }} />
      <polygon points={quadY(y1, x0 + 0.25, x1 - 0.25, 0.9, 2)} style={{ fill: lit ? WARM : "var(--glass)", transition: FILL_T }} />
      <polygon points={quadX(x1, y0 + 0.3, y1 - 0.3, 0.9, 2)} fill="var(--glass)" />
      <Solid
        box={{ x0: x0 - 0.2, x1: x1 + 0.2, y0: y0 - 0.2, y1: y1 + 0.2, z0: 2.4, z1: 2.7 }}
        top="var(--slab)"
        left="var(--slab)"
        right="var(--face-right)"
      />
      {/* Boom barrier across the driveway */}
      <g style={SHADE}>
        <Solid box={{ x0: 16.05, x1: 16.35, y0: 15.35, y1: 15.65, z1: 1.1 }} top="#F2C14E" left="#E0A92E" right="#B8861F" />
        <line x1={ax} y1={ay} x2={bx} y2={by} stroke="#F8FAFC" strokeWidth={2.6} strokeLinecap="round" />
        <line x1={ax} y1={ay} x2={bx} y2={by} stroke="#D6453D" strokeWidth={2.6} strokeDasharray="6 6" />
      </g>
    </>
  );
}

function Cartelera() {
  const post = { top: "var(--face-top)", left: "var(--face-left)", right: "var(--face-right)" };
  return (
    <>
      <Solid box={{ x0: 9.1, x1: 9.22, y0: 15.38, y1: 15.5, z1: 1.9 }} {...post} />
      <Solid box={{ x0: 10.38, x1: 10.5, y0: 15.38, y1: 15.5, z1: 1.9 }} {...post} />
      <Solid box={{ x0: 8.95, x1: 10.65, y0: 15.34, y1: 15.52, z0: 0.75, z1: 2 }} left="var(--slab)" />
      <polygon points={quadY(15.52, 9.1, 9.7, 1.3, 1.85)} fill="#2458E6" opacity={0.75} />
      <polygon points={quadY(15.52, 9.1, 9.7, 0.9, 1.18)} fill="#F8FAFC" opacity={0.9} />
      <polygon points={quadY(15.52, 9.85, 10.5, 1.5, 1.88)} fill={EMERALD} opacity={0.85} />
      <polygon points={quadY(15.52, 9.85, 10.5, 0.95, 1.38)} fill="#D99A2B" opacity={0.8} />
      <Solid box={{ x0: 8.85, x1: 10.75, y0: 15.25, y1: 15.62, z0: 2, z1: 2.1 }} top="var(--roof)" left="var(--slab)" />
    </>
  );
}

// ---------------------------------------------------------------- small things

const CAR_COLORS = {
  white: ["#F5F7FA", "#DDE3EA", "#BFC8D4"],
  blue: ["#4F7BEA", "#2F5DD6", "#2348AA"],
  red: ["#E06156", "#C8463D", "#A1362F"],
  silver: ["#C3CBD6", "#A3AEBD", "#86929F"],
} as const;

interface CarDef {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  color: keyof typeof CAR_COLORS;
}

function Car({ car }: { car: CarDef }) {
  const { x0, x1, y0, y1 } = car;
  const [top, left, right] = CAR_COLORS[car.color];
  const alongX = x1 - x0 > y1 - y0;
  const cab = alongX
    ? { x0: x0 + (x1 - x0) * 0.28, x1: x1 - (x1 - x0) * 0.22, y0: y0 + 0.06, y1: y1 - 0.06 }
    : { x0: x0 + 0.06, x1: x1 - 0.06, y0: y0 + (y1 - y0) * 0.26, y1: y1 - (y1 - y0) * 0.3 };
  const wheels = alongX
    ? [quadY(y1, x0 + 0.3, x0 + 0.62, 0, 0.3), quadY(y1, x1 - 0.62, x1 - 0.3, 0, 0.3)]
    : [quadX(x1, y0 + 0.3, y0 + 0.62, 0, 0.3), quadX(x1, y1 - 0.62, y1 - 0.3, 0, 0.3)];
  return (
    <g style={SHADE}>
      <polygon points={flat(x0 - 0.05, x1 + 0.15, y0 - 0.05, y1 + 0.05, 0.01)} fill="#0D223F" opacity={0.14} />
      <Solid box={{ x0, x1, y0, y1, z0: 0.12, z1: 0.6 }} top={top} left={left} right={right} />
      {wheels.map((w) => (
        <polygon key={w} points={w} fill="#1B2433" />
      ))}
      <Solid box={{ ...cab, z0: 0.6, z1: 1 }} top={top} left="#2A3950" right="#223046" />
    </g>
  );
}

const STALLS = [0.9, 2.3, 3.7, 5.1, 6.5];
const PARKED: CarDef[] = [
  { x0: STALLS[0] + 0.22, x1: STALLS[0] + 1.18, y0: 13.25, y1: 15.1, color: "blue" },
  { x0: STALLS[1] + 0.22, x1: STALLS[1] + 1.18, y0: 13.25, y1: 15.1, color: "white" },
  { x0: STALLS[3] + 0.22, x1: STALLS[3] + 1.18, y0: 13.25, y1: 15.1, color: "silver" },
  { x0: STALLS[4] + 0.22, x1: STALLS[4] + 1.18, y0: 13.25, y1: 15.1, color: "red" },
];
const LEAVING: CarDef = { x0: 11.6, x1: 13.5, y0: 16.35, y1: 17.25, color: "white" };

interface TreeDef {
  x: number;
  y: number;
  s: number;
  tall?: boolean;
}

const TREES: TreeDef[] = [
  { x: 5.8, y: 11.3, s: 1 },
  { x: 8.6, y: 9.3, s: 1.1 },
  { x: 8.2, y: 11.7, s: 0.9, tall: true },
  { x: 8.5, y: 13.5, s: 0.85 },
  { x: 12.8, y: 5.6, s: 0.9 },
  { x: 17.3, y: 5.8, s: 1, tall: true },
  { x: 17.4, y: 11, s: 1 },
  { x: 0.5, y: 12.4, s: 0.9, tall: true },
  { x: 17.6, y: 0.8, s: 0.8 },
  { x: 5.3, y: 8.9, s: 0.75, tall: true },
];

function Tree({ tree }: { tree: TreeDef }) {
  const { x, y, s, tall } = tree;
  const [bx, by] = P(x, y, 0);
  const [cx, cy] = P(x, y, (tall ? 2.2 : 1.9) * s);
  return (
    <>
      <ellipse cx={bx + 5 * s} cy={by + 1} rx={12 * s} ry={5 * s} fill="#0D223F" style={{ opacity: "calc(var(--shadow-o) * 1.3)" }} />
      <line x1={bx} y1={by} x2={cx} y2={cy + 4} stroke="var(--trunk)" strokeWidth={2.6 * s} strokeLinecap="round" />
      {tall ? (
        <>
          <ellipse cx={cx} cy={cy} rx={7.5 * s} ry={15 * s} fill="var(--tree-lo)" />
          <ellipse cx={cx - 2 * s} cy={cy - 3 * s} rx={4.5 * s} ry={10.5 * s} fill="var(--tree-hi)" />
        </>
      ) : (
        <>
          <circle cx={cx} cy={cy} r={12 * s} fill="var(--tree-lo)" />
          <circle cx={cx - 3 * s} cy={cy - 3.5 * s} r={8 * s} fill="var(--tree-hi)" />
          <circle cx={cx - 5 * s} cy={cy - 6.5 * s} r={3 * s} fill="rgb(255 255 255 / 0.16)" />
        </>
      )}
    </>
  );
}

function Lamp({ x, y }: { x: number; y: number }) {
  const [bx, by] = P(x, y, 0);
  const hy = by - 2.1 * ISO.hz;
  return (
    <>
      <line x1={bx} y1={by} x2={bx} y2={hy} stroke="var(--lobby)" strokeWidth={1.4} />
      <circle cx={bx} cy={hy} r={16} fill="url(#cs-lamp)" style={{ opacity: "var(--lamp-o)" }} />
      <circle cx={bx} cy={hy} r={2.4} fill="var(--slab)" />
      <circle cx={bx} cy={hy} r={2.4} fill="#FFE3A3" style={{ opacity: "var(--lamp-o)" }} />
    </>
  );
}

function Hedge({ box }: { box: Box }) {
  const f = boxFaces(box);
  return (
    <>
      <polygon points={f.left} fill="var(--tree-lo)" />
      <polygon points={f.right} fill="var(--tree-lo)" />
      <polygon points={f.right} fill="rgb(0 0 0 / 0.18)" />
      <polygon points={f.top} fill="var(--tree-hi)" />
    </>
  );
}

function Lounger({ y }: { y: number }) {
  return (
    <g style={SHADE}>
      <Solid box={{ x0: 14, x1: 15.05, y0: y, y1: y + 0.5, z0: 0.1, z1: 0.28 }} top="#F4F6F9" left="#DCE2EA" right="#C3CCD8" />
      <Solid box={{ x0: 14, x1: 14.25, y0: y, y1: y + 0.5, z0: 0.28, z1: 0.62 }} top="#F4F6F9" left="#DCE2EA" right="#C3CCD8" />
    </g>
  );
}

function Umbrella({ x, y }: { x: number; y: number }) {
  const [bx, by] = P(x, y, 0);
  const top = by - 2 * ISO.hz;
  return (
    <g style={SHADE}>
      <line x1={bx} y1={by} x2={bx} y2={top} stroke="#8793A6" strokeWidth={1.4} />
      <ellipse cx={bx} cy={top + 1.5} rx={25} ry={12} fill="#CDD5E0" />
      <ellipse cx={bx} cy={top} rx={25} ry={11} fill="#F7F9FC" />
      <path d={`M${bx - 25} ${top}Q${bx} ${top - 12} ${bx + 25} ${top}`} fill="#E9EEF5" />
    </g>
  );
}

function Fountain() {
  const [cx, cy] = P(6.6, 6.6, 0.35);
  const water = isoR(0.74);
  return (
    <>
      <Cylinder x={6.6} y={6.6} r={0.95} z0={0} z1={0.35} side="var(--face-left)" top="var(--slab)" />
      <ellipse cx={cx} cy={cy} rx={water.rx} ry={water.ry} fill="var(--water)" />
      <ellipse cx={cx} cy={cy} rx={water.rx * 0.35} ry={water.ry * 0.35} fill="var(--water-hi)" />
    </>
  );
}

// ---------------------------------------------------------------- sky

/** A mountain line across the stage: gaussian peaks plus a little noise. */
function ridgePath(base: number, peaks: Array<[number, number, number]>, ripple: number, seed: number) {
  const line: string[] = [];
  for (let x = VB.x; x <= VB.x + VB.w; x += 12) {
    let y = base;
    for (const [px, h, w] of peaks) y -= h * Math.exp(-(((x - px) / w) ** 2));
    y -= Math.sin(x / 37 + seed) * ripple + Math.sin(x / 13 + seed * 2) * ripple * 0.35;
    line.push(`${x},${y.toFixed(1)}`);
  }
  const bottom = VB.y + VB.h;
  return `M${VB.x},${bottom}L${line.join("L")}L${VB.x + VB.w},${bottom}Z`;
}

// Bogotá's cerros frame the model on both sides; the middle hides behind it.
const RIDGE_FAR = ridgePath(150, [[-345, 118, 120], [-150, 40, 90], [150, 45, 100], [355, 104, 140]], 6, 1.3);
const RIDGE_NEAR = ridgePath(186, [[-270, 62, 100], [-410, 40, 60], [270, 58, 120]], 4, 4.1);

const STARS = (() => {
  const rand = mulberry32(77);
  return Array.from({ length: 34 }, () => ({
    x: VB.x + 10 + rand() * (VB.w - 20),
    y: VB.y + 8 + rand() * 300,
    r: 0.7 + rand() * 1.1,
  }));
})();

const MOON: Pt = [262, -196];

function Cloud({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-14} y={-2} width={96} height={20} rx={10} />
      <circle cx={10} cy={0} r={17} />
      <circle cx={34} cy={-10} r={24} />
      <circle cx={60} cy={-1} r={17} />
    </g>
  );
}

// Sky behind the model: stars, the moon, the sun on its arc, clouds and
// two layers of cerros that the sun rises and sets behind. Colours and
// positions come from variables set by the timeline.
const Sky = memo(function Sky() {
  return (
    <svg aria-hidden viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`} className="pointer-events-none absolute inset-0 h-full w-full">
      <defs>
        <radialGradient id="cs-sun">
          <stop offset="0" style={{ stopColor: "var(--sun-halo)" }} stopOpacity={0.6} />
          <stop offset="0.35" style={{ stopColor: "var(--sun-halo)" }} stopOpacity={0.2} />
          <stop offset="1" style={{ stopColor: "var(--sun-halo)" }} stopOpacity={0} />
        </radialGradient>
        <radialGradient id="cs-moon-glow">
          <stop offset="0" stopColor="#E8EEFA" stopOpacity={0.35} />
          <stop offset="1" stopColor="#E8EEFA" stopOpacity={0} />
        </radialGradient>
        <mask id="cs-moon-mask" maskUnits="userSpaceOnUse" x={VB.x} y={VB.y} width={VB.w} height={VB.h}>
          <rect x={VB.x} y={VB.y} width={VB.w} height={VB.h} fill="#fff" />
          <circle cx={MOON[0] + 6} cy={MOON[1] - 4} r={11} fill="#000" />
        </mask>
        <linearGradient id="cs-ground" gradientUnits="userSpaceOnUse" x1="0" y1="80" x2="0" y2="330">
          <stop offset="0" style={{ stopColor: "var(--ridge-near)" }} />
          <stop offset="1" style={{ stopColor: "var(--stage-bottom)" }} />
        </linearGradient>
      </defs>

      <g fill="#fff" style={{ opacity: "var(--star-o)" }}>
        {STARS.map((s, i) => (
          <circle key={i} cx={s.x.toFixed(1)} cy={s.y.toFixed(1)} r={s.r.toFixed(2)} />
        ))}
      </g>

      <g style={{ opacity: "var(--moon-o)" }}>
        <circle cx={MOON[0]} cy={MOON[1]} r={42} fill="url(#cs-moon-glow)" />
        <circle cx={MOON[0]} cy={MOON[1]} r={12} fill="#EEF2FA" mask="url(#cs-moon-mask)" />
      </g>

      <g style={{ transform: "translate(var(--sun-x), var(--sun-y))", opacity: "var(--sun-o)" }}>
        <circle r={120} fill="url(#cs-sun)" />
        <circle r={24} style={{ fill: "var(--sun-core)" }} opacity={0.35} />
        <circle r={15} style={{ fill: "var(--sun-core)" }} />
      </g>

      <g style={{ fill: "var(--cloud)", opacity: "var(--cloud-o)" }}>
        <Cloud x={-318} y={-150} />
        <Cloud x={206} y={-14} s={0.75} />
      </g>

      <path d={RIDGE_FAR} style={{ fill: "var(--ridge-far)" }} />
      <path d={RIDGE_NEAR} fill="url(#cs-ground)" />
    </svg>
  );
});

// ---------------------------------------------------------------- layers

// Ground plane: slab, paving, pool, parking and cast shadows. Static.
const Ground = memo(function Ground() {
  const lot = boxFaces({ x0: 0, x1: LOT, y0: 0, y1: LOT, z0: -1.2, z1: 0 });
  const plaza = isoR(1.75);
  const [px, py] = P(6.6, 6.6, 0.01);
  const deckLines: string[] = [];
  for (let y = 10.9; y < 14.8; y += 0.5) deckLines.push(pts([P(9.2, y, 0.03), P(15.2, y, 0.03)]));
  return (
    <>
      <ellipse cx={0} cy={250} rx={470} ry={200} fill="url(#cs-floor)" />
      {/* Diorama slab: navy base, a concrete lip, lawn on top */}
      <polygon points={lot.left} fill="var(--base-left)" />
      <polygon points={lot.right} fill="var(--base-right)" />
      <polygon points={quadY(LOT, 0, LOT, -0.3, 0)} fill="var(--face-left)" />
      <polygon points={quadX(LOT, 0, LOT, -0.3, 0)} fill="var(--face-right)" />
      <polygon points={lot.top} fill="var(--ground)" stroke="rgb(255 255 255 / 0.35)" strokeWidth={1} />

      {/* Footpaths joining every door to the plaza */}
      <g fill="var(--paving)">
        <polygon points={flat(2.5, 16, 6.2, 7, 0.01)} />
        <polygon points={flat(6.2, 7, 6.6, 12.9, 0.01)} />
        <polygon points={flat(2.5, 3.3, 4.8, 6.2, 0.01)} />
        <polygon points={flat(9.8, 10.6, 4.6, 6.2, 0.01)} />
        <polygon points={flat(4.6, 6.2, 9.8, 10.6, 0.01)} />
        <polygon points={flat(15, 15.8, 4.8, 6.2, 0.01)} />
        <polygon points={flat(11.4, 12.2, 7, 7.2, 0.01)} />
        <polygon points={flat(8, 15.8, 15.2, 15.8, 0.01)} />
        <ellipse cx={px} cy={py} rx={plaza.rx} ry={plaza.ry} />
      </g>
      <ellipse cx={px} cy={py} rx={plaza.rx * 0.8} ry={plaza.ry * 0.8} fill="none" stroke="rgb(13 34 63 / 0.07)" strokeWidth={1.2} />
      <polygon points={flat(14.8, 17.4, 7.2, 9.8, 0.015)} fill="var(--paving)" />

      {/* Driveway and parking */}
      <polygon points={flat(0.8, LOT, 15.8, 17.7, 0.01)} fill="var(--asphalt)" />
      <polygon points={flat(0.8, 8, 12.9, 15.8, 0.01)} fill="var(--asphalt)" />
      <polyline points={pts([P(1.2, 16.75, 0.02), P(15.6, 16.75, 0.02)])} fill="none" stroke="rgb(255 255 255 / 0.6)" strokeWidth={1.2} strokeDasharray="10 9" />
      {[...STALLS, 7.9].map((x) => (
        <polyline key={x} points={pts([P(x, 13, 0.02), P(x, 15.2, 0.02)])} fill="none" stroke="rgb(255 255 255 / 0.7)" strokeWidth={1.2} />
      ))}

      {/* Pool deck and pool */}
      <polygon points={flat(9.2, 15.2, 10.4, 14.8, 0.02)} fill="var(--deck)" />
      {deckLines.map((l) => (
        <polyline key={l} points={l} fill="none" stroke="rgb(0 0 0 / 0.06)" strokeWidth={1} />
      ))}
      <polygon points={flat(9.6, 13.8, 11.2, 14.4, 0.03)} fill="var(--slab)" />
      <polygon points={quadY(11.4, 9.8, 13.6, -0.4, 0.03)} fill="var(--water-hi)" />
      <polygon points={quadX(9.8, 11.4, 14.2, -0.4, 0.03)} fill="var(--water-hi)" />
      <polygon points={flat(9.8, 13.6, 11.4, 14.2, -0.4)} fill="var(--water)" />
      <g stroke="var(--water-hi)" strokeWidth={1.4} strokeLinecap="round" fill="none" opacity={0.8}>
        <polyline points={pts([P(10.4, 12.3, -0.4), P(11.6, 12.3, -0.4)])} />
        <polyline points={pts([P(11.8, 13.1, -0.4), P(13, 13.1, -0.4)])} />
        <polyline points={pts([P(10.6, 13.7, -0.4), P(11.4, 13.7, -0.4)])} />
      </g>

      {/* Cast shadows, clipped to the lot */}
      <g clipPath="url(#cs-lot)" fill="#0D223F" style={{ opacity: "var(--shadow-o)" }}>
        {TOWERS.map(({ def, top }) => (
          <polygon key={def.id} points={castShadow(def.x0, def.x1, def.y0, def.y1, top)} />
        ))}
        <polygon points={castShadow(13.6, 17.2, 1.2, 4.8, 3.3)} />
        <polygon points={castShadow(9.8, 14.1, 7.2, 10.9, 3.1)} />
        <polygon points={castShadow(15.6, 17.8, 12.6, 15.4, 2.7)} />
        <polygon points={castShadow(14.75, 17.45, 7.05, 9.95, 2.4)} opacity={0.5} />
      </g>
    </>
  );
});

interface Item {
  key: string;
  depth: number;
  node: ReactNode;
}

// Everything that stands on the ground, painted back to front.
const Objects = memo(function Objects({ mode }: { mode: WindowMode }) {
  const items: Item[] = [
    ...TOWERS.map((geo) => ({
      key: geo.def.id,
      depth: (geo.def.x0 + geo.def.x1) / 2 + (geo.def.y0 + geo.def.y1) / 2,
      node: <TowerNode geo={geo} mode={mode} />,
    })),
    { key: "admin", depth: 18.4, node: <AdminOffice /> },
    { key: "club", depth: 20.8, node: <Clubhouse mode={mode} /> },
    { key: "pergola", depth: 24.6, node: <Pergola mode={mode} /> },
    { key: "porteria", depth: 30.7, node: <Porteria mode={mode} /> },
    { key: "cartelera", depth: 30, node: <Cartelera /> },
    { key: "fountain", depth: 13.2, node: <Fountain /> },
    { key: "hedge-deck", depth: 21.5, node: <Hedge box={{ x0: 8.9, x1: 9.2, y0: 10.4, y1: 14.8, z1: 0.5 }} /> },
    { key: "hedge-front", depth: 29.5, node: <Hedge box={{ x0: 9.2, x1: 15.2, y0: 14.8, y1: 15.1, z1: 0.5 }} /> },
    { key: "hedge-park-a", depth: 14.5, node: <Hedge box={{ x0: 0.8, x1: 6.1, y0: 12.55, y1: 12.8, z1: 0.45 }} /> },
    { key: "hedge-park-b", depth: 14.6, node: <Hedge box={{ x0: 7.1, x1: 8, y0: 12.55, y1: 12.8, z1: 0.45 }} /> },
    ...[11.3, 12.2, 13.1].map((y) => ({ key: `lounger-${y}`, depth: 14.5 + y + 0.25, node: <Lounger y={y} /> })),
    { key: "umbrella", depth: 27.1, node: <Umbrella x={15.1} y={12} /> },
    ...PARKED.map((car, i) => ({ key: `car-${i}`, depth: (car.x0 + car.x1) / 2 + (car.y0 + car.y1) / 2, node: <Car car={car} /> })),
    { key: "car-leaving", depth: 31, node: <Car car={LEAVING} /> },
    ...TREES.map((t, i) => ({ key: `tree-${i}`, depth: t.x + t.y, node: <Tree tree={t} /> })),
    ...([
      [8, 5.8],
      [5.8, 8],
      [7.6, 12.4],
      [14.6, 15.6],
      [16.2, 6],
    ] as const).map(([x, y]) => ({ key: `lamp-${x}-${y}`, depth: x + y, node: <Lamp x={x} y={y} /> })),
  ];
  items.sort((a, b) => a.depth - b.depth);
  return (
    <>
      {items.map((item) => (
        <g key={item.key}>{item.node}</g>
      ))}
    </>
  );
});

// ---------------------------------------------------------------- zones

const ZONE_ICON: Record<ZoneId, LucideIcon> = {
  porteria: ShieldCheck,
  administracion: Landmark,
  tanques: Wrench,
  cartelera: Megaphone,
  salon: CalendarDays,
};

// Each callout: the point it describes (world units) and where its chip
// floats (centre, in viewBox units), out in the empty stage around the model.
const ANCHOR: Record<ZoneId, { at: [number, number, number]; chip: Pt }> = {
  tanques: { at: [2.3, 2.3, T1_TOP + 1.5], chip: [0, -206] },
  administracion: { at: [15.4, 3, 3.7], chip: [300, -96] },
  cartelera: { at: [9.8, 15.43, 2.1], chip: [-262, 398] },
  salon: { at: [16.1, 8.5, 2.45], chip: [304, 352] },
  porteria: { at: [16.7, 14, 2.75], chip: [150, 428] },
};

// Ground glow and outline for the lit zone.
const ZONE_SHAPE: Record<ZoneId, { glow?: [number, number, number]; outline?: Box[] }> = {
  tanques: {},
  administracion: { glow: [15.4, 3, 3.4], outline: [{ x0: 13.6, x1: 17.2, y0: 1.2, y1: 4.8, z1: 3.3 }] },
  cartelera: { glow: [9.8, 15.4, 1.8], outline: [{ x0: 8.85, x1: 10.75, y0: 15.25, y1: 15.62, z1: 2.1 }] },
  salon: {
    glow: [13, 10.4, 5.2],
    outline: [
      { x0: 9.8, x1: 14.1, y0: 7.2, y1: 10.9, z1: 3.1 },
      { x0: 14.75, x1: 17.45, y0: 7.05, y1: 9.95, z1: 2.42 },
    ],
  },
  porteria: { glow: [16.7, 14.4, 2.6], outline: [{ x0: 15.6, x1: 17.8, y0: 12.6, y1: 15.4, z1: 2.7 }] },
};

const MARKER: Record<CalloutState, string> = { ok: "bg-emerald", warn: "bg-amber", info: "bg-cobalt" };

function toPercent([sx, sy]: Pt) {
  return { left: `${((sx - VB.x) / VB.w) * 100}%`, top: `${((sy - VB.y) / VB.h) * 100}%` };
}

interface SceneProps {
  /** Index of the current moment of the day. */
  step: number;
  mode: WindowMode;
  /** Zone lit by the current step, or by a hovered callout. */
  highlight: ZoneId | null;
  activeZone: ZoneId | null;
  onPin: (zone: ZoneId) => void;
  onPinHover: (zone: ZoneId | null) => void;
  style?: CSSProperties;
}

export const ConjuntoScene = forwardRef<HTMLDivElement, SceneProps>(function ConjuntoScene(
  { step, mode, highlight, activeZone, onPin, onPinHover, style },
  ref,
) {
  const shape = highlight ? ZONE_SHAPE[highlight] : null;
  const glow = shape?.glow;

  return (
    <div
      ref={ref}
      style={{
        background:
          "linear-gradient(180deg, var(--stage-top, rgb(var(--c-surface-2))) 0%, var(--stage-horizon, rgb(var(--c-surface-2))) 56%, var(--stage-bottom, rgb(var(--c-bg))) 100%)",
        ...style,
      }}
      className="scene relative overflow-hidden rounded-[28px] border border-line"
    >
      <Sky />

      <svg viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`} role="img" aria-label="Maqueta del Conjunto Altos del Bosque" className="relative block w-full">
        <defs>
          <linearGradient id="cs-ao" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0.3" stopColor="#0D223F" stopOpacity={0} />
            <stop offset="1" stopColor="#0D223F" stopOpacity={0.16} />
          </linearGradient>
          <linearGradient id="cs-tank" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#9DB1CA" />
            <stop offset="0.35" stopColor="#E6EDF6" />
            <stop offset="0.7" stopColor="#C3D0E0" />
            <stop offset="1" stopColor="#8FA4C0" />
          </linearGradient>
          <radialGradient id="cs-glow">
            <stop offset="0" stopColor={EMERALD} stopOpacity={0.5} />
            <stop offset="1" stopColor={EMERALD} stopOpacity={0} />
          </radialGradient>
          <radialGradient id="cs-lamp">
            <stop offset="0" stopColor="#FFD890" stopOpacity={0.65} />
            <stop offset="1" stopColor="#FFD890" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="cs-floor">
            <stop offset="0.55" stopColor="#0D223F" stopOpacity={0.2} />
            <stop offset="1" stopColor="#0D223F" stopOpacity={0} />
          </radialGradient>
          <clipPath id="cs-lot">
            <polygon points={flat(0, LOT, 0, LOT, 0)} />
          </clipPath>
        </defs>

        <Ground />

        {glow && (
          <ellipse
            cx={P(glow[0], glow[1])[0]}
            cy={P(glow[0], glow[1])[1]}
            {...isoR(glow[2])}
            fill="url(#cs-glow)"
          />
        )}

        <Objects mode={mode} />

        {/* Outline of the lit zone */}
        <g fill="none" stroke={EMERALD} strokeWidth={1.8} strokeLinejoin="round">
          {shape?.outline?.map((b, i) => <polygon key={i} points={silhouette(b)} />)}
          {highlight === "tanques" && (
            <ellipse cx={P(2.3, 2.3, T1_TOP)[0]} cy={P(2.3, 2.3, T1_TOP)[1]} {...isoR(1.1)} />
          )}
        </g>

        {/* Leader lines from each zone up to its callout */}
        {CALLOUTS.map((c) => {
          const [sx, sy] = P(...ANCHOR[c.zone].at);
          const [cx, cy] = ANCHOR[c.zone].chip;
          const lit = highlight === c.zone;
          return (
            <line
              key={c.zone}
              x1={sx}
              y1={sy}
              x2={cx}
              y2={cy}
              stroke={lit ? EMERALD : "rgb(var(--c-ink) / 0.4)"}
              strokeWidth={lit ? 1.6 : 1.1}
            />
          );
        })}
      </svg>

      {CALLOUTS.map((c) => {
        const zone = ZONES.find((z) => z.id === c.zone)!;
        const Icon = ZONE_ICON[c.zone];
        const [sx, sy] = P(...ANCHOR[c.zone].at);
        const value = c.values[step];
        const state = c.states[step];
        const lit = highlight === c.zone;
        const active = activeZone === c.zone;
        return (
          <Fragment key={c.zone}>
            <span
              aria-hidden
              style={toPercent([sx, sy])}
              className={cn(
                "pointer-events-none absolute z-10 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_1px_3px_rgb(13_34_63/0.4)]",
                MARKER[state],
              )}
            >
              {active && <span className="marker-pulse absolute -inset-[2px] rounded-full bg-emerald" />}
            </span>
            <button
              type="button"
              onClick={() => onPin(c.zone)}
              onMouseEnter={() => onPinHover(c.zone)}
              onMouseLeave={() => onPinHover(null)}
              onFocus={() => onPinHover(c.zone)}
              onBlur={() => onPinHover(null)}
              aria-label={`${zone.label}. ${c.label}: ${value}`}
              aria-current={active ? "step" : undefined}
              style={toPercent(ANCHOR[c.zone].chip)}
              className={cn(
                "callout absolute z-20 flex items-center gap-2 rounded-xl border bg-surface/95 py-1.5 pl-1.5 pr-3 text-left shadow-[0_10px_24px_-14px_rgb(13_34_63/0.6)] transition-[border-color,box-shadow] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt",
                lit ? "border-emerald shadow-[0_0_0_1px_rgb(var(--c-emerald)),0_10px_24px_-14px_rgb(13_34_63/0.6)]" : "border-line hover:border-[rgb(var(--c-ink)/0.3)]",
              )}
            >
              <span
                className={cn(
                  "grid h-7 w-7 shrink-0 place-items-center rounded-lg transition-colors duration-300",
                  lit ? "bg-emerald text-navy-deep" : "bg-surface-2 text-ink",
                )}
              >
                <Icon aria-hidden className="h-3.5 w-3.5" />
              </span>
              <span className="callout-text min-w-0">
                <span className="block whitespace-nowrap text-[11px] leading-tight text-muted">{c.label}</span>
                <span key={value} className="animate-enter mt-0.5 flex items-center gap-1.5 whitespace-nowrap text-[13px] font-bold leading-tight text-ink tabular">
                  <span aria-hidden className={cn("h-1.5 w-1.5 shrink-0 rounded-full", MARKER[state])} />
                  {value}
                </span>
              </span>
            </button>
          </Fragment>
        );
      })}
    </div>
  );
});
