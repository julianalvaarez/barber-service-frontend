import type { PendingAny } from "@/types"

export interface SlotEx {
  hour: string
  availability: boolean
  bookInfo?: PendingAny
  canStart?: boolean
  willOccupy?: number
}

export function computeStartableSlots(
  slots: SlotEx[],
  durationMin: number,
  intervalMin = 45
): SlotEx[] {
  const needed = Math.ceil(durationMin / intervalMin)
  const out = slots.map((s) => ({ ...s, canStart: false, willOccupy: 0 }))

  for (let i = 0; i < slots.length; i++) {
    let ok = true
    for (let j = 0; j < needed; j++) {
      const idx = i + j
      if (idx >= slots.length) {
        ok = false
        break
      }
      if (!slots[idx].availability) {
        ok = false
        break
      }
    }
    if (ok) {
      out[i].canStart = true
      out[i].willOccupy = needed
    }
  }

  return out
}