"use client"
import { useEffect, useState } from "react"
import { useReducedMotion } from "@/lib/use-reduced-motion"

// Typed dialog in a black bubble at the bottom-left. When `canClose` is false
// (the opening "it's dark" prompt) it also points to the lamp so the visitor
// knows where to click.
export default function LampDialog({ text, canClose }: { text: string; canClose: boolean }) {
  const reduced = useReducedMotion()
  const [shown, setShown] = useState(reduced ? text : "")
  const [done, setDone] = useState(reduced)

  useEffect(() => {
    if (reduced) {
      setShown(text)
      setDone(true)
      return
    }
    setShown("")
    setDone(false)
    let i = 0
    const id = setInterval(() => {
      i++
      setShown(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(id)
        setDone(true)
      }
    }, 24)
    return () => clearInterval(id)
  }, [text, reduced])

  return (
    <>
      <div className="pointer-events-none absolute bottom-16 left-6 z-40 max-w-md md:bottom-20 md:left-12">
        <div
          className="rounded-2xl bg-black/85 px-5 py-4 text-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)] ring-1 ring-white/15 backdrop-blur-sm"
          style={{ fontFamily: '"Comic Sans MS", "Comic Sans", "Chalkboard SE", "Marker Felt", cursive' }}
        >
          <p className="min-h-[1.4em] text-[1.05rem] leading-snug">
            {shown}
            {!done ? <span className="lampdlg-caret">▋</span> : null}
          </p>
          {done && !canClose ? (
            <p className="mt-2 text-sm text-white/60">
              <span className="lampdlg-blink">👉</span> click the glowing desk lamp
            </p>
          ) : null}
        </div>
      </div>

      {/* Soft glow over the lamp (top-right) while it's off — draws the eye. */}
      {!canClose ? (
        <div
          className="lampdlg-glow pointer-events-none absolute right-[8%] top-[8%] z-40 h-52 w-52 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(255,214,150,0.30) 0%, rgba(255,214,150,0.10) 40%, rgba(255,214,150,0) 72%)" }}
        />
      ) : null}

      <style>{`
        .lampdlg-blink { animation: lampdlg-blink 0.9s steps(1) infinite; display: inline-block; }
        .lampdlg-caret { animation: lampdlg-blink 0.7s steps(1) infinite; margin-left: 1px; }
        .lampdlg-glow { animation: lampdlg-glow 2.4s ease-in-out infinite; }
        @keyframes lampdlg-blink { 50% { opacity: 0; } }
        @keyframes lampdlg-glow { 0%,100% { opacity: 0.45; } 50% { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) { .lampdlg-blink, .lampdlg-caret, .lampdlg-glow { animation: none; } }
      `}</style>
    </>
  )
}
