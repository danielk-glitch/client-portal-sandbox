/**
 * Timeline-first explorations · shared prototype data.
 * Builds on the under-contract timeline, renames that stage to "Pending",
 * adds dates that aren't scheduled yet (with a plain-language estimate),
 * richer step instructions, recent updates, and the team's own to-do list.
 */
import { futureSellerTransaction } from '../futureSellerTransaction'
import type { SellerTransaction, TeamNote, TimelineEvent, TransactionDocument } from '../sellerTransaction'
import { timelineResources, underContractTimeline, type SellerMilestone, type SellerTimelineData, type SellerTimelineStep } from '../sellerTimelineData'
import { buyerStepDetails } from '../../buyer-portal/buyerStepDetails'

/* ---------- Timeline: "Pending" label + unscheduled placeholders ---------- */

const unscheduled: Record<string, string> = {
  'cl-statement': 'About 3 days before closing',
  'cl-walkthrough': 'Usually 1 to 2 days before closing',
}

const extraPendingSteps: SellerTimelineStep[] = [
  {
    id: 'uc-repairs',
    title: 'Respond to repair requests',
    summary: 'Decide with Avery how to answer anything the inspection turns up.',
    owner: 'you',
    status: 'upcoming',
    resourceId: 'inspection',
    estimate: 'Within 3 days of the inspection report',
  },
]

function withPending(milestone: SellerMilestone): SellerMilestone {
  const label = milestone.id === 'under-contract' ? 'Pending' : milestone.label
  // Open houses have their own rows now (see openHouses.ts), so the single placeholder step goes.
  const steps = milestone.steps.filter((step) => step.id !== 'al-open-house').map((step) => {
    const estimate = unscheduled[step.id]
    return estimate ? { ...step, date: undefined, dateLabel: undefined, estimate } : step
  })
  if (milestone.id === 'under-contract') steps.splice(steps.length - 1, 0, ...extraPendingSteps)
  return { ...milestone, label, steps }
}

export const pendingTimeline: SellerTimelineData = {
  ...underContractTimeline,
  milestones: underContractTimeline.milestones.map(withPending),
}

/* ---------- Step instructions: what the detail view shows ---------- */

export type StepLink = { label: string; href: string; note?: string }

export type StepDetail = {
  /** One or two short paragraphs in plain language. */
  intro: string
  /** "How to prepare" checklist. */
  checklist?: string[]
  /** Helpful outside links. */
  links?: StepLink[]
  /** Documents beyond the step's own documentId. */
  documentIds?: string[]
  /** Guides beyond the step's own resourceId. */
  resourceIds?: string[]
  /** Short "what happens after" line. */
  after?: string
}

export const stepDetails: Record<string, StepDetail> = {
  'uc-disclosures': {
    intro: 'Form 17 tells the buyer what you know about the home’s condition and history. Answer based on what you know today. “Don’t know” is a valid answer when it’s true.',
    checklist: ['Set aside about 30 minutes.', 'Have repair receipts and permits nearby.', 'Note anything you’re unsure about and ask Avery before signing.'],
    documentIds: ['doc-2'],
    resourceIds: ['disclosures'],
    after: 'Morgan sends the signed form to the buyer’s agent the same day.',
  },
  'uc-inspection': {
    intro: 'The buyer’s inspector walks through the home and checks major systems. You don’t need to be there. Most inspections take about three hours.',
    checklist: ['Leave the attic, crawl space, and electrical panel easy to reach.', 'Turn on all utilities and pilot lights.', 'Plan to be away from 9:00 AM to noon.', 'Take pets with you or crate them.'],
    resourceIds: ['inspection'],
    after: 'The buyer may send a repair request within 3 days of the report.',
  },
  'uc-appraisal-access': {
    intro: 'The appraiser needs a way in. A quick reply to Morgan’s text is all it takes.',
    checklist: ['Share the gate code.', 'Mention pets or rooms that are off limits.'],
  },
  'uc-appraisal': {
    intro: 'The lender’s appraiser estimates the home’s value to support the buyer’s loan. It usually takes under an hour.',
    checklist: ['Keep the side gate unlocked that morning.', 'Keep the driveway clear.', 'Leave a list of recent upgrades on the counter.'],
    resourceIds: ['appraisal'],
    after: 'Results usually arrive within a week. Avery will walk you through them.',
  },
  'uc-repairs': {
    intro: 'If the inspection turns something up, the buyer may ask for repairs or a credit. You can agree, offer something different, or decline. Avery will recommend a response.',
    checklist: ['Read the request with Avery.', 'Get quotes for any repairs you’re considering.', 'Reply before the response deadline.'],
    resourceIds: ['inspection', 'contingencies'],
  },
  'uc-contingencies': {
    intro: 'Once the buyer’s inspection and financing conditions are cleared, the sale is much less likely to fall through.',
    resourceIds: ['contingencies'],
    after: 'Next stop is closing. Morgan will start lining up signing times.',
  },
  'uc-deposit': {
    intro: 'The buyer’s earnest money deposit is held by escrow and applied to their purchase at closing. You don’t need to do anything with it.',
    documentIds: ['doc-6'],
    resourceIds: ['earnest-money'],
  },
  'uc-agreement': {
    intro: 'Your accepted offer is now a signed contract. It sets the price, deadlines, and closing date.',
    documentIds: ['doc-5'],
  },
  'cl-statement': {
    intro: 'Your closing statement shows the sale price, fees, payoffs, and your expected proceeds. Morgan will send it once the title company finalizes the numbers.',
    checklist: ['Compare the payoff amount with your latest mortgage statement.', 'Flag anything that looks unfamiliar.'],
    resourceIds: ['closing'],
  },
  'cl-walkthrough': {
    intro: 'The buyer visits one last time to confirm the home is in the agreed condition. The date is set with the buyer’s agent once closing is confirmed.',
    checklist: ['Finish any agreed repairs and keep receipts.', 'Leave the home broom clean.'],
  },
  'cl-signing': {
    intro: 'You’ll sign the final paperwork with the title company. Bring a photo ID. The signing time is confirmed about a week before.',
    checklist: ['Bring a government photo ID.', 'Bring your bank details for proceeds.'],
    links: [{ label: 'Directions to Flathead Title', href: 'https://maps.google.com', note: 'Google Maps' }],
    resourceIds: ['closing'],
  },
  'cl-keys': {
    intro: 'Leave keys, garage openers, and manuals for the new owners.',
    resourceIds: ['moving-out'],
  },
  'cl-proceeds': {
    intro: 'Once the sale records, the title company sends your proceeds by the method you chose at signing.',
    after: 'Expect funds within one to two business days of recording. Morgan will confirm when they’re sent.',
  },
  'pl-photos': {
    intro: 'Robin’s photographer captured the photos, video, and floor plan that buyers see first.',
    after: 'You approved the final set before launch.',
  },
  'al-open-house': {
    intro: 'Avery hosted the weekend open house. Visitors toured the home, and their questions and feedback were collected for you.',
    after: 'The open house summary is in your updates.',
  },
  'bl-prepare': {
    intro: 'Photos are the first thing buyers see. A little preparation goes a long way, and Robin’s photographer will handle the rest.',
    checklist: ['Clear counters in the kitchen and bathrooms.', 'Put away personal photos, mail, and valuables.', 'Turn on every light and open the blinds.', 'Let Robin know about pets or gate codes.'],
    after: 'Robin shares the photos with you for review before anything goes live.',
  },
  'bl-photos': {
    intro: 'The photographer captures the interior, exterior, video, and a floor plan. Plan for about two hours.',
    checklist: ['Be home to let the photographer in, or share access instructions.', 'Park cars away from the front of the house.'],
    after: 'Edited photos usually come back within two days for your review.',
  },
  'bl-review': {
    intro: 'Before your home goes live, review the photos, property facts, and description so everything is accurate.',
    checklist: ['Check room counts and square footage.', 'Flag any photo you’d like swapped.', 'Note upgrades the description should mention.'],
    after: 'Robin makes any changes and sends the final version for approval.',
  },
  'bl-live': {
    intro: 'Your home is published to the MLS and major home search sites, and the marketing plan kicks off.',
    after: 'Showing requests start coming in. Avery confirms each one with you first.',
  },
  'bl-open-house': {
    intro: 'Avery hosts a weekend open house so buyers can tour without an appointment.',
    checklist: ['Plan to be out for about three hours.', 'Do a quick tidy and take valuables with you.'],
    after: 'Avery shares attendance and buyer feedback after the event.',
  },
  // Buyer steps ("b-…") live with the buyer portal.
  ...buyerStepDetails,
}

/** Everything the detail view needs for a step, with fallbacks. */
export function detailFor(step: SellerTimelineStep): StepDetail {
  const detail = stepDetails[step.id]
  return {
    intro: detail?.intro ?? step.detail ?? step.summary,
    checklist: detail?.checklist,
    links: detail?.links,
    documentIds: [...new Set([step.documentId, ...(detail?.documentIds ?? [])].filter((id): id is string => Boolean(id)))],
    resourceIds: [...new Set([step.resourceId, ...(detail?.resourceIds ?? [])].filter((id): id is string => Boolean(id)))],
    after: detail?.after,
  }
}

/* ---------- Transaction: pending-era documents and updates ---------- */

const pendingDocuments: TransactionDocument[] = [
  { id: 'doc-5', name: 'Purchase and sale agreement', category: 'Contract', uploadedAt: '10/02/2026', postedBy: 'Morgan Ellis', status: 'Signed', summary: 'The signed contract with the buyer, including price, deadlines, and the closing date.' },
  { id: 'doc-6', name: 'Earnest money receipt', category: 'Escrow', uploadedAt: '10/05/2026', postedBy: 'Morgan Ellis', status: 'Ready to view', summary: 'Confirmation that escrow received the buyer’s deposit.' },
]

const pendingEvents: TimelineEvent[] = [
  { id: 'p-1', title: 'Form 17 sent for your signature', description: 'Avery shared the seller disclosure form. It’s due Thursday.', occurredAt: '10/05/2026 · 04:20 PM', actor: 'Avery Coleman', type: 'document' },
  { id: 'p-2', title: 'Earnest money received', description: 'Escrow confirmed the buyer’s deposit. The receipt is in Documents.', occurredAt: '10/05/2026 · 11:02 AM', actor: 'Morgan Ellis', type: 'task' },
  { id: 'p-3', title: 'Inspection scheduled', description: 'The buyer’s inspector will visit Saturday, Oct 10 at 9:00 AM.', occurredAt: '10/04/2026 · 02:45 PM', actor: 'Morgan Ellis', type: 'note' },
  { id: 'p-4', title: 'Escrow opened with Flathead Title', description: 'Morgan opened escrow and shared the title officer’s contact.', occurredAt: '10/03/2026 · 09:15 AM', actor: 'Morgan Ellis', type: 'task' },
  { id: 'p-5', title: 'Listing marked pending', description: 'Your home now shows as pending on the MLS and search sites.', occurredAt: '10/02/2026 · 05:30 PM', actor: 'Robin Hayes', type: 'listing' },
  { id: 'p-6', title: 'Purchase agreement signed', description: 'You and the buyer both signed. The contract is in Documents.', occurredAt: '10/02/2026 · 03:10 PM', actor: 'Tim Bennett', type: 'document' },
]

/* ---------- Meeting notes: recorded calls with an AI note taker (prototype data) ---------- */

const photoOf = (name: string) => futureSellerTransaction.team.find((member) => member.name === name)?.photoUrl

const meetingNotes: TeamNote[] = [
  {
    id: 'meeting-1',
    body: `## Overview
- Avery walked Tim and Alex through the signed purchase agreement and what happens between now and closing.
- Nothing is needed from the sellers for the deposit. That is the buyer’s side.

## Key dates
- Seller disclosure (Form 17) due Oct 8.
- Buyer’s inspection Oct 10, about three hours.
- Appraisal Oct 14.
- Closing Nov 6.

## Earnest money
- Held by Flathead Title in escrow.
- Morgan will confirm when it arrives.

## Preparing the home
- Plan to be out of the house during the inspection.
- Keep the side gate unlocked and the driveway clear for the appraiser.
- Call Avery before signing the disclosure if anything is unclear, such as the old well pump.`,
    author: 'Avery Coleman',
    authorPhotoUrl: photoOf('Avery Coleman'),
    createdAt: '10/03/2026 · 11:20 AM',
    meeting: {
      title: 'Contract walkthrough and next steps',
      durationSeconds: 1122,
      leads: [],
      transaction: '128 Meadowbrook Lane',
      transcript: [
        { at: 4, speaker: 'Avery Coleman', text: 'Congratulations again. The agreement is signed, so I want to walk you through what happens between now and closing.' },
        { at: 38, speaker: 'Tim Bennett', text: 'Great. Is there anything we need to send for the deposit?' },
        { at: 52, speaker: 'Avery Coleman', text: 'No, that’s the buyer’s side. Escrow at Flathead Title holds it, and Morgan will confirm when it arrives.' },
        { at: 141, speaker: 'Avery Coleman', text: 'The first thing for you is the seller disclosure. It’s Form 17, and it’s due Thursday. Read each question and answer based on what you know.' },
        { at: 203, speaker: 'Alex Bennett', text: 'What if we’re not sure about something, like the old well pump?' },
        { at: 218, speaker: 'Avery Coleman', text: 'Say what you know, and flag what you don’t. Call me before you sign and we’ll go through it together.' },
        { at: 395, speaker: 'Avery Coleman', text: 'The buyer’s inspector comes Saturday morning for about three hours. Plan to be out of the house.' },
        { at: 612, speaker: 'Tim Bennett', text: 'And the appraisal after that?' },
        { at: 624, speaker: 'Avery Coleman', text: 'October 14. Keep the side gate unlocked and the driveway clear. Closing is November 6, and I’ll send signing details as they come together.' },
      ],
    },
  },
  {
    id: 'meeting-2',
    body: `## Goals
- Sell around the start of fall.
- Tim and Alex want a smooth, low-stress process.

## Pricing and marketing
- Avery will prepare a pricing recommendation with recent comparable sales.
- Professional photography and a video tour before launch.
- Open house in the first weekend on the market.

## Next steps
- Avery sends the listing agreement.
- Schedule the photo shoot.
- Walk-through of the home to note any repairs.`,
    author: 'Avery Coleman',
    authorPhotoUrl: photoOf('Avery Coleman'),
    createdAt: '08/18/2026 · 10:30 AM',
    meeting: {
      title: 'Listing consultation',
      durationSeconds: 2470,
      leads: ['Tim Bennett'],
      transaction: '128 Meadowbrook Lane',
      transcript: [
        { at: 6, speaker: 'Avery Coleman', text: 'Thanks for having me out. Tell me what a good outcome looks like for you.' },
        { at: 21, speaker: 'Tim Bennett', text: 'We’d like to be moved by the end of the year, so listing in early September feels right.' },
        { at: 340, speaker: 'Avery Coleman', text: 'For pricing, I’ll pull recent sales within a mile or two and walk you through them before we pick a number.' },
        { at: 905, speaker: 'Avery Coleman', text: 'I’d book photography and a short video tour first. Buyers decide quickly online.' },
        { at: 1480, speaker: 'Tim Bennett', text: 'How involved do we need to be during showings?' },
        { at: 1496, speaker: 'Avery Coleman', text: 'Not very. We handle scheduling and send you the feedback after each visit.' },
      ],
    },
  },
]

export const pendingTransaction: SellerTransaction = {
  ...futureSellerTransaction,
  listing: { ...futureSellerTransaction.listing, status: 'Pending' },
  timeline: [...pendingEvents, ...futureSellerTransaction.timeline],
  documents: [...pendingDocuments, ...futureSellerTransaction.documents],
  // Newest first: the contract walkthrough leads, the August consultation closes the list.
  notes: [meetingNotes[0], ...futureSellerTransaction.notes, meetingNotes[1]],
  resources: timelineResources.map((guide) => guide.id === 'contingencies'
    ? { ...guide, title: 'What “pending” means', sections: guide.sections.map((section) => ({ ...section, body: section.body?.replace('Under contract means', 'Pending means') })) }
    : guide),
}

/** Read/unread tracking is out of scope for V1, so no update is ever flagged as new. */
export const unseenUpdateCount = 0

/* ---------- The team's own to-dos ---------- */

/** A team to-do is either still open or completed. There is no in-progress state. */
export type TeamTodoStatus = 'open' | 'done'

export type TeamTodo = {
  id: string
  title: string
  description: string
  /** Team member name, matched against the team list for the avatar. */
  owner: string
  status: TeamTodoStatus
  /** Plain-language timing: "Done Oct 3", "By Oct 13", "After the inspection". */
  when: string
}

export const teamTodos: TeamTodo[] = [
  { id: 'tt-1', title: 'Coordinate inspection access', description: 'Confirming the time and entry details with the buyer’s agent.', owner: 'Avery Coleman', status: 'open', when: 'By Oct 9' },
  { id: 'tt-2', title: 'Schedule the appraisal', description: 'Booking the appraiser and confirming an arrival window with you.', owner: 'Morgan Ellis', status: 'open', when: 'By Oct 13' },
  { id: 'tt-3', title: 'Track the buyer’s loan approval', description: 'Checking in with the buyer’s lender each week until financing clears.', owner: 'Morgan Ellis', status: 'open', when: 'Through Oct 24' },
  { id: 'tt-4', title: 'Negotiate any repair requests', description: 'Reviewing the inspection report and recommending a response.', owner: 'Avery Coleman', status: 'open', when: 'After the inspection' },
  { id: 'tt-5', title: 'Prepare your closing statement', description: 'Working with the title company to finalize the numbers.', owner: 'Morgan Ellis', status: 'open', when: 'Early November' },
  { id: 'tt-6', title: 'Open escrow and order title', description: 'Escrow is open with Flathead Title. Title report ordered.', owner: 'Morgan Ellis', status: 'done', when: 'Done Oct 3' },
  { id: 'tt-7', title: 'Mark the listing pending', description: 'Updated the MLS and pulled weekend open houses.', owner: 'Robin Hayes', status: 'done', when: 'Done Oct 2' },
]

export const teamTodoStatusCopy: Record<TeamTodoStatus, string> = {
  open: 'Open',
  done: 'Done',
}

/* ---------- Small helpers ---------- */

export function formatDay(iso: string, options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }) {
  return new Intl.DateTimeFormat('en-US', { ...options, timeZone: 'UTC' }).format(new Date(`${iso}T12:00:00Z`))
}

export function daysBetween(from: string, to: string) {
  return Math.round((new Date(`${to}T12:00:00Z`).getTime() - new Date(`${from}T12:00:00Z`).getTime()) / 86400000)
}

/** Overall progress: finished stages plus the share of the current stage that's done. 0 to 1. */
export function overallProgress(data: SellerTimelineData) {
  const index = data.milestones.findIndex((milestone) => milestone.status === 'current')
  if (index < 0) return 1
  const current = data.milestones[index]
  const done = current.steps.filter((step) => step.status === 'complete').length
  return (index + (current.steps.length ? done / current.steps.length : 0)) / data.milestones.length
}

/** Upcoming steps across all stages, dated first in order, then unscheduled ones. */
export function upcomingSteps(data: SellerTimelineData) {
  return data.milestones.flatMap((milestone) => milestone.steps
    .filter((step) => step.status !== 'complete')
    .map((step) => ({ step, milestone })))
}

export function currentMilestone(data: SellerTimelineData) {
  return data.milestones.find((milestone) => milestone.status === 'current') ?? data.milestones[0]
}
