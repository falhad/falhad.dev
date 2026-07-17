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
      <div
        className="sticky top-0 h-screen overflow-hidden"
        style={{ background: "radial-gradient(120% 100% at 50% 28%, #191512, #0c0906 72%)" }}
      >
        <Scene />

        <h1 className="sr-only">{profile.name}</h1>

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
                  href="#work"
                  data-cursor="view work"
                  className="inline-flex items-center gap-2 rounded-full bg-[#ece5d8] px-7 py-3 text-[#1a1512] transition-colors hover:bg-[var(--terracotta)] hover:text-white"
                >
                  Selected work
                </a>
              </Magnetic>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-pulse text-[0.7rem] font-medium uppercase tracking-[0.22em] text-[#9a8f7d]">
          scroll
        </div>
      </div>
    </section>
  )
}
