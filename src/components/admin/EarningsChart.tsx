import { useMemo, useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, } from "../../components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Select, SelectTrigger, SelectContent, SelectItem } from "../../components/ui/select";
import { calcEarningsSeries } from "../../utils/calcEarningsSeries";
import { motion, AnimatePresence } from "framer-motion";
import { useBarberContext } from "@/context/BarberContextProvider";
import type { PendingAny } from "@/types";



export function EarningsChart() {
  const { bookings, services } = useBarberContext();
  const [tab, setTab] = useState<"daily" | "weekly" | "monthly">("monthly");
  const [range, setRange] = useState<number>(90); // días o meses visibles
  const [hover, setHover] = useState<{ x: number; y: number; label: string; value: number } | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(600);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // ResizeObserver para responsividad
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Calcular datos según rango seleccionado
  const { series, total, growth } = useMemo(() => {
    let start: string | undefined;
    const now = new Date();
    const end = now.toISOString().slice(0, 10);

    if (tab === "monthly") {
      const s = new Date(now);
      s.setMonth(now.getMonth() - Math.floor(range / 30));
      start = s.toISOString().slice(0, 10);
    } else {
      const s = new Date(now);
      s.setDate(now.getDate() - range);
      start = s.toISOString().slice(0, 10);
    }

    return calcEarningsSeries(bookings, services, tab, { start, end });
  }, [bookings, services, tab, range]);

  // Dimensiones SVG dinámicas
  const width = containerWidth;
  const height = 260;
  const padding = { top: 20, right: 20, bottom: 32, left: 40 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const max = Math.max(...series.map((s) => s.value), 1);
  const points = series.map((s, i) => {
    const x = (i / Math.max(series.length - 1, 1)) * innerW;
    const y = innerH - (s.value / max) * innerH;
    return { ...s, x, y };
  });

  const dLine = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const dArea = `${points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ")} L ${innerW} ${innerH} L 0 ${innerH} Z`;

  return (
    <div className="sm:p-10 p-4 max-w-full">
        <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
            <CardTitle>Ingresos — Evolución ({tab === "monthly" ? "Mensual" : "Diario / Semanal" })</CardTitle>
            <p className="text-sm text-muted-foreground">Visualiza los ingresos a lo largo del tiempo</p>
            </div>

            <div className="flex  gap-3 items-center">
            <Tabs value={tab} onValueChange={(v: PendingAny) => setTab(v)}>
                <TabsList>
                <TabsTrigger value="daily">Día</TabsTrigger>
                <TabsTrigger value="weekly">Semana</TabsTrigger>
                <TabsTrigger value="monthly">Mes</TabsTrigger>
                </TabsList>
            </Tabs>

            <Select onValueChange={(v: string) => setRange(Number(v))} defaultValue="90">
                <SelectTrigger className="w-[100px]">Rango</SelectTrigger>
                <SelectContent>
                <SelectItem value="7">7 días</SelectItem>
                <SelectItem value="30">30 días</SelectItem>
                <SelectItem value="90">90 días</SelectItem>
                <SelectItem value="365">12 meses</SelectItem>
                </SelectContent>
            </Select>
            </div>
        </CardHeader>

        <CardContent ref={containerRef} className="relative">
            <div className="flex items-center justify-between mb-4">
            <div>
                <p className="text-sm text-muted-foreground">Total del periodo</p>
                <p className="text-2xl font-bold">${total.toLocaleString()}</p>
                <p
                className={`text-sm mt-1 ${
                    growth >= 0 ? "text-green-600" : "text-red-600"
                }`}
                >
                {growth >= 0 ? "▲" : "▼"} {Math.abs(growth).toFixed(1)}% respecto al anterior
                </p>
            </div>
            </div>

            <div className="overflow-auto">
            <svg width={width } height={height}>
                <g transform={`translate(${padding.left},${padding.top})`}>
                {/* Grid horizontal */}
                {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
                    const y = innerH - innerH * t;
                    return <line key={i} x1={0} x2={innerW} y1={y} y2={y} stroke="#eee" />;
                })}

                {/* Área animada */}
                <AnimatePresence>
                    <motion.path
                    key={tab + range}
                    d={dArea}
                    fill="rgba(99,102,241,0.1)"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8 }}
                    />
                </AnimatePresence>

                {/* Línea animada */}
                <motion.path
                    d={dLine}
                    fill="none"
                    stroke="#6366F1"
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1 }}
                />

                {/* Puntos interactivos */}
                {points.map((p, i) => (
                    <circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r={4}
                    fill="#6366F1"
                    stroke="#fff"
                    strokeWidth={1.2}
                    onMouseEnter={(e) => {
                        const rect = (e.target as SVGCircleElement).getBoundingClientRect();
                        setHover({
                        x: rect.x + rect.width / 2,
                        y: rect.y,
                        label: p.period,
                        value: p.value,
                        });
                    }}
                    onMouseLeave={() => setHover(null)}
                    style={{ cursor: "pointer" }}
                    />
                ))}

                {/* Etiquetas X */}
                {points.filter((_, i) => i % Math.ceil(points.length / 6) === 0).map((p, i) => (
                    <text
                    key={i}
                    x={p.x}
                    y={innerH + 14}
                    textAnchor="middle"
                    fontSize={10}
                    fill="#6b7280"
                    >
                    {p.period}
                    </text>
                ))}

                {/* Etiquetas Y */}
                {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
                    const y = innerH - innerH * t;
                    const val = Math.round(max * t);
                    return (
                    <text
                        key={i}
                        x={-6}
                        y={y + 2}
                        fontSize={10}
                        textAnchor="end"
                        fill="#6b7280"
                    >
                        ${val.toLocaleString("de-DE")}
                    </text>
                    );
                })}
                </g>
            </svg>
            </div>

            {/* Tooltip flotante */}
            <AnimatePresence>
            {hover && (
                <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                style={{
                    position: "absolute",
                    left: hover.x + 8,
                    top: hover.y - 28,
                    background: "white",
                    padding: "6px 10px",
                    borderRadius: 8,
                    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                    border: "1px solid rgba(0,0,0,0.05)",
                    pointerEvents: "none",
                }}
                >
                <div className="text-xs text-muted-foreground">{hover.label}</div>
                <div className="text-sm font-semibold">${hover.value.toLocaleString()}</div>
                </motion.div>
            )}
            </AnimatePresence>
        </CardContent>
        </Card>        
    </div>
  );
}
