import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Summary() {
  return (
    <Card className="mb-8 bg-gray-800 text-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-blue-400">Professional Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300 leading-relaxed">
          Innovative <strong className="text-blue-300">Senior Software Developer</strong> with over 11 years of
          experience delivering high-impact, scalable software solutions, including specialized applications for the{" "}
          <strong className="text-blue-300">oil and gas</strong> sector. Adept at solving complex technical challenges,
          optimizing <strong className="text-blue-300">system performance</strong>, and leading projects from concept to
          deployment. Passionate about leveraging modern development techniques and technologies to drive efficiency and
          innovation in <strong className="text-blue-300">industrial software systems</strong>.
        </p>
      </CardContent>
    </Card>
  )
}

