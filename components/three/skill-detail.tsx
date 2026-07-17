"use client"

import { ArrowUpRight, Briefcase, Rocket, X } from "lucide-react"
import type { SkillPlanet } from "@/lib/portfolio-data"
import { projects } from "@/lib/portfolio-data"

type Props = {
  planet: SkillPlanet | null
  onClose: () => void
}

// 2D overlay: clicking a skill planet reveals the projects shipped with it and
// the roles where it was applied.
export default function SkillDetail({ planet, onClose }: Props) {
  const linked = planet ? projects.filter((p) => planet.projects.includes(p.name)) : []

  return (
    <div
      aria-hidden={!planet}
      className={`pointer-events-none absolute inset-x-0 bottom-10 z-20 flex justify-center px-4 transition-all duration-500 ${
        planet ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      {planet && (
        <div className="pointer-events-auto max-h-[52vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-white/12 bg-black/55 p-5 shadow-2xl backdrop-blur-xl">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span
                className="mt-1 inline-flex h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: planet.color, boxShadow: `0 0 14px ${planet.color}` }}
              />
              <div>
                <div className="mono text-[0.6rem] uppercase tracking-[0.2em]" style={{ color: planet.color }}>
                  {planet.code}
                </div>
                <h3 className="font-display text-lg font-semibold leading-tight text-white">{planet.name}</h3>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="rounded-full p-1 text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-white/75">{planet.blurb}</p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {planet.tech.map((t) => (
              <span
                key={t}
                className="mono rounded border border-white/12 bg-white/5 px-2 py-0.5 text-[0.65rem] text-white/80"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {linked.length > 0 && (
              <div>
                <div className="mono mb-2 flex items-center gap-1.5 text-[0.6rem] uppercase tracking-widest text-white/45">
                  <Rocket className="h-3 w-3" /> Projects
                </div>
                <div className="space-y-2">
                  {linked.map((p) => {
                    const demo = p.links.demo && p.links.demo !== "#" ? p.links.demo : null
                    const Wrapper = demo ? "a" : "div"
                    return (
                      <Wrapper
                        key={p.name}
                        {...(demo ? { href: demo, target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="group flex items-start gap-2 rounded-md border border-white/8 bg-white/[0.03] p-2.5 transition-colors hover:bg-white/[0.06]"
                      >
                        <span
                          className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: p.color }}
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1 text-sm font-medium text-white">
                            {p.name}
                            {demo && <ArrowUpRight className="h-3 w-3 text-white/40 group-hover:text-white" />}
                          </div>
                          <div className="mono text-[0.6rem] uppercase tracking-wider text-white/45">{p.tagline}</div>
                        </div>
                      </Wrapper>
                    )
                  })}
                </div>
              </div>
            )}

            <div>
              <div className="mono mb-2 flex items-center gap-1.5 text-[0.6rem] uppercase tracking-widest text-white/45">
                <Briefcase className="h-3 w-3" /> Experience
              </div>
              <div className="space-y-2">
                {planet.roles.map((r) => (
                  <div key={r.company} className="rounded-md border border-white/8 bg-white/[0.03] p-2.5">
                    <div className="text-sm font-medium text-white" style={{ color: planet.color }}>
                      {r.company}
                    </div>
                    <div className="mt-0.5 text-xs leading-relaxed text-white/70">{r.note}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
