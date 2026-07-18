"use client"
import { cloneElement, useRef } from "react"
import { gsap } from "gsap"
import { useReducedMotion } from "@/lib/use-reduced-motion"

// Pulls a single child toward the pointer on hover, springing back on leave.
// No-ops under reduced-motion. The child must forward a ref to a DOM element.
export default function Magnetic({
  children,
  strength = 0.4,
}: {
  children: React.ReactElement
  strength?: number
}) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  const onMove = (e: React.PointerEvent) => {
    if (reduced || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - (r.left + r.width / 2)) * strength
    const y = (e.clientY - (r.top + r.height / 2)) * strength
    gsap.to(ref.current, { x, y, duration: 0.4, ease: "power3.out" })
  }
  const reset = () => {
    if (ref.current) gsap.to(ref.current, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1,0.4)" })
  }

  return cloneElement(children, {
    ref,
    onPointerMove: onMove,
    onPointerLeave: reset,
  } as React.HTMLAttributes<HTMLElement> & { ref: React.Ref<HTMLElement> })
}
