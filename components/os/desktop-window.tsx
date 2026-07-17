"use client"
import { useRef } from "react"
import { cn } from "@/lib/utils"

export type WinProps = {
  id: string
  title: string
  x: number
  y: number
  z: number
  width: number
  focused: boolean
  onFocus: (id: string) => void
  onClose: (id: string) => void
  onMinimize: (id: string) => void
  onMove: (id: string, x: number, y: number) => void
  children: React.ReactNode
}

// A draggable, focusable macOS window. Position/z-index are owned by the
// desktop's window manager; dragging reports back via onMove.
export default function DesktopWindow({
  id,
  title,
  x,
  y,
  z,
  width,
  focused,
  onFocus,
  onClose,
  onMinimize,
  onMove,
  children,
}: WinProps) {
  const drag = useRef<{ dx: number; dy: number } | null>(null)

  const onBarDown = (e: React.PointerEvent) => {
    onFocus(id)
    drag.current = { dx: e.clientX - x, dy: e.clientY - y }
    ;(e.currentTarget as Element).setPointerCapture(e.pointerId)
  }
  const onBarMove = (e: React.PointerEvent) => {
    if (!drag.current) return
    onMove(id, e.clientX - drag.current.dx, e.clientY - drag.current.dy)
  }
  const onBarUp = () => {
    drag.current = null
  }

  return (
    <div
      className={cn(
        "absolute flex max-h-[78vh] flex-col overflow-hidden rounded-xl border bg-[#1c1a17]/95 backdrop-blur-xl transition-shadow",
        focused
          ? "border-white/15 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.95)]"
          : "border-white/8 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)]",
      )}
      style={{ left: x, top: y, width, zIndex: z }}
      onPointerDown={() => onFocus(id)}
    >
      {/* Title bar (drag handle) */}
      <div
        className="flex shrink-0 cursor-grab items-center gap-3 border-b border-white/10 bg-white/[0.04] px-4 py-2.5 active:cursor-grabbing"
        onPointerDown={onBarDown}
        onPointerMove={onBarMove}
        onPointerUp={onBarUp}
      >
        <div className="group flex items-center gap-2">
          <button
            aria-label="Close"
            onClick={(e) => { e.stopPropagation(); onClose(id) }}
            className="flex h-3 w-3 items-center justify-center rounded-full bg-[#ff5f57] text-[8px] text-black/50"
          >
            <span className="opacity-0 group-hover:opacity-100">✕</span>
          </button>
          <button
            aria-label="Minimize"
            onClick={(e) => { e.stopPropagation(); onMinimize(id) }}
            className="flex h-3 w-3 items-center justify-center rounded-full bg-[#febc2e] text-[8px] text-black/50"
          >
            <span className="opacity-0 group-hover:opacity-100">−</span>
          </button>
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="flex-1 truncate text-center text-sm font-medium text-foreground/80">{title}</span>
        <span className="w-12 shrink-0" />
      </div>

      {/* Body */}
      <div className="min-h-0 flex-1 overflow-auto overscroll-contain">{children}</div>
    </div>
  )
}
