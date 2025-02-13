import Header from "@/components/header"
import Summary from "@/components/summary"
import Experience from "@/components/experience"
import Education from "@/components/education"
import Skills from "@/components/skills"
import Certifications from "@/components/certifications"
import Awards from "@/components/awards"
import Projects from "@/components/projects"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <Header />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Summary />
            <Experience />
            <Projects />
          </div>
          <div>
            <Education />
            <Skills />
            <Certifications />
            <Awards />
          </div>
        </div>
      </div>
    </main>
  )
}

