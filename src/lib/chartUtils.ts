// transforma datos del backend (arrays con { week_start, barber_name, cuts_count })

import type { PendingAny } from "../types";

// a estructura: [{ week, barber1: n, barber2: m, ... }, ...] y lista de barbers
export function transformWeekly(rows: PendingAny[]) {
  const weeksMap = new Map<string, PendingAny>();
  const barberSet = new Set<string>();

  rows.forEach((r) => {
    const week = (r.week_start || "").slice(0, 10) || r.week || "sin-semana";
    const barber = r.barber_name || "Sin nombre";
    barberSet.add(barber);

    if (!weeksMap.has(week)) weeksMap.set(week, { week });
    const obj = weeksMap.get(week);
    obj[barber] = Number(r.cuts_count || 0);
  });

  const weeks = Array.from(weeksMap.values()).sort((a, b) => a.week.localeCompare(b.week));
  const barbers = Array.from(barberSet);
  return { weeks, barbers };
}
