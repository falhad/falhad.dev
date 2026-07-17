"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import gsap from "gsap"
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
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

export default function Hero() {
  const rootRef = useRef<HTMLElement | null>(null)
  const [enable3D, setEnable3D] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    setReduced(prefersReduced)
    setEnable3D(hasWebGL())
  }, [])

  useEffect(() => {
    if (!rootRef.current) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.9 } })
      tl.from(".hero-badge", { y: 16, opacity: 0 })
        .from(".hero-title", { y: 24, opacity: 0 }, "-=0.5")
        .from(".hero-subtitle", { y: 18, opacity: 0 }, "-=0.6")
        .from(".hero-desc", { y: 18, opacity: 0 }, "-=0.6")
        .from(".hero-cta", { y: 22, opacity: 0 }, "-=0.6")
        .from(".hero-cue", { opacity: 0 }, "-=0.3")
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={rootRef}
      className="relative min-h-[100svh] overflow-hidden bg-[#05010f] text-white"
    >
      {/* 3D interactive background (or a static gradient fallback) */}
      <div className="absolute inset-0">
        {enable3D ? (
          <HeroCanvas reducedMotion={reduced} />
        ) : (
          <div className="absolute inset-0">
            <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-fuchsia-500/30 blur-3xl" />
            <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-cyan-500/30 blur-3xl" />
          </div>
        )}
      </div>

      {/* Readability veil so text pops over the scene */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(5,1,15,0.75)_100%)]"
      />

      {/* Overlay content — pointer-events off so nodes stay clickable, re-enabled per element */}
      <div className="pointer-events-none relative z-10 flex min-h-[100svh] flex-col justify-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl text-center md:text-left">
            <div className="hero-badge pointer-events-auto inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/20 backdrop-blur">
              <Sparkles className="h-4 w-4 text-yellow-300" />
              <span className="text-xs uppercase tracking-wider text-white/80">Hello, I’m</span>
            </div>

            <h1 className="hero-title mt-4 text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-r from-fuchsia-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                {profile.name}
              </span>
            </h1>
            <p className="hero-subtitle mt-3 text-lg text-white/80 sm:text-xl">{profile.title}</p>
            <p className="hero-desc mt-5 max-w-xl text-balance text-white/70 sm:text-lg">
              {profile.tagline}
            </p>

            <div className="hero-cta pointer-events-auto mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center md:justify-start">
              <Button
                asChild
                size="lg"
                className="rounded-xl px-6 py-6 text-base shadow-lg shadow-fuchsia-500/20 bg-gradient-to-r from-fuchsia-600 to-cyan-600 hover:from-fuchsia-500 hover:to-cyan-500"
              >
                <a href={`mailto:${profile.email}?subject=Hello%20Farhad`} aria-label="Contact Farhad via email">
                  Contact me
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-xl border-white/20 bg-white/5 px-6 py-6 text-base text-white hover:bg-white/10"
              >
                <a href="#experience">Explore my work</a>
              </Button>
            </div>

            {enable3D && (
              <p className="mt-6 text-xs text-white/40">
                Tip: move your mouse, and click a glowing node to explore a project.
              </p>
            )}
          </div>
        </div>

        <a
          href="#summary"
          aria-label="Scroll to content"
          className="hero-cue pointer-events-auto absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 transition hover:text-white"
        >
          <ChevronDown className="h-6 w-6 animate-bounce" />
        </a>
      </div>
    </section>
  )
}
