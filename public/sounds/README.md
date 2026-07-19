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
