"use client"
import { useCallback, useEffect, useRef, useState } from "react"
import { useReducedMotion } from "@/lib/use-reduced-motion"
import { profile } from "@/lib/portfolio-data"
import { playModem, unlockSound, isSoundOn, setSoundOn, onSoundChange } from "@/lib/sound"

const SEEN_KEY = "farhad.intro.seen"

type Lenis = { stop: () => void; start: () => void; scrollTo: (t: number, o?: object) => void }
const lenis = () => (window as unknown as { __lenis?: Lenis }).__lenis

// Phases of the time-machine intro:
//  page     – the 2003 GeoCities page is up
//  dialup   – modem + "downloading 23 years of updates" progress
//  crt      – CRT power-off collapse (line → dot → black)
//  power    – black → scanline power-on, modern site fades in behind
//  done     – overlay gone; only the tiny replay link remains
type Phase = "page" | "dialup" | "crt" | "power" | "done"

export default function RetroIntro() {
  const [mounted, setMounted] = useState(false)
  const [phase, setPhase] = useState<Phase>("done")
  const [soundOn, setSoundOnState] = useState(false)
  const reduced = useReducedMotion()
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  // Keep the checkbox in sync with the global sound preference.
  useEffect(() => {
    setSoundOnState(isSoundOn())
    return onSoundChange(setSoundOnState)
  }, [])

  const after = useCallback((ms: number, fn: () => void) => {
    timers.current.push(setTimeout(fn, ms))
  }, [])

  // Freeze the page while the overlay owns the screen; restore on exit.
  const freeze = useCallback((on: boolean) => {
    document.documentElement.style.overflow = on ? "hidden" : ""
    const l = lenis()
    if (!l) return
    if (on) l.stop()
    else l.start()
  }, [])

  // Decide visibility on the client only, to avoid an SSR/hydration flash.
  useEffect(() => {
    setMounted(true)
    let seen = false
    try {
      seen = localStorage.getItem(SEEN_KEY) === "1"
    } catch {
      seen = false
    }
    if (!seen) {
      setPhase("page")
      freeze(true)
    }
  }, [freeze])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  // The one real interaction: fast-forward to the present.
  const enter = useCallback(() => {
    unlockSound() // first gesture — unlock audio
    if (reduced) {
      finish()
      return
    }
    playModem() // the dial-up handshake screech, synced to the dialup phase
    setPhase("dialup")
    after(2000, () => setPhase("crt"))
    after(2650, () => {
      setPhase("power")
      lenis()?.scrollTo(0, { duration: 0 })
    })
    after(3300, finish)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced])

  const finish = useCallback(() => {
    setPhase("done")
    freeze(false)
    try {
      localStorage.setItem(SEEN_KEY, "1")
    } catch {
      /* private mode — just skip persistence */
    }
  }, [freeze])

  // Replay: clear the flag, reset the machine, freeze again.
  const replay = useCallback(() => {
    try {
      localStorage.removeItem(SEEN_KEY)
    } catch {
      /* ignore */
    }
    timers.current.forEach(clearTimeout)
    timers.current = []
    lenis()?.scrollTo(0, { duration: 0 })
    setPhase("page")
    freeze(true)
  }, [freeze])

  if (!mounted) return null

  // When done, all that's left is the tiny replay affordance.
  if (phase === "done") {
    return (
      <button
        onClick={replay}
        aria-label="Replay the 2011 intro"
        className="fixed bottom-3 left-3 z-[80] rounded px-1.5 py-0.5 font-mono text-[0.62rem] text-foreground/30 transition-colors hover:text-[var(--terracotta)] md:bottom-4 md:left-4"
      >
        ↺ est. 2011
      </button>
    )
  }

  const collapsing = phase === "crt"
  const black = phase === "crt" || phase === "power"

  return (
    <div
      id="retro"
      role="dialog"
      aria-label="Farhad's Homepage, 2011"
      className="fixed inset-0 z-[999] overflow-hidden"
      style={{ background: black ? "#000" : "#000080" }}
    >
      <style>{RETRO_CSS}</style>

      {/* Power-on scanline sweep, then the modern site shows through */}
      {phase === "power" ? <div className="retro-poweron" /> : null}

      {/* The CRT tube: everything collapses into a line then a dot */}
      <div className={collapsing ? "retro-tube retro-off" : "retro-tube"}>
        <div className="retro-scan" aria-hidden />
        <div className="retro-page">
          <h1 className="retro-title">
            <span className="retro-star">✦</span> Farhad&apos;s Homepage{" "}
            <span className="retro-star">✦</span>
          </h1>
          <div className="retro-construction">🚧 UNDER CONSTRUCTION SINCE 2011 🚧</div>

          {phase === "page" ? (
            <>
              <table className="retro-contact">
                <tbody>
                  <tr>
                    <td>📧 Email</td>
                    <td><a href={`mailto:${profile.email}`}>{profile.email}</a></td>
                  </tr>
                  <tr>
                    <td>☎ Phone</td>
                    <td><a href={`tel:${profile.phoneTel}`}>{profile.phoneDisplay}</a></td>
                  </tr>
                  <tr>
                    <td>🔗 LinkedIn</td>
                    <td><a href={profile.linkedin} target="_blank" rel="noopener noreferrer">in/farhadnava</a></td>
                  </tr>
                  <tr>
                    <td>💾 GitHub</td>
                    <td><a href={profile.github} target="_blank" rel="noopener noreferrer">@falhad</a></td>
                  </tr>
                  <tr>
                    <td>📄 Résumé</td>
                    <td><a href="/files/cv.pdf" download data-cursor="download">» download my CV «</a></td>
                  </tr>
                </tbody>
              </table>

              <p className="retro-hint">Psst… it&apos;s not really 2011.</p>
              <div className="retro-enterwrap">
                <span className="retro-point retro-point-l" aria-hidden>👉</span>
                <button
                  type="button"
                  className="retro-enter"
                  onClick={enter}
                  data-cursor="enter"
                >
                  <span className="retro-blink">▶</span> CLICK TO FAST-FORWARD TO 2026{" "}
                  <span className="retro-blink">⏩</span>
                </button>
                <span className="retro-point retro-point-r" aria-hidden>👈</span>
              </div>
              <label className="retro-sound">
                <input
                  type="checkbox"
                  checked={soundOn}
                  onChange={(e) => {
                    unlockSound()
                    setSoundOn(e.target.checked)
                  }}
                />
                🔊 Enable sound
              </label>
              <p className="retro-copy">© 2011 Farhad · made with Notepad</p>
            </>
          ) : (
            /* dial-up upgrade screen */
            <div className="retro-dialup">
              <pre className="retro-term">
                {`> connecting to 2026 ...
~~~ kshhhh  CRRRK  bing bong  ~~~
> handshake ok. downloading 23 years of updates`}
              </pre>
              <div className="retro-progwrap">
                <span>2003</span>
                <div className="retro-prog">
                  <div className="retro-progfill" />
                </div>
                <span>2026</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const RETRO_CSS = `
#retro { color: #fff; font-family: "Times New Roman", Times, serif; }
#retro .retro-tube {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  overflow: auto; padding: 24px 12px;
  background:
    radial-gradient(circle at 20% 30%, rgba(255,255,255,.9) 0 1px, transparent 1px) 0 0/60px 60px,
    radial-gradient(circle at 70% 60%, rgba(255,255,255,.7) 0 1px, transparent 1px) 0 0/90px 90px,
    #000080;
  transform-origin: center center;
}
#retro .retro-off { animation: retro-crtoff .62s cubic-bezier(.5,0,.7,1) forwards; }
@keyframes retro-crtoff {
  0%   { transform: scale(1,1); filter: brightness(1); }
  55%  { transform: scale(1,.006); filter: brightness(3); }
  75%  { transform: scale(1,.006); filter: brightness(3); }
  100% { transform: scale(.001,.006); filter: brightness(6); opacity: 0; }
}
#retro .retro-scan {
  pointer-events: none; position: absolute; inset: 0; z-index: 5; opacity: .18;
  background: repeating-linear-gradient(0deg, rgba(0,0,0,.6) 0 1px, transparent 1px 3px);
}
#retro .retro-page {
  position: relative; z-index: 1; width: min(560px, 94vw); text-align: center;
  background: #c0c0c0; color: #000; border: 3px ridge #fff; padding: 14px 16px 20px;
  box-shadow: 0 0 0 2px #000, 6px 6px 0 rgba(0,0,0,.5);
}
#retro .retro-title { font-family: "Comic Sans MS", "Comic Sans", cursive; font-size: 30px; color: #000080; margin: 6px 0 4px; text-shadow: 2px 2px 0 #fff; }
#retro .retro-construction {
  font-weight: bold; color: #ffcc00; margin: 10px auto 18px; max-width: 380px; font-size: 13px;
  background: #000; padding: 7px 6px; letter-spacing: .5px;
  border-top: 6px solid; border-bottom: 6px solid;
  border-image: repeating-linear-gradient(45deg, #ffcc00 0 10px, #000 10px 20px) 6;
}
#retro .retro-contact {
  margin: 0 auto 18px; border-collapse: collapse; background: #fff; color: #000; font-size: 13px;
  border: 2px inset #fff;
}
#retro .retro-contact td { border: 1px solid #808080; text-align: left; padding: 5px 10px; }
#retro .retro-contact td:first-child { background: #000080; color: #fff; font-weight: bold; white-space: nowrap; }
#retro .retro-contact a { color: #0000ee; }
#retro .retro-contact a[download] { color: #008000; font-weight: bold; }
#retro .retro-hint { color: #800080; font-style: italic; font-size: 15px; margin: 0 0 14px; }
#retro .retro-enter {
  display: block; width: 100%; max-width: 420px; margin: 0 auto; cursor: pointer;
  background: #000080; color: #00ff66; border: 3px outset #6a6aff; padding: 16px 18px;
  font-family: "Courier New", monospace; font-size: 18px; font-weight: bold; letter-spacing: .5px;
  box-shadow: 0 4px 0 rgba(0,0,0,.4);
}
#retro .retro-enter:hover { background: #0000c0; color: #66ffaa; }
#retro .retro-enter:active { border-style: inset; box-shadow: none; transform: translateY(2px); }
#retro .retro-copy { font-size: 11px; color: #555; margin-top: 18px; }
#retro .retro-sound {
  display: flex; align-items: center; justify-content: center; gap: 7px;
  margin: 14px auto 0; font-family: "Courier New", monospace; font-size: 13px;
  color: #000080; cursor: pointer; user-select: none;
}
#retro .retro-sound input { width: 15px; height: 15px; cursor: pointer; accent-color: #000080; }
#retro .retro-blink { animation: retro-blink 1s steps(1) infinite; }
@keyframes retro-blink { 50% { opacity: 0; } }

/* Two big arrows flanking the fast-forward button so it can't be missed. */
#retro .retro-enterwrap { display: flex; align-items: center; justify-content: center; gap: 6px; }
#retro .retro-point { font-size: 30px; line-height: 1; flex: none; filter: drop-shadow(0 1px 0 rgba(0,0,0,.4)); }
#retro .retro-point-l { animation: retro-point-l 0.7s ease-in-out infinite; }
#retro .retro-point-r { animation: retro-point-r 0.7s ease-in-out infinite; }
@keyframes retro-point-l { 0%,100% { transform: translateX(0); } 50% { transform: translateX(7px); } }
@keyframes retro-point-r { 0%,100% { transform: translateX(0); } 50% { transform: translateX(-7px); } }
@media (max-width: 420px) { #retro .retro-point { font-size: 22px; } }

#retro .retro-dialup { padding: 14px 6px 20px; }
#retro .retro-term {
  text-align: left; background: #000; color: #0f0; font-family: "Courier New", monospace;
  font-size: 12px; padding: 10px; border: 2px inset #808080; white-space: pre-wrap; margin: 0 0 14px;
}
#retro .retro-progwrap { display: flex; align-items: center; gap: 8px; font-family: "Courier New", monospace; color: #000080; font-size: 12px; }
#retro .retro-prog { flex: 1; height: 16px; background: #fff; border: 2px inset #808080; overflow: hidden; }
#retro .retro-progfill { height: 100%; width: 0; background: repeating-linear-gradient(90deg, #000080 0 8px, #3060c0 8px 12px); animation: retro-fill 1.7s linear forwards; }
@keyframes retro-fill { to { width: 100%; } }

#retro .retro-poweron {
  pointer-events: none; position: absolute; inset: 0; z-index: 10; background: #fff;
  animation: retro-poweron .6s ease-out forwards;
}
@keyframes retro-poweron {
  0%   { opacity: 1; transform: scaleY(.002); }
  30%  { opacity: 1; transform: scaleY(.002); }
  55%  { opacity: .8; transform: scaleY(1); }
  100% { opacity: 0; transform: scaleY(1); }
}
@media (prefers-reduced-motion: reduce) {
  #retro .retro-off, #retro .retro-poweron, #retro .retro-progfill,
  #retro .retro-blink, #retro .retro-blink-slow,
  #retro .retro-point-l, #retro .retro-point-r { animation: none; }
}
`
