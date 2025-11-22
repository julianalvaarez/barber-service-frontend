import type { Appointment, Barber, Service } from "@/types";
import { createContext, type Dispatch, type SetStateAction } from "react";

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
  setLoadingGeneral: (loading: boolean) => void;
  loadingGeneral: boolean;
  slotList: import("@/types").Slot[];
  generateAgendaForDay: (date: Date, barberId: string) => void;
  selectedBarber: string;
  setSelectedBarber: Dispatch<SetStateAction<string>>
};


export const BarberContext = createContext<ContextType | undefined>(undefined);