import { useContext, useEffect, useState, type ReactNode } from "react";
import { BarberContext } from "./BarberContext";
import type { Appointment, Barber, Service, Slot } from "@/types";
import axios from "axios";
import { generateTimes } from "@/utils/generateTimes";
import { blockReservatedBooks } from "@/utils/blockReservatedBooks";

export function BarberContextProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<Appointment[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [selectedBarber, setSelectedBarber] = useState("")
  const [services, setServices] = useState<Service[]>([]);
  const [slotList, setSlotList] = useState<Slot[]>([]);
  const [loadingGeneral, setLoadingGeneral] = useState(false);

  // =============================
  //     CARGAR RESERVAS
  // =============================
  async function loadBookings() {
    setLoadingGeneral(true);
    try {
      const { data } = await axios.get(
        "https://barber-service-backend.onrender.com/api/admin/bookings"
      );
      setBookings(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingGeneral(false);
    }
  }

  // =============================
  //     BARBEROS
  // =============================
  async function loadBarbers() {
    setLoading(true);
    try {
      const { data } = await axios.get(
        "https://barber-service-backend.onrender.com/api/services/barbers"
      );
      setBarbers(data || []);
      setSelectedBarber(data[0]?.id || "");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // =============================
  //     SERVICIOS
  // =============================
  async function loadServices() {
    setLoading(true);
    try {
      const { data } = await axios.get(
        "https://barber-service-backend.onrender.com/api/services"
      );
      setServices(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // =============================
  //     GENERAR AGENDA DEL DÍA
  // =============================
  function generateAgendaForDay(date: Date, barberId: string) {
    if (!services.length) return;

    const cutService = services.find((s) => s.name === "Corte clásico");
    const duration = cutService?.duration || 45;

    const dateFormatted = date.toLocaleDateString("en-CA");

    const appointments = bookings.filter(
      (b) => b.date === dateFormatted && b.barber_id === barberId
    );

    const baseSlots = generateTimes("9:00", "20:00", duration);

    const blocked = blockReservatedBooks(baseSlots, appointments, duration);

    setSlotList(blocked);
  }

  // =============================
  //     AUTO-CARGA INICIAL
  // =============================
  useEffect(() => {
    loadBookings();
    loadBarbers();
    loadServices();
  }, []);

  return (
    <BarberContext.Provider
      value={{
        loading,
        bookings,
        loadBookings,
        setBookings,
        setLoading,
        barbers,
        setBarbers,
        selectedBarber,
        setSelectedBarber,
        loadBarbers,
        services,
        setServices,
        loadServices,
        slotList,
        generateAgendaForDay,
        setLoadingGeneral,
        loadingGeneral,
      }}
    >
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


