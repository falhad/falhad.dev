import type { Metadata } from "next"
import { Inter, Bricolage_Grotesque } from "next/font/google"
import "./globals.css"
import type React from "react"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display" })

export const metadata: Metadata = {
  title: "Farhad Navayazdan — Senior Software Developer",
  description:
    "Farhad Navayazdan — Senior Software Developer with 14+ years building real-time monitoring systems, blockchain, and AI platforms for the oil & gas sector and beyond.",
  generator: "Next.js",
  viewport: { width: "device-width", initialScale: 1 },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${display.variable} font-sans`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
