"use client"

import { useState, type MutableRefObject } from "react"
import { Canvas } from "@react-three/fiber"
import * as THREE from "three"
import ParticleField from "./particle-field"
import SkillGalaxy from "./skill-galaxy"
import SkillDetail from "./skill-detail"
import Nebula from "./nebula"
import Effects from "./effects"
import { type SkillPlanet } from "@/lib/portfolio-data"

type Props = {
  reducedMotion?: boolean
  // 0..1 scroll progress; spins the orbit smoothly, planet by planet.
  progressRef?: MutableRefObject<number>
}

// The interactive 3D layer of the hero. Rendered client-only (see hero.tsx).
// A skill solar system: a central sun (the operator core) with skill planets
// orbiting it. Scrolling spins the orbit; clicking a planet reveals its work.
export default function HeroCanvas({ reducedMotion = false, progressRef }: Props) {
  const [selected, setSelected] = useState<SkillPlanet | null>(null)

  return (
    <>
      <Canvas
        className="!absolute inset-0"
        dpr={[1, 1.8]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 1.1, 9.5], fov: 52 }}
        onCreated={({ scene, camera }) => {
          scene.background = new THREE.Color("#05010f")
          scene.fog = new THREE.FogExp2("#05010f", 0.04)
          camera.lookAt(0, 2.4, -4)
        }}
        onPointerMissed={() => setSelected(null)}
      >
        <ambientLight intensity={0.35} />
        <pointLight position={[6, 4, 6]} intensity={30} color="#e879f9" />
        <pointLight position={[-6, -3, 4]} intensity={25} color="#22d3ee" />

        <Nebula />
        <ParticleField count={reducedMotion ? 600 : 1600} />
        <SkillGalaxy onSelect={setSelected} selectedName={selected?.name ?? null} progressRef={progressRef} />

        <Effects reducedMotion={reducedMotion} />
      </Canvas>

      <SkillDetail planet={selected} onClose={() => setSelected(null)} />
    </>
  )
}
