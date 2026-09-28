"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { flushSync } from "react-dom";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { ready: Promise<void> };
};

export function ThemeToggle({ className }: { className?: string }) {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function apply(next: boolean) {
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("domuscol-theme", next ? "dark" : "light");
    } catch {
      // Storage can be unavailable (private mode); the toggle still works for this visit.
    }
    setDark(next);
  }

  function toggle(e: MouseEvent<HTMLButtonElement>) {
    const next = !document.documentElement.classList.contains("dark");
    const doc = document as ViewTransitionDocument;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!doc.startViewTransition || reduced) {
      apply(next);
      return;
    }

    // The new theme grows as a circle from the toggle (or its centre when
    // activated from the keyboard, where clientX/Y are 0).
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX || rect.left + rect.width / 2;
    const y = e.clientY || rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    const transition = doc.startViewTransition(() => flushSync(() => apply(next)));
    transition.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 650, easing: "cubic-bezier(0.4, 0, 0.2, 1)", pseudoElement: "::view-transition-new(root)" },
        );
      })
      .catch(() => {
        // A skipped transition still applied the theme.
      });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      className={cn(
        "grid h-10 w-10 place-items-center rounded-xl text-body transition-colors hover:bg-[rgb(var(--c-ink)/0.06)] hover:text-ink dark:text-white/75 dark:hover:bg-white/[0.08] dark:hover:text-white",
        className,
      )}
    >
      {/* Both icons render until mounted so server and client markup match. */}
      <Sun aria-hidden className={cn("h-[18px] w-[18px]", dark === false && "hidden", dark === null && "hidden dark:block")} />
      <Moon aria-hidden className={cn("h-[18px] w-[18px]", dark === true && "hidden", dark === null && "dark:hidden")} />
    </button>
  );
}
