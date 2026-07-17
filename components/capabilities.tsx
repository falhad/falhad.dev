"use client"
import { skills } from "@/lib/portfolio-data"
import Reveal from "@/components/scroll/reveal"

// A warm gradient per category so the "app icons" read as a set.
const TINTS = [
  "from-[#c2703a] to-[#8a3f22]",
  "from-[#3a6ea5] to-[#22406a]",
  "from-[#5a8f3a] to-[#31502040]",
  "from-[#8a5ac2] to-[#4a2f6a]",
  "from-[#c2a23a] to-[#6a5320]",
  "from-[#3aa0a5] to-[#20505a]",
]

export default function Capabilities() {
  const total = skills.reduce((n, s) => n + s.items.length, 0)
  return (
    <section id="capabilities" aria-label="Capabilities" className="mx-auto max-w-6xl px-6 py-24 md:px-12">
      <p className="section-label mb-4">Launchpad · {total} tools</p>
      <h2 className="font-display text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
        What I work with
      </h2>

      {/* Launchpad-style frosted panel of app icons */}
      <Reveal>
        <div className="mt-14 rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl md:p-12">
          <div className="grid gap-y-12">
            {skills.map((group, gi) => (
              <div key={group.category}>
                <h3 className="section-label mb-6 text-center text-foreground">{group.category}</h3>
                <div className="grid grid-cols-3 gap-x-4 gap-y-8 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7">
                  {group.items.map((item) => (
                    <div key={item} className="group flex cursor-default flex-col items-center gap-2" data-cursor="">
                      <div
                        className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${TINTS[gi % TINTS.length]} shadow-lg transition-transform duration-200 group-hover:-translate-y-1`}
                      >
                        <span className="text-lg font-semibold text-white/90">{item.slice(0, 2)}</span>
                      </div>
                      <span className="text-center text-xs leading-tight text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}
