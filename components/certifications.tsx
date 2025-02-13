import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const certifications = [
  {
    name: "Network+",
    label: "CompTIA Network Plus",
    url: "https://drive.google.com/file/d/1rufY3no366dEK4Qz5NE6OON3Bcq-mFAo/view?usp=drive_link",
  },
  {
    name: "CCNA",
    label: "Cisco Certified Network Associate",
    url: "https://drive.google.com/file/d/1qBbgoK3mLUIJaAtlgyDnUewcWfdKFDuN/view?usp=drive_link",
  },
  {
    name: "CCNP",
    label: "Cisco Certified Network Professional",
    url: "https://drive.google.com/file/d/1jSktgIiziWVGC61ASTeCXP8LZSv1hXsq/view?usp=drive_link",
  },
  {
    name: "MCITP",
    label: "Microsoft Certified IT Professional",
    url: "https://drive.google.com/file/d/1bSQ8I86w1pzpaKg4VNvFagzKGQKC8dbX/view?usp=drive_link",
  },
]

export default function Certifications() {
  return (
    <Card className="mb-8 bg-gray-800 text-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-blue-400">Certifications</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {certifications.map((cert, index) => (
            <li key={index} className="flex items-center justify-between">
              <div>
                <strong className="text-blue-300">{cert.name}</strong>
                <span className="text-gray-400 ml-2">{cert.label}</span>
              </div>
              <a href={cert.url} target="_blank" rel="noopener noreferrer">
                <Badge variant="secondary" className="bg-blue-600 hover:bg-blue-700 transition-colors">
                  View Certificate
                </Badge>
              </a>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

