"use client"

import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { makeGlowTexture } from "./glow-texture"

// Big, faint, additive colored clouds placed through the depth of the scene.
// As the camera flies down the timeline it passes through them, giving the
// starfield a sense of volume and atmosphere rather than a flat black void.
const CLOUDS: { pos: [number, number, number]; scale: number; color: string }[] = [
  { pos: [-4, 2, 0], scale: 16, color: "#e879f9" },
  { pos: [5, -1, -4], scale: 20, color: "#22d3ee" },
  { pos: [-3, -2, -8], scale: 18, color: "#a855f7" },
  { pos: [4, 3, -12], scale: 22, color: "#34d399" },
  { pos: [0, -1, -16], scale: 24, color: "#6366f1" },
]

export default function Nebula() {
  const tex = useMemo(() => makeGlowTexture(256), [])
  const group = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!group.current) return
    // Very slight parallax lean so the haze feels alive.
    group.current.rotation.z += (state.pointer.x * 0.04 - group.current.rotation.z) * 0.02
  })

  return (
    <group ref={group}>
      {CLOUDS.map((c, i) => (
        <sprite key={i} position={c.pos} scale={[c.scale, c.scale, 1]}>
          <spriteMaterial
            map={tex}
            color={c.color}
            transparent
            opacity={0.12}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      ))}
    </group>
  )
}
