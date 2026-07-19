"use client"
import { useEffect, useState } from "react"
import { isSoundOn, setSoundOn, onSoundChange, unlockSound } from "@/lib/sound"

// Small fixed speaker toggle. Sound is ON by default; this lets the visitor
// mute. Mirrors the retro replay link's style (bottom corner, subtle).
export default function SoundToggle() {
  const [on, setOn] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setOn(isSoundOn())
    return onSoundChange(setOn)
  }, [])

  if (!mounted) return null

  return (
    <button
      type="button"
      onClick={() => {
        unlockSound()
        setSoundOn(!on)
      }}
      aria-label={on ? "Mute sound" : "Unmute sound"}
      aria-pressed={on}
      className="fixed bottom-3 right-3 z-[80] rounded-full p-2 text-base leading-none text-foreground/40 transition-colors hover:text-[var(--terracotta)] md:bottom-4 md:right-4"
      title={on ? "Sound on — tap to mute" : "Sound off — tap to unmute"}
    >
      {on ? "🔊" : "🔇"}
    </button>
  )
}
