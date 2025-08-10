import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, Rocket } from "lucide-react"

const projects = [
  {
    name: "Sipan",
    description: "A web and mobile application for equipment inspection and lifecycle management at NIOC.",
    technologies: ["React", "React Native", "Node.js", "MongoDB"],
    image: "/project-placeholders/01.jpg",
    links: { demo: "#", github: "#" },
  },
  {
    name: "Biratex",
    description: "Cryptocurrency exchange platform for buying and selling digital currencies.",
    technologies: ["TypeScript", "MongoDB", "Spring Boot", "Kotlin"],
    image: "/project-placeholders/02.jpg",
    links: { demo: "#", github: "#" },
  },
  {
    name: "Parswater",
    description: "Blockchain-based platform for water share tokenization and trading.",
    technologies: ["Blockchain", "Smart Contracts", "React", "Node.js"],
    image: "/project-placeholders/03.jpg",
    links: { demo: "#", github: "#" },
  },
  {
    name: "RIG-AI",
    description: "AI-powered monitoring system for oil rigs, improving safety with real-time alerts.",
    technologies: ["Python", "TensorFlow", "React", "WebRTC"],
    image: "/project-placeholders/04.jpg",
    links: { demo: "#", github: "#" },
  },
]

export default function Projects() {
  return (
      <Card className="mb-8 border border-border bg-card/60 backdrop-blur-sm">

      <CardHeader className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-fuchsia-500/20 to-cyan-500/20 ring-1 ring-border">
            <Rocket className="h-5 w-5 text-fuchsia-400" aria-hidden />
          </div>
          <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">Featured Projects</CardTitle>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" aria-hidden />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <Card key={index} className="overflow-hidden border-border bg-card/60 backdrop-blur shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl hover:-translate-y-0.5">
              <div className="relative aspect-[16/9] bg-gradient-to-br from-fuchsia-500/10 to-cyan-500/10">
                {/* Replace with real images placed in public/ */}
                <Image
                  src={project.image}
                  alt={`${project.name} screenshot`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">{project.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, idx) => (
                    <Badge key={idx} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  {project.links?.demo && (
                    <Button asChild size="sm" variant="outline" className="rounded-full">
                      <a href={project.links.demo} target="_blank" rel="noopener noreferrer">
                        Live Demo <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {project.links?.github && (
                    <Button asChild size="sm" variant="ghost" className="rounded-full">
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

