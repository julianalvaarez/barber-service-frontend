import { CircleCheckBig } from "lucide-react";


export function ConfirmPage() {
  const booking = JSON.parse(localStorage.getItem("bookingData") || "{}");

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
      </div>
    </div>
  )
}
