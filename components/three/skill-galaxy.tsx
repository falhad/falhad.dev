"use client"

import { useMemo, useRef, useState, type MutableRefObject } from "react"
import { useFrame } from "@react-three/fiber"
import { Float, Html, Line } from "@react-three/drei"
import * as THREE from "three"
import type { SkillPlanet } from "@/lib/portfolio-data"
import { skillPlanets, profile } from "@/lib/portfolio-data"
import { makeGlowTexture } from "./glow-texture"

const N = skillPlanets.length
const R = 4.2 // orbit radius
// A shallow tilt reads as a 3D orbit seen from the FRONT: the near arc dips low
// and close, the far arc rises behind the sun. (Near 0 = edge-on; ~1.5 = top-down.)
const TILT = 0.62
const SUN: [number, number, number] = [0, 3.5, -4]
// planet i sits at this base angle; i=0 starts at the front focus (sin = 1)
const baseAngle = (i: number) => Math.PI / 2 + (i / N) * Math.PI * 2
// scroll progress -> orbit spin (advances one planet to focus per 1/N of scroll)
const spinForProgress = (p: number) => -p * Math.PI * 2 * ((N - 1) / N)

type PlanetProps = {
  planet: SkillPlanet
  angle: number
  spinRef: MutableRefObject<number>
  onSelect: (p: SkillPlanet) => void
  selected: boolean
  anySelected: boolean
  glowTex: THREE.Texture
}

function Planet({ planet, angle, spinRef, onSelect, selected, anySelected, glowTex }: PlanetProps) {
  const core = useRef<THREE.Mesh>(null)
  const glow = useRef<THREE.Sprite>(null)
  const label = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const color = useMemo(() => new THREE.Color(planet.color), [planet.color])
  const pos = useMemo<[number, number, number]>(
    () => [R * Math.cos(angle), 0, R * Math.sin(angle)],
    [angle],
  )

  useFrame((state) => {
    // sin(current angle) == 1 when this planet is at the front focus.
    const focus = Math.sin(angle + spinRef.current) // -1..1
    const f01 = (focus + 1) / 2
    const emphasized = selected || hovered
    const dim = anySelected && !selected

    const scale = (0.74 + f01 * 0.42) * (emphasized ? 1.15 : 1)
    if (core.current) {
      core.current.scale.setScalar(THREE.MathUtils.lerp(core.current.scale.x, scale, 0.15))
      const mat = core.current.material as THREE.MeshStandardMaterial
      // Keep emissive modest so the bloom pass doesn't wash the colour to white.
      const target = (1.15 + f01 * 1.05) * (emphasized ? 1.25 : 1) * (dim ? 0.45 : 1)
      mat.emissiveIntensity += (target - mat.emissiveIntensity) * 0.12
    }
    if (glow.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2 + angle) * 0.05
      const g = scale * (2.1 + f01 * 1.1) * pulse * (dim ? 0.6 : 1)
      const next = THREE.MathUtils.lerp(glow.current.scale.x, g, 0.12)
      glow.current.scale.set(next, next, 1)
      const gm = glow.current.material as THREE.SpriteMaterial
      gm.opacity += ((0.42 + f01 * 0.32) * (dim ? 0.4 : 1) - gm.opacity) * 0.12
    }
    if (label.current) {
      const o = emphasized ? 1 : dim ? 0.18 : Math.max(0.2, f01 * f01)
      label.current.style.opacity = String(o)
      label.current.style.transform = `scale(${0.85 + f01 * 0.2})`
    }
  })

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5} position={pos}>
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
            opacity={0.6}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
        <mesh ref={core}>
          <sphereGeometry args={[0.32, 32, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={2}
            roughness={0.35}
            metalness={0.1}
            toneMapped={false}
          />
        </mesh>
        <mesh visible={false}>
          <sphereGeometry args={[0.85, 8, 8]} />
        </mesh>

        <Html center distanceFactor={9} position={[0, 1.1, 0]} style={{ pointerEvents: "none" }}>
          <div ref={label} className="select-none whitespace-nowrap" style={{ transition: "opacity .25s" }}>
            <div className="rounded-md border border-white/15 bg-black/60 px-3 py-1.5 text-center shadow-[0_8px_24px_-6px_rgba(0,0,0,0.9)] backdrop-blur-md">
              <div className="mono text-[8px] uppercase tracking-[0.2em]" style={{ color: planet.color }}>
                {planet.code}
              </div>
              <div className="font-display text-[13px] font-semibold leading-tight text-white">{planet.name}</div>
              <div
                className="mono mt-1 text-[8px] uppercase leading-none tracking-widest"
                style={{ color: planet.color }}
              >
                ▸ click for work
              </div>
            </div>
          </div>
        </Html>
      </group>
    </Float>
  )
}

function Sun({ glowTex }: { glowTex: THREE.Texture }) {
  const core = useRef<THREE.Mesh>(null)
  const glow = useRef<THREE.Sprite>(null)
  useFrame((state) => {
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.2) * 0.04
    if (core.current) core.current.scale.setScalar(pulse)
    if (glow.current) glow.current.scale.setScalar(4.3 * pulse)
  })
  return (
    <group position={SUN}>
      <sprite ref={glow}>
        <spriteMaterial map={glowTex} color="#ffe6a8" transparent opacity={0.65} depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
      <mesh ref={core}>
        <sphereGeometry args={[0.6, 48, 48]} />
        <meshStandardMaterial color="#fff6d8" emissive="#ffcf72" emissiveIntensity={2.2} toneMapped={false} />
      </mesh>
      <pointLight color="#ffdca0" intensity={20} distance={30} />
      <Html center distanceFactor={11} position={[0, 1.5, 0]} style={{ pointerEvents: "none" }}>
        <div className="select-none whitespace-nowrap text-center">
          <div className="mono text-[9px] uppercase tracking-[0.3em] text-amber-200/80">OPERATOR CORE</div>
          <div className="font-display text-sm font-bold text-white">{profile.name}</div>
        </div>
      </Html>
    </group>
  )
}

function OrbitRing() {
  const pts = useMemo(() => {
    const arr: [number, number, number][] = []
    for (let i = 0; i <= 96; i++) {
      const a = (i / 96) * Math.PI * 2
      arr.push([R * Math.cos(a), 0, R * Math.sin(a)])
    }
    return arr
  }, [])
  return (
    <group position={SUN} rotation={[TILT, 0, 0]}>
      <Line points={pts} color="#a855f7" lineWidth={1} transparent opacity={0.2} dashed dashScale={4} />
    </group>
  )
}

type Props = {
  onSelect: (p: SkillPlanet) => void
  selectedName: string | null
  progressRef?: MutableRefObject<number>
}

export default function SkillGalaxy({ onSelect, selectedName, progressRef }: Props) {
  const root = useRef<THREE.Group>(null)
  const orbit = useRef<THREE.Group>(null)
  const spinRef = useRef(0)
  const glowTex = useMemo(() => makeGlowTexture(128), [])

  useFrame((state) => {
    // Smoothly ease the orbit toward the scroll-driven spin.
    const target = spinForProgress(progressRef ? progressRef.current : 0)
    spinRef.current = THREE.MathUtils.lerp(spinRef.current, target, 0.08)
    if (orbit.current) orbit.current.rotation.set(TILT, spinRef.current, 0)
    if (root.current) {
      root.current.rotation.y += (state.pointer.x * 0.06 - root.current.rotation.y) * 0.03
      root.current.rotation.x += (-state.pointer.y * 0.04 - root.current.rotation.x) * 0.03
    }
  })

  return (
    <group ref={root}>
      <Sun glowTex={glowTex} />
      <OrbitRing />
      <group ref={orbit} position={SUN} rotation={[TILT, 0, 0]}>
        {skillPlanets.map((planet, i) => (
          <Planet
            key={planet.name}
            planet={planet}
            angle={baseAngle(i)}
            spinRef={spinRef}
            onSelect={onSelect}
            selected={selectedName === planet.name}
            anySelected={selectedName !== null}
            glowTex={glowTex}
          />
        ))}
      </group>
    </group>
  )
}
