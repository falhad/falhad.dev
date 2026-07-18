"use client"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Environment, useGLTF } from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import { Suspense, useMemo, useRef } from "react"
import * as THREE from "three"
import { profile } from "@/lib/portfolio-data"
import { useReducedMotion } from "@/lib/use-reduced-motion"

const LAPTOP = "/models/macbook.glb" // user-supplied MacBook Pro
const MUG = "/models/mug_latte.glb" // user-supplied (converted spec-gloss -> metal-rough)
const DESK = "/models/computer_desk.glb" // user-supplied
const NOTEBOOK = "/models/notebook_and_pen.glb" // user-supplied
const FLOWER = "/models/small_flower._polycam_app.glb" // user-supplied
const LAMP = "/models/desk_lamp.glb" // user-supplied
const PHONE = "/models/phone.glb" // user-supplied (iPhone)
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

// The phone's lock screen — a canvas texture that cycles notifications on tap.
function usePhoneScreen() {
  return useMemo(() => {
    const W = 540
    const H = 1160
    const c = document.createElement("canvas")
    c.width = W
    c.height = H
    const x = c.getContext("2d")!
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 8
    const notifs = [
      { icon: "💬", app: "MESSAGES", title: "Recruiter", msg: "Are you available? 👀" },
      { icon: "⭐", app: "GITHUB", title: "New star", msg: "Someone starred your repo" },
      { icon: "✅", app: "ACTIONS", title: "Build passed", msg: "All green in 42s. Ship it." },
      { icon: "💤", app: "SLACK", title: "3 unread", msg: "…all can wait." },
    ]
    let i = 0
    const rr = (px: number, py: number, w: number, h: number, r: number) => {
      x.beginPath()
      x.roundRect(px, py, w, h, r)
    }
    const draw = () => {
      const g = x.createLinearGradient(0, 0, 0, H)
      g.addColorStop(0, "#20335c")
      g.addColorStop(1, "#0a0f1c")
      x.fillStyle = g
      x.fillRect(0, 0, W, H)
      // clock
      x.fillStyle = "#fff"
      x.textAlign = "center"
      x.font = "600 140px -apple-system, 'Helvetica Neue', Arial, sans-serif"
      x.fillText("9:41", W / 2, 190)
      x.fillStyle = "#dde5f3"
      x.font = "400 42px -apple-system, Arial, sans-serif"
      x.fillText("Saturday, July 18", W / 2, 255)
      // notification card
      const n = notifs[i % notifs.length]
      const cx = 44
      const cy = 360
      const cw = W - 88
      const ch = 220
      x.fillStyle = "rgba(255,255,255,0.94)"
      rr(cx, cy, cw, ch, 40)
      x.fill()
      // icon tile
      x.fillStyle = "#eef2f8"
      rr(cx + 30, cy + 40, 96, 96, 22)
      x.fill()
      x.font = "58px sans-serif"
      x.textAlign = "center"
      x.fillText(n.icon, cx + 30 + 48, cy + 40 + 66)
      // text
      x.textAlign = "left"
      x.fillStyle = "#111"
      x.font = "700 42px -apple-system, Arial, sans-serif"
      x.fillText(n.title, cx + 152, cy + 78)
      x.fillStyle = "#333"
      x.font = "400 38px -apple-system, Arial, sans-serif"
      const words = n.msg.split(" ")
      let line = ""
      let ly = cy + 132
      for (const w of words) {
        if (x.measureText(line + w).width > cw - 180) {
          x.fillText(line.trim(), cx + 152, ly)
          line = w + " "
          ly += 46
        } else line += w + " "
      }
      x.fillText(line.trim(), cx + 152, ly)
      x.fillStyle = "#8b93a3"
      x.textAlign = "right"
      x.font = "30px -apple-system, Arial, sans-serif"
      x.fillText("now", cx + cw - 30, cy + 60)
      // hint
      x.textAlign = "center"
      x.fillStyle = "rgba(255,255,255,0.5)"
      x.font = "34px -apple-system, Arial, sans-serif"
      x.fillText("tap for more", W / 2, H - 80)
      tex.needsUpdate = true
    }
    draw()
    return { texture: tex, next: () => { i = (i + 1) % notifs.length; draw() } }
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
const PHONE_POS: [number, number, number] = [2.35, 0.02, 2.5] // near (below) the coffee mug
const PHONE_TWIST = -0.35
const PHONE_ROT: [number, number, number] = [-Math.PI / 2, 0, PHONE_TWIST] // lay flat on the desk
const PHONE_SCREEN: [number, number] = [0.62, 1.35]
// Local offset (in the phone's own space) placing the screen just above its face.
const PHONE_SCREEN_OFFSET: [number, number, number] = [0, 0.75, 0.07]
const FLOWER_POS: [number, number, number] = [-2.85, 0, -0.9]
const LAMP_POS: [number, number, number] = [3.1, 0, -1.35]
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
const PLANT_GROW_LINE = "🌱 → 🌳 STEVE GREW! You unlocked premium horticulture."
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
  const lamp = useAnchored(LAMP, 3.0, "bottom", "max")
  const phone = useAnchored(PHONE, 1.5, "bottom", "max")
  const phoneScreen = usePhoneScreen()
  const nameTex = useNameTexture()
  const stickyTex = useStickyTexture()

  // Desk object state (kept in refs so clicks don't re-render the scene).
  const steamRefs = useRef<THREE.Mesh[]>([])
  const steamT = useRef(0)
  const sips = useRef(8)
  const plantClicks = useRef(0)
  const plantGrow = useRef(1)
  const plantGrowTarget = useRef(1)
  const flowerBase = useRef(0)

  const onMug = () => {
    steamT.current = 0.001
    sips.current -= 1
    quip(sips.current <= 0 ? MUG_EMPTY : pickLine(MUG_LINES))
    if (sips.current < 0) sips.current = 0
  }
  const onPlant = () => {
    plantClicks.current += 1
    if (plantClicks.current === 5) {
      plantGrowTarget.current = 1.6
      quip(PLANT_GROW_LINE)
    } else {
      quip(pickLine(PLANT_LINES))
    }
  }
  const onPhone = () => phoneScreen.next()
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

    // Steve the plant slowly grows to his new size after the 5th poke.
    if (!flowerBase.current) flowerBase.current = flower.scale.x
    plantGrow.current += (plantGrowTarget.current - plantGrow.current) * (1 - Math.pow(0.01, dt))
    flower.scale.setScalar(flowerBase.current * plantGrow.current)

    // Coffee steam puff — one rising, fading plume per sip.
    if (steamT.current > 0) {
      steamT.current += dt / 1.5
      if (steamT.current >= 1) steamT.current = 0
      const tt = steamT.current
      steamRefs.current.forEach((m, i) => {
        if (!m) return
        const ph = (tt + i * 0.33) % 1
        m.position.y = ph * 0.8
        m.position.x = Math.sin(ph * 6 + i) * 0.06
        m.scale.setScalar(0.6 + ph * 0.9)
        ;(m.material as THREE.MeshBasicMaterial).opacity = Math.sin(ph * Math.PI) * 0.5
      })
    } else {
      steamRefs.current.forEach((m) => {
        if (m) (m.material as THREE.MeshBasicMaterial).opacity = 0
      })
    }
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
      {/* Steam puffs above the mug (animated on sip). */}
      <group position={[MUG_POS[0], 0.55, MUG_POS[2]]}>
        {[0, 1, 2].map((i) => (
          <mesh
            key={i}
            ref={(el) => {
              if (el) steamRefs.current[i] = el
            }}
          >
            <sphereGeometry args={[0.07, 10, 10]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0} depthWrite={false} toneMapped={false} />
          </mesh>
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
      {/* Phone + its lock-screen overlay (child, so it tracks the phone exactly).
          Tap the screen to cycle notifications. */}
      <group position={PHONE_POS} rotation={PHONE_ROT}>
        <primitive object={phone} />
        <Interactive position={PHONE_SCREEN_OFFSET} onClick={onPhone}>
          <mesh>
            <planeGeometry args={PHONE_SCREEN} />
            <meshBasicMaterial map={phoneScreen.texture} toneMapped={false} side={THREE.DoubleSide} />
          </mesh>
        </Interactive>
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
