import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "/", priority: 1 },
    { path: "/modulos", priority: 0.9 },
    { path: "/precios", priority: 0.9 },
    { path: "/beneficios", priority: 0.8 },
    { path: "/contacto", priority: 0.8 },
    { path: "/preguntas-frecuentes", priority: 0.7 },
  ];
  return pages.map(({ path, priority }) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority,
  }));
}
