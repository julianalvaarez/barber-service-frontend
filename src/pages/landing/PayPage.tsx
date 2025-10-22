import type { ResApi } from '../../types'
import { useEffect, useState } from 'react'
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import axios from 'axios'

export function PayPage() {
  const [preferenceId, setPreferenceId] = useState<{ newPreferenceId: string} | null>(null)
  const [loading, setLoading] = useState(false)
  const bookingData = JSON.parse(localStorage.getItem('bookingData') || '{}')
  const { name, phone, date, time, deposit, serviceId, barberId, serviceName, barberName } = bookingData


  const createPreference = async () => {
    setLoading(true)
    try {
        const {data}: ResApi = await axios.post('http://localhost:4000/api/bookings', {
        service_id: serviceId,
        date,
        time,
        clientTel: Number(phone),
        clientName: name,
        barberId: barberId || "No especificado"
    })
    setPreferenceId(data)
    } catch (err) {
    console.error(err)
    } finally { setLoading(false) }
  }

  useEffect(() => {
    initMercadoPago('APP_USR-82304fa9-b779-465e-9778-05d8207a2fa7');
  }, [])
  

  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 px-4">
      <div className="absolute inset-0 z-0">
        <img
          src="/modern-barbershop-interior-dark-moody-professional.jpg"
          alt="Barbershop"
          className="w-full h-full object-cover opacity-80"
        />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
      </div>
      <div className='container mx-auto z-10 max-w-4xl shadow-lg p-8 '>
        <h1 className="text-primary text-2xl font-bold tracking-wider uppercase mb-4">Confirmar Reserva</h1>
        <p className="mb-2"><strong>Nombre:</strong> {name}</p>
        <p className="mb-2"><strong>Teléfono:</strong> {phone}</p>
        <p className="mb-2"><strong>Fecha:</strong> {date}</p>
        <p className="mb-2"><strong>Hora:</strong> {time}</p>
        <p className="mb-2"><strong>Servicio:</strong> {serviceName}</p>
        <p className="mb-2"><strong>Peluquero:</strong> {barberName}</p>
      <button onClick={createPreference} disabled={loading} className="bg-primary text-primary-foreground font-bold py-3 px-5 z-10 w-full  mx-auto mt-6 shadow-lg shadow-primary/20">
        {loading ? 'Procesando...' : `Pagar Seña $${deposit || 0}`}
      </button>
      {preferenceId && (
          <div>
              <Wallet initialization={{ preferenceId: preferenceId }} />
          </div>
      )}

      </div>
    </section>
  )
}
