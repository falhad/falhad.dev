"use client"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Environment, useGLTF, useTexture } from "@react-three/drei"
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
const FRAME = "/models/photo_frame.glb" // user-supplied
const PORTRAIT = "/images/portrait.jpg"
const FRAME_PIC_MAT = "Material.002" // the picture material (holds the default photo)
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
          soft.roughness = Math.min(1, soft.roughness + 0.35)
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

// Photo frame with the portrait applied to its picture surface.
function usePhotoFrame(size: number) {
  const { scene } = useGLTF(FRAME)
  const photo = useTexture(PORTRAIT)
  return useMemo(() => {
    photo.colorSpace = THREE.SRGBColorSpace
    photo.flipY = false // glTF UV convention
    photo.center.set(0.5, 0.5)
    photo.rotation = Math.PI // correct the phone photo's orientation
    const object = scene.clone(true)
    // Match by material name — glTF sanitizes node names (dots removed), so
    // getObjectByName("Plane.001_0") is unreliable. The picture uses Material.002.
    object.traverse((o) => {
      const m = o as THREE.Mesh
      if (m.isMesh && (m.material as THREE.Material | undefined)?.name === FRAME_PIC_MAT) {
        m.material = new THREE.MeshStandardMaterial({ map: photo, roughness: 0.5, metalness: 0 })
      }
    })
    const box = new THREE.Box3().setFromObject(object)
    const s = new THREE.Vector3()
    const c = new THREE.Vector3()
    box.getSize(s)
    box.getCenter(c)
    object.position.set(-c.x, -box.min.y, -c.z)
    object.traverse((o) => {
      const m = o as THREE.Mesh
      if (m.isMesh) m.castShadow = true
    })
    const k = size / Math.max(s.x, s.y, s.z)
    const g = new THREE.Group()
    g.add(object)
    g.scale.setScalar(k)
    return g
  }, [scene, photo, size])
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

// Camera keyframes: top-down on the desk → eye-level looking at the open laptop.
const CAM_TOP = new THREE.Vector3(0, 8.0, 2.6)
const CAM_EYE = new THREE.Vector3(0, 1.7, 7.4)
const CAM_INTO = new THREE.Vector3(0, 1.12, 1.4) // dolly right up to the screen
const LOOK_TOP = new THREE.Vector3(0, 0, 0.3)
const LOOK_EYE = new THREE.Vector3(0, 0.7, 0)
const LOOK_INTO = new THREE.Vector3(0, 1.12, -0.2) // straight into the screen

const LID_CLOSED = 1.78 // radians; model default (0) is open
const MUG_POS: [number, number, number] = [3.0, 0, 0.75]
const NOTEBOOK_POS: [number, number, number] = [-2.95, 0, 1.35]
const NOTEBOOK_ROT: [number, number, number] = [0, 0.5, 0]
const FLOWER_POS: [number, number, number] = [-2.0, 0, -1.65]
const LAMP_POS: [number, number, number] = [3.1, 0, -1.35]
const LAMP_ROT: [number, number, number] = [0, -0.5, 0]
const FRAME_POS: [number, number, number] = [-3.25, 0, -0.55]
const FRAME_ROT: [number, number, number] = [0, -0.85, 0]
const SCREEN_POS: [number, number, number] = [0, 1.13, -0.04]
const SCREEN_ROT: [number, number, number] = [-0.16, 0, 0]
const SCREEN_SIZE: [number, number] = [2.46, 1.56]

function Sequence() {
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
  const frame = usePhotoFrame(1.25)
  const nameTex = useNameTexture()

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
  })

  return (
    <group>
      <primitive object={desk} position={[0, 0, 0]} />
      <group ref={laptop} position={[0, 0, 0]}>
        <primitive object={macbook} />
        <mesh position={SCREEN_POS} rotation={SCREEN_ROT}>
          <planeGeometry args={SCREEN_SIZE} />
          <meshBasicMaterial ref={nameMat} map={nameTex} transparent opacity={0} toneMapped={false} />
        </mesh>
      </group>
      <primitive object={mug} position={MUG_POS} />
      <primitive object={notebook} position={NOTEBOOK_POS} rotation={NOTEBOOK_ROT} />
      <primitive object={flower} position={FLOWER_POS} />
      <primitive object={lamp} position={LAMP_POS} rotation={LAMP_ROT} />
      <primitive object={frame} position={FRAME_POS} rotation={FRAME_ROT} />
    </group>
  )
}

useGLTF.preload(LAPTOP)
useGLTF.preload(MUG)
useGLTF.preload(DESK)
useGLTF.preload(NOTEBOOK)
useGLTF.preload(FLOWER)
useGLTF.preload(LAMP)
useGLTF.preload(FRAME)

export default function Scene() {
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
        {/* Dark room: only a faint cool ambient fills the shadows. */}
        <ambientLight intensity={0.18} color="#4a4640" />
        {/* The desk lamp is the key light — placed just under the lamp head and
            aimed down at the desk, so the light comes from beneath the head
            (not glowing on the head itself). */}
        <spotLight
          position={[2.5, 1.95, -0.5]}
          angle={0.95}
          penumbra={0.85}
          intensity={58}
          distance={18}
          decay={2}
          color="#ffd9a0"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0002}
        />
        <Suspense fallback={null}>
          <Sequence />
          <Environment preset="apartment" environmentIntensity={0.32} />
        </Suspense>
        <EffectComposer>
          <Bloom intensity={0.1} luminanceThreshold={0.92} luminanceSmoothing={0.9} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
