/**
 * One date format for every row in the portal's lists: "Oct 5 · 4:20 PM".
 * The year shows only when it isn't the current one. Accepts the prototype's "10/05/2026 · 04:20 PM" strings or ISO dates.
 */
const currentYear = 2026 // The prototype's "today" (see timelineFirstData). Swap for new Date().getFullYear() with live data.

export function formatRowDate(value: string, { time = true }: { time?: boolean } = {}) {
  let date: Date | null = null
  const legacy = value.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:\s*·\s*(\d{1,2}):(\d{2})\s*(AM|PM))?$/i)
  if (legacy) {
    const [, month, day, year, hour, minute, meridiem] = legacy
    let h = hour ? Number(hour) % 12 : 0
    if (meridiem?.toUpperCase() === 'PM') h += 12
    date = new Date(Number(year), Number(month) - 1, Number(day), h, minute ? Number(minute) : 0)
    if (!hour) time = false
  } else {
    const parsed = new Date(value)
    if (!Number.isNaN(parsed.getTime())) date = parsed
  }
  if (!date) return value
  const day = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', ...(date.getFullYear() !== currentYear ? { year: 'numeric' } : {}) })
  if (!time) return day
  return `${day} · ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
}
