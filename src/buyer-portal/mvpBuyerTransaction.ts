/**
 * MVP buyer portal data (/buyer): the Future Vision buyer deal, frozen mid-financing and reshaped
 * for the MVP seller page. The buyer view starts at the signed contract; home search is out of scope.
 * Dates and the buyer's to-dos come straight from the timeline steps, so the two never disagree.
 */
import type { SellerTransaction, TeamMember } from '../seller-portal/sellerTransaction'
import { buildClientDocuments, buyerStageForMilestone } from '../seller-portal/timeline-first/documentLibrary'
import { buyerDocumentRecords } from './buyerDocuments'
import { buyerTimelineAt, happenedBy, todayFor } from './buyerTimelineData'
import { buyerTransactionAt } from './buyerTransaction'

const today = todayFor('financing')

export const mvpBuyerTimeline = buyerTimelineAt(today)

const steps = mvpBuyerTimeline.milestones.flatMap((milestone) => milestone.steps)
const { transaction } = buyerTransactionAt(today)

/** Outside partners on the purchase. Not on the team, but the buyer may need to reach them. */
const collaborators: TeamMember[] = [
  { id: 'title', name: 'Priya Nair', role: 'Escrow officer · Flathead Title', initials: 'PN', phone: '+14065550151', email: 'priya.nair@example.com' },
  { id: 'inspector', name: 'Chris Dahl', role: 'Home inspector · Big Sky Inspections', initials: 'CD', phone: '+14065550152', email: 'chris.dahl@example.com' },
]

/** ISO day to the MM/DD/YYYY the task rows expect. */
const usDate = (iso: string) => { const [year, month, day] = iso.split('-'); return `${month}/${day}/${year}` }

export const mvpBuyerTransaction: SellerTransaction = {
  ...transaction,
  collaborators,
  viewers: [
    { id: 'buyer', name: 'Linh Nguyen', role: 'Buyer', initials: 'LN', phone: '+14065550171', email: 'linh.nguyen@example.com' },
    { id: 'co-buyer', name: 'David Nguyen', role: 'Co-buyer', initials: 'DN', phone: '+14065550172', email: 'david.nguyen@example.com' },
  ],
  upcomingDates: steps.filter((step) => step.date).map((step) => ({ id: step.id, date: step.date!, title: step.title, description: step.summary })),
  tasks: steps
    .filter((step) => step.owner === 'you' && step.date && step.status !== 'complete')
    .map((step) => ({ id: step.id, name: step.title, description: step.summary, assignee: 'Linh Nguyen', dueDate: usDate(step.date!) })),
  // Guides stay in the Resources tab, as on the seller MVP, so no resource documents here.
  documents: buildClientDocuments(buyerDocumentRecords.filter((record) => happenedBy(today)(record.uploadedAt)), [], mvpBuyerTimeline, buyerStageForMilestone),
}
