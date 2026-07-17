import { Github, Linkedin, Mail, Phone, ArrowUpRight } from "lucide-react"
import Panel from "@/components/console/panel"
import SectionHeading from "@/components/console/section-heading"
import { profile } from "@/lib/portfolio-data"

const channels = [
  { key: "EMAIL", value: profile.email, href: `mailto:${profile.email}`, icon: Mail, accent: "#e879f9" },
  { key: "PHONE", value: profile.phoneDisplay, href: `tel:${profile.phoneTel}`, icon: Phone, accent: "#22d3ee" },
  { key: "LINKEDIN", value: "in/farhadnava", href: profile.linkedin, icon: Linkedin, accent: "#a78bfa" },
  { key: "GITHUB", value: "@falhad", href: profile.github, icon: Github, accent: "#34d399" },
]

export default function Contact() {
  return (
    <div className="mb-14">
      <SectionHeading label="OPEN_CHANNEL" title="Get in touch" accent="signal" readout="STATUS: AVAILABLE" />
      <Panel className="p-6 sm:p-8" grid>
        <p className="max-w-lg text-sm leading-relaxed text-foreground/75">
          Building something in real-time systems, blockchain, or AI — or just want to talk shop? The channel
          is open. Pick any frequency below.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-white/[0.06] bg-white/[0.05] sm:grid-cols-2">
          {channels.map((c) => (
            <a
              key={c.key}
              href={c.href}
              {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group flex items-center gap-3 bg-[#0b0718]/85 p-4 transition-colors hover:bg-[#100a24]/85"
            >
              <span
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border"
                style={{ borderColor: `${c.accent}44`, backgroundColor: `${c.accent}14` }}
              >
                <c.icon className="h-4 w-4" style={{ color: c.accent }} />
              </span>
              <div className="min-w-0">
                <div className="mono text-[0.6rem] uppercase tracking-widest" style={{ color: c.accent }}>
                  {c.key}
                </div>
                <div className="mono truncate text-sm text-foreground/85">{c.value}</div>
              </div>
              <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground/40 transition group-hover:text-foreground" />
            </a>
          ))}
        </div>
      </Panel>
    </div>
  )
}
