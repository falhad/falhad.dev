import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {BadgeCheck, Gauge, Rocket, Users} from "lucide-react"

export default function Summary() {
    return (
        <Card className="mb-8 border border-border bg-card/60 backdrop-blur-sm">
            <CardHeader className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <div
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-fuchsia-500/20 to-cyan-500/20 ring-1 ring-border">
                        <BadgeCheck className="h-5 w-5 text-fuchsia-400" aria-hidden/>
                    </div>
                    <CardTitle
                        className="text-2xl font-semibold bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                        Who am I?
                    </CardTitle>
                </div>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" aria-hidden/>
            </CardHeader>
            <CardContent className="space-y-6">
                <p className="text-foreground/80 leading-relaxed">
                    Innovative <strong className="font-semibold text-foreground">Senior Software Developer</strong> with
                    over 11 years of
                    experience delivering high-impact, scalable software solutions, including specialized applications
                    for the{" "}
                    <strong className="font-semibold text-foreground">oil and gas</strong> sector. Adept at solving
                    complex technical challenges,
                    optimizing <strong className="font-semibold text-foreground">system performance</strong>, and
                    leading projects from concept to
                    deployment. Passionate about leveraging modern development techniques and technologies to drive
                    efficiency and
                    innovation in <strong className="font-semibold text-foreground">industrial software systems</strong>.
                </p>

                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <li className="group flex items-start gap-3 rounded-lg border border-border/60 bg-card/50 p-3 transition hover:bg-card/70">
            <span
                className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-fuchsia-500/15 ring-1 ring-border/70">
              <Rocket className="h-4 w-4 text-fuchsia-400" aria-hidden/>
            </span>
                        <div>
                            <p className="text-sm font-medium text-foreground">Product delivery</p>
                            <p className="text-xs text-foreground/70">From concept to deployment</p>
                        </div>
                    </li>
                    <li className="group flex items-start gap-3 rounded-lg border border-border/60 bg-card/50 p-3 transition hover:bg-card/70">
            <span
                className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-cyan-500/15 ring-1 ring-border/70">
              <Gauge className="h-4 w-4 text-cyan-400" aria-hidden/>
            </span>
                        <div>
                            <p className="text-sm font-medium text-foreground">Performance & scale</p>
                            <p className="text-xs text-foreground/70">Optimized, resilient systems</p>
                        </div>
                    </li>
                    <li className="group flex items-start gap-3 rounded-lg border border-border/60 bg-card/50 p-3 transition hover:bg-card/70">
            <span
                className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-emerald-500/15 ring-1 ring-border/70">
              <Users className="h-4 w-4 text-emerald-400" aria-hidden/>
            </span>
                        <div>
                            <p className="text-sm font-medium text-foreground">Leadership</p>
                            <p className="text-xs text-foreground/70">Mentorship & cross‑functional</p>
                        </div>
                    </li>
                </ul>
            </CardContent>
        </Card>
    )
}

