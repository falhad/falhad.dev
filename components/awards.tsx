import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Award as AwardIcon, Calendar, ExternalLink } from "lucide-react"

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
      <Card className="mb-8 border border-border bg-card/60 backdrop-blur-sm">

      <CardHeader className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-fuchsia-500/20 to-cyan-500/20 ring-1 ring-border">
            <Trophy className="h-5 w-5 text-fuchsia-400" aria-hidden />
          </div>
          <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">Awards & Achievements</CardTitle>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" aria-hidden />
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="absolute left-[11px] top-0 bottom-0 w-px bg-border" aria-hidden />
          {awards.map((award, index) => (
            <div key={index} className="relative mb-6 last:mb-0 pl-8">
              {/* Timeline dot */}
              <span
                className="absolute left-0 top-2 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-400 to-cyan-400 shadow-sm"
                aria-hidden
              >
                <span className="h-1.5 w-1.5 rounded-full bg-background" />
              </span>

              {/* Title */}
              <div className="flex items-start gap-2">
                {/* Use Trophy for the first item and AwardIcon for others for a subtle visual variety */}
                {index === 0 ? (
                  <Trophy className="mt-0.5 h-5 w-5 text-primary/80" />
                ) : (
                  <AwardIcon className="mt-0.5 h-5 w-5 text-primary/80" />
                )}
                <h3 className="text-lg font-semibold text-primary leading-tight">{award.title}</h3>
              </div>

              {/* Description */}
              {award.description && (
                <p className="mt-1 text-sm text-muted-foreground">{award.description}</p>
              )}

              {/* Years */}
              {award.years && award.years.length > 0 && (
                <Badge variant="secondary" className="mt-2 inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{award.years.join(", ")}</span>
                </Badge>
              )}

              {/* Link */}
              {award.url && (
                <a
                  href={award.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex w-fit"
                >
                  <Badge variant="default" className="inline-flex items-center gap-1.5">
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>View</span>
                  </Badge>
                </a>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

