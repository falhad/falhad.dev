"use client"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { RoundedBox, Environment, Float } from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import { Suspense, useRef } from "react"
import * as THREE from "three"
import { useReducedMotion } from "@/lib/use-reduced-motion"

const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n))

// A realistic studio-lit laptop — the signature object. It floats and gently
// turns in the hero like a product shot, then rises out of frame as the viewer
// scrolls into the content so it never competes with the text below.
function Laptop() {
  const grp = useRef<THREE.Group>(null)
  const { viewport, pointer } = useThree()
  const px = useRef(0)
  const py = useRef(0)

  useFrame((state, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05)
    const g = grp.current
    if (!g) return
    // Scroll progress across the first viewport (hero → content).
    const p = clamp(window.scrollY / window.innerHeight, 0, 1)
    // Damp the cursor for a smooth parallax tilt.
    px.current += (pointer.x - px.current) * (1 - Math.pow(0.0015, dt))
    py.current += (pointer.y - py.current) * (1 - Math.pow(0.0015, dt))
    const t = state.clock.elapsedTime

    g.position.x = Math.min(viewport.width * 0.15, 1.6)
    g.position.y = 0.1 + p * 6 // lifts up and out of frame as you leave the hero
    g.scale.setScalar(1 - p * 0.35)
    // 3/4 product angle: a slight base turn, gentle idle sway, cursor parallax.
    g.rotation.y = -0.5 + Math.sin(t * 0.25) * 0.16 + px.current * 0.32 + p * 0.4
    g.rotation.x = 0.02 + py.current * 0.1
  })

  return (
    <group ref={grp}>
      <Float speed={1.1} rotationIntensity={0.15} floatIntensity={0.5}>
        {/* Deck (aluminum unibody) */}
        <RoundedBox args={[3, 0.14, 2]} radius={0.05} smoothness={4}>
          <meshStandardMaterial color="#a7abb2" metalness={0.85} roughness={0.34} />
        </RoundedBox>
        {/* Keyboard well */}
        <mesh position={[0, 0.082, 0.12]}>
          <boxGeometry args={[2.62, 0.02, 1.32]} />
          <meshStandardMaterial color="#17181c" metalness={0.4} roughness={0.6} />
        </mesh>
        {/* Trackpad */}
        <mesh position={[0, 0.083, 0.74]}>
          <boxGeometry args={[0.92, 0.02, 0.5]} />
          <meshStandardMaterial color="#2a2c31" metalness={0.5} roughness={0.4} />
        </mesh>
        {/* Lid, hinged at the back edge and leaned open */}
        <group position={[0, 0.04, -0.98]} rotation={[-1.5, 0, 0]}>
          <RoundedBox args={[3, 2, 0.08]} radius={0.04} smoothness={4} position={[0, 1, 0]}>
            <meshStandardMaterial color="#a7abb2" metalness={0.85} roughness={0.34} />
          </RoundedBox>
          {/* Glowing display */}
          <mesh position={[0, 1, 0.05]}>
            <planeGeometry args={[2.78, 1.78]} />
            <meshStandardMaterial
              color="#0c1622"
              emissive="#357fc4"
              emissiveIntensity={1.3}
              roughness={0.2}
              metalness={0}
            />
          </mesh>
        </group>
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
        {/* Studio lighting: warm key, cool fill, rim. */}
        <ambientLight intensity={0.35} />
        <directionalLight position={[5, 6, 4]} intensity={1.8} color="#fff2e0" />
        <directionalLight position={[-5, 2, -2]} intensity={0.5} color="#9fb4d0" />
        <directionalLight position={[0, 3, -6]} intensity={0.9} color="#ffd9a8" />
        <Suspense fallback={null}>
          <Laptop />
          <Environment preset="city" />
        </Suspense>
        <EffectComposer>
          <Bloom intensity={0.45} luminanceThreshold={0.78} luminanceSmoothing={0.9} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
