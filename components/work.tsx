"use client"
import { projects } from "@/lib/portfolio-data"
import Reveal from "@/components/scroll/reveal"
import BuildLog from "@/components/build-log"
import MacWindow from "@/components/os/mac-window"

function prettyUrl(href?: string) {
  if (!href) return "localhost"
  return href.replace(/^https?:\/\//, "").replace(/\/$/, "")
}

export default function Work() {
  return (
    <section id="work" aria-label="Selected work" className="mx-auto max-w-6xl px-6 py-24 md:px-12">
      <p className="section-label mb-4">Safari · Selected work</p>
      <h2 className="font-display text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
        Things I&apos;ve built
      </h2>

      <div className="mt-16 grid gap-8 md:grid-cols-2">
        {projects.map((p, i) => {
          const href = p.links.demo || p.links.github
          return (
            <Reveal key={p.name} delay={(i % 2) * 0.08}>
              <MacWindow
                title={p.name}
                className="h-full transition-transform duration-300 hover:-translate-y-1"
                toolbar={<span className="text-[0.6rem] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>}
              >
                {/* Safari address bar */}
                <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-2">
                  <span className="text-sm text-muted-foreground/60">‹&nbsp;›</span>
                  <div className="flex flex-1 items-center gap-2 truncate rounded-md bg-black/30 px-3 py-1.5 text-xs text-muted-foreground">
                    <span className="text-[0.65rem]">🔒</span>
                    <span className="truncate">{prettyUrl(href)}</span>
                  </div>
                </div>

                {/* "Screenshot" placeholder */}
                <div
                  className="relative aspect-[16/10] w-full overflow-hidden"
                  style={{
                    background: `radial-gradient(120% 120% at 30% 20%, ${p.color}22, transparent 60%), linear-gradient(160deg, #211d18, #14110d)`,
                  }}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                    <span className="font-display text-2xl font-semibold text-foreground/90 md:text-3xl">{p.name}</span>
                    <span className="mt-2 text-sm text-[var(--terracotta)]">{p.tagline}</span>
                  </div>
                  <span className="section-label absolute bottom-3 right-4 opacity-40">preview</span>
                </div>

                {/* Meta */}
                <div className="p-6">
                  <p className="leading-relaxed text-muted-foreground">{p.description}</p>
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    {p.technologies.map((t) => (
                      <span key={t} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                        {t}
                      </span>
                    ))}
                  </div>
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="open"
                      className="mt-5 inline-flex items-center gap-1.5 text-sm text-foreground transition-colors hover:text-[var(--terracotta)]"
                    >
                      Open live ↗
                    </a>
                  ) : null}
                </div>
              </MacWindow>
            </Reveal>
          )
        })}
      </div>

      <BuildLog />
    </section>
  )
}
