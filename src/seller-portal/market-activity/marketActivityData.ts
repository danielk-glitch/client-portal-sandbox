/**
 * Mock market activity around the seller's home (128 Meadowbrook Lane, Kalispell).
 * Prototype data only: no MLS feed or API. Shown only in the Listed view, where "today" is Oct 6, 2026.
 * Photos load from Unsplash's image CDN. A broken photo falls back to a neutral placeholder in the card.
 */

export type MarketChange = 'new' | 'price-drop' | 'pending' | 'sold' | 'withdrawn'

export type CompetingListing = {
  id: string
  address: string
  city: string
  photoUrl: string
  /** Current list price. For sold homes, the sale price. */
  price: number
  /** Price before the most recent drop. Only for price drops. */
  previousPrice?: number
  beds: number
  baths: number
  sqft: number
  distanceMiles: number
  change: MarketChange
  /** ISO day the change happened. */
  changedOn: string
}

export type MarketActivity = {
  /** ISO day the seller's home was listed. Activity is counted from here. */
  listedOn: string
  /** ISO day treated as today, for "3 days ago" copy. */
  today: string
  radiusMiles: number
  /** Team-controlled. When false, clients don't see the block at all. */
  visibleToClient: boolean
  listings: CompetingListing[]
}

const photo = (id: string) => `https://images.unsplash.com/${id}?w=480&h=360&q=70&auto=format&fit=crop`

export const sampleMarketActivity: MarketActivity = {
  listedOn: '2026-09-01',
  today: '2026-10-06',
  radiusMiles: 1,
  visibleToClient: true,
  listings: [
    { id: 'ma-1', address: '214 Aspen Ridge Road', city: 'Kalispell', photoUrl: photo('photo-1568605114967-8130f3a36994'), price: 819000, previousPrice: 824000, beds: 4, baths: 3, sqft: 2860, distanceMiles: 0.3, change: 'price-drop', changedOn: '2026-10-03' },
    { id: 'ma-2', address: '57 Larkspur Court', city: 'Kalispell', photoUrl: photo('photo-1570129477492-45c003edd2be'), price: 869000, beds: 4, baths: 3, sqft: 3020, distanceMiles: 0.6, change: 'new', changedOn: '2026-10-04' },
    { id: 'ma-3', address: '1902 Willow Glen Drive', city: 'Kalispell', photoUrl: photo('photo-1564013799919-ab600027ffc6'), price: 812000, beds: 3, baths: 2.5, sqft: 2540, distanceMiles: 0.8, change: 'sold', changedOn: '2026-09-29' },
    { id: 'ma-4', address: '88 Timber Hollow Lane', city: 'Kalispell', photoUrl: photo('photo-1580587771525-78b9dba3b914'), price: 899000, beds: 5, baths: 3.5, sqft: 3380, distanceMiles: 0.5, change: 'pending', changedOn: '2026-09-27' },
    { id: 'ma-5', address: '330 Bitterroot Way', city: 'Kalispell', photoUrl: photo('photo-1512917774080-9991f1c4c750'), price: 789000, previousPrice: 815000, beds: 3, baths: 2, sqft: 2310, distanceMiles: 0.9, change: 'price-drop', changedOn: '2026-09-22' },
    { id: 'ma-6', address: '12 Swan Creek Court', city: 'Kalispell', photoUrl: photo('photo-1600596542815-ffad4c1539a9'), price: 925000, beds: 4, baths: 3, sqft: 3150, distanceMiles: 0.4, change: 'withdrawn', changedOn: '2026-09-18' },
    { id: 'ma-7', address: '605 Foothill Road', city: 'Kalispell', photoUrl: photo('photo-1600585154340-be6161a56a0c'), price: 858000, beds: 4, baths: 2.5, sqft: 2790, distanceMiles: 0.7, change: 'sold', changedOn: '2026-09-11' },
    { id: 'ma-8', address: '41 Cedar Bluff Drive', city: 'Kalispell', photoUrl: photo('photo-1583608205776-bfd35f0d9f83'), price: 834000, beds: 4, baths: 3, sqft: 2680, distanceMiles: 1, change: 'new', changedOn: '2026-09-08' },
  ],
}

/** Review scenarios for the design panel: a quiet market, or the team turned the block off. */
export const emptyMarketActivity: MarketActivity = { ...sampleMarketActivity, listings: [] }
export const hiddenMarketActivity: MarketActivity = { ...sampleMarketActivity, visibleToClient: false }
