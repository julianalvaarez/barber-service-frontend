import logo from '../../../public/logo.webp'
import { useState } from 'react'
import { Menu, X, Scissors } from "lucide-react"
import { Link } from 'react-router-dom'
import { ModeToggle } from '../mode-toggle'

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/98 backdrop-blur-md border-b border-primary/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ">
              <img src={logo} alt="Logo" className="w-10 h-10 sm:w-14 " />    
            </div>
            <Link to="/#inicio" className="text-lg sm:text-2xl font-bold text-foreground flex items-center gap-1">
              MARI <span className="text-primary">BARBERSHOP</span>
              <Scissors className="w-6 h-6 text-primary rounded" />
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <a href="#inicio" className="text-foreground hover:text-primary transition-colors font-medium">
              Inicio
            </a>
            <a href="#servicios" className="text-foreground hover:text-primary transition-colors font-medium">
              Servicios
            </a>
            <a href="#galeria" className="text-foreground hover:text-primary transition-colors font-medium">
              Galería
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <a href='#reservar' className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-lg shadow-primary/20 py-2 px-4">
              Reservar Turno
            </a>
          <div ><ModeToggle /></div>
          </div>
          <button className="md:hidden text-primary" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-primary/20 bg-card/50 backdrop-blur-sm">
            <nav className="flex flex-col gap-4">
              <a
                href="#inicio"
                className="text-foreground hover:text-primary transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </a>
              <a
                href="#servicios"
                className="text-foreground hover:text-primary transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Servicios
              </a>
              <a
                href="#galeria"
                className="text-foreground hover:text-primary transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Galería
              </a>
              <a href='#reservar' onClick={() => setIsMenuOpen(false)} className="bg-primary text-primary-foreground hover:bg-primary/90 w-full mt-2 font-bold shadow-lg shadow-primary/20 py-2 px-4 text-center">
                Reservar Turno
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
)
}