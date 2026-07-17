"use client"

import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { makeGlowTexture } from "./glow-texture"

type LayerProps = {
  count: number
  size: number
  spread: number
  depth: number
  tint: THREE.Color[]
  opacity: number
  drift: number
}

function useLayer({ count, spread, depth, tint }: Pick<LayerProps, "count" | "spread" | "depth" | "tint">) {
  return useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      // Deterministic pseudo-random spread (no Math.random so SSR/HMR is stable).
      const a = Math.sin(i * 12.9898) * 43758.5453
      const b = Math.sin(i * 78.233) * 12543.987
      const c = Math.sin(i * 39.425) * 24634.634
      positions[i * 3] = ((a - Math.floor(a)) - 0.5) * spread
      positions[i * 3 + 1] = ((b - Math.floor(b)) - 0.5) * spread * 0.7
      positions[i * 3 + 2] = ((c - Math.floor(c)) - 0.5) * depth - depth * 0.3
      const col = tint[i % tint.length]
      colors[i * 3] = col.r
      colors[i * 3 + 1] = col.g
      colors[i * 3 + 2] = col.b
    }
    return { positions, colors }
  }, [count, spread, depth, tint])
}

function Layer(props: LayerProps) {
  const ref = useRef<THREE.Points>(null)
  const tex = useMemo(() => makeGlowTexture(64), [])
  const { positions, colors } = useLayer(props)

  useFrame((state, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.008 * props.drift
    const tx = state.pointer.y * 0.06 * props.drift
    const ty = state.pointer.x * 0.1 * props.drift
    ref.current.rotation.x += (tx - ref.current.rotation.x) * 0.02
    ref.current.rotation.z += (ty - ref.current.rotation.z) * 0.02
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={tex}
        size={props.size}
        sizeAttenuation
        vertexColors
        transparent
        opacity={props.opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// Two layers: a dense, faint, far starfield and a sparser, larger, tinted dust
// closer to the camera — parallax between them reads as real depth.
export default function ParticleField({ count = 1400 }: { count?: number }) {
  const starTint = useMemo(
    () => [new THREE.Color("#ffffff"), new THREE.Color("#cbd5ff"), new THREE.Color("#fbcfe8")],
    [],
  )
  const dustTint = useMemo(
    () => [new THREE.Color("#e879f9"), new THREE.Color("#22d3ee"), new THREE.Color("#a78bfa")],
    [],
  )

  return (
    <>
      <Layer count={count} size={0.06} spread={44} depth={40} tint={starTint} opacity={0.9} drift={0.6} />
      <Layer
        count={Math.round(count * 0.28)}
        size={0.22}
        spread={30}
        depth={34}
        tint={dustTint}
        opacity={0.35}
        drift={1.6}
      />
    </>
  )
}
