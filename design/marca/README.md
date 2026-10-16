# Kit de marca DomusCol: "Torres Horizontales"

Fuente original de la identidad. Nada de esta carpeta se publica en el sitio:
lo que el sitio sirve vive en `public/` y se genera o se dibuja a partir de aquí.

| Carpeta | Contenido | Uso en el sitio |
| --- | --- | --- |
| `logos/` | Horizontal, vertical, monocromo e inverso; versiones responsivas (01–06, 38–41) | El logo se dibuja en código: `src/components/brand/logo.tsx` |
| `iconos/` | Isotipos, ícono de app, avatar y favicon (07–13, 36–37) | `public/icon.svg` (12) y `public/icons/*.png` (rasterizados del 09) |
| `insignias/` | Insignias por rol (14–19) | Pestañas de Beneficios: `src/components/brand/role-badge.tsx` |
| `piezas/` | Sello de paz y salvo, banner para redes, patrón y manual (23–26) | `seal.tsx`, `src/app/opengraph-image.tsx` y el patrón de `page-hero.tsx` |
| `lottie-originales/` | Lottie tal como vinieron (27–32): solo traen tiempos, sin formas | Fuente de `scripts/generar-lotties.mjs` |
| `lottie/` | Los seis Lottie corregidos y reproducibles | Los que usa el sitio se copian a `public/lottie` |
| `design-tokens.json` | Colores, tipografía y semánticos del manual (33) | Variables de `src/app/globals.css` |
| `documentos/` | Membrete, firma, carnet, recibo, tarjeta, sticker y QR (20–22, 34–35, 42–44) | No se usa. Fuera de git: trae nombres, cédula y datos de contacto de ejemplo |

Para regenerar los Lottie: `node scripts/generar-lotties.mjs`.

Ojo: varias piezas del kit usan el dominio `domuscol.co`; el del sitio es `domuscol.me`.
