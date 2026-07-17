"use client"
import { experiences, education } from "@/lib/portfolio-data"
import Reveal from "@/components/scroll/reveal"

export default function Journey() {
  return (
    <section id="journey" aria-label="Journey" className="mx-auto max-w-6xl px-6 py-24 md:px-12">
      <p className="section-label mb-4">Journey · {experiences.length} roles</p>
      <h2 className="font-display text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
        Where I&apos;ve been
      </h2>
      <div className="mt-16 border-l border-border pl-6 md:pl-10">
        {experiences.map((e) => (
          <Reveal key={e.company + e.date}>
            <div className="relative pb-14">
              <span className="absolute -left-[1.6rem] top-2 h-3 w-3 rounded-full bg-[var(--cork)] md:-left-[2.9rem]" />
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-xl font-semibold text-foreground">
                  {e.position} · {e.company}
                </h3>
                <span className="section-label">{e.when ?? e.date}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {e.location ? `${e.location} · ${e.date}` : e.date}
              </p>
              <ul className="mt-4 space-y-2">
                {e.responsibilities.map((r) => (
                  <li
                    key={r}
                    className="leading-relaxed text-muted-foreground before:mr-3 before:text-[var(--cork)] before:content-['—']"
                  >
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
        <Reveal>
          <div className="relative">
            <span className="absolute -left-[1.6rem] top-2 h-3 w-3 rounded-full bg-[var(--terracotta)] md:-left-[2.9rem]" />
            <h3 className="section-label mb-4 text-foreground">Education</h3>
            {education.map((ed) => (
              <div key={ed.degree} className="mb-4">
                <p className="font-display font-medium text-foreground">{ed.degree}</p>
                <p className="text-sm text-muted-foreground">
                  {ed.institution} · {ed.location} · {ed.date}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
