import SmoothScrollProvider from "@/components/scroll/smooth-scroll-provider"
import Cursor from "@/components/motion/cursor"
import Hero from "@/components/hero"
import Desktop from "@/components/os/desktop"
import RetroIntro from "@/components/retro/retro-intro"
import ModelPreload from "@/components/three/model-preload"

export default function Home() {
  return (
    <SmoothScrollProvider>
      {/* Warm the 3D models into cache during the retro intro, so the desk is
          ready the instant the visitor fast-forwards to the present. */}
      <ModelPreload />
      <Cursor />
      <main className="relative z-10 text-foreground">
        <Hero />
        <Desktop />
      </main>
      <RetroIntro />
    </SmoothScrollProvider>
  )
}
