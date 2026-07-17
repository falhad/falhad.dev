"use client"
import dynamic from "next/dynamic"
import { profile } from "@/lib/portfolio-data"
import Magnetic from "@/components/motion/magnetic"

// three touches window at module load — never server-render it.
const Scene = dynamic(() => import("@/components/three/scene"), { ssr: false })

export default function Hero() {
  return (
    // Tall section so the scroll-scripted desk sequence has room to play while
    // the inner container stays pinned. Content flows normally after it.
    <section id="hero" aria-label="Intro" className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <Scene />

        <h1 className="sr-only">{profile.name}</h1>

        {/* Minimal overlay — the name lives on the laptop screen. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-14 px-6 md:px-12">
          <div className="mx-auto max-w-6xl">
            <p className="section-label mb-3">{profile.location} · 14 years</p>
            <p className="max-w-md text-lg leading-relaxed text-muted-foreground">{profile.tagline}</p>
            <div className="pointer-events-auto mt-6">
              <Magnetic>
                <a
                  href="#work"
                  data-cursor="view work"
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3 text-background transition-colors hover:bg-[var(--terracotta)]"
                >
                  Selected work
                </a>
              </Magnetic>
            </div>
          </div>
        </div>

        <div className="section-label absolute bottom-6 left-1/2 -translate-x-1/2 animate-pulse">scroll</div>
      </div>
    </section>
  )
}
