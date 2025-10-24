// Genera horarios cada media hora dentro de un rango (por defecto de 10:00 a 20:00)
export function generateTimes(
  start = '9:00',
  end = '20:00',
  intervalMinutes: number
) {
  const times: string[] = []
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)

  const current = new Date(0, 0, 0, sh, sm)
  const endTime = new Date(0, 0, 0, eh, em)

  while (current <= endTime) {
    const hh = String(current.getHours()).padStart(2, '0')
    const mm = String(current.getMinutes()).padStart(2, '0')
    times.push(`${hh}:${mm}`)
    current.setMinutes(current.getMinutes() + intervalMinutes)
  }

  return times
}
