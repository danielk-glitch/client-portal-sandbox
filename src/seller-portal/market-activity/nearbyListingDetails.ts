/** Adapt nearby market data for the shared listing overlay without borrowing subject-property facts. */
import type { ListingDetailsData } from '../ListingDetailsSheet'
import type { CompetingListing } from './marketActivityData'
import { currency, marketChangeCopy, number } from './marketActivityFormat'

const statusLabels = {
  new: 'Active',
  'price-drop': 'Active',
  pending: 'Pending',
  sold: 'Sold',
  withdrawn: 'Withdrawn',
} as const

export function nearbyListingDetails(listing: CompetingListing): ListingDetailsData {
  const changeDate = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(`${listing.changedOn}T12:00:00Z`))
  return {
    listing: {
      address: listing.address,
      city: listing.city,
      price: listing.price,
      status: statusLabels[listing.change],
      photoUrl: listing.photoUrl,
      photos: [{ url: listing.photoUrl, alt: `Exterior of ${listing.address}` }],
    },
    priceLabel: listing.change === 'sold' ? 'Sale price' : listing.change === 'withdrawn' ? 'Last asking price' : 'Asking price',
    details: {
      property: [
        { label: 'Bedrooms', value: String(listing.beds) },
        { label: 'Bathrooms', value: String(listing.baths) },
        { label: 'Interior size', value: `${number(listing.sqft)} sqft` },
        { label: 'From your home', value: `${listing.distanceMiles} ${listing.distanceMiles === 1 ? 'mile' : 'miles'}` },
      ],
      listingFacts: [
        { label: 'Latest activity', value: marketChangeCopy(listing) },
        { label: listing.change === 'new' ? 'Date listed' : listing.change === 'sold' ? 'Date sold' : 'Change date', value: changeDate },
        ...(listing.previousPrice ? [{ label: 'Previous asking price', value: currency(listing.previousPrice) }] : []),
      ],
      interiorDetails: [],
      exteriorDetails: [],
      financialDetails: [],
    },
  }
}
