import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const projects = [
  {
    name: "Sipan",
    description: "A web and mobile application for equipment inspection and lifecycle management at NIOC.",
    technologies: ["React", "React Native", "Node.js", "MongoDB"],
  },
  {
    name: "Biratex",
    description: "Cryptocurrency exchange platform for buying and selling digital currencies.",
    technologies: ["TypeScript", "MongoDB", "Spring Boot", "Kotlin"],
  },
  {
    name: "Parswater",
    description: "Blockchain-based platform for water share tokenization and trading.",
    technologies: ["Blockchain", "Smart Contracts", "React", "Node.js"],
  },
  {
    name: "RIG-AI",
    description: "AI-powered monitoring system for oil rigs, improving safety with real-time alerts.",
    technologies: ["Python", "TensorFlow", "React", "WebRTC"],
  },
]

export default function Projects() {
  return (
    <Card className="mb-8 bg-gray-800 text-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-blue-400">Featured Projects</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <Card key={index} className="bg-gray-700 hover:bg-gray-600 transition-colors">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-blue-300">{project.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, idx) => (
                    <Badge key={idx} variant="secondary" className="bg-blue-600 text-white">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

