"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { profile } from "@/lib/portfolio-data"

const navItems = [
  { id: "summary", label: "brief" },
  { id: "experience", label: "log" },
  { id: "projects", label: "builds" },
  { id: "skills", label: "skills" },
  { id: "contact", label: "channel" },
]

export default function Header() {
  const [active, setActive] = useState<string>("summary")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0.01 },
    )
    navItems.forEach((item) => {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#05010f]/70 backdrop-blur supports-[backdrop-filter]:bg-[#05010f]/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-white/15">
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback>FN</AvatarFallback>
            </Avatar>
            <div className="leading-tight">
              <p className="font-display text-sm font-semibold text-foreground">{profile.name}</p>
              <p className="mono flex items-center gap-1.5 text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                <span className="live-dot inline-block h-1 w-1 rounded-full bg-signal text-signal" aria-hidden />
                {profile.title}
              </p>
            </div>
          </div>

          <nav className="mono hidden items-center gap-6 text-xs uppercase tracking-widest md:flex">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`transition-colors ${
                  active === item.id ? "text-plasma" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="text-muted-foreground/40">/</span>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <span className="mono hidden text-[0.6rem] uppercase tracking-widest text-muted-foreground lg:inline">
              {profile.location}
            </span>
            <Button
              asChild
              size="sm"
              className="mono rounded-md border border-plasma/40 bg-plasma/10 text-xs uppercase tracking-widest text-plasma hover:bg-plasma/20"
            >
              <a href={`mailto:${profile.email}?subject=Hello%20Farhad`} aria-label="Contact Farhad">
                <Mail className="mr-1.5 h-3.5 w-3.5" /> contact
              </a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
