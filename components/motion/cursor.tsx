"use client"
import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { useReducedMotion } from "@/lib/use-reduced-motion"

// Custom cursor: a small cork dot that grows into a terracotta disc over any
// element carrying a `data-cursor` label. Disabled on touch and reduced-motion.
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState("")
  const [active, setActive] = useState(false)
  const [inDesktop, setInDesktop] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || window.matchMedia("(pointer: coarse)").matches) return
    const el = dot.current
    if (!el) return
    const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" })
    const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" })
    const move = (e: PointerEvent) => {
      xTo(e.clientX)
      yTo(e.clientY)
      // Inside the Mac desktop, hand back the native macOS cursor.
      const desk = (e.target as HTMLElement)?.closest("#desktop")
      setInDesktop(!!desk)
      const t = (e.target as HTMLElement)?.closest<HTMLElement>("[data-cursor]")
      setActive(!!t && !desk)
      setLabel(desk ? "" : t?.dataset.cursor || "")
    }
    window.addEventListener("pointermove", move)
    return () => window.removeEventListener("pointermove", move)
  }, [reduced])

  if (reduced) return null
  return (
    <div
      ref={dot}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full mix-blend-multiply transition-[width,height,opacity] duration-300 md:flex"
      style={{
        width: active ? 84 : 14,
        height: active ? 84 : 14,
        opacity: inDesktop ? 0 : 1,
        backgroundColor: active ? "var(--terracotta)" : "var(--cork)",
      }}
    >
      {active && label ? (
        <span className="text-[0.6rem] font-medium uppercase tracking-widest text-background">
          {label}
        </span>
      ) : null}
    </div>
  )
}
