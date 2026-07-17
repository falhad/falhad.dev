import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Boxes, ExternalLink } from "lucide-react"
import { moreProjects } from "@/lib/portfolio-data"

// The long tail of shipped work from the CV — a dense, scannable grid that
// complements the flagship projects featured in the 3D constellation.
export default function MoreProjects() {
  return (
    <Card className="mb-8 border border-border bg-card/60 backdrop-blur-sm">
      <CardHeader className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-fuchsia-500/20 to-cyan-500/20 ring-1 ring-border">
            <Boxes className="h-5 w-5 text-fuchsia-400" aria-hidden />
          </div>
          <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
            More Projects
          </CardTitle>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" aria-hidden />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {moreProjects.map((p) => (
            <div
              key={p.name}
              className="group rounded-xl border border-border/60 bg-card/50 p-4 transition hover:border-fuchsia-400/40 hover:bg-card/70"
            >
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-semibold text-foreground">
                  {p.url ? (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:text-fuchsia-400"
                    >
                      {p.name}
                      <ExternalLink className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
                    </a>
                  ) : (
                    p.name
                  )}
                </h3>
                <span className="shrink-0 text-xs uppercase tracking-widest text-foreground/40">{p.date}</span>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
