import type { MetadataRoute } from "next"
import { profile } from "@/lib/portfolio-data"

// Compiles to /sitemap.xml. Single-page site, so one canonical entry.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: profile.website,
      changeFrequency: "monthly",
      priority: 1,
    },
  ]
}
