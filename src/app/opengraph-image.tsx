import { ImageResponse } from "next/og";
import { BRAND, isotypeMarkup } from "@/components/brand/isotype";
import { site } from "@/lib/site";

// Share image for WhatsApp, LinkedIn and search: the brand kit's social cover
// (asset 24), with the site's real domain.
// Edge runtime: @vercel/og's Node build fails to resolve its font path on Windows.
export const runtime = "edge";
export const alt = "DomusCol, administración de propiedad horizontal en Colombia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const isotype = `data:image/svg+xml;base64,${btoa(
  `<svg xmlns="http://www.w3.org/2000/svg" width="260" height="290" viewBox="16 3 128 145">${isotypeMarkup(BRAND.white)}</svg>`,
)}`;

// The site's typeface, so the wordmark keeps its ExtraBold "Domus".
const font = (url: URL) => fetch(url).then((r) => r.arrayBuffer());

export default async function OpengraphImage() {
  const domain = new URL(site.url).hostname.toUpperCase();
  const [medium, bold, extraBold] = await Promise.all([
    font(new URL("../../node_modules/@fontsource/plus-jakarta-sans/files/plus-jakarta-sans-latin-500-normal.woff", import.meta.url)),
    font(new URL("../../node_modules/@fontsource/plus-jakarta-sans/files/plus-jakarta-sans-latin-700-normal.woff", import.meta.url)),
    font(new URL("../../node_modules/@fontsource/plus-jakarta-sans/files/plus-jakarta-sans-latin-800-normal.woff", import.meta.url)),
  ]);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: BRAND.espresso,
          color: "white",
          fontFamily: "Jakarta",
          fontWeight: 500,
        }}
      >
        {/* Terracota halo behind the isotype */}
        <div
          style={{
            position: "absolute",
            left: 620,
            top: -45,
            width: 720,
            height: 720,
            borderRadius: 360,
            background: "rgba(224, 109, 68, 0.08)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 740,
            top: 75,
            width: 480,
            height: 480,
            borderRadius: 240,
            border: "1.5px dashed rgba(224, 109, 68, 0.22)",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", position: "absolute", left: 82, top: 96 }}>
          <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: 5, color: BRAND.terracota }}>
            PLATAFORMA SAAS · PROPIEDAD HORIZONTAL
          </div>
          <div style={{ display: "flex", marginTop: 18, fontSize: 88, fontWeight: 800, letterSpacing: -3, lineHeight: 1 }}>
            Domus<span style={{ color: BRAND.terracota, fontWeight: 500 }}>Col</span>
          </div>
          <div style={{ marginTop: 22, fontSize: 18, fontWeight: 700, letterSpacing: 8, color: "#C4B8B1" }}>
            SOLUCIONES INTEGRADAS
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 52, fontSize: 26, color: "#EDE6DF", lineHeight: 1.4 }}>
            <span>Administración inteligente de edificios, finanzas,</span>
            <span>asambleas, portería QR y comunidad residencial.</span>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 40,
              alignSelf: "flex-start",
              padding: "16px 28px",
              borderRadius: 12,
              background: BRAND.terracota,
              color: BRAND.espresso,
              fontSize: 16,
              fontWeight: 800,
              letterSpacing: 1.5,
            }}
          >
            {domain}
          </div>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={isotype} width={260} height={290} alt="" style={{ position: "absolute", left: 850, top: 170 }} />
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Jakarta", data: medium, weight: 500, style: "normal" },
        { name: "Jakarta", data: bold, weight: 700, style: "normal" },
        { name: "Jakarta", data: extraBold, weight: 800, style: "normal" },
      ],
    },
  );
}
