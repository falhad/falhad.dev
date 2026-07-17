"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import gsap from "gsap"
import { ArrowUpRight, ChevronDown } from "lucide-react"
import { profile } from "@/lib/portfolio-data"

// three.js touches `window` at module load — never server-render it.
const HeroCanvas = dynamic(() => import("@/components/three/hero-canvas"), {
  ssr: false,
})

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas")
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    )
  } catch {
    return false
  }
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n))

function openConsole() {
  window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }))
}

export default function Hero() {
  const rootRef = useRef<HTMLElement | null>(null)
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const progressRef = useRef(0)
  const [enable3D, setEnable3D] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    setReduced(prefersReduced)
    setEnable3D(hasWebGL())
  }, [])

  // When the fly-through is enabled, the section is tall and pinned. We only
  // READ scroll position (never hijack the wheel), so Lenis keeps owning scroll.
  const enableScroll = enable3D && !reduced

  useEffect(() => {
    if (!enableScroll) {
      progressRef.current = 0
      return
    }
    let raf = 0
    const tick = () => {
      const el = rootRef.current
      if (el) {
        const rect = el.getBoundingClientRect()
        const total = rect.height - window.innerHeight
        const p = total > 0 ? clamp(-rect.top / total, 0, 1) : 0
        progressRef.current = p
        const overlay = overlayRef.current
        if (overlay) {
          overlay.style.opacity = String(1 - clamp(p / 0.14, 0, 1))
          overlay.style.transform = `translateY(${-p * 40}px)`
          overlay.style.display = p > 0.22 ? "none" : ""
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [enableScroll])

  useEffect(() => {
    if (!rootRef.current) return
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out", duration: 0.9 } })
        .from(".hero-plate", { y: 24, opacity: 0 })
        .from(".hero-cue", { opacity: 0 }, "-=0.4")
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={rootRef}
      className={`relative bg-[#05010f] text-white ${enableScroll ? "" : "min-h-[100svh]"}`}
      style={enableScroll ? { height: "300vh" } : undefined}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* 3D scene (or a static gradient fallback) */}
        <div className="absolute inset-0">
          {enable3D ? (
            <HeroCanvas reducedMotion={reduced} progressRef={enableScroll ? progressRef : undefined} />
          ) : (
            <div className="absolute inset-0">
              <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-fuchsia-500/30 blur-3xl" />
              <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-cyan-500/30 blur-3xl" />
            </div>
          )}
        </div>

        {/* Bottom vignette so the nameplate stays legible over the scene */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(5,1,15,0.9),transparent_42%)]"
        />

        {/* Overlay: a compact operator nameplate, not a billboard headline */}
        <div ref={overlayRef} className="pointer-events-none absolute inset-0 z-10">
          <div className="absolute inset-x-0 bottom-16">
            <div className="container mx-auto px-4">
              <div className="hero-plate pointer-events-auto relative inline-block max-w-md rounded-lg border border-white/10 bg-[#05010f]/45 p-5 backdrop-blur-md">
                {/* corner brackets */}
                <span aria-hidden className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l border-t border-plasma/50" />
                <span aria-hidden className="pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b border-r border-white/25" />

                <div className="flex items-center gap-2">
                  <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-plasma text-plasma" aria-hidden />
                  <span className="eyebrow text-plasma">// OPERATOR</span>
                </div>

                <h1 className="mt-2 font-display text-4xl font-bold leading-none tracking-tight text-white sm:text-5xl">
                  {profile.name}
                </h1>

                <div className="mono mt-3 text-[0.72rem] uppercase tracking-[0.18em] text-white/75">
                  Sr. Software Developer · 14 yrs · Muscat
                </div>
                <div className="mono mt-1 text-[0.65rem] uppercase tracking-[0.2em] text-white/40">
                  real-time systems · blockchain · AI
                </div>

                <div className="mono mt-4 flex flex-wrap items-center gap-2 text-[0.68rem] uppercase tracking-widest">
                  {enable3D && (
                    <button
                      onClick={openConsole}
                      className="inline-flex items-center gap-1.5 rounded border border-plasma/40 bg-plasma/10 px-2.5 py-1 text-plasma transition-colors hover:bg-plasma/20"
                    >
                      ⌘K operate
                    </button>
                  )}
                  <a
                    href={`mailto:${profile.email}?subject=Hello%20Farhad`}
                    className="inline-flex items-center gap-1 rounded border border-white/15 px-2.5 py-1 text-white/80 transition-colors hover:border-white/40 hover:text-white"
                  >
                    contact <ArrowUpRight className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <a
            href="#summary"
            aria-label="Scroll to content"
            className="hero-cue pointer-events-auto absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-white/45 transition hover:text-white"
          >
            <span className="mono text-[0.6rem] uppercase tracking-[0.3em]">
              {enableScroll ? "scroll to travel" : "scroll"}
            </span>
            <ChevronDown className="h-4 w-4 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  )
}
