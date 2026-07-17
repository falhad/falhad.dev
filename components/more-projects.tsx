import Panel from "@/components/console/panel"
import SectionHeading from "@/components/console/section-heading"
import { moreProjects } from "@/lib/portfolio-data"

// A dense build log — the long tail of shipped work as a monospace manifest.
export default function MoreProjects() {
  return (
    <div className="mb-14">
      <SectionHeading
        label="ARCHIVE"
        title="Build log"
        accent="flux"
        readout={`${moreProjects.length} ENTRIES`}
      />
      <Panel className="overflow-hidden">
        <div className="mono flex items-center gap-3 border-b border-white/[0.06] px-4 py-2 text-[0.6rem] uppercase tracking-widest text-muted-foreground/60">
          <span className="w-10">ID</span>
          <span className="flex-1">Project</span>
          <span className="hidden w-16 text-right sm:block">Date</span>
        </div>
        <div className="divide-y divide-white/[0.05]">
          {moreProjects.map((p, i) => (
            <div key={p.name} className="group flex items-start gap-3 px-4 py-3 transition-colors hover:bg-white/[0.03]">
              <span className="mono w-10 shrink-0 pt-0.5 text-[0.7rem] text-flux/70">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex-1">
                <div className="font-display text-sm font-medium text-foreground">{p.name}</div>
                <div className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{p.description}</div>
              </div>
              <span className="mono hidden w-16 shrink-0 pt-0.5 text-right text-[0.65rem] uppercase tracking-wider text-muted-foreground/60 sm:block">
                {p.date}
              </span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}
