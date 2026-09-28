"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ProfilePreview } from "@/components/profiles/previews";
import { PROFILES, type ProfileId } from "@/lib/data/profiles";
import { cn } from "@/lib/utils";

export function Profiles() {
  const [active, setActive] = useState<ProfileId>(PROFILES[0].id);
  const tabs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicator, setIndicator] = useState<{ left: number; width: number; top: number; height: number } | null>(null);

  // Sliding indicator follows the active tab, including on resize.
  useEffect(() => {
    const measure = () => {
      const el = tabs.current[active];
      if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth, top: el.offsetTop, height: el.offsetHeight });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active]);

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const index = PROFILES.findIndex((p) => p.id === active);
    const last = PROFILES.length - 1;
    const next =
      e.key === "ArrowRight" ? (index === last ? 0 : index + 1)
      : e.key === "ArrowLeft" ? (index === 0 ? last : index - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    const id = PROFILES[next].id;
    setActive(id);
    tabs.current[id]?.focus();
  }

  const profile = PROFILES.find((p) => p.id === active)!;

  return (
    <section id="beneficios" aria-label="Beneficios por perfil" className="bg-surface py-16 sm:py-24">
      <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-8">
        <div
          role="tablist"
          aria-label="Beneficios por perfil"
          onKeyDown={onKeyDown}
          className="relative grid w-full grid-cols-3 rounded-2xl border border-line bg-bg p-1.5 sm:inline-grid sm:w-auto"
        >
          {indicator && (
            <span
              aria-hidden
              className="absolute rounded-xl bg-navy transition-all duration-300 ease-out dark:bg-white/15"
              style={indicator}
            />
          )}
          {PROFILES.map((p) => {
            const selected = p.id === active;
            return (
              <button
                key={p.id}
                ref={(el) => {
                  tabs.current[p.id] = el;
                }}
                id={`tab-${p.id}`}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls={`panel-${p.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(p.id)}
                className={cn(
                  "relative z-10 min-h-11 rounded-xl px-2 py-2 text-[13px] font-semibold leading-tight transition-colors duration-200 sm:px-5 sm:text-sm",
                  selected ? "text-white" : "text-muted hover:text-ink",
                  // Before the indicator is measured, the tab carries its own fill.
                  selected && !indicator && "bg-navy dark:bg-white/15",
                )}
              >
                {p.tab}
              </button>
            );
          })}
        </div>

        <div
          key={profile.id}
          id={`panel-${profile.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${profile.id}`}
          tabIndex={0}
          className="animate-enter mt-12 grid items-center gap-12 rounded-lg lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16"
        >
          <div>
            <h3 className="text-2xl font-bold sm:text-[1.75rem] sm:leading-tight">{profile.headline}</h3>
            <dl className="mt-8 border-t border-line">
              {profile.benefits.map(({ title, text }) => (
                <div key={title} className="border-b border-line py-5">
                  <dt className="font-semibold text-ink">{title}</dt>
                  <dd className="mt-1 max-w-[30rem] text-muted">{text}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="rounded-[28px] border border-line bg-bg p-4 sm:p-6">
            <ProfilePreview id={profile.id} />
          </div>
        </div>
      </div>
    </section>
  );
}
