// src/utils/calcIncomeSeries.ts
import type { Booking, Service } from '../types';
import { getBookingAmount, getWeekKey, getMonthKey, formatDay, generateDays, generateWeeks, generateMonths, normalizeSeries } from './earningsUtils';

type Period = 'daily' | 'weekly' | 'monthly';

export function calcEarningsSeries( bookings: Booking[], services: Service[], period: Period, options?: { start?: string; end?: string; statusInclude?: string[] } ) {
  // default: last 30 days for daily, last 12 weeks for weekly, last 12 months for monthly
  const now = new Date();
  let start: string;
  let end = formatDay(now);

  if (options?.start) start = options.start;
  else {
    if (period === 'daily') {
      const s = new Date(now); s.setDate(now.getDate() - 29); start = formatDay(s);
    } else if (period === 'weekly') {
      const s = new Date(now); s.setDate(now.getDate() - (7*11)); start = formatDay(s);
    } else {
      const s = new Date(now); s.setMonth(now.getMonth() - 11); start = formatDay(s);
    }
  }
  if (options?.end) end = options.end;

  // filter bookings by status if provided
  const allowedStatuses = options?.statusInclude ?? ['paid']; // por defecto solo 'paid'

  // map bookings -> { key, amount }
  const map: Record<string, number> = {};

  for (const b of bookings) {
    if (!allowedStatuses.includes(b.status ?? '')) continue;
    // obtain date string to bucket: prefer created_at if exists else b.date
    const dateStr = b.date ? b.date.slice(0,10) : null
    if (!dateStr) continue;

    const amount = getBookingAmount(b, services);
    let key = '';
    if (period === 'daily') key = formatDay(new Date(dateStr));
    else if (period === 'weekly') key = getWeekKey(dateStr);
    else key = getMonthKey(dateStr);

    map[key] = (map[key] || 0) + amount;
  }

  // generate timeline keys
  let keys: string[] = [];
  if (period === 'daily') keys = generateDays(start, end);
  else if (period === 'weekly') keys = generateWeeks(start, end);
  else keys = generateMonths(start, end);

  const series = normalizeSeries(keys, map); // [{period, value}]
  const total = series.reduce((s, it) => s + it.value, 0);

  // growth: compare last two points if available
  const last = series[series.length - 1] || { value: 0 };
  const prev = series[series.length - 2] || { value: 0 };
  const growth = prev.value === 0 ? (last.value === 0 ? 0 : 100) : ((last.value - prev.value) / prev.value) * 100;

  return { series, total, growth };
}
