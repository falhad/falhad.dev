"use client"
import { useEffect, useState } from "react"
import { useReducedMotion } from "@/lib/use-reduced-motion"

// Plain white text in a playful font at the bottom-left of the screen, typed
// out character by character. `canClose` false = the opening "it's dark"
// prompt (adds a hint to click the lamp); quips auto-dismiss upstream.
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
    <div className="pointer-events-none absolute bottom-16 left-6 z-40 max-w-md md:bottom-20 md:left-12">
      <p
        className="min-h-[1.4em] text-lg leading-snug text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]"
        style={{ fontFamily: '"Comic Sans MS", "Comic Sans", "Chalkboard SE", "Marker Felt", cursive' }}
      >
        {shown}
        {!done ? <span className="lampdlg-caret">▋</span> : null}
      </p>
      {done && !canClose ? (
        <p className="mt-2 text-sm text-white/70 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          <span className="lampdlg-blink">👉</span> click the desk lamp
        </p>
      ) : null}
      <style>{`
        .lampdlg-blink { animation: lampdlg-blink 0.9s steps(1) infinite; display: inline-block; }
        .lampdlg-caret { animation: lampdlg-blink 0.7s steps(1) infinite; margin-left: 1px; }
        @keyframes lampdlg-blink { 50% { opacity: 0; } }
        @media (prefers-reduced-motion: reduce) { .lampdlg-blink, .lampdlg-caret { animation: none; } }
      `}</style>
    </div>
  )
}
