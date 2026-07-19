"use client"
import { useEffect } from "react"
import { MODEL_URLS } from "@/lib/models"
import { preloadClips } from "@/lib/sound"

// Warms the HTTP cache with the 3D models the moment the site loads — while the
// retro "2011" overlay is still up. By the time the visitor fast-forwards and
// the WebGL scene calls useGLTF, the .glb bytes are already cached, so the desk
// pops in with no download wait.
//
// We use <link rel="prefetch"> (browser-scheduled, idle priority) rather than a
// blocking fetch, so warming the models never competes with rendering the page.
// Skipped for reduced-motion users, who get the static fallback (no 3D at all).
export default function ModelPreload() {
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return

    const links: HTMLLinkElement[] = []
    for (const href of MODEL_URLS) {
      // Don't double-prefetch across client re-mounts.
      if (document.querySelector(`link[data-model-prefetch][href="${href}"]`)) continue
      const link = document.createElement("link")
      link.rel = "prefetch"
      link.as = "fetch"
      link.href = href
      link.crossOrigin = "anonymous"
      link.setAttribute("data-model-prefetch", "")
      document.head.appendChild(link)
      links.push(link)
    }
    // Warm the audio clips too, so tapping a desk object plays instantly rather
    // than waiting on a download. This only fetches bytes — decoding needs an
    // AudioContext and happens on first play, inside a user gesture.
    // Deferred to idle so it never competes with the models or first paint.
    const idle =
      window.requestIdleCallback?.(() => preloadClips(), { timeout: 4000 }) ??
      window.setTimeout(() => preloadClips(), 1200)

    return () => {
      links.forEach((l) => l.remove())
      if (window.cancelIdleCallback && typeof idle === "number") window.cancelIdleCallback(idle)
      else clearTimeout(idle as number)
    }
  }, [])

  return null
}
