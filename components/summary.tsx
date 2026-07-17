import { Gauge, Radio, Rocket, Users } from "lucide-react"
import Panel from "@/components/console/panel"
import SectionHeading from "@/components/console/section-heading"

const capabilities = [
  { icon: Rocket, label: "Product delivery", sub: "concept → deployment", accent: "#e879f9" },
  { icon: Gauge, label: "Performance & scale", sub: "optimized, resilient", accent: "#22d3ee" },
  { icon: Radio, label: "Real-time systems", sub: "telemetry · streaming", accent: "#34d399" },
  { icon: Users, label: "Leadership", sub: "mentorship · CTO", accent: "#a78bfa" },
]

export default function Summary() {
  return (
    <div className="mb-14">
      <SectionHeading label="MISSION_BRIEF" title="Who am I" accent="plasma" readout="14+ YRS" />
      <Panel className="p-6 sm:p-8" grid>
        <p className="max-w-2xl text-[0.98rem] leading-relaxed text-foreground/80">
          Senior software developer with <strong className="font-semibold text-foreground">14+ years</strong>{" "}
          delivering high-impact, scalable systems — with a specialty in{" "}
          <strong className="font-semibold text-foreground">real-time monitoring</strong> for the{" "}
          <strong className="font-semibold text-foreground">oil &amp; gas</strong> sector: rig telemetry,
          live video, and WITS data at scale. Equally at home shipping{" "}
          <strong className="font-semibold text-foreground">blockchain</strong>,{" "}
          <strong className="font-semibold text-foreground">crypto exchange</strong>, and{" "}
          <strong className="font-semibold text-foreground">AI</strong> platforms, and leading teams from
          concept to deployment.
        </p>

        <div className="mt-7 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-white/[0.06] bg-white/[0.04] sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((c) => (
            <div key={c.label} className="group bg-[#0b0718]/80 p-4 transition-colors hover:bg-[#100a24]/80">
              <c.icon className="h-5 w-5" style={{ color: c.accent }} aria-hidden />
              <div className="mt-3 text-sm font-medium text-foreground">{c.label}</div>
              <div className="mono mt-0.5 text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                {c.sub}
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}
