import { BadgeCheck, ExternalLink } from "lucide-react"
import Panel from "@/components/console/panel"
import SectionHeading from "@/components/console/section-heading"
import { certifications } from "@/lib/portfolio-data"

export default function Certifications() {
  return (
    <div className="mb-14">
      <SectionHeading label="CREDENTIALS" title="Certifications" accent="ion" />
      <Panel className="divide-y divide-white/[0.06]">
        {certifications.map((cert) => (
          <a
            key={cert.name}
            href={cert.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 p-4 transition-colors hover:bg-white/[0.03]"
          >
            <BadgeCheck className="h-4 w-4 shrink-0 text-ion" aria-hidden />
            <div className="min-w-0">
              <div className="font-display text-sm font-semibold text-foreground">{cert.name}</div>
              <div className="mono truncate text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                {cert.label}
              </div>
            </div>
            <ExternalLink className="ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground/50 transition group-hover:text-ion" />
          </a>
        ))}
      </Panel>
    </div>
  )
}
