"use client";

import { useEffect, useRef } from "react";
import type { AnimationItem } from "lottie-web";

// Plays one of the isotype animations built from the brand kit
// (public/lottie, see scripts/generar-lotties.mjs). The light SVG player
// and the animation load only when needed; it repeats while it stays on
// screen and stops when it leaves.

export type LottiePreset =
  | "elastic-spring"
  | "stroke-draw"
  | "iso-3d-flip"
  | "orbital-vortex"
  | "liquid-pulse"
  | "cinematic-shutter";

type Color = [number, number, number, number];
/** Pause between repeats, with the finished mark on screen. */
const HOLD_MS = 2200;
const ESPRESSO: Color = [0.0941, 0.0784, 0.0706, 1];
const WHITE: Color = [1, 1, 1, 1];

interface Shape {
  nm?: string;
  ty: string;
  it?: Shape[];
  c?: { a: number; k: Color };
}

/**
 * "brand": main tower and horizon follow the theme (espresso / white).
 * "mono": the whole mark in espresso, for use on terracota (monochrome logo).
 */
function recolor(data: { layers: Array<{ shapes?: Shape[] }> }, tone: "brand" | "mono", dark: boolean) {
  const ink = tone === "mono" ? ESPRESSO : dark ? WHITE : ESPRESSO;
  const walk = (items: Shape[] = []) =>
    items.forEach((item) => {
      if (item.it) walk(item.it);
      if (item.c && (tone === "mono" || item.nm?.endsWith("-ink"))) item.c = { a: 0, k: ink };
    });
  data.layers.forEach((layer) => walk(layer.shapes));
}

interface BrandLottieProps {
  preset: LottiePreset;
  loop?: boolean;
  /** Load when it scrolls into view (default) or right away. It only plays while visible. */
  playOnView?: boolean;
  tone?: "brand" | "mono";
  className?: string;
}

export function BrandLottie({ preset, loop = false, playOnView = true, tone = "brand", className }: BrandLottieProps) {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const html = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let anim: AnimationItem | null = null;
    let lastFrame = 0;
    let cancelled = false;
    let source: unknown = null;
    let visible = false;
    let hold = 0;
    let loading: Promise<void> | null = null;
    const load = () => (loading ??= mount());

    const still = () => anim?.goToAndStop(loop ? 0 : lastFrame, true);
    const replay = () => {
      window.clearTimeout(hold);
      if (!anim || !visible || reduced) return;
      anim.goToAndPlay(0, true);
    };

    async function mount() {
      const [{ default: lottie }, json] = await Promise.all([
        import("lottie-web/build/player/lottie_light"),
        source ? Promise.resolve(source) : fetch(`/lottie/${preset}.json`).then((r) => r.json()),
      ]);
      if (cancelled || !el) return;
      source = json;
      const data = structuredClone(json) as { op: number; layers: Array<{ shapes?: Shape[] }> };
      recolor(data, tone, html.classList.contains("dark"));
      lastFrame = data.op - 1;
      anim?.destroy();
      anim = lottie.loadAnimation({
        container: el,
        renderer: "svg",
        loop: loop && !reduced,
        autoplay: false,
        animationData: data,
        rendererSettings: { preserveAspectRatio: "xMidYMid meet" },
      });
      // While it stays in view, the mark rests finished for a moment and plays again.
      anim.addEventListener("complete", () => {
        window.clearTimeout(hold);
        if (visible && !reduced) hold = window.setTimeout(replay, HOLD_MS);
      });
      // Reduced motion shows the finished mark; otherwise play while visible.
      if (reduced || !visible) still();
      else anim.play();
    }

    // Plays while on screen, stops when scrolled away, replays on return.
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          if (!anim) void load();
          else replay();
        } else {
          window.clearTimeout(hold);
          anim?.pause();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    // Animations that must be ready at once (404, form) load before they show.
    if (!playOnView) void load();

    // Pointing at the mark plays it again.
    const onEnter = () => {
      if (anim?.isPaused) replay();
    };
    el.addEventListener("pointerenter", onEnter);

    // The theme decides the ink colour: rebuild when it changes.
    const mo = new MutationObserver(() => {
      if (anim) void mount();
    });
    mo.observe(html, { attributes: true, attributeFilter: ["class"] });

    return () => {
      cancelled = true;
      window.clearTimeout(hold);
      io.disconnect();
      mo.disconnect();
      el.removeEventListener("pointerenter", onEnter);
      anim?.destroy();
    };
  }, [preset, loop, playOnView, tone]);

  return <div ref={box} aria-hidden className={className} />;
}
