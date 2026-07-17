"use client"
import { experiences, education } from "@/lib/portfolio-data"
import Reveal from "@/components/scroll/reveal"
import MacWindow from "@/components/os/mac-window"

// A short hash for flavour — deterministic from the string so no Math.random.
function hash(str: string) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return h.toString(16).padStart(7, "0").slice(0, 7)
}

export default function Journey() {
  return (
    <section id="journey" aria-label="Journey" className="mx-auto max-w-6xl px-6 py-24 md:px-12">
      <p className="section-label mb-4">Terminal · Journey</p>
      <h2 className="font-display text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
        Where I&apos;ve been
      </h2>

      <Reveal>
        <MacWindow title="farhad — zsh — git log" className="mt-16">
          <div className="overflow-x-auto p-6 font-mono text-[0.82rem] leading-relaxed">
            <p className="text-[var(--signal,#5ac37a)]">
              <span className="text-muted-foreground">➜</span> ~/career <span className="text-[#8fb6ff]">git</span> log
              --author=Farhad --stat
            </p>

            {experiences.map((e) => (
              <div key={e.company + e.date} className="mt-5">
                <p className="text-[#e0b64a]">commit {hash(e.company + e.date)}{"  "}<span className="text-muted-foreground">({e.when ?? e.date})</span></p>
                <p className="text-foreground/90">
                  <span className="text-muted-foreground">Author:</span> Farhad Navayazdan
                </p>
                <p className="text-muted-foreground">
                  <span className="text-muted-foreground">Role:</span>{" "}
                  <span className="text-foreground">{e.position} @ {e.company}</span>
                  {e.location ? ` · ${e.location}` : ""}
                </p>
                <div className="mt-2 pl-4">
                  {e.responsibilities.map((r) => (
                    <p key={r} className="text-muted-foreground">
                      <span className="text-[var(--terracotta)]">+</span> {r}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            <p className="mt-6 text-[var(--signal,#5ac37a)]">
              <span className="text-muted-foreground">➜</span> ~/career <span className="text-[#8fb6ff]">cat</span>{" "}
              education.txt
            </p>
            {education.map((ed) => (
              <div key={ed.degree} className="mt-2">
                <p className="text-foreground">🎓 {ed.degree}</p>
                <p className="text-muted-foreground">   {ed.institution} · {ed.location} · {ed.date}</p>
              </div>
            ))}

            <p className="mt-6 text-[var(--signal,#5ac37a)]">
              <span className="text-muted-foreground">➜</span> ~/career <span className="animate-pulse">▋</span>
            </p>
          </div>
        </MacWindow>
      </Reveal>
    </section>
  )
}
