"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { TerminalSquare, X } from "lucide-react"
import { profile, projects, skills } from "@/lib/portfolio-data"

type Line = { kind: "cmd" | "out" | "sys" | "err" | "accent"; text: string }

// section id -> aliases you can type to jump there
const SECTIONS: { id: string; label: string; aliases: string[] }[] = [
  { id: "hero", label: "top", aliases: ["hero", "top", "home"] },
  { id: "summary", label: "brief", aliases: ["brief", "summary", "about", "whoami-section"] },
  { id: "experience", label: "log", aliases: ["log", "experience", "xp", "career"] },
  { id: "skills", label: "skills", aliases: ["skills", "matrix", "stack"] },
  { id: "projects", label: "builds", aliases: ["builds", "projects", "work"] },
  { id: "more-projects", label: "archive", aliases: ["archive", "more", "log-archive"] },
  { id: "education", label: "education", aliases: ["education", "edu", "training"] },
  { id: "certifications", label: "credentials", aliases: ["credentials", "certs", "certifications"] },
  { id: "awards", label: "awards", aliases: ["awards", "recognition"] },
  { id: "contact", label: "channel", aliases: ["channel", "contact", "email", "reach"] },
]

const BOOT: Line[] = [
  { kind: "sys", text: "FarhadOS // operator console — v14.0" },
  { kind: "out", text: "Type a command. `help` for the manifest, `ls` to list sections." },
]

const HELP: Line[] = [
  { kind: "accent", text: "AVAILABLE COMMANDS" },
  { kind: "out", text: "whoami          identity readout" },
  { kind: "out", text: "ls              list navigable sections" },
  { kind: "out", text: "goto <section>  fly to a section (e.g. goto log)" },
  { kind: "out", text: "skills          dump the skill matrix" },
  { kind: "out", text: "projects        list flagship builds" },
  { kind: "out", text: "open <project>  launch a project demo" },
  { kind: "out", text: "resume          open the CV" },
  { kind: "out", text: "social          links & channels" },
  { kind: "out", text: "clear           wipe the console" },
]

export default function OperatorConsole() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [log, setLog] = useState<Line[]>(BOOT)
  const [history, setHistory] = useState<string[]>([])
  const [hIndex, setHIndex] = useState(-1)
  const [clock, setClock] = useState("--:--:--")
  const inputRef = useRef<HTMLInputElement>(null)
  const logRef = useRef<HTMLDivElement>(null)

  // Live Muscat clock — the console is operational, not decorative.
  useEffect(() => {
    const tick = () =>
      setClock(
        new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Muscat", hour12: false }),
      )
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  // ⌘K / Ctrl+K toggles; Esc closes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen((o) => !o)
      } else if (e.key === "Escape") {
        setOpen(false)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 40)
  }, [open])

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight })
  }, [log, open])

  const scrollToSection = useCallback((id: string) => {
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: unknown, o?: unknown) => void } }).__lenis
    if (id === "hero") {
      lenis ? lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }
    const el = document.getElementById(id)
    if (!el) return
    if (lenis) lenis.scrollTo(el, { offset: -80 })
    else el.scrollIntoView({ behavior: "smooth" })
  }, [])

  const run = useCallback(
    (raw: string) => {
      const cmd = raw.trim()
      if (!cmd) return
      const out: Line[] = [{ kind: "cmd", text: cmd }]
      const [name, ...rest] = cmd.toLowerCase().split(/\s+/)
      const arg = rest.join(" ")
      const push = (lines: Line[]) => out.push(...lines)

      const section = SECTIONS.find((s) => s.aliases.includes(name))

      if (name === "help") push(HELP)
      else if (name === "clear") {
        setLog([])
        setInput("")
        return
      } else if (name === "whoami") {
        push([
          { kind: "accent", text: profile.name.toUpperCase() },
          { kind: "out", text: `${profile.title} · ${profile.location}` },
          { kind: "out", text: "14+ yrs · real-time systems, blockchain, AI · ex-CTO" },
          { kind: "sys", text: "// try: goto log, open rig-ai, resume" },
        ])
      } else if (name === "ls") {
        push([{ kind: "accent", text: "SECTIONS" }])
        push(SECTIONS.filter((s) => s.id !== "hero").map((s) => ({ kind: "out", text: `~/${s.label}` })))
      } else if (name === "goto" || name === "cd") {
        const target = SECTIONS.find((s) => s.aliases.includes(arg))
        if (target) {
          push([{ kind: "sys", text: `> navigating to ~/${target.label}...` }])
          scrollToSection(target.id)
          setOpen(false)
        } else push([{ kind: "err", text: `no such section: ${arg || "?"} — try 'ls'` }])
      } else if (name === "skills") {
        push([{ kind: "accent", text: "SKILL MATRIX" }])
        push(
          skills.map((c) => ({
            kind: "out" as const,
            text: `${c.category.padEnd(22)} ${c.items.join(", ")}`,
          })),
        )
        push([{ kind: "sys", text: "// jump there: goto skills" }])
      } else if (section) {
        // bare section name typed => jump
        push([{ kind: "sys", text: `> navigating to ~/${section.label}...` }])
        scrollToSection(section.id)
        setOpen(false)
      } else if (name === "projects" || name === "builds") {
        push([{ kind: "accent", text: "FLAGSHIP BUILDS" }])
        push(
          projects.map((p) => ({
            kind: "out" as const,
            text: `${p.name.padEnd(12)} ${p.tagline}`,
          })),
        )
        push([{ kind: "sys", text: "// open one: open <name>" }])
      } else if (name === "open") {
        const p = projects.find((x) => x.name.toLowerCase().replace(/[\s-]/g, "") === arg.replace(/[\s-]/g, ""))
        if (p?.links.demo && p.links.demo !== "#") {
          push([{ kind: "sys", text: `> launching ${p.name}...` }])
          window.open(p.links.demo, "_blank", "noopener")
        } else if (p) push([{ kind: "err", text: `${p.name}: no public demo` }])
        else push([{ kind: "err", text: `unknown project: ${arg} — try 'projects'` }])
      } else if (name === "resume" || name === "cv") {
        push([{ kind: "sys", text: "> opening CV..." }])
        window.open(profile.resume, "_blank", "noopener")
      } else if (name === "social" || name === "links") {
        push([
          { kind: "out", text: `github    ${profile.github}` },
          { kind: "out", text: `linkedin  ${profile.linkedin}` },
          { kind: "out", text: `email     ${profile.email}` },
        ])
      } else if (name === "sudo") {
        push([{ kind: "err", text: "nice try. you're already root here. 🛰️" }])
      } else {
        push([{ kind: "err", text: `command not found: ${name} — type 'help'` }])
      }

      setLog((l) => [...l, ...out])
      setHistory((h) => [cmd, ...h].slice(0, 40))
      setHIndex(-1)
      setInput("")
    },
    [scrollToSection],
  )

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") run(input)
    else if (e.key === "ArrowUp") {
      e.preventDefault()
      setHIndex((i) => {
        const ni = Math.min(i + 1, history.length - 1)
        if (history[ni] != null) setInput(history[ni])
        return ni
      })
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      setHIndex((i) => {
        const ni = Math.max(i - 1, -1)
        setInput(ni === -1 ? "" : history[ni] ?? "")
        return ni
      })
    } else if (e.key === "Tab") {
      e.preventDefault()
      const cmds = ["help", "whoami", "ls", "goto", "skills", "projects", "open", "resume", "social", "clear"]
      const m = cmds.find((c) => c.startsWith(input.toLowerCase().trim()))
      if (m) setInput(m + " ")
    }
  }

  const ticker =
    "◦ SIG ▓▓▓▓░ ◦ UPLINK 128ms ◦ LAT 23.58°N ◦ LON 58.38°E ◦ ROP 42 ft/hr ◦ WITS 0x3F2A ◦ CORE 37°C ◦ RUST ◦ KOTLIN ◦ PYTHON ◦ 14Y UPTIME ◦ STATUS NOMINAL "

  return (
    <>
      {/* Fixed telemetry status bar — persistent operator chrome. */}
      <div className="fixed inset-x-0 bottom-0 z-40 h-7 border-t border-white/[0.08] bg-[#05010f]/85 backdrop-blur">
        <div className="mx-auto flex h-full max-w-[100vw] items-center gap-3 px-3 text-[0.62rem]">
          <span className="mono flex shrink-0 items-center gap-1.5 text-signal">
            <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-signal text-signal" aria-hidden />
            LIVE
          </span>
          <span className="mono shrink-0 text-muted-foreground">MCT {clock}</span>
          <div className="relative hidden flex-1 overflow-hidden sm:block">
            <div className="animate-marquee mono flex w-max whitespace-nowrap text-muted-foreground/60">
              <span>{ticker}</span>
              <span aria-hidden>{ticker}</span>
            </div>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="mono ml-auto flex shrink-0 items-center gap-1.5 rounded border border-white/15 px-2 py-0.5 text-[0.6rem] uppercase tracking-widest text-foreground/80 transition-colors hover:border-plasma/50 hover:text-plasma"
          >
            <TerminalSquare className="h-3 w-3" />
            <span>⌘K</span> operate
          </button>
        </div>
      </div>

      {/* Command console */}
      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center bg-black/60 p-4 pt-[12vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Operator console"
        >
          <div
            className="panel w-full max-w-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b border-white/[0.08] px-4 py-2">
              <span className="live-dot h-2 w-2 rounded-full bg-plasma text-plasma" aria-hidden />
              <span className="mono text-[0.65rem] uppercase tracking-widest text-plasma">operator console</span>
              <span className="mono ml-auto text-[0.6rem] text-muted-foreground">ESC to close</span>
              <button onClick={() => setOpen(false)} aria-label="Close console" className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div ref={logRef} className="mono max-h-[46vh] overflow-y-auto px-4 py-3 text-[0.8rem] leading-relaxed">
              {log.map((line, i) => (
                <div
                  key={i}
                  className={
                    line.kind === "cmd"
                      ? "text-foreground"
                      : line.kind === "sys"
                        ? "text-ion"
                        : line.kind === "err"
                          ? "text-plasma"
                          : line.kind === "accent"
                            ? "font-semibold text-signal"
                            : "text-foreground/70"
                  }
                >
                  {line.kind === "cmd" && <span className="text-plasma">farhad@dev:~$ </span>}
                  <span className="whitespace-pre-wrap">{line.text}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 border-t border-white/[0.08] px-4 py-2.5">
              <span className="mono shrink-0 text-plasma">farhad@dev:~$</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onInputKey}
                spellCheck={false}
                autoComplete="off"
                aria-label="Command input"
                className="mono w-full bg-transparent text-[0.85rem] text-foreground outline-none placeholder:text-muted-foreground/50"
                placeholder="try: whoami"
              />
              <span className="caret -ml-1 h-4 w-2 shrink-0 bg-plasma/70" aria-hidden />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
