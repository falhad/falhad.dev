"use client"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { MeshDistortMaterial, Environment } from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import { Suspense, useMemo, useRef } from "react"
import * as THREE from "three"
import { useReducedMotion } from "@/lib/use-reduced-motion"

// The story: one 3D protagonist that persists across the whole page, drifting
// side to side and melting from one form into the next as each section arrives.
const SECTION_IDS = ["hero", "statement", "work", "capabilities", "journey", "recognition", "contact"]
const COLORS = ["#C29B6B", "#CFA15C", "#A85A3C", "#C8873F", "#B5714A", "#BE8A3C", "#C29B6B"]
const side = (i: number) => (i % 2 === 0 ? 1 : -1) // right / left, alternating

const MELT_DURATION = 1.1 // seconds for a full melt-and-reform

function Protagonist() {
  const mesh = useRef<THREE.Mesh>(null)
  const mat = useRef<any>(null)
  const { viewport } = useThree()

  // One geometry per section. The distortion material warps all of them, so at
  // peak melt every shape becomes a blob, then re-solidifies into the next.
  const geoms = useMemo(
    () => [
      new THREE.IcosahedronGeometry(1.55, 20), // hero — organic blob
      new THREE.SphereGeometry(1.5, 64, 64), // statement — globe
      new THREE.BoxGeometry(2, 2, 2, 12, 12, 12), // work — building block
      new THREE.IcosahedronGeometry(1.7, 1), // capabilities — faceted
      new THREE.TorusGeometry(1.15, 0.45, 32, 96), // journey — looping path
      new THREE.OctahedronGeometry(1.8, 0), // recognition — gem
      new THREE.TorusGeometry(1.25, 0.42, 32, 96), // contact — open ring
    ],
    [],
  )

  const state = useRef({
    current: 0, // geometry currently shown
    melt: 0, // 0..1 transition progress; 0 = idle
    swapped: true, // whether geometry was swapped this transition
    target: new THREE.Color(COLORS[0]),
  })

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05)
    const m = mesh.current
    if (!m) return
    const s = state.current

    // Which section is nearest the viewport center right now?
    const mid = window.innerHeight / 2
    let best = 0
    let bestDist = Infinity
    for (let i = 0; i < SECTION_IDS.length; i++) {
      const el = document.getElementById(SECTION_IDS[i])
      if (!el) continue
      const r = el.getBoundingClientRect()
      const d = Math.abs(r.top + r.height / 2 - mid)
      if (d < bestDist) {
        bestDist = d
        best = i
      }
    }

    // Begin a melt when the active section changes.
    if (best !== s.current && s.melt === 0) {
      s.melt = 0.0001
      s.swapped = false
      s.target.set(COLORS[best])
    }

    if (s.melt > 0) {
      s.melt += dt / MELT_DURATION
      // Swap geometry at the peak of the melt (fully blobbed).
      if (!s.swapped && s.melt >= 0.5) {
        m.geometry = geoms[best]
        s.current = best
        s.swapped = true
      }
      if (s.melt >= 1) s.melt = 0
    }

    // Distortion peaks mid-transition → liquid melt-and-reform.
    const meltPulse = s.melt > 0 ? Math.sin(Math.PI * s.melt) : 0
    if (mat.current) {
      mat.current.distort = 0.28 + meltPulse * 0.62
      mat.current.color.lerp(s.target, 1 - Math.pow(0.001, dt))
    }

    // Side-alternating travel; damped toward the target column.
    const offset = Math.min(viewport.width * 0.26, 2.6)
    const targetX = side(s.current) * offset
    m.position.x += (targetX - m.position.x) * (1 - Math.pow(0.002, dt))
    // Gentle continuous rotation + a spin nudge while melting.
    m.rotation.y += dt * (0.2 + meltPulse * 1.2)
    m.rotation.x += dt * 0.08
    // Scale dips slightly at peak melt, giving the reform a little "pop".
    const scale = 1 - meltPulse * 0.12
    m.scale.setScalar(scale)
  })

  return (
    <mesh ref={mesh} geometry={geoms[0]}>
      <MeshDistortMaterial ref={mat} color={COLORS[0]} roughness={0.15} metalness={0.35} distort={0.28} speed={1.5} />
    </mesh>
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
            "radial-gradient(50% 50% at 72% 30%, #C29B6B44, transparent 70%), radial-gradient(45% 45% at 28% 70%, #A85A3C2e, transparent 70%)",
        }}
      />
    )
  }
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 4, 5]} intensity={1.4} color="#fff3e0" />
        <directionalLight position={[-4, -2, 2]} intensity={0.6} color="#A85A3C" />
        <Protagonist />
        <Suspense fallback={null}>
          <Environment preset="sunset" />
        </Suspense>
        <EffectComposer>
          <Bloom intensity={0.55} luminanceThreshold={0.5} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
