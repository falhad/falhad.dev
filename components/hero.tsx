'use client'

import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Hero() {
  const rootRef = useRef<HTMLElement | null>(null)

  useLayoutEffect(() => {
    if (!rootRef.current) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.8 } })

      tl.from(".hero-badge", { y: 16, opacity: 0 })
        .from(".hero-title", { y: 20, opacity: 0 }, "-=0.4")
        .from(".hero-subtitle", { y: 18, opacity: 0 }, "-=0.5")
        .from(".hero-desc", { y: 18, opacity: 0 }, "-=0.55")
        .from(".hero-cta", { y: 22, opacity: 0 }, "-=0.55")
        .from(".hero-card", { y: 30, opacity: 0, scale: 0.98 }, "-=0.6")

      // Load UnicornStudio script and initialize (from provided snippet)
      if (typeof window !== 'undefined') {
        const w = window as any
        if (!w.UnicornStudio) {
          w.UnicornStudio = { isInitialized: false }
          const s = document.createElement('script')
          s.src = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js'
          s.onload = function () {
            if (!w.UnicornStudio.isInitialized && typeof w.UnicornStudio.init === 'function') {
              w.UnicornStudio.init()
              w.UnicornStudio.isInitialized = true
            }
          }
          ;(document.head || document.body).appendChild(s)
        } else if (!w.UnicornStudio.isInitialized && typeof w.UnicornStudio.init === 'function') {
          w.UnicornStudio.init()
          w.UnicornStudio.isInitialized = true
        }
      }
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className="relative min-h-[100svh] overflow-hidden text-foreground">
      {/* Unicorn full-bleed background (UnicornStudio embed) */}
      <div className="absolute inset-0 unicorn">
        <div
          className="absolute inset-0 w-full h-full"
          data-us-project="CaA4koIwYXW3451puluq"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Ambient gradient glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-72 w-72 rounded-full bg-fuchsia-500/30 blur-3xl animate-blob" />
        <div className="absolute -bottom-40 -right-40 h-72 w-72 rounded-full bg-cyan-500/30 blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.06),transparent_40%),radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.06),transparent_45%)]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 md:py-16">
        <div className="text-center md:text-left">
          <div className="hero-badge inline-flex items-center gap-2 rounded-full bg-foreground/10 px-3 py-1 ring-1 ring-foreground/20 backdrop-blur">
            <Sparkles className="h-4 w-4 text-yellow-300" />
            <span className="text-xs uppercase tracking-wider text-foreground/80">Hello, I’m</span>
          </div>

          <h1 className="hero-title mt-4 text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-fuchsia-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Farhad Navayazdan
            </span>
          </h1>
          <p className="hero-subtitle mt-3 max-w-xl text-lg text-foreground/80 sm:text-xl md:mt-4 md:leading-relaxed">
            Senior Software Developer
          </p>
          <p className="hero-desc mt-5 max-w-xl text-balance text-foreground/70 sm:text-lg md:mt-6">
            I build fast, delightful web experiences — from design systems to complex applications.
          </p>

          <div className="hero-cta mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center md:justify-start">
            <Button
              asChild
              size="lg"
              className="rounded-xl px-6 py-6 text-base shadow-lg shadow-fuchsia-500/20 bg-gradient-to-r from-fuchsia-600 to-cyan-600 hover:from-fuchsia-500 hover:to-cyan-500 hover:shadow-fuchsia-500/30 focus-visible:ring-offset-0"
            >
              <a
                href="mailto:cs.arcxx@gmail.com?subject=Hello%20Farhad&body=Hi%20Farhad%2C%0A%0A"
                aria-label="Contact Farhad via email"
              >
                Contact me
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
