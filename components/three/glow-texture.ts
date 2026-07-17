import * as THREE from "three"

// A soft radial-gradient sprite: white core fading to transparent. Used for
// star glows and round dust points so nothing renders as a hard-edged square.
// Called client-side only (needs a <canvas>).
export function makeGlowTexture(size = 128): THREE.Texture {
  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = size
  const ctx = canvas.getContext("2d")!
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0.0, "rgba(255,255,255,1)")
  g.addColorStop(0.18, "rgba(255,255,255,0.9)")
  g.addColorStop(0.45, "rgba(255,255,255,0.28)")
  g.addColorStop(1.0, "rgba(255,255,255,0)")
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}
