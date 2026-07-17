"use client"
import dynamic from "next/dynamic"
import { profile } from "@/lib/portfolio-data"
import Magnetic from "@/components/motion/magnetic"

// three.js touches `window` at module load — never server-render it.
const HeroSculpture = dynamic(() => import("@/components/three/hero-sculpture"), { ssr: false })

export default function Hero() {
  return (
    <section
      id="hero"
      aria-label="Intro"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 md:px-12"
    >
      <HeroSculpture />
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <p className="section-label mb-6">{profile.location} · 14 years</p>
        <h1 className="font-display text-[clamp(3rem,11vw,10rem)] font-semibold leading-[0.92] tracking-tight text-foreground">
          {profile.name}
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-2xl">
          {profile.tagline}
        </p>
        <div className="mt-10">
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
      <div className="section-label absolute bottom-8 left-1/2 -translate-x-1/2 animate-pulse">scroll</div>
    </section>
  )
}
