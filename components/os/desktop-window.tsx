"use client"
import { useEffect, useRef, useState } from "react"
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
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const [max, setMax] = useState(false)
  const stop = (e: React.PointerEvent) => e.stopPropagation() // keep drag off the buttons

  // Resize: track width/height locally; height stays auto until first resize.
  const winRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<{ w: number; h: number | null }>({ w: width, h: null })
  const resize = useRef<{ sx: number; sy: number; sw: number; sh: number; dir: string } | null>(null)
  const onResizeDown = (dir: string) => (e: React.PointerEvent) => {
    e.stopPropagation()
    onFocus(id)
    resize.current = { sx: e.clientX, sy: e.clientY, sw: size.w, sh: winRef.current?.offsetHeight ?? 400, dir }
    ;(e.currentTarget as Element).setPointerCapture(e.pointerId)
  }
  const onResizeMove = (e: React.PointerEvent) => {
    if (!resize.current) return
    const { sx, sy, sw, sh, dir } = resize.current
    setSize((s) => ({
      w: dir.includes("e") ? Math.max(340, Math.min(sw + (e.clientX - sx), window.innerWidth - 24)) : s.w,
      h: dir.includes("s") ? Math.max(240, Math.min(sh + (e.clientY - sy), window.innerHeight - 96)) : s.h,
    }))
  }
  const onResizeUp = () => {
    resize.current = null
  }

  // Genie-ish open: grow up from the dock (bottom), settle with a spring.
  useEffect(() => {
    const r = requestAnimationFrame(() => setOpen(true))
    return () => cancelAnimationFrame(r)
  }, [])

  const handleClose = () => {
    setClosing(true)
    setTimeout(() => onClose(id), 240)
  }

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
      ref={winRef}
      className={cn(
        "absolute flex max-h-[80vh] flex-col overflow-hidden rounded-[22px] border backdrop-blur-2xl transition-shadow",
        focused
          ? "border-white/20 bg-[#17140f]/55 shadow-[0_50px_140px_-30px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.22)]"
          : "border-white/10 bg-[#17140f]/45 shadow-[0_24px_70px_-30px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)]",
      )}
      style={{
        ...(max
          ? { left: 12, top: 44, width: "calc(100vw - 24px)", height: "calc(100vh - 128px)", maxHeight: "none" as const }
          : {
              left: x,
              top: y,
              width: size.w,
              height: size.h ?? undefined,
              maxHeight: size.h != null ? ("none" as const) : undefined,
            }),
        zIndex: z,
        transformOrigin: "center bottom",
        transform: closing
          ? "translateY(30vh) scale(0.45)"
          : open
            ? "translateY(0) scale(1)"
            : "translateY(34vh) scale(0.5)",
        opacity: closing ? 0 : open ? 1 : 0,
        transition: "transform 380ms cubic-bezier(.16,.9,.28,1.1), opacity 260ms ease-out",
      }}
      onPointerDown={() => onFocus(id)}
    >
      {/* Liquid-glass sheen */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[22px] bg-gradient-to-b from-white/[0.08] via-transparent to-transparent"
      />

      {/* Title bar (drag handle) */}
      <div
        className="relative flex shrink-0 cursor-grab items-center gap-3 border-b border-white/[0.08] bg-white/[0.06] px-4 py-2.5 active:cursor-grabbing"
        onPointerDown={onBarDown}
        onPointerMove={onBarMove}
        onPointerUp={onBarUp}
      >
        <div className="group flex items-center gap-2">
          <button
            aria-label="Close"
            onPointerDown={stop}
            onClick={(e) => { e.stopPropagation(); handleClose() }}
            className="flex h-3 w-3 items-center justify-center rounded-full bg-[#ff5f57] text-[8px] font-bold text-black/60"
          >
            <span className="opacity-0 group-hover:opacity-100">✕</span>
          </button>
          <button
            aria-label="Minimize"
            onPointerDown={stop}
            onClick={(e) => { e.stopPropagation(); onMinimize(id) }}
            className="flex h-3 w-3 items-center justify-center rounded-full bg-[#febc2e] text-[9px] font-bold text-black/60"
          >
            <span className="opacity-0 group-hover:opacity-100">−</span>
          </button>
          <button
            aria-label="Zoom"
            onPointerDown={stop}
            onClick={(e) => { e.stopPropagation(); setMax((m) => !m) }}
            className="flex h-3 w-3 items-center justify-center rounded-full bg-[#28c840] text-[7px] font-bold text-black/60"
          >
            <span className="opacity-0 group-hover:opacity-100">{max ? "–" : "+"}</span>
          </button>
        </div>
        <span className="flex-1 truncate text-center text-sm font-medium text-foreground/80">{title}</span>
        <span className="w-12 shrink-0" />
      </div>

      {/* Body — data-lenis-prevent lets it scroll natively despite smooth scroll */}
      <div data-lenis-prevent className="relative min-h-0 flex-1 overflow-auto overscroll-contain">
        {children}
      </div>

      {/* Resize handles (hidden when maximized) */}
      {!max ? (
        <>
          <div
            onPointerDown={onResizeDown("e")}
            onPointerMove={onResizeMove}
            onPointerUp={onResizeUp}
            className="absolute right-0 top-10 z-20 h-[calc(100%-2.5rem)] w-2 cursor-ew-resize"
            style={{ touchAction: "none" }}
          />
          <div
            onPointerDown={onResizeDown("s")}
            onPointerMove={onResizeMove}
            onPointerUp={onResizeUp}
            className="absolute bottom-0 left-0 z-20 h-2 w-full cursor-ns-resize"
            style={{ touchAction: "none" }}
          />
          <div
            onPointerDown={onResizeDown("se")}
            onPointerMove={onResizeMove}
            onPointerUp={onResizeUp}
            className="absolute bottom-0 right-0 z-30 h-4 w-4 cursor-nwse-resize"
            style={{ touchAction: "none" }}
          />
        </>
      ) : null}
    </div>
  )
}
