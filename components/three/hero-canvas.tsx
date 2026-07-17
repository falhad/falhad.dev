"use client"

import { useState, type MutableRefObject } from "react"
import { Canvas } from "@react-three/fiber"
import * as THREE from "three"
import ParticleField from "./particle-field"
import ExperienceConstellation from "./experience-constellation"
import ExperienceDetail from "./experience-detail"
import CameraRig from "./camera-rig"
import type { Experience } from "@/lib/portfolio-data"

type Props = {
  reducedMotion?: boolean
  // 0..1 scroll progress through the pinned hero, driving the timeline fly-through.
  progressRef?: MutableRefObject<number>
}

// The interactive 3D layer of the hero. Rendered client-only (see hero.tsx)
// because three.js touches `window` at module-eval time.
// The scene is a timeline: companies float along the depth axis, present near,
// past receding into the fog. Click a node to fly to that career chapter.
export default function HeroCanvas({ reducedMotion = false, progressRef }: Props) {
  const [selected, setSelected] = useState<Experience | null>(null)

  return (
    <>
      <Canvas
        className="!absolute inset-0"
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 9], fov: 50 }}
        onCreated={({ scene }) => {
          scene.fog = new THREE.FogExp2("#05010f", 0.055)
        }}
        onPointerMissed={() => setSelected(null)}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[6, 4, 6]} intensity={60} color="#e879f9" />
        <pointLight position={[-6, -3, 4]} intensity={50} color="#22d3ee" />
        <pointLight position={[0, 2, 8]} intensity={20} color="#ffffff" />

        <ParticleField count={reducedMotion ? 500 : 1400} />
        <ExperienceConstellation onSelect={setSelected} activeCompany={selected?.company ?? null} />
        <CameraRig target={selected?.scenePos ?? null} reducedMotion={reducedMotion} progressRef={progressRef} />
      </Canvas>

      <ExperienceDetail exp={selected} onClose={() => setSelected(null)} />
    </>
  )
}
