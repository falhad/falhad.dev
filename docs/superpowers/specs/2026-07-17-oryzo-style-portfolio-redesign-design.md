# Oryzo-Style Portfolio Redesign — Design Spec

**Date:** 2026-07-17
**Owner:** Farhad Navayazdan
**Repo:** falhad.dev (Next 16, React 19, R3F/Three, GSAP, Lenis, shadcn/ui, Tailwind)
**Branch context:** currently `redesign/spatial-portfolio`

## 1. Goal

Transform the portfolio from its current **cold sci-fi "mission-control" theme** (forced-dark,
fuchsia/cyan glows, HUD panels, monospace vernacular, skill-galaxy, operator-console) into a
**warm, cinematic, premium experience in the spirit of oryzo.ai** (Lusion).

The four qualities to deliver (user-selected, all four):

1. **Motion feel** — buttery smooth scroll, silky reveals, physics-based hover/cursor interaction.
2. **Warm palette + type** — cream base, confident large typography, generous whitespace.
3. **3D centerpiece** — an abstract sculptural form as the interactive hero.
4. **Playful personality** — wit and delightful detail, not a sterile corporate portfolio.

Scope decision: **new look + new structure**. Rebuild visuals and re-narrate the sections.
Keep all real content. Remove the galaxy/console/HUD themes entirely.

## 2. Non-Goals

- No CMS, no backend, no new data source. Content stays in `lib/portfolio-data.ts`.
- No new heavy dependencies — everything needed is already installed (R3F, drei,
  postprocessing, gsap, lenis).
- Not a resume PDF redesign; the Drive resume link stays as-is.
- No i18n, no blog, no analytics work in this pass.

## 3. Aesthetic Direction (approved)

### Palette (warm light, oryzo-lineage)
| Token | Value | Use |
|---|---|---|
| `--bg` | `#F3EDE3` | page background (warm cream) |
| `--bg-alt` | `#EAE2D4` | alternate section / paper |
| `--ink` | `#231F1C` | primary text (espresso) |
| `--ink-soft` | `#4A423B` | secondary text |
| `--cork` | `#C29B6B` | tan accent, borders, small marks |
| `--terracotta` | `#A85A3C` | interaction highlight / active only (kept rare) |

Reserve `--terracotta` for hover/active/focus states so the pop reads as expensive.

### Typography
- **Display**: **swap to a warmer, confident sans** for headlines (hero up to ~8–14vw). Prefer a
  next/font Google face that reads warm and characterful (e.g. a grotesque/humanist display such
  as Bricolage Grotesque, Clash-like, or Instrument Sans) over the current cold face. Final pick
  during build, wired via `next/font` in `app/layout.tsx`.
- **Body**: clean readable sans, generous line-height, generous whitespace.
- **Kill** the monospace eyebrow / HUD vernacular. Replace with quiet small-caps section labels.

### Motion
- **Lenis** smooth scroll retained, tuned softer/heavier (lower lerp, gentle easing).
- **GSAP ScrollTrigger**: mask/clip reveals, line-by-line text rise, section parallax, one or two
  pinned moments (hero 3D handoff, work section).
- **Magnetic buttons** + **custom cursor** that grows / labels over interactive elements.
- **Physics-y hover** on project cards (tilt, warm shadow lift).
- **`prefers-reduced-motion`** honored everywhere: disable scrub/parallax/cursor, keep content
  static and legible. This is a hard requirement, not an afterthought.

### 3D hero
- Abstract sculptural form: slowly-morphing organic blob using drei `MeshDistortMaterial`
  (or transmission material) on a high-subdiv sphere/icosahedron.
- Warm glass/liquid finish, warm environment lighting, subtle bloom via the already-installed
  `@react-three/postprocessing`.
- Drifts toward the cursor (damped), scroll scrubs scale/rotation as the hero exits.
- Must degrade: static warm gradient fallback if WebGL unavailable or reduced-motion is set.

## 4. Structure & Content Map (approved)

Single-page vertical narrative. New section order and the real content each carries:

1. **Hero** — full viewport, 3D sculptural form.
   - Name: **Farhad Navayazdan**
   - Tagline: *"I build fast, delightful software — from oil & gas monitoring to blockchain and AI."*
   - Meta: Muscat · 14 yrs. Quiet scroll cue.
2. **Statement** — big-type manifesto, rises line-by-line on scroll.
   - Distilled summary: 14+ yrs; real-time monitoring for oil & gas (rig telemetry, live video,
     WITS); blockchain, crypto exchange, LLM/RAG AI; leads teams concept → deployment.
   - Stats woven small: `14+ yrs` · `20+ projects` · `40% perf gains` · `∞ coffees` (keep the wit).
3. **Selected Work** — centerpiece. 7 flagship cards, cinematic, physics hover, generous space.
   - AI Energy · Biratex · QMenu · Sipan · Parswater · aiassist.chat · ellix.ai
   - Each card: name, tagline, description, tech tags, live-demo link where present.
   - **Build log (12 archive projects)** folded into a collapsible below the flagship 7.
4. **Capabilities** — 6 skill groups, warm grouped layout (NOT the galaxy).
   - AI & LLM · Programming Languages · Frameworks · Tools & DB · Networking · General (44 skills).
5. **Journey** — one elegant timeline: 7 roles + 2 degrees interleaved by date.
   - Esbaar → Farabin → Biratex (CTO) → Parswater → Fardad → Sandbad → Pishtazan;
     Yazd MSc (2018–2021) + BSc (2012–2017) interleaved.
6. **Recognition** — compact warm strip.
   - Certs: Network+, CCNA, CCNP, MCITP (Drive links). Awards: ACM ICPC, JavaCup, Security cert.
7. **Contact** — big warm outro.
   - Copy: *"The channel is open."*
   - email cs.arcxx@gmail.com · phone +968 90130747 · LinkedIn in/farhadnava · GitHub @falhad.

Header/nav: **fully immersive — no sticky top nav.** A single minimal corner menu (fixed
overlay, e.g. top-right) toggles a warm full-screen overlay with the anchors (Work, Capabilities,
Journey, Contact) + contact links. Closed by default so nothing competes with the hero. Drop the
console `⌘K` affordance.

## 5. Component Architecture

Each section is one focused component with a single purpose, consuming `portfolio-data.ts`.
No section reaches into another's internals; shared motion/3D lives in dedicated units.

New / rebuilt component units:

- `components/three/hero-sculpture.tsx` — the abstract blob + material + cursor/scroll response.
  Replaces `hero-canvas.tsx`, `skill-galaxy.tsx`, `nebula.tsx`, `particle-field.tsx`,
  `skill-detail.tsx`, `glow-texture.ts`.
- `components/hero.tsx` — rebuilt: sculpture + name + tagline + scroll cue.
- `components/statement.tsx` — manifesto + woven stats (absorbs `summary.tsx` + `stats-strip.tsx`).
- `components/work.tsx` — flagship 7 cards (rebuilt `projects.tsx`).
- `components/build-log.tsx` — collapsible 12 archive entries (rebuilt `more-projects.tsx`).
- `components/capabilities.tsx` — warm skill groups (rebuilt `skills.tsx`).
- `components/journey.tsx` — merged experience + education timeline.
- `components/recognition.tsx` — certs + awards (merged `certifications.tsx` + `awards.tsx`).
- `components/contact.tsx` — rebuilt warm outro.
- `components/menu.tsx` — corner-menu toggle + full-screen warm overlay (replaces `header.tsx`).

Shared motion primitives (small, isolated, testable):
- `components/scroll/smooth-scroll-provider.tsx` — retune Lenis (keep file).
- `components/scroll/reveal.tsx` — retune to mask/line-rise reveal (keep, extend).
- `components/motion/magnetic.tsx` — new: magnetic wrapper for buttons/links.
- `components/motion/cursor.tsx` — new: custom cursor with grow/label states.

### Files to DELETE
`components/console/operator-console.tsx`, `components/console/panel.tsx`,
`components/console/section-heading.tsx`, `components/three/skill-galaxy.tsx`,
`components/three/skill-detail.tsx`, `components/three/nebula.tsx`,
`components/three/particle-field.tsx`, `components/three/glow-texture.ts`,
`components/three/hero-canvas.tsx`, `components/three/effects.tsx` (if galaxy-specific).
Retire `theme-toggle.tsx` usage (single warm-light theme; keep file only if trivially harmless).

## 6. Styling Changes

- `app/globals.css`: replace the dark cosmic `:root`/`.dark` palette and cosmic `body`
  background with the warm-light tokens above. Remove HUD `.panel`, `.grid-fade`, `.eyebrow`
  monospace, cosmic radial-gradient body, and signal/caret keyframes not reused.
- Introduce warm section-label, magnetic, and reveal utility classes.
- Remove `next-themes` forced-dark; site is single warm-light theme (toggle out of scope).

## 7. Data Flow

- Single source: `lib/portfolio-data.ts` (unchanged shape; may add the tagline usage).
- Sections import their slice of data and render. No runtime fetching.
- The 3D sculpture is presentational; it takes cursor/scroll signals, emits nothing back.

## 8. Error Handling & Degradation

- **WebGL absent / context lost**: hero shows a warm animated CSS gradient fallback; page fully usable.
- **`prefers-reduced-motion`**: no scrub, parallax, magnetic, or custom cursor; reveals become
  instant; smooth scroll falls back to native. Content identical and legible.
- **Mobile / touch**: custom cursor disabled; sculpture simplified (lower subdiv, no bloom if
  perf budget exceeded); tap replaces hover states.
- **Broken/absent project links**: cards without a demo link render without the link affordance.

## 9. Testing / Verification

- Manual verification via the `/run` + `/verify` flow: drive each section, confirm reveals fire,
  hero responds to cursor, reduced-motion path renders static, mobile layout holds.
- `next build` must pass clean (no type errors, no unused-import breakage after deletions).
- Lighthouse sanity pass: no layout shift on hero, acceptable perf on mid mobile.
- Cross-check every content item from Section 4 renders (no dropped project/role/cert).

## 10. Risks & Open Questions

- **Perf of blob + bloom on mobile** — mitigate with subdiv/bloom budget + fallback.
- **Single-page length** — 7 sections + build log is long; pacing/whitespace must carry it.

Resolved: display font swapped to a warmer confident sans (final pick during build);
navigation is fully immersive via a corner menu (no sticky top nav).

## 11. Success Criteria

- Feels warm, calm, premium, and alive — recognizably oryzo-lineage, not the old HUD.
- All real content preserved and reachable.
- Motion is smooth and respects reduced-motion.
- `next build` green; site works with and without WebGL.
