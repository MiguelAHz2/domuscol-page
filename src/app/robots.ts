import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Only the production deployment is indexed. Vercel preview deployments
// (VERCEL_ENV=preview) and local builds tell crawlers to stay out.
export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.VERCEL_ENV ? process.env.VERCEL_ENV === "production" : process.env.NODE_ENV === "production";

  if (!isProduction) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
