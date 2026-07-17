import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, Rocket } from "lucide-react"
import { projects } from "@/lib/portfolio-data"

export default function Projects() {
  return (
    <Card className="mb-8 border border-border bg-card/60 backdrop-blur-sm">
      <CardHeader className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-fuchsia-500/20 to-cyan-500/20 ring-1 ring-border">
            <Rocket className="h-5 w-5 text-fuchsia-400" aria-hidden />
          </div>
          <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
            Featured Projects
          </CardTitle>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" aria-hidden />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <Card
              key={project.name}
              className="group overflow-hidden rounded-2xl border-border bg-card/60 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              {/* Themed tile echoing the project's node color from the 3D scene */}
              <div
                className="relative aspect-[16/9] overflow-hidden"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${project.color}40, transparent 60%), radial-gradient(circle at 75% 75%, ${project.color}25, transparent 55%)`,
                }}
              >
                <div
                  className="absolute left-4 top-4 h-3 w-3 rounded-full transition-transform duration-300 group-hover:scale-150"
                  style={{ backgroundColor: project.color, boxShadow: `0 0 16px ${project.color}` }}
                />
                <span className="absolute bottom-3 right-4 text-xs uppercase tracking-widest text-foreground/50">
                  {project.tagline}
                </span>
              </div>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">{project.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-muted-foreground">{project.description}</p>
                <div className="mb-4 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  {project.links.demo && (
                    <Button asChild size="sm" variant="outline" className="rounded-full">
                      <a href={project.links.demo} target="_blank" rel="noopener noreferrer">
                        Live Demo <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {project.links.github && (
                    <Button asChild size="sm" variant="outline" className="rounded-full">
                      <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 h-4 w-4" /> Code
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
