"use client"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { MeshDistortMaterial, Environment, Text3D, Center } from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import { Suspense, useRef, useState } from "react"
import * as THREE from "three"
import { useReducedMotion } from "@/lib/use-reduced-motion"

// The story: one 3D code-glyph protagonist persists across the page, drifting
// side to side and melting from one programming symbol into the next as each
// section arrives.
const SECTION_IDS = ["hero", "statement", "work", "capabilities", "journey", "recognition", "contact"]
const SYMBOLS = ["{ }", "< >", "( )", "/>", ";", "#", "@"]
const COLORS = ["#C29B6B", "#CFA15C", "#A85A3C", "#C8873F", "#B5714A", "#BE8A3C", "#C29B6B"]
// Smaller on content-dense sections so the text can breathe.
const SCALES = [1.0, 1.0, 0.7, 0.62, 0.92, 0.72, 0.95]
const DENSE = new Set([2, 3, 5]) // work, capabilities, recognition — push further aside
const side = (i: number) => (i % 2 === 0 ? 1 : -1) // right / left, alternating
const FONT = "/fonts/helvetiker_bold.typeface.json"
const MELT_DURATION = 1.1

function Protagonist() {
  const grp = useRef<THREE.Group>(null)
  const mat = useRef<any>(null)
  const { viewport } = useThree()
  const [shown, setShown] = useState(0) // glyph currently displayed

  const s = useRef({
    target: 0,
    melt: 0, // 0..1 transition; 0 = idle
    swapped: true,
    color: new THREE.Color(COLORS[0]),
  })

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05)
    const g = grp.current
    if (!g) return
    const st = s.current

    // Nearest section to viewport center.
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

    // Start a melt when the active section changes.
    if (best !== st.target && st.melt === 0) {
      st.target = best
      st.melt = 0.0001
      st.swapped = false
      st.color.set(COLORS[best])
    }
    if (st.melt > 0) {
      st.melt += dt / MELT_DURATION
      if (!st.swapped && st.melt >= 0.5) {
        setShown(st.target) // swap the glyph at peak melt
        st.swapped = true
      }
      if (st.melt >= 1) st.melt = 0
    }

    // Distortion peaks mid-transition (liquid melt) but stays low otherwise so
    // the glyph reads.
    const meltPulse = st.melt > 0 ? Math.sin(Math.PI * st.melt) : 0
    if (mat.current) {
      mat.current.distort = 0.12 + meltPulse * 0.5
      mat.current.color.lerp(st.color, 1 - Math.pow(0.002, dt))
    }

    // Side-alternating travel; further aside on dense sections.
    const base = Math.min(viewport.width * 0.24, 2.6)
    const offset = base * (DENSE.has(shown) ? 1.2 : 1)
    const targetX = side(shown) * offset
    g.position.x += (targetX - g.position.x) * (1 - Math.pow(0.002, dt))
    g.rotation.y += dt * (0.18 + meltPulse * 1.0)
    g.rotation.x = Math.sin(performance.now() * 0.0002) * 0.12
    const scale = SCALES[shown] * (1 - meltPulse * 0.12)
    g.scale.setScalar(scale)
  })

  return (
    <group ref={grp}>
      <Center key={shown}>
        <Text3D
          font={FONT}
          size={1.6}
          height={0.5}
          bevelEnabled
          bevelThickness={0.04}
          bevelSize={0.03}
          bevelSegments={4}
          curveSegments={8}
        >
          {SYMBOLS[shown]}
          <MeshDistortMaterial ref={mat} color={COLORS[0]} roughness={0.15} metalness={0.35} distort={0.12} speed={1.4} />
        </Text3D>
      </Center>
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
        <Suspense fallback={null}>
          <Protagonist />
          <Environment preset="sunset" />
        </Suspense>
        <EffectComposer>
          <Bloom intensity={0.5} luminanceThreshold={0.55} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
