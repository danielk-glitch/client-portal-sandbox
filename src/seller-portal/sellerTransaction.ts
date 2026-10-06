import sampleHome from '../assets/seller-home.jpg'
import sampleHomeDeck from '../assets/seller-home-deck.jpg'
import sampleHomeSetting from '../assets/seller-home-setting.jpg'
import benKinneyTeamLogo from '../assets/bkt-black-logo.png'
import kwWesternRealtyLogo from '../assets/kw-western-realty.png'
import averyAvatar from '../assets/people/avery.jpg'
import jordanAvatar from '../assets/people/jordan.jpg'
import morganAvatar from '../assets/people/morgan.jpg'
import robinAvatar from '../assets/people/robin.jpg'
import kendallAvatar from '../assets/people/kendall.jpg'
import cameronAvatar from '../assets/people/cameron.jpg'
import timAvatar from '../assets/people/tim.jpg'
import alexAvatar from '../assets/people/alex.jpg'
import type {
  AdvertisingEvent,
  ShowingFeedback,
  TeamMember,
  TeamNote,
  TimelineEvent,
  TransactionDocument,
  TransactionTask,
  TransactionViewer,
  UpcomingDate,
} from '../transaction-portal/types'

export type {
  AdvertisingEvent,
  ShowingFeedback,
  TeamMember,
  TeamNote,
  TimelineEvent,
  TransactionDocument,
  TransactionTask,
  TransactionViewer,
  UpcomingDate,
} from '../transaction-portal/types'

export type ListingStatus = 'Active' | 'Under contract' | 'Closed' | 'Coming soon'

export type ListingFact = { label: string; value: string }

export type SellerTransaction = {
  listing: {
    address: string
    city: string
    state: string
    postalCode: string
    price: number
    dataSource: 'MLS' | 'Brivity'
    mlsNumber: string
    status: ListingStatus
    published: boolean
    expiration: string
    daysOnMarket: number
    lastUpdated: string
    photoUrl: string | null
    photos: Array<{ url: string; alt: string }>
  }
  teamBrand: {
    name: string
    logoUrl: string
    leadAgentId: string
    brokerage?: {
      name: string
      logoUrl: string
    }
  }
  team: TeamMember[]
  viewers: TransactionViewer[]
  timeline: TimelineEvent[]
  upcomingDates: UpcomingDate[]
  tasks: TransactionTask[]
  advertising: AdvertisingEvent[]
  feedback: ShowingFeedback[]
  notes: TeamNote[]
  details: {
    dateListed: string
    propertyType: string
    location: ListingFact[]
    property: ListingFact[]
    listingFacts: ListingFact[]
    interiorDetails: ListingFact[]
    exteriorDetails: ListingFact[]
    financialDetails: ListingFact[]
    approximateMapPin: { latitude: number; longitude: number; zoom: number }
    listingDescription: string
    customDates: Array<{ label: string; value: string }>
  }
  documents: TransactionDocument[]
}

export const sampleSellerTransaction: SellerTransaction = {
  listing: {
    address: '128 Meadowbrook Lane',
    city: 'Kalispell',
    state: 'MT',
    postalCode: '59901',
    price: 845000,
    dataSource: 'MLS',
    mlsNumber: '00001428',
    status: 'Under contract',
    published: true,
    expiration: '03/09/2027',
    daysOnMarket: 181,
    lastUpdated: '09/14/2026',
    photoUrl: sampleHome,
    photos: [
      { url: sampleHome, alt: 'Exterior of the home in its wooded Montana setting' },
      { url: sampleHomeDeck, alt: 'Closer view of the front deck and entry' },
      { url: sampleHomeSetting, alt: 'Hillside and trees surrounding the home' },
    ],
  },
  teamBrand: {
    name: 'Ben Kinney Team',
    logoUrl: benKinneyTeamLogo,
    leadAgentId: 'agent',
    brokerage: {
      name: 'Keller Williams Western Realty',
      logoUrl: kwWesternRealtyLogo,
    },
  },
  team: [
    { id: 'agent', name: 'Avery Coleman', role: 'Listing agent', initials: 'AC', photoUrl: averyAvatar, phone: '+14065550101', email: 'avery.coleman@example.com' },
    { id: 'compliance', name: 'Jordan Lee', role: 'Quality & compliance coordinator', initials: 'JL', photoUrl: jordanAvatar, phone: '+14065550102', email: 'jordan.lee@example.com' },
    { id: 'transaction', name: 'Morgan Ellis', role: 'Transaction coordinator', initials: 'ME', photoUrl: morganAvatar, phone: '+14065550103', email: 'morgan.ellis@example.com' },
    { id: 'listing', name: 'Robin Hayes', role: 'Listing coordinator', initials: 'RH', photoUrl: robinAvatar, phone: '+14065550104', email: 'robin.hayes@example.com' },
    { id: 'marketing', name: 'Kendall Ortiz', role: 'Marketing manager', initials: 'KO', photoUrl: kendallAvatar, phone: '+14065550105', email: 'kendall.ortiz@example.com' },
    { id: 'database', name: 'Cameron Tate', role: 'Database manager', initials: 'CT', photoUrl: cameronAvatar, phone: '+14065550106', email: 'cameron.tate@example.com' },
  ],
  viewers: [
    { id: 'seller', name: 'Tim Bennett', role: 'Seller', initials: 'TB', photoUrl: timAvatar },
    { id: 'co-seller', name: 'Alex Bennett', role: 'Co-seller', initials: 'AB', photoUrl: alexAvatar },
  ],
  timeline: [
    {
      id: 'event-1',
      title: 'Listing agreement signed',
      description: 'The signed agreement is available in Documents.',
      occurredAt: '09/14/2026 · 10:42 AM',
      actor: 'Tim Bennett',
      type: 'document',
    },
    {
      id: 'event-2',
      title: 'Property photos added',
      description: 'The listing photo set is ready for review.',
      occurredAt: '09/13/2026 · 03:18 PM',
      actor: 'Robin Hayes',
      type: 'listing',
    },
    {
      id: 'event-3',
      title: 'Review property details completed',
      description: 'Your team confirmed the listing facts and public remarks.',
      occurredAt: '09/12/2026 · 01:06 PM',
      actor: 'Avery Coleman',
      type: 'task',
    },
    {
      id: 'event-4',
      title: 'Showing feedback received',
      description: 'A buyer shared feedback after an in-person tour.',
      occurredAt: '09/10/2026 · 06:30 PM',
      actor: 'Ben Kinney Team',
      type: 'showing',
    },
  ],
  upcomingDates: [
    {
      id: 'date-1',
      date: '2026-10-05',
      title: 'Deposit due',
      description: 'The earnest money deposit is due to escrow.',
    },
    {
      id: 'date-2',
      date: '2026-10-08',
      title: 'Form 17 signing due',
      description: 'Review and sign the seller disclosure form.',
    },
    {
      id: 'date-3',
      date: '2026-10-14',
      title: 'Appraisal',
      description: 'The lender’s appraisal is scheduled at the property.',
    },
    {
      id: 'date-4',
      date: '2026-11-06',
      title: 'Closing day',
      description: 'Final signatures and transfer of ownership.',
    },
  ],
  tasks: [
    {
      id: 'task-1',
      name: 'Review and sign Form 17',
      description: 'Confirm the seller disclosure before the signing deadline.',
      assignee: 'Tim Bennett',
      dueDate: '10/08/2026',
    },
    {
      id: 'task-2',
      name: 'Confirm appraisal access',
      description: 'Make sure the appraiser can access the property.',
      assignee: 'Avery Coleman',
      dueDate: '10/13/2026',
    },
    {
      id: 'task-3',
      name: 'Review closing details',
      description: 'Check the closing statement and confirm your signing time.',
      assignee: 'Tim Bennett',
      dueDate: '11/03/2026',
    },
  ],
  advertising: [
    { id: 'ad-1', platform: 'Realtor.com', action: 'Listing published', occurredAt: '09/08/2026 · 09:12 AM', postedBy: 'Kendall Ortiz' },
    { id: 'ad-2', platform: 'Homes.com', action: 'Listing published', occurredAt: '09/08/2026 · 09:12 AM', postedBy: 'Kendall Ortiz' },
    { id: 'ad-3', platform: 'Ben Kinney Team', action: 'Social post shared', occurredAt: '09/09/2026 · 11:30 AM', postedBy: 'Kendall Ortiz' },
    { id: 'ad-4', platform: 'Zillow', action: 'Listing details refreshed', occurredAt: '09/12/2026 · 02:05 PM', postedBy: 'Cameron Tate' },
  ],
  feedback: [
    {
      id: 'showing-1',
      date: '09/10/2026',
      showingType: 'In-person showing',
      interest: 4,
      feedback: 'They loved the natural light and the open kitchen. They are comparing a few homes this week.',
    },
    {
      id: 'showing-2',
      date: '09/06/2026',
      showingType: 'Open house',
      interest: 3,
      feedback: 'The layout worked well for them. They asked about the age of the roof and heating system.',
    },
    {
      id: 'showing-3',
      date: '09/02/2026',
      showingType: 'In-person showing',
      interest: 2,
      feedback: 'They liked the setting but need a different number of bedrooms.',
    },
  ],
  notes: [
    {
      id: 'note-3',
      title: 'Appraisal scheduling',
      body: 'The appraisal is set for October 14. We’ll confirm access details before the appointment. Please make sure the side gate is unlocked that morning and keep the driveway clear for the appraiser. We’ll send a reminder once the arrival window is confirmed.',
      author: 'Morgan Ellis',
      authorPhotoUrl: morganAvatar,
      createdAt: '09/30/2026 · 03:10 PM',
    },
    {
      id: 'note-4',
      title: 'Closing preparation',
      body: 'Closing is scheduled for November 6. We’ll share your signing details as they come together.',
      author: 'Avery Coleman',
      authorPhotoUrl: averyAvatar,
      createdAt: '09/28/2026 · 10:45 AM',
    },
    {
      id: 'note-1',
      title: 'Showing instructions',
      body: 'Please allow 24 hours’ notice when possible. The family dog will be away during scheduled showings.',
      author: 'Morgan Ellis',
      authorPhotoUrl: morganAvatar,
      createdAt: '09/08/2026 · 04:16 PM',
    },
    {
      id: 'note-2',
      title: 'Seller preference',
      body: 'Tim prefers a quick text before any same-day schedule changes.',
      author: 'Avery Coleman',
      authorPhotoUrl: averyAvatar,
      createdAt: '09/03/2026 · 09:50 AM',
    },
  ],
  details: {
    dateListed: '04/01/2026',
    propertyType: 'Residential',
    location: [
      { label: 'Street address', value: '128 Meadowbrook Lane' },
      { label: 'City', value: 'Kalispell' },
      { label: 'State', value: 'Montana' },
      { label: 'Postal code', value: '59901' },
      { label: 'County', value: 'Flathead' },
      { label: 'Neighborhood', value: 'Foys Lake' },
    ],
    property: [
      { label: 'Bedrooms', value: '5' },
      { label: 'Bathrooms', value: '3.5' },
      { label: 'Interior size', value: '3,952 sq ft' },
      { label: 'Parking', value: '3-car garage' },
      { label: 'Year built', value: '2003' },
      { label: 'Lot size', value: '1.14 acres' },
    ],
    listingFacts: [
      { label: 'Property type', value: 'Single-family home' },
      { label: 'Lot / acreage', value: '1.14 acres' },
      { label: 'MLS #', value: '00001428' },
      { label: 'County', value: 'Flathead' },
      { label: 'Year built', value: '2003' },
      { label: 'Neighborhood', value: 'Foys Lake' },
      { label: 'Square feet', value: '3,952 sq ft' },
      { label: 'Area', value: 'Kalispell' },
    ],
    interiorDetails: [
      { label: 'Bedrooms', value: '5' },
      { label: 'Full bathrooms', value: '3' },
      { label: 'Half bathrooms', value: '1' },
      { label: 'Cooling', value: 'Central air' },
      { label: 'Heating', value: 'Forced air' },
      { label: 'Fireplaces', value: '1 gas fireplace' },
      { label: 'Above-ground area', value: '3,952 sq ft' },
      { label: 'Below-ground area', value: 'None' },
      { label: 'Basement', value: 'No' },
      { label: 'Other', value: 'Main-floor laundry' },
      { label: 'Water', value: 'Private well' },
    ],
    exteriorDetails: [
      { label: 'Lot description', value: 'Wooded hillside near Foys Lake' },
      { label: 'Garage capacity', value: '3 cars' },
      { label: 'Parking spaces', value: '3 covered' },
      { label: 'Other', value: 'Deck and outdoor gathering area' },
      { label: 'Sewer', value: 'Septic system' },
      { label: 'Parking features', value: 'Attached garage, paved driveway' },
    ],
    financialDetails: [
      { label: 'Tax amount', value: '$5,420 annually' },
      { label: 'Taxes / assessments', value: 'No special assessments' },
      { label: 'Tax / property ID', value: '07-3966-04-2-10-15-0000' },
      { label: 'Tax year', value: '2025' },
    ],
    // Prototype pin: intentionally near Foys Lake, not a precise property location.
    approximateMapPin: { latitude: 48.169, longitude: -114.391, zoom: 13 },
    listingDescription: 'Set among mature evergreens near Foys Lake, this home offers a quiet Montana setting with space to gather, unwind, and make daily life your own. The flexible floor plan has generous living and dining areas alongside five bedrooms, creating options for guests, work, or hobbies. A deck extends the living space outdoors, with room to sit among the trees and take in the changing seasons. Inside, the home feels comfortable and easy to use, with spaces that can adapt as needs change over time. The wooded lot lends a sense of privacy, while the attached three-car garage provides practical room for vehicles and outdoor gear. Enjoy easy access to the lake and nearby recreation, with downtown Kalispell a short drive away for shopping, dining, and everyday errands.',
    customDates: [
      { label: 'Photography completed', value: '03/26/2026 · 11:00 AM' },
      { label: 'Listing published', value: '04/01/2026 · 09:00 AM' },
      { label: 'Open house', value: '09/20/2026 · 12:00 PM' },
    ],
  },
  documents: [
    {
      id: 'doc-1',
      name: 'Exclusive listing agreement',
      category: 'Listing paperwork',
      updatedAt: '09/14/2026',
      postedBy: 'Morgan Ellis',
      status: 'Signed',
      summary: 'The signed agreement for the property listing, including the marketing period and agreed listing terms.',
    },
    {
      id: 'doc-2',
      name: 'Property disclosures',
      category: 'Property information',
      updatedAt: '09/12/2026',
      postedBy: 'Avery Coleman',
      status: 'Signature requested',
      summary: 'Disclosure forms for the seller to review and complete.',
    },
    {
      id: 'doc-3',
      name: 'Listing presentation',
      category: 'Marketing',
      updatedAt: '09/08/2026',
      postedBy: 'Kendall Ortiz',
      status: 'Ready to view',
      summary: 'A summary of the current marketing plan and published listing destinations.',
    },
    {
      id: 'doc-4',
      name: 'Showing feedback summary',
      category: 'Updates',
      updatedAt: '09/06/2026',
      postedBy: 'Morgan Ellis',
      status: 'Ready to view',
      summary: 'A collected view of buyer comments received after recent showings.',
    },
  ],
}
