// src/pages/admin/AdminAgenda.tsx
import { useEffect, useState } from "react";
import { Button } from "../../components//ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components//ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem } from "../../components/ui/select";
import {BookingDialog} from "../../components/admin/BookingDialog";
import { generateTimes } from "../../utils/generateTimes";
import type { Appointment, PendingAny } from "../../types";
import axios from "axios";
import { blockReservatedBooks } from "@/utils/blockReservatedBooks";
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover"

export function Agenda() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [barbers, setBarbers] = useState<PendingAny[]>([]);
  const [selectedBarber, setSelectedBarber] = useState<string>("");
  const [slotList, setSlotList] = useState<PendingAny[]>(() => generateTimes("10:00", "20:00", 30));
  const [openBooking, setOpenBooking] = useState<PendingAny | null>(null);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadBarbers();
  }, []);

  useEffect(() => {
    loadBookings();
  }, [date, selectedBarber]);

  async function loadBarbers() {
    const { data } = await axios.get("http://localhost:4000/api/admin/barbers");
    setBarbers(data || []);
    if (data && data[0]) setSelectedBarber(data[0].id);
  }

  async function loadBookings() {
    setLoading(true)
    try {
      const q = selectedBarber !== "." ? `http://localhost:4000/api/admin/bookings?date=${date}&barber=${selectedBarber}` : `http://localhost:4000/api/admin/bookings?date=${date}`;
      const { data } = await axios.get(q);
      console.log(selectedBarber);
      const intervals = 45
      const blocked = blockReservatedBooks(generateTimes("10:00", "20:00", intervals), data, intervals);
      setSlotList(blocked || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false)
    }
  }


  return (
    <>
        {
      loading ?
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
      </div> 
      :
      <Card className="space-y-4 dark:bg-[#0a0a0a] my-[40px]">
      <CardHeader className="flex flex-col sm:flex-row md:m-5 items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <CardTitle className="text-2xl md:text-3xl">Agenda del día</CardTitle>
          <div className="text-sm text-muted-foreground">Ver y administrar los cortes del día</div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2">
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
                <Calendar mode="single" selected={date} onSelect={setDate} />
              </PopoverContent>
            </Popover>
            <Select onValueChange={(v: PendingAny)=>{setSelectedBarber(v); loadBookings();}} value={selectedBarber}>
                <SelectTrigger className="min-w-[180px]">
                {barbers.find(b => b.id === selectedBarber)?.name ?? "Todos los peluqueros"}
                </SelectTrigger>
                <SelectContent>
                {barbers.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                </SelectContent>
            </Select>
          </div>

          <Button onClick={loadBookings} variant="secondary">Refrescar</Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 ">
          {slotList.map((slot: {hour: string, availability: boolean, bookInfo?: Appointment}) => (
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
                        <Button size="sm" onClick={()=>setOpenBooking(slot.bookInfo)} className="bg-white text-gray-800 hover:bg-gray-100 cursor-pointer border">Ver</Button>
                        <Button size="sm" variant="destructive" onClick={async ()=>{
                          const ok = confirm("¿Desea cancelar la cita?");
                          if (!ok) return;
                          await axios.delete(`http://localhost:4000/api/admin/bookings/${slot.bookInfo?.id}`);
                          await loadBookings();
                        }} className="bg-red-700 dark:bg-red-700 hover:bg-red-900 cursor-pointer">Cancelar</Button>
                      </>
                    ) : (
                      <Button size="sm" onClick={()=>setOpenBooking({ date, time: slot.hour, barber_id: selectedBarber })} className="bg-green-200 dark:border dark:hover:border-green-300 text-gray-800 hover:bg-gray-100 cursor-pointer border">Agregar</Button>
                    )}
                  </div>
                </div>
              </div>
          ))}
          
        </div>
      </CardContent>

      {openBooking && <BookingDialog booking={openBooking} onClose={() => { setOpenBooking(null); loadBookings(); }} barbers={barbers} />}
      </Card>
      
    }
    </>
  )
}
