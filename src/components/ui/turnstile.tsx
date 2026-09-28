"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { cn } from "@/lib/utils";

// Cloudflare Turnstile: a bot check that stays invisible for almost
// everyone (it only asks for a click when it has doubts). The script loads
// on first use, so it never weighs on the page load.

const SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

interface TurnstileApi {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<TurnstileApi> | null = null;

function loadTurnstile() {
  scriptPromise ??= new Promise<TurnstileApi>((resolve, reject) => {
    if (window.turnstile) return resolve(window.turnstile);
    const s = document.createElement("script");
    s.src = SCRIPT;
    s.async = true;
    s.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("Turnstile no cargó")));
    s.onerror = () => {
      scriptPromise = null;
      reject(new Error("Turnstile no cargó"));
    };
    document.head.appendChild(s);
  });
  return scriptPromise;
}

export interface TurnstileHandle {
  /** Resolves with a fresh token (waits for the check if it's still running). */
  getToken: () => Promise<string>;
  /** Tokens are single use: call after every submission. */
  reset: () => void;
}

export const Turnstile = forwardRef<TurnstileHandle, { siteKey: string; className?: string }>(function Turnstile(
  { siteKey, className },
  ref,
) {
  const box = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const token = useRef("");
  const waiting = useRef<Array<(t: string) => void>>([]);

  useEffect(() => {
    let cancelled = false;
    const theme = document.documentElement.classList.contains("dark") ? "dark" : "light";
    loadTurnstile()
      .then((api) => {
        if (cancelled || !box.current) return;
        widget.current = api.render(box.current, {
          sitekey: siteKey,
          theme,
          language: "es",
          appearance: "interaction-only",
          callback: (t: string) => {
            token.current = t;
            waiting.current.splice(0).forEach((resolve) => resolve(t));
          },
          "expired-callback": () => {
            token.current = "";
          },
          "error-callback": () => {
            token.current = "";
          },
        });
      })
      .catch(() => {
        // Without the script the server decides; the form still submits.
        waiting.current.splice(0).forEach((resolve) => resolve(""));
      });
    return () => {
      cancelled = true;
      if (widget.current) window.turnstile?.remove(widget.current);
      widget.current = null;
    };
  }, [siteKey]);

  useImperativeHandle(ref, () => ({
    getToken: () =>
      token.current
        ? Promise.resolve(token.current)
        : new Promise<string>((resolve) => {
            waiting.current.push(resolve);
            // Don't hold the form forever: after 12 s the server decides.
            setTimeout(() => resolve(token.current), 12000);
          }),
    reset: () => {
      token.current = "";
      if (widget.current) window.turnstile?.reset(widget.current);
    },
  }));

  return <div ref={box} className={cn("empty:hidden", className)} />;
});
