import { Card, CardHeader, CardTitle, CardContent, } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent, } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import type { PendingAny } from "@/types";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, } from "recharts"
import { ChartContainer, ChartTooltipContent, ChartLegend, ChartLegendContent, } from "@/components/ui/chart"
import { useEffect, useState } from "react";
import axios from "axios";


interface BarberStat {
  barber_id: string;
  barber_name: string;
  cuts: number;
}

export const CutsChart = () => {
  const [period, setPeriod] = useState<"week" | "month">("week");
  const [stats, setStats] = useState<BarberStat[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async (p: "week" | "month") => {
    try {
      setLoading(true);
      const { data } = await axios.get( `https://barber-service-backend.onrender.com/api/admin/stats/barber-cuts?period=${p}` );
      setStats(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(period);
  }, [period]);

  return (
    <div className="md:flex-1 md:mx-10">
        <Card className="px-6  sm:mx-auto">
            <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold">
                Cortes por peluquero
            </CardTitle>
            </CardHeader>

            <CardContent>
            <Tabs value={period} onValueChange={(v: PendingAny ) => setPeriod(v)}>
                <TabsList className="mb-4">
                <TabsTrigger value="week">Semana</TabsTrigger>
                <TabsTrigger value="month">Mes</TabsTrigger>
                </TabsList>

                {loading ? (
                <Skeleton className="h-64  rounded-lg" />
                ) : (
                <>
                    <TabsContent value="week">
                    <ChartContainer
                        config={{
                        total: {
                            label: "Total Gastado",
                            color: "rgba(255, 255, 255, .7)", // usa color rojo del theme
                        },
                        }}
                        className="h-[400px] w-full"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="barber_name" />
                            <YAxis />
                            <Tooltip content={<ChartTooltipContent />} />
                            <ChartLegend content={<ChartLegendContent />} />
                            <Bar dataKey="cuts" fill="var(--color-total)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                    </TabsContent>

                    <TabsContent value="month">
                    <ChartContainer
                        config={{
                        total: {
                            label: "Total Gastado",
                            color: "rgba(255, 255, 255, .7)", // usa color rojo del theme
                        },
                        }}
                        className="h-[400px] w-full"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="barber_name" />
                            <YAxis />
                            <Tooltip content={<ChartTooltipContent />} />
                            <ChartLegend content={<ChartLegendContent />} />
                            <Bar dataKey="cuts" fill="var(--color-total)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                    </TabsContent>
                </>
                )}
            </Tabs>
            </CardContent>
        </Card>      
    </div>
  )
}
