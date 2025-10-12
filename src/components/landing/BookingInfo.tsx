import { Calendar, CheckCircle, Clock } from "lucide-react"

export const BookingInfo = () => {
  return (
    <>
          {/* Cabecera */}
          <div className="text-center mb-10 sm:mb-12">
            <span className="text-primary text-xs sm:text-sm font-bold tracking-wider uppercase">
              Reserva tu cita
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-3 mb-4">
              Agenda tu turno
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Reserva rápido y fácil. Sin esperas, sin complicaciones.
            </p>
          </div>

          {/* Iconos informativos */}
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-12">
            <div className="flex flex-col items-center text-center p-4 bg-card rounded-lg border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-foreground mb-1">
                Horarios flexibles
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Lun-Sáb 10AM-8PM
              </p>
            </div>

            <div
              id="reservar"
              className="flex flex-col items-center text-center p-4 bg-card rounded-lg border border-border"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-foreground mb-1">
                Sin esperas
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Sistema de turnos
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4 bg-card rounded-lg border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-foreground mb-1">
                Confirmación rápida
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Respuesta inmediata
              </p>
            </div>
          </div>   
    </>
  )
}
