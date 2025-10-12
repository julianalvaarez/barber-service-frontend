// src/pages/admin/BookingDialog.tsx
import{ useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components//ui/dialog";
import { Input } from "../../components//ui/input";
import { Button } from "../../components//ui/button";
import { supabase } from "../../lib/supabaseClient";
import { Select, SelectTrigger, SelectContent, SelectItem } from "../../components//ui/select";
import type { PendingAny } from "../../types";
import axios from "axios";

export function BookingDialog({ booking, onClose, barbers }: { booking:PendingAny, onClose: ()=>void, barbers:PendingAny[] }) {
  const isNew = !booking.id;
  const [user, setUser] = useState({ name: booking?.client || "", phone: booking?.client_phone || ""});
  const [services, setServices] = useState<PendingAny[]>([]);
  const [serviceId, setServiceId] = useState<string>(booking.service_id || "");
  const [barberId, setBarberId] = useState<string>(booking.barber_id || booking.barber_id || "");

  useEffect(()=> {
    (async ()=>{
      const sb = await axios.get("http://localhost:4000/api/admin/barbers"); 
      const sv = await supabase.from("services").select("*"); setServices((sv.data || []));
      if (!serviceId && sv.data && sv.data[0]) setServiceId(sv.data[0].id);
      if (!barberId && barbers && barbers[0]) setBarberId(sb.data[0].id);
    })()
  }, []);

  async function createManual(){
    try {
      await axios.post("http://localhost:4000/api/admin/bookings-admin", {
        client: user.name, 
        client_phone: user.phone,
        service_id: serviceId,
        date: booking.date,
        time: booking.time,
        barber_id: barberId,
        status: "paid",
      });
      onClose();
    } catch (err){ console.error(err); }
  }

  async function cancelBooking(){
    try {
      await axios.delete(`http://localhost:4000/api/admin/bookings/${booking.id}`);
      onClose();
    } catch (err){ console.error(err); }
  }

  async function updateBooking() {
    try {
        await axios.put(`http://localhost:4000/api/admin/bookings/${booking.id}`, {
          client: user.name, 
          client_phone: user.phone,
          service_id: serviceId,
          date: booking.date,
          time: booking.time,
          barber_id: barberId,
          status: "paid",
        })
        onClose();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Dialog open onOpenChange={(open: PendingAny)=>{ if(!open) onClose(); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isNew ? "Agregar turno" : "Detalle del turno"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground">Fecha / Hora</label>
            <div className="font-mono">{booking.date} · {booking.time}</div>
          </div>

            <div >
              <label className="text-xs">Peluquero</label>
              <Select onValueChange={(v: PendingAny)=>setBarberId(v)} value={barberId}  >
                <SelectTrigger>{barbers.find(b=>b.id===barberId)?.name ?? "Elegir peluquero"}</SelectTrigger>
                <SelectContent>
                  {barbers.map(b=> <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div >
              <label className="text-xs">Servicio</label>
              <Select onValueChange={(v)=>setServiceId(v)} value={serviceId}>
                <SelectTrigger>{services.find(s=>s.id===serviceId)?.name ?? "Elegir servicio"}</SelectTrigger>
                <SelectContent>
                  {services.map(s=> <SelectItem key={s.id} value={s.id}>{s.name} — ${s.price}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

          <div className="grid grid-cols-1 gap-2">
            <Input placeholder="Nombre" value={user.name} onChange={(e: PendingAny)=>setUser({...user, name:e.target.value})} />
            <Input placeholder="Teléfono" value={user.phone} onChange={(e: PendingAny)=>setUser({...user, phone:e.target.value})} />
          </div>
        </div>

        <DialogFooter className="flex sm:items-center justify-end gap-4">
          {isNew ? (
            <Button onClick={createManual} className="cursor-pointer">Crear</Button>
          ) : (
            <>
            <Button variant="destructive" onClick={cancelBooking} className="cursor-pointer">Cancelar Turno</Button>
            <Button variant="secondary" onClick={updateBooking} className="cursor-pointer">Actualizar Turno</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
