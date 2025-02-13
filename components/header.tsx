import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <Card className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <CardContent className="flex flex-col md:flex-row items-center p-6">
        <Avatar className="w-32 h-32 mb-4 md:mb-0 md:mr-6 border-4 border-white">
          <AvatarImage
            src="https://storage.rxresu.me/cm3e7oe3l00mgdbpo4c2nq7yn/pictures/cm3e7oe3l00mgdbpo4c2nq7yn.jpg"
            alt="Farhad Navayazdan"
          />
          <AvatarFallback>FN</AvatarFallback>
        </Avatar>
        <div className="text-center md:text-left flex-grow">
          <h1 className="text-4xl font-bold mb-2">Farhad Navayazdan</h1>
          <p className="text-xl mb-4">Senior Software Developer</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
            <Button variant="outline" size="sm" className="bg-white/10 hover:bg-white/20">
              <Mail className="w-4 h-4 mr-2" />
              <a href="mailto:cs.arcxx@gmail.com">Email</a>
            </Button>
            <Button variant="outline" size="sm" className="bg-white/10 hover:bg-white/20">
              <Phone className="w-4 h-4 mr-2" />
              <span>(968) 90130747</span>
            </Button>
            <Button variant="outline" size="sm" className="bg-white/10 hover:bg-white/20">
              <MapPin className="w-4 h-4 mr-2" />
              <span>Oman, Muscat</span>
            </Button>
          </div>
          <div className="flex justify-center md:justify-start gap-4">
            <a href="https://www.linkedin.com/in/farhadnava/" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="icon" className="bg-white/10 hover:bg-white/20">
                <Linkedin className="w-4 h-4" />
              </Button>
            </a>
            <a href="https://github.com/falhad" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="icon" className="bg-white/10 hover:bg-white/20">
                <Github className="w-4 h-4" />
              </Button>
            </a>
            <a href="https://falhad.dev" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="icon" className="bg-white/10 hover:bg-white/20">
                <Globe className="w-4 h-4" />
              </Button>
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

