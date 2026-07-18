import { profile, skills, experiences, education } from "@/lib/portfolio-data"

// Structured data (schema.org) so search engines and LLMs read Farhad's identity
// as facts — name, role, skills, employer, socials — not guesses from prose.
// Rendered as a <script type="application/ld+json"> in the document body.
export function PersonJsonLd() {
  const current = experiences[0]
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    alternateName: "falhad",
    url: profile.website,
    image: profile.avatar,
    jobTitle: profile.title,
    description: profile.summary,
    email: `mailto:${profile.email}`,
    telephone: profile.phoneTel,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Muscat",
      addressCountry: "Oman",
    },
    worksFor: current
      ? { "@type": "Organization", name: current.company }
      : undefined,
    alumniOf: education.map((e) => ({
      "@type": "CollegeOrUniversity",
      name: e.institution,
    })),
    knowsAbout: skills.flatMap((s) => s.items),
    sameAs: [profile.linkedin, profile.github],
  }

  // Data is static (from portfolio-data.ts), but escape `<` anyway so a stray
  // "</script>" in any field can never break out of the tag — the only real
  // injection risk when inlining JSON into HTML.
  const safe = JSON.stringify(jsonLd).replace(/</g, "\\u003c")

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safe }} />
}
