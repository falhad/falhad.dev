"use client"
import { certifications, awards } from "@/lib/portfolio-data"
import Reveal from "@/components/scroll/reveal"

export default function Recognition() {
  return (
    <section id="recognition" aria-label="Recognition" className="border-y border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-6 py-20 md:px-12">
        <div className="grid gap-16 md:grid-cols-2">
          <Reveal>
            <div>
              <p className="section-label mb-6">Certifications</p>
              <ul className="space-y-4">
                {certifications.map((c) => (
                  <li key={c.name}>
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="view"
                      className="group flex items-baseline justify-between border-b border-border pb-3 transition-colors hover:border-[var(--cork)]"
                    >
                      <span className="font-display font-medium text-foreground">{c.name}</span>
                      <span className="text-sm text-muted-foreground group-hover:text-[var(--terracotta)]">
                        {c.label}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div>
              <p className="section-label mb-6">Awards</p>
              <ul className="space-y-4">
                {awards.map((a) => {
                  const meta = [a.description, a.years?.join(" / ")].filter(Boolean).join(" · ")
                  const inner = (
                    <span className="flex items-baseline justify-between border-b border-border pb-3">
                      <span className="font-display font-medium text-foreground">{a.title}</span>
                      {meta ? <span className="text-sm text-muted-foreground">{meta}</span> : null}
                    </span>
                  )
                  return (
                    <li key={a.title}>
                      {a.url ? (
                        <a
                          href={a.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-cursor="view"
                          className="block transition-colors hover:text-[var(--terracotta)]"
                        >
                          {inner}
                        </a>
                      ) : (
                        inner
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
