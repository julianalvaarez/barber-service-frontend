import { Scissors, Sparkles, Radar as Razor, Shirt } from "lucide-react"
import type { ServicesBarber } from "../../types"




export const Services = () => {

  const servicesBarber = [
  {
    icon: Scissors,
    title: "Corte Clásico",
    description: "Cortes tradicionales con técnicas modernas para un look atemporal.",
    price: 10000,
  },
  {
    icon: Sparkles,
    title: "Corte + Barba",
    description: "Corte + afeitado con navaja, toallas calientes y productos premium.",
    price: 12000,
  },
  {
    icon: Razor,
    title: "Mechas y Color",
    description: "Transforma tu estilo con mechas, tintes y tratamientos de color personalizados.",
    price: 30000,
  },
  {
    icon: Shirt,
    title: "Color Global",
    description: "Tinte completo para un cambio de look radical o para cubrir canas.",
    price: 45000,
  },
]
  return (
    <>
    <section id="servicios" className="py-16 sm:py-20 md:py-24 ">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-primary text-xs sm:text-sm font-bold tracking-wider uppercase">Nuestros Servicios</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-3 mb-4 text-balance">
            Lo que hacemos mejor
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Servicios profesionales para tu estilo personal
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {servicesBarber.map((service: ServicesBarber, index: number) => (
            <div
              key={index}
              className="bg-card border hover:border-primary transition-all duration-300 group cursor-pointer hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="p-6 sm:p-8">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-primary transition-colors">
                  <service.icon className="w-7 h-7 sm:w-8 sm:h-8 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2 sm:mb-3">{service.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
                  {service.description}
                </p>
                <div className="text-2xl sm:text-3xl font-bold text-primary">${service.price.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>        
    </>
  )
}
