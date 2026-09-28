"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { ConjuntoScene } from "@/components/day/conjunto-scene";
import {
  DAY_STEPS,
  DAY_TOUR_EVENT,
  SCENE_NUMBERS,
  SCENE_PALETTE,
  SCENE_UNITS,
  STAGE,
  SUN_PALETTE,
  ZONES,
  type ZoneId,
} from "@/lib/data/day";
import { sampleColor, sampleNumber } from "@/lib/iso";
import { cn } from "@/lib/utils";

const SHORT_TIME = ["6 a. m.", "9 a. m.", "11 a. m.", "2 p. m.", "6 p. m.", "10 p. m."];
const N = DAY_STEPS.length;
const AUTOPLAY_MS = 4000;

/** Scene variables for position t (0 = 6 a. m., 1 = 10 p. m.) and a theme. */
function sceneVars(t: number, dark: boolean): Record<string, string> {
  const vars: Record<string, string> = {};
  const colors = { ...SCENE_PALETTE, ...SUN_PALETTE, ...(dark ? STAGE.dark : STAGE.light) };
  for (const [name, keys] of Object.entries(colors)) vars[name] = sampleColor(keys, t);
  for (const [name, keys] of Object.entries(SCENE_NUMBERS)) {
    const v = Math.round(sampleNumber(keys, t) * 1000) / 1000;
    vars[name] = `${v}${SCENE_UNITS[name] ?? ""}`;
  }
  return vars;
}

// Rendered on the server so the model has its dawn colours before
// hydration; the first paint on the client picks the right theme.
const INITIAL_VARS = sceneVars(0, false) as CSSProperties;

/** Writes the palette for t, with the stage following the site theme. */
function paint(el: HTMLElement, t: number) {
  const dark = document.documentElement.classList.contains("dark");
  for (const [name, value] of Object.entries(sceneVars(t, dark))) el.style.setProperty(name, value);
}

const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

// One day in the conjunto on a single screen: the time of day is driven
// by a timeline (drag, tap an hour, or play) instead of by scrolling.
export function DayInConjunto() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const rangeRef = useRef<HTMLInputElement>(null);
  const tRef = useRef(0);
  const tween = useRef(0);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [hoverZone, setHoverZone] = useState<ZoneId | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const setT = useCallback((t: number) => {
    tRef.current = t;
    if (sceneRef.current) paint(sceneRef.current, t);
    if (rangeRef.current) {
      rangeRef.current.value = String(Math.round(t * 1000));
      rangeRef.current.style.setProperty("--fill", `${t * 100}%`);
    }
  }, []);

  const goTo = useCallback(
    (index: number) => {
      cancelAnimationFrame(tween.current);
      setActive(index);
      const from = tRef.current;
      const to = index / (N - 1);
      // Low-power devices and reduced motion jump straight to the hour.
      const instant =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.classList.contains("lite");
      if (instant) return setT(to);
      const start = performance.now();
      const duration = 500 + Math.abs(to - from) * 900;
      let painted = 0;
      const step = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        // Repainting the model is the costly part: ~30 fps is plenty for a
        // change of light, and halves the work on slower phones.
        if (p === 1 || now - painted >= 30) {
          painted = now;
          setT(from + (to - from) * ease(p));
        }
        if (p < 1) tween.current = requestAnimationFrame(step);
      };
      tween.current = requestAnimationFrame(step);
    },
    [setT],
  );

  useEffect(() => {
    setT(0);
    // The stage follows the site theme: repaint when it changes.
    const observer = new MutationObserver(() => setT(tRef.current));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => {
      observer.disconnect();
      cancelAnimationFrame(tween.current);
    };
  }, [setT]);

  const activeRef = useRef(0);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  // Playing walks through the day one hour every few seconds and stops at
  // 10 p. m.; the ring on the button shows the time to the next hour.
  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => {
      if (activeRef.current >= N - 1) setPlaying(false);
      else goTo(activeRef.current + 1);
    }, AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [playing, active, goTo]);

  // Scrolling away pauses it, so nothing runs out of sight.
  useEffect(() => {
    const section = sectionRef.current;
    if (!playing || !section) return;
    let seen = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) seen = true;
        else if (seen) setPlaying(false);
      },
      { threshold: 0.2 },
    );
    io.observe(section);
    return () => io.disconnect();
  }, [playing]);

  // "Ver recorrido" in the hero starts the day from dawn.
  useEffect(() => {
    const start = () => {
      goTo(0);
      setPlaying(true);
    };
    window.addEventListener(DAY_TOUR_EVENT, start);
    return () => window.removeEventListener(DAY_TOUR_EVENT, start);
  }, [goTo]);

  function togglePlay() {
    if (playing) return setPlaying(false);
    // Start right away: the next hour, or dawn again after the last one.
    goTo(active >= N - 1 ? 0 : active + 1);
    setPlaying(true);
  }

  function manual(index: number) {
    setPlaying(false);
    goTo(index);
  }

  function onScrub(value: number) {
    setPlaying(false);
    cancelAnimationFrame(tween.current);
    const t = value / 1000;
    setT(t);
    setActive(Math.round(t * (N - 1)));
  }

  const onPin = useCallback((zone: ZoneId) => {
    setPlaying(false);
    goTo(DAY_STEPS.findIndex((s) => s.zone === zone));
  }, [goTo]);

  const step = DAY_STEPS[active];
  const zone = ZONES.find((z) => z.id === step.zone);
  const EventIcon = step.event.icon;

  return (
    <section ref={sectionRef} id="un-dia" aria-labelledby="un-dia-titulo" className="relative bg-bg py-20 sm:py-28">
      <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 id="un-dia-titulo" className="text-4xl font-extrabold sm:text-5xl">
            Un día en Altos del Bosque
          </h2>
          <p className="mt-4 text-lg">
            Recorre un día del conjunto con DomusCol. Mueve la línea de tiempo, toca una hora o una zona de la maqueta.
          </p>
        </div>

        <div id="un-dia-maqueta" className="mt-10 grid items-center gap-6 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-10">
          <div className="order-2 lg:order-1">
            <article
              key={step.id}
              aria-live="polite"
              className="animate-enter lg:pr-4"
            >
              <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <time className="text-sm font-bold text-ink tabular">{step.time}</time>
                <span className="text-sm text-muted">{zone ? zone.module : step.category}</span>
              </p>
              <h3 className="mt-3 text-[1.75rem] font-bold leading-tight tracking-[-0.02em]">{step.title}</h3>
              <p className="mt-3 text-lg">{step.text}</p>
              <div className="mt-7 flex items-center gap-3 border-t border-line pt-5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald text-navy-deep">
                  <EventIcon aria-hidden className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink">{step.event.title}</p>
                  <p className="text-xs text-muted">{step.event.detail}</p>
                </div>
              </div>
            </article>
          </div>

          <div className="order-1 lg:order-2">
            <ConjuntoScene
              ref={sceneRef}
              style={INITIAL_VARS}
              step={active}
              mode={step.windows}
              highlight={hoverZone ?? step.zone}
              activeZone={step.zone}
              onPin={onPin}
              onPinHover={setHoverZone}
            />

            {/* Timeline */}
            <div className="mt-4 flex items-center gap-3 rounded-[20px] border border-line bg-surface p-3 sm:gap-4 sm:p-4">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={playing ? "Pausar el recorrido" : active === N - 1 ? "Repetir el día" : "Reproducir el día"}
                className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-emerald text-navy-deep shadow-[0_8px_20px_-8px_rgb(16_185_129/0.8)] transition-transform active:scale-95"
              >
                {playing && (
                  <svg key={active} aria-hidden viewBox="0 0 52 52" className="pointer-events-none absolute -inset-1 h-[52px] w-[52px] -rotate-90">
                    <circle cx="26" cy="26" r="24.5" fill="none" stroke="rgb(var(--c-emerald) / 0.22)" strokeWidth="2" />
                    <circle
                      cx="26"
                      cy="26"
                      r="24.5"
                      fill="none"
                      stroke="rgb(var(--c-emerald))"
                      strokeWidth="2"
                      strokeLinecap="round"
                      pathLength={1}
                      strokeDasharray="1"
                      className="play-ring"
                      style={{ "--play-ms": `${AUTOPLAY_MS}ms` } as CSSProperties}
                    />
                  </svg>
                )}
                {playing ? (
                  <Pause aria-hidden className="h-4 w-4" />
                ) : active === N - 1 ? (
                  <RotateCcw aria-hidden className="h-4 w-4" />
                ) : (
                  <Play aria-hidden className="ml-0.5 h-4 w-4" />
                )}
              </button>
              <div className="min-w-0 flex-1">
                <label htmlFor="hora-del-dia" className="sr-only">
                  Hora del día
                </label>
                <input
                  ref={rangeRef}
                  id="hora-del-dia"
                  type="range"
                  min={0}
                  max={1000}
                  defaultValue={0}
                  aria-valuetext={step.time}
                  onChange={(e) => onScrub(Number(e.target.value))}
                  onPointerUp={() => goTo(Math.round(tRef.current * (N - 1)))}
                  onKeyUp={() => goTo(Math.round(tRef.current * (N - 1)))}
                  className="range w-full"
                />
                <div className="mt-2 flex justify-between">
                  {DAY_STEPS.map((s, i) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => manual(i)}
                      aria-pressed={i === active}
                      aria-label={s.time}
                      className={cn(
                        "rounded-md px-0.5 text-[10px] font-semibold tabular transition-colors sm:text-xs",
                        i === active ? "text-ink" : "text-muted hover:text-ink",
                      )}
                    >
                      {SHORT_TIME[i]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
