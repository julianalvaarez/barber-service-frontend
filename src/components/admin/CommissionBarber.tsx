import { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { useBarberContext } from "@/context/BarberContextProvider";
import { format } from "date-fns";

export function CommissionBarber({day}: {day: Date}) {
  const { barbers, services, bookings } = useBarberContext();

  const data = useMemo(() => {
    if (!barbers?.length || !services?.length || !bookings?.length) return [];

    const serviceMap = new Map(services.map(s => [s.id, s.price || 0]));
    const commissionMap = new Map(barbers.map(b => [b.id, 0.4]));

    // Filtrar solo turnos de hoy y pagados/completados
    const todayBookings = bookings.filter(b => b.date === format(day, "yyyy-MM-dd"));

    // Agrupar ingresos por barbero
    const result: Record<string, { barber: string; total: number; barber_income: number; shop_income: number }> = {};

    todayBookings.forEach(b => {
      const barberId = b.barber_id;
      const barber = barbers.find(x => x.id === barberId);
      const price = serviceMap.get(b.service_id) || 0;
      const pct = commissionMap.get(barberId) || 0.4;

      if (!barber) return;

      if (!result[barberId]) {
        result[barberId] = { barber: barber.name, total: 0, barber_income: 0, shop_income: 0 };
      }

      result[barberId].total += price;
      result[barberId].barber_income += price * pct;
      result[barberId].shop_income += price * (1 - pct);
    });

    return Object.values(result);
  }, [barbers, services, bookings, day]);

  // Totales generales
  const totals = data.reduce(
    (acc, d) => ({
      total: acc.total + d.total,
      barber: acc.barber + d.barber_income,
      shop: acc.shop + d.shop_income,
    }),
    { total: 0, barber: 0, shop: 0 }
  );

  if (!data.length) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Ingresos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-6">No hay ingresos registrados hoy.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Ingresos</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Peluquero</TableHead>
              <TableHead className="text-right">Total generado</TableHead>
              <TableHead className="text-right">Comisión (40%)</TableHead>
              <TableHead className="text-right">Parte del local</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{row.barber}</TableCell>
                <TableCell className="text-right">${row.total.toLocaleString()}</TableCell>
                <TableCell className="text-right text-green-600">${row.barber_income.toLocaleString()}</TableCell>
                <TableCell className="text-right text-blue-600">${row.shop_income.toLocaleString()}</TableCell>
              </TableRow>
            ))}

            <TableRow className="font-semibold border-t">
              <TableCell>Total general</TableCell>
              <TableCell className="text-right">${totals.total.toLocaleString()}</TableCell>
              <TableCell className="text-right">${totals.barber.toLocaleString()}</TableCell>
              <TableCell className="text-right">${totals.shop.toLocaleString()}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
