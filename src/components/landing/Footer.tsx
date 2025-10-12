import { MapPin, Phone, Mail } from "lucide-react"
import logo from '../../../public/logo.webp'

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-primary/20">
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-8 sm:mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ">
              <img src={logo} alt="Logo" className="w-10 h-10 sm:w-14 " />    
            </div>
            <span className="text-lg sm:text-2xl font-bold text-foreground flex items-center gap-1">
              MARI <span className="text-primary">BARBERSHOP</span>
            </span>
          </div>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
              La barbería premium donde el estilo y la tradición se encuentran.
            </p>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold text-foreground mb-4 sm:mb-6">Enlaces Rápidos</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a
                  href="#inicio"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base"
                >
                  Inicio
                </a>
              </li>
              <li>
                <a
                  href="#servicios"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base"
                >
                  Servicios
                </a>
              </li>
              <li>
                <a
                  href="#galeria"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base"
                >
                  Galería
                </a>
              </li>
              <li>
                <a
                  href="#reservar"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base"
                >
                  Reservar
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold text-foreground mb-4 sm:mb-6">Horarios</h3>
            <ul className="space-y-2 sm:space-y-3 text-muted-foreground text-sm sm:text-base">
              <li>Lunes - Viernes: 9:00 AM - 8:00 PM</li>
              <li>Sábado: 9:00 AM - 7:00 PM</li>
              <li>Domingo: Cerrado</li>
            </ul>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold text-foreground mb-4 sm:mb-6">Contacto</h3>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-1" />
                <span className="text-muted-foreground text-sm sm:text-base">
                  Av. Principal 123, Buenos Aires, Argentina
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground text-sm sm:text-base">+54 11 1234-5678</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground text-sm sm:text-base">info@elitebarber.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 sm:pt-8 border-t border-primary/20 text-center text-muted-foreground text-sm sm:text-base">
          <p>&copy; 2025 Mari Barbershop. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
