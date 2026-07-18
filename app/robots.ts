import type { MetadataRoute } from "next"
import { profile } from "@/lib/portfolio-data"

// Compiles to /robots.txt. Allows all crawlers (incl. AI/LLM bots) and points
// them at the sitemap. We explicitly welcome LLM crawlers — see /llms.txt.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${profile.website}/sitemap.xml`,
    host: profile.website,
  }
}
