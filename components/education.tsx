import { GraduationCap } from "lucide-react"
import Panel from "@/components/console/panel"
import SectionHeading from "@/components/console/section-heading"
import { education } from "@/lib/portfolio-data"

export default function Education() {
  return (
    <div className="mb-14">
      <SectionHeading label="EDUCATION" title="Training" accent="flux" />
      <Panel className="divide-y divide-white/[0.06]">
        {education.map((edu, i) => (
          <div key={i} className="p-5">
            <div className="flex items-start gap-3">
              <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-flux" aria-hidden />
              <div>
                <h3 className="font-display text-sm font-semibold leading-snug text-foreground">{edu.degree}</h3>
                <div className="mono mt-1.5 text-[0.7rem] text-muted-foreground">{edu.institution}</div>
                <div className="mono mt-0.5 text-[0.65rem] uppercase tracking-widest text-muted-foreground/70">
                  {edu.location} · {edu.date}
                </div>
              </div>
            </div>
          </div>
        ))}
      </Panel>
    </div>
  )
}
