import { ArrowUpRight } from "lucide-react"
import Panel from "@/components/console/panel"
import SectionHeading from "@/components/console/section-heading"
import { projects } from "@/lib/portfolio-data"

export default function Projects() {
  return (
    <div className="mb-14">
      <SectionHeading
        label="PROJECT_MANIFEST"
        title="Flagship builds"
        accent="plasma"
        readout={`${String(projects.length).padStart(2, "0")} FEATURED`}
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {projects.map((project, i) => {
          const demo = project.links.demo && project.links.demo !== "#" ? project.links.demo : null
          const Wrapper = demo ? "a" : "div"
          return (
            <Wrapper
              key={project.name}
              {...(demo ? { href: demo, target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group block"
            >
              <Panel
                className="h-full overflow-hidden p-5 transition-all duration-300 hover:-translate-y-0.5"
                grid
              >
                {/* accent bar */}
                <span
                  aria-hidden
                  className="absolute left-0 top-0 h-full w-[2px]"
                  style={{ background: `linear-gradient(${project.color}, transparent)` }}
                />
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="live-dot inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: project.color, color: project.color }}
                      aria-hidden
                    />
                    <div>
                      <h3 className="font-display text-lg font-semibold text-foreground">{project.name}</h3>
                      <div className="mono text-[0.65rem] uppercase tracking-widest" style={{ color: project.color }}>
                        {project.tagline}
                      </div>
                    </div>
                  </div>
                  <span className="mono text-[0.7rem] text-muted-foreground/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-foreground/70">{project.description}</p>

                <div className="mt-4 flex flex-wrap items-center gap-1.5">
                  {project.technologies.map((t) => (
                    <span
                      key={t}
                      className="mono rounded border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[0.65rem] text-foreground/75"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {demo && (
                  <div
                    className="mono mt-4 inline-flex items-center gap-1 text-xs transition-colors"
                    style={{ color: project.color }}
                  >
                    OPEN_DEMO <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>
                )}
              </Panel>
            </Wrapper>
          )
        })}
      </div>
    </div>
  )
}
