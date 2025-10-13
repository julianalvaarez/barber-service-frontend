import { Calendar, Clock, User, Phone } from "lucide-react"
import { useEffect, useState } from "react"
import type { Appointment, Barber, Service, TimeBooking } from "../../types"
import { supabase } from "../../lib/supabaseClient"
import { useNavigate } from "react-router-dom"
import { generateTimes } from "../../utils/generateTimes"
import axios from "axios"
import { blockReservatedBooks } from "../../utils/blockReservatedBooks"
import { BookingInfo } from "./BookingInfo"
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select"

export const Booking = () => {
  const nav = useNavigate()
  const [services, setServices] = useState<Service[]>([])
  const [availableTimes, setAvailableTimes] = useState<TimeBooking[]>([]) // horarios libres
  const [barbers, setBarbers] = useState<Barber[]>([])
  const [selectedBarber, setSelectedBarber] = useState<string>("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    service: "",
  })

  // 🔹 Cargar servicios disponibles
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("services").select("*")
      setServices(data || [])
      const { data: barbers } = await supabase.from("barbers").select("*")
      setBarbers(barbers || [])
    }
    load()
  }, [])

 const getAvailableTimes = async () => {
    const {data: books} = await axios.get(`http://localhost:4000/api/admin/bookings`)
    const bookingsToday = books?.filter((book: Appointment) => book.date === formData.date)
    const intervals = 45
    const blocked = blockReservatedBooks(generateTimes("10:00", "20:00", intervals), bookingsToday, intervals)
    setAvailableTimes(blocked)
    console.log(blocked);
 }

  useEffect(() => {
    if (!formData.date) return
    getAvailableTimes()
  }, [formData.date])

  // 🔹 Actualizar campos
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // 🔹 Enviar formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.service === "") formData.service = services[0]?.id
    const selectedService = services.find((s) => s.id === formData.service)
    localStorage.setItem(
      "bookingData",
      JSON.stringify({
        ...formData,
        serviceName: selectedService?.name,
        barberName: selectedBarber,
        deposit: selectedService?.deposit,
      })
    )
    nav("/pay", {
      state: {
        ...formData,
        serviceName: selectedService?.name,
        deposit: selectedService?.deposit,
        barberName: selectedBarber
      },
    })
  }

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <BookingInfo />

          {/* Formulario */}
          <div className="bg-card border-border shadow-xl">
            <div className="p-6 sm:p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                  {/* Nombre */}
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-foreground flex items-center gap-2 text-sm sm:text-base"
                    >
                      <User className="w-4 h-4 text-primary" />
                      Nombre completo
                    </label>
                    <input
                      id="name"
                      name="name"
                      placeholder="Juan Pérez"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="bg-background border border-border p-2 rounded w-full text-foreground h-11 sm:h-12"
                    />
                  </div>

                  {/* Teléfono */}
                  <div className="space-y-2">
                    <label
                      htmlFor="phone"
                      className="text-foreground flex items-center gap-2 text-sm sm:text-base"
                    >
                      <Phone className="w-4 h-4 text-primary" />
                      Teléfono
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="11 1234-5678"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="bg-background border rounded p-2 w-full text-foreground h-11 sm:h-12"
                    />
                  </div>
                </div>

                {/* Fecha y Hora */}
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                  {/* Fecha */}
                  <div className="space-y-2">
                    <label
                      htmlFor="date"
                      className="text-foreground flex items-center gap-2 text-sm sm:text-base"
                    >
                      <Calendar className="w-4 h-4 text-primary" />
                      Fecha
                    </label>
                    <input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className="bg-background border rounded p-2 w-full text-foreground h-11 sm:h-12"
                       min={new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0]} max={new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0]}
                    />
                  </div>

                  {/* Hora */}
                  <div className="space-y-2">
                    <label
                      htmlFor="time"
                      className="text-foreground flex items-center gap-2 text-sm sm:text-base"
                    >
                      <Clock className="w-4 h-4 text-primary" />
                      Hora
                    </label>
                    <select
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                      disabled={!formData.date}
                      className="bg-background border rounded p-2 w-full text-foreground h-11 sm:h-12 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary transition-all appearance-none cursor-pointer  "
                    >
                      <option value="" disabled>
                        {!formData.date
                          ? "Elegí una fecha primero"
                          : availableTimes.length
                          ? "Seleccionar horario"
                          : "Sin horarios disponibles"}
                      </option>
                      {availableTimes.map((t) => (
                        <option key={t.hour} value={t.hour} disabled={!t.availability}>
                          {t.hour}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  {/* Servicio */}
                  <div className="space-y-2">
                    <label
                      htmlFor="service"
                      className="text-foreground text-sm sm:text-base"
                    >
                      Servicio
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      required
                      className="w-full h-11 sm:h-12 px-3 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                    >
                      {services?.map((service: Service, index: number) => (
                        <option key={index} value={service.id}>
                          {service.name} - ${service.price} - Seña $
                          {service.deposit}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Select onValueChange={(v)=>{setSelectedBarber(v)}} value={selectedBarber}>
                      <SelectTrigger className="min-w-[180px]">
                      {barbers.find(b => b.id === selectedBarber)?.name ?? "Todos los peluqueros"}
                      </SelectTrigger>
                      <SelectContent>
                      {barbers.map(b => <SelectItem key={b.id} value={b.name}>{b.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {/* Botón */}
                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/80 font-bold text-base sm:text-lg py-3 lg:py-4 shadow-md shadow-primary/20"
                >
                  Ir a Confirmar Reserva
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
