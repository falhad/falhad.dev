import { CheckCircle2, MapPin } from "lucide-react"
import Panel from "@/components/console/panel"
import SectionHeading from "@/components/console/section-heading"
import { experiences } from "@/lib/portfolio-data"

export default function Experience() {
  return (
    <div className="mb-14">
      <SectionHeading
        label="EXPERIENCE_LOG"
        title="Career trajectory"
        accent="ion"
        readout={`${experiences.length} STATIONS`}
      />
      <Panel className="p-6 sm:p-8">
        <div className="relative pl-6">
          {/* Signal rail */}
          <div
            aria-hidden
            className="absolute left-[3px] top-1 bottom-1 w-px bg-gradient-to-b from-white/25 via-white/10 to-transparent"
          />
          {experiences.map((exp, i) => {
            const color = exp.color ?? "#e879f9"
            return (
              <div key={i} className="relative mb-8 last:mb-0">
                {/* Station dot */}
                <span
                  className="absolute -left-6 top-1.5 inline-flex h-2.5 w-2.5 items-center justify-center rounded-full"
                  style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
                  aria-hidden
                />
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="font-display text-lg font-semibold text-foreground">{exp.position}</h3>
                  <span className="mono text-sm" style={{ color }}>
                    @ {exp.company}
                  </span>
                  <span className="mono ml-auto text-[0.7rem] uppercase tracking-widest text-muted-foreground">
                    {exp.date}
                  </span>
                </div>
                {exp.location && (
                  <div className="mono mt-1 flex items-center gap-1 text-[0.7rem] text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {exp.location}
                  </div>
                )}
                <ul className="mt-3 space-y-1.5">
                  {exp.responsibilities.map((r, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm leading-relaxed text-foreground/70">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color }} />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </Panel>
    </div>
  )
}
