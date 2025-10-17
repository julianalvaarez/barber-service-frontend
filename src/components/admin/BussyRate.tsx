import { useBarberContext } from "@/context/BarberContextProvider";
import { Card, CardContent, CardHeader, CardTitle } from "../ui";
import { Progress } from "../ui/progress";
import { format } from "date-fns";

export const BussyRate = ({day}: {day: Date}) => {
  const {bookings} = useBarberContext();


  const start = 10;
  const end = 20;
  const totalMinutes = (end - start) * 120;

  const bookingsToday = bookings.filter(b => b.date === format(day, "yyyy-MM-dd"));
    
  const bussyMinutes = bookingsToday.reduce(
    (total, b) => total + b.services.duration,
    0
  );
  
  const occupation = (bussyMinutes / totalMinutes) * 100;

 


  return (
    <div className=" mb-8">
        <Card>
            <CardHeader>
                <CardTitle className="flex flex-col gap-2 sm:flex-row sm:gap-0 justify-between items-center">
                    <span className="font-bold">Ocupación diaria</span> 
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between mb-2">
                <span>{occupation.toFixed(0)}%</span>
                <span className="text-sm text-muted-foreground">{bussyMinutes} / {totalMinutes} min</span>
                </div>
                <Progress value={occupation} />
            </CardContent>
        </Card>        
    </div>
  )
}
