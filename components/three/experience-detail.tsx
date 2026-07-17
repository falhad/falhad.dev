"use client"

import { Building2, Calendar, CheckCircle2, MapPin, X } from "lucide-react"
import type { Experience } from "@/lib/portfolio-data"

type Props = {
  exp: Experience | null
  onClose: () => void
}

// 2D overlay that slides up when a timeline node is selected — one career chapter.
export default function ExperienceDetail({ exp, onClose }: Props) {
  return (
    <div
      aria-hidden={!exp}
      className={`pointer-events-none absolute inset-x-0 bottom-6 z-20 flex justify-center px-4 transition-all duration-500 ${
        exp ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      {exp && (
        <div className="pointer-events-auto max-h-[46vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-white/10 bg-black/50 p-5 shadow-2xl backdrop-blur-xl">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span
                className="mt-1 inline-flex h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: exp.color, boxShadow: `0 0 14px ${exp.color}` }}
              />
              <div>
                <h3 className="text-lg font-semibold leading-tight text-white">{exp.position}</h3>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-white/60">
                  <span className="inline-flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5" /> {exp.company}
                  </span>
                  {exp.location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" /> {exp.location}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> {exp.date}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close chapter details"
              className="rounded-full p-1 text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <ul className="mt-4 space-y-2">
            {exp.responsibilities.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-white/75">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-fuchsia-400" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
