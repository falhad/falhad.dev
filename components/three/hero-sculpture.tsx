"use client"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { MeshDistortMaterial, Environment, Float } from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import { Suspense, useRef } from "react"
import type { Mesh } from "three"
import { useReducedMotion } from "@/lib/use-reduced-motion"

// The warm morphing blob. Slowly rotates and drifts toward the cursor.
function Blob() {
  const mesh = useRef<Mesh>(null)
  const { pointer } = useThree()
  useFrame((_, dt) => {
    if (!mesh.current) return
    mesh.current.rotation.y += dt * 0.15
    mesh.current.rotation.x += (pointer.y * 0.3 - mesh.current.rotation.x) * 0.05
    mesh.current.position.x += (pointer.x * 0.4 - mesh.current.position.x) * 0.05
  })
  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1.6, 20]} />
        <MeshDistortMaterial color="#C29B6B" roughness={0.15} metalness={0.35} distort={0.4} speed={1.6} />
      </mesh>
    </Float>
  )
}

// Abstract 3D hero centerpiece. Absolutely fills its parent (which must be
// `relative`). Renders a warm CSS-gradient fallback under reduced-motion.
export default function HeroSculpture() {
  const reduced = useReducedMotion()
  if (reduced) {
    return (
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 60% at 60% 40%, #C29B6B55, transparent 70%), radial-gradient(50% 50% at 35% 65%, #A85A3C33, transparent 70%)",
        }}
      />
    )
  }
  return (
    <div className="absolute inset-0" aria-hidden>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 1.75]} gl={{ antialias: true }}>
        {/* Lights carry the blob on their own so it always renders, even if the
            environment HDR is slow or unreachable. */}
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 4, 5]} intensity={1.4} color="#fff3e0" />
        <directionalLight position={[-4, -2, 2]} intensity={0.6} color="#A85A3C" />
        <Blob />
        {/* Isolated so a hanging/failed HDR fetch can never suspend the blob. */}
        <Suspense fallback={null}>
          <Environment preset="sunset" />
        </Suspense>
        <EffectComposer>
          <Bloom intensity={0.6} luminanceThreshold={0.5} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
