"use client"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Environment, useGLTF } from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import { Suspense, useMemo, useRef } from "react"
import * as THREE from "three"
import { useReducedMotion } from "@/lib/use-reduced-motion"

const LAPTOP = "/models/macbook.glb" // user-supplied MacBook Pro model
const MUG = "/models/mug.glb" // Kenney, CC0
const LID_NODE = "VCQqxpxkUlzqcJI_62" // the lid/screen sub-assembly (17 meshes)

const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const invlerp = (v: number, a: number, b: number) => clamp((v - a) / (b - a), 0, 1)
const smooth = (t: number) => t * t * (3 - 2 * t)
const v3lerp = (out: THREE.Vector3, a: THREE.Vector3, b: THREE.Vector3, t: number) =>
  out.set(lerp(a.x, b.x, t), lerp(a.y, b.y, t), lerp(a.z, b.z, t))

// Load the MacBook, normalized + centered, with its lid re-parented onto a
// hinge pivot so it can open and close. Returns the render group and the pivot.
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
      pivot.attach(lid) // preserves world transform
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
    object.position.set(-c.x, -c.y, -c.z)
    const k = size / Math.max(s.x, s.z)
    const group = new THREE.Group()
    group.add(object)
    group.scale.setScalar(k)
    return { group, pivot }
  }, [scene, size])
}

function useMugModel(size: number) {
  const { scene } = useGLTF(MUG)
  return useMemo(() => {
    const object = scene.clone(true)
    const box = new THREE.Box3().setFromObject(object)
    const s = new THREE.Vector3()
    const c = new THREE.Vector3()
    box.getSize(s)
    box.getCenter(c)
    object.position.set(-c.x, -c.y, -c.z)
    object.traverse((o) => {
      const m = o as THREE.Mesh
      if (m.isMesh) m.castShadow = true
    })
    const k = size / Math.max(s.x, s.y, s.z)
    const g = new THREE.Group()
    g.add(object)
    g.scale.setScalar(k)
    return g
  }, [scene, size])
}

// Camera keyframes (position + look target), interpolated by scroll.
const CAM_TOP = new THREE.Vector3(0, 2.2, 2.9) // high 3/4 so the closed laptop is clearly visible
const CAM_EYE = new THREE.Vector3(0, 1.15, 7.6) // eye-level, pulled back to reveal the desk
const LOOK_TOP = new THREE.Vector3(0, -0.1, 0)
const LOOK_EYE = new THREE.Vector3(0, 0.15, 0)

const LID_CLOSED = 1.78 // radians; model default (0) is open

const MUG_START = new THREE.Vector3(2.1, -0.3, 0.9)
const MUG_LAND = new THREE.Vector3(0.12, -0.12, 0.98)
const PUDDLE_POS: [number, number, number] = [0.15, -0.28, 0.6]
const DRIP_POS: [number, number, number] = [0.15, -0.5, 0.95]

function Sequence() {
  const laptop = useRef<THREE.Group>(null)
  const mug = useRef<THREE.Group>(null)
  const puddle = useRef<THREE.Mesh>(null)
  const drip = useRef<THREE.Mesh>(null)
  const { pointer } = useThree()
  const px = useRef(0)
  const py = useRef(0)
  const camPos = useRef(new THREE.Vector3().copy(CAM_TOP))
  const camLook = useRef(new THREE.Vector3().copy(LOOK_TOP))

  const { group: macbook, pivot } = useMacBook(3.2)
  const mugModel = useMugModel(0.5)

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
    const t = state.clock.elapsedTime

    // Camera: top-down → eye-level, pulling back to reveal the desk.
    const camT = smooth(invlerp(p, 0.05, 0.5))
    v3lerp(camPos.current, CAM_TOP, CAM_EYE, camT)
    v3lerp(camLook.current, LOOK_TOP, LOOK_EYE, camT)
    state.camera.position.set(
      camPos.current.x + px.current * 0.5 * camT,
      camPos.current.y + py.current * 0.3 * camT,
      camPos.current.z,
    )
    state.camera.lookAt(camLook.current)

    // Lid opens as we tilt down to eye level.
    if (pivot) pivot.rotation.x = lerp(LID_CLOSED, 0, smooth(invlerp(p, 0.1, 0.5)))

    if (laptop.current) laptop.current.rotation.y = px.current * 0.06

    // Mug slides onto the keyboard then tips over.
    const slide = smooth(invlerp(p, 0.55, 0.78))
    const tip = smooth(invlerp(p, 0.74, 0.9))
    if (mug.current) {
      const hop = Math.sin(slide * Math.PI) * 0.12
      mug.current.position.set(
        lerp(MUG_START.x, MUG_LAND.x, slide),
        lerp(MUG_START.y, MUG_LAND.y, slide) + hop,
        lerp(MUG_START.z, MUG_LAND.z, slide),
      )
      mug.current.rotation.z = -tip * 2.2
      mug.current.rotation.y = t * 0.3
      mug.current.visible = camT > 0.15
    }

    // Coffee: puddle spreads, then a sheet drips down the front.
    const spill = smooth(invlerp(p, 0.8, 0.95))
    if (puddle.current) {
      puddle.current.visible = spill > 0.01
      puddle.current.scale.set(0.15 + spill * 1.3, 0.12 + spill * 0.85, 1)
    }
    const run = smooth(invlerp(p, 0.88, 1))
    if (drip.current) {
      drip.current.visible = run > 0.01
      drip.current.scale.set(0.6 + run * 0.3, 0.001 + run * 1.7, 1)
      drip.current.position.y = DRIP_POS[1] - (0.001 + run * 1.7) * 0.5 + 0.02
    }
  })

  return (
    <group position={[0, 0.05, 0]}>
      <group ref={laptop}>
        <primitive object={macbook} />
      </group>
      <group ref={mug}>
        <primitive object={mugModel} />
      </group>
      <mesh ref={puddle} position={PUDDLE_POS} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <circleGeometry args={[1, 40]} />
        <meshStandardMaterial color="#3a2012" roughness={0.15} metalness={0} />
      </mesh>
      <mesh ref={drip} position={DRIP_POS} visible={false}>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial color="#3a2012" roughness={0.2} metalness={0} />
      </mesh>
    </group>
  )
}

useGLTF.preload(LAPTOP)
useGLTF.preload(MUG)

export default function Scene() {
  const reduced = useReducedMotion()
  if (reduced) {
    return (
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 50% at 60% 40%, #C29B6B22, transparent 70%), radial-gradient(45% 45% at 35% 70%, #A85A3C1c, transparent 70%)",
        }}
      />
    )
  }
  return (
    <div className="absolute inset-0" aria-hidden>
      <Canvas shadows camera={{ position: [0, 2.2, 2.9], fov: 42 }} dpr={[1, 1.9]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 6, 4]} intensity={2} color="#fff2e0" castShadow shadow-mapSize={[1024, 1024]} />
        <directionalLight position={[-5, 2, -2]} intensity={0.5} color="#9fb4d0" />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.55, 0]} receiveShadow>
          <planeGeometry args={[40, 40]} />
          <meshStandardMaterial color="#171310" roughness={0.9} metalness={0} />
        </mesh>
        <Suspense fallback={null}>
          <Sequence />
          <Environment preset="city" />
        </Suspense>
        <EffectComposer>
          <Bloom intensity={0.35} luminanceThreshold={0.75} luminanceSmoothing={0.9} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
