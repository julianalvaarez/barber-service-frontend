import { addLocalReservation } from "@/utils/localReservations";
import axios from "axios";
import { CircleCheckBig } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";


export function ConfirmPage() {
  const booking = JSON.parse(localStorage.getItem("bookingData") || "{}");
  const [search] = useSearchParams();
  const [statusMsg, setStatusMsg] = useState('Validando pago...');
  const bookingId = search.get('bookingId') || search.get('external_reference') || search.get('external_reference_id');

  useEffect(() => {
    if (!bookingId) {
      setStatusMsg('No se encontró referencia de reserva en la URL.');
      return;
    }

    (async () => {
      try {
        // Pedimos al backend la info final del booking
        const { data } = await axios.get(`https://barber-service-backend.onrender.com/api/bookings/${bookingId}`);
        const booking = data;
        if (!booking) {
          setStatusMsg('No se encontró la reserva en el servidor.');
          return;
        }

        if (booking.status === 'paid') {
          // Construimos objeto local (mapear campos necesarios)
          const local = {
            id: booking.id,
            service_id: booking.service_id,
            service_name: booking.services?.name || booking.serviceName,
            date: booking.date,
            time: booking.time,
            status: booking.status,
            barber_id: booking.barber_id,
            barber_name: booking.barbers?.name,
            created_at: booking.created_at,
            stored_at: new Date().toISOString()
          };
          addLocalReservation(local);
          setStatusMsg('Pago confirmado. Reserva guardada en tu dispositivo. ¡Gracias!');
        } else {
          setStatusMsg(`Estado del pago: ${booking.status || 'pendiente'}`);
        }
      } catch (err) {
        console.error(err);
        setStatusMsg('Error validando pago. Intenta más tarde.');
      }
    })();
  }, [bookingId]);
  return (
    <div className="text-center flex flex-col items-center justify-center m-auto h-screen">
      <div className="bg-card p-4 rounded shadow flex flex-col items-center gap-3  ">
        <div ><CircleCheckBig size={120} color="#21c424" absoluteStrokeWidth /></div>
        <h1 className="text-2xl font-bold">¡Reserva confirmada!</h1>
        <p>
          <strong>Nombre:</strong> {booking.name}
        </p>
        <p>
          <strong>Teléfono:</strong> {booking.phone}
        </p>
        <p>
          <strong>Servicio:</strong> {booking.serviceName}
        </p>
        <p>
          <strong>Fecha:</strong> {booking.date}
        </p>
        <p>
          <strong>Hora:</strong> {booking.time}
        </p>
        <p>{statusMsg}</p>
      </div>
    </div>
  )
}
