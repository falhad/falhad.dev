"use client"

import { useRef, type MutableRefObject } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

type Props = {
  target: [number, number, number] | null
  reducedMotion?: boolean
  // 0..1 scroll progress through the pinned hero. Drives the fly-through when
  // nothing is selected. Null/absent => camera rests at the home framing.
  progressRef?: MutableRefObject<number>
}

const HOME = new THREE.Vector3(0, 0, 9)
const ORIGIN = new THREE.Vector3(0, 0, 0)

// Camera z travels from the present (near) to the deep past as you scroll.
const Z_NEAR = 10.5
const Z_FAR = -17

// Unifies two camera drivers:
//  - scroll progress flies the camera down the timeline corridor, and
//  - selecting a node overrides that to frame the chosen chapter.
// Closing the panel (target -> null) eases back to the current scroll position.
export default function CameraRig({ target, reducedMotion = false, progressRef }: Props) {
  const lookAt = useRef(new THREE.Vector3(0, 0, 0))
  const desiredPos = useRef(new THREE.Vector3())
  const desiredLook = useRef(new THREE.Vector3())

  useFrame((state, delta) => {
    if (target) {
      // Frame the selected node: sit partway toward it, pulled in along +z.
      const [x, y, z] = target
      desiredPos.current.set(x * 0.55, y * 0.55, z + 5)
      desiredLook.current.set(x, y, z)
    } else if (progressRef) {
      // Fly-through driven by scroll.
      const p = progressRef.current
      const camZ = THREE.MathUtils.lerp(Z_NEAR, Z_FAR, p)
      const sway = Math.sin(p * Math.PI) * 0.8
      desiredPos.current.set(sway, 0.4, camZ)
      desiredLook.current.set(sway * 0.4, 0.2, camZ - 6)
    } else {
      desiredPos.current.copy(HOME)
      desiredLook.current.copy(ORIGIN)
    }

    // Frame-rate independent easing; snap instantly under reduced motion.
    const t = reducedMotion ? 1 : 1 - Math.pow(0.0016, delta)
    state.camera.position.lerp(desiredPos.current, t)
    lookAt.current.lerp(desiredLook.current, t)
    state.camera.lookAt(lookAt.current)
  })

  return null
}
