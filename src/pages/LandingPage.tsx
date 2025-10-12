import { Services } from '../components/landing/Services'
import { Booking } from '../components/landing/Booking'
import { ArrowRight, Star    } from "lucide-react"
import { Gallery } from '../components/landing/Gallery'



export default function LandingPage() {

  return (
    <div >
    <section id="inicio" className="relative min-h-screen flex items-center pt-20 px-4">
      <div className="absolute inset-0 z-0">
        <img
          src="/modern-barbershop-interior-dark-moody-professional.jpg"
          alt="Barbershop"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
      </div>

      <div className="container mx-auto relative z-10 max-w-4xl">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-6 bg-primary/10 border border-primary/30 px-4 py-2 rounded-full">
            <Star className="w-4 h-4 text-primary fill-primary" />
            <span className="text-primary text-sm font-bold tracking-wide uppercase">Barbería Premium</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 leading-tight text-balance">
            Estilo y elegancia
            <span className="block text-primary mt-2">en cada corte</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed text-pretty max-w-2xl mx-auto">
            Transformamos tu look con cortes precisos y un servicio excepcional. Tu mejor versión comienza aquí.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12">
            <a href="#reservar"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-base sm:text-lg px-6 py-4 h-auto shadow-lg shadow-primary/20  flex items-center justify-center"
            >
              Reservar Turno
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
            {/* <button
              className="font-semibold text-base sm:text-lg px-6 py-4 h-auto border-2 border-primary/50 text-foreground hover:bg-primary/10 bg-transparent"
            >
              Ver Galería
            </button> */}
          </div>

          <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-8 border-t border-border/50 max-w-xl mx-auto">
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1">+5</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Años</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1">3</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Sucursales</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1">5</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Profesionales</div>
            </div>
          </div>
        </div>
      </div>
    </section>

      {/* <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {services.map((s) => (
          <ServiceCard key={s.id} service={s} />
        ))}
      </section> */}

      {/* <section>
        <h2 className="text-xl font-semibold mb-2">Galería</h2>
        <Gallery images={sampleImages} />
      </section> */}

      {/* <div className="text-center">
        <Link
          to="/book"
          className="px-4 py-2 bg-blue-600 text-white rounded shadow"
        >
          Reservar ahora
        </Link>
      </div> */}
    <Services />
    <Gallery />
    <Booking />
    </div>
  )
}
