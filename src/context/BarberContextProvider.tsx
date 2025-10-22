import { useContext, useEffect, useState, type ReactNode } from "react";
import { BarberContext } from "./BarberContext";
import type { Appointment, Barber, Service } from "@/types";
import axios from "axios";



export function BarberContextProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false)
  const [bookings, setBookings] = useState<Appointment[] >([]) 
  const [barbers, setBarbers] = useState<Barber[]>([])
  const [services, setServices] = useState<Service[]>([])
 
  async function loadBookings() {
    setLoading(true);
    try {
      const { data } = await axios.get('https://barber-service-backend.onrender.com/api/admin/bookings');
      setBookings(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadBarbers() {
    setLoading(true);
    try {
      const { data } = await axios.get("https://barber-service-backend.onrender.com/api/services/barbers");
      setBarbers(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadServices() {
    setLoading(true);
    try {
      const { data } = await axios.get("https://barber-service-backend.onrender.com/api/services");
      setServices(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
    loadBarbers();
    loadServices();
  }, [])
  

  return (
    <BarberContext.Provider value={{ loading, bookings, loadBookings, setBookings, setLoading, barbers, setBarbers, loadBarbers, services, setServices, loadServices }}>
      {children}
    </BarberContext.Provider>
  );
}

export function useBarberContext() {
  const context = useContext(BarberContext);
  if (!context) {
    throw new Error("useBarberContext debe usarse dentro de un Provider");
  }
  return context;
}