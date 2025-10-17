import type { Appointment, Barber, Service } from "@/types";
import { createContext } from "react";

type ContextType = {
  loading: boolean;
  bookings: Appointment[];
  loadBookings: () => Promise<void>;
  setBookings: (bookings: Appointment[]) => void;
  setLoading: (loading: boolean) => void;
  barbers: Barber[]
  setBarbers: (barbers: Barber[]) => void;
  loadBarbers: () => Promise<void>;
  services: Service[]
  setServices: (services: Service[]) => void;
  loadServices: () => Promise<void>;
};


export const BarberContext = createContext<ContextType | undefined>(undefined);