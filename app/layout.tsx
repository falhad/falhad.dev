import type { Metadata, Viewport } from "next"
import { Inter, Bricolage_Grotesque } from "next/font/google"
import "./globals.css"
import type React from "react"
import { Toaster } from "@/components/ui/toaster"
import { profile, skills } from "@/lib/portfolio-data"
import { PersonJsonLd } from "@/components/seo/json-ld"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display" })

const SITE_URL = profile.website // https://falhad.dev
const DESCRIPTION =
  "Farhad Navayazdan is a Senior Software Developer and Software Engineer in Muscat, Oman, with 14+ years building AI/LLM and RAG systems, real-time monitoring platforms, blockchain, and full-stack web & mobile apps for oil & gas and beyond."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Farhad Navayazdan — Senior Software Developer in Muscat, Oman | AI, LLM & RAG",
    template: "%s — Farhad Navayazdan",
  },
  description: DESCRIPTION,
  applicationName: "falhad.dev",
  authors: [{ name: profile.name, url: SITE_URL }],
  creator: profile.name,
  publisher: profile.name,
  generator: "Next.js",
  keywords: [
    "Farhad Navayazdan",
    "falhad",
    // High-intent search phrases the site targets.
    "Software Developer Oman",
    "Software Developer Muscat",
    "Software Engineer Oman",
    "Software Engineer Muscat",
    "AI Software Developer",
    "AI Engineer Oman",
    "LLM Developer",
    "RAG Developer",
    "LLM RAG Software",
    "Software Developer",
    "Software Engineer",
    "Full Stack Developer",
    "Senior Software Developer",
    "Rust Developer",
    "Next.js Developer",
    "Kotlin Developer",
    "Blockchain Developer",
    "Oil & Gas software",
    "Muscat",
    "Oman",
    ...skills.flatMap((s) => s.items),
  ],
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "falhad.dev",
    title: "Farhad Navayazdan — Senior Software Developer in Muscat, Oman",
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Farhad Navayazdan — Senior Software Developer in Muscat, Oman",
    description: DESCRIPTION,
    creator: "@falhad",
  },
  category: "technology",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0c0906",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${display.variable} font-sans`}>
        <PersonJsonLd />
        {children}
        <Toaster />
      </body>
    </html>
  )
}
