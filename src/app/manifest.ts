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
    background_color: "#0D223F",
    theme_color: "#0D223F",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/apple-icon", type: "image/png", sizes: "180x180" },
    ],
  };
}
