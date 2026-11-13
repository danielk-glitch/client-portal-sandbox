/**
 * Client account · prototype data for /transactions and /profile.
 * Tim Bennett is selling his Kalispell home with the Ben Kinney Team while buying in Bozeman with a different team,
 * and bought the Kalispell home in 2019. One person, two teams, three transactions: the case the index exists for.
 * The cards link to the existing seller and buyer prototypes, which carry their own sample addresses.
 */
import timPhoto from '../assets/people/tim.jpg'
import averyPhoto from '../assets/people/avery.jpg'
import kendallPhoto from '../assets/people/kendall.jpg'
import kalispellHome from '../assets/seller-home.jpg'

export type ClientProfile = {
  name: string
  initials: string
  photoUrl?: string
  email: string
  phone: string
  mailingAddress: string
}

export const clientProfile: ClientProfile = {
  name: 'Tim Bennett',
  initials: 'TB',
  photoUrl: timPhoto,
  email: 'tim.bennett@example.com',
  phone: '(406) 555-0148',
  mailingAddress: '128 Meadowbrook Lane, Kalispell, MT 59901',
}

type Agent = { name: string; initials: string; photoUrl?: string; team: string }

/** Same remote photo source the Market activity sample uses. */
const bozemanHome = 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=960&h=720&q=70&auto=format&fit=crop'

const avery: Agent = { name: 'Avery Coleman', initials: 'AC', photoUrl: averyPhoto, team: 'Ben Kinney Team' }
const sam: Agent = { name: 'Sam Whitaker', initials: 'SW', photoUrl: kendallPhoto, team: 'Bridger Peak Realty' }

export type ActiveTransaction = {
  id: string
  side: 'Selling' | 'Buying'
  address: string
  locality: string
  photoUrl: string
  photoAlt: string
  /** The four stages for this side, and which one the deal is in now. */
  stages: string[]
  currentStage: number
  /** The one date that matters most right now. */
  next: { date: string; title: string; detail: string }
  agent: Agent
  href: string
}

export type PastTransaction = {
  id: string
  side: 'Sold' | 'Bought'
  address: string
  locality: string
  closedOn: string
  agent: Agent
  href: string
}

export const activeTransactions: ActiveTransaction[] = [
  {
    id: 'sell-meadowbrook',
    side: 'Selling',
    address: '128 Meadowbrook Lane',
    locality: 'Kalispell, MT',
    photoUrl: kalispellHome,
    photoAlt: 'The Meadowbrook Lane home in its wooded setting',
    stages: ['Pre-listing', 'Active listing', 'Pending', 'Closing'],
    currentStage: 2,
    next: { date: '2026-11-19', title: 'Closing', detail: 'Thursday at 10:00 AM' },
    agent: avery,
    href: '/seller',
  },
  {
    id: 'buy-story-mill',
    side: 'Buying',
    address: '418 Story Mill Road',
    locality: 'Bozeman, MT',
    photoUrl: bozemanHome,
    photoAlt: 'Front of the Story Mill Road home',
    stages: ['Inspection period', 'Financing', 'Closing', 'Move in'],
    currentStage: 0,
    next: { date: '2026-11-12', title: 'Inspection period ends', detail: 'Thursday at 5:00 PM' },
    agent: sam,
    href: '/buyer/v1-iteration2',
  },
]

export const pastTransactions: PastTransaction[] = [
  {
    id: 'bought-meadowbrook',
    side: 'Bought',
    address: '128 Meadowbrook Lane',
    locality: 'Kalispell, MT',
    closedOn: 'June 2019',
    agent: avery,
    href: '/buyer/v1-iteration2?moment=moved-in',
  },
]
