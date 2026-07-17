"use client"
import { cn } from "@/lib/utils"

// A macOS-style window chrome: traffic lights + title bar + body. Used to frame
// every content section as an app "inside the screen".
export default function MacWindow({
  title,
  subtitle,
  toolbar,
  children,
  className,
  bodyClassName,
}: {
  title: string
  subtitle?: string
  toolbar?: React.ReactNode
  children: React.ReactNode
  className?: string
  bodyClassName?: string
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-white/10 bg-[#1c1a17]/90 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] backdrop-blur-xl",
        className,
      )}
    >
      {/* Title bar */}
      <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.04] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 text-center">
          <span className="text-sm font-medium text-foreground/80">{title}</span>
          {subtitle ? <span className="ml-2 text-xs text-muted-foreground">{subtitle}</span> : null}
        </div>
        <div className="w-14 shrink-0 text-right">{toolbar}</div>
      </div>
      <div className={cn("", bodyClassName)}>{children}</div>
    </div>
  )
}
