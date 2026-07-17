"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

type Props = {
  children: React.ReactNode
  className?: string
  /** Delay in seconds before the reveal starts. */
  delay?: number
  /** Vertical travel distance in px. */
  y?: number
}

// Scroll-reveal wrapper: fades + slides its children up when scrolled into view.
// Honors prefers-reduced-motion by rendering the content immediately, no animation.
export default function Reveal({ children, className, delay = 0, y = 28 }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const ctx = gsap.context(() => {
      gsap.from(el, {
        opacity: 0,
        y,
        duration: 0.8,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      })
    }, ref)

    return () => ctx.revert()
  }, [delay, y])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
