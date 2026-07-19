"use client"
import { useEffect, useRef, useState } from "react"

export type DeskNote = { id: number; icon: string; app: string; title: string; body: string }

// A single macOS-style notification banner: app row + title + body, slides in
// from the right, auto-dismisses, and is clickable (host decides the action).
function Banner({ note, onDismiss, onAction }: { note: DeskNote; onDismiss: () => void; onAction: () => void }) {
  const [shown, setShown] = useState(false) // false until the enter frame
  const [leaving, setLeaving] = useState(false)
  const dismissed = useRef(false)

  const dismiss = () => {
    if (dismissed.current) return
    dismissed.current = true
    setLeaving(true)
    setTimeout(onDismiss, 360) // let the exit transition finish
  }

  useEffect(() => {
    // Animate in on the next frame so the transition actually plays.
    const raf = requestAnimationFrame(() => setShown(true))
    const t = setTimeout(dismiss, 6000)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const visible = shown && !leaving

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => {
        onAction()
        dismiss()
      }}
      style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
      className={`pointer-events-auto w-[330px] max-w-[86vw] origin-top-right cursor-pointer rounded-2xl border border-white/15 bg-black/70 p-3.5 shadow-[0_24px_70px_-20px_rgba(0,0,0,0.9)] backdrop-blur-2xl transition-all duration-[420ms] ${
        visible ? "translate-x-0 scale-100 opacity-100 blur-0" : "translate-x-10 scale-95 opacity-0 blur-[2px]"
      }`}
    >
      <div className="flex items-center gap-2 text-[0.68rem] text-white/55">
        <span className="text-base leading-none">{note.icon}</span>
        <span className="font-medium uppercase tracking-wide">{note.app}</span>
        <span className="ml-auto">now</span>
      </div>
      <p className="mt-1.5 text-sm font-semibold text-white">{note.title}</p>
      <p className="mt-0.5 text-[0.8rem] leading-snug text-white/75">{note.body}</p>
    </div>
  )
}

// Fixed top-right stack of notification banners.
export default function DeskNotifications({
  notes,
  onDismiss,
  onAction,
}: {
  notes: DeskNote[]
  onDismiss: (id: number) => void
  onAction: () => void
}) {
  return (
    <div className="pointer-events-none absolute right-3 top-10 z-[250] flex flex-col gap-2 md:right-4">
      {notes.map((n) => (
        <Banner key={n.id} note={n} onDismiss={() => onDismiss(n.id)} onAction={onAction} />
      ))}
    </div>
  )
}
