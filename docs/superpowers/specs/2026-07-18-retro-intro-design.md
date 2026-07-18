# Retro Intro ("est. 2003") — Design

**Goal:** On first visit, show a Web-1.0 (2003 GeoCities-style) page with an easter-egg link that, when clicked, plays a dial-up→CRT transition into the current modern site.

**Vibe:** The whole site is already a journey through computing eras (hero desk → push into Mac → macOS desktop). This prepends the earliest era: Web 1.0. Time-machine framing.

## Decisions (locked)
- **When shown:** first visit only. `localStorage["farhad.intro.seen"] = "1"` after the transition completes. Return visitors skip straight to the modern site.
- **Replay:** a tiny, low-opacity fixed link at the hero's bottom-left — `↺ est. 2003` — clears the flag and replays the intro (no reload needed).
- **Transition:** dial-up progress → CRT power-off → power-on, stacked (~3s total).
- **Content tone:** pure gag (retro furniture + the one easter-egg link). No real bio.
- **Easter-egg line:** `Psst… it's not really 2003. Click to fast-forward 23 years ⏩`

## Retro page content
Full-screen overlay above everything. Self-contained styling so 2000s CSS never leaks into the Tailwind dark theme.
- Tiled starfield / `#000080` navy background, Times New Roman body, one Comic Sans heading.
- Centered `<table>` layout.
- `<marquee>`: `★ Welcome to Farhad's Homepage ★ Under Construction since 2003 ★`
- Blinking `<h1>` title.
- "🚧 Under Construction 🚧" bar.
- Fake hit counter: `You are visitor #000847`.
- Badge text: `Best viewed in Netscape Navigator @ 800×600`.
- Webring row: `[ ‹ prev ]  [ random ]  [ next › ]` (non-functional, period-correct).
- `<hr>` dividers, a "Sign my Guestbook" button that does nothing.
- The easter-egg link — lime `#00ff00`, underlined — the only real interaction.

## Transition sequence
1. Click link → retro content dims; a monospace terminal line types `Connecting to 2026...` + modem text `~~~ kshhh CRRRK bing ~~~`.
2. Progress bar `2003 [▓▓▓▓░░░░] 2026` fills ~1.5s under `Downloading 23 years of updates…`.
3. CRT power-off: overlay collapses to a bright horizontal line → shrinks to a dot → black.
4. Power-on: black → quick scanline sweep → modern site revealed. Overlay unmounts; flag set.
- **Reduced-motion:** skip steps 1–4; instant unmount + set flag.

## Architecture
- **New file:** `components/retro/retro-intro.tsx` — a client component. Holds all state (`phase: "page" | "dialup" | "crt-off" | "power-on" | "done"`), the scoped `<style>` block (wrapper id `#retro`), and the replay link.
- **Mount point:** `app/page.tsx`, rendered above `<main>`. While the intro is visible it freezes page scroll (`overflow:hidden` on `html`) and marks `<main>` `aria-hidden`.
- **No global CSS changes** beyond, if needed, one keyframe set inside the component's scoped `<style>`.
- **Hydration:** to avoid SSR/first-paint mismatch, the overlay decides visibility in `useEffect` (reads localStorage) and renders nothing on the server / first client paint; a `useState(false)` → `true` gate prevents a flash for return visitors.

## Units
- `RetroIntro` (visibility + phase state machine + replay) — one file, one responsibility.
- Scoped retro styles live with it (not in `globals.css`).
- `app/page.tsx` only gains one import + one element.
