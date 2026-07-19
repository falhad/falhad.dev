"use client"
import {
  profile,
  stats,
  projects,
  moreProjects,
  skills,
  experiences,
  education,
  certifications,
  awards,
} from "@/lib/portfolio-data"
import {
  siKotlin,
  siPython,
  siRust,
  siDart,
  siTypescript,
  siJavascript,
  siPhp,
  siOpenjdk,
  siSpringboot,
  siReact,
  siNextdotjs,
  siJetpackcompose,
  siFlutter,
  siDjango,
  siFastapi,
  siLaravel,
  siExpress,
  siGit,
  siDocker,
  siPostgresql,
  siMongodb,
  siRedis,
  siNeo4j,
  siCisco,
  siSocketdotio,
  siWebrtc,
  siLangchain,
  siJira,
} from "simple-icons"
import {
  Brain,
  Search,
  Bot,
  Database,
  Sparkles,
  Boxes,
  Workflow,
  FlaskConical,
  Plane,
  Infinity as InfinityIcon,
  Network,
  Cable,
  Zap,
  Video,
} from "lucide-react"

// Each skill maps to a brand/theme color + a glyph. The tile is painted with
// the color and the glyph is auto-contrasted (dark or white) so it stays legible.
type LucideComp = React.ComponentType<{ className?: string; style?: React.CSSProperties }>
type IconDef = { color: string; render: (glyph: string) => React.ReactNode }

const si = (data: { path: string; hex: string }): IconDef => ({
  color: `#${data.hex}`,
  render: (g) => (
    <svg viewBox="0 0 24 24" className="h-7 w-7" style={{ fill: g }} aria-hidden>
      <path d={data.path} />
    </svg>
  ),
})
const lu = (Comp: LucideComp, color: string): IconDef => ({
  color,
  render: (g) => <Comp className="h-6 w-6" style={{ color: g }} />,
})

// Pick a legible glyph color for a given tile color (dark glyph on light tiles).
function glyphOn(hex: string) {
  const h = hex.replace("#", "")
  const r = parseInt(h.slice(0, 2), 16)
  const gc = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  const L = (0.299 * r + 0.587 * gc + 0.114 * b) / 255
  return L > 0.62 ? "#141210" : "#ffffff"
}

const SKILL_META: Record<string, IconDef> = {
  // AI & LLM
  LLMs: lu(Brain, "#A855F7"),
  RAG: lu(Search, "#10B981"),
  "AI Agents": lu(Bot, "#6366F1"),
  "Vector DBs": lu(Database, "#0EA5E9"),
  "Prompt Engineering": lu(Sparkles, "#F59E0B"),
  Embeddings: lu(Boxes, "#14B8A6"),
  LangChain: si(siLangchain),
  // General
  "System Design": lu(Workflow, "#38BDF8"),
  "Test Driven Development": lu(FlaskConical, "#22C55E"),
  "Micro-Services": lu(Boxes, "#F97316"),
  "Fleet & Drone Systems": lu(Plane, "#64748B"),
  Jira: si(siJira),
  // Languages
  Java: si(siOpenjdk),
  Kotlin: si(siKotlin),
  Python: si(siPython),
  Rust: si(siRust),
  Dart: si(siDart),
  TypeScript: si(siTypescript),
  JavaScript: si(siJavascript),
  PHP: si(siPhp),
  // Frameworks
  "Spring Boot": si(siSpringboot),
  "React.js": si(siReact),
  "Next.js": si(siNextdotjs),
  "Jetpack Compose": si(siJetpackcompose),
  KMP: si(siKotlin),
  Flutter: si(siFlutter),
  Django: si(siDjango),
  FastAPI: si(siFastapi),
  Laravel: si(siLaravel),
  "Express.js": si(siExpress),
  // Tools & DBs
  Git: si(siGit),
  Docker: si(siDocker),
  "CI/CD": lu(InfinityIcon, "#3B82F6"),
  PostgreSQL: si(siPostgresql),
  MongoDB: si(siMongodb),
  Redis: si(siRedis),
  Neo4j: si(siNeo4j),
  // Networking
  "CCNP-level expertise": si(siCisco),
  "Network Administration": lu(Network, "#0EA5E9"),
  "Socket Programming": lu(Cable, "#A78BFA"),
  Netty: lu(Zap, "#EAB308"),
  "Socket.io": si(siSocketdotio),
  WebRTC: si(siWebrtc),
  "Video Optimization": lu(Video, "#EF4444"),
}

const BIO =
  "I'm a senior software developer with 14+ years turning hard problems into shipped products — real-time rig monitoring for oil & gas, blockchain and crypto platforms, and AI/LLM systems with RAG. I've led teams from a blank repo to production and enjoy owning a feature end-to-end: backend, frontend, infra, and the messy bits in between."

const BIO2 =
  "I move fast without breaking things that matter, care about clean architecture and developer experience, and like shipping software people actually enjoy using — this site included."

const ABOUT_BULLETS: string[] = [
  "Full-stack across Rust, TypeScript/Next.js, Kotlin, Python & Spring Boot",
  "AI/LLM apps: RAG pipelines, agents, vector search, evals",
  "Real-time systems — WebRTC, sockets, live data at scale",
  "From architecture & DevOps (Docker, CI/CD) to polished UI",
  "Comfortable leading: mentoring, code review, and shipping to deadlines",
]

function hash(str: string) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return h.toString(16).padStart(7, "0").slice(0, 7)
}

/* ---------------- About (Notes) ---------------- */
export function AboutApp() {
  return (
    <div className="grid min-h-full sm:grid-cols-[190px_1fr]">
      <aside className="hidden border-r border-white/10 bg-white/[0.02] p-3 sm:block">
        <p className="section-label px-2 pb-2">iCloud</p>
        <div className="rounded-lg bg-[var(--terracotta)]/20 px-3 py-2">
          <p className="text-sm font-medium text-foreground">About Me</p>
          <p className="truncate text-xs text-muted-foreground">Senior Software Developer…</p>
        </div>
        <div className="mt-1 rounded-lg px-3 py-2">
          <p className="text-sm text-foreground/80">Highlights</p>
          <p className="truncate text-xs text-muted-foreground">14+ yrs · 20+ projects…</p>
        </div>
      </aside>
      <div className="p-7">
        <p className="text-center text-xs text-muted-foreground">{profile.location} · {profile.title}</p>
        <h3 className="mt-3 font-display text-2xl font-semibold text-foreground">Hi, I&apos;m Farhad 👋</h3>
        <p className="mt-4 text-[1.05rem] leading-relaxed text-muted-foreground">{BIO}</p>
        <p className="mt-4 text-[1.05rem] leading-relaxed text-muted-foreground">{BIO2}</p>

        <p className="mt-7 font-medium text-foreground">What I bring</p>
        <ul className="mt-3 space-y-2">
          {ABOUT_BULLETS.map((b) => (
            <li key={b} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
              <span className="mt-0.5 shrink-0 text-[var(--terracotta)]">▹</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <p className="mt-7 font-medium text-foreground">Highlights</p>
        <div className="mt-4 grid grid-cols-2 gap-5 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="font-display text-2xl font-semibold text-foreground">{s.value}</div>
              <div className="section-label mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Open-to-work note with a soft nudge to reach out. */}
        <div className="mt-8 rounded-xl border border-[var(--terracotta)]/30 bg-[var(--terracotta)]/10 p-4">
          <p className="text-sm font-medium text-foreground">
            <span aria-hidden>🟢</span> Open to senior roles — Muscat or remote worldwide
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Building something that needs a developer who ships? Let&apos;s talk.{" "}
            <a href={`mailto:${profile.email}`} className="text-[var(--terracotta)] hover:underline" data-cursor="email">
              {profile.email}
            </a>{" "}
            ·{" "}
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-[var(--terracotta)] hover:underline">
              LinkedIn
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

/* ---------------- Work (Safari gallery) ---------------- */
export function WorkApp() {
  return (
    <div className="p-5">
      <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
        A few things I&apos;ve shipped — AI/LLM products, real-time systems, and platforms used by real people and teams. Click any card to open it live.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((p) => {
          const href = p.links.demo || p.links.github
          return (
            <div key={p.name} className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.02]">
              <div
                className="relative aspect-[16/9]"
                style={{ background: `radial-gradient(120% 120% at 30% 20%, ${p.color}22, transparent 60%), linear-gradient(160deg,#211d18,#14110d)` }}
              >
                {p.image ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image}
                      alt={`${p.name} — ${p.tagline}`}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover object-top"
                    />
                    {/* Gradient scrim so the name/tagline stay legible over the shot. */}
                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-3 text-left">
                      <span className="font-display text-base font-semibold text-white drop-shadow">{p.name}</span>
                      <span className="ml-2 text-xs text-[var(--terracotta)]">{p.tagline}</span>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="font-display text-xl font-semibold text-foreground/90">{p.name}</span>
                    <span className="mt-1 text-xs text-[var(--terracotta)]">{p.tagline}</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="text-sm leading-relaxed text-muted-foreground">{p.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.technologies.map((t) => (
                    <span key={t} className="rounded-full border border-border px-2 py-0.5 text-[0.65rem] text-muted-foreground">
                      {t}
                    </span>
                  ))}
                </div>
                {href ? (
                  <a href={href} target="_blank" rel="noopener noreferrer" data-cursor="open" className="mt-3 inline-block text-sm text-foreground hover:text-[var(--terracotta)]">
                    Open live ↗
                  </a>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>

      {/* The long tail of shipped work, kept compact. */}
      <p className="mt-6 mb-2 section-label">Also shipped</p>
      <div className="flex flex-wrap gap-1.5">
        {moreProjects.map((m) => (
          <span
            key={m.name}
            title={m.description}
            className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground"
          >
            {m.name}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ---------------- Skills (Launchpad) ---------------- */
export function SkillsApp() {
  return (
    <div className="grid gap-y-9 p-8">
      <p className="-mb-2 text-center text-sm leading-relaxed text-muted-foreground">
        The toolkit — battle-tested in production, not just on a résumé. Depth in the top rows, breadth everywhere else.
      </p>
      {skills.map((group) => (
        <div key={group.category}>
          <h3 className="section-label mb-5 text-center text-foreground">{group.category}</h3>
          <div className="grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-5 md:grid-cols-6">
            {group.items.map((item) => {
              const def = SKILL_META[item]
              const color = def?.color ?? "#3a352e"
              const glyph = glyphOn(color)
              return (
                <div key={item} className="flex flex-col items-center gap-2">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg ring-1 ring-white/10"
                    style={{ background: `linear-gradient(150deg, ${color}, ${color}cc)` }}
                  >
                    {def ? def.render(glyph) : <span className="font-semibold" style={{ color: glyph }}>{item.slice(0, 2)}</span>}
                  </div>
                  <span className="text-center text-[0.7rem] leading-tight text-muted-foreground">{item}</span>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ---------------- Journey (Terminal) ---------------- */
export function JourneyApp() {
  return (
    <div className="p-6 font-mono text-[0.82rem] leading-relaxed">
      <p><span className="text-muted-foreground">➜</span> ~/career <span className="text-[#8fb6ff]">git</span> log --author=Farhad --stat</p>
      {experiences.map((e) => (
        <div key={e.company + e.date} className="mt-5">
          <p className="text-[#e0b64a]">commit {hash(e.company + e.date)} <span className="text-muted-foreground">({e.when ?? e.date})</span></p>
          <p className="text-foreground/90"><span className="text-muted-foreground">Author:</span> Farhad Navayazdan</p>
          <p className="text-muted-foreground"><span className="text-muted-foreground">Role:</span> <span className="text-foreground">{e.position} @ {e.company}</span>{e.location ? ` · ${e.location}` : ""}</p>
          <div className="mt-2 pl-4">
            {e.responsibilities.map((r) => (
              <p key={r} className="text-muted-foreground"><span className="text-[var(--terracotta)]">+</span> {r}</p>
            ))}
          </div>
        </div>
      ))}
      <p className="mt-6"><span className="text-muted-foreground">➜</span> ~/career <span className="text-[#8fb6ff]">cat</span> education.txt</p>
      {education.map((ed) => (
        <div key={ed.degree} className="mt-2">
          <p className="text-foreground">🎓 {ed.degree}</p>
          <p className="text-muted-foreground">   {ed.institution} · {ed.location} · {ed.date}</p>
        </div>
      ))}

      <p className="mt-6"><span className="text-muted-foreground">➜</span> ~/career <span className="text-[#8fb6ff]">ls</span> certifications/</p>
      <div className="mt-2 pl-4">
        {certifications.map((c) => (
          <p key={c.name} className="text-muted-foreground">📜 {c.name} <span className="text-foreground/70">— {c.label}</span></p>
        ))}
      </div>

      <p className="mt-6"><span className="text-muted-foreground">➜</span> ~/career <span className="text-[#8fb6ff]">whoami</span> --status</p>
      <p className="mt-2 text-foreground/90">🟢 Open to senior roles · Muscat or remote · <span className="text-[var(--terracotta)]">available now</span></p>
      <p className="text-muted-foreground">   Hiring? Run: <span className="text-foreground">mailto {profile.email}</span></p>

      <p className="mt-6"><span className="text-muted-foreground">➜</span> ~/career <span className="animate-pulse">▋</span></p>
    </div>
  )
}

/* ---------------- Awards & CV (Finder) ---------------- */

// The CV and certificates are the user's own scans, downloaded locally and
// served from /files so they open inside the desktop's Preview app instead of
// bouncing out to Google Drive. Map each original Drive share link to its
// local copy by file id.
const DRIVE_FILE: Record<string, string> = {
  "1bmeJ-Hubz-ovqnJO4WK2s0GcQCj9-jT6": "/files/security-cert.jpg",
  "1rufY3no366dEK4Qz5NE6OON3Bcq-mFAo": "/files/network-plus.jpg",
  "1qBbgoK3mLUIJaAtlgyDnUewcWfdKFDuN": "/files/ccna.jpg",
  "1jSktgIiziWVGC61ASTeCXP8LZSv1hXsq": "/files/ccnp.jpg",
  "1bSQ8I86w1pzpaKg4VNvFagzKGQKC8dbX": "/files/mcitp.jpg",
}
function localFile(url?: string): string | undefined {
  const id = url?.match(/\/d\/([A-Za-z0-9_-]+)/)?.[1]
  return id ? DRIVE_FILE[id] : undefined
}

// Ask the desktop to open a file in the Preview window (see desktop.tsx).
function openInPreview(name: string, src: string) {
  window.dispatchEvent(new CustomEvent("open-preview", { detail: { name, src } }))
}

// src = a local file that opens in the Preview app; href = an external site.
type F = { icon: string; name: string; meta?: string; src?: string; href?: string }
function FileGrid({ files }: { files: F[] }) {
  return (
    <div className="grid grid-cols-3 gap-5 p-5 sm:grid-cols-4">
      {files.map((f) => {
        const inner = (
          <>
            <div className="flex h-16 w-14 items-center justify-center rounded-lg bg-white/[0.05] text-3xl group-hover:bg-white/10">{f.icon}</div>
            <span className="mt-2 max-w-[7rem] truncate text-center text-xs text-foreground/90">{f.name}</span>
            {f.meta ? <span className="max-w-[8rem] truncate text-center text-[0.6rem] text-muted-foreground">{f.meta}</span> : null}
          </>
        )
        if (f.src) {
          return (
            <button key={f.name} onClick={() => openInPreview(f.name, f.src!)} data-cursor="open" className="group flex flex-col items-center">{inner}</button>
          )
        }
        return f.href ? (
          <a key={f.name} href={f.href} target="_blank" rel="noopener noreferrer" data-cursor="open" className="group flex flex-col items-center">{inner}</a>
        ) : (
          <div key={f.name} className="group flex flex-col items-center">{inner}</div>
        )
      })}
    </div>
  )
}
export function FinderApp() {
  const cv: F = { icon: "📄", name: "Farhad Navayazdan — CV.pdf", meta: "Resume", src: "/files/cv.pdf" }
  const certs: F[] = certifications.map((c) => ({ icon: "📜", name: c.name, meta: c.label, src: localFile(c.url), href: c.url }))
  const aw: F[] = awards.map((a) => ({ icon: "🏆", name: a.title, meta: [a.description, a.years?.join(" / ")].filter(Boolean).join(" · ") || undefined, src: localFile(a.url), href: a.url }))
  return (
    <div className="grid min-h-full sm:grid-cols-[170px_1fr]">
      <aside className="hidden border-r border-white/10 bg-white/[0.02] p-3 text-sm sm:block">
        <p className="section-label px-2 pb-2">Favorites</p>
        <p className="px-3 py-1.5 text-foreground/90">📄 CV</p>
        <p className="px-3 py-1.5 text-foreground/90">📜 Certificates</p>
        <p className="px-3 py-1.5 text-foreground/90">🏆 Awards</p>
      </aside>
      <div className="divide-y divide-white/10">
        <div><p className="section-label px-5 pt-4">CV</p><FileGrid files={[cv]} /></div>
        <div><p className="section-label px-5 pt-4">Certificates</p><FileGrid files={certs} /></div>
        <div><p className="section-label px-5 pt-4">Awards</p><FileGrid files={aw} /></div>
      </div>
    </div>
  )
}

/* ---------------- Contact (Mail) ---------------- */
export function ContactApp() {
  const links = [
    { label: "Email", href: `mailto:${profile.email}`, text: profile.email },
    { label: "Phone", href: `tel:${profile.phoneTel}`, text: profile.phoneDisplay },
    { label: "LinkedIn", href: profile.linkedin, text: "in/farhadnava" },
    { label: "GitHub", href: profile.github, text: "@falhad" },
  ]
  return (
    <div className="p-7">
      <p className="section-label">New Message</p>
      <div className="mt-4 space-y-2 border-b border-white/10 pb-4 text-sm">
        <p className="text-muted-foreground">To: <span className="text-foreground">{profile.email}</span></p>
        <p className="text-muted-foreground">Subject: <span className="text-foreground">Let&apos;s build something</span></p>
      </div>

      <p className="mt-5 text-[1.05rem] leading-relaxed text-muted-foreground">
        The channel is open — a role, a project, real-time systems, blockchain, AI, or just to talk shop. I read everything and usually reply within a day.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--terracotta)]/15 px-3 py-1 font-medium text-[var(--terracotta)]">
          <span aria-hidden>🟢</span> Open to work
        </span>
        <span className="rounded-full border border-white/10 px-3 py-1 text-muted-foreground">📍 {profile.location} · remote worldwide</span>
        <span className="rounded-full border border-white/10 px-3 py-1 text-muted-foreground">🕓 GST (UTC+4)</span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        {links.map((l) => (
          <a key={l.label} href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" data-cursor="open" className="group rounded-lg border border-white/10 bg-white/[0.02] p-3">
            <div className="section-label">{l.label}</div>
            <div className="mt-1 truncate text-foreground group-hover:text-[var(--terracotta)]">{l.text}</div>
          </a>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <a
          href={`mailto:${profile.email}?subject=${encodeURIComponent("Let's build something")}`}
          data-cursor="email"
          className="rounded-full bg-[var(--terracotta)] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          ✉️ Email me
        </a>
        <a href="/resume" data-cursor="open" className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground/80 hover:border-[var(--terracotta)] hover:text-foreground">
          📄 View resume
        </a>
        <a href="/files/cv.pdf" download data-cursor="download" className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground/80 hover:border-[var(--terracotta)] hover:text-foreground">
          ↓ Download CV
        </a>
      </div>
    </div>
  )
}

/* ---------------- App registry ---------------- */
export type AppDef = {
  id: string
  title: string
  icon: string
  width: number
  Body: () => React.ReactElement
}

export const APPS: AppDef[] = [
  { id: "about", title: "About Me — Notes", icon: "📝", width: 640, Body: AboutApp },
  { id: "work", title: "Selected Work — Safari", icon: "🧭", width: 760, Body: WorkApp },
  { id: "skills", title: "Skills — Launchpad", icon: "🚀", width: 680, Body: SkillsApp },
  { id: "journey", title: "Journey — Terminal", icon: "⌘", width: 720, Body: JourneyApp },
  { id: "awards", title: "Awards & CV — Finder", icon: "📁", width: 640, Body: FinderApp },
  { id: "contact", title: "Contact — Mail", icon: "✉️", width: 560, Body: ContactApp },
]
