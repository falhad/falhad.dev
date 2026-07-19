"use client"
import { profile } from "@/lib/portfolio-data"

// Print / Download / Back controls for the résumé page. Hidden when printing.
export default function ResumeActions() {
  return (
    <div className="no-print flex flex-wrap items-center gap-3">
      <a
        href="/files/cv.pdf"
        download
        className="rounded-full bg-[var(--terracotta)] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        ↓ Download PDF
      </a>
      <button
        type="button"
        onClick={() => window.print()}
        className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:border-[var(--terracotta)] hover:text-foreground"
      >
        ⌘P Print
      </button>
      <a
        href={profile.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:border-[var(--terracotta)] hover:text-foreground"
      >
        in/ LinkedIn
      </a>
      <a
        href="/"
        className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:border-[var(--terracotta)] hover:text-foreground"
      >
        ← Interactive site
      </a>
    </div>
  )
}
