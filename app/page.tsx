import SmoothScrollProvider from "@/components/scroll/smooth-scroll-provider"
import Cursor from "@/components/motion/cursor"
import Menu from "@/components/menu"
import Scene from "@/components/three/scene"
import Hero from "@/components/hero"
import Statement from "@/components/statement"
import Work from "@/components/work"
import Capabilities from "@/components/capabilities"
import Journey from "@/components/journey"
import Recognition from "@/components/recognition"
import Contact from "@/components/contact"

export default function Home() {
  return (
    <SmoothScrollProvider>
      <Cursor />
      <Menu />
      {/* The persistent 3D protagonist lives behind everything (fixed, z-0). */}
      <Scene />
      <main className="relative z-10 min-h-screen text-foreground">
        <Hero />
        <Statement />
        <Work />
        <Capabilities />
        <Journey />
        <Recognition />
        <Contact />
      </main>
    </SmoothScrollProvider>
  )
}
