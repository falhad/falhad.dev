import Header from "@/components/header"
import Summary from "@/components/summary"
import Experience from "@/components/experience"
import Education from "@/components/education"
import Skills from "@/components/skills"
import Certifications from "@/components/certifications"
import Awards from "@/components/awards"
import Projects from "@/components/projects"
import Hero from "@/components/hero"
import Resume from "@/components/resume"
import Contact from "@/components/contact"

export default function Home() {
  return (
    <main className="min-h-screen text-foreground">
      <Header />
      <section id="hero" aria-label="Hero">
        <Hero />
      </section>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <section id="summary" aria-label="Professional Summary">
              <Summary />
            </section>
            <section id="experience" aria-label="Professional Experience">
              <Experience />
            </section>
            {/*<section id="projects" aria-label="Featured Projects">*/}
            {/*  <Projects />*/}
            {/*</section>*/}
            {/*<section id="resume" aria-label="Resume">*/}
            {/*  <Resume />*/}
            {/*</section>*/}
            <section id="contact" aria-label="Contact">
              <Contact />
            </section>
          </div>
          <div>
            <section id="education" aria-label="Education">
              <Education />
            </section>
            <section id="skills" aria-label="Skills">
              <Skills />
            </section>
            <section id="certifications" aria-label="Certifications">
              <Certifications />
            </section>
            <section id="awards" aria-label="Awards & Achievements">
              <Awards />
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}

