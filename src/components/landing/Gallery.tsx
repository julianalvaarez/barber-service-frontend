import { useState } from "react"

const galleryImages = [
  {
    url: "/corte1.jpg",
    title: "Fade Moderno",
    category: "Luis",
  },
  {
    url: "/corte2.jpg",
    title: "Pompadour Clásico",
    category: "Luis",
  },
  {
    url: "/corte3.jpg",
    title: "Arreglo de Barba",
    category: "Pedro",
  },
  {
    url: "/corte4.jpg",
    title: "Undercut",
    category: "Luis",
  },
  {
    url: "/corte5.jpg",
    title: "Afeitado Tradicional",
    category: "Juan",
  },
  {
    url: "/textured-crop-haircut.jpg",
    title: "Crop Texturizado",
    category: "Luis",
  },
  {
    url: "/styled-beard-grooming.jpg",
    title: "Barba Estilizada",
    category: "Juan",
  },
  {
    url: "/slick-back-hairstyle.jpg",
    title: "Slick Back",
    category: "Luis",
  },
]
export const Gallery = () => {
  const [filter, setFilter] = useState("Todos")
  const categories = ["Todos", "Juan", "Luis", "Pedro"]

  const filteredImages = filter === "Todos" ? galleryImages : galleryImages.filter((img) => img.category === filter)
  return (
    <>
    <section id="galeria" className="py-16 sm:py-20 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-primary text-xs sm:text-sm font-bold tracking-wider uppercase">Nuestro Trabajo</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-3 mb-4 text-balance">
            Galería de estilos
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty mb-8 sm:mb-12">
            Explora nuestra colección de cortes y estilos de cada peluquero.
          </p>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold text-sm sm:text-base transition-all ${
                  filter === category
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                    : "bg-secondary text-secondary-foreground hover:bg-primary/20 border border-border"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {filteredImages.map((image, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg aspect-square cursor-pointer border border-border hover:border-primary transition-all"
            >
              <img
                src={image.url || "/placeholder.svg"}
                alt={image.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6">
                  <h3 className="text-sm sm:text-base md:text-xl font-bold text-foreground mb-1">{image.title}</h3>
                  <p className="text-primary text-xs sm:text-sm font-bold">{image.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>        
    </>
  )
}
