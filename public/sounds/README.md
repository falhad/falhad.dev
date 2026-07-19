# Sound clips

Tapping the minions plays a RANDOM clip from this folder (see MINION_SOUNDS in
components/three/scene.tsx). Current clips:

- **minions.mp3** — "minion voice" by fattirewhitey, Creative Commons 0
  (commercial OK, no attribution). Source:
  https://freesound.org/people/fattirewhitey/sounds/326247/ (trimmed ~2.6s, mono, normalized)
- **minions_voice.mp3**, **minions_elo.mp3**, **minions_hello.mp3**,
  **minions_bello.mp3**, **minions_banana.mp3**, **minions_banana2.mp3**,
  **minion_laugh.mp3** — user-supplied (mono, normalized; the 4–5s ones trimmed
  to ~3.5s). ⚠️ Verify each is properly licensed for public/commercial use
  before it stays on the live site (only minions.mp3 above is confirmed CC0).

## Drone

- **drone_takeoff.mp3** — "Drone take off" by GeorgeHopkins.
  Source: https://freesound.org/people/GeorgeHopkins/sounds/537241/
  Trimmed to the first 2.4s of spin-up, mono, normalized.
- **drone_flight.mp3** — "Drone in flight" by GeorgeHopkins.
  Source: https://freesound.org/people/GeorgeHopkins/sounds/537236/
  A 4.5s window (34–39s of the original), mono, normalized, and
  crossfade-wrapped so it loops with no audible seam.

> ⚠️ **Both are Creative Commons Attribution 4.0 (CC BY 4.0), *not* CC0.**
> Commercial use is fine, but the license *requires visible credit* on the
> site. Attribution is not optional and is currently NOT yet rendered
> anywhere in the UI — add a credit line (e.g. in the footer or a colophon)
> before this goes to production, or replace these clips with CC0 ones.
> Suggested wording:
> "Drone sounds by GeorgeHopkins (freesound.org), CC BY 4.0."

## Desk objects (all CC0 — no attribution required)

- **mug_sip.mp3** — "Sip of coffee, swallow then 'ah'" by odditonic, CC0.
  https://freesound.org/people/odditonic/sounds/194808/
  Leading 0.2s trimmed, mono, normalized (3.6s). Plays on mug tap; an
  empty mug falls back to the plain blip instead.
- **rubik_twist.mp3** — "Rubick's Cube Solving" by Djeb_8059, CC0.
  https://freesound.org/people/Djeb_8059/sounds/586242/
  First 1.4s (the crispest twists) of a 12.7s take, mono, normalized.
- **speaker_on.mp3** — "bose connecting sound" by Skardale, CC0.
  https://freesound.org/people/Skardale/sounds/624736/
  Trimmed to the chime itself at 1.10–1.52s — the source had 0.9s of
  leading silence that would have delayed the click feedback. Plays only
  when switching sound ON.

Drop more **.mp3** files here and add their paths to MINION_SOUNDS
(components/three/scene.tsx) to expand the pool.

- Path the app looks for: `/sounds/minions.mp3` (i.e. `public/sounds/minions.mp3`)
- If the file is absent, the app falls back to a synthesized "gibberish" placeholder.
- Keep it short (< 1s) and small (a few KB–tens of KB). mp3/ogg/wav all work.

## Use only properly-licensed audio

The actual Minions movie voice is Universal/Illumination copyright — do NOT put
movie rips or Zedge/ringtone-site clips on a public site. Safe sources:

- Pixabay Sound Effects — https://pixabay.com/sound-effects/ (free, commercial OK, no attribution)
- Mixkit — https://mixkit.co/free-sound-effects/ (free license)
- Freesound — https://freesound.org (filter license = "Creative Commons 0")
- Or record your own "bello! banana!" — then it's 100% yours.
