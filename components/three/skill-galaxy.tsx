"use client"

import { useMemo, useRef, useState, type MutableRefObject } from "react"
import { useFrame } from "@react-three/fiber"
import { Float, Html, Line } from "@react-three/drei"
import * as THREE from "three"
import type { SkillPlanet } from "@/lib/portfolio-data"
import { skillPlanets } from "@/lib/portfolio-data"
import { makeGlowTexture } from "./glow-texture"

// scroll progress (0..1) -> index of the planet currently in focus.
export function activeFromProgress(p: number) {
  return Math.round(p * (skillPlanets.length - 1))
}

type NodeProps = {
  planet: SkillPlanet
  onSelect: (p: SkillPlanet) => void
  active: boolean
  dimmed: boolean
  size: number
  glowTex: THREE.Texture
}

function PlanetNode({ planet, onSelect, active, dimmed, size, glowTex }: NodeProps) {
  const core = useRef<THREE.Mesh>(null)
  const glow = useRef<THREE.Sprite>(null)
  const [hovered, setHovered] = useState(false)
  const color = useMemo(() => new THREE.Color(planet.color), [planet.color])
  const focus = hovered || active

  useFrame((state) => {
    const coreScale = (focus ? size * 1.25 : size) * (dimmed ? 0.8 : 1)
    if (core.current) {
      core.current.scale.setScalar(THREE.MathUtils.lerp(core.current.scale.x, coreScale, 0.15))
      const mat = core.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity += ((focus ? 6 : 3.2) * (dimmed ? 0.4 : 1) - mat.emissiveIntensity) * 0.15
    }
    if (glow.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2 + planet.scenePos[0]) * 0.05
      const g = (focus ? size * 5.4 : size * 4) * pulse * (dimmed ? 0.65 : 1)
      const next = THREE.MathUtils.lerp(glow.current.scale.x, g, 0.12)
      glow.current.scale.set(next, next, 1)
      const gm = glow.current.material as THREE.SpriteMaterial
      gm.opacity += ((focus ? 0.95 : 0.7) * (dimmed ? 0.3 : 1) - gm.opacity) * 0.15
    }
  })

  return (
    <Float speed={1.1} rotationIntensity={0.25} floatIntensity={0.6} position={planet.scenePos}>
      <group
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = "pointer"
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = "auto"
        }}
        onClick={(e) => {
          e.stopPropagation()
          onSelect(planet)
        }}
      >
        <sprite ref={glow}>
          <spriteMaterial
            map={glowTex}
            color={color}
            transparent
            opacity={0.7}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>

        <mesh ref={core}>
          <sphereGeometry args={[0.34, 32, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={3.2}
            roughness={0.35}
            metalness={0.1}
            toneMapped={false}
          />
        </mesh>

        {/* generous invisible hit target */}
        <mesh visible={false}>
          <sphereGeometry args={[1, 8, 8]} />
        </mesh>

        <Html center distanceFactor={8} position={[0, 1.25 * size, 0]} style={{ pointerEvents: "none" }}>
          <div
            style={{
              opacity: dimmed ? 0.32 : 1,
              transform: `scale(${focus ? 1.06 : 1})`,
              transition: "opacity .3s, transform .2s",
            }}
            className="select-none whitespace-nowrap"
          >
            <div className="rounded-md border border-white/15 bg-black/60 px-3 py-1.5 text-center shadow-[0_8px_24px_-6px_rgba(0,0,0,0.9)] backdrop-blur-md">
              <div className="mono text-[8px] uppercase tracking-[0.2em]" style={{ color: planet.color }}>
                {planet.code}
              </div>
              <div className="font-display text-[13px] font-semibold leading-tight text-white">
                {planet.name}
              </div>
              <div
                className="mono mt-1 text-[8px] uppercase leading-none tracking-widest transition-opacity"
                style={{ color: planet.color, opacity: focus ? 1 : 0.5 }}
              >
                ▸ click for work
              </div>
            </div>
            <div className="mx-auto mt-1 h-2 w-px" style={{ background: `linear-gradient(${planet.color}, transparent)` }} />
          </div>
        </Html>
      </group>
    </Float>
  )
}

type Props = {
  onSelect: (p: SkillPlanet) => void
  selectedName: string | null
  progressRef?: MutableRefObject<number>
}

export default function SkillGalaxy({ onSelect, selectedName, progressRef }: Props) {
  const group = useRef<THREE.Group>(null)
  const glowTex = useMemo(() => makeGlowTexture(128), [])
  const [active, setActive] = useState(0)

  useFrame((state) => {
    if (progressRef) {
      const a = activeFromProgress(progressRef.current)
      setActive((prev) => (prev === a ? prev : a))
    }
    if (group.current) {
      group.current.rotation.y += (state.pointer.x * 0.1 - group.current.rotation.y) * 0.03
      group.current.rotation.x += (-state.pointer.y * 0.07 - group.current.rotation.x) * 0.03
    }
  })

  return (
    <group ref={group}>
      <Line
        points={skillPlanets.map((p) => p.scenePos)}
        color="#a855f7"
        lineWidth={1}
        transparent
        opacity={0.22}
        dashed
        dashScale={5}
      />
      {skillPlanets.map((planet, i) => {
        const isActive = selectedName ? selectedName === planet.name : i === active
        return (
          <PlanetNode
            key={planet.name}
            planet={planet}
            onSelect={onSelect}
            active={isActive}
            dimmed={selectedName ? selectedName !== planet.name : i !== active}
            size={1 - i * 0.05}
            glowTex={glowTex}
          />
        )
      })}
    </group>
  )
}
