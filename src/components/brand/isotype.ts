// Isotipo "Torres Horizontales", from the brand kit (domuscol-torres-horizontales).
// Four layers, as in the manual: the cornice (core-c) and the right tower
// (roof) in terracota; the main tower (structure-d) and the horizon line
// (keystone) in espresso on light grounds, white on dark ones.
// Coordinates are the kit's own (artwork spans x 18–142, y 5–146).

export const ISOTYPE = {
  core: "M28 31 L76 5 L76 13 L28 39 Z",
  structure: "M28 43 L76 17 V130 H28 V43 Z M44 50 V66 H60 V50 H44 Z M44 76 V92 H60 V76 H44 Z M44 102 V118 H60 V102 H44 Z",
  roof: "M86 45 L132 70 V130 H86 V45 Z M102 74 V90 H116 V74 H102 Z M102 98 V114 H116 V98 H102 Z",
  keystone: "M22 138 H138 A4 4 0 0 1 142 142 A4 4 0 0 1 138 146 H22 A4 4 0 0 1 18 142 A4 4 0 0 1 22 138 Z",
} as const;

/** viewBox that frames the artwork with a hair of breathing room. */
export const ISOTYPE_VIEWBOX = "16 3 128 145";

export const BRAND = {
  espresso: "#181412",
  terracota: "#E06D44",
  cobre: "#F4A27E",
  caliza: "#F6F2EE",
  white: "#FFFFFF",
} as const;

/** The four layers as SVG markup, for data URIs and generated images. */
export function isotypeMarkup(structure: string, accent: string = BRAND.terracota) {
  return (
    `<path fill="${accent}" d="${ISOTYPE.core}"/>` +
    `<path fill="${structure}" fill-rule="evenodd" d="${ISOTYPE.structure}"/>` +
    `<path fill="${accent}" fill-rule="evenodd" d="${ISOTYPE.roof}"/>` +
    `<path fill="${structure}" d="${ISOTYPE.keystone}"/>`
  );
}

/** App icon (kit asset 09): the isotype on an espresso tile with a terracota rim. */
export function appIconSvg(size = 512) {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 160 160">` +
    `<rect width="160" height="160" rx="36" fill="${BRAND.espresso}"/>` +
    `<rect x="3" y="3" width="154" height="154" rx="33" fill="none" stroke="${BRAND.terracota}" stroke-opacity="0.28" stroke-width="1.5"/>` +
    `<g transform="translate(8 8) scale(0.9)">${isotypeMarkup(BRAND.white)}</g>` +
    `</svg>`
  );
}

/**
 * Architectural pattern (kit asset 25) as a repeating tile: the isotype in a
 * staggered grid. Returns a CSS url() for background-image.
 */
export function patternTile(structure: string, opacity: number) {
  const mark = (x: number, y: number) =>
    `<g transform="translate(${x} ${y}) scale(0.65)" opacity="${opacity}">${isotypeMarkup(structure)}</g>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="190" height="350">${mark(40, 30)}${mark(85, 205)}</svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}
