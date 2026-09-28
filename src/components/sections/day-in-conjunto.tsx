"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Moon, Pause, Play, Sun, Sunrise, Sunset } from "lucide-react";
import { ConjuntoScene } from "@/components/day/conjunto-scene";
import {
  DAY_STEPS,
  FACE_LEFT,
  FACE_RIGHT,
  FACE_TOP,
  GLASS,
  GROUND,
  MOON_OPACITY,
  PAVING,
  SKY_BOTTOM,
  SKY_TOP,
  SUN_OPACITY,
  SUN_X,
  SUN_Y,
  TREE,
  WATER,
  ZONES,
  type ZoneId,
} from "@/lib/data/day";
import { sampleColor, sampleNumber } from "@/lib/iso";
import { cn } from "@/lib/utils";

const DOOR = ["#51627E", "#5E708A", "#5E708A", "#5E708A", "#34455F", "#0A1B33"] as const;
const TRUNK = ["#7A6A58", "#8A7560", "#8A7560", "#8A7560", "#4F463D", "#1C2A2A"] as const;
const LABEL_ALPHA = [0.5, 0.45, 0.45, 0.45, 0.6, 0.7] as const;
const SHADE = [0.9, 1, 1, 1, 0.72, 0.42] as const;
const SHORT_TIME = ["6 a. m.", "9 a. m.", "11 a. m.", "2 p. m.", "6 p. m.", "10 p. m."];
const CLOCK_ICON = [Sunrise, Sun, Sun, Sun, Sunset, Moon];
const N = DAY_STEPS.length;
const AUTOPLAY_MS = 4200;

/** Writes the time-of-day palette for position t (0 = 6 a. m., 1 = 10 p. m.). */
function paint(el: HTMLElement, t: number) {
  const set = (name: string, value: string) => el.style.setProperty(name, value);
  set("--sky-top", sampleColor(SKY_TOP, t));
  set("--sky-bottom", sampleColor(SKY_BOTTOM, t));
  set("--face-top", sampleColor(FACE_TOP, t));
  set("--face-left", sampleColor(FACE_LEFT, t));
  set("--face-right", sampleColor(FACE_RIGHT, t));
  set("--ground", sampleColor(GROUND, t));
  set("--paving", sampleColor(PAVING, t));
  set("--water", sampleColor(WATER, t));
  set("--glass", sampleColor(GLASS, t));
  set("--tree", sampleColor(TREE, t));
  set("--door", sampleColor(DOOR, t));
  set("--trunk", sampleColor(TRUNK, t));
  const alpha = sampleNumber(LABEL_ALPHA, t);
  set("--label", t > 0.7 ? `rgb(255 255 255 / ${alpha})` : `rgb(13 34 63 / ${alpha})`);
  set("--sun-x", `${sampleNumber(SUN_X, t)}%`);
  set("--sun-y", `${sampleNumber(SUN_Y, t)}%`);
  set("--sun-o", String(sampleNumber(SUN_OPACITY, t)));
  set("--moon-o", String(sampleNumber(MOON_OPACITY, t)));
  set("--shade", String(sampleNumber(SHADE, t)));
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
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setT(to);
      const start = performance.now();
      const duration = 500 + Math.abs(to - from) * 900;
      const step = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        setT(from + (to - from) * ease(p));
        if (p < 1) tween.current = requestAnimationFrame(step);
      };
      tween.current = requestAnimationFrame(step);
    },
    [setT],
  );

  useEffect(() => {
    setT(0);
    return () => cancelAnimationFrame(tween.current);
  }, [setT]);

  const activeRef = useRef(0);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  // Play walks through the day and loops back to dawn.
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => goTo((activeRef.current + 1) % N), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [playing, goTo]);

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
  const ClockIcon = CLOCK_ICON[active];
  const night = active >= 4;
  const zone = ZONES.find((z) => z.id === step.zone);
  const EventIcon = step.event.icon;

  return (
    <section id="un-dia" aria-labelledby="un-dia-titulo" className="relative bg-bg py-20 sm:py-28">
      <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 id="un-dia-titulo" className="text-4xl font-extrabold sm:text-5xl">
            Un día en Altos del Bosque
          </h2>
          <p className="mt-4 text-lg">
            Recorre un día del conjunto con DomusCol. Mueve la línea de tiempo, toca una hora o una zona del mapa.
          </p>
        </div>

        <div className="mt-10 grid items-center gap-6 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-10">
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
              mode={step.windows}
              highlight={hoverZone ?? step.zone}
              activeZone={step.zone}
              onPin={onPin}
              onPinHover={setHoverZone}
              clock={
                <p
                  className={cn(
                    "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold tabular backdrop-blur-md transition-colors duration-500",
                    night ? "bg-white/10 text-white" : "bg-white/70 text-navy",
                  )}
                >
                  <ClockIcon aria-hidden className="h-4 w-4" />
                  {step.time}
                </p>
              }
            />

            {/* Timeline */}
            <div className="mt-4 flex items-center gap-3 rounded-[20px] border border-line bg-surface p-3 sm:gap-4 sm:p-4">
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                aria-label={playing ? "Pausar el día" : "Reproducir el día"}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-emerald text-navy-deep shadow-[0_8px_20px_-8px_rgb(16_185_129/0.8)] transition-transform active:scale-95"
              >
                {playing ? <Pause aria-hidden className="h-4 w-4" /> : <Play aria-hidden className="ml-0.5 h-4 w-4" />}
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
