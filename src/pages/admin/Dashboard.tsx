import { Agenda } from '../../components/admin/Agenda'

export function Dashboard() {
  return (
    <div className="space-y-6 bg-backgound">
      <h1 className="text-2xl font-bold">Panel del barbero</h1>
      <Agenda />
    </div>
  )
}
