import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Boxes, Code2, Network, Sparkles, Wrench } from "lucide-react"

const skills = [
  {
    category: "General",
    items: ["System Design", "Test Driven Development", "Jira", "Micro-Services"],
  },
  {
    category: "Programming Languages",
    items: ["Java", "Kotlin", "Python", "Rust", "TypeScript", "JavaScript", "PHP"],
  },
  {
    category: "Frameworks",
    items: ["Spring Boot", "React.js", "Next.js", "Jetpack Compose", "Laravel", "Express.js"],
  },
  {
    category: "Tools And DB's",
    items: ["Git", "Docker", "CI/CD", "PostgreSQL", "MongoDB", "Redis"],
  },
  {
    category: "Networking",
    items: [
      "CCNP-level expertise",
      "Network Administration",
      "Socket Programming",
      "Netty",
      "Socket.io",
      "WebRTC",
      "Video Optimization",
    ],
  },
]

function CategoryIcon({ name }: { name: string }) {
  const base = "h-5 w-5 text-primary/80";
  switch (name) {
    case "Programming Languages":
      return <Code2 className={base} />
    case "Frameworks":
      return <Boxes className={base} />
    case "Tools And DB's":
      return <Wrench className={base} />
    case "Networking":
      return <Network className={base} />
    case "General":
    default:
      return <Sparkles className={base} />
  }
}

export default function Skills() {
  return (
      <Card className="mb-8 border border-border bg-card/60 backdrop-blur-sm">

      <CardHeader className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-fuchsia-500/20 to-cyan-500/20 ring-1 ring-border">
            <Sparkles className="h-5 w-5 text-fuchsia-400" aria-hidden />
          </div>
          <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">Skills & Expertise</CardTitle>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" aria-hidden />
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-1">
          {skills.map((skillCategory, index) => (
            <div
              key={index}
              className="rounded-lg border bg-muted/30 p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-2 flex items-center gap-2">
                <CategoryIcon name={skillCategory.category} />
                <h3 className="text-lg font-semibold text-primary leading-tight">
                  {skillCategory.category}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {skillCategory.items.map((skill, idx) => (
                  <Badge key={idx} variant="secondary" className="gap-1.5">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

