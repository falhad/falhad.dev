# Oryzo-Style Portfolio Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio from its cold sci-fi "mission-control" theme into a warm, cinematic, premium single-page experience in the spirit of oryzo.ai (Lusion).

**Architecture:** Single-page vertical scroll narrative. One warm-light design system in `globals.css`. Content stays in `lib/portfolio-data.ts` (unchanged). Each section is one focused client component consuming its data slice. Shared motion lives in dedicated primitives (Lenis provider, Reveal, Magnetic, Cursor). A 3D abstract sculpture (R3F + drei distortion + postprocessing bloom) is the hero centerpiece with graceful fallback. Fully immersive: no sticky nav, only a corner-menu overlay.

**Tech Stack:** Next 16 (App Router), React 19, TypeScript, Tailwind 3, R3F (`@react-three/fiber` 9) + drei 10 + `@react-three/postprocessing` 3, GSAP 3 (ScrollTrigger), Lenis 1.3, next/font.

## Global Constraints

- Next 16 / React 19 / Tailwind 3 already installed — add NO new runtime dependencies.
- All content comes from `lib/portfolio-data.ts` — do not hardcode content in components; do not change the data file's exported shapes (may add read-only usage only).
- Single warm-light theme. Remove `forcedTheme="dark"` and the `.dark` palette. No theme toggle.
- Palette tokens (set once in `globals.css`, reused everywhere):
  - `--background: 37 33% 92%` (cream `#F3EDE3`)
  - `--secondary: 37 30% 87%` (paper `#EAE2D4`)
  - `--foreground: 24 12% 12%` (espresso `#231F1C`)
  - `--muted-foreground: 28 12% 26%` (`#4A423B`)
  - `--cork: #C29B6B` · `--terracotta: #A85A3C` (direct-hex custom props)
- `--terracotta` is reserved for hover/active/focus states only.
- Every motion effect MUST no-op under `prefers-reduced-motion: reduce` and remain fully legible.
- Every task ends GREEN: `npx tsc --noEmit` passes AND `npm run build` passes.
- Client components using hooks/R3F/GSAP need `"use client"` at the top.
- Commit after every task with a `feat:`/`chore:`/`refactor:` message.

## File Structure

**Create**
- `components/motion/cursor.tsx` — custom cursor with grow/label states
- `components/motion/magnetic.tsx` — magnetic wrapper for interactive elements
- `components/three/hero-sculpture.tsx` — abstract blob + material + cursor/scroll response
- `components/menu.tsx` — corner-menu toggle + full-screen overlay
- `components/statement.tsx` — manifesto + woven stats
- `components/work.tsx` — 7 flagship project cards
- `components/build-log.tsx` — collapsible 12 archive projects
- `components/capabilities.tsx` — warm skill groups
- `components/journey.tsx` — merged experience + education timeline
- `components/recognition.tsx` — certs + awards strip
- `lib/use-reduced-motion.ts` — shared reduced-motion hook

**Modify**
- `app/layout.tsx` — swap display font, drop forced-dark, drop mono
- `app/globals.css` — replace palette + body + component classes
- `components/scroll/smooth-scroll-provider.tsx` — retune Lenis
- `components/scroll/reveal.tsx` — retune to mask/line-rise reveal
- `components/hero.tsx` — rebuilt hero
- `components/contact.tsx` — rebuilt warm outro
- `app/page.tsx` — new section order, drop console/galaxy

**Delete**
- `components/console/operator-console.tsx`, `components/console/panel.tsx`, `components/console/section-heading.tsx`
- `components/three/skill-galaxy.tsx`, `components/three/skill-detail.tsx`, `components/three/nebula.tsx`, `components/three/particle-field.tsx`, `components/three/glow-texture.ts`, `components/three/hero-canvas.tsx`, `components/three/effects.tsx`
- `components/summary.tsx`, `components/stats-strip.tsx`, `components/projects.tsx`, `components/more-projects.tsx`, `components/skills.tsx`, `components/experience.tsx`, `components/education.tsx`, `components/certifications.tsx`, `components/awards.tsx`, `components/header.tsx`, `components/resume.tsx`, `components/theme-toggle.tsx`

---

## Task 1: Foundation — fonts, palette, base styles

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Produces: warm-light design tokens (`bg-background`, `text-foreground`, `text-muted-foreground`, `bg-secondary`, `border-border` all resolve to warm values); CSS custom props `--cork`, `--terracotta`; `.font-display` (Bricolage Grotesque), `.section-label` (small-caps), `.reveal-line` utility; body renders warm cream, no dark theme.

- [ ] **Step 1: Swap fonts and drop forced-dark in `app/layout.tsx`**

Replace the font imports and the `<html>`/`ThemeProvider` wiring:

```tsx
import type { Metadata } from "next"
import { Inter, Bricolage_Grotesque } from "next/font/google"
import "./globals.css"
import type React from "react"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display" })

export const metadata: Metadata = {
  title: "Farhad Navayazdan — Senior Software Developer",
  description:
    "Farhad Navayazdan — Senior Software Developer with 14+ years building real-time monitoring systems, blockchain, and AI platforms for the oil & gas sector and beyond.",
  generator: "Next.js",
  viewport: { width: "device-width", initialScale: 1 },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${display.variable} font-sans`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Replace `app/globals.css` with the warm-light system**

Overwrite the whole file:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: 37 33% 92%;      /* cream #F3EDE3 */
  --foreground: 24 12% 12%;      /* espresso #231F1C */
  --card: 37 33% 94%;
  --card-foreground: 24 12% 12%;
  --popover: 37 33% 94%;
  --popover-foreground: 24 12% 12%;
  --primary: 24 12% 12%;
  --primary-foreground: 37 33% 95%;
  --secondary: 37 30% 87%;       /* paper #EAE2D4 */
  --secondary-foreground: 24 12% 12%;
  --muted: 37 30% 87%;
  --muted-foreground: 28 12% 26%; /* #4A423B */
  --accent: 33 42% 59%;          /* cork */
  --accent-foreground: 24 12% 12%;
  --destructive: 0 62% 45%;
  --destructive-foreground: 37 33% 95%;
  --border: 33 22% 78%;
  --input: 33 22% 78%;
  --ring: 16 47% 45%;            /* terracotta */
  --radius: 0.75rem;

  /* Direct-hex brand accents */
  --cork: #C29B6B;
  --terracotta: #A85A3C;
}

@layer base {
  * { border-color: hsl(var(--border)); }
  html { scroll-behavior: smooth; }
  :where(a, button, input, select, textarea):focus-visible {
    @apply outline-none ring-2 ring-ring/70 ring-offset-2 ring-offset-background;
  }
  body {
    @apply bg-background text-foreground antialiased;
  }
}

@layer components {
  /* Quiet small-caps section label — replaces the old mono eyebrow. */
  .section-label {
    @apply text-[0.72rem] font-medium uppercase tracking-[0.22em] text-muted-foreground/80;
    font-variant: small-caps;
  }
}

@layer utilities {
  .font-display {
    font-family: var(--font-display), var(--font-sans), sans-serif;
  }
  /* Reveal masks — a line of text starts hidden below its own box. */
  .reveal-line { display: block; overflow: hidden; }
  .reveal-line > * { display: block; will-change: transform; }
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}
```

- [ ] **Step 3: Verify build is green**

Run: `npx tsc --noEmit && npm run build`
Expected: build completes with no type errors. (The old `page.tsx` still imports deleted-later components — it is NOT touched yet, so it still builds here. `theme-provider` import was removed from layout; `page.tsx` does not import it.)

Note: if `npm run build` fails because `page.tsx`/other components import `theme-toggle` or `ThemeProvider`, that is expected only after later deletions — at THIS task nothing is deleted yet, so build must pass. If it fails now, stop and fix the token/font edit.

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx app/globals.css
git commit -m "feat: warm-light design system + Bricolage display font"
```

---

## Task 2: Reduced-motion hook + Lenis retune

**Files:**
- Create: `lib/use-reduced-motion.ts`
- Modify: `components/scroll/smooth-scroll-provider.tsx`

**Interfaces:**
- Produces: `useReducedMotion(): boolean` (SSR-safe, defaults `false` on server); `<SmoothScrollProvider>` wrapping children with a retuned Lenis instance that is DISABLED when reduced-motion is set.

- [ ] **Step 1: Create the reduced-motion hook**

```ts
"use client"
import { useEffect, useState } from "react"

/** SSR-safe: returns false on the server and first client render, then syncs. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])
  return reduced
}
```

- [ ] **Step 2: Read the current provider**

Run: `cat components/scroll/smooth-scroll-provider.tsx`
Expected: see how Lenis is currently instantiated and its RAF loop, so the retune preserves the working setup.

- [ ] **Step 3: Retune Lenis (softer/heavier) and honor reduced-motion**

Rewrite `components/scroll/smooth-scroll-provider.tsx`. Keep whatever GSAP ScrollTrigger sync the current file has; change only the options and the reduced-motion guard:

```tsx
"use client"
import { useEffect } from "react"
import Lenis from "lenis"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useReducedMotion } from "@/lib/use-reduced-motion"

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion()
  useEffect(() => {
    if (reduced) return // native scrolling; no smoothing
    const lenis = new Lenis({
      lerp: 0.08,           // heavier than default (0.1) for a weightier glide
      duration: 1.2,
      smoothWheel: true,
      wheelMultiplier: 0.9,
    })
    lenis.on("scroll", ScrollTrigger.update)
    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
  }, [reduced])
  return <>{children}</>
}
```

- [ ] **Step 4: Verify build is green**

Run: `npx tsc --noEmit`
Expected: no errors. (`lenis`, `gsap` are installed.)

- [ ] **Step 5: Commit**

```bash
git add lib/use-reduced-motion.ts components/scroll/smooth-scroll-provider.tsx
git commit -m "feat: reduced-motion hook + retuned Lenis smooth scroll"
```

---

## Task 3: Reveal primitive (mask / line-rise)

**Files:**
- Modify: `components/scroll/reveal.tsx`

**Interfaces:**
- Consumes: `useReducedMotion`, gsap + ScrollTrigger.
- Produces: `<Reveal delay?={number} y?={number} className?={string}>children</Reveal>` — fades + rises children into view on scroll; renders children fully visible (no animation) under reduced-motion.

- [ ] **Step 1: Rewrite `components/scroll/reveal.tsx`**

```tsx
"use client"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useReducedMotion } from "@/lib/use-reduced-motion"

gsap.registerPlugin(ScrollTrigger)

export default function Reveal({
  children,
  delay = 0,
  y = 40,
  className,
}: {
  children: React.ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  useEffect(() => {
    if (reduced || !ref.current) return
    const el = ref.current
    const anim = gsap.fromTo(
      el,
      { autoAlpha: 0, y },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        delay,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      },
    )
    return () => {
      anim.scrollTrigger?.kill()
      anim.kill()
    }
  }, [reduced, delay, y])
  return (
    <div ref={ref} className={className} style={reduced ? undefined : { opacity: 0 }}>
      {children}
    </div>
  )
}
```

- [ ] **Step 2: Verify build is green**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/scroll/reveal.tsx
git commit -m "feat: retune Reveal to fade-rise with reduced-motion fallback"
```

---

## Task 4: Motion primitives — custom cursor + magnetic

**Files:**
- Create: `components/motion/cursor.tsx`
- Create: `components/motion/magnetic.tsx`

**Interfaces:**
- Consumes: `useReducedMotion`, gsap.
- Produces:
  - `<Cursor />` — fixed custom cursor; grows over `[data-cursor]` elements and shows their `data-cursor` value as a label. No-ops on touch / reduced-motion.
  - `<Magnetic strength?={number}>child</Magnetic>` — pulls a single child toward the pointer on hover; no-ops on reduced-motion. Child must accept a ref (wrap a plain element).

- [ ] **Step 1: Create `components/motion/cursor.tsx`**

```tsx
"use client"
import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { useReducedMotion } from "@/lib/use-reduced-motion"

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState("")
  const [active, setActive] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || window.matchMedia("(pointer: coarse)").matches) return
    const el = dot.current
    if (!el) return
    const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" })
    const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" })
    const move = (e: PointerEvent) => {
      xTo(e.clientX)
      yTo(e.clientY)
      const t = (e.target as HTMLElement)?.closest<HTMLElement>("[data-cursor]")
      setActive(!!t)
      setLabel(t?.dataset.cursor || "")
    }
    window.addEventListener("pointermove", move)
    return () => window.removeEventListener("pointermove", move)
  }, [reduced])

  if (reduced) return null
  return (
    <div
      ref={dot}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center rounded-full mix-blend-multiply transition-[width,height] duration-300"
      style={{
        width: active ? 84 : 14,
        height: active ? 84 : 14,
        backgroundColor: active ? "var(--terracotta)" : "var(--cork)",
      }}
    >
      {active && label ? (
        <span className="text-[0.6rem] font-medium uppercase tracking-widest text-background">
          {label}
        </span>
      ) : null}
    </div>
  )
}
```

- [ ] **Step 2: Create `components/motion/magnetic.tsx`**

```tsx
"use client"
import { cloneElement, useRef } from "react"
import { gsap } from "gsap"
import { useReducedMotion } from "@/lib/use-reduced-motion"

export default function Magnetic({
  children,
  strength = 0.4,
}: {
  children: React.ReactElement
  strength?: number
}) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  const onMove = (e: React.PointerEvent) => {
    if (reduced || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - (r.left + r.width / 2)) * strength
    const y = (e.clientY - (r.top + r.height / 2)) * strength
    gsap.to(ref.current, { x, y, duration: 0.4, ease: "power3.out" })
  }
  const reset = () => {
    if (ref.current) gsap.to(ref.current, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1,0.4)" })
  }
  return cloneElement(children, {
    ref,
    onPointerMove: onMove,
    onPointerLeave: reset,
  } as any)
}
```

- [ ] **Step 3: Verify build is green**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/motion/cursor.tsx components/motion/magnetic.tsx
git commit -m "feat: custom cursor + magnetic hover primitives"
```

---

## Task 5: 3D hero sculpture

**Files:**
- Create: `components/three/hero-sculpture.tsx`

**Interfaces:**
- Consumes: `useReducedMotion`; `@react-three/fiber`, `@react-three/drei` (`MeshDistortMaterial`, `Environment`, `Float`), `@react-three/postprocessing` (`EffectComposer`, `Bloom`).
- Produces: `<HeroSculpture />` — a self-contained `<Canvas>` rendering a warm morphing blob that drifts toward the cursor. Renders a warm CSS-gradient fallback `<div>` when reduced-motion is set. Absolutely positioned to fill its parent (parent must be `relative`).

- [ ] **Step 1: Create `components/three/hero-sculpture.tsx`**

```tsx
"use client"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { MeshDistortMaterial, Environment, Float } from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import { useRef } from "react"
import type { Mesh } from "three"
import { useReducedMotion } from "@/lib/use-reduced-motion"

function Blob() {
  const mesh = useRef<Mesh>(null)
  const { pointer } = useThree()
  useFrame((_, dt) => {
    if (!mesh.current) return
    // Damped drift toward the cursor.
    mesh.current.rotation.y += dt * 0.15
    mesh.current.rotation.x += (pointer.y * 0.3 - mesh.current.rotation.x) * 0.05
    mesh.current.position.x += (pointer.x * 0.4 - mesh.current.position.x) * 0.05
  })
  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1.6, 20]} />
        <MeshDistortMaterial
          color="#C29B6B"
          roughness={0.15}
          metalness={0.35}
          distort={0.4}
          speed={1.6}
        />
      </mesh>
    </Float>
  )
}

export default function HeroSculpture() {
  const reduced = useReducedMotion()
  if (reduced) {
    return (
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 60% at 60% 40%, #C29B6B55, transparent 70%), radial-gradient(50% 50% at 35% 65%, #A85A3C33, transparent 70%)",
        }}
      />
    )
  }
  return (
    <div className="absolute inset-0" aria-hidden>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 1.75]} gl={{ antialias: true }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 4, 5]} intensity={1.2} color="#fff3e0" />
        <Blob />
        <Environment preset="sunset" />
        <EffectComposer>
          <Bloom intensity={0.6} luminanceThreshold={0.5} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
```

- [ ] **Step 2: Verify build is green**

Run: `npx tsc --noEmit && npm run build`
Expected: no errors. If `next build` complains about SSR of `Canvas`, that is handled at the consumer (Task 6 imports it via `next/dynamic` with `ssr: false`). This task only compiles the module.

- [ ] **Step 3: Commit**

```bash
git add components/three/hero-sculpture.tsx
git commit -m "feat: warm abstract 3D hero sculpture with reduced-motion fallback"
```

---

## Task 6: Hero section

**Files:**
- Modify: `components/hero.tsx`

**Interfaces:**
- Consumes: `profile` from `@/lib/portfolio-data`, `HeroSculpture` (dynamic, ssr:false), `Magnetic`.
- Produces: `<Hero />` — full-viewport hero: sculpture behind, name + tagline + meta + scroll cue in front.

- [ ] **Step 1: Rewrite `components/hero.tsx`**

```tsx
"use client"
import dynamic from "next/dynamic"
import { profile } from "@/lib/portfolio-data"
import Magnetic from "@/components/motion/magnetic"

const HeroSculpture = dynamic(() => import("@/components/three/hero-sculpture"), { ssr: false })

export default function Hero() {
  return (
    <section id="hero" aria-label="Intro" className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 md:px-12">
      <HeroSculpture />
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <p className="section-label mb-6">{profile.location} · 14 years</p>
        <h1 className="font-display font-semibold leading-[0.92] tracking-tight text-foreground text-[clamp(3rem,11vw,10rem)]">
          {profile.name}
        </h1>
        <p className="mt-8 max-w-2xl text-lg md:text-2xl text-muted-foreground leading-relaxed">
          {profile.tagline}
        </p>
        <div className="mt-10">
          <Magnetic>
            <a
              href="#work"
              data-cursor="view work"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3 text-background transition-colors hover:bg-[var(--terracotta)]"
            >
              Selected work
            </a>
          </Magnetic>
        </div>
      </div>
      <div className="section-label absolute bottom-8 left-1/2 -translate-x-1/2 animate-pulse">
        scroll
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify build + drive in browser**

Run: `npm run build` (expect green), then `npm run dev` and load `http://localhost:3000`.
Expected: cream hero, large name, tagline, floating warm blob behind, custom cursor grows over the button. Toggle OS reduced-motion → blob becomes a static gradient, cursor disappears, layout intact.

- [ ] **Step 3: Commit**

```bash
git add components/hero.tsx
git commit -m "feat: rebuild hero with 3D sculpture, name, tagline"
```

---

## Task 7: Statement section (summary + stats)

**Files:**
- Create: `components/statement.tsx`

**Interfaces:**
- Consumes: `stats` from `@/lib/portfolio-data`, `Reveal`.
- Produces: `<Statement />` — big-type manifesto line + the 4 stats woven small beneath.

- [ ] **Step 1: Create `components/statement.tsx`**

```tsx
"use client"
import { stats } from "@/lib/portfolio-data"
import Reveal from "@/components/scroll/reveal"

const LINE =
  "14+ years shipping high-impact systems — real-time rig monitoring for oil & gas, blockchain and crypto platforms, and LLM/RAG AI, leading teams from concept to deployment."

export default function Statement() {
  return (
    <section id="statement" aria-label="Statement" className="mx-auto max-w-6xl px-6 py-32 md:px-12 md:py-48">
      <p className="section-label mb-10">Who I am</p>
      <Reveal>
        <p className="font-display text-[clamp(1.75rem,4.5vw,3.75rem)] font-medium leading-[1.15] tracking-tight text-foreground">
          {LINE}
        </p>
      </Reveal>
      <div className="mt-20 grid grid-cols-2 gap-8 border-t border-border pt-10 md:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.06}>
            <div>
              <div className="font-display text-4xl font-semibold text-foreground md:text-5xl">{s.value}</div>
              <div className="section-label mt-2">{s.label}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify build is green**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/statement.tsx
git commit -m "feat: statement section with manifesto + woven stats"
```

---

## Task 8: Selected Work + Build log

**Files:**
- Create: `components/work.tsx`
- Create: `components/build-log.tsx`

**Interfaces:**
- Consumes: `projects`, `moreProjects` from `@/lib/portfolio-data`, `Reveal`.
- Produces: `<Work />` (7 flagship cards, warm, tilt + shadow-lift hover, demo link when present) and `<BuildLog />` (native `<details>` collapsible listing the 12 archive projects).

- [ ] **Step 1: Create `components/work.tsx`**

```tsx
"use client"
import { projects } from "@/lib/portfolio-data"
import Reveal from "@/components/scroll/reveal"
import BuildLog from "@/components/build-log"

export default function Work() {
  return (
    <section id="work" aria-label="Selected work" className="mx-auto max-w-6xl px-6 py-24 md:px-12">
      <p className="section-label mb-4">Selected work · 07</p>
      <h2 className="font-display text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
        Things I&apos;ve built
      </h2>
      <div className="mt-16 grid gap-6 md:grid-cols-2">
        {projects.map((p, i) => {
          const href = p.links.demo || p.links.github
          const Card = (
            <div
              data-cursor={href ? "open" : undefined}
              className="group h-full rounded-2xl border border-border bg-secondary/60 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--cork)] hover:shadow-[0_30px_60px_-30px_rgba(70,50,30,0.4)]"
            >
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-2xl font-semibold text-foreground">{p.name}</h3>
                <span className="section-label">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <p className="mt-1 text-sm text-[var(--terracotta)]">{p.tagline}</p>
              <p className="mt-4 text-muted-foreground leading-relaxed">{p.description}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {p.technologies.map((t) => (
                  <span key={t} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )
          return (
            <Reveal key={p.name} delay={(i % 2) * 0.08}>
              {href ? (
                <a href={href} target="_blank" rel="noopener noreferrer" className="block h-full">
                  {Card}
                </a>
              ) : (
                Card
              )}
            </Reveal>
          )
        })}
      </div>
      <BuildLog />
    </section>
  )
}
```

- [ ] **Step 2: Create `components/build-log.tsx`**

```tsx
"use client"
import { moreProjects } from "@/lib/portfolio-data"

export default function BuildLog() {
  return (
    <details className="group mt-12 rounded-2xl border border-border bg-secondary/40 p-6">
      <summary className="section-label flex cursor-pointer list-none items-center justify-between" data-cursor="toggle">
        <span>Build log · {moreProjects.length} more</span>
        <span className="transition-transform group-open:rotate-45">+</span>
      </summary>
      <ul className="mt-6 divide-y divide-border">
        {moreProjects.map((m) => (
          <li key={m.name} className="flex flex-col gap-1 py-4 md:flex-row md:items-baseline md:gap-6">
            <div className="flex w-full items-baseline justify-between md:w-56 md:shrink-0">
              <span className="font-display font-medium text-foreground">{m.name}</span>
              <span className="section-label">{m.date}</span>
            </div>
            <p className="text-sm text-muted-foreground">{m.description}</p>
          </li>
        ))}
      </ul>
    </details>
  )
}
```

- [ ] **Step 3: Verify build + drive**

Run: `npx tsc --noEmit`, then in the running dev server confirm 7 cards render, hover lifts a card, the build-log expands to 12 entries.
Expected: no type errors; visual behavior as described.

- [ ] **Step 4: Commit**

```bash
git add components/work.tsx components/build-log.tsx
git commit -m "feat: selected-work cards + collapsible build log"
```

---

## Task 9: Capabilities section

**Files:**
- Create: `components/capabilities.tsx`

**Interfaces:**
- Consumes: `skills` from `@/lib/portfolio-data`, `Reveal`.
- Produces: `<Capabilities />` — 6 skill groups as warm columns; each group lists its items.

- [ ] **Step 1: Create `components/capabilities.tsx`**

```tsx
"use client"
import { skills } from "@/lib/portfolio-data"
import Reveal from "@/components/scroll/reveal"

export default function Capabilities() {
  const total = skills.reduce((n, s) => n + s.items.length, 0)
  return (
    <section id="capabilities" aria-label="Capabilities" className="border-y border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-6 py-24 md:px-12">
        <p className="section-label mb-4">Capabilities · {total}</p>
        <h2 className="font-display text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
          What I work with
        </h2>
        <div className="mt-16 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {skills.map((group, i) => (
            <Reveal key={group.category} delay={(i % 3) * 0.06}>
              <div>
                <h3 className="section-label mb-4 text-foreground">{group.category}</h3>
                <ul className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li key={item} className="rounded-full border border-border bg-background px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-[var(--cork)] hover:text-foreground">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify build is green**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/capabilities.tsx
git commit -m "feat: warm capabilities section (skill groups)"
```

---

## Task 10: Journey (experience + education timeline)

**Files:**
- Create: `components/journey.tsx`

**Interfaces:**
- Consumes: `experiences`, `education` from `@/lib/portfolio-data`, `Reveal`.
- Produces: `<Journey />` — a single vertical timeline: each role with company/position/date/when + responsibilities, then an education block at the end.

- [ ] **Step 1: Create `components/journey.tsx`**

```tsx
"use client"
import { experiences, education } from "@/lib/portfolio-data"
import Reveal from "@/components/scroll/reveal"

export default function Journey() {
  return (
    <section id="journey" aria-label="Journey" className="mx-auto max-w-6xl px-6 py-24 md:px-12">
      <p className="section-label mb-4">Journey · {experiences.length} roles</p>
      <h2 className="font-display text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
        Where I&apos;ve been
      </h2>
      <div className="mt-16 border-l border-border pl-6 md:pl-10">
        {experiences.map((e, i) => (
          <Reveal key={e.company + e.date} delay={0}>
            <div className="relative pb-14">
              <span className="absolute -left-[1.6rem] top-2 h-3 w-3 rounded-full bg-[var(--cork)] md:-left-[2.9rem]" />
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-xl font-semibold text-foreground">
                  {e.position} · {e.company}
                </h3>
                <span className="section-label">{e.when ?? e.date}</span>
              </div>
              {e.location ? <p className="mt-1 text-sm text-muted-foreground">{e.location} · {e.date}</p> : <p className="mt-1 text-sm text-muted-foreground">{e.date}</p>}
              <ul className="mt-4 space-y-2">
                {e.responsibilities.map((r) => (
                  <li key={r} className="text-muted-foreground leading-relaxed before:mr-3 before:text-[var(--cork)] before:content-['—']">
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
        <Reveal>
          <div className="relative">
            <span className="absolute -left-[1.6rem] top-2 h-3 w-3 rounded-full bg-[var(--terracotta)] md:-left-[2.9rem]" />
            <h3 className="section-label mb-4 text-foreground">Education</h3>
            {education.map((ed) => (
              <div key={ed.degree} className="mb-4">
                <p className="font-display font-medium text-foreground">{ed.degree}</p>
                <p className="text-sm text-muted-foreground">{ed.institution} · {ed.location} · {ed.date}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify build is green**

Run: `npx tsc --noEmit`
Expected: no errors. (`experiences[].location` is optional — the ternary handles absence.)

- [ ] **Step 3: Commit**

```bash
git add components/journey.tsx
git commit -m "feat: journey timeline merging experience + education"
```

---

## Task 11: Recognition (certs + awards)

**Files:**
- Create: `components/recognition.tsx`

**Interfaces:**
- Consumes: `certifications`, `awards` from `@/lib/portfolio-data`, `Reveal`.
- Produces: `<Recognition />` — compact warm strip: certs row + awards row, each item linking out when a url exists.

- [ ] **Step 1: Create `components/recognition.tsx`**

```tsx
"use client"
import { certifications, awards } from "@/lib/portfolio-data"
import Reveal from "@/components/scroll/reveal"

export default function Recognition() {
  return (
    <section id="recognition" aria-label="Recognition" className="border-y border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-6 py-20 md:px-12">
        <div className="grid gap-16 md:grid-cols-2">
          <Reveal>
            <div>
              <p className="section-label mb-6">Certifications</p>
              <ul className="space-y-4">
                {certifications.map((c) => (
                  <li key={c.name}>
                    <a href={c.url} target="_blank" rel="noopener noreferrer" data-cursor="view" className="group flex items-baseline justify-between border-b border-border pb-3 transition-colors hover:border-[var(--cork)]">
                      <span className="font-display font-medium text-foreground">{c.name}</span>
                      <span className="text-sm text-muted-foreground group-hover:text-[var(--terracotta)]">{c.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div>
              <p className="section-label mb-6">Awards</p>
              <ul className="space-y-4">
                {awards.map((a) => {
                  const meta = [a.description, a.years?.join(" / ")].filter(Boolean).join(" · ")
                  const inner = (
                    <span className="flex items-baseline justify-between border-b border-border pb-3">
                      <span className="font-display font-medium text-foreground">{a.title}</span>
                      {meta ? <span className="text-sm text-muted-foreground">{meta}</span> : null}
                    </span>
                  )
                  return (
                    <li key={a.title}>
                      {a.url ? (
                        <a href={a.url} target="_blank" rel="noopener noreferrer" data-cursor="view" className="block transition-colors hover:text-[var(--terracotta)]">
                          {inner}
                        </a>
                      ) : (
                        inner
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify build is green**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/recognition.tsx
git commit -m "feat: recognition strip (certifications + awards)"
```

---

## Task 12: Contact (warm outro)

**Files:**
- Modify: `components/contact.tsx`

**Interfaces:**
- Consumes: `profile` from `@/lib/portfolio-data`, `Magnetic`.
- Produces: `<Contact />` — big warm outro CTA + email/phone/LinkedIn/GitHub links.

- [ ] **Step 1: Rewrite `components/contact.tsx`**

```tsx
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
        Let&apos;s build<br />something.
      </h2>
      <div className="mt-12">
        <Magnetic>
          <a href={`mailto:${profile.email}?subject=Hello Farhad`} data-cursor="say hi" className="inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-4 text-lg text-background transition-colors hover:bg-[var(--terracotta)]">
            {profile.email}
          </a>
        </Magnetic>
      </div>
      <div className="mt-16 grid grid-cols-2 gap-6 border-t border-border pt-10 md:grid-cols-4">
        {links.map((l) => (
          <a key={l.label} href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" data-cursor="open" className="group">
            <div className="section-label">{l.label}</div>
            <div className="mt-1 text-foreground transition-colors group-hover:text-[var(--terracotta)]">{l.text}</div>
          </a>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify build is green**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/contact.tsx
git commit -m "feat: warm contact outro"
```

---

## Task 13: Corner menu overlay

**Files:**
- Create: `components/menu.tsx`

**Interfaces:**
- Consumes: `Magnetic`.
- Produces: `<Menu />` — fixed top-right toggle; opens a full-screen warm overlay with anchor links (Work, Capabilities, Journey, Contact). Closes on link click and on Escape.

- [ ] **Step 1: Create `components/menu.tsx`**

```tsx
"use client"
import { useEffect, useState } from "react"
import Magnetic from "@/components/motion/magnetic"

const ITEMS = [
  { href: "#work", label: "Work" },
  { href: "#capabilities", label: "Capabilities" },
  { href: "#journey", label: "Journey" },
  { href: "#contact", label: "Contact" },
]

export default function Menu() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])
  return (
    <>
      <div className="fixed right-5 top-5 z-[90]">
        <Magnetic>
          <button
            onClick={() => setOpen((o) => !o)}
            data-cursor={open ? "close" : "menu"}
            aria-label={open ? "Close menu" : "Open menu"}
            className="rounded-full border border-border bg-background/80 px-5 py-2 text-sm font-medium text-foreground backdrop-blur transition-colors hover:border-[var(--cork)]"
          >
            {open ? "Close" : "Menu"}
          </button>
        </Magnetic>
      </div>
      <div
        className={`fixed inset-0 z-[80] flex flex-col items-center justify-center gap-2 bg-background/95 backdrop-blur-md transition-opacity duration-500 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {ITEMS.map((it) => (
          <a
            key={it.href}
            href={it.href}
            onClick={() => setOpen(false)}
            data-cursor="go"
            className="font-display text-5xl font-semibold tracking-tight text-foreground transition-colors hover:text-[var(--terracotta)] md:text-7xl"
          >
            {it.label}
          </a>
        ))}
      </div>
    </>
  )
}
```

- [ ] **Step 2: Verify build is green**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/menu.tsx
git commit -m "feat: immersive corner menu overlay"
```

---

## Task 14: Assemble page + delete dead code + full verification

**Files:**
- Modify: `app/page.tsx`
- Delete: all files listed under "Delete" in File Structure.

**Interfaces:**
- Consumes: all section components + `Cursor`, `Menu`, `SmoothScrollProvider`.
- Produces: the final composed page.

- [ ] **Step 1: Rewrite `app/page.tsx`**

```tsx
import SmoothScrollProvider from "@/components/scroll/smooth-scroll-provider"
import Cursor from "@/components/motion/cursor"
import Menu from "@/components/menu"
import Hero from "@/components/hero"
import Statement from "@/components/statement"
import Work from "@/components/work"
import Capabilities from "@/components/capabilities"
import Journey from "@/components/journey"
import Recognition from "@/components/recognition"
import Contact from "@/components/contact"

export default function Home() {
  return (
    <SmoothScrollProvider>
      <Cursor />
      <Menu />
      <main className="min-h-screen text-foreground">
        <Hero />
        <Statement />
        <Work />
        <Capabilities />
        <Journey />
        <Recognition />
        <Contact />
      </main>
    </SmoothScrollProvider>
  )
}
```

- [ ] **Step 2: Delete dead files**

```bash
git rm components/console/operator-console.tsx components/console/panel.tsx components/console/section-heading.tsx \
  components/three/skill-galaxy.tsx components/three/skill-detail.tsx components/three/nebula.tsx \
  components/three/particle-field.tsx components/three/glow-texture.ts components/three/hero-canvas.tsx \
  components/three/effects.tsx components/summary.tsx components/stats-strip.tsx components/projects.tsx \
  components/more-projects.tsx components/skills.tsx components/experience.tsx components/education.tsx \
  components/certifications.tsx components/awards.tsx components/header.tsx components/resume.tsx \
  components/theme-toggle.tsx
```

- [ ] **Step 3: Check for stragglers referencing deleted files**

Run: `grep -rn "operator-console\|skill-galaxy\|hero-canvas\|theme-toggle\|components/header\|stats-strip\|more-projects\|components/summary\|components/skills\|components/experience\|components/education\|components/certifications\|components/awards\|components/projects\|components/resume\|ThemeProvider\|theme-provider" app components --include=*.tsx --include=*.ts`
Expected: NO matches. If any appear (e.g. `theme-provider.tsx` still imported somewhere), remove the import/usage. If `components/theme-provider.tsx` is now unused, `git rm` it too.

- [ ] **Step 4: Full build**

Run: `npx tsc --noEmit && npm run build`
Expected: both green, no unresolved imports.

- [ ] **Step 5: Drive the whole page in the browser**

Run `npm run dev`, load `http://localhost:3000`, and confirm:
- Hero blob renders and follows cursor; button is magnetic; custom cursor labels.
- Scroll is smooth (Lenis); each section reveals on entry.
- Work: 7 cards, hover lift, demo links open; build log expands to 12.
- Capabilities: 6 groups. Journey: 7 roles + education. Recognition: 4 certs + 3 awards.
- Contact: big outro, all 4 links correct.
- Menu: opens full-screen overlay, links jump + close, Escape closes.
- Set OS "reduce motion" ON → reload: blob is a static gradient, no custom cursor, reveals show content immediately, native scroll, everything legible.
- Resize to 375px width: layout holds, no horizontal scroll, cursor hidden on touch.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: assemble warm portfolio page + remove mission-control theme"
```

---

## Self-Review

**Spec coverage:**
- §3 palette → Task 1. Typography swap → Task 1. Motion (Lenis/Reveal/magnetic/cursor) → Tasks 2,3,4. 3D hero + fallback → Task 5. Reduced-motion everywhere → Tasks 2–5 + verified Task 14.5.
- §4 structure: Hero T6, Statement T7, Work+BuildLog T8, Capabilities T9, Journey T10, Recognition T11, Contact T12, immersive menu T13. Page order T14.
- §5 deletes → Task 14.2/14.3. §6 styling (globals/theme) → Task 1. §7 data flow → all sections read `portfolio-data.ts`, unchanged. §8 degradation → fallbacks in T5 + verified T14.5. §9 verification → build gates each task + drive in T14.5.
- All 7 flagship + 12 archive + 7 roles + 2 degrees + 6 skill groups + 4 certs + 3 awards + 4 stats accounted for. No spec requirement left unimplemented.

**Placeholder scan:** No TBD/TODO/"handle edge cases"/"similar to Task N". Every code step is complete and copy-pasteable.

**Type consistency:** `useReducedMotion` signature identical across Tasks 2–5. `Magnetic` takes a single `React.ReactElement` child (used in Hero, Contact, Menu). `Reveal` props (`delay`, `y`, `className`) consistent across all consumers. Data field names (`links.demo`, `technologies`, `responsibilities`, `when`, `location?`, `years`, `label`) match `lib/portfolio-data.ts` exactly. `HeroSculpture` imported ssr:false only in Hero. `BuildLog` imported by `Work`.
