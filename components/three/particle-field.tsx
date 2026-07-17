"use client"

import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

type Props = {
  count?: number
}

// A drifting cloud of points. Slowly rotates on its own and parallax-leans
// toward the pointer so the scene feels alive without any user action.
export default function ParticleField({ count = 1400 }: Props) {
  const points = useRef<THREE.Points>(null)

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const palette = [
      new THREE.Color("#e879f9"),
      new THREE.Color("#22d3ee"),
      new THREE.Color("#a78bfa"),
      new THREE.Color("#ffffff"),
    ]
    for (let i = 0; i < count; i++) {
      // Distribute in a flattened sphere shell for depth.
      const r = 6 + Math.pow(Math.abs(Math.sin(i * 12.9898)) , 0.5) * 8
      const theta = (i * 2.399963) % (Math.PI * 2) // golden-angle spread
      const phi = Math.acos(1 - (2 * ((i + 0.5) / count)))
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.cos(phi) * 0.55
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta) - 4

      const c = palette[i % palette.length]
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }
    return { positions, colors }
  }, [count])

  useFrame((state, delta) => {
    if (!points.current) return
    points.current.rotation.y += delta * 0.02
    // Parallax lean toward the pointer (state.pointer is normalized -1..1).
    const targetX = state.pointer.y * 0.15
    const targetY = state.pointer.x * 0.25
    points.current.rotation.x += (targetX - points.current.rotation.x) * 0.03
    points.current.rotation.z += (targetY - points.current.rotation.z) * 0.02
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
