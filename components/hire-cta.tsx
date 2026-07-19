"use client"
import { useEffect, useState } from "react"

// Persistent, always-visible fast path for recruiters — a floating "Résumé"
// button that bypasses the 3D journey entirely. Fades in shortly after load so
// it doesn't fight the intro, and hides itself while the retro overlay is up.
export default function HireCta() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Only reveal once the retro intro is gone (or was already seen).
    const seen = (() => {
      try {
        return localStorage.getItem("farhad.intro.seen") === "1"
      } catch {
        return false
      }
    })()
    const t = setTimeout(() => setShow(true), seen ? 400 : 4200)
    return () => clearTimeout(t)
  }, [])

  return (
    <a
      href="/resume"
      aria-label="View résumé"
      className={`fixed right-3 top-3 z-[70] rounded-full border border-[var(--terracotta)]/60 bg-black/60 px-4 py-2 text-sm font-semibold text-[var(--terracotta)] backdrop-blur-sm transition-all duration-500 hover:bg-[var(--terracotta)] hover:text-white md:right-4 md:top-4 ${
        show ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
      }`}
    >
      📄 Résumé
    </a>
  )
}
