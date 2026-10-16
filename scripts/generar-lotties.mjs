// Builds playable Lottie files for the DomusCol isotype.
//
// The brand kit's Lottie files (design/marca/lottie-originales) only carry
// the layer timing: their four shape layers have no shapes, so players show
// nothing. This script keeps their structure (512×512, 60 fps, the four named
// layers and their entrance order) and adds the isotype's geometry, colours
// and easing, with the motion each preset's name describes.
//
//   node scripts/generar-lotties.mjs
//
// Writes the six presets, playable, to design/marca/lottie (for the brand
// team) and the ones the site uses to public/lottie.
//
// The main tower and the horizon line are named "*-ink": the player recolours
// them (espresso on light grounds, white on dark ones).

import fs from "node:fs";
import path from "node:path";

const KIT = path.resolve("design/marca/lottie-originales");
const OUT_KIT = path.resolve("design/marca/lottie");
const OUT_SITE = path.resolve("public/lottie");
// Presets the site plays (see BrandLottie usages).
const SITE_PRESETS = new Set(["elastic-spring", "stroke-draw", "liquid-pulse"]);

const ESPRESSO = [0.0941, 0.0784, 0.0706, 1];
const TERRACOTA = [0.8784, 0.4275, 0.2667, 1];

// Isotype geometry (kit coordinates, artwork spans x 18–142, y 5–146)
const rect = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
const GEOMETRY = {
  core: { paths: [[[28, 31], [76, 5], [76, 13], [28, 39]]], color: TERRACOTA, ink: false },
  structure: {
    paths: [[[28, 43], [76, 17], [76, 130], [28, 130]], rect(44, 50, 60, 66), rect(44, 76, 60, 92), rect(44, 102, 60, 118)],
    color: ESPRESSO,
    ink: true,
  },
  roof: { paths: [[[86, 45], [132, 70], [132, 130], [86, 130]], rect(102, 74, 116, 90), rect(102, 98, 116, 114)], color: TERRACOTA, ink: false },
  keystone: { rounded: { center: [80, 142], size: [124, 8], radius: 4 }, color: ESPRESSO, ink: true },
};

// The artwork is centred on the 512 canvas at 2.6×.
const ART_CENTER = [80, 75.5];
const BASE = 260;
const CENTER = [256, 256];

const EASE_OUT = { o: { x: [0.33], y: [1] }, i: { x: [0.68], y: [1] } };
const EASE_IN_OUT = { o: { x: [0.65], y: [0] }, i: { x: [0.35], y: [1] } };

/** Animated property from [frame, value] pairs (value: number or array). */
function anim(points, ease = EASE_OUT) {
  points = points.filter(([t], i) => i === 0 || t !== points[i - 1][0]);
  const k = points.map(([t, v], i) => {
    const s = Array.isArray(v) ? v : [v];
    if (i === points.length - 1) return { t, s };
    const dims = s.length;
    const spread = (o) => ({ x: Array(dims).fill(o.x[0]), y: Array(dims).fill(o.y[0]) });
    return { t, s, o: spread(ease.o), i: spread(ease.i) };
  });
  return { a: 1, k };
}
const still = (v) => ({ a: 0, k: v });

/** Position keyframes also need spatial tangents. */
function animPosition(points, ease = EASE_OUT) {
  const prop = anim(points, ease);
  prop.k = prop.k.map((key, i) => (i === prop.k.length - 1 ? key : { ...key, o: { x: ease.o.x[0], y: ease.o.y[0] }, i: { x: ease.i.x[0], y: ease.i.y[0] }, to: [0, 0, 0], ti: [0, 0, 0] }));
  return prop;
}

function shapes(part) {
  const g = GEOMETRY[part];
  if (g.rounded) {
    return [{ ty: "rc", nm: "forma", d: 1, p: still(g.rounded.center), s: still(g.rounded.size), r: still(g.rounded.radius) }];
  }
  return g.paths.map((v, i) => ({
    ty: "sh",
    nm: `trazo ${i + 1}`,
    ks: still({ c: true, v, i: v.map(() => [0, 0]), o: v.map(() => [0, 0]) }),
  }));
}

const groupTransform = () => ({
  ty: "tr",
  p: still([0, 0]),
  a: still([0, 0]),
  s: still([100, 100]),
  r: still(0),
  o: still(100),
  sk: still(0),
  sa: still(0),
});

const inkName = (part, name) => (GEOMETRY[part].ink ? `${name}-ink` : name);

function fillGroup(part, opacity = still(100)) {
  return {
    ty: "gr",
    nm: inkName(part, "relleno"),
    it: [...shapes(part), { ty: "fl", nm: inkName(part, "color"), c: still(GEOMETRY[part].color), o: opacity, r: 2 }, groupTransform()],
  };
}

function strokeGroup(part, [from, to]) {
  return {
    ty: "gr",
    nm: inkName(part, "plano"),
    it: [
      ...shapes(part),
      { ty: "tm", nm: "trazado", s: still(0), e: anim([[from, 0], [to, 100]], EASE_IN_OUT), o: still(0), m: 1 },
      { ty: "st", nm: inkName(part, "linea"), c: still(GEOMETRY[part].color), o: still(100), w: still(2), lc: 2, lj: 2 },
      groupTransform(),
    ],
  };
}

const LAYER_NAMES = {
  keystone: "04_Horizon_Plinth_Keystone",
  roof: "03_Right_Tower_Terracotta",
  structure: "02_Left_Tower_Espresso",
  core: "01_Upper_Cornice_Crest",
};
// Lottie paints the first layer on top: same order as the kit.
const ORDER = ["keystone", "roof", "structure", "core"];

function layer(part, ind, ks, content, op) {
  return {
    ddd: 0,
    ind,
    ty: 4,
    nm: LAYER_NAMES[part],
    sr: 1,
    ks: {
      o: ks.o ?? still(100),
      r: ks.r ?? still(0),
      p: ks.p ?? still([...CENTER, 0]),
      a: ks.a ?? still([...ART_CENTER, 0]),
      s: ks.s ?? still([BASE, BASE, 100]),
    },
    ao: 0,
    shapes: content,
    ip: 0,
    op,
    st: 0,
    bm: 0,
  };
}

const y = (dy) => [CENTER[0], CENTER[1] + dy, 0];
const sc = (x, yy = 100) => [(BASE * x) / 100, (BASE * yy) / 100, 100];

// Each preset returns { op, layers } for the four parts.
const PRESETS = {
  // Pieces drop and rise into place with a spring overshoot.
  "elastic-spring": () => {
    const op = 150;
    const spring = {
      core: { o: anim([[0, 0], [20, 100]]), p: animPosition([[0, y(-56)], [26, y(6)], [34, y(-3)], [40, y(0)]]) },
      structure: { o: anim([[18, 0], [40, 100]]), p: animPosition([[18, y(60)], [44, y(-6)], [52, y(2)], [58, y(0)]]) },
      roof: { o: anim([[40, 0], [60, 100]]), p: animPosition([[40, y(56)], [66, y(-5)], [74, y(2)], [80, y(0)]]) },
      keystone: { o: anim([[65, 0], [80, 100]]), s: anim([[65, sc(0)], [90, sc(108)], [98, sc(97)], [105, sc(100)]]) },
    };
    return { op, layers: ORDER.map((part, i) => layer(part, i + 1, spring[part], [fillGroup(part)], op)) };
  },

  // The outline is drawn like a plan, then the colour fills in.
  "stroke-draw": () => {
    const op = 150;
    const draw = { core: [0, 30], structure: [12, 58], roof: [32, 74], keystone: [54, 84] };
    const fill = (part) => anim([[draw[part][1] + 6, 0], [draw[part][1] + 34, 100]]);
    return {
      op,
      layers: ORDER.map((part, i) => layer(part, i + 1, {}, [strokeGroup(part, draw[part]), fillGroup(part, fill(part))], op)),
    };
  },

  // Each piece flips in around its vertical axis.
  "iso-3d-flip": () => {
    const op = 150;
    const at = { core: 0, structure: 16, roof: 34, keystone: 52 };
    return {
      op,
      layers: ORDER.map((part, i) => {
        const t = at[part];
        return layer(part, i + 1, { o: anim([[t, 0], [t + 10, 100]]), s: anim([[t, sc(-100)], [t + 30, sc(100)]], EASE_IN_OUT) }, [fillGroup(part)], op);
      }),
    };
  },

  // The pieces spiral in from the centre.
  "orbital-vortex": () => {
    const op = 150;
    const at = { core: 0, structure: 14, roof: 28, keystone: 42 };
    return {
      op,
      layers: ORDER.map((part, i) => {
        const t = at[part];
        return layer(
          part,
          i + 1,
          { o: anim([[t, 0], [t + 16, 100]]), r: anim([[t, -140], [t + 46, 0]]), s: anim([[t, sc(30, 30)], [t + 46, sc(100, 100)]]) },
          [fillGroup(part)],
          op,
        );
      }),
    };
  },

  // Seamless loop: the pieces breathe one after another (a loader).
  "liquid-pulse": () => {
    const op = 120;
    const phase = { core: 0, structure: 10, roof: 20, keystone: 30 };
    return {
      op,
      layers: ORDER.map((part, i) => {
        const t = phase[part];
        const ks =
          part === "keystone"
            ? { s: anim([[0, sc(100)], [t, sc(100)], [t + 30, sc(86)], [t + 60, sc(100)], [op, sc(100)]], EASE_IN_OUT) }
            : { p: animPosition([[0, y(0)], [t, y(0)], [t + 30, y(-12)], [t + 60, y(0)], [op, y(0)]], EASE_IN_OUT) };
        return layer(part, i + 1, ks, [fillGroup(part)], op);
      }),
    };
  },

  // Each piece opens from its base, like a shutter.
  "cinematic-shutter": () => {
    const op = 150;
    const at = { keystone: 0, structure: 14, roof: 30, core: 48 };
    const base = [80, 146, 0];
    const basePos = [CENTER[0], CENTER[1] + (146 - ART_CENTER[1]) * (BASE / 100), 0];
    return {
      op,
      layers: ORDER.map((part, i) => {
        const t = at[part];
        return layer(
          part,
          i + 1,
          { a: still(base), p: still(basePos), o: anim([[t, 0], [t + 8, 100]]), s: anim([[t, sc(100, 0)], [t + 34, sc(100, 100)]], EASE_IN_OUT) },
          [fillGroup(part)],
          op,
        );
      }),
    };
  },
};

const SOURCES = {
  "elastic-spring": "27-lottie-01-elastic-spring.json",
  "stroke-draw": "28-lottie-02-blueprint-stroke-draw.json",
  "iso-3d-flip": "29-lottie-03-isometric-3d-flip.json",
  "orbital-vortex": "30-lottie-04-orbital-vortex.json",
  "liquid-pulse": "31-lottie-05-liquid-pulse.json",
  "cinematic-shutter": "32-lottie-06-cinematic-shutter.json",
};

fs.mkdirSync(OUT_KIT, { recursive: true });
fs.mkdirSync(OUT_SITE, { recursive: true });
for (const [preset, build] of Object.entries(PRESETS)) {
  const source = path.join(KIT, SOURCES[preset]);
  const kit = fs.existsSync(source) ? JSON.parse(fs.readFileSync(source, "utf8")) : {};
  const { op, layers } = build();
  const animation = {
    v: kit.v ?? "5.9.6",
    fr: kit.fr ?? 60,
    ip: 0,
    op,
    w: kit.w ?? 512,
    h: kit.h ?? 512,
    nm: kit.nm ?? `DomusCol_TorresHorizontales_${preset}`,
    ddd: 0,
    assets: [],
    layers,
    markers: [],
    meta: { ...(kit.meta ?? {}), generator: "scripts/generar-lotties.mjs" },
  };
  const json = JSON.stringify(animation);
  const targets = [OUT_KIT, ...(SITE_PRESETS.has(preset) ? [OUT_SITE] : [])];
  for (const dir of targets) {
    const file = path.join(dir, `${preset}.json`);
    fs.writeFileSync(file, json);
    console.log(`${path.relative(process.cwd(), file)}  ${(json.length / 1024).toFixed(1)} KB`);
  }
}
