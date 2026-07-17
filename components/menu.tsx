"use client"
import { useEffect, useState } from "react"
import Magnetic from "@/components/motion/magnetic"

const ITEMS = [
  { href: "#work", label: "Work" },
  { href: "#capabilities", label: "Capabilities" },
  { href: "#journey", label: "Journey" },
  { href: "#contact", label: "Contact" },
]

// Immersive navigation: a corner toggle opening a full-screen warm overlay.
export default function Menu() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])
  return (
    <>
      <div className="fixed right-5 top-5 z-[90]">
        <Magnetic>
          <button
            onClick={() => setOpen((o) => !o)}
            data-cursor={open ? "close" : "menu"}
            aria-label={open ? "Close menu" : "Open menu"}
            className="rounded-full border border-border bg-background/80 px-5 py-2 text-sm font-medium text-foreground backdrop-blur transition-colors hover:border-[var(--cork)]"
          >
            {open ? "Close" : "Menu"}
          </button>
        </Magnetic>
      </div>
      <div
        className={`fixed inset-0 z-[80] flex flex-col items-center justify-center gap-2 bg-background/95 backdrop-blur-md transition-opacity duration-500 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {ITEMS.map((it) => (
          <a
            key={it.href}
            href={it.href}
            onClick={() => setOpen(false)}
            data-cursor="go"
            className="font-display text-5xl font-semibold tracking-tight text-foreground transition-colors hover:text-[var(--terracotta)] md:text-7xl"
          >
            {it.label}
          </a>
        ))}
      </div>
    </>
  )
}
