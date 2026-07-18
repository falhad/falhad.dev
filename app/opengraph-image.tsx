import { ImageResponse } from "next/og"
import { profile } from "@/lib/portfolio-data"

// Auto-generated social preview card (og:image + twitter:image). Next serves
// this at /opengraph-image and wires the meta tags automatically.
export const alt = "Farhad Navayazdan — Senior Software Developer"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "radial-gradient(120% 100% at 50% 20%, #191512, #0c0906 72%)",
          color: "#f5efe6",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, letterSpacing: 2, color: "#C29B6B", textTransform: "uppercase" }}>
          falhad.dev
        </div>
        <div style={{ display: "flex", fontSize: 92, fontWeight: 800, marginTop: 24, lineHeight: 1.05 }}>
          {profile.name}
        </div>
        <div style={{ display: "flex", fontSize: 44, color: "#b7ab97", marginTop: 20 }}>
          {profile.title}
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#8a8172", marginTop: 40, maxWidth: 900 }}>
          14+ years · AI/LLM · Rust · Next.js · Blockchain · Oil &amp; Gas systems
        </div>
      </div>
    ),
    { ...size },
  )
}
