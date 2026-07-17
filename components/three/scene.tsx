"use client"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Environment, Float, useGLTF } from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import { Suspense, useMemo, useRef } from "react"
import * as THREE from "three"
import { useReducedMotion } from "@/lib/use-reduced-motion"

const MODEL = "/models/laptop.glb" // Kenney laptop, CC0
const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n))

// Load the real model, centered at the origin and normalized to a consistent size.
function LaptopModel() {
  const { scene } = useGLTF(MODEL)
  const { object, k, offset } = useMemo(() => {
    const object = scene.clone(true)
    const box = new THREE.Box3().setFromObject(object)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)
    const k = 2.5 / Math.max(size.x, size.y, size.z)
    return { object, k, offset: center }
  }, [scene])
  return (
    <group scale={k} rotation={[0, Math.PI, 0]}>
      <primitive object={object} position={[-offset.x, -offset.y, -offset.z]} />
    </group>
  )
}
useGLTF.preload(MODEL)

// The signature object: a real laptop, studio-lit, floating at a product angle
// in the hero. It rises out of frame on scroll so content below stays clean.
function Laptop() {
  const grp = useRef<THREE.Group>(null)
  const { viewport, pointer } = useThree()
  const px = useRef(0)
  const py = useRef(0)

  useFrame((state, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05)
    const g = grp.current
    if (!g) return
    const p = clamp(window.scrollY / window.innerHeight, 0, 1)
    px.current += (pointer.x - px.current) * (1 - Math.pow(0.0015, dt))
    py.current += (pointer.y - py.current) * (1 - Math.pow(0.0015, dt))
    const t = state.clock.elapsedTime

    g.position.x = Math.min(viewport.width * 0.15, 1.6)
    g.position.y = 0.1 + p * 6
    g.scale.setScalar(1 - p * 0.35)
    g.rotation.y = -0.5 + Math.sin(t * 0.25) * 0.18 + px.current * 0.35 + p * 0.4
    g.rotation.x = 0.05 + py.current * 0.1
  })

  return (
    <group ref={grp}>
      <Float speed={1.1} rotationIntensity={0.15} floatIntensity={0.5}>
        <LaptopModel />
      </Float>
    </group>
  )
}

export default function Scene() {
  const reduced = useReducedMotion()
  if (reduced) {
    return (
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(50% 50% at 72% 32%, #C29B6B33, transparent 70%), radial-gradient(45% 45% at 30% 68%, #A85A3C22, transparent 70%)",
        }}
      />
    )
  }
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <Canvas
        camera={{ position: [0, 1.15, 6.4], fov: 40 }}
        dpr={[1, 1.9]}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ camera }) => camera.lookAt(0, 0.35, 0)}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 6, 4]} intensity={1.9} color="#fff2e0" />
        <directionalLight position={[-5, 2, -2]} intensity={0.6} color="#9fb4d0" />
        <directionalLight position={[0, 3, -6]} intensity={0.9} color="#ffd9a8" />
        <Suspense fallback={null}>
          <Laptop />
          <Environment preset="city" />
        </Suspense>
        <EffectComposer>
          <Bloom intensity={0.4} luminanceThreshold={0.8} luminanceSmoothing={0.9} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
