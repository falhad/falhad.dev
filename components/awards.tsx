import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const awards = [
  {
    title: "ACM",
    description: "International Collegiate Programming Contest",
    years: ["2013", "2014"],
    url: "https://icpc.global/",
  },
  {
    title: "JavaCup",
    description: "JCal Contest",
    url: "http://javacup.ir/jcal-second-series-ranking/",
  },
  {
    title: "Security Cert",
    url: "https://drive.google.com/file/d/1bmeJ-Hubz-ovqnJO4WK2s0GcQCj9-jT6/view?usp=drive_link",
  },
]

export default function Awards() {
  return (
    <Card className="mb-8 bg-gray-800 text-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-blue-400">Awards & Achievements</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {awards.map((award, index) => (
            <li key={index} className="flex flex-col">
              <strong className="text-blue-300">{award.title}</strong>
              {award.description && <span className="text-gray-400">{award.description}</span>}
              {award.years && (
                <Badge variant="secondary" className="mt-1 bg-gray-700 text-blue-200">
                  {award.years.join(", ")}
                </Badge>
              )}
              {award.url && (
                <a href={award.url} target="_blank" rel="noopener noreferrer" className="mt-2">
                  <Badge variant="secondary" className="bg-blue-600 hover:bg-blue-700 transition-colors">
                    View Certificate
                  </Badge>
                </a>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

