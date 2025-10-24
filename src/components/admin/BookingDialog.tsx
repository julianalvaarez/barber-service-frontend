import{ useEffect, useState } from "react";
import axios from "axios";
import type { Appointment } from "../../types";
import { useBarberContext } from "@/context/BarberContextProvider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, Input, Button, Select, SelectTrigger, SelectContent, SelectItem } from "../../components/ui";
import { errorNotify, successNotify } from "@/lib/toasts";

export function BookingDialog({ booking, onClose, onSave }: { booking:Partial<Appointment>, onClose: ()=>void, onSave: ()=>void }) {
  const {services, barbers, loading, setLoading} = useBarberContext()
  const isNew = !booking.id;
  const [user, setUser] = useState({ name: booking?.client || "", phone: booking?.client_phone || ""});
  const [serviceId, setServiceId] = useState<string>(booking.service_id || "");
  const [barberId, setBarberId] = useState<string>(booking.barber_id || booking.barber_id || "");

  useEffect(()=> {
    if (!serviceId && services && services[0]) setServiceId(services[0].id);
    if (!barberId && barbers && barbers[0]) setBarberId(barbers[0].id);
  }, []);

  async function createManual(){
    setLoading(true);
    try {
      await axios.post("https://barber-service-backend.onrender.com/api/admin/bookings-admin", {
        client: user.name, 
        client_phone: user.phone,
        service_id: serviceId,
        date: booking.date,
        time: booking.time,
        barber_id: barberId,
        status: "paid",
      });
      onSave();
      successNotify("Turno creado");
    } catch (err){
      errorNotify("Error creando turno"); console.error(err); 
    } finally {
      setLoading(false);
    }
  }

  async function cancelBooking(){
    setLoading(true);
    try {
      await axios.delete(`https://barber-service-backend.onrender.com/api/admin/bookings/${booking.id}`);
      onClose();
      successNotify("Turno cancelado");
    } catch (err){ 
      errorNotify("Error cancelando turno"); console.error(err); 
    } finally {
      setLoading(false);
    }
  }

  async function updateBooking() {
    setLoading(true);
    try {
        await axios.put(`https://barber-service-backend.onrender.com/api/admin/bookings/${booking.id}`, {
          client: user.name, 
          client_phone: user.phone,
          service_id: serviceId,
          date: booking.date,
          time: booking.time,
          barber_id: barberId,
          status: "paid",
        })
        onSave();
        successNotify("Turno actualizado");
    } catch (error) { 
      console.error(error); errorNotify("Error actualizando el turno"); 
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
    <Dialog open onOpenChange={(open: boolean)=>{ if(!open) onClose(); }}>
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
              <Select onValueChange={(v: string)=>setBarberId(v)} value={barberId}  >
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
            <Input placeholder="Nombre" value={user.name} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setUser({...user, name:e.target.value})} />
            <Input placeholder="Teléfono" value={user.phone} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setUser({...user, phone:e.target.value})} />
          </div>
        </div>

        <DialogFooter className="flex sm:items-center justify-end gap-4">
          {isNew ? (
            <Button onClick={createManual} className="cursor-pointer disabled:opacity-50" disabled={loading}  >{loading ? "Cargando..." : "Crear Turno"}</Button>
          ) : (
            <>
            <Button variant="destructive" onClick={cancelBooking} className="cursor-pointer disabled:opacity-50" disabled={loading}>{loading ? "Cargando..." : "Cancelar Turno"}</Button>
            <Button variant="secondary" onClick={updateBooking} className="cursor-pointer disabled:opacity-50" disabled={loading}>{loading ? "Cargando..." : "Actualizar Turno"}</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog> 
    </>
  );
}
