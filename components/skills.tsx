import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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

export default function Skills() {
  return (
    <Card className="mb-8 bg-gray-800 text-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-blue-400">Skills & Expertise</CardTitle>
      </CardHeader>
      <CardContent>
        {skills.map((skillCategory, index) => (
          <div key={index} className="mb-4 last:mb-0">
            <h3 className="text-lg font-semibold text-blue-300 mb-2">{skillCategory.category}</h3>
            <div className="flex flex-wrap gap-2">
              {skillCategory.items.map((skill, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="bg-gray-700 text-blue-200 hover:bg-gray-600 transition-colors"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

