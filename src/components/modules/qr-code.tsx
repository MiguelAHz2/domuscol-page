import { mulberry32 } from "@/lib/utils";

const SIZE = 21;

function isFinder(x: number, y: number) {
  const inBox = (bx: number, by: number) => x >= bx && x < bx + 7 && y >= by && y < by + 7;
  return inBox(0, 0) || inBox(SIZE - 7, 0) || inBox(0, SIZE - 7);
}

function finderPath(bx: number, by: number) {
  return `M${bx} ${by}h7v7h-7zM${bx + 1} ${by + 1}v5h5v-5zM${bx + 2} ${by + 2}h3v3h-3z`;
}

/** Decorative QR (not scannable): real finder patterns, seeded data modules. */
export function QrCode({ seed = 804, className }: { seed?: number; className?: string }) {
  const rand = mulberry32(seed);
  let data = "";
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (isFinder(x, y) || (x < 8 && y < 8) || (x > SIZE - 9 && y < 8) || (x < 8 && y > SIZE - 9)) continue;
      if (rand() < 0.48) data += `M${x} ${y}h1v1h-1z`;
    }
  }

  return (
    <svg viewBox={`-1 -1 ${SIZE + 2} ${SIZE + 2}`} aria-hidden className={className} shapeRendering="crispEdges">
      <rect x="-1" y="-1" width={SIZE + 2} height={SIZE + 2} fill="#fff" />
      <path
        fill="#0D223F"
        fillRule="evenodd"
        d={`${finderPath(0, 0)}${finderPath(SIZE - 7, 0)}${finderPath(0, SIZE - 7)}${data}`}
      />
    </svg>
  );
}
