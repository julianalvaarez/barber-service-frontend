// src/pages/admin/BookingDetailModal.tsx
import { useEffect, useState } from 'react'
import api from '../../lib/api'
import { supabase } from '../../lib/supabaseClient'
import type { PendingAny } from '../../types'
import axios from 'axios'

export function BookingDetailModal({ booking, onClose }: { booking:PendingAny, onClose: ()=>void }) {
  const isNew = !booking.id
  const [user, setUser] = useState({ name: '', phone: '', email: '' })
  const [serviceId, setServiceId] = useState<string | null>(booking.service_id || null)
  const [barbers, setBarbers] = useState<PendingAny[]>([])
  const [services, setServices] = useState<PendingAny[]>([])

  useEffect(()=>{ loadMeta() }, [])

  async function loadMeta(){
    const sb = await api.get('/api/admin/barbers')
    setBarbers(sb.data || [])
    const sv = await supabase.from('services').select('*')
    setServices(sv.data || [])
    if (!serviceId && sv.data && sv.data[0]) setServiceId(sv.data[0].id)
  }

  useEffect(()=>{
    if (!isNew && booking.users) {
      setUser({ name: booking.users.name, phone: booking.users.phone, email: booking.users.email })
    }
  }, [booking])

  async function createManual(){
    try {
      const payload = {
        user: { name: user.name, phone: user.phone, email: user.email },
        service_id: serviceId,
        date: booking.date,
        time: booking.time,
        barber_id: booking.barber_id,
        status: 'paid'
      }
      await axios.post('http://localhost:4000/api/admin/bookings-admin', payload)
      onClose()
    } catch (err) {
      console.error(err)
  }}

  async function cancelBooking(){
    try {
      await axios.delete(`http://localhost:4000/api/admin/bookings/${booking.id}`)
      onClose()
    } catch (err) { console.error(err) }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded w-full max-w-md">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-semibold">{isNew ? 'Agregar turno' : 'Detalle turno'}</h4>
          <button onClick={onClose} className="text-sm">Cerrar</button>
        </div>

        <div className="space-y-2">
          <div>
            <label className="text-xs">Fecha</label>
            <div className="font-mono">{booking.date} {booking.time}</div>
          </div>

         <div className='p-10 bg-red-50'>
            <div>
                <label className="text-xs">Peluquero</label>
                <select className="w-full border p-1 rounded" value={booking.barber_id || ''} onChange={(e)=> booking.barber_id = e.target.value}>
                <option value="">--</option>
                {barbers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
            </div>

            <div>
                <label className="text-xs">Servicio</label>
                <select className="w-full border p-1 rounded" value={serviceId || ''} onChange={(e)=> setServiceId(e.target.value)}>
                {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
            </div>
         </div>

          <div>
            <label className="text-xs">Cliente</label>
            <input className="w-full border p-1 rounded" value={user.name} onChange={e=>setUser({...user, name: e.target.value})} placeholder="Nombre" />
            <input className="w-full border p-1 rounded mt-1" value={user.phone} onChange={e=>setUser({...user, phone: e.target.value})} placeholder="Teléfono" />
          </div>

          <div className="flex gap-2 mt-3">
            {isNew ? (
              <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={createManual}>Crear</button>
            ) : (
              <>
                <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={cancelBooking}>Cancelar</button>
              </>
            )}
            <button className="px-3 py-1 bg-gray-200 rounded" onClick={onClose}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  )
}
