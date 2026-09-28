"use client";

import { useEffect, useRef } from "react";
import { cn, mulberry32 } from "@/lib/utils";

// Generative skyline behind the home hero: Bogotá's cerros orientales and
// two layers of residential towers. By night (dark theme) Monserrate is lit
// and scrolling takes the sky from dusk to night; by day (light theme) the
// city is pale and hazy. The cursor lights nearby windows emerald — the
// same "al día" signal as the facade — leaving a short trail.
//
// Performance: the sky is a CSS gradient; cerros and each tower layer are
// canvases painted once. Parallax moves them with CSS transforms (GPU
// compositing, no repaint) and only the few glowing windows are drawn per
// frame, on an overlay per layer.

interface Win {
  x: number;
  y: number;
  w: number;
  h: number;
  rank: number;
  warm: boolean;
  glow: number;
}

interface Tower {
  x: number;
  w: number;
  h: number;
  roof: "flat" | "tank" | "antenna";
  windows: Win[];
  glowing: boolean;
}

interface Layer {
  depth: number;
  towers: Tower[];
}

interface Scene {
  W: number;
  H: number;
  ridge: Array<[number, number]>;
  monserrate: [number, number];
  layers: Layer[];
}

interface Palette {
  sky: (p: number) => [string, string, string];
  glow: (p: number) => Array<[number, string]>;
  ridge: string;
  layers: [string, string];
  window: (w: Win, near: boolean, threshold: number) => string;
  monserrate: boolean;
}

const MARGIN = 80; // extra width so parallax never shows an edge
const GLOW_RADIUS = 150;

const rgba = (r: number, g: number, b: number, a = 1) =>
  `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a.toFixed(3)})`;

const NIGHT: Palette = {
  sky: (p) => [
    rgba(13 - p * 5, 34 - p * 12, 63 - p * 22),
    rgba(22 - p * 8, 50 - p * 16, 92 - p * 26),
    rgba(30 - p * 10, 58 - p * 18, 98 - p * 24),
  ],
  glow: (p) => [
    [0, rgba(217, 154, 43, 0.16 * (1 - p))],
    [0.35, rgba(36, 88, 230, 0.1 + 0.08 * p)],
    [1, rgba(36, 88, 230, 0)],
  ],
  ridge: "rgb(11, 29, 55)",
  layers: ["rgb(17, 41, 76)", "rgb(9, 25, 47)"],
  window: (w, near, threshold) => {
    if (w.rank < threshold) {
      const a = (near ? 0.42 : 0.3) * (0.6 + w.rank);
      return w.warm ? rgba(255, 208, 140, a) : rgba(170, 200, 255, a * 0.8);
    }
    return near ? "rgba(255, 255, 255, 0.035)" : "rgba(255, 255, 255, 0.025)";
  },
  monserrate: true,
};

const DAY: Palette = {
  sky: () => ["#C3D8F2", "#DAE6F6", "#EEF3FA"],
  glow: () => [
    [0, "rgba(255, 226, 180, 0.38)"],
    [0.4, "rgba(255, 255, 255, 0.22)"],
    [1, "rgba(255, 255, 255, 0)"],
  ],
  ridge: "#BACADF",
  layers: ["#C5D2E4", "#A8B9D1"],
  // Daylight glass: mostly darker panes, a few catching the sky.
  window: (w, near) =>
    w.rank < 0.12 ? "rgba(255, 255, 255, 0.72)" : near ? "rgba(46, 72, 112, 0.2)" : "rgba(46, 72, 112, 0.13)",
  monserrate: false,
};

function buildScene(W: number, H: number, dense: boolean): Scene {
  const rand = mulberry32(Math.round(W / 50) * 31 + 7);

  // Cerros orientales: layered sines, highest peak near the right edge,
  // clear of the mockups so Monserrate's light stays visible.
  const ridge: Array<[number, number]> = [];
  const peakX = W * 0.915;
  let monserrate: [number, number] = [peakX, H];
  const phase = rand() * Math.PI * 2;
  for (let x = -MARGIN; x <= W + MARGIN; x += 12) {
    const t = x / W;
    const peak = Math.exp(-Math.pow((x - peakX) / (W * 0.16), 2)) * 0.12;
    const y = H * (0.5 - peak) - Math.sin(t * 6 + phase) * H * 0.035 - Math.sin(t * 17 + phase * 2) * H * 0.012;
    ridge.push([x, y]);
    if (y < monserrate[1]) monserrate = [x, y];
  }

  const layers: Layer[] = [
    { depth: 0.35, towers: [] },
    { depth: 0.75, towers: [] },
  ];

  layers.forEach((layer, li) => {
    const near = li === 1;
    let x = -MARGIN + rand() * 40;
    while (x < W + MARGIN) {
      const w = near ? 70 + rand() * 70 : 38 + rand() * 46;
      // Keep the near layer lower on the left, where the headline sits.
      const leftDamp = near && x < W * 0.45 ? 0.62 : 1;
      const h = (near ? H * (0.24 + rand() * 0.3) : H * (0.2 + rand() * 0.22)) * leftDamp;
      const roofRoll = rand();
      const roof: Tower["roof"] = roofRoll < 0.35 ? "tank" : roofRoll < 0.5 ? "antenna" : "flat";

      // Fewer, larger windows on modest devices.
      const winW = near ? 5 : 3;
      const winH = near ? 7 : 4;
      const gapX = (near ? 7 : 5) * (dense ? 1 : 1.4);
      const gapY = (near ? 9 : 6) * (dense ? 1 : 1.4);
      const pad = near ? 9 : 6;
      const cols = Math.max(2, Math.floor((w - pad * 2 + gapX - winW) / gapX));
      const rows = Math.max(3, Math.floor((h - pad * 2) / gapY));
      const offsetX = (w - ((cols - 1) * gapX + winW)) / 2;

      const windows: Win[] = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          windows.push({
            x: x + offsetX + c * gapX,
            y: H - h + pad + r * gapY,
            w: winW,
            h: winH,
            rank: rand(),
            warm: rand() < 0.7,
            glow: 0,
          });
        }
      }

      layer.towers.push({ x, w, h, roof, windows, glowing: false });
      x += w + (near ? 10 + rand() * 40 : 6 + rand() * 22);
    }
  });

  return { W, H, ridge, monserrate, layers };
}

export function Skyline({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const ridgeRef = useRef<HTMLCanvasElement>(null);
  const layerRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const root = rootRef.current;
    const ridgeCanvas = ridgeRef.current;
    const wrappers = layerRefs.current;
    const host = root?.parentElement;
    if (!root || !ridgeCanvas || !host || wrappers.length < 2 || wrappers.some((w) => !w)) return;
    const towerCanvases = wrappers.map((w) => w!.children[0] as HTMLCanvasElement);
    const glowCanvases = wrappers.map((w) => w!.children[1] as HTMLCanvasElement);

    const html = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lite = html.classList.contains("lite");
    const interactive = window.matchMedia("(pointer: fine)").matches && !lite;
    const decay = reduced ? 0.85 : 0.955;

    let scene: Scene | null = null;
    let W = 0;
    let H = 0;
    let dpr = 1;
    let hostTop = 0;
    let palette = html.classList.contains("dark") ? NIGHT : DAY;
    let cacheLevel = -1;
    const bandTop = [0, 0];
    const glowing = [false, false];
    let frame = 0;
    let visible = true;
    const mouse = { x: -9999, y: -9999, nx: 0.5, tx: 0.5, inside: false };

    /** Sizes a canvas to a band of the hero and returns its context in CSS pixels. */
    const setup = (c: HTMLCanvasElement, w: number, h: number) => {
      c.width = Math.ceil(w * dpr);
      c.height = Math.ceil(h * dpr);
      c.style.width = `${w}px`;
      c.style.height = `${h}px`;
      const x = c.getContext("2d")!;
      x.setTransform(dpr, 0, 0, dpr, 0, 0);
      return x;
    };

    // Night progress from scroll, quantized so the layers are only
    // repainted a few times on the way down.
    const nightLevel = () => {
      if (palette !== NIGHT) return 0;
      const p = Math.min(1, Math.max(0, (window.scrollY - hostTop) / Math.max(1, H * 0.8)));
      return Math.round(p * 6) / 6;
    };

    function paintSky(level: number) {
      const [top, mid, bottom] = palette.sky(level);
      const glow = palette
        .glow(level)
        .map(([o, c]) => `${c} ${Math.round(o * 100)}%`)
        .join(", ");
      root!.style.background = `radial-gradient(circle ${Math.round(W * 0.55)}px at 62% 62%, ${glow}), linear-gradient(180deg, ${top}, ${mid} 55%, ${bottom})`;
    }

    function paintRidge() {
      if (!scene) return;
      const { ridge, monserrate } = scene;
      const top = Math.floor(Math.min(...ridge.map(([, y]) => y)) - 20);
      const r = setup(ridgeCanvas!, W + MARGIN * 2, H - top);
      r.translate(MARGIN, -top);
      r.beginPath();
      r.moveTo(ridge[0][0], H);
      for (const [x, y] of ridge) r.lineTo(x, y);
      r.lineTo(ridge[ridge.length - 1][0], H);
      r.closePath();
      r.fillStyle = palette.ridge;
      r.fill();
      if (palette.monserrate) {
        const [mx, my] = [monserrate[0], monserrate[1] - 3];
        const halo = r.createRadialGradient(mx, my, 0, mx, my, 14);
        halo.addColorStop(0, "rgba(255, 220, 160, 0.55)");
        halo.addColorStop(1, "rgba(255, 220, 160, 0)");
        r.fillStyle = halo;
        r.fillRect(mx - 14, my - 14, 28, 28);
        r.fillStyle = "rgb(255, 232, 190)";
        r.fillRect(mx - 1, my - 1, 2, 2);
      }
    }

    function paintTowers(level: number) {
      if (!scene) return;
      const threshold = 0.2 + level * 0.28;
      scene.layers.forEach((layer, i) => {
        const near = i === 1;
        // Only the band the towers occupy (antennas included) is allocated.
        const top = Math.floor(Math.min(...layer.towers.map((t) => H - t.h)) - 24);
        bandTop[i] = top;
        const l = setup(towerCanvases[i], W + MARGIN * 2, H - top);
        l.translate(MARGIN, -top);
        for (const tower of layer.towers) {
          const y = H - tower.h;
          l.fillStyle = palette.layers[i];
          l.fillRect(tower.x, y, tower.w, tower.h);
          // Roof details: water tanks and antennas, as on most conjuntos
          if (tower.roof === "tank") l.fillRect(tower.x + tower.w * 0.3, y - (near ? 9 : 6), tower.w * 0.4, near ? 9 : 6);
          if (tower.roof === "antenna") l.fillRect(tower.x + tower.w * 0.7, y - (near ? 22 : 14), 2, near ? 22 : 14);
          for (const win of tower.windows) {
            l.fillStyle = palette.window(win, near, threshold);
            l.fillRect(win.x, win.y, win.w, win.h);
          }
        }
        if (interactive) setup(glowCanvases[i], W + MARGIN * 2, H - top);
        glowing[i] = false;
      });
    }

    function paintLevel(level: number) {
      paintSky(level);
      paintTowers(level);
      cacheLevel = level;
    }

    // A frame only moves the layers (compositor work, no repaint) and, when
    // the pointer is near, repaints the few glowing windows.
    function draw() {
      frame = 0;
      if (!visible || !scene || W === 0) return;
      const level = nightLevel();
      if (level !== cacheLevel) paintLevel(level);

      const px = interactive && !reduced ? (mouse.nx - 0.5) * -1 : 0;
      const scrollY = reduced ? 0 : Math.max(0, window.scrollY - hostTop);
      ridgeCanvas!.style.transform = `translate3d(${(px * 8).toFixed(2)}px, ${(scrollY * 0.12).toFixed(1)}px, 0)`;

      let active = false;
      scene.layers.forEach((layer, i) => {
        const dx = px * layer.depth * 34;
        const dy = scrollY * (0.3 - layer.depth * 0.25);
        wrappers[i]!.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(1)}px, 0)`;
        if (!interactive) return;

        const radius = layer.depth > 0.5 ? GLOW_RADIUS : GLOW_RADIUS * 0.8;
        // Pointer in the layer's own coordinates
        const lx = mouse.x - dx;
        const ly = mouse.y - dy;
        const inLayer = mouse.inside && ly > bandTop[i] - radius;
        if (!inLayer && !glowing[i]) return;

        const g = glowCanvases[i].getContext("2d")!;
        g.setTransform(dpr, 0, 0, dpr, 0, 0);
        g.clearRect(0, 0, W + MARGIN * 2, H - bandTop[i]);
        g.translate(MARGIN, -bandTop[i]);
        let any = false;
        for (const tower of layer.towers) {
          const inRange = inLayer && lx > tower.x - radius && lx < tower.x + tower.w + radius;
          if (!inRange && !tower.glowing) continue;
          let lit = false;
          for (const win of tower.windows) {
            if (inRange) {
              const d = Math.hypot(win.x + win.w / 2 - lx, win.y + win.h / 2 - ly);
              if (d < radius) win.glow = Math.max(win.glow, 1 - d / radius);
            }
            if (win.glow > 0.01) {
              g.fillStyle = `rgba(16, 185, 129, ${Math.min(1, win.glow * 1.1).toFixed(3)})`;
              g.fillRect(win.x, win.y, win.w, win.h);
              win.glow *= decay;
              lit = true;
            } else {
              win.glow = 0;
            }
          }
          tower.glowing = lit;
          if (lit) any = true;
        }
        glowing[i] = any;
        if (any) active = true;
      });

      // Smooth parallax toward the pointer
      if (interactive && !reduced && Math.abs(mouse.tx - mouse.nx) > 0.001) {
        mouse.nx += (mouse.tx - mouse.nx) * 0.08;
        active = true;
      }

      if (active) request();
    }

    function request() {
      if (!frame && visible) frame = requestAnimationFrame(draw);
    }

    function resize() {
      const rect = root!.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      dpr = Math.min(window.devicePixelRatio || 1, lite ? 1 : 1.5);
      W = rect.width;
      H = rect.height;
      hostTop = host!.getBoundingClientRect().top + window.scrollY;
      scene = buildScene(W, H, !lite);
      paintRidge();
      cacheLevel = -1;
      request();
      root!.style.opacity = "1";
    }

    function onPointerMove(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      const rect = root!.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.tx = mouse.x / rect.width;
      mouse.inside = true;
      request();
    }

    function onPointerLeave() {
      mouse.inside = false;
      mouse.tx = 0.5;
      request();
    }

    const onVisibility = () => {
      visible = !document.hidden;
      request();
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && !document.hidden;
      request();
    });
    io.observe(root);

    let resizeFrame = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(resize);
    });
    ro.observe(root);

    // Repaint the layers when the theme changes.
    const mo = new MutationObserver(() => {
      const next = html.classList.contains("dark") ? NIGHT : DAY;
      if (next !== palette) {
        palette = next;
        paintRidge();
        cacheLevel = -1;
        request();
      }
    });
    mo.observe(html, { attributes: true, attributeFilter: ["class"] });

    resize();

    if (interactive) {
      host.addEventListener("pointermove", onPointerMove);
      host.addEventListener("pointerleave", onPointerLeave);
    }
    if (!reduced) window.addEventListener("scroll", request, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(resizeFrame);
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("scroll", request);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // Each layer is its own canvas, painted once; parallax moves them with
  // transforms, so the GPU composites them without repainting.
  return (
    <div
      ref={rootRef}
      aria-hidden
      className={cn("overflow-hidden", className)}
      style={{ opacity: 0, transition: "opacity 700ms ease" }}
    >
      <canvas ref={ridgeRef} className="absolute bottom-0 will-change-transform" style={{ left: -MARGIN }} />
      {[0, 1].map((i) => (
        <div
          key={i}
          ref={(el) => {
            layerRefs.current[i] = el;
          }}
          className="absolute bottom-0 will-change-transform"
          style={{ left: -MARGIN }}
        >
          <canvas className="block" />
          <canvas className="absolute inset-0" />
        </div>
      ))}
    </div>
  );
}
