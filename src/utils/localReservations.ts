import type { BookingLocal } from "@/types";

export const RES_KEY = 'my_reservations';

export function getLocalReservations(): BookingLocal[] {
  try {
    const raw = localStorage.getItem(RES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as BookingLocal[];
  } catch (err) {
    console.error('Error leyendo reservas locales', err);
    return [];
  }
}

export function saveLocalReservations(list: BookingLocal[]) {
  try {
    localStorage.setItem(RES_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Error guardando reservas locales', err);
  }
}

export function addLocalReservation(b: BookingLocal) {
  const list = getLocalReservations();
  // evitar duplicados por id
  const exists = list.find(x => x.id === b.id);
  if (!exists) {
    list.push(b);
    saveLocalReservations(list);
  } else {
    // si existe, actualizamos
    updateLocalReservation(b.id, b);
  }
}

export function updateLocalReservation(id: string, patch: Partial<BookingLocal>) {
  const list = getLocalReservations();
  const idx = list.findIndex(x => x.id === id);
  if (idx === -1) return;
  list[idx] = { ...list[idx], ...patch };
  saveLocalReservations(list);
}

export function removeLocalReservation(id: string) {
  let list = getLocalReservations();
  list = list.filter(x => x.id !== id);
  saveLocalReservations(list);
}
