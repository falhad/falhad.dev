"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { stats } from "@/lib/portfolio-data"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// A console status bar directly under the hero: a live indicator plus the
// headline numbers as a monospace readout strip.
export default function StatsStrip() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll("[data-stat]"), {
        opacity: 0,
        y: 16,
        stagger: 0.08,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 90%" },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={ref} className="border-y border-white/[0.06] bg-[#0b0718]/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 border-b border-white/[0.05] py-2">
          <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-signal text-signal" aria-hidden />
          <span className="eyebrow text-signal">system online</span>
          <span className="mono ml-auto text-[0.65rem] text-muted-foreground">MUSCAT · GMT+4</span>
        </div>
        <div className="grid grid-cols-2 divide-x divide-white/[0.05] sm:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label} data-stat className="px-4 py-6 first:pl-0">
              <div className="mono text-[0.65rem] text-muted-foreground">{String(i + 1).padStart(2, "0")}</div>
              <div className="mt-1 font-display text-3xl font-bold text-foreground sm:text-4xl">{s.value}</div>
              <div className="mono mt-1 text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
