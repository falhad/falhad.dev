"use client"

import { ExternalLink, Github, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Project } from "@/lib/portfolio-data"

type Props = {
  project: Project | null
  onClose: () => void
}

// 2D overlay that slides up when a constellation node is selected.
// Lives outside the Canvas so text stays crisp and links are real DOM.
export default function ProjectDetail({ project, onClose }: Props) {
  return (
    <div
      aria-hidden={!project}
      className={`pointer-events-none absolute inset-x-0 bottom-6 z-20 flex justify-center px-4 transition-all duration-500 ${
        project ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      {project && (
        <div className="pointer-events-auto w-full max-w-lg rounded-2xl border border-white/10 bg-black/50 p-5 shadow-2xl backdrop-blur-xl">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span
                className="inline-flex h-3 w-3 rounded-full"
                style={{ backgroundColor: project.color, boxShadow: `0 0 14px ${project.color}` }}
              />
              <div>
                <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                <p className="text-xs uppercase tracking-widest text-white/50">{project.tagline}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close project details"
              className="rounded-full p-1 text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-white/75">{project.description}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {project.technologies.map((t) => (
              <Badge key={t} variant="secondary" className="bg-white/10 text-white/80 hover:bg-white/15">
                {t}
              </Badge>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            {project.links.demo && project.links.demo !== "#" && (
              <Button asChild size="sm" className="rounded-full">
                <a href={project.links.demo} target="_blank" rel="noopener noreferrer">
                  Live Demo <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                </a>
              </Button>
            )}
            {project.links.github && project.links.github !== "#" && (
              <Button asChild size="sm" variant="outline" className="rounded-full border-white/20 text-white">
                <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-1.5 h-3.5 w-3.5" /> Code
                </a>
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
