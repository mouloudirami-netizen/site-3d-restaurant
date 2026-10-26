import { DAY_NAMES, type Restaurant, type Slot } from '../data/restaurants'

// Heure locale d'Alger (UTC+1, sans heure d'été), quel que soit le fuseau du visiteur.
export function algiersNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Algiers',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '0'
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'))
  return { day, minutes: Number(get('hour')) * 60 + Number(get('minute')) }
}

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

export const formatHour = (hhmm: string) => hhmm.replace(':', 'h')

function slotFor(r: Restaurant, day: number): Slot | undefined {
  return r.slots.find((s) => s.days.includes(day))
}

export type OpenStatus = { open: boolean; label: string }

export function openStatus(r: Restaurant, date = new Date()): OpenStatus {
  const { day, minutes } = algiersNow(date)
  const yesterday = (day + 6) % 7

  // Service de la veille qui se prolonge après minuit.
  const prev = slotFor(r, yesterday)
  if (prev && toMin(prev.close) < toMin(prev.open) && minutes < toMin(prev.close)) {
    return { open: true, label: `Ouvert · ferme à ${formatHour(prev.close)}` }
  }

  const today = slotFor(r, day)
  if (today) {
    const o = toMin(today.open)
    const c = toMin(today.close)
    const wraps = c < o
    if (minutes >= o && (wraps || minutes < c)) {
      return { open: true, label: `Ouvert · ferme à ${formatHour(today.close)}` }
    }
    if (minutes < o) return { open: false, label: `Fermé · ouvre à ${formatHour(today.open)}` }
  }

  for (let i = 1; i <= 7; i++) {
    const d = (day + i) % 7
    const next = slotFor(r, d)
    if (next) {
      const when = i === 1 ? 'demain' : DAY_NAMES[d].toLowerCase()
      return { open: false, label: `Fermé · ouvre ${when} à ${formatHour(next.open)}` }
    }
  }
  return { open: false, label: 'Fermé' }
}

const RANGE_LABELS: Record<string, string> = {
  '6,0,1,2,3,4': 'Samedi – Jeudi',
  '0,1,2,3,4': 'Dimanche – Jeudi',
  '5': 'Vendredi',
  '6': 'Samedi',
}

export function slotLabel(slot: Slot) {
  return RANGE_LABELS[slot.days.join(',')] ?? slot.days.map((d) => DAY_NAMES[d]).join(', ')
}

export function isTodaySlot(slot: Slot, date = new Date()) {
  const { day, minutes } = algiersNow(date)
  // Entre minuit et la fermeture, c'est encore le service de la veille.
  const serviceDay = minutes < 6 * 60 ? (day + 6) % 7 : day
  return slot.days.includes(serviceDay)
}
