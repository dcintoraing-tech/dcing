import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // El panel y las cotizaciones por token no son contenido público.
      disallow: ["/admin", "/cotizacion"],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
