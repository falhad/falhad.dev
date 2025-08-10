'use client'

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Linkedin, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

const navItems = [
  { id: "summary", label: "Summary" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "resume", label: "Resume" },
  { id: "contact", label: "Contact" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "awards", label: "Awards" },
]

export default function Header() {
  const [active, setActive] = useState<string>("summary")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
          }
        })
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0.01 }
    )

    navItems.forEach((item) => {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur supports-[backdrop-filter]:bg-background/70 bg-background/70 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-border">
              <AvatarImage
                src="https://storage.rxresu.me/cm3e7oe3l00mgdbpo4c2nq7yn/pictures/cm3e7oe3l00mgdbpo4c2nq7yn.jpg"
                alt="Farhad Navayazdan"
              />
              <AvatarFallback>FN</AvatarFallback>
            </Avatar>
            <div className="leading-tight">
              <p className="text-sm font-semibold">Farhad Navayazdan</p>
              <p className="text-xs text-foreground/60">Senior Software Developer</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`transition-colors ${
                  active === item.id
                    ? 'text-foreground font-medium'
                    : 'text-foreground/70 hover:text-foreground'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild size="sm" className="rounded-full bg-gradient-to-r from-fuchsia-600 to-cyan-600 hover:from-fuchsia-500 hover:to-cyan-500">
              <a href="mailto:cs.arcxx@gmail.com?subject=Hello%20Farhad&body=Hi%20Farhad%2C%0A%0A" aria-label="Contact Farhad via email">
                <Mail className="mr-2 h-4 w-4" /> Contact
              </a>
            </Button>
            <Button asChild variant="outline" size="icon" className="hidden sm:inline-flex">
              <a href="https://www.linkedin.com/in/farhadnava/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="outline" size="icon" className="hidden sm:inline-flex">
              <a href="https://github.com/falhad" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <Github className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

