"use client"

import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing"

// Real HDR bloom is the single biggest realism lever — emissive star cores blow
// out into soft light instead of the old fake additive halos. Vignette focuses
// the eye toward the center of the scene.
export default function Effects({ reducedMotion = false }: { reducedMotion?: boolean }) {
  return (
    <EffectComposer multisampling={reducedMotion ? 0 : 4}>
      <Bloom
        intensity={reducedMotion ? 0.55 : 0.9}
        luminanceThreshold={0.22}
        luminanceSmoothing={0.9}
        mipmapBlur
        radius={0.7}
      />
      <Vignette offset={0.25} darkness={0.85} eskil={false} />
    </EffectComposer>
  )
}
