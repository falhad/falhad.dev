"use client"
import { useEffect, useState } from "react"

const APPS = [
  { icon: "📝", label: "About", href: "#statement" },
  { icon: "🧭", label: "Work", href: "#work" },
  { icon: "🚀", label: "Skills", href: "#capabilities" },
  { icon: "⌘", label: "Journey", href: "#journey" },
  { icon: "📁", label: "Awards & CV", href: "#recognition" },
  { icon: "✉️", label: "Contact", href: "#contact" },
]

// macOS-style Dock — the desktop navigation. Fades in once you're past the hero.
export default function Dock() {
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 1.4)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      className={`fixed bottom-4 left-1/2 z-[90] -translate-x-1/2 transition-all duration-500 ${
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <div className="flex items-end gap-1.5 rounded-2xl border border-white/15 bg-white/[0.08] p-2 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl">
        {APPS.map((a) => (
          <a
            key={a.href}
            href={a.href}
            data-cursor={a.label.toLowerCase()}
            className="group relative flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.04] text-xl transition-transform duration-200 hover:-translate-y-1.5 hover:bg-white/10"
          >
            <span>{a.icon}</span>
            <span className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-md bg-black/80 px-2 py-1 text-[0.65rem] font-medium text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
              {a.label}
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
