import type { Appointment } from "@/types";

/**
 * Devuelve un array de objetos con:
 * { hour: string, availability: boolean, bookInfo?: { client, serviceName } }
 */
export function blockReservatedBooks(times: string[], bookings: Appointment[], intervals: number) {
  const result = times.map((hour) => ({
    hour,
    availability: true,
    bookInfo: null as null | Appointment,
  }));

  for (const book of bookings) {
    const startIdx = result.findIndex((t) => t.hour === book.time);
    if (startIdx === -1) continue;

    // Duración total en minutos => cantidad de bloques de 30 min
    const blocks = Math.ceil(book.services.duration / intervals);

    for (let i = 0; i < blocks; i++) {
      const target = result[startIdx + i];
      if (!target) continue;
      target.availability = false;

      // Asignar la info del turno original
      target.bookInfo = book;
    }
  }

  return result;
}
