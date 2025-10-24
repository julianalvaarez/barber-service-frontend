import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import axios from "axios";
import { useBarberContext } from "@/context/BarberContextProvider";
import { infoNotify, successNotify } from "@/lib/toasts";

export function ConfigPage() {
  const { services, loadServices, barbers, loadBarbers } = useBarberContext();
  const [loading, setLoading] = useState(false);
  const [editingBarber, setEditingBarber] = useState<{ id: string; field: "name" | "phone" } | null>(null);
  const [newBarber, setNewBarber] = useState({ name: "", phone: "" });

  // === SERVICIOS ===
  async function updateService(id: string, updates: { price?: number; duration?: number; deposit?: number }) {
    setLoading(true);
    try {
      await axios.put(`https://barber-service-backend.onrender.com/api/services/${id}`, updates);
      await loadServices();
    } finally {
      setLoading(false);
      successNotify("Servicio actualizado");
    }
  }

  async function deleteService(id: string) {
    const ok = confirm("¿Seguro que deseas eliminar este servicio?");
    if (!ok) return;
    await axios.delete(`https://barber-service-backend.onrender.com/api/services/${id}`);
    await loadServices();
    successNotify("Servicio eliminado");
  }

  // === BARBEROS ===
  async function updateBarber(id: string, updates: { name?: string; phone?: string }) {
    setLoading(true);
    try {
      await axios.put(`https://barber-service-backend.onrender.com/api/services/barbers/${id}`, updates);
      await loadBarbers();
    } finally {
      setLoading(false);
      setEditingBarber(null);
      successNotify("Barbero actualizado");
    }
  }

  async function deleteBarber(id: string) {
    const ok = confirm("¿Seguro que deseas eliminar este barbero?");
    if (!ok) return;
    await axios.delete(`https://barber-service-backend.onrender.com/api/services/barbers/${id}`);
    await loadBarbers();
    successNotify("Barbero eliminado");
  }

  async function addBarber(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!newBarber.name || !newBarber.phone) return infoNotify("Completa ambos campos");
    setLoading(true);
    try {
      await axios.post(`https://barber-service-backend.onrender.com/api/services/barbers`, newBarber);
      setNewBarber({ name: "", phone: "" });
      await loadBarbers();
    } finally {
      setLoading(false);
      successNotify("Barbero agregado");
    }
  }

  // Maneja salida o Enter para cerrar el input
  function handleEditEnd(e: React.KeyboardEvent<HTMLInputElement>, barberId: string, field: "name" | "phone") {
    if (e.key === "Enter" || e.key === "Escape") {
      const value = (e.target as HTMLInputElement).value;
      if (e.key === "Enter") updateBarber(barberId, { [field]: value });
      else setEditingBarber(null);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-3 sm:px-6 bg-background mt-16 md:flex-row md:justify-around md:gap-5  md:items-start">
      {/* === SERVICIOS === */}
      <Card className="w-full max-w-3xl shadow-xl border border-border bg-card/90 backdrop-blur-sm ">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Ajustes de Servicios</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {services.map((s) => (
            <div
              key={s.id}
              className="bg-card border border-border rounded-2xl shadow-sm p-4 space-y-4 transition hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-primary">{s.name}</h2>
                  <p className="text-sm text-muted-foreground">Duración: {s.duration} min</p>
                </div>
                <Button onClick={() => deleteService(s.id)} variant="destructive" size="sm">
                  Eliminar
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <label className="text-xs text-muted-foreground font-semibold mb-1">Precio ($)</label>
                  <Input
                    defaultValue={s.price}
                    type="number"
                    onBlur={(e) => updateService(s.id, { price: Number(e.target.value) })}
                    className="text-center bg-background border-border shadow-sm focus:ring-primary/50"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs text-muted-foreground font-semibold mb-1">Duración (min)</label>
                  <Input
                    defaultValue={s.duration}
                    type="number"
                    onBlur={(e) => updateService(s.id, { duration: Number(e.target.value) })}
                    className="text-center bg-background border-border shadow-sm focus:ring-primary/50"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs text-muted-foreground font-semibold mb-1">Seña ($)</label>
                  <Input
                    defaultValue={s.deposit}
                    type="number"
                    onBlur={(e) => updateService(s.id, { deposit: Number(e.target.value) })}
                    className="text-center bg-background border-border shadow-sm focus:ring-primary/50"
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* === BARBEROS === */}
      <Card className="w-full max-w-3xl shadow-xl border border-border bg-card/90 backdrop-blur-sm mt-10 md:mt-0 ">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Barberos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {barbers.map((b) => (
            <div
              key={b.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-card border border-border rounded-xl p-3 gap-2 hover:shadow-md transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
                {/* === Nombre === */}
                {editingBarber?.id === b.id && editingBarber.field === "name" ? (
                  <Input
                    autoFocus
                    defaultValue={b.name}
                    onBlur={(e) => updateBarber(b.id, { name: e.target.value })}
                    onKeyDown={(e) => handleEditEnd(e, b.id, "name")}
                    className="max-w-[150px] text-center"
                  />
                ) : (
                  <p
                    className="font-semibold cursor-pointer hover:underline"
                    onClick={() => setEditingBarber({ id: b.id, field: "name" })}
                  >
                    {b.name}
                  </p>
                )}

                {/* === Teléfono === */}
                {editingBarber?.id === b.id && editingBarber.field === "phone" ? (
                  <Input
                    autoFocus
                    defaultValue={b.phone}
                    onBlur={(e) => updateBarber(b.id, { phone: e.target.value })}
                    onKeyDown={(e) => handleEditEnd(e, b.id, "phone")}
                    className="max-w-[160px] text-center"
                  />
                ) : (
                  <p
                    className="cursor-pointer text-sm hover:underline"
                    onClick={() => setEditingBarber({ id: b.id, field: "phone" })}
                  >
                    {b.phone}
                  </p>
                )}
              </div>

              <Button onClick={() => deleteBarber(b.id)} variant="destructive" size="sm">
                Eliminar
              </Button>
            </div>
          ))}

          {/* === NUEVO BARBERO === */}
          <div className="border-t border-border pt-4">
            <h3 className="font-semibold mb-2 text-center sm:text-left">Agregar nuevo barbero</h3>
            <form onSubmit={addBarber} className="flex flex-col sm:flex-row gap-3 items-center">
              <Input
                placeholder="Nombre"
                value={newBarber.name}
                onChange={(e) => setNewBarber({ ...newBarber, name: e.target.value })}
                className="sm:flex-1"
              />
              <Input
                placeholder="Teléfono"
                value={newBarber.phone}
                onChange={(e) => setNewBarber({ ...newBarber, phone: e.target.value })}
                className="sm:flex-1"
              />
              <Button type="submit" disabled={loading}>
                Agregar
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

          

    </div>
  );
}
