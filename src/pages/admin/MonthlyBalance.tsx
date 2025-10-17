import { BussyRate } from "@/components/admin/BussyRate";
import { CommissionBarber } from "@/components/admin/CommissionBarber";
import { CutsChart } from "@/components/admin/CutsChart";
import { EarningsChart } from "@/components/admin/EarningsChart";
import { Button, Card, CardContent, CardHeader } from "@/components/ui";
import type { PendingAny } from "@/types";
import { addDays, format, subDays } from "date-fns";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";

export const MonthlyBalance = () => {
  const [day, setDay] = useState< PendingAny >(new Date())

    const nextDay = () => {
    setDay((prevDate: PendingAny) => addDays(prevDate, 1));
  };

  const prevDay = () => {
    setDay((prevDate: PendingAny) => subDays(prevDate, 1));
  };  
  return (
    <section>
      <div className="mt-[100px] space-y-10 mx-4 xl:space-y-0 md:mx-0 xl:flex ">
        <Card className="md:flex-1 md:mx-10">
          <CardHeader>
            <div className="flex items-center gap-1 mx-auto my-6">
              <Button variant="outline" size="icon" onClick={prevDay} className="cursor-pointer" >
                  <ArrowLeft />
              </Button>
              <span>{format(day, "dd/MM/yyyy")}</span>
              <Button variant="outline" size="icon" onClick={nextDay} className="cursor-pointer" >
                  <ArrowRight/>
              </Button>

            </div>          
          </CardHeader>
          <CardContent>
            <BussyRate day={day} />
            <CommissionBarber day={day} />
          </CardContent>
        </Card>
        <CutsChart />
      </div>   
      <div >
        <EarningsChart />
      </div>   
    </section>
  );
}
