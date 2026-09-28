// Isometric (2:1) projection helpers for the conjunto illustration.
// World units: x runs down-right, y down-left, z up.
export const ISO = { hx: 22, hy: 11, hz: 13 } as const;

export type Pt = [number, number];

export function P(x: number, y: number, z = 0): Pt {
  return [(x - y) * ISO.hx, (x + y) * ISO.hy - z * ISO.hz];
}

export function pts(list: Pt[]) {
  return list.map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`).join(" ");
}

export interface Box {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  z0?: number;
  z1: number;
}

/** The three visible faces of an axis-aligned box. */
export function boxFaces({ x0, x1, y0, y1, z0 = 0, z1 }: Box) {
  return {
    top: pts([P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1)]),
    // +x face: faces the viewer's right
    right: pts([P(x1, y0, z0), P(x1, y1, z0), P(x1, y1, z1), P(x1, y0, z1)]),
    // +y face: faces the viewer's left
    left: pts([P(x0, y1, z0), P(x1, y1, z0), P(x1, y1, z1), P(x0, y1, z1)]),
  };
}

export function flat(x0: number, x1: number, y0: number, y1: number, z = 0) {
  return pts([P(x0, y0, z), P(x1, y0, z), P(x1, y1, z), P(x0, y1, z)]);
}

/** Quad on the +x face (x fixed) spanning y and z. */
export function quadX(x: number, ya: number, yb: number, za: number, zb: number) {
  return pts([P(x, ya, za), P(x, yb, za), P(x, yb, zb), P(x, ya, zb)]);
}

/** Quad on the +y face (y fixed) spanning x and z. */
export function quadY(y: number, xa: number, xb: number, za: number, zb: number) {
  return pts([P(xa, y, za), P(xb, y, za), P(xb, y, zb), P(xa, y, zb)]);
}

// ---- colour interpolation for the time of day ----

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Colour at position t (0..1) along evenly spaced keyframes. */
export function sampleColor(keys: readonly string[], t: number) {
  const pos = Math.min(0.9999, Math.max(0, t)) * (keys.length - 1);
  const i = Math.floor(pos);
  const f = pos - i;
  const a = hexToRgb(keys[i]);
  const b = hexToRgb(keys[i + 1]);
  const c = a.map((v, k) => Math.round(v + (b[k] - v) * f));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

export function sampleNumber(keys: readonly number[], t: number) {
  const pos = Math.min(0.9999, Math.max(0, t)) * (keys.length - 1);
  const i = Math.floor(pos);
  const f = pos - i;
  return keys[i] + (keys[i + 1] - keys[i]) * f;
}
