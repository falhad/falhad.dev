"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Linkedin, Mail, Phone } from "lucide-react"
import gsap from "gsap"
import { useEffect, useRef } from "react"

export default function Contact() {

  const PHONE_DISPLAY = "+968 90130747"
  const PHONE_TEL = "+96890130747"

  const sectionRef = useRef<HTMLDivElement | null>(null)
  const itemRefs = useRef<HTMLAnchorElement[]>([])
  itemRefs.current = []

  const addItemRef = (el: HTMLAnchorElement | null) => {
    if (el && !itemRefs.current.includes(el)) {
      itemRefs.current.push(el)
    }
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-animate='heading']", { y: 16, opacity: 0, duration: 0.6, ease: "power2.out" })
      gsap.from("[data-animate='divider']", { scaleX: 0, transformOrigin: "left", duration: 0.6, delay: 0.1, ease: "power2.out" })
      gsap.from(itemRefs.current, { y: 20, opacity: 0, stagger: 0.08, duration: 0.6, delay: 0.15, ease: "power2.out" })
      gsap.from("[data-animate='blurb']", { y: 10, opacity: 0, duration: 0.6, delay: 0.1, ease: "power2.out" })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <Card ref={sectionRef} className="mb-8 border border-border bg-card/60 backdrop-blur-sm">
      <CardHeader className="flex flex-col gap-2">
        <div className="flex items-center gap-2" data-animate="heading">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-fuchsia-500/20 to-cyan-500/20 ring-1 ring-border">
            <Mail className="h-5 w-5 text-fuchsia-400" aria-hidden />
          </div>
          <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
            Get in touch
          </CardTitle>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" aria-hidden data-animate="divider" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <p className="text-foreground/80" data-animate="blurb">
              I’d love to hear from you! Whether you have a question, a project in mind, or just want to say hello,
              feel free to reach out through any of the channels below. I’ll get back to you as soon as I can.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                ref={addItemRef}
                href={`tel:${PHONE_TEL}`}
                className="group inline-flex items-center justify-between rounded-xl border border-border bg-card/60 px-4 py-3 hover:bg-card transition-colors"
                aria-label={`Call me at ${PHONE_DISPLAY}`}
              >
                <span className="inline-flex items-center gap-2 text-foreground/90">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-fuchsia-500/20 to-cyan-500/20 ring-1 ring-border">
                    <Phone className="h-4 w-4 text-fuchsia-400" aria-hidden />
                  </span>
                  {PHONE_DISPLAY}
                </span>
                <span className="text-foreground/40 group-hover:text-foreground/60">Call</span>
              </a>

              <a
                ref={addItemRef}
                href="mailto:cs.arcxx@gmail.com"
                className="group inline-flex items-center justify-between rounded-xl border border-border bg-card/60 px-4 py-3 hover:bg-card transition-colors"
                aria-label="Send me an email at cs.arcxx@gmail.com"
              >
                <span className="inline-flex items-center gap-2 text-foreground/90">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-fuchsia-500/20 to-cyan-500/20 ring-1 ring-border">
                    <Mail className="h-4 w-4 text-fuchsia-400" aria-hidden />
                  </span>
                  cs.arcxx@gmail.com
                </span>
                <span className="text-foreground/40 group-hover:text-foreground/60">Email</span>
              </a>

              <a
                ref={addItemRef}
                href="https://www.linkedin.com/in/farhadnava/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-between rounded-xl border border-border bg-card/60 px-4 py-3 hover:bg-card transition-colors"
                aria-label="Visit my LinkedIn profile"
              >
                <span className="inline-flex items-center gap-2 text-foreground/90">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-fuchsia-500/20 to-cyan-500/20 ring-1 ring-border">
                    <Linkedin className="h-4 w-4 text-fuchsia-400" aria-hidden />
                  </span>
                  LinkedIn
                </span>
                <span className="text-foreground/40 group-hover:text-foreground/60">Open</span>
              </a>

              <a
                ref={addItemRef}
                href="https://github.com/falhad"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-between rounded-xl border border-border bg-card/60 px-4 py-3 hover:bg-card transition-colors"
                aria-label="Visit my GitHub profile"
              >
                <span className="inline-flex items-center gap-2 text-foreground/90">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-fuchsia-500/20 to-cyan-500/20 ring-1 ring-border">
                    <Github className="h-4 w-4 text-fuchsia-400" aria-hidden />
                  </span>
                  GitHub
                </span>
                <span className="text-foreground/40 group-hover:text-foreground/60">Open</span>
              </a>
            </div>
          </div>

          <div className="hidden md:flex flex-col gap-3 justify-center">
            {/* Decorative column kept for balance; could include additional info later */}
            <div className="h-24 rounded-xl bg-gradient-to-br from-fuchsia-500/10 to-cyan-500/10 ring-1 ring-border" />
            <div className="h-24 rounded-xl bg-gradient-to-br from-cyan-500/10 to-fuchsia-500/10 ring-1 ring-border" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
