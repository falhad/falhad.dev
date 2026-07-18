"use client"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Environment, useGLTF, useAnimations } from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import { Suspense, useEffect, useMemo, useRef } from "react"
import * as THREE from "three"
import { clone as cloneSkinned } from "three/examples/jsm/utils/SkeletonUtils.js"
import { profile } from "@/lib/portfolio-data"
import { useReducedMotion } from "@/lib/use-reduced-motion"

const LAPTOP = "/models/macbook.glb" // user-supplied MacBook Pro
const MUG = "/models/mug_latte.glb" // user-supplied (converted spec-gloss -> metal-rough)
const DESK = "/models/computer_desk.glb" // user-supplied
const NOTEBOOK = "/models/notebook_and_pen.glb" // user-supplied
const FLOWER = "/models/small_flower._polycam_app.glb" // user-supplied
const LAMP = "/models/desk_lamp.glb" // user-supplied
const PHONE = "/models/phone.glb" // user-supplied (iPhone)
const MINIONS = "/models/minions.glb" // user-supplied (3 minions on an iPad)
const RUBIK = "/models/rubik.glb" // user-supplied
const DRONE = "/models/drone.glb" // user-supplied (animated, spec-gloss→metalrough)
const LID_NODE = "VCQqxpxkUlzqcJI_62" // MacBook lid/screen sub-assembly (17 meshes)
const SCREEN_MESH = "Object_123" // the emissive display (lid) — recolored black so the name panel blends

const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const invlerp = (v: number, a: number, b: number) => clamp((v - a) / (b - a), 0, 1)
const smooth = (t: number) => t * t * (3 - 2 * t)
const v3lerp = (out: THREE.Vector3, a: THREE.Vector3, b: THREE.Vector3, t: number) =>
  out.set(lerp(a.x, b.x, t), lerp(a.y, b.y, t), lerp(a.z, b.z, t))

type Anchor = "bottom" | "top" | "center"

// Load a glb, scaled to `size` by footprint, anchored so its bottom/top/center
// sits at local y=0. The desk surface is y=0, so everything rests on it.
function useAnchored(url: string, size: number, anchor: Anchor, fit: "footprint" | "max" = "footprint") {
  const { scene } = useGLTF(url)
  return useMemo(() => {
    const object = scene.clone(true)
    const box = new THREE.Box3().setFromObject(object)
    const s = new THREE.Vector3()
    const c = new THREE.Vector3()
    box.getSize(s)
    box.getCenter(c)
    const y = anchor === "bottom" ? -box.min.y : anchor === "top" ? -box.max.y : -c.y
    object.position.set(-c.x, y, -c.z)
    object.traverse((o) => {
      const m = o as THREE.Mesh
      if (m.isMesh) {
        m.castShadow = true
        m.receiveShadow = true
      }
    })
    const k = size / (fit === "max" ? Math.max(s.x, s.y, s.z) : Math.max(s.x, s.z))
    const g = new THREE.Group()
    g.add(object)
    g.scale.setScalar(k)
    return g
  }, [scene, size, anchor, fit])
}

// The MacBook, bottom-anchored to the desk, with its lid on a hinge pivot.
function useMacBook(size: number) {
  const { scene } = useGLTF(LAPTOP)
  return useMemo(() => {
    const object = scene.clone(true)
    object.updateWorldMatrix(true, true)

    let pivot: THREE.Object3D | null = null
    const lid = object.getObjectByName(LID_NODE)
    if (lid) {
      const lb = new THREE.Box3().setFromObject(lid)
      pivot = new THREE.Group()
      pivot.position.set(0, lb.min.y, lb.max.z) // hinge line (bottom-rear of lid)
      object.add(pivot)
      pivot.attach(lid)
    }

    // Blank the default wallpaper to pure black.
    const screen = object.getObjectByName(SCREEN_MESH) as THREE.Mesh | undefined
    if (screen) screen.material = new THREE.MeshBasicMaterial({ color: "#000000" })

    object.traverse((o) => {
      const m = o as THREE.Mesh
      if (m.isMesh) {
        m.castShadow = true
        m.receiveShadow = true
        // Soften the aluminium so the lamp reflects as a gentle highlight, not
        // a mirror hotspot. Clone the material so the cached asset isn't mutated.
        const mat = m.material as THREE.MeshStandardMaterial
        if (mat?.isMeshStandardMaterial && mat.metalness > 0.3) {
          const soft = mat.clone()
          // Dial the aluminium way down so the lamp reads as a soft sheen,
          // not a blown-out hotspot on the lid.
          soft.roughness = Math.min(1, soft.roughness + 0.6)
          soft.metalness = Math.min(soft.metalness, 0.5)
          soft.envMapIntensity = 0.5
          m.material = soft
        }
      }
    })

    const box = new THREE.Box3().setFromObject(object)
    const s = new THREE.Vector3()
    const c = new THREE.Vector3()
    box.getSize(s)
    box.getCenter(c)
    object.position.set(-c.x, -box.min.y, -c.z) // sit on the desk
    const k = size / Math.max(s.x, s.z)
    const group = new THREE.Group()
    group.add(object)
    group.scale.setScalar(k)
    return { group, pivot }
  }, [scene, size])
}


// Pure-black screen showing the name + title in an Apple-style typeface.
const SF = '"SF Pro Display", -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif'
function useNameTexture() {
  return useMemo(() => {
    const W = 1600
    const H = 1000
    const c = document.createElement("canvas")
    c.width = W
    c.height = H
    const x = c.getContext("2d")!
    x.fillStyle = "#000000"
    x.fillRect(0, 0, W, H)
    x.textAlign = "center"
    x.textBaseline = "middle"
    // Name
    x.fillStyle = "#ffffff"
    x.font = `600 150px ${SF}`
    x.fillText(profile.name, W / 2, H / 2 - 40)
    // Title
    x.fillStyle = "#8a8a8f"
    x.font = `400 58px ${SF}`
    if ("letterSpacing" in x) (x as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "3px"
    x.fillText(profile.title, W / 2, H / 2 + 90)
    const t = new THREE.CanvasTexture(c)
    t.anisotropy = 8
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [])
}

// A little yellow sticky note with a handwritten TODO — drawn to a canvas
// texture and laid on the desk beside the notebook.
function useStickyTexture() {
  return useMemo(() => {
    const S = 900
    const c = document.createElement("canvas")
    c.width = S
    c.height = S
    const x = c.getContext("2d")!
    x.fillStyle = "#fde26b"
    x.fillRect(0, 0, S, S)
    // faint shading toward one corner, like a real sticky
    const g = x.createLinearGradient(0, 0, S, S)
    g.addColorStop(0, "rgba(255,255,255,0.25)")
    g.addColorStop(1, "rgba(0,0,0,0.06)")
    x.fillStyle = g
    x.fillRect(0, 0, S, S)
    x.fillStyle = "#2b2410"
    x.textBaseline = "middle"
    x.textAlign = "center"
    x.font = `700 92px "Comic Sans MS", "Marker Felt", "Chalkboard SE", cursive`
    x.fillText("Farhad's TODO", S / 2, 95)
    const items: [string, boolean][] = [
      ["Learn Rust (again)", true],
      ["Ship falhad.dev", true],
      ["Sleep", false],
      ["Drink coffee", true],
      ["Water Steve", false],
      ["Escape the 2000s", false],
    ]
    x.textAlign = "left"
    x.font = `600 58px "Comic Sans MS", "Marker Felt", "Chalkboard SE", cursive`
    let y = 230
    for (const [t, done] of items) {
      x.fillStyle = "#2b2410"
      x.fillText(done ? "☑" : "☐", 70, y)
      x.fillText(t, 165, y)
      if (done) {
        x.strokeStyle = "#2b2410"
        x.lineWidth = 4
        x.beginPath()
        x.moveTo(165, y + 6)
        x.lineTo(165 + x.measureText(t).width, y + 6)
        x.stroke()
      }
      y += 112
    }
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 8
    return tex
  }, [])
}

// The phone's lock screen — a canvas texture. Off (black) by default; flashes on
// with a live clock + a rotating notification, and taps advance it too.
function usePhoneScreen() {
  const data = useMemo(() => {
    const W = 596
    const H = 1285
    const c = document.createElement("canvas")
    c.width = W
    c.height = H
    const x = c.getContext("2d")!
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 8
    const notifs = [
      { icon: "💬", title: "Recruiter", msg: "Are you available? 👀", c1: "#34d058", c2: "#1c9e3e" },
      { icon: "⭐", title: "GitHub", msg: "Someone starred your repo", c1: "#4b5563", c2: "#1f2937" },
      { icon: "✅", title: "Build passed", msg: "All green in 42s. Ship it.", c1: "#34c759", c2: "#1e8e46" },
      { icon: "💬", title: "Slack", msg: "3 unread — all can wait.", c1: "#8b5cf6", c2: "#5b21b6" },
      { icon: "☕", title: "Reminder", msg: "Refill coffee. Priority: critical.", c1: "#c98a3e", c2: "#8a5a24" },
    ]
    const rr = (px: number, py: number, w: number, h: number, r: number) => {
      x.beginPath()
      x.roundRect(px, py, w, h, r)
    }
    const draw = (on: boolean, i: number) => {
      x.clearRect(0, 0, W, H)
      // rounded screen mask (so the corners match the glass)
      x.save()
      rr(0, 0, W, H, 78)
      x.clip()
      if (!on) {
        x.fillStyle = "#000"
        x.fillRect(0, 0, W, H)
        x.restore()
        tex.needsUpdate = true
        return
      }
      // wallpaper: deep gradient + soft glow
      const g = x.createLinearGradient(0, 0, 0, H)
      g.addColorStop(0, "#161d33")
      g.addColorStop(0.55, "#0c1120")
      g.addColorStop(1, "#05070e")
      x.fillStyle = g
      x.fillRect(0, 0, W, H)
      const glow = x.createRadialGradient(W / 2, 220, 20, W / 2, 220, 460)
      glow.addColorStop(0, "rgba(120,150,220,0.22)")
      glow.addColorStop(1, "rgba(120,150,220,0)")
      x.fillStyle = glow
      x.fillRect(0, 0, W, H)

      // status bar
      x.fillStyle = "rgba(255,255,255,0.92)"
      x.textAlign = "left"
      x.font = "600 30px -apple-system, Arial, sans-serif"
      x.fillText("Muscat", 44, 68)
      // battery + wifi (right)
      x.save()
      x.translate(W - 54, 56)
      x.strokeStyle = "rgba(255,255,255,0.85)"
      x.fillStyle = "rgba(255,255,255,0.85)"
      x.lineWidth = 3
      rr(0, 0, 46, 22, 6)
      x.stroke()
      rr(3, 3, 34, 16, 3)
      x.fill()
      x.fillRect(48, 6, 4, 10)
      // wifi fan
      x.beginPath()
      x.arc(-30, 18, 18, Math.PI * 1.25, Math.PI * 1.75)
      x.stroke()
      x.beginPath()
      x.arc(-30, 18, 11, Math.PI * 1.25, Math.PI * 1.75)
      x.stroke()
      x.beginPath()
      x.arc(-30, 18, 4, 0, Math.PI * 2)
      x.fill()
      x.restore()

      // date + clock
      const now = new Date()
      const time = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      const date = now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })
      x.textAlign = "center"
      x.fillStyle = "rgba(255,255,255,0.72)"
      x.font = "500 40px -apple-system, Arial, sans-serif"
      x.fillText(date, W / 2, 210)
      x.fillStyle = "#fff"
      x.font = "300 138px -apple-system, 'Helvetica Neue', Arial, sans-serif"
      x.fillText(time, W / 2, 336)

      // stacked card peeking behind (depth)
      const cx = 40
      const cw = W - 80
      x.fillStyle = "rgba(255,255,255,0.28)"
      rr(cx + 22, 470, cw - 44, 210, 42)
      x.fill()

      // main notification card (frosted light)
      const cy = 500
      const ch = 224
      x.save()
      x.shadowColor = "rgba(0,0,0,0.35)"
      x.shadowBlur = 34
      x.shadowOffsetY = 14
      x.fillStyle = "rgba(250,250,252,0.96)"
      rr(cx, cy, cw, ch, 46)
      x.fill()
      x.restore()

      const n = notifs[i % notifs.length]
      // app icon tile with brand gradient
      const ix = cx + 34
      const iy = cy + 40
      const isz = 104
      const ig = x.createLinearGradient(ix, iy, ix, iy + isz)
      ig.addColorStop(0, n.c1)
      ig.addColorStop(1, n.c2)
      x.fillStyle = ig
      rr(ix, iy, isz, isz, 26)
      x.fill()
      x.font = "60px sans-serif"
      x.textAlign = "center"
      x.textBaseline = "middle"
      x.fillText(n.icon, ix + isz / 2, iy + isz / 2 + 4)
      x.textBaseline = "alphabetic"

      // title + time + message
      const tx = ix + isz + 28
      x.textAlign = "left"
      x.fillStyle = "#0d0d0f"
      x.font = "700 44px -apple-system, Arial, sans-serif"
      x.fillText(n.title, tx, cy + 78)
      x.fillStyle = "#9aa0ac"
      x.textAlign = "right"
      x.font = "500 32px -apple-system, Arial, sans-serif"
      x.fillText("now", cx + cw - 34, cy + 74)
      x.textAlign = "left"
      x.fillStyle = "#3a3d44"
      x.font = "400 40px -apple-system, Arial, sans-serif"
      const words = n.msg.split(" ")
      let line = ""
      let ly = cy + 138
      for (const w of words) {
        if (x.measureText(line + w).width > cw - isz - 90) {
          x.fillText(line.trim(), tx, ly)
          line = w + " "
          ly += 48
        } else line += w + " "
      }
      x.fillText(line.trim(), tx, ly)

      // flashlight + camera pills (iOS lock-screen feet)
      x.fillStyle = "rgba(255,255,255,0.14)"
      x.beginPath()
      x.arc(96, H - 150, 46, 0, Math.PI * 2)
      x.fill()
      x.beginPath()
      x.arc(W - 96, H - 150, 46, 0, Math.PI * 2)
      x.fill()
      x.fillStyle = "rgba(255,255,255,0.8)"
      x.font = "40px sans-serif"
      x.textAlign = "center"
      x.fillText("🔦", 96, H - 136)
      x.fillText("📷", W - 96, H - 136)

      // home indicator
      x.fillStyle = "rgba(255,255,255,0.85)"
      rr(W / 2 - 96, H - 54, 192, 12, 6)
      x.fill()

      x.restore()
      tex.needsUpdate = true
    }
    draw(false, 0)
    return { tex, notifs, draw }
  }, [])

  const idx = useRef(0)
  useEffect(() => {
    const timers = new Set<ReturnType<typeof setTimeout>>()
    const at = (fn: () => void, ms: number) => {
      const id = setTimeout(() => {
        timers.delete(id)
        fn()
      }, ms)
      timers.add(id)
    }
    const loop = () => {
      idx.current = (idx.current + 1) % data.notifs.length
      data.draw(true, idx.current)
      at(() => data.draw(false, idx.current), 4000) // screen sleeps after 4s
      at(loop, 4000 + 5000 + Math.random() * 5000) // next flash 5–10s later
    }
    data.draw(false, 0)
    at(loop, 2500)
    return () => timers.forEach(clearTimeout)
  }, [data])

  const tap = () => {
    idx.current = (idx.current + 1) % data.notifs.length
    data.draw(true, idx.current)
  }
  return { texture: data.tex, tap }
}

// Soft radial puff for wispy coffee steam.
function useSteamTexture() {
  return useMemo(() => {
    const S = 128
    const c = document.createElement("canvas")
    c.width = S
    c.height = S
    const x = c.getContext("2d")!
    const g = x.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2)
    g.addColorStop(0, "rgba(255,255,255,0.85)")
    g.addColorStop(0.45, "rgba(255,255,255,0.28)")
    g.addColorStop(1, "rgba(255,255,255,0)")
    x.fillStyle = g
    x.fillRect(0, 0, S, S)
    const t = new THREE.CanvasTexture(c)
    return t
  }, [])
}

// Camera keyframes: top-down on the desk → eye-level looking at the open laptop.
const CAM_TOP = new THREE.Vector3(0, 8.0, 2.6)
const CAM_EYE = new THREE.Vector3(0, 1.7, 7.4)
const CAM_INTO = new THREE.Vector3(0, 1.12, 1.4) // dolly right up to the screen
const LOOK_TOP = new THREE.Vector3(0, 0, 0.3)
const LOOK_EYE = new THREE.Vector3(0, 0.7, 0)
const LOOK_INTO = new THREE.Vector3(0, 1.12, -0.2) // straight into the screen

const LID_CLOSED = 1.78 // radians; model default (0) is open
const MUG_POS: [number, number, number] = [3.25, 0, 0.45]
const NOTEBOOK_POS: [number, number, number] = [-2.95, 0, 1.35]
const NOTEBOOK_ROT: [number, number, number] = [0, 0.5, 0]
// Sticky note pose — local to the notebook group, resting on the cover.
const STICKY_POS: [number, number, number] = [0.05, 0.19, 0]
const STICKY_ROT: [number, number, number] = [-Math.PI / 2, 0, 0.25]
const STICKY_SIZE = 0.5
const PHONE_POS: [number, number, number] = [2.35, 0.02, 1.95] // near (below) the coffee mug
const PHONE_TWIST = -0.35
const PHONE_ROT: [number, number, number] = [-Math.PI / 2, 0, PHONE_TWIST] // lay flat on the desk
const PHONE_SCREEN: [number, number] = [0.675, 1.455] // matches the model's display area
// Local offset (in the phone's own space) placing the screen just above its face.
const PHONE_SCREEN_OFFSET: [number, number, number] = [0, 0.76, 0.09]
const FLOWER_POS: [number, number, number] = [-3.35, 0, -0.9]
const MINIONS_POS: [number, number, number] = [-2.05, 0, -1.75]
const MINIONS_ROT: [number, number, number] = [0, 0, 0]
const MINIONS_SCALE = 0.48
const RUBIK_POS: [number, number, number] = [1.15, 0, 2.0]
const RUBIK_ROT: [number, number, number] = [0, 0.4, 0]
const DRONE_SCALE = 0.6
// Flight route (closed loop): home → over the minions → over the plant → sweep
// back → home. Home (index 0) is low on the desk so it lands there.
const DRONE_ROUTE: [number, number, number][] = [
  [2.15, 0.12, -1.6], // home (parked on desk)
  [0.6, 2.1, -2.05], // rise, cross behind the laptop
  [-2.0, 2.15, -1.75], // over the minions
  [-3.2, 1.95, -0.9], // over the plant
  [-1.2, 2.2, 0.5], // sweep across the front
  [1.9, 2.05, -0.7], // bank back toward home
]
const LAMP_POS: [number, number, number] = [3.1, 0, -0.7]
const LAMP_ROT: [number, number, number] = [0, -0.5, 0]
const SCREEN_POS: [number, number, number] = [0, 1.13, -0.04]
const SCREEN_ROT: [number, number, number] = [-0.16, 0, 0]
const SCREEN_SIZE: [number, number] = [2.46, 1.56]

// ---- Desk object personalities ----
const MUG_LINES = [
  "☕ Ah, fuel. This is what 14 years of shipping runs on.",
  "Sip. Okay, now the code will compile.",
  "Careful, it's hot — like my take on tabs vs spaces.",
  "One more cup and I'll refactor the whole universe.",
  "Espresso: because 'sleep' is a deprecated API.",
]
const MUG_EMPTY = "Empty. ☹️ Someone alert the barista."
const PLANT_LINES = [
  "🌵 Meet Steve. Watered twice in 2 years. Still thriving.",
  "Steve doesn't judge your code. Steve just vibes.",
  "Photosynthesis and clean commits — Steve does both.",
  "Steve has survived more deploys than most startups.",
  "Petting a cactus? Bold move. Respect.",
]
const MAC_LINES = [
  "*knock knock* …I open when you scroll ↓",
  "Locked for now — scroll down and watch me open ↓",
  "Patience. I unfold as you scroll ↓",
]
const pickLine = (a: string[]) => a[Math.floor(Math.random() * a.length)]
const quip = (text: string) => window.dispatchEvent(new CustomEvent("desk-bubble", { detail: { text } }))

// A clickable desk object: pointer cursor on hover + a small pop on click.
// No hover lift — objects stay planted on the desk.
function Interactive({
  position = [0, 0, 0],
  rotation,
  onClick,
  children,
}: {
  position?: [number, number, number]
  rotation?: [number, number, number]
  onClick: () => void
  children: React.ReactNode
}) {
  const ref = useRef<THREE.Group>(null)
  const punch = useRef(0)
  useFrame((_s, dtRaw) => {
    const g = ref.current
    if (!g) return
    const dt = Math.min(dtRaw, 0.05)
    punch.current += (0 - punch.current) * (1 - Math.pow(0.02, dt))
    g.scale.setScalar(1 + 0.1 * punch.current)
  })
  return (
    <group
      ref={ref}
      position={position}
      rotation={rotation}
      onPointerOver={(e) => {
        e.stopPropagation()
        document.body.style.cursor = "pointer"
      }}
      onPointerOut={() => {
        document.body.style.cursor = ""
      }}
      onClick={(e) => {
        e.stopPropagation()
        punch.current = 1
        onClick()
      }}
    >
      {children}
    </group>
  )
}

// Drone parked left of the lamp. Hover → takes off and flies a loop over the
// minions and the plant, then banks home. Keeps flying a few seconds after the
// pointer leaves, finishes the lap, and lands back home.
function Drone() {
  const { scene, animations } = useGLTF(DRONE)
  const model = useMemo(() => cloneSkinned(scene), [scene])
  const group = useRef<THREE.Group>(null)
  const { actions } = useAnimations(animations, group)
  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(DRONE_ROUTE.map((w) => new THREE.Vector3(...w)), true, "catmullrom", 0.5),
    [],
  )
  const p = useRef(0)
  const flying = useRef(false)
  const landTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pos = useMemo(() => new THREE.Vector3(), [])

  const takeOff = () => {
    if (landTimer.current) {
      clearTimeout(landTimer.current)
      landTimer.current = null
    }
    document.body.style.cursor = "pointer"
    if (!flying.current) {
      flying.current = true
      actions["hover"]?.reset().fadeIn(0.3).play()
    }
  }
  const scheduleLand = () => {
    document.body.style.cursor = ""
    if (landTimer.current) clearTimeout(landTimer.current)
    landTimer.current = setTimeout(() => {
      flying.current = false // finishes the current lap in useFrame, then lands
      landTimer.current = null
    }, 3000)
  }
  useEffect(() => () => {
    if (landTimer.current) clearTimeout(landTimer.current)
  }, [])

  useFrame((_s, dtRaw) => {
    const g = group.current
    if (!g) return
    const dt = Math.min(dtRaw, 0.05)
    const speed = 1 / 11 // one lap ≈ 11s
    if (flying.current) {
      p.current = (p.current + dt * speed) % 1
    } else if (p.current > 0.0006) {
      // not hovering anymore — finish the lap back to home, then stop
      p.current += dt * speed
      if (p.current >= 1) {
        p.current = 0
        actions["hover"]?.fadeOut(0.8)
      }
    }
    curve.getPointAt(p.current, pos)
    g.position.copy(pos)
    // Always face the viewer (camera) — like it's watching you.
    const dcx = _s.camera.position.x - pos.x
    const dcz = _s.camera.position.z - pos.z
    g.rotation.y = Math.atan2(dcx, dcz)
  })
  return (
    <group
      ref={group}
      scale={DRONE_SCALE}
      onPointerOver={(e) => {
        e.stopPropagation()
        takeOff()
      }}
      onPointerOut={scheduleLand}
    >
      <primitive object={model} />
    </group>
  )
}

function Sequence({ onToggleLamp }: { onToggleLamp: () => void }) {
  const laptop = useRef<THREE.Group>(null)
  const nameMat = useRef<THREE.MeshBasicMaterial>(null)
  const { pointer } = useThree()
  const px = useRef(0)
  const py = useRef(0)
  const camPos = useRef(new THREE.Vector3().copy(CAM_TOP))
  const camLook = useRef(new THREE.Vector3().copy(LOOK_TOP))

  const { group: macbook, pivot } = useMacBook(3.2)
  const mug = useAnchored(MUG, 1.0, "bottom")
  const desk = useAnchored(DESK, 8.5, "top")
  const notebook = useAnchored(NOTEBOOK, 1.7, "bottom")
  const flower = useAnchored(FLOWER, 0.72, "bottom")
  const lamp = useAnchored(LAMP, 3.5, "bottom", "max")
  const phone = useAnchored(PHONE, 1.5, "bottom", "max")
  // Rigged model — bbox auto-fit misreads skinned meshes, so load raw + scale manually.
  const minionsGltf = useGLTF(MINIONS)
  const minions = useMemo(() => {
    const obj = cloneSkinned(minionsGltf.scene)
    // Model ships unlit (KHR_materials_unlit) → glows in the dark. Convert to a
    // lit material so it dims with the room.
    const toLit = (mat: THREE.Material) => {
      const b = mat as THREE.MeshBasicMaterial
      if (!(b as unknown as { isMeshBasicMaterial?: boolean }).isMeshBasicMaterial) return mat
      return new THREE.MeshStandardMaterial({ color: b.color, map: b.map ?? null, roughness: 0.75, metalness: 0 })
    }
    obj.traverse((n) => {
      const m = n as THREE.Mesh
      if (!m.isMesh) return
      m.material = Array.isArray(m.material) ? m.material.map(toLit) : toLit(m.material)
    })
    return obj
  }, [minionsGltf])
  const rubik = useAnchored(RUBIK, 0.38, "bottom")
  const phoneScreen = usePhoneScreen()
  // Blacken the phone's emissive (glowing white) display so our lock-screen
  // content sits on a real black screen instead of looking like a floating layer.
  useMemo(() => {
    phone.traverse((o) => {
      const m = o as THREE.Mesh
      if (!m.isMesh) return
      const mat = m.material as THREE.MeshStandardMaterial
      if (mat?.emissive && mat.emissive.r + mat.emissive.g + mat.emissive.b > 1.2) {
        const b = mat.clone()
        b.emissive.setRGB(0, 0, 0)
        b.emissiveIntensity = 0
        b.color.setRGB(0, 0, 0)
        m.material = b
      }
    })
  }, [phone])
  const nameTex = useNameTexture()
  const stickyTex = useStickyTexture()

  const steamTex = useSteamTexture()

  // Desk object state (kept in refs so clicks don't re-render the scene).
  const steamSprites = useRef<THREE.Sprite[]>([])
  const sips = useRef(8)

  const onMug = () => {
    sips.current -= 1
    quip(sips.current <= 0 ? MUG_EMPTY : pickLine(MUG_LINES))
    if (sips.current < 0) sips.current = 0
  }
  const onPlant = () => quip(pickLine(PLANT_LINES))
  const onPhone = () => phoneScreen.tap()
  const onMac = () => {
    quip(pickLine(MAC_LINES))
    const l = (window as unknown as { __lenis?: { scrollTo: (t: number, o?: object) => void } }).__lenis
    const to = window.scrollY + window.innerHeight * 0.6
    if (l) l.scrollTo(to, { duration: 1.2 })
    else window.scrollTo({ top: to, behavior: "smooth" })
  }

  useFrame((state, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05)
    const hero = document.getElementById("hero")
    let p = 0
    if (hero) {
      const r = hero.getBoundingClientRect()
      const range = r.height - window.innerHeight
      p = range > 0 ? clamp(-r.top / range, 0, 1) : 0
    }
    px.current += (pointer.x - px.current) * (1 - Math.pow(0.002, dt))
    py.current += (pointer.y - py.current) * (1 - Math.pow(0.002, dt))

    // 1) top-down → eye-level, 2) then dolly into the screen at the very end.
    const camT = smooth(invlerp(p, 0.08, 0.55))
    const pushT = smooth(invlerp(p, 0.74, 0.97))
    v3lerp(camPos.current, CAM_TOP, CAM_EYE, camT)
    v3lerp(camLook.current, LOOK_TOP, LOOK_EYE, camT)
    v3lerp(camPos.current, camPos.current, CAM_INTO, pushT)
    v3lerp(camLook.current, camLook.current, LOOK_INTO, pushT)
    const parallax = camT * (1 - pushT)
    state.camera.position.set(
      camPos.current.x + px.current * 0.5 * parallax,
      camPos.current.y + py.current * 0.3 * parallax,
      camPos.current.z,
    )
    state.camera.lookAt(camLook.current)

    if (pivot) pivot.rotation.x = lerp(LID_CLOSED, 0, smooth(invlerp(p, 0.15, 0.6)))
    if (laptop.current) laptop.current.rotation.y = px.current * 0.05 * (1 - pushT)

    // Name fades onto the screen once the lid opens, then fades back out as the
    // camera pushes into the (black) screen — so the transition ends in black.
    if (nameMat.current) {
      const fadeIn = smooth(invlerp(p, 0.5, 0.68))
      const fadeOut = smooth(invlerp(p, 0.82, 0.95))
      nameMat.current.opacity = fadeIn * (1 - fadeOut)
    }

    // Coffee steam — continuous wispy vapor rising, curling and dissipating.
    const et = state.clock.elapsedTime
    const N = steamSprites.current.length
    steamSprites.current.forEach((s, i) => {
      if (!s) return
      const ph = ((et * 0.2 + i / Math.max(N, 1)) % 1 + 1) % 1
      s.position.y = ph * 0.55
      s.position.x = Math.sin(ph * 4 + i * 1.7) * 0.1 * ph
      s.position.z = Math.cos(ph * 3 + i * 2.1) * 0.07 * ph
      const sc = 0.1 + ph * 0.32
      s.scale.set(sc, sc * 1.4, sc)
      ;(s.material as THREE.SpriteMaterial).opacity = Math.sin(ph * Math.PI) * 0.05
    })
  })

  return (
    <group>
      <primitive object={desk} position={[0, 0, 0]} />
      <group
        ref={laptop}
        position={[0, 0, 0]}
        onClick={(e) => {
          e.stopPropagation()
          onMac()
        }}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "")}
      >
        <primitive object={macbook} />
        <mesh position={SCREEN_POS} rotation={SCREEN_ROT}>
          <planeGeometry args={SCREEN_SIZE} />
          <meshBasicMaterial ref={nameMat} map={nameTex} transparent opacity={0} toneMapped={false} />
        </mesh>
      </group>

      <Interactive position={MUG_POS} onClick={onMug}>
        <primitive object={mug} />
      </Interactive>
      {/* Continuous wispy steam above the mug. */}
      <group position={[MUG_POS[0], 0.5, MUG_POS[2]]}>
        {Array.from({ length: 4 }).map((_, i) => (
          <sprite
            key={i}
            ref={(el) => {
              if (el) steamSprites.current[i] = el as unknown as THREE.Sprite
            }}
          >
            <spriteMaterial map={steamTex} transparent opacity={0} depthWrite={false} toneMapped={false} />
          </sprite>
        ))}
      </group>

      <group position={NOTEBOOK_POS} rotation={NOTEBOOK_ROT}>
        <primitive object={notebook} />
        {/* Small sticky note resting on top of the notebook cover. Uses a lit
            material so it goes dark with the room instead of glowing. */}
        <mesh position={STICKY_POS} rotation={STICKY_ROT}>
          <planeGeometry args={[STICKY_SIZE, STICKY_SIZE]} />
          <meshStandardMaterial map={stickyTex} roughness={0.95} metalness={0} />
        </mesh>
      </group>
      <Interactive position={FLOWER_POS} onClick={onPlant}>
        <primitive object={flower} />
      </Interactive>
      <primitive object={minions} position={MINIONS_POS} rotation={MINIONS_ROT} scale={MINIONS_SCALE} />
      <primitive object={rubik} position={RUBIK_POS} rotation={RUBIK_ROT} />
      <Drone />
      {/* Phone + its lock-screen overlay (child, so it tracks the phone exactly).
          Tap the screen to cycle notifications. */}
      <group position={PHONE_POS} rotation={PHONE_ROT} scale={0.8}>
        <primitive object={phone} />
        {/* Lock-screen content, laid flush on the (now black) glass. Tap to advance; also auto-flashes. */}
        <mesh
          position={PHONE_SCREEN_OFFSET}
          onClick={(e) => {
            e.stopPropagation()
            onPhone()
          }}
          onPointerOver={(e) => {
            e.stopPropagation()
            document.body.style.cursor = "pointer"
          }}
          onPointerOut={() => (document.body.style.cursor = "")}
        >
          <planeGeometry args={PHONE_SCREEN} />
          <meshBasicMaterial map={phoneScreen.texture} toneMapped={false} transparent side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* The lamp is the light switch: click anywhere on it to toggle the room light. */}
      <group
        onClick={(e) => {
          e.stopPropagation()
          onToggleLamp()
        }}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "")}
      >
        <primitive object={lamp} position={LAMP_POS} rotation={LAMP_ROT} />
      </group>
    </group>
  )
}

// Room lighting driven by the lamp switch — eases between dark and lit so the
// light "warms up" instead of snapping on.
function Lights({ lampOn }: { lampOn: boolean }) {
  const amb = useRef<THREE.AmbientLight>(null)
  const spot = useRef<THREE.SpotLight>(null)
  const hemi = useRef<THREE.HemisphereLight>(null)
  const fill = useRef<THREE.DirectionalLight>(null)
  const moon = useRef<THREE.SpotLight>(null)
  const lvl = useRef(lampOn ? 1 : 0)
  useFrame((_state, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05)
    lvl.current += ((lampOn ? 1 : 0) - lvl.current) * (1 - Math.pow(0.004, dt))
    const l = lvl.current
    // Dark: almost no global fill — only the moon cone reveals the lamp/laptop/mug.
    // Lit: warm room-wide fill on top.
    if (amb.current) amb.current.intensity = 0.02 + 0.95 * l
    if (hemi.current) hemi.current.intensity = 0.02 + 1.05 * l
    if (fill.current) fill.current.intensity = 0.72 * l
    if (spot.current) spot.current.intensity = 58 * l
    if (moon.current) moon.current.intensity = 7 * (1 - l)
  })
  return (
    <>
      {/* Warmer ambient/fill so lamp-on feels cozy, not clinical. */}
      <ambientLight ref={amb} intensity={0.02} color="#d19a5c" />
      <hemisphereLight ref={hemi} intensity={0} color="#ffe7bd" groundColor="#2a1f14" />
      <directionalLight ref={fill} position={[-4, 6, 4]} intensity={0} color="#ffdca0" />
      {/* Faint cool "moonlight" cone aimed at the laptop — grazes the lamp, laptop
          and mug so those read in the dark while the rest stays black. Fades out
          as the lamp turns on. */}
      <spotLight
        ref={moon}
        position={[1.4, 5, 1.6]}
        angle={0.62}
        penumbra={1}
        intensity={0}
        distance={16}
        decay={2}
        color="#8ea6c6"
      />
      <spotLight
        ref={spot}
        position={[2.5, 1.75, 0.2]}
        angle={0.95}
        penumbra={0.85}
        intensity={0}
        distance={18}
        decay={2}
        color="#ffce8a"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0002}
      />
    </>
  )
}

useGLTF.preload(LAPTOP)
useGLTF.preload(MUG)
useGLTF.preload(DESK)
useGLTF.preload(NOTEBOOK)
useGLTF.preload(FLOWER)
useGLTF.preload(LAMP)
useGLTF.preload(PHONE)
useGLTF.preload(MINIONS)
useGLTF.preload(RUBIK)
useGLTF.preload(DRONE)

export default function Scene({ lampOn = true, onToggleLamp = () => {} }: { lampOn?: boolean; onToggleLamp?: () => void }) {
  const reduced = useReducedMotion()
  if (reduced) {
    return (
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 50% at 55% 40%, #C29B6B22, transparent 70%), radial-gradient(45% 45% at 40% 70%, #A85A3C18, transparent 70%)",
        }}
      />
    )
  }
  return (
    <div className="absolute inset-0" aria-hidden>
      <Canvas shadows camera={{ position: [0, 8.0, 2.6], fov: 42 }} dpr={[1, 1.9]} gl={{ antialias: true, alpha: true, toneMappingExposure: 0.78 }}>
        {/* Lamp-driven room lighting (dark until the switch is clicked). */}
        <Lights lampOn={lampOn} />
        <Suspense fallback={null}>
          <Sequence onToggleLamp={onToggleLamp} />
          {/* The environment HDR is the room's ambient fill — kill it entirely
              when the lamp is off so the room actually goes dark. */}
          {lampOn ? <Environment preset="apartment" environmentIntensity={0.7} /> : null}
        </Suspense>
        <EffectComposer>
          <Bloom intensity={0.1} luminanceThreshold={0.92} luminanceSmoothing={0.9} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
