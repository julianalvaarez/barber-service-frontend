// src/utils/income.ts

import type { Booking, Service } from "@/types";

/**
 * Obtener amount de un booking mirando su service_id en services.
 * Si no hay price: 0
 */
export function getBookingAmount(booking: Booking, services: Service[]) {
  const svc = services.find(s => s.id === booking.service_id);
  return svc ? Number(svc.price) : 0;
}

/**
 * Formatea una Date a YYYY-MM-DD (día)
 */
export function formatDay(d: Date) {
  return d.toISOString().slice(0, 10);
}

/**
 * Devuelve la semana (YYYY-Www) basada en ISO week number simplificada (usamos año-weekStartDate)
 * Para simplicidad aquí usamos monday-start approximation: weekStart = fecha - (díaSemana-1)
 */
export function getWeekKey(dateStr: string) {
  const d = new Date(dateStr);
  // calcula comienzo de semana (lunes)
  const day = d.getDay(); // 0=Dom,1=Lun...
  const diffToMonday = (day === 0 ? -6 : 1 - day); // si domingo -> -6, si lunes 0
  const monday = new Date(d);
  monday.setDate(d.getDate() + diffToMonday);
  const key = formatDay(monday); // week key = yyyy-mm-dd of monday
  return key;
}

/**
 * Devuelve mes clave "YYYY-MM"
 */
export function getMonthKey(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
}

/**
 * Normaliza una lista de pares {key, value} a un array ordenado de periodos entre start y end
 * start/end son strings con formato del periodo que uses (ejemplo: days 'YYYY-MM-DD')
 * Para días: start y end en YYYY-MM-DD
 * Esta función asume que el caller calcula el rango.
 */
export function normalizeSeries(periodKeys: string[], seriesMap: Record<string, number>) {
  return periodKeys.map(k => ({ period: k, value: seriesMap[k] ? Number(seriesMap[k]) : 0 }));
}

/**
 * Genera array de días (YYYY-MM-DD) entre start y end inclusive
 */
export function generateDays(start: string, end: string) {
  const out: string[] = [];
  const cur = new Date(start);
  const last = new Date(end);
  while (cur <= last) {
    out.push(formatDay(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return out;
}

/**
 * Genera array de semanas (usar Monday keys) entre start and end (dates YYYY-MM-DD)
 */
export function generateWeeks(start: string, end: string) {
  const out: string[] = [];
  const cur = new Date(start);
  // mover al lunes de la semana del start
  const d = cur.getDay();
  const diffToMonday = (d === 0 ? -6 : 1 - d);
  cur.setDate(cur.getDate() + diffToMonday);
  const last = new Date(end);
  while (cur <= last) {
    out.push(formatDay(cur)); // monday date
    cur.setDate(cur.getDate() + 7);
  }
  return out;
}

/**
 * Genera array de meses entre start and end (inclusive) como 'YYYY-MM'
 */
export function generateMonths(start: string, end: string) {
  const out: string[] = [];
  const s = new Date(start);
  s.setDate(1);
  const l = new Date(end);
  l.setDate(1);
  while (s <= l) {
    out.push(`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,'0')}`);
    s.setMonth(s.getMonth()+1);
  }
  return out;
}
