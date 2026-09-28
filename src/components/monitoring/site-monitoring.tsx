"use client";

import { useEffect } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { loadSentry, monitoringEnabled } from "@/lib/monitoring";

// Cookie-free analytics and Core Web Vitals from Vercel (they only report
// on Vercel deployments), plus Sentry when a DSN is configured.
export function SiteMonitoring() {
  useEffect(() => {
    if (!monitoringEnabled) return;
    const start = () => void loadSentry();
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, { timeout: 5000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(start, 2500);
    return () => clearTimeout(id);
  }, []);

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
