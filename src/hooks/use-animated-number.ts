"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/hooks/use-in-view";

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Tweens from the previous target to the new one whenever `target` changes.
 * `from` sets the starting value of the very first run.
 */
export function useAnimatedNumber(target: number, { duration = 900, from = target, enabled = true } = {}) {
  const [value, setValue] = useState(from);
  const current = useRef(from);

  useEffect(() => {
    if (!enabled) return;
    const start = current.current;
    if (start === target) return;
    if (prefersReducedMotion()) {
      current.current = target;
      setValue(target);
      return;
    }

    let frame = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const next = start + (target - start) * easeOutCubic(p);
      current.current = next;
      setValue(next);
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, enabled]);

  return value;
}
