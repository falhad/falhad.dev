import SmoothScrollProvider from "@/components/scroll/smooth-scroll-provider"
import Cursor from "@/components/motion/cursor"
import Hero from "@/components/hero"
import Desktop from "@/components/os/desktop"
import RetroIntro from "@/components/retro/retro-intro"

export default function Home() {
  return (
    <SmoothScrollProvider>
      <Cursor />
      <main className="relative z-10 text-foreground">
        <Hero />
        <Desktop />
      </main>
      <RetroIntro />
    </SmoothScrollProvider>
  )
}
