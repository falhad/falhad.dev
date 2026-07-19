"use client"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Environment, Lightformer, useGLTF, useAnimations } from "@react-three/drei"
import { Suspense, useEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"
import { clone as cloneSkinned } from "three/examples/jsm/utils/SkeletonUtils.js"
import { profile } from "@/lib/portfolio-data"
import { useReducedMotion } from "@/lib/use-reduced-motion"
import { playPop, playClip, playClipOn, playMinion, startDrone, stopDrone, isSoundOn, setSoundOn, onSoundChange, unlockSound, MINION_SOUNDS, MUG_SOUND, RUBIK_SOUND, SPEAKER_SOUND } from "@/lib/sound"

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
const SPEAKER = "/models/bose_speaker.glb" // Bose SoundLink Mini II — the sound on/off switch
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


// The laptop screen: a macOS-style lock screen — wallpaper, clock, avatar, name
// and a "Log In" button. Clicking the screen (see the mesh handler) logs in.
const SF = '"SF Pro Display", -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif'
function useNameTexture() {
  return useMemo(() => {
    const W = 1600
    const H = 1000
    const c = document.createElement("canvas")
    c.width = W
    c.height = H
    const x = c.getContext("2d")!
    const tex = new THREE.CanvasTexture(c)
    tex.anisotropy = 8
    tex.colorSpace = THREE.SRGBColorSpace

    const rr = (px: number, py: number, w: number, h: number, r: number) => {
      x.beginPath()
      x.roundRect(px, py, w, h, r)
    }

    const draw = (avatar?: HTMLImageElement) => {
      // Black wallpaper to match the screen, with a faint glow for depth.
      x.fillStyle = "#000000"
      x.fillRect(0, 0, W, H)
      const glow = x.createRadialGradient(W / 2, 300, 40, W / 2, 300, 640)
      glow.addColorStop(0, "rgba(90,110,170,0.14)")
      glow.addColorStop(1, "rgba(90,110,170,0)")
      x.fillStyle = glow
      x.fillRect(0, 0, W, H)

      x.textAlign = "center"
      x.textBaseline = "middle"

      // Live clock + date (top).
      const now = new Date()
      const time = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      const date = now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })
      x.fillStyle = "rgba(255,255,255,0.95)"
      x.font = `250 168px ${SF}`
      x.fillText(time, W / 2, 210)
      x.fillStyle = "rgba(255,255,255,0.7)"
      x.font = `500 40px ${SF}`
      x.fillText(date, W / 2, 320)

      // Avatar (circular). Falls back to a monogram until the photo loads.
      const cx = W / 2
      const cy = 560
      const r = 108
      x.save()
      x.beginPath()
      x.arc(cx, cy, r, 0, Math.PI * 2)
      x.closePath()
      x.clip()
      if (avatar) {
        x.drawImage(avatar, cx - r, cy - r, r * 2, r * 2)
      } else {
        x.fillStyle = "#3a465f"
        x.fillRect(cx - r, cy - r, r * 2, r * 2)
        x.fillStyle = "#dfe6f2"
        x.font = `600 96px ${SF}`
        x.fillText("FN", cx, cy + 6)
      }
      x.restore()
      x.lineWidth = 3
      x.strokeStyle = "rgba(255,255,255,0.25)"
      x.beginPath()
      x.arc(cx, cy, r, 0, Math.PI * 2)
      x.stroke()

      // Name + title.
      x.fillStyle = "#ffffff"
      x.font = `600 62px ${SF}`
      x.fillText(profile.name, W / 2, 730)
      x.fillStyle = "rgba(255,255,255,0.6)"
      x.font = `400 36px ${SF}`
      x.fillText(profile.title, W / 2, 788)

      // Log In button (pill) — compact.
      const bw = 210
      const bh = 62
      const bx = W / 2 - bw / 2
      const by = 858
      x.save()
      x.shadowColor = "rgba(0,0,0,0.4)"
      x.shadowBlur = 20
      x.shadowOffsetY = 6
      x.fillStyle = "rgba(255,255,255,0.95)"
      rr(bx, by, bw, bh, bh / 2)
      x.fill()
      x.restore()
      x.fillStyle = "#0a0a0a"
      x.font = `600 30px ${SF}`
      x.fillText("Log In  →", W / 2, by + bh / 2 + 2)

      // Hint.
      x.fillStyle = "rgba(255,255,255,0.4)"
      x.font = `500 28px ${SF}`
      x.fillText("click anywhere to continue", W / 2, 972)

      tex.needsUpdate = true
    }

    // Keep the loaded portrait across redraws (the live clock redraws each second).
    let avatarImg: HTMLImageElement | undefined
    draw()
    // Same-origin image only — a cross-origin avatar would taint the canvas.
    const img = new Image()
    img.onload = () => {
      avatarImg = img
      draw(avatarImg)
    }
    img.src = "/images/portrait.jpg"
    setInterval(() => draw(avatarImg), 1000) // live clock
    return tex
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

// A small sticky note: centered handwritten lines on a colored square.
// Uses a readable handwriting font (Chalkboard SE / Comic Sans / Marker Felt)
// and auto-fits so the longest line (e.g. the email) stays on the note.
function makeStickyNote(lines: string[], bg: string, maxFs = 104) {
  const S = 512
  const c = document.createElement("canvas")
  c.width = S
  c.height = S
  const x = c.getContext("2d")!
  x.fillStyle = bg
  x.fillRect(0, 0, S, S)
  const g = x.createLinearGradient(0, 0, S, S)
  g.addColorStop(0, "rgba(255,255,255,0.30)")
  g.addColorStop(1, "rgba(0,0,0,0.09)")
  x.fillStyle = g
  x.fillRect(0, 0, S, S)

  x.fillStyle = "#2b2410"
  x.textAlign = "center"
  x.textBaseline = "middle"
  const font = (px: number) => `600 ${px}px "Chalkboard SE", "Comic Sans MS", "Marker Felt", cursive`
  // Auto-fit: shrink so the widest line fits, and all lines fit vertically.
  let fs = Math.min(lines.length > 2 ? 82 : 104, maxFs)
  const maxW = S * 0.86
  x.font = font(fs)
  const widest = Math.max(...lines.map((l) => x.measureText(l).width))
  if (widest > maxW) fs = Math.floor((fs * maxW) / widest)
  fs = Math.min(fs, Math.floor((S * 0.82) / (lines.length * 1.2)))
  x.font = font(fs)

  const lh = fs * 1.2
  const startY = S / 2 - ((lines.length - 1) * lh) / 2
  lines.forEach((l, i) => x.fillText(l, S / 2, startY + i * lh))

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

// Sticky notes clustered on the left of the desk's front apron (facing the
// visitor). Understated dev-personality lines + a contact card.
const FRONT_STICKIES: { lines: string[]; bg: string; x: number; rot: number; fs?: number }[] = [
  { lines: ["deploy on", "Friday"], bg: "#fff27a", x: -3.35, rot: 0.06, fs: 72 },
  { lines: ["ship >", "perfect"], bg: "#ffb3c7", x: -2.68, rot: -0.06, fs: 72 },
  { lines: ["email:", "cs.arcxx@gmail.com", "whatsapp:", "+968 90130747"], bg: "#a7d8ff", x: -2.02, rot: 0.05 },
]

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

// Camera framing is tuned for a landscape desktop. On narrow/portrait screens
// the desk gets cropped, so we widen the FOV and dolly back to fit it in.
const DEG = Math.PI / 180
const BASE_FOV = 42
const BASE_HALF_TAN = Math.tan((BASE_FOV / 2) * DEG)
const REF_ASPECT = 1.5 // design aspect the keyframes were composed for

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
const MINIONS_POS: [number, number, number] = [-2.5, 0, -1.75]
const MINIONS_ROT: [number, number, number] = [0, 0, 0]
const MINIONS_SCALE = 0.48
const RUBIK_POS: [number, number, number] = [1.15, 0, 2.0]
const RUBIK_ROT: [number, number, number] = [0, 0.4, 0]
const DRONE_SCALE = 0.6
// Flight route (closed loop): home → over the minions → over the plant → sweep
// back → home. Home (index 0) is low on the desk so it lands there.
// Out-and-back inspection path: from home it pushes to the BACK of the desk,
// arcs a half-circle behind everything (well behind the raised lid), then
// returns along the same path. Open spline, traversed ping-pong.
const DRONE_ROUTE: [number, number, number][] = [
  [2.15, 0.12, -1.6], // home (parked on desk)
  [2.0, 2.0, -2.2], // push back and up
  [-0.5, 2.25, -2.55], // cross the back, high behind the lid
  [-2.5, 1.45, -1.75], // descend over the minions
  [-3.35, 1.35, -0.9], // over the plant
  [-2.95, 1.15, 1.75], // over the notebook, close to the user
]
const LAMP_POS: [number, number, number] = [3.1, 0, -0.7]
const LAMP_ROT: [number, number, number] = [0, -0.5, 0]
const SCREEN_POS: [number, number, number] = [0, 1.13, -0.04]
const SCREEN_ROT: [number, number, number] = [-0.16, 0, 0]
const SCREEN_SIZE: [number, number] = [2.62, 1.66]
// "click me" lid sticky — pose on the CLOSED lid (laptop-group space). It's
// re-parented to swing with the lid as it opens (see the hinge effect).
const LID_STICKY_POS: [number, number, number] = [0.5, 0.37, 1]
const LID_STICKY_ROT: [number, number, number] = [-1.7, 0, -0.5]
const LID_STICKY_SIZE = 0.6
// Static note on the palm rest (no show/hide logic) — tune these by hand.
const PALM_STICKY_POS: [number, number, number] = [-1, 0.17, 1]
const PALM_STICKY_ROT: [number, number, number] = [-Math.PI / 2, 0, 0.12]
const PALM_STICKY_SIZE = 0.5
// The Bose speaker sits between the notebook (z 1.35) and the plant (z -0.9).
const SPEAKER_POS: [number, number, number] = [-3.05, 0, -0.1]
const SPEAKER_ROT: [number, number, number] = [0, 0.7, 0]
const SPEAKER_SIZE = 1.15

// ---- Desk object personalities ----
const MUG_LINES = [
  "☕ Ah, fuel. This is what 14 years of shipping runs on.",
  "Sip. Okay, now the code will compile.",
  "Careful, it's hot — like my take on tabs vs spaces.",
  "One more cup and I'll refactor the whole universe.",
  "Espresso: because 'sleep' is a deprecated API.",
  "Blood type: cold brew, negative.",
  "This mug has seen every production incident since 2012.",
  "Decaf? In this economy? Absolutely not.",
  "Coffee: turning 'it works on my machine' into 'it works'.",
  "I don't have a caffeine problem. I have a caffeine solution.",
  "Ctrl+Z won't undo this third espresso, but I regret nothing.",
  "Warning: contents may cause spontaneous git commits.",
  "The mug is half full. The optimist in me says: refill it.",
  "Powered by beans and questionable life choices.",
  "If found empty, please return to the nearest barista, urgently.",
]
const MUG_EMPTY = "Empty. ☹️ Someone alert the barista."
const PLANT_LINES = [
  "🌵 Meet Steve. Watered twice in 2 years. Still thriving.",
  "Steve doesn't judge your code. Steve just vibes.",
  "Photosynthesis and clean commits — Steve does both.",
  "Steve has survived more deploys than most startups.",
  "Petting a cactus? Bold move. Respect.",
  "Steve is low-maintenance. Unlike my legacy codebase.",
  "Steve's only dependency is sunlight. Zero npm audit warnings.",
  "He's not prickly, he just has strong opinions on frameworks.",
  "Steve went full-remote before it was cool.",
  "Steve scales horizontally. Just add more pots.",
  "Watering scheduled for Q3. Maybe Q4. We'll see.",
  "Steve has 100% uptime and never files a PTO request.",
  "Every desk needs a witness. Steve witnesses everything.",
  "Steve: proof that neglect and success can coexist.",
  "He photosynthesizes. I caffeinate. We both survive.",
]
const MAC_LINES = [
  "*knock knock* …I open when you scroll ↓",
  "Locked for now — scroll down and watch me open ↓",
  "Patience. I unfold as you scroll ↓",
  "16GB of RAM and 47 Chrome tabs. It's a fair fight.",
  "I run on electricity and Farhad's deadlines.",
  "Scroll down — I promise the reveal is worth it ↓",
  "My fans have seen things. Terrible, glorious things.",
  "Battery at 3%. Living dangerously, as always.",
  "I've compiled dreams and a few nightmares. Scroll ↓",
  "Closed lid, open mind. Give me a scroll ↓",
  "Yes, I have stickers. No, you can't see them yet.",
  "One does not simply click me open. One scrolls ↓",
  "Warning: opening me may reveal 14 years of shipped code.",
  "I'm not sleeping, I'm in low-power genius mode.",
]
const MINION_LINES = [
  "🍌 BANANAAA! …sorry, force of habit.",
  "We are three. We are chaos. We are QA.",
  "Bello! Tulaliloo ti amo! (that means 'ship it').",
  "We fixed one bug and made three more. Teamwork!",
  "Poopaye! …wait, you're still scrolling?",
  "We reviewed your PR. LGTM! (We didn't read it.)",
  "Standup update: banana acquired. Blocker: no second banana.",
  "We deployed on a Friday. We regret nothing. Banana!",
  "Three minions, one keyboard, infinite typos.",
  "We are the merge conflicts you didn't ask for.",
  "Tank yu! Now push to prod, what could go wrong?",
  "We automated everything except our own snack breaks.",
  "Papoy! Our test coverage is 3 bananas out of 5.",
  "We don't do bugs. We do 'undocumented features'.",
  "Kanpai! We celebrate every commit. Even the bad ones.",
]
const NOTEBOOK_LINES = [
  "📓 Ideas graveyard. RIP 47 side projects.",
  "Page 1: 'This year I journal daily.' Page 2: blank.",
  "Handwriting even I can't read — ancient dev runes.",
  "Holds one genius idea and a grocery list.",
  "The real backlog lives here, not in Jira.",
  "Contains a billion-dollar idea. And a doodle of a cat.",
  "My version control before git: this page, and hope.",
  "Sprint planning: one page. Sprint reality: same page, crossed out.",
  "Where architecture diagrams go to become spaghetti.",
  "Half TODO list, half therapy. Mostly the second one.",
  "Napkin math, but make it a whole notebook.",
  "The pen is mightier than the linter. Sometimes.",
  "Every 'quick note' here is a future migraine, documented.",
  "Analog rubber duck. It listens, it never judges.",
  "Password hints from 2014 live here. Don't tell security.",
]
const RUBIK_LINES = [
  "🧊 Solved it once. In 2009. Never again.",
  "6 sides, 43 quintillion combos, 0 patience.",
  "Peeling the stickers is also a valid algorithm.",
  "It's not stuck — it's 'in progress'.",
  "Time complexity of solving this: O(giving up).",
  "I optimized the solve: I bought a solved one.",
  "Brute force is a strategy. A bad one, but a strategy.",
  "One face done. The other five are a 'known issue'.",
  "This is the hardest bug I've never fixed.",
  "Rotate, rotate, panic, rotate. The classic loop.",
  "I'll solve it right after I clear my inbox. So, never.",
  "43 quintillion states and I found the ugliest one.",
  "YouTube tutorial: 4 min. My attempt: 4 years.",
  "It's not a toy, it's a monument to my hubris.",
  "Recursion joke: to solve it, first solve it.",
]
const PHONE_QUIPS = [
  "📱 Mom: 'Are you eating enough?' …seen 3h ago.",
  "17 unread Slack threads. Bold of them to assume.",
  "Screen time up 40% this week. It's 'research'.",
  "Do Not Disturb: on since 2019.",
  "One missed call from Reality. Declined.",
  "Battery 12%, motivation 4%. Relatable.",
  "Recruiter: 'quick call?' — the call is never quick.",
  "2FA code arrived 30 seconds after it expired. Classic.",
  "Weather app: sunny. Window: rain. Trust nothing.",
  "Notification: 'You've reached your screen time limit.' Dismissed.",
  "Calendar says 'focus time'. Phone says otherwise.",
  "Storage full. 9,000 screenshots I'll never open again.",
  "Someone @'d me in a thread. Reading it in 2027.",
  "Alarm set for 6am. We both know that's fiction.",
  "PagerDuty at 3am. The phone giveth, the phone taketh sleep.",
]
const pickLine = (a: string[]) => a[Math.floor(Math.random() * a.length)]
// Minion voice clips (all CC0 / royalty-free — see public/sounds/README.md).
// One is picked at random on each minion tap.
const bubble = (text: string) => window.dispatchEvent(new CustomEvent("desk-bubble", { detail: { text } }))
const quip = (text: string) => {
  playPop() // tiny blip on every desk-object tap
  bubble(text)
}

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

// Subtle pointer-tilt on hover + a small pop and quip on click.
function HoverMove({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  onClick,
  children,
}: {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  onClick?: () => void
  children: React.ReactNode
}) {
  const ref = useRef<THREE.Group>(null)
  const hovered = useRef(false)
  const punch = useRef(0)
  const { pointer } = useThree()
  const baseRx = rotation[0] ?? 0
  const baseRy = rotation[1] ?? 0
  useFrame((_s, dtRaw) => {
    const g = ref.current
    if (!g) return
    const dt = Math.min(dtRaw, 0.05)
    // Subtle parallax tilt toward the pointer while hovered (like the laptop).
    const k = hovered.current ? 1 : 0
    const ty = baseRy + pointer.x * 0.16 * k
    const tx = baseRx + -pointer.y * 0.1 * k
    g.rotation.y += (ty - g.rotation.y) * (1 - Math.pow(0.004, dt))
    g.rotation.x += (tx - g.rotation.x) * (1 - Math.pow(0.004, dt))
    punch.current += (0 - punch.current) * (1 - Math.pow(0.02, dt))
    g.scale.setScalar(scale * (1 + 0.08 * punch.current))
  })
  return (
    <group
      ref={ref}
      position={position}
      rotation={rotation}
      scale={scale}
      onPointerOver={(e) => {
        e.stopPropagation()
        hovered.current = true
        document.body.style.cursor = "pointer"
      }}
      onPointerOut={() => {
        hovered.current = false
        document.body.style.cursor = ""
      }}
      onClick={(e) => {
        e.stopPropagation()
        punch.current = 1
        onClick?.()
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
    () => new THREE.CatmullRomCurve3(DRONE_ROUTE.map((w) => new THREE.Vector3(...w)), false, "catmullrom", 0.5),
    [],
  )
  const p = useRef(0)
  const dir = useRef(1)
  const flying = useRef(false)
  const wantLand = useRef(false)
  const pos = useMemo(() => new THREE.Vector3(), [])

  const takeOff = () => {
    document.body.style.cursor = "pointer"
    wantLand.current = false
    if (!flying.current) {
      flying.current = true
      dir.current = 1
      actions["hover"]?.reset().fadeIn(0.3).play()
      startDrone() // motor whir while airborne
    }
  }
  // Don't cut the trip short — request landing; it finishes the full out-and-back
  // (to the notebook and home) before touching down.
  const requestLand = () => {
    document.body.style.cursor = ""
    wantLand.current = true
  }

  useFrame((_s, dtRaw) => {
    const g = group.current
    if (!g) return
    const dt = Math.min(dtRaw, 0.05)
    const speed = 1 / 6 // one-way ≈ 6s
    if (flying.current) {
      p.current += dir.current * speed * dt
      if (p.current >= 1) {
        p.current = 1
        dir.current = -1 // reached the notebook — head back
      } else if (p.current <= 0) {
        p.current = 0
        if (wantLand.current) {
          flying.current = false // completed the lap; land
          actions["hover"]?.fadeOut(0.8)
          stopDrone() // fade out the motor whir
        } else {
          dir.current = 1 // another lap while still hovered
        }
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
      onPointerOut={requestLand}
      onClick={(e) => {
        // Tap-to-fly for touch devices (no hover): take off, then land after
        // completing one full out-and-back lap.
        e.stopPropagation()
        takeOff()
        wantLand.current = true
      }}
    >
      <primitive object={model} />
    </group>
  )
}

function Sequence({ lampOn, onToggleLamp }: { lampOn: boolean; onToggleLamp: () => void }) {
  const laptop = useRef<THREE.Group>(null)
  const nameMat = useRef<THREE.MeshBasicMaterial>(null)
  const macStickyMat = useRef<THREE.MeshStandardMaterial>(null)
  const lidStickyGroup = useRef<THREE.Group>(null)
  const hingeV = useRef(new THREE.Vector3())
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
      // Unlit glTF carries no normals (nothing needs them), so the converted
      // lit material shaded to pure black. Rebuild them or the minions render
      // as flat silhouettes.
      if (!m.geometry.attributes.normal) m.geometry.computeVertexNormals()
      m.material = Array.isArray(m.material) ? m.material.map(toLit) : toLit(m.material)
    })
    return obj
  }, [minionsGltf])
  const rubik = useAnchored(RUBIK, 0.38, "bottom")
  const speaker = useAnchored(SPEAKER, SPEAKER_SIZE, "bottom", "max")
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
  // Front-facing sticky notes + the desk bounds used to place them on its face.
  const frontStickyTex = useMemo(() => FRONT_STICKIES.map((s) => makeStickyNote(s.lines, s.bg, s.fs)), [])
  // A "click me" note on the closed lid — nudges the visitor to open the Mac.
  const macStickyTex = useMemo(() => makeStickyNote(["do NOT touch!", "prod runs here…", "yes, a laptop"], "#ff6b6b", 60), [])
  // Static palm-rest note — a cheeky follow-up once the lid's open.
  const palmStickyTex = useMemo(() => makeStickyNote(["couldn't stop you?", "fine — at least", "don't go further"], "#c9f2a7", 60), [])
  const deskBox = useMemo(() => new THREE.Box3().setFromObject(desk), [desk])

  const steamTex = useSteamTexture()

  // Desk object state (kept in refs so clicks don't re-render the scene).
  const steamSprites = useRef<THREE.Sprite[]>([])
  const lampGlowMat = useRef<THREE.MeshBasicMaterial>(null)
  const lampGlow = useRef(0)
  const sips = useRef(8)

  // Sound on/off, mirrored into React state so the speaker's LED dot recolors.
  const [soundOn, setSoundOnState] = useState(false)
  useEffect(() => {
    setSoundOnState(isSoundOn())
    return onSoundChange(setSoundOnState)
  }, [])
  const onSpeaker = () => {
    unlockSound()
    const next = !isSoundOn()
    setSoundOn(next)
    // Turning on plays the Bose pairing chime, so the speaker confirms itself.
    // Turning off stays silent — sound is already muted by then anyway.
    if (next) {
      playClip(SPEAKER_SOUND).then((ok) => {
        if (!ok) playPop()
      })
    }
  }

  const onMug = () => {
    sips.current -= 1
    const empty = sips.current <= 0
    if (sips.current < 0) sips.current = 0
    // An empty mug gets the plain blip — sipping air would be odd.
    if (empty) {
      quip(MUG_EMPTY)
      return
    }
    bubble(pickLine(MUG_LINES))
    // One sip at a time — a second tap while sipping queues the next, no overlap.
    playClipOn("mug", MUG_SOUND, 0.9, playPop)
  }
  const onPlant = () => quip(pickLine(PLANT_LINES))
  const onMinions = () => {
    // Minion tap: show a quip + play a RANDOM minion clip from /sounds. Falls
    // back to a synthesized placeholder if a file is missing.
    bubble(pickLine(MINION_LINES))
    const url = MINION_SOUNDS[Math.floor(Math.random() * MINION_SOUNDS.length)]
    // No overlap: a tap mid-clip queues the next random voice instead of stacking.
    playClipOn("minions", url, 0.9, playMinion)
  }
  const onNotebook = () => quip(pickLine(NOTEBOOK_LINES))
  const onRubik = () => {
    bubble(pickLine(RUBIK_LINES))
    playClipOn("rubik", RUBIK_SOUND, 0.9, playPop)
  }
  const onPhone = () => {
    phoneScreen.tap()
    quip(pickLine(PHONE_QUIPS))
  }
  const onMac = () => {
    quip(pickLine(MAC_LINES))
    const l = (window as unknown as { __lenis?: { scrollTo: (t: number, o?: object) => void } }).__lenis
    const to = window.scrollY + window.innerHeight * 0.6
    if (l) l.scrollTo(to, { duration: 1.2 })
    else window.scrollTo({ top: to, behavior: "smooth" })
  }

  // Clicking the lock screen's "Log In" → advance to the desktop: scroll to the
  // bottom of the hero, which triggers the dive-in + login flourish + desktop.
  const login = () => {
    const hero = document.getElementById("hero")
    const to = hero ? hero.offsetTop + hero.offsetHeight - window.innerHeight : window.scrollY + window.innerHeight * 2
    const l = (window as unknown as { __lenis?: { scrollTo: (t: number, o?: object) => void } }).__lenis
    if (l) l.scrollTo(to, { duration: 1.6 })
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

    // --- Aspect-adaptive framing (fixes the desk being cropped on mobile) ---
    // Restore the horizontal coverage lost on narrow screens by splitting the
    // correction between a (capped) FOV widen and a dolly-back. Both fade out as
    // the camera dives into the screen (pushT→1), leaving that ending untouched.
    const aspect = state.size.width / Math.max(1, state.size.height)
    const narrow = clamp(REF_ASPECT / aspect, 1, 3.2) // 1 on landscape, grows on portrait
    const fovScale = clamp(Math.sqrt(narrow), 1, 1.55) // widen FOV up to ~55%
    const dolly = narrow / fovScale // the rest as extra camera distance
    const ease = 1 - pushT
    const fovScaleEff = 1 + (fovScale - 1) * ease
    const dollyEff = 1 + (dolly - 1) * ease
    const cam = state.camera as THREE.PerspectiveCamera
    const targetFov = (2 * Math.atan(BASE_HALF_TAN * fovScaleEff)) / DEG
    if (Math.abs(cam.fov - targetFov) > 0.01) {
      cam.fov = targetFov
      cam.updateProjectionMatrix()
    }
    // Push the camera back along its view ray (scale distance from the look point).
    const lx = camLook.current.x
    const ly = camLook.current.y
    const lz = camLook.current.z
    const parallax = camT * (1 - pushT)
    state.camera.position.set(
      lx + (camPos.current.x - lx) * dollyEff + px.current * 0.5 * parallax,
      ly + (camPos.current.y - ly) * dollyEff + py.current * 0.3 * parallax,
      lz + (camPos.current.z - lz) * dollyEff,
    )
    state.camera.lookAt(camLook.current)

    if (pivot) pivot.rotation.x = lerp(LID_CLOSED, 0, smooth(invlerp(p, 0.15, 0.6)))
    if (laptop.current) laptop.current.rotation.y = px.current * 0.05 * (1 - pushT)

    // "click me" lid sticky — swing it with the lid so it feels stuck on.
    // Recompute the hinge EVERY frame from settled matrices. (A one-time capture
    // was unreliable: on a fresh load the first frame runs before the laptop's
    // world matrix settles, locking in a wrong hinge → note in the wrong spot.)
    if (pivot && laptop.current && lidStickyGroup.current) {
      const h = laptop.current.worldToLocal(pivot.getWorldPosition(hingeV.current))
      lidStickyGroup.current.position.copy(h)
      const mesh = lidStickyGroup.current.children[0]
      if (mesh) mesh.position.set(LID_STICKY_POS[0] - h.x, LID_STICKY_POS[1] - h.y, LID_STICKY_POS[2] - h.z)
      // Match the lid's rotation delta (0 when closed → swings as it opens).
      lidStickyGroup.current.rotation.x = pivot.rotation.x - LID_CLOSED
    }
    // Gentle fade as the lid turns away (backface culling also hides it).
    if (macStickyMat.current) macStickyMat.current.opacity = 1 - smooth(invlerp(p, 0.32, 0.5))

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
        ; (s.material as THREE.SpriteMaterial).opacity = Math.sin(ph * Math.PI) * 0.05
    })

    // Desk-level "click me" glow under the lamp while it's off.
    lampGlow.current += ((lampOn ? 0 : 1) - lampGlow.current) * (1 - Math.pow(0.01, dt))
    if (lampGlowMat.current) {
      const pulse = 0.6 + 0.4 * Math.sin(et * 2.2)
      lampGlowMat.current.opacity = lampGlow.current * pulse * 0.05
    }
  })

  return (
    <group>
      <primitive object={desk} position={[0, 0, 0]} />
      {/* Sticky notes stuck to the desk's front face, facing the visitor. */}
      {FRONT_STICKIES.map((s, i) => (
        <mesh key={i} position={[s.x, deskBox.max.y - 0.55, deskBox.max.z + 0.02]} rotation={[0, 0, s.rot]}>
          <planeGeometry args={[0.62, 0.62]} />
          <meshStandardMaterial map={frontStickyTex[i]} roughness={0.95} metalness={0} side={THREE.DoubleSide} />
        </mesh>
      ))}
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
        {/* Lock screen. Clicking it (the "Log In" button) advances to the desktop. */}
        <mesh
          position={SCREEN_POS}
          rotation={SCREEN_ROT}
          onClick={(e) => {
            e.stopPropagation()
            login()
          }}
          onPointerOver={(e) => {
            e.stopPropagation()
            document.body.style.cursor = "pointer"
          }}
          onPointerOut={() => (document.body.style.cursor = "")}
        >
          <planeGeometry args={SCREEN_SIZE} />
          <meshBasicMaterial ref={nameMat} map={nameTex} transparent opacity={0} toneMapped={false} />
        </mesh>
        {/* "click me" sticky — inside a group pinned to the lid hinge so it
            swings open with the lid (rotation driven in useFrame). The mesh's
            own pose is its resting pose on the CLOSED lid. */}
        <group ref={lidStickyGroup}>
          <mesh position={LID_STICKY_POS} rotation={LID_STICKY_ROT}>
            <planeGeometry args={[LID_STICKY_SIZE, LID_STICKY_SIZE]} />
            <meshStandardMaterial ref={macStickyMat} map={macStickyTex} roughness={0.95} metalness={0} transparent />
          </mesh>
        </group>
        {/* Static note on the palm rest — no show/hide logic; tune by hand. */}
        <mesh position={PALM_STICKY_POS} rotation={PALM_STICKY_ROT}>
          <planeGeometry args={[PALM_STICKY_SIZE, PALM_STICKY_SIZE]} />
          <meshStandardMaterial map={palmStickyTex} roughness={0.95} metalness={0} />
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

      <HoverMove position={NOTEBOOK_POS} rotation={NOTEBOOK_ROT} onClick={onNotebook}>
        <primitive object={notebook} />
        {/* Small sticky note resting on top of the notebook cover. Uses a lit
            material so it goes dark with the room instead of glowing. */}
        <mesh position={STICKY_POS} rotation={STICKY_ROT}>
          <planeGeometry args={[STICKY_SIZE, STICKY_SIZE]} />
          <meshStandardMaterial map={stickyTex} roughness={0.95} metalness={0} />
        </mesh>
      </HoverMove>
      <Interactive position={FLOWER_POS} onClick={onPlant}>
        <primitive object={flower} />
      </Interactive>
      {/* Bose speaker — the sound switch. Click to toggle; the LED dot on top
          glows green when sound is on, red when off. */}
      <HoverMove position={SPEAKER_POS} rotation={SPEAKER_ROT} onClick={onSpeaker}>
        <primitive object={speaker} />
        <mesh position={[-0.23, 0.32, 0.08]}>
          <sphereGeometry args={[0.02, 20, 20]} />
          <meshBasicMaterial color={soundOn ? "#22e06a" : "#ff3b30"} toneMapped={false} />
        </mesh>
      </HoverMove>
      <HoverMove position={MINIONS_POS} rotation={MINIONS_ROT} scale={MINIONS_SCALE} onClick={onMinions}>
        <primitive object={minions} />
      </HoverMove>
      <HoverMove position={RUBIK_POS} rotation={RUBIK_ROT} onClick={onRubik}>
        <primitive object={rubik} />
      </HoverMove>
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
        {/* Large invisible tap target around the lamp — the lamp geometry itself
            is thin and nearly impossible to hit with a fingertip on mobile.
            Kept visible (opacity 0) so the raycaster still hits it; depthWrite
            off + colorWrite off so it never affects the rendered image. */}
        <mesh position={[LAMP_POS[0], 1.7, LAMP_POS[2]]}>
          <boxGeometry args={[1.8, 3.8, 1.7]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
        </mesh>
        {/* Desk-level glow hint on the lamp base while the light is off. */}
        <mesh position={[LAMP_POS[0] + 0.3, 0.15, LAMP_POS[2] - 0.6]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.5, 48]} />
          <meshBasicMaterial
            ref={lampGlowMat}
            map={steamTex}
            color="#ffce8a"
            transparent
            opacity={0}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
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
  const nightAmb = useRef<THREE.AmbientLight>(null)
  const nightKey = useRef<THREE.DirectionalLight>(null)
  const nightRim = useRef<THREE.DirectionalLight>(null)
  const lvl = useRef(lampOn ? 1 : 0)
  const LAMP_RAMP = 1.0 // seconds for the light to fully turn on/off
  useFrame((state, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05)
    // Linear-time ramp over ~LAMP_RAMP seconds, eased with smoothstep.
    const target = lampOn ? 1 : 0
    const step = dt / LAMP_RAMP
    lvl.current = clamp(lvl.current + clamp(target - lvl.current, -step, step), 0, 1)
    const l = smooth(lvl.current)
    const dark = 1 - l
    // Lamp-on: warm room-wide light.
    if (amb.current) amb.current.intensity = 0.85 * l
    if (hemi.current) hemi.current.intensity = 1.0 * l
    if (fill.current) fill.current.intensity = 0.72 * l
    if (spot.current) spot.current.intensity = 58 * l
    // Lamp-off: a cool "moonlit room" rig that is dim but always legible. Every
    // model stays readable from any camera distance — the lamp adds warmth and
    // contrast rather than being the difference between visible and invisible.
    if (nightAmb.current) nightAmb.current.intensity = 0.2 * dark
    if (nightKey.current) nightKey.current.intensity = 0.42 * dark
    if (nightRim.current) nightRim.current.intensity = 0.18 * dark
    if (moon.current) moon.current.intensity = 5 * dark
    // Environment fill. The dark floor is deliberately non-zero so materials
    // still catch a highlight with the lamp off.
    state.scene.environmentIntensity = 0.15 + 0.65 * l
  })
  return (
    <>
      {/* Warmer ambient/fill so lamp-on feels cozy, not clinical. */}
      <ambientLight ref={amb} intensity={0} color="#d19a5c" />
      <hemisphereLight ref={hemi} intensity={0} color="#ffe7bd" groundColor="#2a1f14" />
      <directionalLight ref={fill} position={[-4, 6, 4]} intensity={0} color="#ffdca0" />
      {/* --- Lamp-off rig: dim, cool, but never black. --- */}
      <ambientLight ref={nightAmb} intensity={0} color="#93a9c4" />
      {/* Key from the viewer's side so the front faces of every desk object read. */}
      <directionalLight ref={nightKey} position={[2.5, 5, 7]} intensity={0} color="#aabfd8" />
      {/* Opposing rim so silhouettes separate from the background. */}
      <directionalLight ref={nightRim} position={[-5, 4, -4]} intensity={0} color="#6f86a8" />
      {/* Faint cool "moonlight" cone aimed at the laptop — keeps the dramatic
          pool of light on the center. Fades out as the lamp turns on. */}
      <spotLight
        ref={moon}
        position={[1.4, 5, 1.6]}
        angle={0.9}
        penumbra={1}
        intensity={0}
        distance={22}
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
useGLTF.preload(SPEAKER)

export default function Scene({ lampOn = true, onToggleLamp = () => { } }: { lampOn?: boolean; onToggleLamp?: () => void }) {
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
      <Canvas shadows camera={{ position: [0, 8.0, 2.6], fov: 42 }} dpr={[1, 1.9]} gl={{ antialias: true, alpha: true, toneMappingExposure: 0.92 }}>
        {/* Lamp-driven room lighting (dark until the switch is clicked). */}
        <Lights lampOn={lampOn} />
        {/* Room reflections/ambient fill. Built procedurally from lightformers
            instead of drei's `preset`, which downloads a multi-MB .hdr from a
            third-party CDN — slow or blocked on mobile/other networks, which
            left the scene unlit everywhere except a browser that had it cached.
            This renders locally, so every device gets identical lighting. */}
        <Environment resolution={128} frames={1}>
          {/* soft overhead ceiling panel */}
          <Lightformer intensity={1.6} form="rect" position={[0, 6, 1]} rotation={[-Math.PI / 2, 0, 0]} scale={[14, 10, 1]} color="#fff2df" />
          {/* window-ish key from the viewer's left */}
          <Lightformer intensity={1.1} form="rect" position={[-7, 3, 5]} rotation={[0, -Math.PI / 3, 0]} scale={[9, 7, 1]} color="#cfe0f5" />
          {/* warm bounce from the lamp side */}
          <Lightformer intensity={0.9} form="rect" position={[7, 2.5, 2]} rotation={[0, Math.PI / 2.4, 0]} scale={[8, 6, 1]} color="#ffd9a6" />
          {/* rear rim so silhouettes separate */}
          <Lightformer intensity={0.7} form="rect" position={[0, 3, -8]} rotation={[0, Math.PI, 0]} scale={[12, 6, 1]} color="#9fb2cc" />
          {/* dim floor bounce */}
          <Lightformer intensity={0.35} form="rect" position={[0, -4, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[12, 12, 1]} color="#4a3f36" />
        </Environment>
        <Suspense fallback={null}>
          <Sequence lampOn={lampOn} onToggleLamp={onToggleLamp} />
        </Suspense>
        {/* NOTE: deliberately no <EffectComposer>/<Bloom> here.
            postprocessing's composer allocates a HalfFloat render target and
            drives its own tone-mapping pass. On GPUs without float-blend /
            EXT_color_buffer_half_float support — most Android devices, iOS, and
            Mesa on Linux — that target resolves to black, so the entire scene
            rendered as flat black silhouettes while Apple GPUs (the only place
            it was ever tested) looked fine. The bloom was intensity 0.1 and
            barely perceptible; correctness on every device is worth far more. */}
      </Canvas>
    </div>
  )
}
