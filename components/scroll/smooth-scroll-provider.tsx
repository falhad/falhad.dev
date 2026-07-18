"use client"

import { useEffect } from "react"
import Lenis from "lenis"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useReducedMotion } from "@/lib/use-reduced-motion"

gsap.registerPlugin(ScrollTrigger)

// Wraps the app in Lenis smooth scrolling, tuned heavier for a weighty glide.
// Respects prefers-reduced-motion: when set, Lenis is disabled and native
// scroll is used. Anchor links (href="#id") are intercepted so the immersive
// corner menu can glide to sections.
export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return

    const lenis = new Lenis({
      lerp: 0.08, // heavier than default (0.1) for a weightier glide
      duration: 1.2,
      smoothWheel: true,
      wheelMultiplier: 0.9,
    })
    // Expose for programmatic scrolling if needed.
    ;(window as unknown as { __lenis?: Lenis }).__lenis = lenis

    // Drive Lenis from GSAP's ticker and keep ScrollTrigger in sync so
    // scroll-reveals fire against the smoothed scroll position.
    lenis.on("scroll", ScrollTrigger.update)
    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    // Keep anchor-link navigation working with Lenis.
    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!target) return
      const id = target.getAttribute("href")?.slice(1)
      const el = id ? document.getElementById(id) : null
      if (el) {
        e.preventDefault()
        lenis.scrollTo(el, { offset: 0 })
      }
    }
    document.addEventListener("click", onClick)

    return () => {
      gsap.ticker.remove(raf)
      document.removeEventListener("click", onClick)
      delete (window as unknown as { __lenis?: Lenis }).__lenis
      lenis.destroy()
    }
  }, [reduced])

  return <>{children}</>
}
