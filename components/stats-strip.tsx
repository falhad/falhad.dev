"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { stats } from "@/lib/portfolio-data"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// A thin band of headline numbers right under the hero — the first thing
// after the 3D scene, giving quick, scannable proof of experience.
export default function StatsStrip() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll("[data-stat]"), {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 90%" },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={ref} className="border-y border-border bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto grid grid-cols-2 gap-6 px-4 py-8 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} data-stat className="text-center">
            <div className="bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl">
              {s.value}
            </div>
            <div className="mt-1 text-xs uppercase tracking-widest text-foreground/60">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
