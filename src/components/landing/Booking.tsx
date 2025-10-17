// src/components/client/Booking.tsx
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { User, Phone } from "lucide-react"
import { Button, Label, Calendar, Select, SelectContent, SelectItem, SelectTrigger, Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger, } from "../ui"
import type { Appointment, Barber, PendingAny, Service } from "../../types"
import { computeStartableSlots } from "../../utils/computeStartableSlots"
import { generateTimes } from "@/utils/generateTimes"
import type { SlotEx } from "@/utils/computeStartableSlots"
import { blockReservatedBooks } from "../../utils/blockReservatedBooks"
import { BookingInfo } from "./BookingInfo"
import { useBarberContext } from "@/context/BarberContextProvider"

export const Booking = () => {
  const nav = useNavigate()
  const [modalOpen, setModalOpen] = useState(false)
  const {services, barbers, bookings } = useBarberContext()
  const [slotList, setSlotList] = useState<SlotEx[]>(() => generateTimes("10:00", "20:00", 45).map((t) => ({ hour: t, availability: true })) )

  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null)
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: new Date(),
    time: "",
  })

  useEffect(() => {
    getBookingsForDay()
  }, [formData.date, bookings, selectedBarber, selectedService])

  function getBookingsForDay() {
    if (!selectedBarber) {
      setSlotList(generateTimes("10:00", "20:00", 45).map((t) => ({ hour: t, availability: true })))
      return
    }

    const formattedDate = formData.date instanceof Date ? formData.date.toISOString().slice(0, 10) : formData.date
    const appointments = bookings.filter((b: Appointment) => b.date === formattedDate && b.barber_id === selectedBarber?.id)

    const baseSlots = blockReservatedBooks(
      generateTimes("10:00", "20:00", 45),
      appointments,
      45
    )

    if (!selectedService) {
      const mapped = baseSlots.map((s: PendingAny) => ({ ...s, canStart: s.availability, willOccupy: s.availability ? 1 : 0, }))
      setSlotList(mapped)
      return
    }

    const duration = selectedService.duration || 45
    const startable = computeStartableSlots(baseSlots as SlotEx[], duration, 45)
    setSlotList(startable)
  }

  // rango ocupado visualmente
  function getOccupyRangeFromIndex(index: number) {
    const will = slotList[index]?.willOccupy || 1
    return [index, Math.min(slotList.length - 1, index + will - 1)]
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
      alert("El horario seleccionado no tiene espacio suficiente para este servicio.")
      return
    }

    const ServiceSelected = services.find((s) => s.id === selectedService?.id)
    localStorage.setItem(
      "bookingData",
      JSON.stringify({
        ...formData,
        date: formData.date instanceof Date ? formData.date.toISOString().slice(0, 10) : formData.date,
        serviceId: ServiceSelected?.id,
        barberId: selectedBarber?.id,
        deposit: ServiceSelected?.deposit,
        serviceName: ServiceSelected?.name,
        barberName: selectedBarber?.name,
      })
    )
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

                {/* --- Modal de horarios --- */}
                <Sheet open={modalOpen} onOpenChange={setModalOpen}>
                  {selectedBarber && selectedService && formData.date && formData.time ? (
                    <span className="text-sm sm:text-base text-foreground/70">
                      Turno:{" "}
                      <strong>
                        {selectedBarber.name} - {selectedService.name} -{" "}
                        {formData.date.toLocaleDateString("es-AR")} a las {formData.time}
                      </strong>
                    </span>
                  ) : (
                    <SheetTrigger asChild>
                      <Button variant="outline" className="cursor-pointer w-full">
                        Ver turnos
                      </Button>
                    </SheetTrigger>
                  )}

                  <SheetContent className="overflow-y-auto" >
                    <SheetHeader>
                      <SheetTitle>Turnos Disponibles</SheetTitle>
                      <SheetDescription>
                        Elige el día y horario según el peluquero y el servicio.
                      </SheetDescription>
                    </SheetHeader>

                    <div className="space-y-4 px-4 py-2 overflow-y-auto">
                      <Select
                        onValueChange={(id) => {
                          const s = services.find((x) => x.id === id)
                          setSelectedService(s || null)
                        }}
                        value={selectedService?.id ?? ""}
                      >
                        <SelectTrigger className="w-full h-11 sm:h-12 px-3">
                          {selectedService
                            ? `${selectedService.name} - $${selectedService.price}`
                            : "Seleccionar servicio"}
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.name} - ${s.price}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        onValueChange={(id) => {
                          const b = barbers.find((x) => x.id === id)
                          setSelectedBarber(b || null)
                        }}
                        value={selectedBarber?.id ?? ""}
                      >
                        <SelectTrigger className="w-full h-11 sm:h-12 px-3">
                          {selectedBarber?.name ?? "Seleccionar peluquero"}
                        </SelectTrigger>
                        <SelectContent>
                          {barbers.map((b) => (
                            <SelectItem key={b.id} value={b.id}>
                              {b.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Label className="px-1">Seleccionar fecha</Label>
                      <Calendar
                        mode="single"
                        selected={new Date(formData.date)}
                        onSelect={(d) => d && setFormData({ ...formData, date: d })}
                        disabled={selectedBarber === null || selectedService === null}
                      />

                      <div>
                        {slotList.length === 0 && (
                          <div className="text-sm text-muted-foreground">
                            No hay horarios disponibles
                          </div>
                        )}
                        {slotList.length > 0 && (
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-1">
                            {slotList.map((slot, idx) => {
                              const selectedIdx = slotList.findIndex(
                                (s) => s.hour === formData.time
                              )
                              const [start, end] = getOccupyRangeFromIndex(selectedIdx)
                              const isInSelectedRange =
                                selectedIdx !== -1 && idx >= start && idx <= end
                              return (
                                <button
                                  key={slot.hour}
                                  type="button"
                                  disabled={!slot.canStart}
                                  onClick={() =>
                                    setFormData({ ...formData, time: slot.hour })
                                  }
                                  className={`m-1 px-3 py-2 rounded-full text-sm sm:text-base
                                    ${
                                      !slot.availability
                                        ? "bg-muted text-muted-foreground cursor-not-allowed"
                                        : ""
                                    }
                                    ${
                                      slot.canStart
                                        ? formData.time === slot.hour
                                          ? "bg-primary text-primary-foreground"
                                          : "bg-primary/10 text-primary hover:bg-primary/20"
                                        : "opacity-50 cursor-not-allowed"
                                    }
                                    ${isInSelectedRange ? "ring-2 ring-primary/30 scale-105" : ""}`}
                                >
                                  {slot.hour}
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    <SheetFooter>
                        <Button type="submit" className="cursor-pointer " disabled={ !formData.time || !formData.date || !selectedBarber || !selectedService }>
                          Guardar Datos
                        </Button>
                      <SheetClose asChild>
                        <Button type="button" variant="outline" className="cursor-pointer " onClick={() => {setModalOpen(false); setSelectedBarber(null); setSelectedService(null)}}>
                          Cerrar
                        </Button>
                      </SheetClose>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>

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
