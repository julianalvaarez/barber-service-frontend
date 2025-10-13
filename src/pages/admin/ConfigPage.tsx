// src/pages/admin/SettingsServices.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Card, CardHeader, CardTitle, CardContent } from "../../components//ui/card";
import { Input } from "../../components//ui/input";
import { Button } from "../../components/ui/button";
import type { Service } from "../../types";
import axios from "axios";

export function ConfigPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
  }, [])
  

  async function load(){
    const { data } = await supabase.from("services").select("*").order("name");
    setServices(data || []);
  }

  async function updateService(id:string, updates:{ price?: number, duration?: number, deposit?: number }){
    setLoading(true);
    try {
      await axios.put(`http://localhost:4000/api/admin/services/${id}`, updates);
      await load();
    } finally { setLoading(false); }
  }

  async function deleteService(id:string){
      const ok = confirm("¿Seguro que deseas eliminar este servicio?");
      if (!ok) return;
      await axios.put(`http://localhost:4000/api/admin/services/${id}`);
      await load();
  }

  return (
      <div className="md:flex md:items-center md:h-screen md:justify-center">
        <Card className="max-w-6xl mx-auto " >
          <CardHeader>
            <CardTitle className="text-2xl">Ajustes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 ">
              {services.map(s => (
                <div key={s.id} className="flex flex-col md:flex-row gap-3 items-center border-b border-border py-3 ">
                  <div className="flex-1 flex flex-col md:flex-row gap-3 items-center">
                    <div className="font-medium">{s.name}</div>
                    <div className="text-sm text-muted-foreground">Duración: {s.duration} min</div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex gap-3 items-center">
                        {
                          loading 
                          ? <div className="text-sm text-muted-foreground">Guardando...</div> 
                          : (
                            <div className="flex gap-5 flex-col md:flex-row ">
                              <div className="flex gap-5 flex-col md:flex-row">
                                <div className="flex gap-1 items-center">
                                  <Input defaultValue={s.price} type="number" id="price" onBlur={(e)=>updateService(s.id, { price: Number(e.target.value) })} className="w-28" />
                                  <label htmlFor="price" className="text-xs font-semibold">$</label>
                                </div>
                                <div className="flex gap-1 md:border-x md:border-border md:px-4 items-center">
                                  <Input defaultValue={s.duration} type="number" id="minutes" onBlur={(e)=>updateService(s.id, { duration: Number(e.target.value) - 1 })}   className="w-28" />
                                  <label htmlFor="minutes" className="text-xs">min</label>
                                </div>
                              </div>
                              <div>
                                <Input defaultValue={s.deposit} type="number" id="deposit" onBlur={(e)=>updateService(s.id, { deposit: Number(e.target.value) })} className="w-28" />
                                <label htmlFor="deposit" className="text-xs font-semibold">$ Seña</label>
                              </div>
                            </div>
                          )
                        }

                        
                    </div>
                    <Button onClick={()=>deleteService(s.id)} variant="outline" >Eliminar</Button>
                  </div>
                </div>
              ))}
            </div>
            {loading && <div className="text-sm text-muted-foreground mt-2">Guardando...</div>}
          </CardContent>        
        </Card>
      </div>
  );
}
