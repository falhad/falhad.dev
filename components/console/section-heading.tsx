import { cn } from "@/lib/utils"

export type Accent = "plasma" | "ion" | "flux" | "signal" | "amber"

export const ACCENT_HEX: Record<Accent, string> = {
  plasma: "#e879f9",
  ion: "#22d3ee",
  flux: "#a78bfa",
  signal: "#34d399",
  amber: "#f59e0b",
}

type Props = {
  /** Monospace system label, e.g. EXPERIENCE_LOG. */
  label: string
  /** Human title in the display face. */
  title: string
  /** Optional right-aligned monospace readout (e.g. a count or coordinate). */
  readout?: string
  accent?: Accent
  className?: string
}

// The console vernacular that opens every section: a live status dot, a
// monospace system label, a hairline bus line, and a display-face title.
export default function SectionHeading({ label, title, readout, accent = "plasma", className }: Props) {
  const hex = ACCENT_HEX[accent]
  return (
    <div className={cn("mb-6", className)}>
      <div className="flex items-center gap-3">
        <span
          className="live-dot inline-block h-2 w-2 rounded-full"
          style={{ backgroundColor: hex, color: hex }}
          aria-hidden
        />
        <span className="eyebrow" style={{ color: hex }}>
          {label}
        </span>
        <span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" aria-hidden />
        {readout && <span className="mono text-[0.7rem] text-muted-foreground">{readout}</span>}
      </div>
      <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h2>
    </div>
  )
}
