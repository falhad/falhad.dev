"use client"

import { useState, type MutableRefObject } from "react"
import { Canvas } from "@react-three/fiber"
import * as THREE from "three"
import ParticleField from "./particle-field"
import ExperienceConstellation from "./experience-constellation"
import ExperienceDetail from "./experience-detail"
import CameraRig from "./camera-rig"
import Nebula from "./nebula"
import Effects from "./effects"
import type { Experience } from "@/lib/portfolio-data"

type Props = {
  reducedMotion?: boolean
  // 0..1 scroll progress through the pinned hero, driving the timeline fly-through.
  progressRef?: MutableRefObject<number>
}

// The interactive 3D layer of the hero. Rendered client-only (see hero.tsx)
// because three.js touches `window` at module-eval time.
// A cinematic deep-space timeline: companies are glowing stars along the depth
// axis, present near, past receding into nebula and fog. Real bloom (see Effects)
// makes the emissive cores read as light rather than shaded geometry.
export default function HeroCanvas({ reducedMotion = false, progressRef }: Props) {
  const [selected, setSelected] = useState<Experience | null>(null)

  return (
    <>
      <Canvas
        className="!absolute inset-0"
        dpr={[1, 1.8]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 9], fov: 50 }}
        onCreated={({ scene }) => {
          // Solid background (not alpha) so the bloom pass composites cleanly.
          scene.background = new THREE.Color("#05010f")
          scene.fog = new THREE.FogExp2("#05010f", 0.05)
        }}
        onPointerMissed={() => setSelected(null)}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[6, 4, 6]} intensity={40} color="#e879f9" />
        <pointLight position={[-6, -3, 4]} intensity={35} color="#22d3ee" />

        <Nebula />
        <ParticleField count={reducedMotion ? 600 : 1600} />
        <ExperienceConstellation onSelect={setSelected} activeCompany={selected?.company ?? null} />
        <CameraRig target={selected?.scenePos ?? null} reducedMotion={reducedMotion} progressRef={progressRef} />

        <Effects reducedMotion={reducedMotion} />
      </Canvas>

      <ExperienceDetail exp={selected} onClose={() => setSelected(null)} />
    </>
  )
}
