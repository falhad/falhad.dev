"use client"

import { useRef, type MutableRefObject } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

type Vec3 = [number, number, number]

type Props = {
  /** Explicitly framed planet (from a click); overrides scroll. */
  target: Vec3 | null
  /** All planet positions, in scroll order. */
  planets: Vec3[]
  reducedMotion?: boolean
  /** 0..1 scroll progress; snaps the camera planet-by-planet. */
  progressRef?: MutableRefObject<number>
}

const OVERVIEW_POS = new THREE.Vector3(0, 0.4, 11)
const OVERVIEW_LOOK = new THREE.Vector3(0, 0, -3)
const HOME = new THREE.Vector3(0, 0, 9)
const ORIGIN = new THREE.Vector3(0, 0, 0)

// Frame a planet: sit partway toward it, pulled in along +z so it fills center
// while its neighbours stay visible for context.
function frame(v: Vec3, pos: THREE.Vector3, look: THREE.Vector3) {
  pos.set(v[0] * 0.55, v[1] * 0.55, v[2] + 5)
  look.set(v[0], v[1], v[2])
}

export default function CameraRig({ target, planets, reducedMotion = false, progressRef }: Props) {
  const lookAt = useRef(new THREE.Vector3(0, 0, 0))
  const desiredPos = useRef(new THREE.Vector3())
  const desiredLook = useRef(new THREE.Vector3())

  useFrame((state, delta) => {
    if (target) {
      frame(target, desiredPos.current, desiredLook.current)
    } else if (progressRef && planets.length) {
      const p = progressRef.current
      if (p < 0.04) {
        // brief galaxy overview before you start scrolling
        desiredPos.current.copy(OVERVIEW_POS)
        desiredLook.current.copy(OVERVIEW_LOOK)
      } else {
        const i = Math.round(p * (planets.length - 1))
        frame(planets[Math.min(i, planets.length - 1)], desiredPos.current, desiredLook.current)
      }
    } else {
      desiredPos.current.copy(HOME)
      desiredLook.current.copy(ORIGIN)
    }

    const t = reducedMotion ? 1 : 1 - Math.pow(0.0018, delta)
    state.camera.position.lerp(desiredPos.current, t)
    lookAt.current.lerp(desiredLook.current, t)
    state.camera.lookAt(lookAt.current)
  })

  return null
}
