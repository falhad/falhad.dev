import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, BadgeCheck, ExternalLink } from "lucide-react"

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
      <Card className="mb-8 border border-border bg-card/60 backdrop-blur-sm">

      <CardHeader className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-fuchsia-500/20 to-cyan-500/20 ring-1 ring-border">
            <Award className="h-5 w-5 text-fuchsia-400" aria-hidden />
          </div>
          <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">Certifications</CardTitle>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" aria-hidden />
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-[11px] top-0 bottom-0 w-px bg-border" aria-hidden />

          {certifications.map((cert, index) => (
            <div key={index} className="relative mb-6 last:mb-0 pl-8">
              {/* Timeline dot */}
              <span
                className="absolute left-0 top-2 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-400 to-cyan-400 shadow-sm"
                aria-hidden
              >
                <span className="h-1.5 w-1.5 rounded-full bg-background" />
              </span>

              {/* Heading with icon */}
              <div className="flex items-start gap-2">
                <Award className="mt-0.5 h-5 w-5 text-primary/80" />
                <h3 className="text-lg font-semibold text-primary leading-tight">{cert.name}</h3>
              </div>

              {/* Sub label with check icon */}
              <div className="mt-1 flex items-center gap-2 text-muted-foreground">
                <BadgeCheck className="h-4 w-4" />
                <span>{cert.label}</span>
              </div>

              {/* Link badge */}
              <a
                href={cert.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex"
              >
                <Badge variant="secondary" className="inline-flex items-center gap-1.5">
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>View Certificate</span>
                </Badge>
              </a>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

