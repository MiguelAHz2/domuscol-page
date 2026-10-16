"use client";

import { useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark";

/** Theme from the `dark` class on <html>; null until the component mounts. */
function useTheme(): Theme | null {
  const [theme, setTheme] = useState<Theme | null>(null);
  useEffect(() => {
    const html = document.documentElement;
    const read = () => setTheme(html.classList.contains("dark") ? "dark" : "light");
    read();
    const observer = new MutationObserver(read);
    observer.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return theme;
}

/**
 * Content for one theme only. The server HTML carries both versions and CSS
 * shows the right one on first paint; once mounted, only the active theme's
 * version stays in the page, so a hidden photo is never downloaded.
 */
export function ThemeOnly({ theme, children }: { theme: Theme; children: ReactNode }) {
  const current = useTheme();
  if (current !== null && current !== theme) return null;
  return <>{children}</>;
}
