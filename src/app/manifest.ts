import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Web app manifest: name, colours and icons when someone adds the site to
// their phone's home screen.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name}, administración de propiedad horizontal`,
    short_name: site.name,
    description: site.description,
    lang: "es-CO",
    start_url: "/",
    display: "standalone",
    background_color: "#181412",
    theme_color: "#181412",
    // Brand kit app icon (asset 09) and a full-bleed maskable version for Android.
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/icons/icon-192.png", type: "image/png", sizes: "192x192" },
      { src: "/icons/icon-512.png", type: "image/png", sizes: "512x512" },
      { src: "/icons/icon-maskable-512.png", type: "image/png", sizes: "512x512", purpose: "maskable" },
    ],
  };
}
