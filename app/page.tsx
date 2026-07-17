import Header from "@/components/header"
import Summary from "@/components/summary"
import Experience from "@/components/experience"
import Education from "@/components/education"
import Skills from "@/components/skills"
import Certifications from "@/components/certifications"
import Awards from "@/components/awards"
import Projects from "@/components/projects"
import MoreProjects from "@/components/more-projects"
import Hero from "@/components/hero"
import Contact from "@/components/contact"
import SmoothScrollProvider from "@/components/scroll/smooth-scroll-provider"
import Reveal from "@/components/scroll/reveal"
import StatsStrip from "@/components/stats-strip"

export default function Home() {
  return (
    <SmoothScrollProvider>
      <main className="min-h-screen text-foreground">
        <Header />
        <section id="hero" aria-label="Hero">
          <Hero />
        </section>

        <StatsStrip />

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <Reveal>
                <section id="summary" aria-label="Professional Summary">
                  <Summary />
                </section>
              </Reveal>
              <Reveal>
                <section id="experience" aria-label="Professional Experience">
                  <Experience />
                </section>
              </Reveal>
              <Reveal>
                <section id="projects" aria-label="Featured Projects">
                  <Projects />
                </section>
              </Reveal>
              <Reveal>
                <section id="more-projects" aria-label="More Projects">
                  <MoreProjects />
                </section>
              </Reveal>
              <Reveal>
                <section id="contact" aria-label="Contact">
                  <Contact />
                </section>
              </Reveal>
            </div>
            <div>
              <Reveal delay={0.05}>
                <section id="education" aria-label="Education">
                  <Education />
                </section>
              </Reveal>
              <Reveal delay={0.05}>
                <section id="skills" aria-label="Skills">
                  <Skills />
                </section>
              </Reveal>
              <Reveal delay={0.05}>
                <section id="certifications" aria-label="Certifications">
                  <Certifications />
                </section>
              </Reveal>
              <Reveal delay={0.05}>
                <section id="awards" aria-label="Awards & Achievements">
                  <Awards />
                </section>
              </Reveal>
            </div>
          </div>
        </div>
      </main>
    </SmoothScrollProvider>
  )
}
