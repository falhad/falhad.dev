# Spatial Portfolio — Redesign Spec

**Date:** 2026-07-17
**Project:** falhad.dev (Farhad Navayazdan personal portfolio)
**Goal:** Redesign the portfolio into a creative, interactive 3D WebGL experience that makes
visitors say "wow" on first load, while keeping the real content scannable and recruiter-friendly.

## Direction (approved)

Hybrid 3D WebGL "spatial" portfolio:
- Cinematic 3D hero + a floating "project constellation" centerpiece that reacts to the mouse.
- After the space scene, buttery smooth-scroll 2D content sections with motion reveals.
- Graceful fallbacks for reduced-motion, mobile, and no-WebGL.
- The existing UnicornStudio embed is **removed entirely** and replaced by our own three.js scene.

## Stack additions

- `three`, `@react-three/fiber`, `@react-three/drei` — 3D scene.
- `lenis` — smooth scroll.
- Keep existing **GSAP** (already a dependency) for scroll-reveal animations.
- Keep shadcn/ui + Tailwind for all 2D content.
- All 3D is dynamically imported with `ssr: false` (three.js touches `window` at module load).

## Experience, top to bottom

1. **Hero (full-viewport 3D canvas)**
   - Dark space, drifting particle field, soft fog, subtle bloom.
   - Kinetic name "Farhad Navayazdan" + "Senior Software Developer" over the scene.
   - Cursor-reactive parallax (camera / particles drift toward mouse).
   - Scroll cue; scroll dollies the camera forward.

2. **Project constellation (3D centerpiece)**
   - 4 projects (RIG-AI, Biratex, Parswater, Sipan) as glowing floating nodes.
   - Hover → node blooms + label (name, primary stack).
   - Click → camera fly-to + detail panel (description, tech badges, links).

3. **Transition** — camera exits space; background settles to gradient; Lenis smooth scroll
   takes over for the rest of the page.

4. **Content sections (polished 2D, GSAP scroll reveals)** — real, scannable:
   - Summary / "Who am I".
   - Experience timeline (6 roles) — timeline line draws in, cards slide/fade.
   - Skills — animated tag clusters.
   - Education, Certifications, Awards — motion cards.
   - Contact CTA (email).

## Fallbacks (non-negotiable)

- `prefers-reduced-motion` → static gradient hero, simple fade-ins, no 3D animation loop.
- Mobile → reduced particle counts; constellation degrades to an elegant 2D card grid.
- No WebGL support → CSS gradient hero, 2D everywhere.

## Architecture

New / changed structure:

- `lib/portfolio-data.ts` — **single source of truth** for projects, experiences, skills,
  education, certifications, awards. Extracted from the current per-component inline arrays so
  the 3D nodes and 2D fallback cards render identical data (no drift).
- `components/three/`
  - `Scene.tsx` — R3F `<Canvas>` wrapper, camera rig, fog, bloom, reduced-motion/WebGL guards.
  - `ParticleField.tsx` — instanced drifting particles, cursor parallax.
  - `ProjectConstellation.tsx` — lays out `ProjectNode`s, handles hover/select + camera fly-to.
  - `ProjectNode.tsx` — one glowing node.
  - `HeroCanvas.tsx` — client entry, `dynamic(() => ..., { ssr: false })`, mounts Scene.
- `components/scroll/`
  - `SmoothScrollProvider.tsx` — Lenis provider.
  - `useReveal.ts` — GSAP ScrollTrigger reveal hook used by content sections.
- Existing content components (`experience`, `skills`, `education`, etc.) refactored to consume
  `portfolio-data.ts` and wrap in the reveal hook. **Content values preserved 100%.**
- `components/hero.tsx` — rewritten: UnicornStudio embed removed, mounts `HeroCanvas` + overlay.
- `app/page.tsx` — projects section re-enabled (currently commented out), wrapped by smooth scroll.

## Data flow

`portfolio-data.ts` (typed arrays) → imported by both 3D components (constellation nodes) and
2D components (fallback cards / content sections). Hover/select state lives in
`ProjectConstellation`; selecting a node opens a detail panel rendered as a 2D overlay reading
from the same data object.

## Error handling / robustness

- WebGL capability check before mounting Canvas; fall back to CSS hero on failure.
- R3F error boundary around `<Canvas>` so a shader/context-loss error never blanks the page —
  it swaps to the static hero.
- `useReducedMotion` short-circuits the animation loop and heavy effects.

## Testing / verification

- `next build` must pass (guards SSR correctness of the dynamic import).
- Manual drive via the dev server on port 3005: load hero, move mouse (parallax), scroll
  (camera dolly + section reveals), hover + click a project node (panel opens).
- Verify reduced-motion path (emulate) and a narrow mobile viewport render the fallbacks.
- Screenshot the hero and constellation to confirm they actually render (not a blank canvas).

## Out of scope (YAGNI)

- No CMS / backend. Data stays as typed TS.
- No blog, no i18n, no analytics.
- No real project screenshots sourced now (keep existing placeholders; nodes are abstract).
