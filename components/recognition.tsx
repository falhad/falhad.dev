"use client"
import { certifications, awards, profile } from "@/lib/portfolio-data"
import Reveal from "@/components/scroll/reveal"
import MacWindow from "@/components/os/mac-window"

type FileItem = { icon: string; name: string; meta?: string; href?: string; download?: boolean }

const CV: FileItem = {
  icon: "📄",
  name: "Farhad_Navayazdan_CV.pdf",
  meta: "Résumé",
  href: profile.resume,
  download: true,
}

const CERT_FILES: FileItem[] = certifications.map((c) => ({
  icon: "📜",
  name: `${c.name}.pdf`,
  meta: c.label,
  href: c.url,
}))

const AWARD_FILES: FileItem[] = awards.map((a) => ({
  icon: "🏆",
  name: a.title,
  meta: [a.description, a.years?.join(" / ")].filter(Boolean).join(" · ") || undefined,
  href: a.url,
}))

function FileGrid({ files }: { files: FileItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-6 p-6 sm:grid-cols-3 md:grid-cols-4">
      {files.map((f) => {
        const inner = (
          <>
            <div className="flex h-20 w-16 items-center justify-center rounded-lg bg-white/[0.05] text-3xl transition-colors group-hover:bg-white/10">
              {f.icon}
            </div>
            <span className="mt-2 max-w-[8rem] truncate text-center text-xs text-foreground/90">{f.name}</span>
            {f.meta ? <span className="max-w-[9rem] truncate text-center text-[0.65rem] text-muted-foreground">{f.meta}</span> : null}
          </>
        )
        return f.href ? (
          <a
            key={f.name}
            href={f.href}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor={f.download ? "download" : "open"}
            className="group flex flex-col items-center"
          >
            {inner}
          </a>
        ) : (
          <div key={f.name} className="group flex flex-col items-center">
            {inner}
          </div>
        )
      })}
    </div>
  )
}

export default function Recognition() {
  return (
    <section id="recognition" aria-label="Recognition" className="mx-auto max-w-6xl px-6 py-24 md:px-12">
      <p className="section-label mb-4">Finder · Awards & CV</p>
      <h2 className="font-display text-4xl font-semibold tracking-tight text-foreground md:text-6xl">Recognition</h2>

      <Reveal>
        <MacWindow title="Awards & CV" subtitle={`${1 + certifications.length + awards.length} items`} className="mt-14">
          <div className="grid md:grid-cols-[190px_1fr]">
            {/* Finder sidebar */}
            <aside className="hidden border-r border-white/10 bg-white/[0.02] p-3 text-sm md:block">
              <p className="section-label px-2 pb-2">Favorites</p>
              <p className="rounded-lg px-3 py-1.5 text-foreground/90">📄 CV</p>
              <p className="rounded-lg px-3 py-1.5 text-foreground/90">📜 Certificates</p>
              <p className="rounded-lg px-3 py-1.5 text-foreground/90">🏆 Awards</p>
            </aside>

            {/* File area */}
            <div className="divide-y divide-white/10">
              <div>
                <p className="section-label px-6 pt-5">CV</p>
                <FileGrid files={[CV]} />
              </div>
              <div>
                <p className="section-label px-6 pt-5">Certificates</p>
                <FileGrid files={CERT_FILES} />
              </div>
              <div>
                <p className="section-label px-6 pt-5">Awards</p>
                <FileGrid files={AWARD_FILES} />
              </div>
            </div>
          </div>
        </MacWindow>
      </Reveal>
    </section>
  )
}
