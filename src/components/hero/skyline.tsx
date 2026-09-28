"use client";

import { useEffect, useRef } from "react";
import { mulberry32 } from "@/lib/utils";

// Generative night skyline behind the hero: Bogotá's cerros orientales
// (with Monserrate's light), then two layers of residential towers.
// The cursor lights nearby windows emerald — the same "al día" signal as
// the facade — and the glow fades behind it like a trail. Scrolling
// takes the sky from dusk to night and switches more homes on.

interface Win {
  x: number;
  y: number;
  w: number;
  h: number;
  /** Lit when below the current night threshold. */
  rank: number;
  warm: boolean;
  glow: number;
  /** Delay (ms) for the load sweep. */
  onAt: number;
}

interface Tower {
  x: number;
  w: number;
  h: number;
  roof: "flat" | "tank" | "antenna";
  windows: Win[];
}

interface Layer {
  depth: number;
  fill: string;
  interactive: boolean;
  towers: Tower[];
}

interface Scene {
  W: number;
  H: number;
  ridge: Array<[number, number]>;
  monserrate: [number, number];
  layers: Layer[];
}

const MARGIN = 80; // extra width so parallax never shows an edge

const rgb = (r: number, g: number, b: number) => `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
const GLOW_RADIUS = 150;

function buildScene(W: number, H: number): Scene {
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
    const y =
      H * (0.5 - peak) -
      Math.sin(t * 6 + phase) * H * 0.035 -
      Math.sin(t * 17 + phase * 2) * H * 0.012;
    ridge.push([x, y]);
    if (y < monserrate[1]) monserrate = [x, y];
  }

  const layers: Layer[] = [
    { depth: 0.35, fill: "rgb(17 41 76)", interactive: true, towers: [] },
    { depth: 0.75, fill: "rgb(9 25 47)", interactive: true, towers: [] },
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

      const winW = near ? 5 : 3;
      const winH = near ? 7 : 4;
      const gapX = near ? 7 : 5;
      const gapY = near ? 9 : 6;
      const pad = near ? 9 : 6;
      const cols = Math.max(2, Math.floor((w - pad * 2 + gapX - winW) / gapX));
      const rows = Math.max(3, Math.floor((h - pad * 2) / gapY));
      const offsetX = (w - ((cols - 1) * gapX + winW)) / 2;

      const windows: Win[] = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const wy = H - h + pad + r * gapY;
          windows.push({
            x: x + offsetX + c * gapX,
            y: wy,
            w: winW,
            h: winH,
            rank: rand(),
            warm: rand() < 0.7,
            glow: 0,
            // Bottom floors switch on first, like the facade in the panel.
            onAt: 700 + ((H - wy) / (H * 0.6)) * 900 + rand() * 400,
          });
        }
      }

      layer.towers.push({ x, w, h, roof, windows });
      x += w + (near ? 10 + rand() * 40 : 6 + rand() * 22);
    }
  });

  return { W, H, ridge, monserrate, layers };
}

export function Skyline({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let scene: Scene;
    let dpr = 1;
    let frame = 0;
    let visible = true;
    const start = performance.now();
    const mouse = { x: -9999, y: -9999, nx: 0.5, tx: 0.5, inside: false };

    const night = () => {
      const rect = host.getBoundingClientRect();
      return Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height * 0.8)));
    };

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(rect.width * dpr);
      canvas!.height = Math.round(rect.height * dpr);
      scene = buildScene(rect.width, rect.height);
      request();
    }

    // Reduced motion keeps what is color, not movement: hover lighting and
    // the dusk-to-night sky stay; parallax and the load sweep are dropped.
    function draw(now: number) {
      const { W, H } = scene;
      const p = night();
      const elapsed = reduced ? Infinity : now - start;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Sky: dusk → night as the hero scrolls away.
      const sky = ctx!.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, rgb(13 - p * 5, 34 - p * 12, 63 - p * 22));
      sky.addColorStop(0.55, rgb(22 - p * 8, 50 - p * 16, 92 - p * 26));
      sky.addColorStop(1, rgb(30 - p * 10, 58 - p * 18, 98 - p * 24));
      ctx!.fillStyle = sky;
      ctx!.fillRect(0, 0, W, H);

      // City glow on the horizon: amber at dusk, cobalt at night.
      const glow = ctx!.createRadialGradient(W * 0.62, H * 0.62, 0, W * 0.62, H * 0.62, W * 0.55);
      glow.addColorStop(0, `rgb(217 154 43 / ${0.16 * (1 - p)})`);
      glow.addColorStop(0.35, `rgb(36 88 230 / ${0.1 + 0.08 * p})`);
      glow.addColorStop(1, "rgb(36 88 230 / 0)");
      ctx!.fillStyle = glow;
      ctx!.fillRect(0, 0, W, H);

      const px = (mouse.nx - 0.5) * -1;
      const scrollY = Math.max(0, -host!.getBoundingClientRect().top);

      // Cerros orientales
      const ridgeDx = px * 8;
      const ridgeDy = scrollY * 0.12;
      ctx!.beginPath();
      ctx!.moveTo(scene.ridge[0][0] + ridgeDx, H);
      for (const [x, y] of scene.ridge) ctx!.lineTo(x + ridgeDx, y + ridgeDy);
      ctx!.lineTo(scene.ridge[scene.ridge.length - 1][0] + ridgeDx, H);
      ctx!.closePath();
      ctx!.fillStyle = "rgb(11 29 55)";
      ctx!.fill();

      // Monserrate's sanctuary light
      const [mx, my] = scene.monserrate;
      const mgx = mx + ridgeDx;
      const mgy = my + ridgeDy - 3;
      const halo = ctx!.createRadialGradient(mgx, mgy, 0, mgx, mgy, 14);
      halo.addColorStop(0, "rgb(255 220 160 / 0.55)");
      halo.addColorStop(1, "rgb(255 220 160 / 0)");
      ctx!.fillStyle = halo;
      ctx!.fillRect(mgx - 14, mgy - 14, 28, 28);
      ctx!.fillStyle = "rgb(255 232 190)";
      ctx!.fillRect(mgx - 1, mgy - 1, 2, 2);

      let active = false;
      const threshold = 0.2 + p * 0.28;

      for (const layer of scene.layers) {
        const dx = px * layer.depth * 34;
        const dy = scrollY * (0.3 - layer.depth * 0.25);
        const near = layer.depth > 0.5;

        for (const tower of layer.towers) {
          const tx = tower.x + dx;
          if (tx > W + 10 || tx + tower.w < -10) continue;
          const top = H - tower.h + dy;

          ctx!.fillStyle = layer.fill;
          ctx!.fillRect(tx, top, tower.w, tower.h + 40);
          // Roof details: water tanks and antennas, as on most conjuntos
          if (tower.roof === "tank") ctx!.fillRect(tx + tower.w * 0.3, top - (near ? 9 : 6), tower.w * 0.4, near ? 9 : 6);
          if (tower.roof === "antenna") ctx!.fillRect(tx + tower.w * 0.7, top - (near ? 22 : 14), 2, near ? 22 : 14);

          for (const win of tower.windows) {
            const wx = win.x + dx;
            const wy = win.y + dy;

            if (layer.interactive && mouse.inside) {
              const d = Math.hypot(wx + win.w / 2 - mouse.x, wy + win.h / 2 - mouse.y);
              const radius = near ? GLOW_RADIUS : GLOW_RADIUS * 0.8;
              if (d < radius) win.glow = Math.max(win.glow, 1 - d / radius);
            }

            const on = elapsed > win.onAt;
            const lit = on && win.rank < threshold;
            if (lit) {
              const a = (near ? 0.42 : 0.3) * (0.6 + win.rank);
              ctx!.fillStyle = win.warm ? `rgb(255 208 140 / ${a})` : `rgb(170 200 255 / ${a * 0.8})`;
            } else {
              ctx!.fillStyle = near ? "rgb(255 255 255 / 0.035)" : "rgb(255 255 255 / 0.025)";
            }
            ctx!.fillRect(wx, wy, win.w, win.h);

            if (win.glow > 0.01) {
              ctx!.fillStyle = `rgb(16 185 129 / ${Math.min(1, win.glow * 1.1)})`;
              ctx!.fillRect(wx, wy, win.w, win.h);
              win.glow *= reduced ? 0.85 : 0.955;
              active = true;
            } else {
              win.glow = 0;
            }
            if (!on) active = true;
          }
        }
      }

      // Smooth parallax toward the pointer
      if (!reduced && Math.abs(mouse.tx - mouse.nx) > 0.001) {
        mouse.nx += (mouse.tx - mouse.nx) * 0.08;
        active = true;
      }

      return active;
    }

    function loop(now: number) {
      frame = 0;
      if (!visible) return;
      if (draw(now)) request();
    }

    function request() {
      if (!frame && visible) frame = requestAnimationFrame(loop);
    }

    function onPointerMove(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      const rect = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      if (!reduced) mouse.tx = mouse.x / rect.width;
      mouse.inside = true;
      request();
    }

    function onPointerLeave() {
      mouse.inside = false;
      mouse.tx = 0.5;
      request();
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      request();
    });
    io.observe(canvas);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    host.addEventListener("pointermove", onPointerMove);
    host.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("scroll", request, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("scroll", request);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
