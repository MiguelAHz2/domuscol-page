import { ImageResponse } from "next/og";

// Share image for WhatsApp, LinkedIn and search: the facade of lit windows
// next to the name and promise, in the brand colours.
// Edge runtime: @vercel/og's Node build fails to resolve its font path on Windows.
export const runtime = "edge";
export const alt = "DomusCol, administración de propiedad horizontal en Colombia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Deterministic "al día" pattern for 3 towers x 8 floors x 4 units.
function windowState(i: number) {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  const r = x - Math.floor(x);
  return r < 0.1 ? "mora" : r < 0.28 ? "pendiente" : "al-dia";
}

const COLORS = { "al-dia": "#10B981", pendiente: "#1E3A5F", mora: "#D99A2B" } as const;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #0D223F 0%, #0A1B33 60%, #13305A 100%)",
          padding: "72px 80px",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 600 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ display: "flex", width: 56, height: 56, borderRadius: 14, background: "rgba(255,255,255,0.1)", alignItems: "center", justifyContent: "center" }}>
              <div style={{ display: "flex", width: 22, height: 22, borderRadius: 5, background: "#10B981" }} />
            </div>
            <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: -1 }}>DomusCol</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 58, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
              La transformación digital que tu conjunto residencial necesita
            </div>
            <div style={{ marginTop: 24, fontSize: 26, color: "rgba(255,255,255,0.72)" }}>
              Pagos en línea, portería y convivencia. Hecho para la Ley 675.
            </div>
          </div>
        </div>
        <div style={{ display: "flex", marginLeft: "auto", alignItems: "flex-end", gap: 18 }}>
          {[0, 1, 2].map((t) => (
            <div
              key={t}
              style={{ display: "flex", flexWrap: "wrap", width: 132, gap: 6, padding: 10, borderRadius: "10px 10px 0 0", background: "#16305A" }}
            >
              {Array.from({ length: 32 }, (_, i) => (
                <div key={i} style={{ width: 22, height: 26, borderRadius: 4, background: COLORS[windowState(t * 32 + i)] }} />
              ))}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
