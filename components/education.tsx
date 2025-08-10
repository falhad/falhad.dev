import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, GraduationCap, MapPin, Building2 } from "lucide-react"

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
      <Card className="mb-8 border border-border bg-card/60 backdrop-blur-sm">

      <CardHeader className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-fuchsia-500/20 to-cyan-500/20 ring-1 ring-border">
            <GraduationCap className="h-5 w-5 text-fuchsia-400" aria-hidden />
          </div>
          <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">Education</CardTitle>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" aria-hidden />
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="absolute left-[11px] top-0 bottom-0 w-px bg-border" aria-hidden />
          {education.map((edu, index) => (
            <div
              key={index}
              className="relative mb-6 last:mb-0 pl-8"
            >
              {/* Timeline dot */}
              <span
                className="absolute left-0 top-2 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-400 to-cyan-400 shadow-sm"
                aria-hidden
              >
                <span className="h-1.5 w-1.5 rounded-full bg-background" />
              </span>

              {/* Degree */}
              <div className="flex items-start gap-2">
                <GraduationCap className="mt-0.5 h-5 w-5 text-primary/80" />
                <h3 className="text-lg font-semibold text-primary leading-tight">{edu.degree}</h3>
              </div>

              {/* Institution */}
              <div className="mt-1 flex items-center gap-2 text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>{edu.institution}</span>
              </div>

              {/* Location */}
              <div className="mt-1 flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{edu.location}</span>
              </div>

              {/* Date */}
              <Badge variant="secondary" className="mt-2 inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>{edu.date}</span>
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

