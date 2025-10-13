import type { Service } from '../../types';
import { Link } from 'react-router-dom'


export function ServiceCard({ service }: { service: Service }) {
return (
    <article className="border rounded-md p-4 bg-white">
        <h3 className="text-lg font-semibold">{service.name}</h3>
        <p className="text-sm">Duración: {service.duration ?? 30} min</p>
        <p className="mt-2 font-bold">${service.price}</p>
        <div className="mt-4">
            <Link to={`/book?serviceId=${service.id}`} className="inline-block px-4 py-2 bg-blue-600 text-white rounded">Reservar</Link>
        </div>
    </article>
)
}