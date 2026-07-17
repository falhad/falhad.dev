import { Boxes, Code2, Cpu, Network, Radio } from "lucide-react"
import Panel from "@/components/console/panel"
import SectionHeading from "@/components/console/section-heading"
import { skills } from "@/lib/portfolio-data"

const META: Record<string, { accent: string; icon: typeof Code2; code: string }> = {
  "Programming Languages": { accent: "#e879f9", icon: Code2, code: "LANG" },
  Frameworks: { accent: "#22d3ee", icon: Boxes, code: "FRWK" },
  "Tools And DB's": { accent: "#34d399", icon: Cpu, code: "INFRA" },
  Networking: { accent: "#f59e0b", icon: Network, code: "NET" },
  General: { accent: "#a78bfa", icon: Radio, code: "CORE" },
}

// A live equalizer readout — the telemetry motif that ties the whole console to
// Farhad's real-time-systems career. Purely ambient; encodes no claimed metric.
function Equalizer({ color }: { color: string }) {
  const bars = [0, 0.2, 0.45, 0.15, 0.35, 0.6, 0.25]
  return (
    <div className="flex h-4 items-end gap-[3px]" aria-hidden>
      {bars.map((delay, i) => (
        <span
          key={i}
          className="signal-anim w-[3px] rounded-sm"
          style={{ height: "100%", backgroundColor: color, animationDelay: `${delay}s`, transformOrigin: "bottom" }}
        />
      ))}
    </div>
  )
}

export default function Skills() {
  return (
    <div className="mb-14">
      <SectionHeading
        label="SKILL_MATRIX"
        title="Systems & signals"
        accent="signal"
        readout={`${skills.reduce((n, s) => n + s.items.length, 0)} CHANNELS`}
      />
      <div className="grid grid-cols-1 gap-4">
        {skills.map((cat) => {
          const meta = META[cat.category] ?? { accent: "#a78bfa", icon: Radio, code: "SYS" }
          const Icon = meta.icon
          return (
            <Panel key={cat.category} className="p-5">
              <div className="mb-4 flex items-center gap-3">
                <span
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border"
                  style={{ borderColor: `${meta.accent}44`, backgroundColor: `${meta.accent}14` }}
                >
                  <Icon className="h-4 w-4" style={{ color: meta.accent }} />
                </span>
                <div>
                  <div className="font-display text-base font-semibold text-foreground">{cat.category}</div>
                  <div className="mono text-[0.65rem] uppercase tracking-widest" style={{ color: meta.accent }}>
                    CH_{meta.code}
                  </div>
                </div>
                <div className="ml-auto">
                  <Equalizer color={meta.accent} />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {cat.items.map((skill) => (
                  <span
                    key={skill}
                    className="mono rounded border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-xs text-foreground/85 transition-colors"
                    style={{ ["--tw-ring-color" as string]: meta.accent }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </Panel>
          )
        })}
      </div>
    </div>
  )
}
