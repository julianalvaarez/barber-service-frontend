import { useState, type Dispatch } from "react"
import { Button, Calendar, Label, Select, SelectContent, SelectItem, SelectTrigger, Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../ui"
import type { SlotEx } from "@/utils/computeStartableSlots";
import { useBarberContext } from "@/context/BarberContextProvider";
import type { Barber, Service } from "@/types";

type Props = {
    setSelectedBarber: Dispatch<Barber | null>
    slotList: SlotEx[]
    selectedBarber: Barber | null
    services: Service[]
    selectedService: Service | null
    formData: { name: string; phone: string; date: Date; time: string; }
    setFormData: Dispatch<{ name: string; phone: string; date: Date; time: string; }>
    setSelectedService: Dispatch<Service | null>
}

export const SheetBookings = ({setSelectedBarber, slotList, selectedBarber, services, selectedService, formData, setFormData, setSelectedService}: Props ) => {
  const {barbers} = useBarberContext();  
  const [modalOpen, setModalOpen] = useState(false)

  // rango ocupado visualmente
  function getOccupyRangeFromIndex(index: number) {
    const will = slotList[index]?.willOccupy || 1
    return [index, Math.min(slotList.length - 1, index + will - 1)]
  }
  return (
    <>
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

                      {
                        barbers.length === 0 || services.length === 0   ? (
                          <div className="flex flex-col gap-2 items-center justify-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
                            <p className="ml-4 text-foreground">Esto puede tardar un momento...</p>
                          </div> 
                        ) : 
                        <>
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
                                    const selectedIdx = slotList.findIndex( (s) => s.hour === formData.time )
                                    const [start, end] = getOccupyRangeFromIndex(selectedIdx)
                                    const isInSelectedRange = selectedIdx !== -1 && idx >= start && idx <= end
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
                              <Button type="submit" className="cursor-pointer" onClick={() => {setModalOpen(false)}} disabled={ !formData.time || !formData.date || !selectedBarber || !selectedService }>
                                Guardar Datos
                              </Button>
                            <SheetClose asChild>
                              <Button type="button" variant="outline" className="cursor-pointer " onClick={() => {setModalOpen(false); setSelectedBarber(null); setSelectedService(null)}}>
                                Cerrar
                              </Button>
                            </SheetClose>
                          </SheetFooter>
                        </>
                      }

                    </SheetContent>
          </Sheet>                
    </>
  )
}
