import type { Metadata } from "next"
import {
  profile,
  experiences,
  skills,
  projects,
  moreProjects,
  education,
  certifications,
  awards,
  stats,
} from "@/lib/portfolio-data"
import ResumeActions from "@/components/resume/resume-actions"

// A plain, server-rendered resume — selectable text, real headings and lists,
// so it's readable by ATS scanners and search engines (unlike the 3D scene and
// the PDF). Doubles as the fast path for recruiters who won't scroll the desk.
export const metadata: Metadata = {
  title: "Resume",
  description:
    "Resume of Farhad Navayazdan — Senior Software Developer & Software Engineer in Muscat, Oman. 14+ years across AI/LLM, RAG, real-time systems, blockchain, and full-stack web & mobile.",
  alternates: { canonical: "/resume" },
  openGraph: {
    title: "Farhad Navayazdan — Resume",
    description: "Senior Software Developer & Software Engineer · Muscat, Oman · 14+ years · AI/LLM, Rust, Next.js.",
    url: "/resume",
  },
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-9 first:mt-0">
      <h2 className="mb-4 font-display text-lg font-semibold uppercase tracking-[0.14em] text-[var(--terracotta)] print:text-black">
        {title}
      </h2>
      {children}
    </section>
  )
}

export default function ResumePage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-10 text-foreground print:max-w-none print:px-0 print:py-0 print:text-black sm:px-8 sm:py-14">
      {/* Print-only: force light, ink-friendly rendering regardless of theme. */}
      <style>{`
        @media print {
          :root { color-scheme: light; }
          body { background: #fff !important; }
          .no-print { display: none !important; }
          a { color: #000 !important; text-decoration: none; }
          @page { margin: 14mm; }
        }
      `}</style>

      {/* Header */}
      <header className="border-b border-border pb-6 print:border-black/30">
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">{profile.name}</h1>
        <p className="mt-2 text-lg text-foreground/80 print:text-black">
          Senior Software Developer &amp; Software Engineer
        </p>
        <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-[var(--terracotta)]/15 px-3 py-1 text-sm font-medium text-[var(--terracotta)] print:bg-transparent print:px-0 print:text-black">
          <span aria-hidden>🟢</span> Open to senior roles · Muscat, Oman or remote worldwide
        </p>
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-foreground/75 print:text-black">
          <li><a href={`mailto:${profile.email}`} className="hover:text-[var(--terracotta)]">{profile.email}</a></li>
          <li><a href={`tel:${profile.phoneTel}`} className="hover:text-[var(--terracotta)]">{profile.phoneDisplay}</a></li>
          <li><a href={profile.linkedin} className="hover:text-[var(--terracotta)]">linkedin.com/in/farhadnava</a></li>
          <li><a href={profile.github} className="hover:text-[var(--terracotta)]">github.com/falhad</a></li>
          <li><a href={profile.website} className="hover:text-[var(--terracotta)]">falhad.dev</a></li>
        </ul>
      </header>

      <div className="mt-6">
        <ResumeActions />
      </div>

      {/* Summary */}
      <Section title="Summary">
        <p className="leading-relaxed text-foreground/85 print:text-black">{profile.summary}</p>
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-foreground/70 print:text-black">
          {stats.map((s) => (
            <li key={s.label}>
              <span className="font-semibold text-foreground print:text-black">{s.value}</span> {s.label}
            </li>
          ))}
        </ul>
      </Section>

      {/* Experience */}
      <Section title="Experience">
        <div className="space-y-6">
          {experiences.map((e) => (
            <article key={e.company + e.date}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <h3 className="font-semibold text-foreground print:text-black">
                  {e.position} · {e.company}
                </h3>
                <span className="text-sm text-muted-foreground print:text-black">{e.date}</span>
              </div>
              {e.location ? <p className="text-sm text-muted-foreground print:text-black">{e.location}</p> : null}
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-foreground/80 print:text-black">
                {e.responsibilities.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>

      {/* Skills */}
      <Section title="Skills">
        <dl className="space-y-2">
          {skills.map((cat) => (
            <div key={cat.category} className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
              <dt className="min-w-[9rem] font-medium text-foreground print:text-black">{cat.category}</dt>
              <dd className="text-sm text-foreground/80 print:text-black">{cat.items.join(" · ")}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* Projects */}
      <Section title="Selected Projects">
        <div className="space-y-4">
          {projects.map((p) => (
            <article key={p.name}>
              <h3 className="font-semibold text-foreground print:text-black">
                {p.name}
                {p.links.demo ? (
                  <a href={p.links.demo} className="ml-2 text-sm font-normal text-[var(--terracotta)] print:text-black">
                    {p.links.demo.replace(/^https?:\/\//, "")}
                  </a>
                ) : null}
              </h3>
              <p className="text-sm leading-relaxed text-foreground/80 print:text-black">{p.description}</p>
              <p className="mt-1 text-xs text-muted-foreground print:text-black">{p.technologies.join(" · ")}</p>
            </article>
          ))}
        </div>
        <p className="mt-4 text-sm text-foreground/70 print:text-black">
          <span className="font-medium text-foreground print:text-black">Also shipped:</span>{" "}
          {moreProjects.map((m) => m.name).join(", ")}.
        </p>
      </Section>

      {/* Education + Certifications */}
      <div className="grid gap-8 sm:grid-cols-2">
        <Section title="Education">
          <div className="space-y-3">
            {education.map((ed) => (
              <div key={ed.degree}>
                <h3 className="text-sm font-semibold text-foreground print:text-black">{ed.degree}</h3>
                <p className="text-sm text-foreground/75 print:text-black">{ed.institution}</p>
                <p className="text-xs text-muted-foreground print:text-black">{ed.date}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Certifications">
          <ul className="space-y-1 text-sm text-foreground/80 print:text-black">
            {certifications.map((c) => (
              <li key={c.name}>
                <span className="font-medium text-foreground print:text-black">{c.name}</span> — {c.label}
              </li>
            ))}
          </ul>
        </Section>
      </div>

      {/* Awards */}
      <Section title="Awards">
        <ul className="space-y-1 text-sm text-foreground/80 print:text-black">
          {awards.map((a) => (
            <li key={a.title}>
              <span className="font-medium text-foreground print:text-black">{a.title}</span>
              {a.description ? ` — ${a.description}` : ""}
              {a.years?.length ? ` (${a.years.join(", ")})` : ""}
            </li>
          ))}
        </ul>
      </Section>

      <footer className="mt-10 border-t border-border pt-5 text-xs text-muted-foreground no-print">
        Prefer the interactive version? Visit{" "}
        <a href="/" className="text-[var(--terracotta)]">falhad.dev</a>.
      </footer>
    </main>
  )
}
