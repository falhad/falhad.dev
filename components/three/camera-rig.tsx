"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

type Props = {
  target: [number, number, number] | null
  reducedMotion?: boolean
}

const HOME = new THREE.Vector3(0, 0, 9)
const ORIGIN = new THREE.Vector3(0, 0, 0)

// Eases the camera toward a selected node (and back to home on deselect).
// Runs inside <Canvas>, so it can grab the live camera via useFrame's state.
export default function CameraRig({ target, reducedMotion = false }: Props) {
  const lookAt = useRef(new THREE.Vector3(0, 0, 0))
  const desiredPos = useRef(new THREE.Vector3())
  const desiredLook = useRef(new THREE.Vector3())

  useFrame((state, delta) => {
    if (target) {
      const [x, y, z] = target
      // Sit partway between home and the node, pulled in along +z to frame it.
      desiredPos.current.set(x * 0.55, y * 0.55, z + 5)
      desiredLook.current.set(x, y, z)
    } else {
      desiredPos.current.copy(HOME)
      desiredLook.current.copy(ORIGIN)
    }

    // Frame-rate independent easing. Snap instantly when reduced motion is on.
    const t = reducedMotion ? 1 : 1 - Math.pow(0.0015, delta)
    state.camera.position.lerp(desiredPos.current, t)
    lookAt.current.lerp(desiredLook.current, t)
    state.camera.lookAt(lookAt.current)
  })

  return null
}
