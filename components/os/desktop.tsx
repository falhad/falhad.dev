"use client"
import { useEffect, useRef, useState } from "react"
import DesktopWindow from "@/components/os/desktop-window"
import { APPS, type AppDef } from "@/components/os/apps"
import Spotlight from "@/components/os/spotlight"
import DeskNotifications, { type DeskNote } from "@/components/os/desk-notification"
import { playPop } from "@/lib/sound"

type Win = { id: string; x: number; y: number; z: number; min: boolean }

// Playful, recruiter-friendly notifications that pop when a Dock app is opened.
// Each nudges toward getting in touch. Clicking a banner opens the Contact app.
const NOTE_LINES: { icon: string; app: string; title: string; body: string }[] = [
  { icon: "🎯", app: "Recruiter Mode", title: "Great taste in candidates!", body: "Farhad is open to senior roles. Tap here to say hello." },
  { icon: "🚀", app: "Portfolio", title: "14 years of shipping, one click away", body: "Imagine what he'd build for your team. Let's chat." },
  { icon: "☕", app: "Farhad", title: "Coffee's on me", body: "If we build something great together. Tap to reach out." },
  { icon: "🐛", app: "Stats", title: "Bug count dropping…", body: "Teams that hire Farhad ship faster. Results may vary 😉" },
  { icon: "💼", app: "Opportunity", title: "Now hiring: your next great dev", body: "Spoiler — he's right here. Open Contact." },
  { icon: "⚡", app: "Portfolio", title: "Fast learner, faster shipper", body: "Rust, AI/LLM, full-stack. Available now — let's talk." },
  { icon: "🍌", app: "Minions HR", title: "The minions approve this candidate", body: "So will your team. Tap to get in touch." },
  { icon: "📈", app: "Portfolio", title: "Best feature here? The developer.", body: "Open to work in Muscat or remote. Reach out anytime." },
  { icon: "🤝", app: "Contact", title: "This could be the start of something", body: "One email and you've found your next senior engineer." },
  { icon: "🔥", app: "Recruiter Mode", title: "Warning: high risk of wanting to hire", body: "Symptoms include emailing cs.arcxx@gmail.com." },
  { icon: "✨", app: "Portfolio", title: "You scrolled, you clicked, you're impressed", body: "Let's make it official — tap to contact Farhad." },
  { icon: "💡", app: "Pro Tip", title: "Don't let the good ones get away", body: "Farhad replies fast. Tap here to open Contact." },
]
const pickNote = () => NOTE_LINES[Math.floor(Math.random() * NOTE_LINES.length)]

function Clock() {
  const [now, setNow] = useState("")
  useEffect(() => {
    const tick = () =>
      setNow(
        new Date().toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }) +
          "  " +
          new Date().toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }),
      )
    tick()
    const t = setInterval(tick, 15000)
    return () => clearInterval(t)
  }, [])
  return <span className="tabular-nums">{now}</span>
}

/* Big glass clock widget on the desktop */
function ClockWidget() {
  const [t, setT] = useState({ time: "", date: "" })
  useEffect(() => {
    const tick = () =>
      setT({
        time: new Date().toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }),
        date: new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }),
      })
    tick()
    const i = setInterval(tick, 10000)
    return () => clearInterval(i)
  }, [])
  return (
    <div className="absolute right-6 top-16 hidden rounded-3xl border border-white/[0.12] bg-white/[0.06] px-6 py-5 text-right shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_20px_60px_-30px_rgba(0,0,0,0.7)] backdrop-blur-2xl md:block">
      <div className="font-display text-5xl font-semibold tabular-nums text-white">{t.time}</div>
      <div className="mt-1 text-sm text-white/60">{t.date}</div>
      <div className="text-xs text-white/40">Muscat, Oman</div>
    </div>
  )
}

/* Aurora wallpaper — slow-drifting colored blobs behind the frosted glass */
function Wallpaper() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "linear-gradient(160deg,#0e0b09,#15101c 55%,#0a0d12)" }}>
      <div className="absolute -left-[8%] top-[2%] h-[58vh] w-[58vh] rounded-full opacity-[0.55] blur-[90px]" style={{ background: "radial-gradient(circle,#c2703a,transparent 70%)", animation: "float-a 26s ease-in-out infinite" }} />
      <div className="absolute right-[-4%] top-[16%] h-[62vh] w-[62vh] rounded-full opacity-[0.42] blur-[100px]" style={{ background: "radial-gradient(circle,#6d3f9c,transparent 70%)", animation: "float-b 32s ease-in-out infinite" }} />
      <div className="absolute left-[28%] -bottom-[12%] h-[58vh] w-[58vh] rounded-full opacity-[0.38] blur-[100px]" style={{ background: "radial-gradient(circle,#2f7f8a,transparent 70%)", animation: "float-c 30s ease-in-out infinite" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(120% 90% at 50% 40%, transparent 42%, rgba(0,0,0,0.6))" }} />
    </div>
  )
}

/* Menubar status icons */
function StatusIcons() {
  return (
    <div className="hidden items-center gap-3 text-foreground/75 sm:flex">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <rect x="3" y="5" width="18" height="6" rx="3" />
        <rect x="3" y="13" width="18" height="6" rx="3" />
        <circle cx="16" cy="8" r="1.6" fill="currentColor" />
        <circle cx="8" cy="16" r="1.6" fill="currentColor" />
      </svg>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <circle cx="12" cy="18.5" r="1.7" />
        <path d="M4.5 11a10.5 10.5 0 0115 0l-1.8 1.8a8 8 0 00-11.4 0z" opacity=".85" />
        <path d="M7.8 14.6a5.6 5.6 0 018.4 0L12 18.4z" />
      </svg>
      <svg width="26" height="13" viewBox="0 0 26 13" fill="none" stroke="currentColor" aria-hidden>
        <rect x="1" y="1.5" width="20" height="10" rx="2.5" opacity=".6" />
        <rect x="2.6" y="3" width="13" height="7" rx="1.3" fill="currentColor" stroke="none" />
        <rect x="22.6" y="4.5" width="2" height="4" rx="1" fill="currentColor" stroke="none" opacity=".6" />
      </svg>
    </div>
  )
}

/* Preview app body — shows an image (or PDF) with a download bar, like macOS Preview */
function PreviewBody({ name, src }: { name: string; src: string }) {
  const isPdf = src.toLowerCase().endsWith(".pdf")
  return (
    <div className="flex min-h-full flex-col">
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-white/10 bg-[#17140f]/80 px-4 py-2 backdrop-blur-xl">
        <span className="truncate text-xs text-foreground/70">{name}</span>
        <div className="flex shrink-0 items-center gap-2">
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="pointer"
            className="rounded-md border border-white/15 bg-white/[0.06] px-2.5 py-1 text-xs text-foreground/85 transition-colors hover:bg-white/15 hover:text-white"
          >
            ↗ Open in new tab
          </a>
          <a
            href={src}
            download
            data-cursor="download"
            className="rounded-md border border-white/15 bg-white/[0.06] px-2.5 py-1 text-xs text-foreground/85 transition-colors hover:bg-white/15 hover:text-white"
          >
            ↓ Download
          </a>
        </div>
      </div>
      <div className="min-h-0 flex-1 bg-[#0d0b09] p-3">
        {isPdf ? (
          <iframe src={src} title={name} className="h-[70vh] w-full rounded-md border border-white/10 bg-white" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={name} className="mx-auto max-w-full rounded-md shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)]" />
        )}
      </div>
    </div>
  )
}

/* Lock-screen login shown as the screen turns on */
function BootScreen({ running }: { running: boolean }) {
  return (
    <div className="absolute inset-0 z-[350] flex flex-col items-center justify-center bg-black/45 backdrop-blur-2xl">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/portrait.jpg"
        alt="Farhad Navayazdan"
        loading="eager"
        className="h-24 w-24 rounded-full object-cover shadow-[0_0_0_1px_rgba(255,255,255,0.25),0_20px_50px_-15px_rgba(0,0,0,0.8)]"
      />
      <p className="mt-4 text-lg font-medium text-white">Farhad Navayazdan</p>
      <div className="mt-6 h-1 w-40 overflow-hidden rounded-full bg-white/15">
        <div className="h-full rounded-full bg-white/80" style={running ? { animation: "boot-bar 1.5s ease-out forwards" } : { width: "0%" }} />
      </div>
      <p className="mt-3 text-xs text-white/50">Logging in…</p>
    </div>
  )
}

export default function Desktop() {
  const [wins, setWins] = useState<Win[]>([])
  const [mobileApp, setMobileApp] = useState<string | null>(null)
  const [previewFile, setPreviewFile] = useState<{ name: string; src: string } | null>(null)
  const [mobilePreview, setMobilePreview] = useState(false)
  const [hint, setHint] = useState(true)
  const [reveal, setReveal] = useState(0)
  const [boot, setBoot] = useState<"idle" | "running" | "done">("idle")
  const [mx, setMx] = useState<number | null>(null)
  const [spotlight, setSpotlight] = useState(false)
  const [notes, setNotes] = useState<DeskNote[]>([])
  const noteId = useRef(0)
  const noteTimers = useRef<Set<ReturnType<typeof setTimeout>>>(new Set())
  const zTop = useRef(10)

  // Pop a random recruiter-friendly notification (only from Dock clicks). Fires
  // ~1.2–1.9s after the click, like a real macOS push landing a beat later.
  const notify = () => {
    const t = setTimeout(() => {
      noteTimers.current.delete(t)
      const n = pickNote()
      const id = ++noteId.current
      setNotes((cur) => [...cur, { id, ...n }].slice(-3)) // keep at most 3 on screen
    }, 1200 + Math.random() * 700)
    noteTimers.current.add(t)
  }
  const dismissNote = (id: number) => setNotes((cur) => cur.filter((n) => n.id !== id))
  // Clear pending notification timers on unmount.
  useEffect(() => {
    const timers = noteTimers.current
    return () => timers.forEach(clearTimeout)
  }, [])
  const bootRef = useRef<"idle" | "running" | "done">("idle")

  // Warm the login portrait into cache so it's decoded before the login shows.
  useEffect(() => {
    const img = new Image()
    img.src = "/images/portrait.jpg"
  }, [])

  const open = (id: string) => {
    setHint(false)
    playPop() // soft feedback on window open (no-op unless sound is enabled)
    setWins((ws) => {
      if (ws.some((w) => w.id === id)) return ws.map((w) => (w.id === id ? { ...w, z: ++zTop.current, min: false } : w))
      const n = ws.length
      return [...ws, { id, x: 130 + n * 34, y: 84 + n * 30, z: ++zTop.current, min: false }]
    })
  }
  const close = (id: string) => {
    if (id === "preview") setPreviewFile(null)
    setWins((ws) => ws.filter((w) => w.id !== id))
  }
  const minimize = (id: string) => setWins((ws) => ws.map((w) => (w.id === id ? { ...w, min: true } : w)))
  const focus = (id: string) => setWins((ws) => ws.map((w) => (w.id === id ? { ...w, z: ++zTop.current } : w)))
  const move = (id: string, x: number, y: number) => setWins((ws) => ws.map((w) => (w.id === id ? { ...w, x, y } : w)))

  // Keep a live handle on the windows for the keyboard handler.
  const winsRef = useRef<Win[]>([])
  winsRef.current = wins
  const topOpenId = () => winsRef.current.filter((w) => !w.min).sort((a, b) => b.z - a.z)[0]?.id

  // macOS keyboard shortcuts (only once "logged in"). ⌘K opens Spotlight;
  // Esc closes Spotlight or the front window; ⌘M minimizes it; ⌘1–6 open apps.
  useEffect(() => {
    if (boot !== "done") return
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey
      if (meta && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setSpotlight((s) => !s)
        return
      }
      if (e.key === "Escape") {
        if (spotlight) {
          setSpotlight(false)
          return
        }
        const t = topOpenId()
        if (t) {
          e.preventDefault()
          close(t)
        }
        return
      }
      if (spotlight) return // let Spotlight own the rest while it's open
      if (meta && e.key.toLowerCase() === "m") {
        const t = topOpenId()
        if (t) {
          e.preventDefault()
          minimize(t)
        }
        return
      }
      if (meta && /^[1-6]$/.test(e.key)) {
        const a = APPS[Number(e.key) - 1]
        if (a) {
          e.preventDefault()
          open(a.id)
        }
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boot, spotlight])

  // Finder files ask to open here via a window event, so any app body can
  // trigger the Preview window without prop-drilling.
  useEffect(() => {
    const onPreview = (e: Event) => {
      const d = (e as CustomEvent<{ name: string; src: string }>).detail
      if (!d) return
      setPreviewFile(d)
      if (typeof window !== "undefined" && window.innerWidth < 768) setMobilePreview(true)
      else open("preview")
    }
    window.addEventListener("open-preview", onPreview)
    return () => window.removeEventListener("open-preview", onPreview)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Log out — reset the session and scroll back out to the hero desk. Scrolling
  // back down replays the login.
  const logout = () => {
    setWins([])
    setMobileApp(null)
    setPreviewFile(null)
    setMobilePreview(false)
    setNotes([])
    noteTimers.current.forEach(clearTimeout)
    noteTimers.current.clear()
    setHint(true)
    bootRef.current = "idle"
    setBoot("idle")
    const l = (window as unknown as { __lenis?: { scrollTo: (t: number, o?: object) => void } }).__lenis
    if (l) l.scrollTo(0, { duration: 1.6 })
    else window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Reveal on scroll; when it lands, play the login flourish, then open About.
  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById("hero")
      if (!hero) return
      const r = hero.getBoundingClientRect()
      const range = r.height - window.innerHeight
      const p = range > 0 ? Math.min(1, Math.max(0, -r.top / range)) : 0
      const t = Math.min(1, Math.max(0, (p - 0.88) / 0.12))
      setReveal(t * t * (3 - 2 * t))
      if (t >= 0.98 && bootRef.current === "idle") {
        bootRef.current = "running"
        setBoot("running")
        setTimeout(() => {
          if (bootRef.current !== "running") return
          bootRef.current = "done"
          setBoot("done")
          open("about")
        }, 2100)
      }
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
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
      style={{ opacity: reveal, pointerEvents: reveal > 0.9 ? "auto" : "none" }}
    >
      <Wallpaper />

      {/* ===== Menubar ===== */}
      <div className="absolute inset-x-0 top-0 z-[200] flex items-center justify-between border-b border-white/10 bg-white/[0.06] px-4 py-1.5 text-xs text-foreground/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-2xl">
        <div className="flex items-center gap-4">
          <span></span>
          <span className="font-semibold">{topId === "preview" ? "Preview" : topApp ? topApp.title.split(" — ")[1] ?? topApp.title : "Finder"}</span>
          <span className="hidden gap-4 text-muted-foreground md:flex">
            <span>File</span>
            <span>Edit</span>
            <span>View</span>
            <span>Window</span>
            <span>Help</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSpotlight((s) => !s)}
            aria-label="Open Spotlight search"
            data-cursor="search"
            className="flex items-center gap-1 rounded px-1.5 py-0.5 text-foreground/75 transition-colors hover:bg-white/10 hover:text-white"
          >
            <span aria-hidden>🔍</span>
            <span className="hidden text-[0.7rem] text-muted-foreground sm:inline">⌘K</span>
          </button>
          <StatusIcons />
          <button
            onClick={logout}
            data-cursor="log out"
            className="flex items-center gap-1 rounded px-1.5 py-0.5 text-foreground/75 transition-colors hover:bg-white/10 hover:text-white"
          >
            <span aria-hidden>⏻</span> Log out
          </button>
          <Clock />
        </div>
      </div>

      {/* Desktop clock widget */}
      <ClockWidget />

      {/* ===== Desktop (md+) : window manager ===== */}
      <div className="absolute inset-0 hidden md:block">
        {wins
          .filter((w) => !w.min)
          .map((w) => {
            const isPreview = w.id === "preview"
            const def = APPS.find((a) => a.id === w.id)
            if (!isPreview && !def) return null
            const title = isPreview ? `${previewFile?.name ?? "Preview"} — Preview` : def!.title
            const width = isPreview ? 720 : def!.width
            return (
              <DesktopWindow
                key={w.id}
                id={w.id}
                title={title}
                x={w.x}
                y={w.y}
                z={w.z}
                width={width}
                focused={w.id === topId}
                onFocus={focus}
                onClose={close}
                onMinimize={minimize}
                onMove={move}
              >
                {isPreview && previewFile ? <PreviewBody name={previewFile.name} src={previewFile.src} /> : def ? <def.Body /> : null}
              </DesktopWindow>
            )
          })}

        {hint && boot === "done" ? (
          <div className="pointer-events-none absolute bottom-28 left-1/2 -translate-x-1/2 animate-pulse text-sm text-white/60">
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
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.08] text-2xl backdrop-blur-xl">
                {a.icon}
              </span>
              <span className="text-center text-[0.7rem] leading-tight text-white/70">{a.title.split(" — ")[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {mobileDef ? (
        <div className="fixed inset-0 z-[300] flex flex-col bg-[#141110]/95 backdrop-blur-2xl md:hidden">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <button onClick={() => setMobileApp(null)} className="text-sm text-[var(--terracotta)]">‹ Home</button>
            <span className="text-sm font-medium text-foreground/80">{mobileDef.title.split(" — ")[0]}</span>
            <span className="w-12" />
          </div>
          <div data-lenis-prevent className="mac-scroll min-h-0 flex-1 overflow-auto">
            <mobileDef.Body />
          </div>
        </div>
      ) : null}

      {mobilePreview && previewFile ? (
        <div className="fixed inset-0 z-[320] flex flex-col bg-[#141110]/95 backdrop-blur-2xl md:hidden">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <button onClick={() => setMobilePreview(false)} className="text-sm text-[var(--terracotta)]">‹ Back</button>
            <span className="truncate text-sm font-medium text-foreground/80">{previewFile.name}</span>
            <a href={previewFile.src} download className="text-sm text-[var(--terracotta)]">↓</a>
          </div>
          <div data-lenis-prevent className="mac-scroll min-h-0 flex-1 overflow-auto">
            <PreviewBody name={previewFile.name} src={previewFile.src} />
          </div>
        </div>
      ) : null}

      {/* ===== Dock (magnifying) ===== */}
      <div className="absolute bottom-4 left-1/2 z-[200] -translate-x-1/2">
        <div
          onPointerMove={(e) => setMx(e.clientX)}
          onPointerLeave={() => setMx(null)}
          className="flex items-end gap-1.5 rounded-[26px] border border-white/20 bg-white/[0.1] p-2.5 shadow-[0_24px_70px_-20px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.3)] backdrop-blur-2xl"
        >
          {APPS.map((a) => (
            <DockIcon
              key={a.id}
              a={a}
              mx={mx}
              active={openIds.has(a.id)}
              onClick={() => {
                if (typeof window !== "undefined" && window.innerWidth < 768) setMobileApp(a.id)
                else open(a.id)
                notify() // playful recruiter-friendly banner on every Dock click
              }}
            />
          ))}
        </div>
      </div>

      {/* ===== Recruiter-friendly notifications (Dock clicks) ===== */}
      <DeskNotifications notes={notes} onDismiss={dismissNote} onAction={() => open("contact")} />

      {/* ===== Spotlight (⌘K) ===== */}
      {spotlight && boot === "done" ? <Spotlight onOpenApp={open} onClose={() => setSpotlight(false)} /> : null}

      {/* ===== Login flourish ===== */}
      {boot !== "done" ? <BootScreen running={boot === "running"} /> : null}
    </section>
  )
}

/* Magnifying Dock icon (macOS-style) */
function DockIcon({ a, mx, active, onClick }: { a: AppDef; mx: number | null; active: boolean; onClick: () => void }) {
  const ref = useRef<HTMLButtonElement>(null)
  let scale = 1
  if (mx != null && ref.current) {
    const r = ref.current.getBoundingClientRect()
    const d = Math.abs(mx - (r.left + r.width / 2))
    scale = 1 + 0.7 * Math.max(0, 1 - d / 120)
  }
  return (
    <button
      ref={ref}
      onClick={onClick}
      style={{ transform: `translateY(${-(scale - 1) * 30}px) scale(${scale})`, transformOrigin: "bottom", transition: "transform 110ms ease-out" }}
      className="group relative flex h-14 w-14 items-end justify-center pb-1"
    >
      <span className="text-[2.1rem] leading-none drop-shadow-[0_6px_12px_rgba(0,0,0,0.55)]">{a.icon}</span>
      <span className="pointer-events-none absolute -top-11 whitespace-nowrap rounded-lg border border-white/15 bg-black/70 px-2.5 py-1 text-[0.68rem] font-medium text-white opacity-0 shadow-lg backdrop-blur-xl transition-opacity duration-150 group-hover:opacity-100">
        {a.title.split(" — ")[0]}
      </span>
      {active ? <span className="absolute bottom-0 h-[3px] w-[3px] rounded-full bg-white/85" /> : null}
    </button>
  )
}
