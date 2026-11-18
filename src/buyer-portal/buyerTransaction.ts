/**
 * Buyer transaction · prototype data for /buyer/v1-iteration2.
 * Linh and David Nguyen are buying 128 Meadowbrook Lane. Avery's team represents them.
 * Cameron Tate is their loan officer. Flathead Title runs closing.
 * Updates, notes, emails, and to-dos carry real dates; `buyerTransactionAt(today)` keeps only what exists by then.
 */
import { sampleSellerTransaction, type SellerTransaction } from '../seller-portal/sellerTransaction'
import type { TeamTodo } from '../seller-portal/timeline-first/timelineFirstData'
import { formatDay } from '../seller-portal/timeline-first/timelineFirstData'
import type { TeamMember, TeamNote, TimelineEvent, TransactionEmail } from '../transaction-portal/types'
import averyPhoto from '../assets/people/avery.jpg'
import morganPhoto from '../assets/people/morgan.jpg'
import jordanPhoto from '../assets/people/jordan.jpg'
import cameronPhoto from '../assets/people/cameron.jpg'
import { buyerResources } from './buyerResources'
import { buyerDeal, happenedBy } from './buyerTimelineData'

const team: TeamMember[] = [
  { id: 'agent', name: 'Avery Coleman', role: 'Buyer’s agent', initials: 'AC', photoUrl: averyPhoto, phone: '+14065550101', email: 'avery.coleman@example.com' },
  { id: 'transaction', name: 'Morgan Ellis', role: 'Transaction coordinator', initials: 'ME', photoUrl: morganPhoto, phone: '+14065550103', email: 'morgan.ellis@example.com' },
  { id: 'lender', name: 'Cameron Tate', role: 'Loan officer', initials: 'CT', photoUrl: cameronPhoto, phone: '+14065550107', email: 'cameron.tate@example.com' },
  { id: 'compliance', name: 'Jordan Lee', role: 'Quality & compliance coordinator', initials: 'JL', photoUrl: jordanPhoto, phone: '+14065550102', email: 'jordan.lee@example.com' },
]

const events: TimelineEvent[] = [
  { id: 'be-14', title: 'Welcome home', description: 'The sale recorded and Avery handed over your keys.', occurredAt: '11/06/2026 · 03:40 PM', actor: 'Avery Coleman', type: 'task' },
  { id: 'be-13', title: 'Closing complete', description: 'You signed at Flathead Title. Your settlement statement is in Documents.', occurredAt: '11/06/2026 · 11:15 AM', actor: 'Morgan Ellis', type: 'document' },
  { id: 'be-12', title: 'Closing funds received', description: 'Flathead Title confirmed your wire arrived.', occurredAt: '11/05/2026 · 10:20 AM', actor: 'Morgan Ellis', type: 'task' },
  { id: 'be-11', title: 'Closing Disclosure shared', description: 'Your final numbers are in Documents. Compare them with your Loan Estimate.', occurredAt: '11/02/2026 · 04:05 PM', actor: 'Cameron Tate', type: 'document' },
  { id: 'be-10', title: 'Loan commitment issued', description: 'Your lender gave final approval. Your financing contingency is clear.', occurredAt: '10/28/2026 · 02:30 PM', actor: 'Cameron Tate', type: 'document' },
  { id: 'be-9', title: 'Appraisal came in at value', description: 'The home appraised at the purchase price. The report is in Documents.', occurredAt: '10/19/2026 · 09:45 AM', actor: 'Cameron Tate', type: 'document' },
  { id: 'be-8', title: 'Insurance on file', description: 'Your declarations page is in Documents and was sent to your lender.', occurredAt: '10/16/2026 · 01:10 PM', actor: 'Morgan Ellis', type: 'document' },
  { id: 'be-7', title: 'Title commitment received', description: 'Flathead Title sent the title report. Nothing unusual so far.', occurredAt: '10/14/2026 · 11:00 AM', actor: 'Morgan Ellis', type: 'document' },
  { id: 'be-6', title: 'Inspection period complete', description: 'Your inspection period ended with the repair amendment signed.', occurredAt: '10/12/2026 · 05:05 PM', actor: 'Avery Coleman', type: 'task' },
  { id: 'be-5', title: 'Repair amendment signed', description: 'The seller agreed to two repairs and a $2,500 credit.', occurredAt: '10/09/2026 · 06:20 PM', actor: 'Avery Coleman', type: 'document' },
  { id: 'be-4', title: 'Inspection report shared', description: 'Your inspector’s full report is in Documents.', occurredAt: '10/07/2026 · 06:30 PM', actor: 'Avery Coleman', type: 'document' },
  { id: 'be-3', title: 'Earnest money received', description: 'Flathead Title confirmed your deposit. The receipt is in Documents.', occurredAt: '10/05/2026 · 11:02 AM', actor: 'Morgan Ellis', type: 'task' },
  { id: 'be-2', title: 'Inspection booked', description: 'Big Sky Inspections will be at the home Wednesday, Oct 7 at 9:00 AM.', occurredAt: '10/03/2026 · 10:30 AM', actor: 'Avery Coleman', type: 'note' },
  { id: 'be-1', title: 'Purchase contract signed', description: 'You and the seller both signed. Your contract is in Documents.', occurredAt: '10/02/2026 · 03:10 PM', actor: 'Avery Coleman', type: 'document' },
]

/* ---------- Notes: the lender's "before closing" warning is starred, so it leads Important notes ---------- */

const notes: TeamNote[] = [
  {
    id: 'bn-lender-warning',
    body: `Please hold off on all of these until after closing. Any one of them can change your loan approval, even in the last week.

Don’t make big purchases, like a car, furniture, or appliances.
Don’t open new credit cards or loans, or co-sign for anyone.
Don’t change jobs, quit, or switch to self-employment.
Don’t move large sums of money between accounts, or deposit cash you can’t document.

If something comes up, call me first. It’s almost always fixable when I know ahead of time.`,
    author: 'Cameron Tate',
    authorPhotoUrl: cameronPhoto,
    createdAt: '10/02/2026 · 05:15 PM',
    starredAt: '2026-10-02T17:20:00-06:00',
  },
  {
    id: 'bn-closing-details',
    body: 'Closing is Friday, Nov 6 at 10:00 AM at Flathead Title, 35 1st Ave E in Kalispell. Both of you need to be there with a photo ID. Your funds need to arrive by Thursday. Call Priya at Flathead Title to confirm wiring instructions before you send anything.',
    author: 'Morgan Ellis',
    authorPhotoUrl: morganPhoto,
    createdAt: '10/29/2026 · 09:10 AM',
  },
  {
    id: 'bn-welcome',
    body: 'Welcome home! Your keys, garage openers, and the mailbox key are all in the kitchen drawer by the fridge. The seller left the appliance manuals there too. Don’t forget to rekey the locks this week.',
    author: 'Avery Coleman',
    authorPhotoUrl: averyPhoto,
    createdAt: '11/06/2026 · 03:45 PM',
  },
  {
    id: 'bn-appraisal',
    body: 'Good news. The appraisal came in right at the purchase price, so nothing changes with your loan. Cameron is moving to final approval.',
    author: 'Avery Coleman',
    authorPhotoUrl: averyPhoto,
    createdAt: '10/19/2026 · 10:00 AM',
  },
  {
    id: 'bn-repairs',
    body: 'The seller agreed to service the furnace and replace the deck railing, plus a $2,500 credit toward your closing costs. The signed amendment is in Documents. I’ll check the repairs at your final walkthrough.',
    author: 'Avery Coleman',
    authorPhotoUrl: averyPhoto,
    createdAt: '10/09/2026 · 06:30 PM',
  },
  {
    id: 'bn-inspection-plan',
    body: 'I’ll meet you at the house Wednesday at 9. Bring the seller’s disclosure and your questions. The inspector walks through findings at the end. That’s the best time to ask about anything that worries you.',
    author: 'Avery Coleman',
    authorPhotoUrl: averyPhoto,
    createdAt: '10/05/2026 · 04:20 PM',
  },
  {
    id: 'bn-earnest',
    body: 'Flathead Title confirmed your earnest money arrived this morning. Your receipt is in Documents. Nice work hitting the first deadline.',
    author: 'Morgan Ellis',
    authorPhotoUrl: morganPhoto,
    createdAt: '10/05/2026 · 11:10 AM',
  },
  {
    id: 'bn-meeting',
    body: `## Overview
- Avery walked Linh and David through the signed contract and the next 10 days.

## Key dates
- Earnest money due Oct 5.
- Inspection Oct 7 at 9:00 AM.
- Repair request by Oct 9.
- Inspection period ends Oct 12 at 5:00 PM.
- Closing Nov 6.

## Earnest money
- Wire to Flathead Title after calling to confirm instructions.`,
    author: 'Avery Coleman',
    authorPhotoUrl: averyPhoto,
    createdAt: '10/02/2026 · 04:30 PM',
    meeting: {
      title: 'Contract walkthrough and your first 10 days',
      durationSeconds: 1046,
      leads: [],
      transaction: '128 Meadowbrook Lane',
      transcript: [
        { at: 5, speaker: 'Avery Coleman', text: 'Congratulations. You’re under contract. The next 10 days are the busiest part, so let’s go through them.' },
        { at: 41, speaker: 'Linh Nguyen', text: 'What do we need to do first?' },
        { at: 49, speaker: 'Avery Coleman', text: 'Earnest money. It’s due Monday. Call Flathead Title before you wire it, and only use a number you look up yourself.' },
        { at: 162, speaker: 'David Nguyen', text: 'And the inspection?' },
        { at: 170, speaker: 'Avery Coleman', text: 'Wednesday at nine. Come for the end, when the inspector walks you through what they found.' },
        { at: 402, speaker: 'Avery Coleman', text: 'Any repair request goes to the seller by Friday. Your inspection period ends Monday the 12th at five. Until then, you can still walk away with your deposit.' },
        { at: 655, speaker: 'Linh Nguyen', text: 'When is closing?' },
        { at: 661, speaker: 'Avery Coleman', text: 'Friday, November 6, at Flathead Title downtown. I’ll be there with you.' },
      ],
    },
  },
]

/* ---------- Emails picked up from the transaction's cc/bcc address ---------- */

const avery = { name: 'Avery Coleman', email: 'avery.coleman@example.com' }
const morgan = { name: 'Morgan Ellis', email: 'morgan.ellis@example.com' }
const cameron = { name: 'Cameron Tate', email: 'cameron.tate@example.com' }
const linh = { name: 'Linh Nguyen', email: 'linh.nguyen@example.com' }
const david = { name: 'David Nguyen', email: 'david.nguyen@example.com' }
const title = { name: 'Priya Nair', email: 'priya.nair@example.com' }
const inspector = { name: 'Chris Dahl', email: 'chris.dahl@example.com' }

const emails: TransactionEmail[] = [
  { id: 'be-mail-1', threadId: 'b-thread-contract', subject: 'You’re under contract on 128 Meadowbrook Lane', from: avery, to: [linh, david], cc: [morgan], sentAt: '2026-10-02T15:20:00-06:00', body: 'Linh and David,\n\nCongratulations! The seller signed, and you’re officially under contract. Your contract is in your portal.\n\nYour first deadline is earnest money on Monday. Morgan will send the title company’s details. Please call them to confirm wiring instructions before you send anything.\n\nAvery', attachments: [{ id: 'b-att-1', fileName: 'PSA_128_Meadowbrook_executed.pdf', size: '612 KB' }] },
  { id: 'be-mail-2', threadId: 'b-thread-contract', subject: 'Re: You’re under contract on 128 Meadowbrook Lane', from: linh, to: [avery], cc: [david, morgan], sentAt: '2026-10-02T18:02:00-06:00', body: 'Thank you! We’re so excited. We’ll call the title company first thing tomorrow.\n\nLinh' },
  { id: 'be-mail-3', threadId: 'b-thread-earnest', subject: 'Earnest money received', from: title, to: [morgan], cc: [avery], sentAt: '2026-10-05T10:58:00-06:00', body: 'Morgan,\n\nConfirming we received the buyers’ earnest money this morning for 128 Meadowbrook Lane. Receipt attached.\n\nPriya Nair\nFlathead Title', attachments: [{ id: 'b-att-2', fileName: 'EM_receipt_FlatheadTitle.pdf', size: '88 KB' }] },
  { id: 'be-mail-4', threadId: 'b-thread-inspection', subject: 'Inspection report: 128 Meadowbrook Lane', from: inspector, to: [linh, david], cc: [avery], sentAt: '2026-10-07T18:25:00-06:00', body: 'Hi Linh and David,\n\nIt was great meeting you today. Your full report is attached. The main items are the furnace service and the loose deck railing. The rest is routine maintenance.\n\nHappy to answer questions.\n\nChris Dahl\nBig Sky Inspections', attachments: [{ id: 'b-att-3', fileName: 'BigSky_Inspection_Report_1007.pdf', size: '4.2 MB' }] },
  { id: 'be-mail-5', threadId: 'b-thread-commitment', subject: 'Your loan is approved', from: cameron, to: [linh, david], cc: [avery, morgan], sentAt: '2026-10-28T14:35:00-06:00', body: 'Linh and David,\n\nGreat news. You have final loan approval. Your commitment letter is attached.\n\nOne reminder: please keep your finances steady until closing. No new credit, big purchases, or job changes.\n\nCameron', attachments: [{ id: 'b-att-4', fileName: 'Commitment_Letter.pdf', size: '140 KB' }] },
  { id: 'be-mail-6', threadId: 'b-thread-closing', subject: 'Closing details for Friday', from: morgan, to: [linh, david], cc: [avery], sentAt: '2026-11-03T09:00:00-07:00', body: 'Hi both,\n\nClosing is Friday, Nov 6 at 10:00 AM at Flathead Title, 35 1st Ave E, Kalispell. Please bring a photo ID each.\n\nYour funds need to arrive by Thursday. Call Priya at Flathead Title at a number you look up yourself to confirm wiring instructions.\n\nMorgan' },
]

/* ---------- The team's to-dos, with dates so status follows "today" ---------- */

type DatedTodo = Omit<TeamTodo, 'status' | 'when'> & { starts: string; due: string }

const todos: DatedTodo[] = [
  { id: 'bt-1', title: 'Open escrow and order title', description: 'Escrow opened with Flathead Title. Title report ordered.', owner: 'Morgan Ellis', starts: '2026-10-02', due: '2026-10-03' },
  { id: 'bt-2', title: 'Book your inspection', description: 'Big Sky Inspections, Wednesday at 9:00 AM.', owner: 'Avery Coleman', starts: '2026-10-02', due: '2026-10-03' },
  { id: 'bt-3', title: 'Confirm your earnest money arrived', description: 'Checking with Flathead Title and sending you the receipt.', owner: 'Morgan Ellis', starts: '2026-10-03', due: '2026-10-05' },
  { id: 'bt-4', title: 'Write and negotiate your repair request', description: 'Turning the inspection findings into a request the seller can say yes to.', owner: 'Avery Coleman', starts: '2026-10-07', due: '2026-10-09' },
  { id: 'bt-5', title: 'Order the appraisal', description: 'Scheduling the appraiser with the listing agent.', owner: 'Cameron Tate', starts: '2026-10-06', due: '2026-10-14' },
  { id: 'bt-6', title: 'Get your loan to final approval', description: 'Reviewing your file, the appraisal, and the title report.', owner: 'Cameron Tate', starts: '2026-10-06', due: '2026-10-28' },
  { id: 'bt-7', title: 'Schedule closing', description: 'Booking the signing with Flathead Title and confirming who needs to be there.', owner: 'Morgan Ellis', starts: '2026-10-20', due: '2026-10-29' },
  { id: 'bt-8', title: 'Check the repairs were done', description: 'Collecting receipts from the seller before your walkthrough.', owner: 'Avery Coleman', starts: '2026-10-29', due: '2026-11-05' },
  { id: 'bt-9', title: 'Hand over your keys', description: 'Meeting you at the home once the sale records.', owner: 'Avery Coleman', starts: '2026-11-06', due: '2026-11-06' },
]

/** Done once its due date passes, otherwise open. Finished work drops off after two weeks. */
function todosAt(today: string): TeamTodo[] {
  return todos
    .filter((todo) => todo.due >= addDays(today, -14))
    .map(({ starts, due, ...todo }) => {
      const done = due < today
      const status: TeamTodo['status'] = done ? 'done' : 'open'
      return { ...todo, status, when: done ? `Done ${formatDay(due)}` : `By ${formatDay(due)}` }
    })
}

function addDays(iso: string, days: number) {
  const date = new Date(`${iso}T12:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

/* ---------- The transaction ---------- */

export const buyerTransaction: SellerTransaction = {
  ...sampleSellerTransaction,
  listing: { ...sampleSellerTransaction.listing, status: 'Pending' },
  team,
  viewers: [
    { id: 'buyer', name: 'Linh Nguyen', role: 'Buyer', initials: 'LN' },
    { id: 'co-buyer', name: 'David Nguyen', role: 'Co-buyer', initials: 'DN' },
  ],
  timeline: events,
  notes,
  resources: buyerResources,
  // Seller-only content never reaches the buyer view.
  advertising: [],
  feedback: [],
  upcomingDates: [],
  tasks: [],
  documents: [],
}

/** Everything that exists by `today`: updates, notes, emails, and the team's current to-dos. */
export function buyerTransactionAt(today: string) {
  const by = happenedBy(today)
  // The lender's warning only matters until closing, so the team unstars it once the sale closes.
  const closed = today > buyerDeal.closingDate
  const current = notes
    .filter((note) => by(note.createdAt))
    .map((note) => (closed && note.id === 'bn-lender-warning' ? { ...note, starredAt: undefined } : note))
  return {
    transaction: { ...buyerTransaction, timeline: events.filter((event) => by(event.occurredAt)), notes: current },
    emails: emails.filter((email) => email.sentAt.slice(0, 10) <= today),
    todos: todosAt(today),
  }
}
