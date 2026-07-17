"use client"

import { useState } from "react"
import { Canvas } from "@react-three/fiber"
import * as THREE from "three"
import ParticleField from "./particle-field"
import ProjectConstellation from "./project-constellation"
import ProjectDetail from "./project-detail"
import type { Project } from "@/lib/portfolio-data"

type Props = {
  reducedMotion?: boolean
}

// The interactive 3D layer of the hero. Rendered client-only (see hero.tsx)
// because three.js touches `window` at module-eval time.
export default function HeroCanvas({ reducedMotion = false }: Props) {
  const [selected, setSelected] = useState<Project | null>(null)

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
        <ProjectConstellation onSelect={setSelected} activeName={selected?.name ?? null} />
      </Canvas>

      <ProjectDetail project={selected} onClose={() => setSelected(null)} />
    </>
  )
}
