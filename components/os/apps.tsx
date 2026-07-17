"use client"
import {
  profile,
  stats,
  projects,
  skills,
  experiences,
  education,
  certifications,
  awards,
} from "@/lib/portfolio-data"

const BIO =
  "14+ years shipping high-impact systems — real-time rig monitoring for oil & gas, blockchain and crypto platforms, and LLM/RAG AI, leading teams from concept to deployment."

function hash(str: string) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return h.toString(16).padStart(7, "0").slice(0, 7)
}

/* ---------------- About (Notes) ---------------- */
export function AboutApp() {
  return (
    <div className="grid sm:grid-cols-[190px_1fr]">
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
        <p className="text-center text-xs text-muted-foreground">{profile.location}</p>
        <h3 className="mt-3 font-display text-2xl font-semibold text-foreground">About Me</h3>
        <p className="mt-4 text-[1.05rem] leading-relaxed text-muted-foreground">{BIO}</p>
        <p className="mt-7 font-medium text-foreground">Highlights</p>
        <div className="mt-4 grid grid-cols-2 gap-5 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="font-display text-2xl font-semibold text-foreground">{s.value}</div>
              <div className="section-label mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ---------------- Work (Safari gallery) ---------------- */
export function WorkApp() {
  return (
    <div className="p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((p) => {
          const href = p.links.demo || p.links.github
          return (
            <div key={p.name} className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.02]">
              <div
                className="relative aspect-[16/9]"
                style={{ background: `radial-gradient(120% 120% at 30% 20%, ${p.color}22, transparent 60%), linear-gradient(160deg,#211d18,#14110d)` }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="font-display text-xl font-semibold text-foreground/90">{p.name}</span>
                  <span className="mt-1 text-xs text-[var(--terracotta)]">{p.tagline}</span>
                </div>
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
    </div>
  )
}

/* ---------------- Skills (Launchpad) ---------------- */
const TINTS = [
  "from-[#c2703a] to-[#8a3f22]",
  "from-[#3a6ea5] to-[#22406a]",
  "from-[#5a8f3a] to-[#31502040]",
  "from-[#8a5ac2] to-[#4a2f6a]",
  "from-[#c2a23a] to-[#6a5320]",
  "from-[#3aa0a5] to-[#20505a]",
]
export function SkillsApp() {
  return (
    <div className="grid gap-y-9 p-8">
      {skills.map((group, gi) => (
        <div key={group.category}>
          <h3 className="section-label mb-5 text-center text-foreground">{group.category}</h3>
          <div className="grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-5 md:grid-cols-6">
            {group.items.map((item) => (
              <div key={item} className="flex flex-col items-center gap-2">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${TINTS[gi % TINTS.length]} shadow-lg`}>
                  <span className="font-semibold text-white/90">{item.slice(0, 2)}</span>
                </div>
                <span className="text-center text-[0.7rem] leading-tight text-muted-foreground">{item}</span>
              </div>
            ))}
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
      <p className="mt-6"><span className="text-muted-foreground">➜</span> ~/career <span className="animate-pulse">▋</span></p>
    </div>
  )
}

/* ---------------- Awards & CV (Finder) ---------------- */
type F = { icon: string; name: string; meta?: string; href?: string; download?: boolean }
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
        return f.href ? (
          <a key={f.name} href={f.href} target="_blank" rel="noopener noreferrer" data-cursor={f.download ? "download" : "open"} className="group flex flex-col items-center">{inner}</a>
        ) : (
          <div key={f.name} className="group flex flex-col items-center">{inner}</div>
        )
      })}
    </div>
  )
}
export function FinderApp() {
  const cv: F = { icon: "📄", name: "Farhad_CV.pdf", meta: "Résumé", href: profile.resume, download: true }
  const certs: F[] = certifications.map((c) => ({ icon: "📜", name: `${c.name}.pdf`, meta: c.label, href: c.url }))
  const aw: F[] = awards.map((a) => ({ icon: "🏆", name: a.title, meta: [a.description, a.years?.join(" / ")].filter(Boolean).join(" · ") || undefined, href: a.url }))
  return (
    <div className="grid sm:grid-cols-[170px_1fr]">
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
        The channel is open — real-time systems, blockchain, AI, or just to talk shop. Reach me anywhere below.
      </p>
      <div className="mt-6 grid grid-cols-2 gap-4">
        {links.map((l) => (
          <a key={l.label} href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" data-cursor="open" className="group rounded-lg border border-white/10 bg-white/[0.02] p-3">
            <div className="section-label">{l.label}</div>
            <div className="mt-1 truncate text-foreground group-hover:text-[var(--terracotta)]">{l.text}</div>
          </a>
        ))}
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
