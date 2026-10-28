import type { Slot } from '../types/slot'

const DAY_MS = 24 * 60 * 60 * 1000

// A fixed hash keeps the selection identical across reloads, browsers and users.
const stableHash = (value: string): number => {
  let hash = 2166136261
  for (let index = 0; index < value.length; index++) {
    hash = Math.imul(hash ^ value.charCodeAt(index), 16777619)
  }
  return hash >>> 0
}

export const publicBookingSlots = (
  slots: Slot[],
  options: { date: string, today: string, brand: string, masterId: number | null },
): Slot[] => {
  const daysAhead = (Date.parse(options.date) - Date.parse(options.today)) / DAY_MS
  if (!Number.isFinite(daysAhead) || daysAhead < 0 || daysAhead >= 7 || slots.length < 2) {
    return slots
  }

  // Use the appointment date, never today's date, in the seed: a date's
  // selection stays the same as it moves closer within the seven-day window.
  const seed = `${options.brand}:${options.masterId ?? 'any'}:${options.date}`
  const limit = Math.min(3 + stableHash(seed) % 3, Math.ceil(slots.length / 2))
  const ranked = slots.map(slot => ({
    slot,
    start: new Date(slot.start_at).getTime(),
    rank: stableHash(`${seed}:${new Date(slot.start_at).getTime()}`),
  })).sort((a, b) => a.rank - b.rank || a.start - b.start)

  // Prefer different hours so the choices are spread across the day.
  const selected = new Set<Slot>()
  const hours = new Set<number>()
  for (const candidate of ranked) {
    const hour = Math.floor(candidate.start / (60 * 60 * 1000))
    if (hours.has(hour)) continue
    hours.add(hour)
    selected.add(candidate.slot)
    if (selected.size === limit) break
  }
  for (const candidate of ranked) {
    if (selected.size === limit) break
    selected.add(candidate.slot)
  }

  return [...selected].sort((a, b) => Date.parse(a.start_at) - Date.parse(b.start_at))
}
