"use client"

import { useState, type MutableRefObject } from "react"
import { Canvas } from "@react-three/fiber"
import * as THREE from "three"
import ParticleField from "./particle-field"
import SkillGalaxy from "./skill-galaxy"
import SkillDetail from "./skill-detail"
import CameraRig from "./camera-rig"
import Nebula from "./nebula"
import Effects from "./effects"
import { skillPlanets, type SkillPlanet } from "@/lib/portfolio-data"

type Props = {
  reducedMotion?: boolean
  // 0..1 scroll progress through the pinned hero, snapping planet by planet.
  progressRef?: MutableRefObject<number>
}

// The interactive 3D layer of the hero. Rendered client-only (see hero.tsx)
// because three.js touches `window` at module-eval time.
// A cinematic skill galaxy: each glowing planet is a skill area. Scroll advances
// planet by planet; click one to reveal the projects and experience behind it.
export default function HeroCanvas({ reducedMotion = false, progressRef }: Props) {
  const [selected, setSelected] = useState<SkillPlanet | null>(null)
  const positions = skillPlanets.map((p) => p.scenePos)

  return (
    <>
      <Canvas
        className="!absolute inset-0"
        dpr={[1, 1.8]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 9], fov: 50 }}
        onCreated={({ scene }) => {
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
        <SkillGalaxy onSelect={setSelected} selectedName={selected?.name ?? null} progressRef={progressRef} />
        <CameraRig
          target={selected?.scenePos ?? null}
          planets={positions}
          reducedMotion={reducedMotion}
          progressRef={progressRef}
        />

        <Effects reducedMotion={reducedMotion} />
      </Canvas>

      <SkillDetail planet={selected} onClose={() => setSelected(null)} />
    </>
  )
}
