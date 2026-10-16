import { ImageResponse } from "next/og";
import { appIconSvg } from "@/components/brand/isotype";

// iOS home-screen icon: the brand kit's app icon (asset 09, espresso tile).
// Edge runtime: @vercel/og's Node build fails to resolve its font path on Windows.
export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const src = `data:image/svg+xml;base64,${btoa(appIconSvg(180))}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#181412" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={180} height={180} alt="" />
      </div>
    ),
    size,
  );
}
