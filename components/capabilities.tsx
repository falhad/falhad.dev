"use client"
import { skills } from "@/lib/portfolio-data"
import Reveal from "@/components/scroll/reveal"

export default function Capabilities() {
  const total = skills.reduce((n, s) => n + s.items.length, 0)
  return (
    <section id="capabilities" aria-label="Capabilities" className="border-y border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-6 py-24 md:px-12">
        <p className="section-label mb-4">Capabilities · {total}</p>
        <h2 className="font-display text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
          What I work with
        </h2>
        <div className="mt-16 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {skills.map((group, i) => (
            <Reveal key={group.category} delay={(i % 3) * 0.06}>
              <div>
                <h3 className="section-label mb-4 text-foreground">{group.category}</h3>
                <ul className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-border bg-background px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-[var(--cork)] hover:text-foreground"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
