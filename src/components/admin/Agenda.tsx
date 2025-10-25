// src/pages/admin/AdminAgenda.tsx
import { useEffect, useState } from "react";
import { Button } from "../../components//ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components//ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem } from "../../components/ui/select";
import {BookingDialog} from "../../components/admin/BookingDialog";
import { generateTimes } from "../../utils/generateTimes";
import type { Appointment, Slot } from "../../types";
import axios from "axios";
import { blockReservatedBooks } from "@/utils/blockReservatedBooks";
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover"
import { useBarberContext } from "@/context/BarberContextProvider";
import { errorNotify, successNotify } from "@/lib/toasts";

export function Agenda() {
  const {bookings, loading, loadBookings, barbers, loadBarbers, services} = useBarberContext();
  const [date, setDate] = useState<Date>(new Date());
  const [selectedBarber, setSelectedBarber] = useState<string>("");
  const cutClasic = services.filter((s) => s.name === 'Corte clásico');
  const intervals = cutClasic[0]?.duration || 50;
  const [slotList, setSlotList] = useState<Slot[]  >(() => generateTimes("9:00", "20:00", intervals).map(t => ({ hour: t, availability: true })));
  const [openBooking, setOpenBooking] = useState<Partial<Appointment> | null >(null);


  useEffect(() => {
    getBarbers();
  }, []);

  useEffect(() => {
    getBookingsForDay();
  }, [date, bookings, selectedBarber]);

  async function getBarbers() {
    loadBarbers()
    if (barbers && barbers[0]) setSelectedBarber(barbers[0].id);
    loadBookings()
  }



  function getBookingsForDay() {
      if (!selectedBarber || bookings.length === 0) return;      
      const formattedDate = date.toLocaleDateString("en-CA");
      const appointments = bookings.filter((b: Appointment) => b.date === formattedDate && b.barber_id === selectedBarber);
      const cutClasic = services.filter((s) => s.name === 'Corte clásico');
      const intervals = cutClasic[0]?.duration || 45;
      const blocked = blockReservatedBooks( generateTimes("9:00", "20:00", intervals), appointments, intervals );
      setSlotList(blocked || []);
  }

  const cancelBooking = async (slot:  Slot)=>{
    const ok = confirm("¿Desea cancelar la cita?");
    if (!ok) return;
    try {
      await axios.delete(`https://barber-service-backend.onrender.com/api/admin/bookings/${slot.bookInfo?.id}`);
      await loadBookings();
      successNotify("Turno cancelado");
    } catch (error) {
      console.log(error);
      errorNotify("Error cancelando turno");
    }
  }

  return (
    <>
      {
      loading ?
        <div className="flex flex-col gap-2 items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
          <p className="text-foreground">Esto puede tardar un momento...</p>
        </div> 
        :
        <Card className="space-y-4 dark:bg-[#0a0a0a] my-[40px]">
        <CardHeader className="flex flex-col sm:flex-row md:m-5 items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <CardTitle className="text-2xl md:text-3xl">Agenda del día</CardTitle>
            <div className="text-sm text-muted-foreground">Ver y administrar los cortes del día</div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex flex-col md:flex-row justify-center md:items-center gap-2">
              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      data-empty={!date}
                      className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
                    >
                      <CalendarIcon />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} />
                  </PopoverContent>
                </Popover>                
              </div>
              <div>
                <Select onValueChange={(v)=>{setSelectedBarber(v)}} value={selectedBarber}>
                    <SelectTrigger className="w-full md:min-w-[180px]">
                    {barbers.find(b => b.id === selectedBarber)?.name ?? "Todos los peluqueros"}
                    </SelectTrigger>
                    <SelectContent>
                    {barbers.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                    </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={loadBookings} variant="secondary">Refrescar</Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 ">
            {slotList.map((slot) => (
                <div key={slot.bookInfo?.id} className={`p-3 rounded-lg border ${!slot.availability ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}  ${!slot.availability ? "dark:bg-red-200 dark:border-red-200" : " dark:border-green-900"}` }>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-mono text-sm dark:text-black">{slot.hour}</div>
                      <div className="text-xs text-muted-foreground dark:text-gray-500" >
                        {!slot.availability ? `${slot.bookInfo?.client ?? "Sin nombre"} · ${slot.bookInfo?.services.name ?? "Servicio"}` : "Libre"}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {!slot.availability ? (
                        <>
                          <Button size="sm" onClick={()=>setOpenBooking({...slot.bookInfo})} className="bg-white text-gray-800 hover:bg-gray-100 cursor-pointer border">Ver</Button>
                          <Button size="sm" variant="destructive" onClick={()=>cancelBooking(slot)} className="bg-red-700 dark:bg-red-700 hover:bg-red-900 cursor-pointer">Cancelar</Button>
                        </>
                      ) : (
                        <Button size="sm" onClick={()=>setOpenBooking({ date: date.toLocaleDateString("en-CA"), time: slot.hour, barber_id: selectedBarber })} className="bg-green-200 dark:border dark:hover:border-green-300 text-gray-800 hover:bg-gray-100 cursor-pointer border">Agregar</Button>
                      )}
                    </div>
                  </div>
                </div>
            ))}
            
          </div>
        </CardContent>

        {openBooking && <BookingDialog booking={openBooking} onClose={() => { setOpenBooking(null) }} onSave={() => { setOpenBooking(null); loadBookings(); }} />}
        </Card>
      
      }


    </>
  )
}
