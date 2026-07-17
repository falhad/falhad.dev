import SmoothScrollProvider from "@/components/scroll/smooth-scroll-provider"
import Cursor from "@/components/motion/cursor"
import Hero from "@/components/hero"
import Desktop from "@/components/os/desktop"

export default function Home() {
  return (
    <SmoothScrollProvider>
      <Cursor />
      <main className="relative z-10 text-foreground">
        <Hero />
        <Desktop />
      </main>
    </SmoothScrollProvider>
  )
}
