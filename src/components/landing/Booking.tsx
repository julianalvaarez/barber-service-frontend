// src/components/client/Booking.tsx
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { User, Phone } from "lucide-react"
import type { Appointment, Barber, BookingLocal, PendingAny, Service } from "../../types"
import { computeStartableSlots } from "../../utils/computeStartableSlots"
import { generateTimes } from "@/utils/generateTimes"
import type { SlotEx } from "@/utils/computeStartableSlots"
import { blockReservatedBooks } from "../../utils/blockReservatedBooks"
import { BookingInfo } from "./BookingInfo"
import { useBarberContext } from "@/context/BarberContextProvider"
import { SheetBookings } from "./SheetBookings"
import { getLocalReservations, removeLocalReservation, updateLocalReservation } from "@/utils/localReservations"
import axios from "axios"
import { errorNotify } from "@/lib/toasts"

export const Booking = () => {
  const nav = useNavigate()
  const {services, bookings, loading, setLoading } = useBarberContext()
  const [slotList, setSlotList] = useState<SlotEx[]>(() => generateTimes("10:00", "20:00", 45).map((t) => ({ hour: t, availability: true })) )

  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null)
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  const [formData, setFormData] = useState({ name: "", phone: "", date: new Date(), time: "", })
  const [list, setList] = useState<BookingLocal[]>([]);  

  useEffect(() => {
    setList(getLocalReservations());
  }, []);

  useEffect(() => {
    getBookingsForDay()
  }, [formData.date, bookings, selectedBarber, selectedService])

  async function refreshFromServer() {
    // opcional: sincronizar estados con backend para cada reserva local
    setLoading(true);
    try {
      const current = getLocalReservations();
      const updated = await Promise.all(current.map(async (r) => {
        try {
          const { data } = await axios.get(`https://barber-service-backend.onrender.com/api/bookings/${r.id}`);
          // actualizamos estado local con lo que devuelve servidor
          const patched = {
            status: data.status,
            service_name: data.services?.name || r.service_name,
            barber_name: data.barbers?.name || r.barber_name
          };
          updateLocalReservation(r.id, patched);
          return { ...r, ...patched };
        } catch (err) {
          console.log(err);
          return r
        }
      }));
      setList(updated );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }  

  function handleRemove(id:string){
    if (!confirm('Eliminar la reserva de este dispositivo?')) return;
    removeLocalReservation(id);
    setList(getLocalReservations());
  }  

  function getBookingsForDay() {
    if (!selectedBarber) {
      setSlotList(generateTimes("10:00", "20:00", 45).map((t) => ({ hour: t, availability: true })))
      return
    }

    const formattedDate = formData.date instanceof Date ? formData.date.toISOString().slice(0, 10) : formData.date
    const appointments = bookings.filter((b: Appointment) => b.date === formattedDate && b.barber_id === selectedBarber?.id)

    const baseSlots = blockReservatedBooks( generateTimes("10:00", "20:00", 45), appointments, 45 )

    if (!selectedService) {
      const mapped = baseSlots.map((s: PendingAny) => ({ ...s, canStart: s.availability, willOccupy: s.availability ? 1 : 0, }))
      setSlotList(mapped)
      return
    }

    const duration = selectedService.duration || 45
    const startable = computeStartableSlots(baseSlots as SlotEx[], duration, 45)
    setSlotList(startable)
  }



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedService) {
      setSelectedService(services[0] ?? null)
    }
    const idx = slotList.findIndex((s) => s.hour === formData.time)
    if (idx === -1 || !slotList[idx].canStart) {
      errorNotify("El horario seleccionado no tiene espacio suficiente para este servicio.")
      return
    }

    const ServiceSelected = services.find((s) => s.id === selectedService?.id)
    localStorage.setItem( "bookingData", JSON.stringify({ ...formData, date: formData.date instanceof Date ? formData.date.toISOString().slice(0, 10) : formData.date, serviceId: ServiceSelected?.id, barberId: selectedBarber?.id, deposit: ServiceSelected?.deposit, serviceName: ServiceSelected?.name, barberName: selectedBarber?.name, }) )
    nav("/pay")
  }

  // Render
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <BookingInfo />

          <div className="bg-card border-border shadow-xl">
            <div className="p-6 sm:p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                {/* --- Campos del formulario --- */}
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="space-y-2">
                    <label htmlFor="name" className="flex items-center gap-2 text-sm sm:text-base">
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
                      className="bg-background border p-2 w-full h-11 sm:h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="flex items-center gap-2 text-sm sm:text-base">
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
                      className="bg-background border p-2 w-full h-11 sm:h-12"
                    />
                  </div>
                </div>

                <SheetBookings setSelectedBarber={setSelectedBarber} slotList={slotList} setSelectedService={setSelectedService} selectedBarber={selectedBarber} selectedService={selectedService} setFormData={setFormData} formData={formData} services={services}  />

                <div className="max-w-4xl mx-auto space-y-4 p-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Mis Reservas</h2>
                    <div>
                      <button onClick={refreshFromServer} className="px-3 py-1 bg-blue-600 text-white rounded">{loading ? 'Sincronizando...' : 'Sincronizar'}</button>
                    </div>
                  </div>

                  {list.length === 0 ? (
                    <div className="text-gray-600">No hay reservas guardadas en este dispositivo.</div>
                  ) : (
                    <div className="space-y-3">
                      {list.map(r => (
                        <div key={r.id} className="p-3 border rounded flex justify-between items-center">
                          <div>
                            <div className="font-medium">{r.service_name} — {r.barber_name ?? ''}</div>
                            <div className="text-sm text-muted-foreground">{r.date} {r.time}</div>
                            <div className="text-sm">Estado: <strong>{r.status}</strong></div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={()=>handleRemove(r.id)} className="px-2 py-1 bg-red-500 text-white rounded">Eliminar</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/80 font-bold text-base sm:text-lg py-3 lg:py-4 shadow-md shadow-primary/20 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  disabled={ !formData.time || !formData.phone || !formData.date || !formData.name || !selectedBarber || !selectedService }
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
