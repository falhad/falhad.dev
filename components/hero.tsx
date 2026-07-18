"use client"
import dynamic from "next/dynamic"
import { useCallback, useEffect, useRef, useState } from "react"
import { profile } from "@/lib/portfolio-data"
import LampDialog from "@/components/hero/lamp-dialog"
import { useReducedMotion } from "@/lib/use-reduced-motion"

// three touches window at module load — never server-render it.
const Scene = dynamic(() => import("@/components/three/scene"), { ssr: false })

const LAMP_KEY = "farhad.lamp.on"

// The room "talks" to the visitor. Lines are picked at random each time.
const DARK_LINES = [
  "Whoa — it's pitch black in here, I can't see a thing! Could you hit the desk lamp for me?",
  "Uh oh, looks like nobody paid the electricity bill. Mind flicking the lamp on?",
  "It's darker than my coffee in here. Tap the desk lamp so we can see the desk?",
  "I may have coded with the lights off again… be a hero and click the lamp?",
  "Error 404: photons not found. Please press the desk lamp to continue.",
  "It's giving 'production incident at 2am' energy. Lamp, please?",
  "I can hear you squinting. The desk lamp is right there 👀",
  "Dark mode is great for apps, less great for entire rooms. Lamp?",
  "My retinas filed a ticket. Severity: high. Fix: click the lamp.",
  "We could do this the hard way, or you could just tap the lamp.",
  "Somewhere in this darkness is a beautiful 3D desk. Lamp reveals it.",
  "I'm not scared of the dark. I just can't render it. Lamp on?",
  "Loading… photons at 0%. Tap the desk lamp to install light.",
  "Feels like a horror game in here. Flip the lamp before the jump-scare.",
  "The lamp isn't just décor — it's the light switch. Give it a click 💡",
]
const OFF_LINES = [
  "Hey! Who turned off the lights? I was working here!",
  "Rude. Back to the darkness, I see. 🕶️",
  "Great, now I have to code by vibes again.",
  "Lights off? Bold move. My eyes thank you and also hate you.",
  "You know the lamp is decorative *and* functional, right? …fine, spooky mode it is.",
  "Cool cool cool. Debugging blindfolded. Love that for me.",
  "And there goes the ambiance. Very 'unpaid intern basement'.",
  "Off again? My circadian rhythm is filing a complaint.",
  "You flipped it just to see what I'd say, didn't you.",
  "Fine. Ninja mode. I'll deploy from the shadows. 🥷",
  "The desk misses you already. So does the photon.",
  "Achievement unlocked: Left Farhad in the Dark.",
  "This is exactly how legacy code gets written, you know.",
  "Lights out. I guess we're 'moody senior dev' now.",
  "That's the third time. I'm starting to take it personally.",
]
const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)]


export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const [lampOn, setLampOn] = useState(true)
  const [dialog, setDialog] = useState<{ text: string; canClose: boolean } | null>(null)
  const lampRef = useRef(true)
  const offTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Show a self-dismissing quip bubble (used by lamp-off + object clicks).
  const flash = useCallback((text: string) => {
    if (offTimer.current) clearTimeout(offTimer.current)
    setDialog({ text, canClose: true })
    offTimer.current = setTimeout(() => setDialog(null), 4500)
  }, [])

  // Desk objects talk to the DOM via window events (dispatched from the 3D scene).
  useEffect(() => {
    const onBubble = (e: Event) => {
      const d = (e as CustomEvent<{ text: string }>).detail
      if (d?.text) flash(d.text)
    }
    window.addEventListener("desk-bubble", onBubble)
    return () => window.removeEventListener("desk-bubble", onBubble)
  }, [flash])

  // First visit (and only with the 3D scene): start in the dark with a prompt.
  useEffect(() => {
    if (reduced) return
    let seen = false
    try {
      seen = localStorage.getItem(LAMP_KEY) === "1"
    } catch {
      seen = false
    }
    if (!seen) {
      lampRef.current = false
      setLampOn(false)
      setDialog({ text: pick(DARK_LINES), canClose: false })
    }
    return () => {
      if (offTimer.current) clearTimeout(offTimer.current)
    }
  }, [reduced])

  const toggleLamp = useCallback(() => {
    const next = !lampRef.current
    lampRef.current = next
    setLampOn(next)
    if (offTimer.current) clearTimeout(offTimer.current)
    if (next) {
      setDialog(null)
      try {
        localStorage.setItem(LAMP_KEY, "1")
      } catch {
        /* private mode — skip persistence */
      }
    } else {
      // Playful quip; auto-dismisses so it doesn't linger in the dark.
      flash(pick(OFF_LINES))
    }
  }, [flash])

  // Fade the overlay out as the camera pushes into the screen.
  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current
      const ov = overlayRef.current
      if (!el || !ov) return
      const r = el.getBoundingClientRect()
      const range = r.height - window.innerHeight
      const p = range > 0 ? Math.min(1, Math.max(0, -r.top / range)) : 0
      const t = Math.min(1, Math.max(0, (p - 0.55) / 0.22))
      ov.style.opacity = String(1 - t * t * (3 - 2 * t))
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    // Tall section so the scroll-scripted desk sequence has room to play while
    // the inner container stays pinned. Content flows normally after it.
    <section ref={sectionRef} id="hero" aria-label="Intro" className="relative h-[300vh]">
      <div
        className="sticky top-0 h-screen overflow-hidden"
        style={{ background: "radial-gradient(120% 100% at 50% 28%, #191512, #0c0906 72%)" }}
      >
        <Scene lampOn={lampOn} onToggleLamp={toggleLamp} />

        {/* The hero is a WebGL canvas with no machine-readable text, so this
            accessible block gives screen readers, search engines and LLMs the
            real page heading and a concise, keyword-natural intro. */}
        <header className="sr-only">
          <h1>Farhad Navayazdan — Senior Software Developer &amp; Software Engineer in Muscat, Oman</h1>
          <p>
            Farhad Navayazdan (falhad) is a senior software developer and software engineer based in
            Muscat, Oman, with 14+ years of experience. He builds AI and LLM software — including RAG
            (retrieval-augmented generation) systems and AI agents — alongside real-time monitoring
            platforms, blockchain applications, and full-stack web and mobile products using Rust,
            Next.js, Kotlin, Python and Spring Boot. Available for senior software engineering and AI
            development work in Oman and remotely worldwide.
          </p>
        </header>

        {dialog ? (
          <LampDialog
            text={dialog.text}
            canClose={dialog.canClose}
            // The opening dark prompt (canClose:false) doubles as a big tap
            // target that turns the lamp on — reliable where the 3D lamp isn't.
            onActivate={!dialog.canClose && !lampOn ? toggleLamp : undefined}
          />
        ) : null}

        <div ref={overlayRef}>
          {/* Dark scrim so the overlay text grounds against the dim room. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[42vh]"
            style={{ background: "linear-gradient(to top, #0c0906 12%, rgba(12,9,6,0))" }}
          />

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-pulse text-[0.7rem] font-medium uppercase tracking-[0.22em] text-[#9a8f7d]">
            scroll ↓
          </div>
        </div>
      </div>
    </section>
  )
}
