"use client"
import dynamic from "next/dynamic"
import { useEffect, useRef } from "react"
import { profile } from "@/lib/portfolio-data"
import Magnetic from "@/components/motion/magnetic"

// three touches window at module load — never server-render it.
const Scene = dynamic(() => import("@/components/three/scene"), { ssr: false })

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  // Fade the overlay out as the camera pushes into the screen.
  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current
      const ov = overlayRef.current
      if (!el || !ov) return
      const r = el.getBoundingClientRect()
      const range = r.height - window.innerHeight
      const p = range > 0 ? Math.min(1, Math.max(0, -r.top / range)) : 0
      const t = Math.min(1, Math.max(0, (p - 0.55) / 0.22))
      ov.style.opacity = String(1 - t * t * (3 - 2 * t))
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    // Tall section so the scroll-scripted desk sequence has room to play while
    // the inner container stays pinned. Content flows normally after it.
    <section ref={sectionRef} id="hero" aria-label="Intro" className="relative h-[300vh]">
      <div
        className="sticky top-0 h-screen overflow-hidden"
        style={{ background: "radial-gradient(120% 100% at 50% 28%, #191512, #0c0906 72%)" }}
      >
        <Scene />

        <h1 className="sr-only">{profile.name}</h1>

        <div ref={overlayRef}>
          {/* Dark scrim so the overlay text grounds against the dim room. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[42vh]"
            style={{ background: "linear-gradient(to top, #0c0906 12%, rgba(12,9,6,0))" }}
          />

          {/* Minimal overlay — light-on-dark for the dim room. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-14 px-6 md:px-12">
            <div className="mx-auto max-w-6xl">
              <p className="mb-3 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-[#9a8f7d]">
                {profile.location} · 14 years
              </p>
              <p className="max-w-md text-lg leading-relaxed text-[#d8cfc2]">{profile.tagline}</p>
              <div className="pointer-events-auto mt-6">
                <Magnetic>
                  <a
                    href="#"
                    data-cursor="enter"
                    onClick={(e) => {
                      e.preventDefault()
                      const l = (window as unknown as { __lenis?: { scrollTo: (t: number, o?: object) => void } }).__lenis
                      const to = document.documentElement.scrollHeight
                      if (l) l.scrollTo(to, { duration: 2.4 })
                      else window.scrollTo({ top: to, behavior: "smooth" })
                    }}
                    className="inline-flex items-center gap-2 rounded-full bg-[#ece5d8] px-7 py-3 text-[#1a1512] transition-colors hover:bg-[var(--terracotta)] hover:text-white"
                  >
                    Enter workspace ↓
                  </a>
                </Magnetic>
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-pulse text-[0.7rem] font-medium uppercase tracking-[0.22em] text-[#9a8f7d]">
            scroll
          </div>
        </div>
      </div>
    </section>
  )
}
