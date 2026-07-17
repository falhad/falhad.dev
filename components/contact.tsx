"use client"
import { profile } from "@/lib/portfolio-data"
import Magnetic from "@/components/motion/magnetic"

export default function Contact() {
  const links = [
    { label: "Email", href: `mailto:${profile.email}`, text: profile.email },
    { label: "Phone", href: `tel:${profile.phoneTel}`, text: profile.phoneDisplay },
    { label: "LinkedIn", href: profile.linkedin, text: "in/farhadnava" },
    { label: "GitHub", href: profile.github, text: "@falhad" },
  ]
  return (
    <section id="contact" aria-label="Contact" className="mx-auto max-w-6xl px-6 py-32 md:px-12 md:py-48">
      <p className="section-label mb-6">The channel is open</p>
      <h2 className="font-display text-[clamp(2.5rem,9vw,7rem)] font-semibold leading-[0.95] tracking-tight text-foreground">
        Let&apos;s build
        <br />
        something.
      </h2>
      <div className="mt-12">
        <Magnetic>
          <a
            href={`mailto:${profile.email}?subject=Hello Farhad`}
            data-cursor="say hi"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-4 text-lg text-background transition-colors hover:bg-[var(--terracotta)]"
          >
            {profile.email}
          </a>
        </Magnetic>
      </div>
      <div className="mt-16 grid grid-cols-2 gap-6 border-t border-border pt-10 md:grid-cols-4">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target={l.href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            data-cursor="open"
            className="group"
          >
            <div className="section-label">{l.label}</div>
            <div className="mt-1 text-foreground transition-colors group-hover:text-[var(--terracotta)]">{l.text}</div>
          </a>
        ))}
      </div>
    </section>
  )
}
