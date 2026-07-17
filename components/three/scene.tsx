"use client"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Environment, useGLTF } from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import { Suspense, useMemo, useRef } from "react"
import * as THREE from "three"
import { profile } from "@/lib/portfolio-data"
import { useReducedMotion } from "@/lib/use-reduced-motion"

const LAPTOP = "/models/macbook.glb" // user-supplied MacBook Pro
const MUG = "/models/coffee_latte_in_mug_with_saucer.glb" // user-supplied
const DESK = "/models/computer_desk.glb" // user-supplied
const LID_NODE = "VCQqxpxkUlzqcJI_62" // MacBook lid/screen sub-assembly (17 meshes)

const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const invlerp = (v: number, a: number, b: number) => clamp((v - a) / (b - a), 0, 1)
const smooth = (t: number) => t * t * (3 - 2 * t)
const v3lerp = (out: THREE.Vector3, a: THREE.Vector3, b: THREE.Vector3, t: number) =>
  out.set(lerp(a.x, b.x, t), lerp(a.y, b.y, t), lerp(a.z, b.z, t))

type Anchor = "bottom" | "top" | "center"

// Load a glb, scaled to `size` by footprint, anchored so its bottom/top/center
// sits at local y=0. The desk surface is y=0, so everything rests on it.
function useAnchored(url: string, size: number, anchor: Anchor) {
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
    const k = size / Math.max(s.x, s.z)
    const g = new THREE.Group()
    g.add(object)
    g.scale.setScalar(k)
    return g
  }, [scene, size, anchor])
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

    object.traverse((o) => {
      const m = o as THREE.Mesh
      if (m.isMesh) {
        m.castShadow = true
        m.receiveShadow = true
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

function useNameTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas")
    c.width = 1024
    c.height = 660
    const x = c.getContext("2d")!
    const grad = x.createLinearGradient(0, 0, 0, 660)
    grad.addColorStop(0, "#141a24")
    grad.addColorStop(1, "#0a0e15")
    x.fillStyle = grad
    x.fillRect(0, 0, 1024, 660)
    x.textAlign = "center"
    x.textBaseline = "middle"
    const [first, ...rest] = profile.name.split(" ")
    x.fillStyle = "#f0e8da"
    x.font = "600 132px Helvetica, Arial, sans-serif"
    x.fillText(first, 512, 300)
    x.font = "600 96px Helvetica, Arial, sans-serif"
    x.fillText(rest.join(" "), 512, 410)
    x.fillStyle = "#c29b6b"
    x.font = "500 34px Helvetica, Arial, sans-serif"
    x.fillText(profile.title.toUpperCase(), 512, 500)
    const t = new THREE.CanvasTexture(c)
    t.anisotropy = 8
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [])
}

// Camera keyframes: top-down on the desk → eye-level looking at the open laptop.
const CAM_TOP = new THREE.Vector3(0, 8.0, 2.6)
const CAM_EYE = new THREE.Vector3(0, 1.7, 7.4)
const LOOK_TOP = new THREE.Vector3(0, 0, 0.3)
const LOOK_EYE = new THREE.Vector3(0, 0.7, 0)

const LID_CLOSED = 1.78 // radians; model default (0) is open
const MUG_POS: [number, number, number] = [2.1, 0, 0.5]
const SCREEN_POS: [number, number, number] = [0, 1.0, -0.12]
const SCREEN_ROT: [number, number, number] = [-0.16, 0, 0]
const SCREEN_SIZE: [number, number] = [1.5, 0.95]

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

    const camT = smooth(invlerp(p, 0.08, 0.6))
    v3lerp(camPos.current, CAM_TOP, CAM_EYE, camT)
    v3lerp(camLook.current, LOOK_TOP, LOOK_EYE, camT)
    state.camera.position.set(
      camPos.current.x + px.current * 0.5 * camT,
      camPos.current.y + py.current * 0.3 * camT,
      camPos.current.z,
    )
    state.camera.lookAt(camLook.current)

    if (pivot) pivot.rotation.x = lerp(LID_CLOSED, 0, smooth(invlerp(p, 0.15, 0.6)))
    if (laptop.current) laptop.current.rotation.y = px.current * 0.05

    // Name fades onto the screen once the lid is most of the way open.
    if (nameMat.current) nameMat.current.opacity = smooth(invlerp(p, 0.5, 0.72))
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
    </group>
  )
}

useGLTF.preload(LAPTOP)
useGLTF.preload(MUG)
useGLTF.preload(DESK)

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
      <Canvas shadows camera={{ position: [0, 8.0, 2.6], fov: 42 }} dpr={[1, 1.9]} gl={{ antialias: true, alpha: true, toneMappingExposure: 0.5 }}>
        <ambientLight intensity={0.25} />
        <directionalLight position={[4, 6, 4]} intensity={0.9} color="#fff6ea" castShadow shadow-mapSize={[2048, 2048]} />
        <directionalLight position={[-5, 3, 1]} intensity={0.25} color="#eef2f6" />
        <Suspense fallback={null}>
          <Sequence />
          <Environment preset="apartment" environmentIntensity={0.55} />
        </Suspense>
        <EffectComposer>
          <Bloom intensity={0.12} luminanceThreshold={0.85} luminanceSmoothing={0.9} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
