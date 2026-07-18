"use client"
import { useEffect, useState } from "react"

// Deterministic drip layout (no Math.random) — varied x / width / delay / length.
const DRIPS = [
  { x: 6, w: 34, d: 0, dur: 820, len: 66 },
  { x: 15, w: 20, d: 260, dur: 700, len: 40 },
  { x: 24, w: 46, d: 90, dur: 900, len: 82 },
  { x: 36, w: 26, d: 380, dur: 760, len: 52 },
  { x: 45, w: 54, d: 40, dur: 980, len: 95 },
  { x: 57, w: 24, d: 300, dur: 720, len: 46 },
  { x: 65, w: 44, d: 150, dur: 880, len: 74 },
  { x: 76, w: 22, d: 420, dur: 700, len: 38 },
  { x: 83, w: 40, d: 70, dur: 900, len: 70 },
  { x: 92, w: 28, d: 320, dur: 780, len: 54 },
]

// Coffee spills down over the whole desktop, pools at the bottom, then fades.
export default function CoffeeSpill({ onDone }: { onDone: () => void }) {
  const [fade, setFade] = useState(false)
  useEffect(() => {
    const t1 = setTimeout(() => setFade(true), 2400)
    const t2 = setTimeout(onDone, 3400)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [onDone])

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-[400] transition-opacity duration-1000 ${fade ? "opacity-0" : "opacity-100"}`}
    >
      {DRIPS.map((d, i) => (
        <div
          key={i}
          className="absolute top-0"
          style={{
            left: `${d.x}%`,
            width: d.w,
            height: `${d.len}vh`,
            transformOrigin: "top",
            animation: `coffee-drip ${d.dur}ms cubic-bezier(.35,.7,.25,1) ${d.d}ms both`,
            background: "linear-gradient(180deg,#5a3a1e,#3a2010 88%)",
            borderBottomLeftRadius: "45% 22px",
            borderBottomRightRadius: "45% 22px",
            boxShadow: "inset 6px 0 10px -6px rgba(255,220,180,.25), inset 0 0 12px rgba(0,0,0,.4)",
          }}
        />
      ))}
      {/* Pool at the bottom */}
      <div
        className="absolute inset-x-0 bottom-0"
        style={{
          height: "24vh",
          transformOrigin: "bottom",
          animation: "coffee-drip 1100ms ease-out 500ms both",
          background: "linear-gradient(0deg,#3a2010,#4a2c14 55%,rgba(74,44,20,0))",
        }}
      />
    </div>
  )
}
