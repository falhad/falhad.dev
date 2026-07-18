"use client"
import { useEffect, useRef, useState } from "react"
import DesktopWindow from "@/components/os/desktop-window"
import CoffeeSpill from "@/components/os/coffee-spill"
import { APPS } from "@/components/os/apps"

type Win = { id: string; x: number; y: number; z: number; min: boolean }

function Clock() {
  const [now, setNow] = useState("")
  useEffect(() => {
    const tick = () =>
      setNow(new Date().toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }) +
        "  " + new Date().toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }))
    tick()
    const t = setInterval(tick, 15000)
    return () => clearInterval(t)
  }, [])
  return <span className="tabular-nums">{now}</span>
}

export default function Desktop() {
  const [wins, setWins] = useState<Win[]>([])
  const [mobileApp, setMobileApp] = useState<string | null>(null)
  const [hint, setHint] = useState(true)
  const [reveal, setReveal] = useState(0)
  const [spill, setSpill] = useState(0)
  const zTop = useRef(10)

  // Coffee-spill Easter egg — triggered by the menubar cup or the coffees stat.
  useEffect(() => {
    const onSpill = () => setSpill((s) => s + 1)
    window.addEventListener("coffee-spill", onSpill)
    return () => window.removeEventListener("coffee-spill", onSpill)
  }, [])

  // The desktop "turns on" over the black screen as the push-in completes.
  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById("hero")
      if (!hero) return
      const r = hero.getBoundingClientRect()
      const range = r.height - window.innerHeight
      const p = range > 0 ? Math.min(1, Math.max(0, -r.top / range)) : 0
      const t = Math.min(1, Math.max(0, (p - 0.88) / 0.12))
      setReveal(t * t * (3 - 2 * t))
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const open = (id: string) => {
    setHint(false)
    setWins((ws) => {
      if (ws.some((w) => w.id === id)) return ws.map((w) => (w.id === id ? { ...w, z: ++zTop.current, min: false } : w))
      const n = ws.length
      return [...ws, { id, x: 130 + n * 34, y: 84 + n * 30, z: ++zTop.current, min: false }]
    })
  }
  const close = (id: string) => setWins((ws) => ws.filter((w) => w.id !== id))
  const minimize = (id: string) => setWins((ws) => ws.map((w) => (w.id === id ? { ...w, min: true } : w)))
  const focus = (id: string) => setWins((ws) => ws.map((w) => (w.id === id ? { ...w, z: ++zTop.current } : w)))
  const move = (id: string, x: number, y: number) => setWins((ws) => ws.map((w) => (w.id === id ? { ...w, x, y } : w)))

  // Auto-open About once we arrive.
  useEffect(() => {
    open("about")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const topId = wins.filter((w) => !w.min).sort((a, b) => b.z - a.z)[0]?.id
  const topApp = APPS.find((a) => a.id === topId)
  const openIds = new Set(wins.map((w) => w.id))
  const mobileDef = APPS.find((a) => a.id === mobileApp)

  return (
    <section
      id="desktop"
      aria-label="Desktop"
      className="fixed inset-0 z-[60] overflow-hidden"
      style={{
        background: "radial-gradient(120% 90% at 60% 0%, #241d16, #100b07 70%)",
        opacity: reveal,
        pointerEvents: reveal > 0.9 ? "auto" : "none",
      }}
    >
      {/* ===== Menubar ===== */}
      <div className="absolute inset-x-0 top-0 z-[200] flex items-center justify-between border-b border-white/5 bg-black/30 px-4 py-1.5 text-xs text-foreground/80 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <span></span>
          <span className="font-semibold">{topApp ? topApp.title.split(" — ")[1] ?? topApp.title : "Finder"}</span>
          <span className="hidden text-muted-foreground sm:inline">{topApp ? topApp.title.split(" — ")[0] : "Farhad Navayazdan"}</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSpill((s) => s + 1)}
            data-cursor="spill?"
            aria-label="Coffee"
            className="text-sm transition-transform hover:scale-125"
          >
            ☕
          </button>
          <Clock />
        </div>
      </div>
      {spill > 0 ? <CoffeeSpill key={spill} onDone={() => setSpill(0)} /> : null}

      {/* ===== Desktop (md+) : window manager ===== */}
      <div className="absolute inset-0 hidden md:block">
        {wins
          .filter((w) => !w.min)
          .map((w) => {
            const def = APPS.find((a) => a.id === w.id)!
            const Body = def.Body
            return (
              <DesktopWindow
                key={w.id}
                id={w.id}
                title={def.title}
                x={w.x}
                y={w.y}
                z={w.z}
                width={def.width}
                focused={w.id === topId}
                onFocus={focus}
                onClose={close}
                onMinimize={minimize}
                onMove={move}
              >
                <Body />
              </DesktopWindow>
            )
          })}

        {hint ? (
          <div className="pointer-events-none absolute bottom-28 left-1/2 -translate-x-1/2 animate-pulse text-sm text-muted-foreground">
            Click an app in the Dock to explore ↓
          </div>
        ) : null}
      </div>

      {/* ===== Mobile : iOS-style home + full-screen app ===== */}
      <div className="absolute inset-0 px-6 pb-28 pt-16 md:hidden">
        <p className="section-label mb-6">Tap an app</p>
        <div className="grid grid-cols-3 gap-x-4 gap-y-6">
          {APPS.map((a) => (
            <button key={a.id} onClick={() => setMobileApp(a.id)} className="flex flex-col items-center gap-2">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-2xl">
                {a.icon}
              </span>
              <span className="text-center text-[0.7rem] leading-tight text-muted-foreground">
                {a.title.split(" — ")[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {mobileDef ? (
        <div className="fixed inset-0 z-[300] flex flex-col bg-[#141110] md:hidden">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <button onClick={() => setMobileApp(null)} className="text-sm text-[var(--terracotta)]">‹ Home</button>
            <span className="text-sm font-medium text-foreground/80">{mobileDef.title.split(" — ")[0]}</span>
            <span className="w-12" />
          </div>
          <div className="min-h-0 flex-1 overflow-auto">
            <mobileDef.Body />
          </div>
        </div>
      ) : null}

      {/* ===== Dock ===== */}
      <div className="absolute bottom-4 left-1/2 z-[200] -translate-x-1/2">
        <div className="flex items-end gap-1.5 rounded-2xl border border-white/15 bg-white/[0.08] p-2 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          {APPS.map((a) => (
            <button
              key={a.id}
              onClick={() => (mobileApp !== null || window.innerWidth < 768 ? setMobileApp(a.id) : open(a.id))}
              data-cursor={a.title.split(" — ")[0].toLowerCase()}
              className="group relative flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.04] text-2xl transition-transform duration-200 hover:-translate-y-2 hover:bg-white/10"
            >
              <span>{a.icon}</span>
              <span className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-md bg-black/80 px-2 py-1 text-[0.65rem] font-medium text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                {a.title.split(" — ")[0]}
              </span>
              {openIds.has(a.id) ? <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-white/70" /> : null}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
