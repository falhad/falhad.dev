"use client"
import { projects } from "@/lib/portfolio-data"
import Reveal from "@/components/scroll/reveal"
import BuildLog from "@/components/build-log"

export default function Work() {
  return (
    <section id="work" aria-label="Selected work" className="mx-auto max-w-6xl px-6 py-24 md:px-12">
      <p className="section-label mb-4">Selected work · 07</p>
      <h2 className="font-display text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
        Things I&apos;ve built
      </h2>
      <div className="mt-16 grid gap-6 md:grid-cols-2">
        {projects.map((p, i) => {
          const href = p.links.demo || p.links.github
          const card = (
            <div
              data-cursor={href ? "open" : undefined}
              className="group h-full rounded-2xl border border-border bg-secondary/60 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--cork)] hover:shadow-[0_30px_60px_-30px_rgba(70,50,30,0.4)]"
            >
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-2xl font-semibold text-foreground">{p.name}</h3>
                <span className="section-label">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <p className="mt-1 text-sm text-[var(--terracotta)]">{p.tagline}</p>
              <p className="mt-4 leading-relaxed text-muted-foreground">{p.description}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {p.technologies.map((t) => (
                  <span key={t} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )
          return (
            <Reveal key={p.name} delay={(i % 2) * 0.08}>
              {href ? (
                <a href={href} target="_blank" rel="noopener noreferrer" className="block h-full">
                  {card}
                </a>
              ) : (
                card
              )}
            </Reveal>
          )
        })}
      </div>
      <BuildLog />
    </section>
  )
}
