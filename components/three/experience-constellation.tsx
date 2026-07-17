"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Float, Html, Line } from "@react-three/drei"
import * as THREE from "three"
import type { Experience } from "@/lib/portfolio-data"
import { experiences } from "@/lib/portfolio-data"

// Only the roles placed on the timeline (all of them define scenePos, but guard anyway).
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
}

function ExperienceNode({ exp, onSelect, active, dimmed, size }: NodeProps) {
  const mesh = useRef<THREE.Mesh>(null)
  const halo = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const color = new THREE.Color(exp.color)

  useFrame((_, delta) => {
    const target = hovered || active ? size * 1.35 : size
    if (mesh.current) {
      const s = mesh.current.scale.x + (target - mesh.current.scale.x) * 0.15
      mesh.current.scale.setScalar(s)
      mesh.current.rotation.x += delta * 0.25
      mesh.current.rotation.y += delta * 0.35
    }
    if (halo.current) {
      halo.current.rotation.z += delta * 0.5
      const mat = halo.current.material as THREE.MeshBasicMaterial
      mat.opacity += ((hovered || active ? 0.5 : 0.16) - mat.opacity) * 0.15
    }
  })

  return (
    <Float speed={1.2} rotationIntensity={0.35} floatIntensity={0.7} position={exp.scenePos}>
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
        <mesh ref={mesh}>
          <icosahedronGeometry args={[0.55, 1]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered || active ? 1.8 : 0.9}
            roughness={0.25}
            metalness={0.4}
            transparent
            opacity={dimmed ? 0.35 : 1}
            flatShading
          />
        </mesh>

        <mesh ref={halo} rotation={[Math.PI / 2.2, 0, 0]}>
          <torusGeometry args={[0.95, 0.012, 8, 64]} />
          <meshBasicMaterial color={color} transparent opacity={0.16} blending={THREE.AdditiveBlending} />
        </mesh>

        <Html center distanceFactor={9} position={[0, 1.15 * size, 0]} style={{ pointerEvents: "none" }}>
          <div
            style={{
              opacity: dimmed ? 0.4 : 1,
              transform: `scale(${hovered || active ? 1.05 : 1})`,
              transition: "opacity .3s, transform .2s",
            }}
            className="select-none whitespace-nowrap text-center"
          >
            <div className="text-[13px] font-semibold tracking-tight text-white drop-shadow">
              {exp.company}
            </div>
            <div className="text-[10px] text-white/70">{exp.position}</div>
            <div className="text-[9px] uppercase tracking-widest text-white/45">{exp.when}</div>
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

  useFrame((state) => {
    if (!group.current) return
    group.current.rotation.y += (state.pointer.x * 0.14 - group.current.rotation.y) * 0.03
    group.current.rotation.x += (-state.pointer.y * 0.1 - group.current.rotation.x) * 0.03
  })

  return (
    <group ref={group}>
      {/* The timeline thread linking each chapter, present -> past. */}
      <Line
        points={timeline.map((e) => e.scenePos)}
        color="#a855f7"
        lineWidth={1}
        transparent
        opacity={0.28}
        dashed
        dashScale={4}
      />
      {timeline.map((exp, i) => (
        <ExperienceNode
          key={exp.company}
          exp={exp}
          onSelect={onSelect}
          active={activeCompany === exp.company}
          dimmed={activeCompany !== null && activeCompany !== exp.company}
          // Most recent (index 0) is largest; older roles taper toward the distance.
          size={1 - i * 0.07}
        />
      ))}
    </group>
  )
}
