import { Trophy, ExternalLink } from "lucide-react"
import Panel from "@/components/console/panel"
import SectionHeading from "@/components/console/section-heading"
import { awards } from "@/lib/portfolio-data"

export default function Awards() {
  return (
    <div className="mb-14">
      <SectionHeading label="AWARDS" title="Recognition" accent="amber" />
      <Panel className="divide-y divide-white/[0.06]">
        {awards.map((award) => {
          const Wrapper = award.url ? "a" : "div"
          return (
            <Wrapper
              key={award.title}
              {...(award.url
                ? { href: award.url, target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="group flex items-start gap-3 p-4 transition-colors hover:bg-white/[0.03]"
            >
              <Trophy className="mt-0.5 h-4 w-4 shrink-0 text-amber" aria-hidden />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-display text-sm font-semibold text-foreground">{award.title}</span>
                  {award.years && (
                    <span className="mono text-[0.65rem] text-muted-foreground">{award.years.join(" / ")}</span>
                  )}
                </div>
                {award.description && (
                  <div className="mono mt-0.5 text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                    {award.description}
                  </div>
                )}
              </div>
              {award.url && (
                <ExternalLink className="ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground/50 transition group-hover:text-amber" />
              )}
            </Wrapper>
          )
        })}
      </Panel>
    </div>
  )
}
