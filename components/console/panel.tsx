import { cn } from "@/lib/utils"

type Props = {
  children: React.ReactNode
  className?: string
  /** Draw HUD corner brackets (default true). */
  corners?: boolean
  /** Optional faint technical grid inside the panel. */
  grid?: boolean
}

// A HUD panel: dark glass with a hairline border and instrument-style corner
// brackets. The unit of the console layout, replacing generic cards.
export default function Panel({ children, className, corners = true, grid = false }: Props) {
  return (
    <div className={cn("panel", className)}>
      {grid && <div aria-hidden className="grid-fade pointer-events-none absolute inset-0 rounded-lg" />}
      {corners && (
        <>
          <span aria-hidden className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l border-t border-white/25" />
          <span aria-hidden className="pointer-events-none absolute right-0 top-0 h-3 w-3 border-r border-t border-white/25" />
          <span aria-hidden className="pointer-events-none absolute bottom-0 left-0 h-3 w-3 border-b border-l border-white/25" />
          <span aria-hidden className="pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b border-r border-white/25" />
        </>
      )}
      <div className="relative">{children}</div>
    </div>
  )
}
