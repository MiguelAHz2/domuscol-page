import { ImageResponse } from "next/og";

// iOS home-screen icon: the isotipo (two towers of windows, one lit) on navy.
// Edge runtime: @vercel/og's Node build fails to resolve its font path on Windows.
export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const WINDOWS: Array<[number, number]> = [
  [7, 6], [11.5, 6],
  [7, 10.5],
  [7, 15], [11.5, 15], [17, 15], [21.5, 15],
  [7, 19.5], [11.5, 19.5], [17, 19.5], [21.5, 19.5],
];
const SCALE = 180 / 32;

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#0D223F" }}>
        {WINDOWS.map(([x, y]) => (
          <div
            key={`${x}-${y}`}
            style={{
              position: "absolute",
              left: x * SCALE,
              top: y * SCALE,
              width: 3.5 * SCALE,
              height: 3.5 * SCALE,
              borderRadius: 4,
              background: "#FFFFFF",
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            left: 11.5 * SCALE,
            top: 10.5 * SCALE,
            width: 3.5 * SCALE,
            height: 3.5 * SCALE,
            borderRadius: 4,
            background: "#10B981",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 6 * SCALE,
            top: 24.5 * SCALE,
            width: 20 * SCALE,
            height: 1.5 * SCALE,
            borderRadius: 4,
            background: "rgba(255,255,255,0.5)",
          }}
        />
      </div>
    ),
    size,
  );
}
