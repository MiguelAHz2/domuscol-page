"use client";

import { useEffect } from "react";

// Displacement maps for the lens: red shifts x, green shifts y. Neutral
// (128) in the middle, pushed toward the edges so the backdrop bends at
// the rim of the glass, like a thick pane.
const edgeX =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" preserveAspectRatio="none"><defs><linearGradient id="g"><stop offset="0" stop-color="rgb(0,0,0)"/><stop offset=".14" stop-color="rgb(128,0,0)"/><stop offset=".86" stop-color="rgb(128,0,0)"/><stop offset="1" stop-color="rgb(255,0,0)"/></linearGradient></defs><rect width="100" height="100" fill="url(#g)"/></svg>`,
  );
const edgeY =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" preserveAspectRatio="none"><defs><linearGradient id="g" x2="0" y2="1"><stop offset="0" stop-color="rgb(0,0,0)"/><stop offset=".22" stop-color="rgb(0,128,0)"/><stop offset=".78" stop-color="rgb(0,128,0)"/><stop offset="1" stop-color="rgb(0,255,0)"/></linearGradient></defs><rect width="100" height="100" fill="url(#g)"/></svg>`,
  );

/**
 * Mounted once in the layout. Enables edge refraction (.glass-refract)
 * where the browser supports SVG backdrop filters.
 */
export function GlassEffects() {
  useEffect(() => {
    // backdrop-filter: url() renders only in Chromium; elsewhere it can
    // blank the backdrop, so opt in by engine rather than by @supports.
    const brands = (navigator as Navigator & { userAgentData?: { brands: { brand: string }[] } }).userAgentData?.brands;
    if (brands?.some((b) => b.brand === "Chromium")) document.documentElement.classList.add("lg-refract");
  }, []);

  return (
    <svg aria-hidden width="0" height="0" className="pointer-events-none absolute h-0 w-0 overflow-hidden">
      <filter id="lg-refract" x="0" y="0" width="1" height="1" colorInterpolationFilters="sRGB">
        <feImage href={edgeX} preserveAspectRatio="none" result="mx" />
        <feImage href={edgeY} preserveAspectRatio="none" result="my" />
        <feComposite in="mx" in2="my" operator="arithmetic" k2="1" k3="1" result="map" />
        <feDisplacementMap in="SourceGraphic" in2="map" scale="26" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
}
