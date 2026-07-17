"use client"
import { stats } from "@/lib/portfolio-data"
import Reveal from "@/components/scroll/reveal"

const LINE =
  "14+ years shipping high-impact systems — real-time rig monitoring for oil & gas, blockchain and crypto platforms, and LLM/RAG AI, leading teams from concept to deployment."

export default function Statement() {
  return (
    <section id="statement" aria-label="Statement" className="mx-auto max-w-6xl px-6 py-32 md:px-12 md:py-48">
      <p className="section-label mb-10">Who I am</p>
      <Reveal>
        <p className="font-display text-[clamp(1.75rem,4.5vw,3.75rem)] font-medium leading-[1.15] tracking-tight text-foreground">
          {LINE}
        </p>
      </Reveal>
      <div className="mt-20 grid grid-cols-2 gap-8 border-t border-border pt-10 md:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.06}>
            <div>
              <div className="font-display text-4xl font-semibold text-foreground md:text-5xl">{s.value}</div>
              <div className="section-label mt-2">{s.label}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
