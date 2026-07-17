"use client"

import { useMemo, useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Float, Html, Line } from "@react-three/drei"
import * as THREE from "three"
import type { Experience } from "@/lib/portfolio-data"
import { experiences } from "@/lib/portfolio-data"
import { makeGlowTexture } from "./glow-texture"

const timeline = experiences.filter((e) => e.scenePos) as (Experience & {
  scenePos: [number, number, number]
  color: string
})[]

type NodeProps = {
  exp: Experience & { scenePos: [number, number, number]; color: string }
  onSelect: (e: Experience) => void
  active: boolean
  dimmed: boolean
  size: number
  glowTex: THREE.Texture
}

function ExperienceNode({ exp, onSelect, active, dimmed, size, glowTex }: NodeProps) {
  const core = useRef<THREE.Mesh>(null)
  const glow = useRef<THREE.Sprite>(null)
  const [hovered, setHovered] = useState(false)
  const color = useMemo(() => new THREE.Color(exp.color), [exp.color])

  useFrame((state, delta) => {
    const focus = hovered || active
    const coreScale = (focus ? size * 1.25 : size) * (dimmed ? 0.85 : 1)
    if (core.current) {
      const s = THREE.MathUtils.lerp(core.current.scale.x, coreScale, 0.15)
      core.current.scale.setScalar(s)
      const mat = core.current.material as THREE.MeshStandardMaterial
      const targetE = (focus ? 6 : 3.2) * (dimmed ? 0.4 : 1)
      mat.emissiveIntensity += (targetE - mat.emissiveIntensity) * 0.15
    }
    if (glow.current) {
      // Gentle twinkle + hover swell.
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2 + exp.scenePos[0]) * 0.05
      const g = (focus ? size * 5.2 : size * 4) * pulse * (dimmed ? 0.7 : 1)
      const cur = glow.current.scale.x
      const next = THREE.MathUtils.lerp(cur, g, 0.12)
      glow.current.scale.set(next, next, 1)
      const gm = glow.current.material as THREE.SpriteMaterial
      gm.opacity += ((focus ? 0.95 : 0.7) * (dimmed ? 0.35 : 1) - gm.opacity) * 0.15
    }
  })

  return (
    <Float speed={1.1} rotationIntensity={0.25} floatIntensity={0.6} position={exp.scenePos}>
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
          onSelect(exp)
        }}
      >
        {/* Soft outer glow — a camera-facing sprite; bloom amplifies it. */}
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

        {/* Bright emissive core — high emissive so the bloom pass blows it out. */}
        <mesh ref={core}>
          <sphereGeometry args={[0.32, 32, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={3.2}
            roughness={0.35}
            metalness={0.1}
            toneMapped={false}
          />
        </mesh>

        {/* Invisible larger hit target so the small star is easy to click/hover. */}
        <mesh visible={false}>
          <sphereGeometry args={[0.9, 8, 8]} />
        </mesh>

        <Html center distanceFactor={8} position={[0, 1.2 * size, 0]} style={{ pointerEvents: "none" }}>
          <div
            style={{
              opacity: dimmed ? 0.35 : 1,
              transform: `scale(${hovered || active ? 1.06 : 1})`,
              transition: "opacity .3s, transform .2s",
            }}
            className="select-none whitespace-nowrap"
          >
            {/* HUD instrument tag — legible over bloom, professional type */}
            <div className="rounded-md border border-white/15 bg-black/60 px-3 py-1.5 text-center shadow-[0_8px_24px_-6px_rgba(0,0,0,0.9)] backdrop-blur-md">
              <div className="font-display text-[13px] font-semibold leading-tight text-white">
                {exp.company}
              </div>
              <div
                className="mono mt-0.5 text-[9px] uppercase leading-none tracking-[0.18em]"
                style={{ color: exp.color }}
              >
                {exp.position}
              </div>
              <div className="mono mt-1 text-[9px] leading-none tracking-widest text-white/50">
                {exp.when}
              </div>
            </div>
            {/* connector tick down to the star */}
            <div className="mx-auto mt-1 h-2 w-px" style={{ background: `linear-gradient(${exp.color}, transparent)` }} />
          </div>
        </Html>
      </group>
    </Float>
  )
}

type Props = {
  onSelect: (e: Experience) => void
  activeCompany: string | null
}

export default function ExperienceConstellation({ onSelect, activeCompany }: Props) {
  const group = useRef<THREE.Group>(null)
  const glowTex = useMemo(() => makeGlowTexture(128), [])

  useFrame((state) => {
    if (!group.current) return
    group.current.rotation.y += (state.pointer.x * 0.1 - group.current.rotation.y) * 0.03
    group.current.rotation.x += (-state.pointer.y * 0.07 - group.current.rotation.x) * 0.03
  })

  return (
    <group ref={group}>
      {/* Faint timeline thread linking each chapter, present -> past. */}
      <Line
        points={timeline.map((e) => e.scenePos)}
        color="#a855f7"
        lineWidth={1}
        transparent
        opacity={0.22}
        dashed
        dashScale={5}
      />
      {timeline.map((exp, i) => (
        <ExperienceNode
          key={exp.company}
          exp={exp}
          onSelect={onSelect}
          active={activeCompany === exp.company}
          dimmed={activeCompany !== null && activeCompany !== exp.company}
          size={1 - i * 0.06}
          glowTex={glowTex}
        />
      ))}
    </group>
  )
}
