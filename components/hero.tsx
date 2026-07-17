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
        style={{ background: "radial-gradient(120% 100% at 50% 22%, #F1ECE3, #DED7CA 55%, #C7BFB1)" }}
      >
        <Scene />

        <h1 className="sr-only">{profile.name}</h1>

        {/* Soft light scrim so the overlay text stays legible over the desk. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[42vh]"
          style={{ background: "linear-gradient(to top, #E9E2D6 14%, rgba(233,226,214,0))" }}
        />

        {/* Minimal overlay — dark-on-light for the studio hero. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-14 px-6 md:px-12">
          <div className="mx-auto max-w-6xl">
            <p className="mb-3 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-[#6b6152]">
              {profile.location} · 14 years
            </p>
            <p className="max-w-md text-lg leading-relaxed text-[#38312a]">{profile.tagline}</p>
            <div className="pointer-events-auto mt-6">
              <Magnetic>
                <a
                  href="#work"
                  data-cursor="view work"
                  className="inline-flex items-center gap-2 rounded-full bg-[#201c18] px-7 py-3 text-[#f3ede3] transition-colors hover:bg-[var(--terracotta)]"
                >
                  Selected work
                </a>
              </Magnetic>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-pulse text-[0.7rem] font-medium uppercase tracking-[0.22em] text-[#6b6152]">
          scroll
        </div>
      </div>
    </section>
  )
}
