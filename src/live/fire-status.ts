// The live thing: is the fire lit right now in Lyon? Computed from the opening hours in Europe/Paris time.
// Fire is lit at 17:00 for dinner (Tue–Sat) and at 10:00 for Saturday lunch; it is let down after service.
type Slot = { light: number; open: number; close: number }; // minutes since midnight
const DINNER: Slot = { light: 17 * 60, open: 19 * 60 + 30, close: 23 * 60 };
const LUNCH: Slot = { light: 10 * 60, open: 12 * 60, close: 14 * 60 };
const DAYS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

function slotsFor(day: number): Slot[] {
  if (day === 6) return [LUNCH, DINNER];
  if (day >= 2 && day <= 5) return [DINNER];
  return [];
}
const hm = (m: number) => {
  const h = Math.floor(m / 60), mm = m % 60;
  return mm ? `${h} h ${String(mm).padStart(2, '0')}` : `${h} h`; // clock minutes — taste-skill-ignore
};

function parisNow(): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Paris', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '0';
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  return { day, minutes: Number(get('hour')) * 60 + Number(get('minute')) };
}

export function fireStatus(now = parisNow()): { state: 'lit' | 'out'; text: string } {
  const { day, minutes } = now;
  for (const s of slotsFor(day)) {
    if (minutes >= s.light && minutes < s.open) {
      return { state: 'lit', text: `Le feu est allumé depuis ${hm(s.light)}. Service à ${hm(s.open)}.` };
    }
    if (minutes >= s.open && minutes < s.close) {
      return { state: 'lit', text: `Le feu est allumé, le service a commencé. Dernière commande à ${hm(s.close - 60)}.` };
    }
  }
  // next lighting
  for (let i = 0; i < 8; i++) {
    const d = (day + i) % 7;
    const next = slotsFor(d).find((s) => i > 0 || s.light > minutes);
    if (next) {
      const when = i === 0 ? "aujourd'hui" : i === 1 ? 'demain' : DAYS[d];
      return { state: 'out', text: `Le feu est éteint. On le rallume ${when} à ${hm(next.light)}.` };
    }
  }
  return { state: 'out', text: 'Le feu est allumé à 17 h, du mardi au samedi.' };
}

export function initFireStatus(el: HTMLElement) {
  const text = el.querySelector<HTMLElement>('.fire__text');
  if (!text) return;
  const update = () => {
    try {
      const s = fireStatus();
      el.dataset.state = s.state;
      text.textContent = s.text;
    } catch (err) {
      console.warn('[fire] status unavailable', err);
    }
  };
  update();
  window.setInterval(update, 30_000);
}
