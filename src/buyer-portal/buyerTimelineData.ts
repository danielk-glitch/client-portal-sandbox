/**
 * Buyer timeline · prototype data.
 * The buyer's view starts at the signed contract. Offers and home search are out of scope.
 * Four stages: Inspection period (the first 10 days), Financing, Closing, Move in.
 * Steps carry dates only. Status is worked out from "today", so the design panel can preview
 * any moment in the deal (see `buyerTimelineAt` and `journeyMoments`).
 */
import type { MilestoneId, SellerMilestone, SellerTimelineData, SellerTimelineStep } from '../seller-portal/sellerTimelineData'

/** The contract date and the deadlines everything else hangs off. */
export const buyerDeal = {
  contractDate: '2026-10-02',
  inspectionEnds: '2026-10-12',
  /** The inspection period runs 10 days from the signed contract. */
  inspectionDays: 10,
  closingDate: '2026-11-06',
  closingTime: '10:00 AM',
  closingPlace: 'Flathead Title',
  closingAddress: '35 1st Ave E, Kalispell, MT 59901',
  closingMapUrl: 'https://maps.google.com/?q=35+1st+Ave+E+Kalispell+MT',
  /** Last day the calendar in the full timeline shows. */
  calendarEnd: '2026-11-20',
}

type BuyerStep = Omit<SellerTimelineStep, 'status'>
type BuyerStage = Omit<SellerMilestone, 'status' | 'steps'> & { steps: BuyerStep[] }

const stages: BuyerStage[] = [
  {
    id: 'inspection-period',
    label: 'Inspection period',
    startDate: '2026-10-02',
    endDate: '2026-10-12',
    summary: 'Your first 10 days: earnest money, the inspection, and any repair requests.',
    resourceIds: ['first-10-days', 'buyer-earnest-money', 'buyer-inspection', 'repair-requests'],
    steps: [
      { id: 'b-contract', title: 'Purchase contract signed', summary: 'Your offer is accepted and the contract is signed. Your deadlines start today.', date: '2026-10-02', owner: 'you', documentId: 'bd-contract' },
      { id: 'b-earnest', title: 'Send your earnest money', summary: 'Your deposit goes to Flathead Title. Call them to confirm wiring instructions first.', date: '2026-10-05', dateLabel: 'Due', owner: 'you', resourceId: 'buyer-earnest-money' },
      { id: 'b-disclosures', title: 'Read the seller’s disclosures', summary: 'Note anything you’d like your inspector to look at closely.', date: '2026-10-06', dateLabel: 'Due', owner: 'you', documentId: 'bd-disclosure' },
      { id: 'b-inspection', title: 'Home inspection', summary: 'Meet your inspector at the home at 9:00 AM. Plan for about three hours.', date: '2026-10-07', dateLabel: 'Scheduled', owner: 'you', resourceId: 'buyer-inspection' },
      { id: 'b-repair-request', title: 'Send your repair request', summary: 'Decide with Avery what to ask the seller to fix or credit.', date: '2026-10-09', dateLabel: 'Due', owner: 'you', resourceId: 'repair-requests' },
      { id: 'b-inspection-end', title: 'Inspection period ends', summary: 'Last day to cancel and keep your earnest money. 5:00 PM.', date: '2026-10-12', dateLabel: 'Due', owner: 'you', resourceId: 'first-10-days' },
    ],
  },
  {
    id: 'financing',
    label: 'Financing',
    startDate: '2026-10-12',
    endDate: '2026-10-28',
    summary: 'The appraisal, insurance, title, and your lender’s final approval.',
    resourceIds: ['buyer-appraisal', 'loan-commitment'],
    steps: [
      { id: 'b-appraisal', title: 'Appraisal', summary: 'Your lender’s appraiser confirms the home’s value. You don’t need to be there.', date: '2026-10-14', dateLabel: 'Scheduled', owner: 'Cameron Tate', resourceId: 'buyer-appraisal' },
      { id: 'b-insurance', title: 'Choose homeowners insurance', summary: 'Your lender needs proof of coverage that starts on closing day.', date: '2026-10-16', dateLabel: 'Due', owner: 'you' },
      { id: 'b-title', title: 'Review the title report', summary: 'Confirms the seller can transfer the home free of surprises.', date: '2026-10-21', dateLabel: 'Due', owner: 'you' },
      { id: 'b-loan-docs', title: 'Send your lender any last documents', summary: 'Recent pay stubs or bank statements, if Cameron asks.', estimate: 'Only if your lender asks', owner: 'you' },
      { id: 'b-loan-commitment', title: 'Loan commitment', summary: 'Your lender’s final approval. Your financing contingency ends today.', date: '2026-10-28', dateLabel: 'Due', owner: 'Cameron Tate', resourceId: 'loan-commitment' },
    ],
  },
  {
    id: 'closing',
    label: 'Closing',
    startDate: '2026-10-28',
    endDate: '2026-11-06',
    summary: 'Final numbers, your closing funds, the walkthrough, and signing.',
    resourceIds: ['buyer-closing', 'wire-safety'],
    steps: [
      { id: 'b-closing-disclosure', title: 'Review your Closing Disclosure', summary: 'Your final loan terms and cash to close. Compare it with your Loan Estimate.', date: '2026-11-03', dateLabel: 'Due', owner: 'you', resourceId: 'buyer-closing' },
      { id: 'b-closing-funds', title: 'Send your closing funds', summary: 'Call Flathead Title to confirm wiring instructions before you send anything.', date: '2026-11-05', dateLabel: 'Due', owner: 'you', resourceId: 'wire-safety' },
      { id: 'b-walkthrough', title: 'Final walkthrough', summary: '4:00 PM with Avery. Check that repairs are done and the home is as agreed.', date: '2026-11-05', dateLabel: 'Scheduled', owner: 'you' },
      { id: 'b-signing', title: 'Closing', summary: '10:00 AM at Flathead Title, 35 1st Ave E, Kalispell. Bring a photo ID.', date: '2026-11-06', dateLabel: 'Scheduled', owner: 'you', resourceId: 'buyer-closing' },
    ],
  },
  {
    id: 'move-in',
    label: 'Move in',
    startDate: '2026-11-06',
    endDate: '2026-11-20',
    caption: 'From Nov 6',
    summary: 'Keys, utilities, and your first weeks as a homeowner.',
    resourceIds: ['moving-in', 'after-closing'],
    steps: [
      { id: 'b-keys', title: 'Get your keys', summary: 'Avery hands them over once the sale records, usually the afternoon of closing.', date: '2026-11-06', dateLabel: 'Expected', owner: 'Avery Coleman' },
      { id: 'b-utilities', title: 'Utilities in your name', summary: 'Electric, gas, water, and internet start the day you take possession.', date: '2026-11-06', dateLabel: 'Due', owner: 'you', resourceId: 'moving-in' },
      { id: 'b-locks', title: 'Change the locks', summary: 'Rekey the doors and reset garage and gate codes.', estimate: 'Your first week', owner: 'you', resourceId: 'moving-in' },
      { id: 'b-deed', title: 'Recorded deed arrives', summary: 'Flathead County mails your deed once it’s recorded. Keep it with your closing papers.', estimate: 'Usually 4 to 8 weeks after closing', owner: 'Flathead County', resourceId: 'after-closing' },
      { id: 'b-first-payment', title: 'First mortgage payment', summary: 'There’s no December payment. November’s interest was paid at closing.', date: '2027-01-01', dateLabel: 'Due', owner: 'you', resourceId: 'after-closing' },
    ],
  },
]

/* ---------- Journey moments: the design panel previews the deal at each of these "todays" ---------- */

export type JourneyMoment = 'inspection' | 'financing' | 'closing-week' | 'moved-in'

export const journeyMoments: Array<{ value: JourneyMoment; label: string; today: string }> = [
  { value: 'inspection', label: 'Day 4 · Inspection period (default)', today: '2026-10-06' },
  { value: 'financing', label: 'Financing', today: '2026-10-20' },
  { value: 'closing-week', label: 'Closing week', today: '2026-11-03' },
  { value: 'moved-in', label: 'Moved in', today: '2026-11-09' },
]

export function todayFor(moment: JourneyMoment) {
  return journeyMoments.find((item) => item.value === moment)?.today ?? journeyMoments[0].today
}

/**
 * The buyer timeline as of `today`.
 * - Dated steps before today are done. The next dated step (today or later) is current.
 * - The stage holding that step is current; earlier stages are done, later ones upcoming.
 * - Undated steps in a finished stage count as done.
 * - The closing countdown only shows until closing day.
 */
export function buyerTimelineAt(today: string): SellerTimelineData {
  const next = stages
    .flatMap((stage) => stage.steps.map((step) => ({ step, stageId: stage.id })))
    .filter(({ step }) => step.date && step.date >= today)
    .sort((a, b) => a.step.date!.localeCompare(b.step.date!))[0]
  const currentIndex = Math.max(0, stages.findIndex((stage) => stage.id === (next?.stageId ?? stages[stages.length - 1].id)))

  const milestones: SellerMilestone[] = stages.map((stage, index) => {
    const status = index < currentIndex ? 'complete' : index === currentIndex ? 'current' : 'upcoming'
    return {
      ...stage,
      status,
      steps: stage.steps.map((step): SellerTimelineStep => ({
        ...step,
        status: step.id === next?.step.id ? 'current' : (step.date ? step.date < today : status === 'complete') ? 'complete' : 'upcoming',
      })),
    }
  })

  return {
    today,
    nextStepId: next?.step.id ?? '',
    countdown: today <= buyerDeal.closingDate ? { date: buyerDeal.closingDate, label: 'closing' } : undefined,
    milestones,
  }
}

export function findBuyerStep(timeline: SellerTimelineData, stepId: string) {
  for (const milestone of timeline.milestones) {
    const step = milestone.steps.find((candidate) => candidate.id === stepId)
    if (step) return { step, milestone }
  }
  return undefined
}

export const isBuyerStage = (id: MilestoneId, timeline: SellerTimelineData) => timeline.milestones.some((milestone) => milestone.id === id)

/** "MM/DD/YYYY" (with an optional " · time") to an ISO day, for comparing against today. */
export function isoDay(usDate: string) {
  const match = usDate.match(/^(\d{2})\/(\d{2})\/(\d{4})/)
  return match ? `${match[3]}-${match[1]}-${match[2]}` : usDate
}

/** Only things that exist by `today`: documents uploaded, notes written, updates posted. */
export const happenedBy = (today: string) => (usDate: string) => isoDay(usDate) <= today
