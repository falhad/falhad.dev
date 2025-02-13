import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const education = [
  {
    degree: "Master's in Computer Networks And Communications",
    institution: "University of Yazd",
    location: "Yazd, Iran",
    date: "Sep 2018 to Nov 2021",
  },
  {
    degree: "Bachelor's in Computer Software Engineering",
    institution: "University of Yazd",
    location: "Yazd, Iran",
    date: "Sep 2012 to May 2017",
  },
]

export default function Education() {
  return (
    <Card className="mb-8 bg-gray-800 text-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-blue-400">Education</CardTitle>
      </CardHeader>
      <CardContent>
        {education.map((edu, index) => (
          <div key={index} className="mb-4 last:mb-0">
            <h3 className="text-lg font-semibold text-blue-300">{edu.degree}</h3>
            <p className="text-gray-400">{edu.institution}</p>
            <p className="text-gray-400">{edu.location}</p>
            <Badge variant="secondary" className="mt-1">
              {edu.date}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

