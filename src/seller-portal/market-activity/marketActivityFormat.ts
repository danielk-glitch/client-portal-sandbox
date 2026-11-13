/** Labels and formatting shared by the Market activity block and its rows. */
import type { CompetingListing, MarketChange } from './marketActivityData'

export const marketChangeLabels: Record<MarketChange, string> = {
  new: 'New',
  'price-drop': 'Price drop',
  pending: 'Pending',
  sold: 'Sold',
  withdrawn: 'Withdrawn',
}

export const currency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
export const number = (value: number) => value.toLocaleString('en-US')

/** "Today", "Yesterday", "3 days ago", "2 weeks ago". Days are ISO (YYYY-MM-DD). */
export function relativeDay(day: string, today: string) {
  const days = Math.round((Date.parse(`${today}T12:00:00Z`) - Date.parse(`${day}T12:00:00Z`)) / 86_400_000)
  if (days <= 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  const weeks = Math.floor(days / 7)
  return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`
}

export function marketChangeCopy(listing: CompetingListing) {
  switch (listing.change) {
    case 'new': return 'Listed'
    case 'price-drop': return listing.previousPrice ? `Price dropped ${currency(listing.previousPrice - listing.price)}` : 'Price dropped'
    case 'pending': return 'Went pending'
    case 'sold': return `Sold for ${currency(listing.price)}`
    case 'withdrawn': return 'Taken off the market'
  }
}
