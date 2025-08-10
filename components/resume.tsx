import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export default function Resume() {
  return (
    <Card className="mb-8 border border-border bg-card/60 backdrop-blur-sm">
      <CardHeader className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-fuchsia-500/20 to-cyan-500/20 ring-1 ring-border">
            <Download className="h-5 w-5 text-fuchsia-400" aria-hidden />
          </div>
          <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
            Resume
          </CardTitle>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" aria-hidden />
      </CardHeader>
      <CardContent>
        <p className="text-foreground/80 mb-4">
          You can download my latest CV or view it online.
        </p>
        <div className="flex gap-3">
          <Button asChild className="rounded-full">
            <a href="/resume.pdf" download>
              <Download className="mr-2 h-4 w-4" /> Download CV
            </a>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <a href="https://drive.google.com/file/d/1bmeJ-Hubz-ovqnJO4WK2s0GcQCj9-jT6/view" target="_blank" rel="noopener noreferrer">
              View Online
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
