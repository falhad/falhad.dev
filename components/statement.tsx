"use client"
import { stats, profile } from "@/lib/portfolio-data"
import Reveal from "@/components/scroll/reveal"
import MacWindow from "@/components/os/mac-window"

const LINE =
  "14+ years shipping high-impact systems — real-time rig monitoring for oil & gas, blockchain and crypto platforms, and LLM/RAG AI, leading teams from concept to deployment."

export default function Statement() {
  return (
    <section id="statement" aria-label="Statement" className="mx-auto max-w-6xl px-6 py-28 md:px-12">
      <p className="section-label mb-4">Notes · About</p>
      <h2 className="font-display text-4xl font-semibold tracking-tight text-foreground md:text-6xl">Who I am</h2>

      <Reveal>
        <MacWindow title="Notes" className="mt-14">
          <div className="grid md:grid-cols-[210px_1fr]">
            {/* Notes sidebar */}
            <aside className="hidden border-r border-white/10 bg-white/[0.02] p-3 md:block">
              <p className="section-label px-2 pb-2">iCloud</p>
              <div className="rounded-lg bg-[var(--terracotta)]/20 px-3 py-2">
                <p className="text-sm font-medium text-foreground">About Me</p>
                <p className="truncate text-xs text-muted-foreground">Senior Software Developer…</p>
              </div>
              <div className="mt-1 rounded-lg px-3 py-2 hover:bg-white/[0.04]">
                <p className="text-sm text-foreground/80">Highlights</p>
                <p className="truncate text-xs text-muted-foreground">14+ yrs · 20+ projects…</p>
              </div>
            </aside>

            {/* Note body */}
            <div className="p-8 md:p-10">
              <p className="text-center text-xs text-muted-foreground">{profile.location}</p>
              <h3 className="mt-4 font-display text-2xl font-semibold text-foreground">About Me</h3>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{LINE}</p>

              <p className="mt-8 font-medium text-foreground">Highlights</p>
              <div className="mt-4 grid grid-cols-2 gap-6 sm:grid-cols-4">
                {stats.map((s) => (
                  <div key={s.label}>
                    <div className="font-display text-3xl font-semibold text-foreground">{s.value}</div>
                    <div className="section-label mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </MacWindow>
      </Reveal>
    </section>
  )
}
