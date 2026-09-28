"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("domuscol-theme", next ? "dark" : "light");
    } catch {
      // Storage can be unavailable (private mode); the toggle still works for this visit.
    }
    setDark(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      className={cn(
        "grid h-10 w-10 place-items-center rounded-xl text-white/75 transition-colors hover:bg-white/[0.08] hover:text-white",
        className,
      )}
    >
      {/* Both icons render until mounted so server and client markup match. */}
      <Sun aria-hidden className={cn("h-[18px] w-[18px]", dark === false && "hidden", dark === null && "hidden dark:block")} />
      <Moon aria-hidden className={cn("h-[18px] w-[18px]", dark === true && "hidden", dark === null && "dark:hidden")} />
    </button>
  );
}
