export type Service = {
id: string
name: string
price: number
deposit?: number
duration?: number
}

export type Booking = {
id: string
service_id: string
date: string
time: string
status: string
}

export type PendingAny =  any

export type ServicesBarber = {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>,
    title: string,
    description: string,
    price: number,
}

export type ResApi = {
    data: { newPreferenceId: string },
}

export type TimeBooking = {
    hour: string,
    availability: boolean,
}

export interface Appointment {
  id: string;
  barber_id: string;
  client: string;
  client_phone: number;
  created_at: string;
  date: string;
  payment_id: string | null;
  service_id: string;
  services: {
    name: string;
    duration: number;
  };
  status: "pending" | "paid" | "cancelled" | string;
  time: string;
}


export interface Barber {
  id: string;
  name: string;
  phone: string;
  photo?: string | null;
  active: boolean;
  created_at?: string;
}

export interface OpenBooking {
 date: string, 
 time: string, 
 barber_id: string

}

export interface Slot {
  hour: string;
  availability: boolean;
  bookInfo?: Appointment | null;
}