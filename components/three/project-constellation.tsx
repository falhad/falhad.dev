"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Float, Html } from "@react-three/drei"
import * as THREE from "three"
import type { Project } from "@/lib/portfolio-data"
import { projects } from "@/lib/portfolio-data"

type NodeProps = {
  project: Project
  onSelect: (p: Project) => void
  active: boolean
  dimmed: boolean
}

function ProjectNode({ project, onSelect, active, dimmed }: NodeProps) {
  const mesh = useRef<THREE.Mesh>(null)
  const halo = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const color = new THREE.Color(project.color)

  useFrame((_, delta) => {
    const target = hovered || active ? 1.35 : 1
    if (mesh.current) {
      const s = mesh.current.scale.x + (target - mesh.current.scale.x) * 0.15
      mesh.current.scale.setScalar(s)
      mesh.current.rotation.x += delta * 0.3
      mesh.current.rotation.y += delta * 0.4
    }
    if (halo.current) {
      halo.current.rotation.z += delta * 0.5
      const mat = halo.current.material as THREE.MeshBasicMaterial
      mat.opacity += ((hovered || active ? 0.5 : 0.18) - mat.opacity) * 0.15
    }
  })

  return (
    <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.8} position={project.position}>
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
          onSelect(project)
        }}
      >
        {/* Core */}
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

        {/* Rotating halo ring */}
        <mesh ref={halo} rotation={[Math.PI / 2.2, 0, 0]}>
          <torusGeometry args={[0.95, 0.012, 8, 64]} />
          <meshBasicMaterial color={color} transparent opacity={0.18} blending={THREE.AdditiveBlending} />
        </mesh>

        {/* Label */}
        <Html center distanceFactor={9} position={[0, 1.25, 0]} style={{ pointerEvents: "none" }}>
          <div
            style={{
              opacity: dimmed ? 0.4 : 1,
              transform: `scale(${hovered || active ? 1.05 : 1})`,
              transition: "opacity .3s, transform .2s",
            }}
            className="select-none whitespace-nowrap text-center"
          >
            <div className="text-[13px] font-semibold tracking-tight text-white drop-shadow">
              {project.name}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-white/60">{project.tagline}</div>
          </div>
        </Html>
      </group>
    </Float>
  )
}

type ConstellationProps = {
  onSelect: (p: Project) => void
  activeName: string | null
}

export default function ProjectConstellation({ onSelect, activeName }: ConstellationProps) {
  const group = useRef<THREE.Group>(null)

  // Gentle whole-cluster parallax toward the pointer.
  useFrame((state) => {
    if (!group.current) return
    group.current.rotation.y += (state.pointer.x * 0.18 - group.current.rotation.y) * 0.03
    group.current.rotation.x += (-state.pointer.y * 0.12 - group.current.rotation.x) * 0.03
  })

  return (
    <group ref={group}>
      {projects.map((p) => (
        <ProjectNode
          key={p.name}
          project={p}
          onSelect={onSelect}
          active={activeName === p.name}
          dimmed={activeName !== null && activeName !== p.name}
        />
      ))}
    </group>
  )
}
