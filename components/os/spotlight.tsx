"use client"
import { useEffect, useMemo, useRef, useState } from "react"
import { APPS } from "@/components/os/apps"
import { profile } from "@/lib/portfolio-data"

type Item = { key: string; icon: string; label: string; hint: string; run: () => void }

// macOS-style Spotlight: ⌘K / ⌘Space to open. Type to filter apps + quick
// actions; ↑/↓ to move, Enter to run, Esc to close.
export default function Spotlight({ onOpenApp, onClose }: { onOpenApp: (id: string) => void; onClose: () => void }) {
  const [q, setQ] = useState("")
  const [sel, setSel] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const items = useMemo<Item[]>(() => {
    const apps: Item[] = APPS.map((a) => ({
      key: `app:${a.id}`,
      icon: a.icon,
      label: a.title.split(" — ")[0],
      hint: a.title.split(" — ")[1] ?? "App",
      run: () => {
        onOpenApp(a.id)
        onClose()
      },
    }))
    const go = (url: string, external = false) => () => {
      if (external) window.open(url, "_blank", "noopener")
      else window.location.href = url
      onClose()
    }
    const actions: Item[] = [
      { key: "resume", icon: "📄", label: "Résumé", hint: "Open the résumé page", run: go("/resume") },
      { key: "cv", icon: "⬇️", label: "Download CV", hint: "PDF", run: go("/files/cv.pdf") },
      { key: "email", icon: "✉️", label: "Email Farhad", hint: profile.email, run: go(`mailto:${profile.email}`) },
      { key: "linkedin", icon: "💼", label: "LinkedIn", hint: "in/farhadnava", run: go(profile.linkedin, true) },
      { key: "github", icon: "💾", label: "GitHub", hint: "@falhad", run: go(profile.github, true) },
    ]
    return [...apps, ...actions]
  }, [onOpenApp, onClose])

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return items
    return items.filter((i) => (i.label + " " + i.hint).toLowerCase().includes(s))
  }, [q, items])

  useEffect(() => {
    setSel(0)
  }, [q])

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSel((s) => Math.min(s + 1, filtered.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSel((s) => Math.max(s - 1, 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      filtered[sel]?.run()
    } else if (e.key === "Escape") {
      e.preventDefault()
      onClose()
    }
  }

  return (
    <div
      className="absolute inset-0 z-[300] flex items-start justify-center bg-black/30 pt-[16vh] backdrop-blur-[2px]"
      onPointerDown={onClose}
    >
      <div
        className="w-[min(560px,92vw)] overflow-hidden rounded-2xl border border-white/15 bg-black/70 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-4">
          <span className="text-lg text-white/50">🔍</span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKey}
            placeholder="Spotlight — search apps, résumé, contact…"
            className="w-full bg-transparent py-4 text-base text-white outline-none placeholder:text-white/40"
          />
        </div>
        <ul className="max-h-[46vh] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-white/40">No results</li>
          ) : (
            filtered.map((i, idx) => (
              <li key={i.key}>
                <button
                  type="button"
                  onPointerEnter={() => setSel(idx)}
                  onClick={i.run}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                    idx === sel ? "bg-[var(--terracotta)]/80 text-white" : "text-white/85 hover:bg-white/5"
                  }`}
                >
                  <span className="text-xl">{i.icon}</span>
                  <span className="flex-1 text-sm font-medium">{i.label}</span>
                  <span className={`text-xs ${idx === sel ? "text-white/80" : "text-white/40"}`}>{i.hint}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  )
}
