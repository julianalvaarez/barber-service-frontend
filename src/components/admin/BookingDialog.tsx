import { useEffect, useState } from "react";
import axios from "axios";
import type { Appointment } from "../../types";
import { useBarberContext } from "@/context/BarberContextProvider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, Input, Button, Select, SelectTrigger, SelectContent, SelectItem, } from "../../components/ui";
import { errorNotify, successNotify } from "@/lib/toasts";


// ===============================================
// FUNCIONES PARA VALIDAR SUPERPOSICIÓN DE TURNOS
// ===============================================

function addMinutesToTime(time: string, mins: number) {
  const [h, m] = time.split(":").map(Number);
  const date = new Date(2000, 0, 1, h, m);
  date.setMinutes(date.getMinutes() + mins);
  return date.toTimeString().slice(0, 5);
}

function getBlocksForAppointment(startTime: string, duration: number, interval: number) {
  const blocks = [];
  const count = Math.ceil(duration / interval);

  let current = startTime;
  for (let i = 0; i < count; i++) {
    blocks.push(current);
    current = addMinutesToTime(current, interval);
  }

  return blocks;
}

export function BookingDialog({ booking, onClose, onSave, }: { booking: Partial<Appointment>; onClose: () => void; onSave: () => void; }) {
  const { services, barbers, loading, setLoading, slotList } = useBarberContext();
  const isNew = !booking.id;
  const [client, setClient] = useState({ name: booking?.client || "", phone: booking?.client_phone || "" });

  const [serviceId, setServiceId] = useState<string>(booking.service_id || "");
  const [barberId, setBarberId] = useState<string>( booking.barber_id || booking.barber_id || "" );

  // ===============================================================
  // PRESELECCIONAR VALORES
  // ===============================================================
  useEffect(() => {
    if (!serviceId && services.length > 0) setServiceId(services[0].id);
    if (!barberId && barbers.length > 0) setBarberId(barbers[0].id);
  }, []);


  // ===============================================================
  // VALIDAR SUPERPOSICIÓN DE TURNOS
  // ===============================================================
  function checkOverlap() {
    const service = services.find((s) => s.id === serviceId);
    if (!service) return false;

    const duration = service.duration || 50;
    const interval = 50; // tus turnos son de 50 minutos siempre

    const neededBlocks = getBlocksForAppointment( booking.time!, duration, interval );

    const overlap = neededBlocks.some((block) => {
      const slot = slotList.find((s) => s.hour === block);

      if (!slot) return false;

      // si está ocupado y NO es este mismo turno → conflicto
      if (!slot.availability && slot.bookInfo?.id !== booking.id) return true;

      return false;
    });

    return overlap;
  }

  // ===============================================================
  // CREAR MANUALMENTE
  // ===============================================================
  async function createManual() {
    if (checkOverlap()) {
      errorNotify("Este turno se superpone con otro ya reservado.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        "https://barber-service-backend.onrender.com/api/admin/bookings-admin",
        {
          client: client.name,
          client_phone: client.phone,
          service_id: serviceId,
          date: booking.date,
          time: booking.time,
          barber_id: barberId,
          status: "paid",
        }
      );

      successNotify("Turno creado");
    } catch (err) {
      console.error(err);
      errorNotify("Error creando turno");
    } finally {
      setLoading(false);
      onSave();
    }
  }

  // ===============================================================
  // CANCELAR TURNOS
  // ===============================================================
  async function cancelBooking() {
    setLoading(true);
    try {
      await axios.delete(
        `https://barber-service-backend.onrender.com/api/admin/bookings/${booking.id}`
      );
      successNotify("Turno cancelado");
    } catch (err) {
      console.error(err);
      errorNotify("Error cancelando turno");
    } finally {
      setLoading(false);
      onSave();
    }
  }

  // ===============================================================
  // ACTUALIZAR TURNOS
  // ===============================================================
  async function updateBooking() {
    if (checkOverlap()) {
      errorNotify("El turno actualizado se superpone con otro existente.");
      return;
    }

    setLoading(true);
    try {
      await axios.put(
        `https://barber-service-backend.onrender.com/api/admin/bookings/${booking.id}`,
        {
          client: client.name,
          client_phone: client.phone,
          service_id: serviceId,
          date: booking.date,
          time: booking.time,
          barber_id: barberId,
          status: "paid",
        }
      );

      successNotify("Turno actualizado");
    } catch (err) {
      console.error(err);
      errorNotify("Error actualizando el turno");
    } finally {
      setLoading(false);
      onSave();
    }
  }

  // ===============================================================
  // UI DEL DIALOG
  // ===============================================================

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isNew ? "Agregar turno" : "Detalle del turno"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {/* FECHA & HORA */}
          <div>
            <label className="text-xs text-muted-foreground">Fecha / Hora</label>
            <div className="font-mono">{booking.date} · {booking.time}</div>
          </div>

          {/* BARBERO */}
          <div>
            <label className="text-xs">Peluquero</label>
            <Select onValueChange={setBarberId} value={barberId}>
              <SelectTrigger>
                {barbers.find((b) => b.id === barberId)?.name ?? "Elegir peluquero"}
              </SelectTrigger>
              <SelectContent>
                {barbers.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* SERVICIO */}
          <div>
            <label className="text-xs">Servicio</label>
            <Select onValueChange={setServiceId} value={serviceId}>
              <SelectTrigger>
                {services.find((s) => s.id === serviceId)?.name ?? "Elegir servicio"}
              </SelectTrigger>
              <SelectContent>
                {services.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name} — ${s.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* CLIENTE */}
          <div className="grid grid-cols-1 gap-2">
            <Input
              placeholder="Nombre"
              value={client.name}
              onChange={(e) => setClient({ ...client, name: e.target.value })}
            />
            <Input
              placeholder="Teléfono"
              value={client.phone}
              onChange={(e) => setClient({ ...client, phone: e.target.value })}
            />
          </div>
        </div>

        <DialogFooter className="flex sm:items-center justify-end gap-4">
          {isNew ? (
            <Button onClick={createManual} disabled={loading}>
              {loading ? "Cargando..." : "Crear Turno"}
            </Button>
          ) : (
            <>
              <Button
                variant="destructive"
                onClick={cancelBooking}
                disabled={loading}
              >
                {loading ? "Cargando..." : "Cancelar Turno"}
              </Button>

              <Button
                variant="secondary"
                onClick={updateBooking}
                disabled={loading}
              >
                {loading ? "Cargando..." : "Actualizar Turno"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
