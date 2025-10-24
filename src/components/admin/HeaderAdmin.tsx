import logo from '../../../public/logo.webp'
import { Menu, X, Settings, User } from "lucide-react"
import { Link } from 'react-router-dom'
import { ModeToggle } from '../mode-toggle'
import { useState } from 'react'

export const HeaderAdmin = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false) 

  return (
    <>
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/98 backdrop-blur-md border-b border-primary/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ">
              <img src={logo} alt="Logo" className="w-10 h-10 sm:w-14 " />    
            </div>
            <Link to="/admin" className="text-lg sm:text-2xl font-bold text-foreground flex items-center gap-1">
              MARI <span className="text-primary">BARBERSHOP</span>
              <User size={30} />
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link to="/admin" className="text-foreground hover:text-primary transition-colors font-medium">
              Agenda
            </Link>
            <Link to="/admin/monthlyBalance" className="text-foreground hover:text-primary transition-colors font-medium">
              Estadisticas
            </Link>

          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/admin/settings" className="text-foreground hover:text-primary transition-colors font-medium">
              <Settings />
            </Link>
          <div ><ModeToggle /></div>
          </div>
          <div className="flex md:hidden items-center gap-4">
            <div ><ModeToggle /></div>          
            <button className=" text-primary" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>  
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-primary/20 bg-card/50 backdrop-blur-sm">
            <nav className="flex flex-col gap-4">
              <Link
                to="/admin"
                className="text-foreground hover:text-primary transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link
                to="/admin/monthlyBalance"
                className="text-foreground hover:text-primary transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Estadisticas
              </Link>

              <Link to='/admin/settings' onClick={() => setIsMenuOpen(false)}  >
                <Settings size={20} strokeWidth={1.10}  className='border rounded bg-card p-2 w-11 h-11'  />
              </Link>

            </nav>
          </div>
        )}
      </div>
    </header>        
    </>
  )
}
