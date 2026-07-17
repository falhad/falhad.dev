"use client"
import { moreProjects } from "@/lib/portfolio-data"

export default function BuildLog() {
  return (
    <details className="group mt-12 rounded-2xl border border-border bg-secondary/40 p-6">
      <summary className="section-label flex cursor-pointer list-none items-center justify-between" data-cursor="toggle">
        <span>Build log · {moreProjects.length} more</span>
        <span className="transition-transform group-open:rotate-45">+</span>
      </summary>
      <ul className="mt-6 divide-y divide-border">
        {moreProjects.map((m) => (
          <li key={m.name} className="flex flex-col gap-1 py-4 md:flex-row md:items-baseline md:gap-6">
            <div className="flex w-full items-baseline justify-between md:w-56 md:shrink-0">
              <span className="font-display font-medium text-foreground">{m.name}</span>
              <span className="section-label">{m.date}</span>
            </div>
            <p className="text-sm text-muted-foreground">{m.description}</p>
          </li>
        ))}
      </ul>
    </details>
  )
}
