import { sampleSellerTransaction, type SellerTransaction } from './sellerTransaction'
import type { TeamMember, TeamNote, TimelineEvent, TransactionTask } from '../transaction-portal/types'

const photoOf = (name: string) => sampleSellerTransaction.team.find((person) => person.name === name)?.photoUrl

/** Newest first, matching how the activity list reads. */
const extraActivity: TimelineEvent[] = [
  { id: 'event-5', title: 'Deposit received', description: 'Escrow confirmed the buyer’s earnest money deposit.', occurredAt: '10/05/2026 · 11:20 AM', actor: 'Morgan Ellis', type: 'document' },
  { id: 'event-6', title: 'Title report ready', description: 'The preliminary title report is available in Documents.', occurredAt: '10/01/2026 · 02:45 PM', actor: 'Kendall Ortiz', type: 'document' },
  { id: 'event-7', title: 'Offer accepted', description: 'You accepted the buyer’s offer. Your home is now under contract.', occurredAt: '09/30/2026 · 09:05 AM', actor: 'Tim Bennett', type: 'listing' },
  { id: 'event-8', title: 'Offer received', description: 'Your team shared a new offer for your review.', occurredAt: '09/28/2026 · 04:12 PM', actor: 'Avery Coleman', type: 'listing' },
  { id: 'event-9', title: 'Second open house wrapped up', description: 'Fourteen groups came through. Feedback is in the showing summary.', occurredAt: '09/20/2026 · 03:30 PM', actor: 'Robin Hayes', type: 'showing' },
  { id: 'event-10', title: 'Price review shared', description: 'Your team shared recent nearby sales for a quick look.', occurredAt: '09/17/2026 · 10:10 AM', actor: 'Avery Coleman', type: 'note' },
  { id: 'event-11', title: 'Listing details refreshed', description: 'Photos and remarks were updated across listing sites.', occurredAt: '09/15/2026 · 01:25 PM', actor: 'Cameron Tate', type: 'listing' },
]

const extraTasks: TransactionTask[] = [
  { id: 'task-4', name: 'Sign the lead-based paint disclosure', description: 'Required for homes built before 1978. It takes about a minute.', assignee: 'Tim Bennett', dueDate: '10/08/2026' },
  { id: 'task-5', name: 'Gather HOA login details', description: 'Share your HOA portal login so we can request the resale certificate.', assignee: 'Alex Bennett', dueDate: '10/09/2026' },
  { id: 'task-6', name: 'Respond to the repair request', description: 'Review the buyer’s repair list and tell us what you’re comfortable with.', assignee: 'Tim Bennett', dueDate: '10/16/2026' },
  { id: 'task-7', name: 'Schedule utility transfers', description: 'Pick a shut-off date for power, water, and internet after closing.', assignee: 'Alex Bennett', dueDate: '10/28/2026' },
  { id: 'task-8', name: 'Confirm your forwarding address', description: 'Where should mail and final documents go after you move?', assignee: 'Tim Bennett', dueDate: '10/30/2026' },
  { id: 'task-9', name: 'Plan the final walkthrough', description: 'Choose a time the buyer can see the home the day before closing.', assignee: 'Morgan Ellis', dueDate: '11/05/2026' },
]

const extraNotes: TeamNote[] = [
  { id: 'note-5', body: 'The buyer’s inspection is scheduled for October 9. Plan for about three hours at the home. You’re welcome to be away, and we’ll let you know when they’re finished.', author: 'Morgan Ellis', authorPhotoUrl: photoOf('Morgan Ellis'), createdAt: '10/02/2026 · 01:30 PM' },
  { id: 'note-6', body: 'Great news on the offer. We negotiated a firm closing date and kept the price where we wanted it.', author: 'Avery Coleman', authorPhotoUrl: photoOf('Avery Coleman'), createdAt: '09/30/2026 · 10:20 AM' },
  { id: 'note-7', body: 'Photos from the second open house are in. We’ll swap two of them into the listing gallery this week.', author: 'Kendall Ortiz', authorPhotoUrl: photoOf('Kendall Ortiz'), createdAt: '09/21/2026 · 09:40 AM' },
  { id: 'note-8', body: 'Reminder: please keep the garage clear on showing days. It helps buyers picture the space.', author: 'Robin Hayes', authorPhotoUrl: photoOf('Robin Hayes'), createdAt: '09/16/2026 · 11:05 AM' },
]


/**
 * The "Current Functionality" seller portal: the sample sale with a fuller document library,
 * so the Documents tab shows how a longer list reads. Sample files reuse the existing prototype PDFs.
 */
/** Starred notes lead, then newest first. */
function orderNotes(notes: TeamNote[]) {
  const time = (note: TeamNote) => { const [m, d, y] = note.createdAt.split(' · ')[0].split('/'); return `${y}${m}${d}` }
  const byNewest = (a: TeamNote, b: TeamNote) => time(b).localeCompare(time(a))
  return [...notes.filter((note) => note.starredAt).sort(byNewest), ...notes.filter((note) => !note.starredAt).sort(byNewest)]
}

/** Outside partners on the sale. They're not on the PLACE team, but the seller may need to reach them. */
const collaborators: TeamMember[] = [
  { id: 'escrow', name: 'Priya Natarajan', role: 'Escrow officer · Cascade Title', initials: 'PN', phone: '+14065550141', email: 'priya.natarajan@example.com' },
  { id: 'title', name: 'Daniel Okafor', role: 'Title officer · Cascade Title', initials: 'DO', phone: '+14065550142', email: 'daniel.okafor@example.com' },
  { id: 'lender', name: 'Hannah Brooks', role: 'Buyer’s lender · Summit Home Loans', initials: 'HB', phone: '+14065550143', email: 'hannah.brooks@example.com' },
  { id: 'attorney', name: 'Marcus Chen', role: 'Real estate attorney', initials: 'MC', phone: '+14065550144', email: 'marcus.chen@example.com' },
  { id: 'inspector', name: 'Elena Ruiz', role: 'Home inspector · Northline Inspections', initials: 'ER', phone: '+14065550145', email: 'elena.ruiz@example.com' },
]

const viewerContacts: Record<string, { phone: string; email: string }> = {
  seller: { phone: '+14065550161', email: 'tim.bennett@example.com' },
  'co-seller': { phone: '+14065550162', email: 'alex.bennett@example.com' },
}

export const currentSellerTransaction: SellerTransaction = {
  ...sampleSellerTransaction,
  collaborators,
  viewers: sampleSellerTransaction.viewers.map((viewer) => ({ ...viewer, ...viewerContacts[viewer.id] })),
  upcomingDates: [
    ...sampleSellerTransaction.upcomingDates,
    { id: 'date-5', date: '2026-10-10', title: 'Buyer’s home inspection', description: 'The buyer’s inspector visits the home.' },
    { id: 'date-6', date: '2026-10-24', title: 'Contingencies cleared', description: 'Inspection and financing conditions are resolved.' },
    { id: 'date-7', date: '2026-11-05', title: 'Final walkthrough', description: 'The buyer’s last look before closing.' },
    { id: 'date-8', date: '2026-08-14', title: 'Listing agreement signed', description: 'You and your agent agreed to the terms of the listing.' },
    { id: 'date-9', date: '2026-08-20', title: 'Professional photos', description: 'Photos and a floor plan were captured.' },
    { id: 'date-10', date: '2026-08-27', title: 'Listed on the market', description: 'The home went live.' },
    { id: 'date-11', date: '2026-08-30', title: 'Open house', description: 'The first open house.' },
    { id: 'date-12', date: '2026-09-12', title: 'Offer review deadline', description: 'Offers were due for review.' },
    { id: 'date-13', date: '2026-09-18', title: 'Offer accepted', description: 'You accepted the buyer’s offer.' },
    { id: 'date-14', date: '2026-09-30', title: 'Purchase agreement signed', description: 'Both sides signed the agreement.' },
  ],
  timeline: [...extraActivity, ...sampleSellerTransaction.timeline],
  tasks: [...sampleSellerTransaction.tasks, ...extraTasks],
  notes: orderNotes([...sampleSellerTransaction.notes, ...extraNotes]),
  documents: [
    ...sampleSellerTransaction.documents,
    {
      id: 'doc-5',
      name: 'Purchase and sale agreement',
      category: 'Contract',
      uploadedAt: '09/30/2026',
      postedBy: 'Morgan Ellis',
      status: 'Signed',
      summary: 'The fully signed agreement with the agreed price, terms, and closing date.',
      fileUrl: '/documents/doc-1.pdf',
    },
    {
      id: 'doc-6',
      name: 'Earnest money receipt',
      category: 'Escrow',
      uploadedAt: '10/02/2026',
      postedBy: 'Avery Coleman',
      status: 'Ready to view',
      summary: 'Confirmation that the buyer’s deposit reached escrow.',
      fileUrl: '/documents/doc-2.pdf',
    },
    {
      id: 'doc-7',
      name: 'Seller disclosure statement (Form 17)',
      category: 'Property information',
      uploadedAt: '10/03/2026',
      postedBy: 'Avery Coleman',
      status: 'Signature requested',
      summary: 'Review the property condition answers and sign before the deadline.',
      fileUrl: '/documents/doc-3.pdf',
    },
    {
      id: 'doc-8',
      name: 'Lead-based paint disclosure',
      category: 'Property information',
      uploadedAt: '10/03/2026',
      postedBy: 'Avery Coleman',
      status: 'Signature requested',
      summary: 'Required disclosure for homes built before 1978.',
      fileUrl: '/documents/doc-4.pdf',
    },
    {
      id: 'doc-9',
      name: 'Preliminary title report',
      category: 'Title',
      uploadedAt: '10/01/2026',
      postedBy: 'Kendall Ortiz',
      status: 'Ready to view',
      summary: 'The title company’s first look at ownership and any recorded liens.',
      fileUrl: '/documents/doc-5.pdf',
    },
    {
      id: 'doc-10',
      name: 'Home inspection report',
      category: 'Inspection',
      uploadedAt: '10/09/2026',
      postedBy: 'Morgan Ellis',
      status: 'Ready to view',
      summary: 'The buyer’s inspection findings and photos.',
      fileUrl: '/documents/doc-6.pdf',
    },
    {
      id: 'doc-11',
      name: 'Repair request addendum',
      category: 'Contract',
      uploadedAt: '10/11/2026',
      postedBy: 'Morgan Ellis',
      status: 'Signature requested',
      summary: 'Items the buyer asked to repair, with space for your response.',
      fileUrl: '/documents/doc-1.pdf',
    },
    {
      id: 'doc-12',
      name: 'Appraisal report',
      category: 'Lender',
      uploadedAt: '10/14/2026',
      postedBy: 'Kendall Ortiz',
      status: 'Ready to view',
      summary: 'The lender’s opinion of the home’s value.',
      fileUrl: '/documents/doc-2.pdf',
    },
    {
      id: 'doc-13',
      name: 'Seller net sheet',
      category: 'Closing',
      uploadedAt: '10/12/2026',
      postedBy: 'Morgan Ellis',
      status: 'Ready to view',
      summary: 'An estimate of what you’ll take home at closing, after costs.',
      fileUrl: '/documents/doc-3.pdf',
    },
    {
      id: 'doc-14',
      name: 'HOA resale certificate',
      category: 'Property information',
      uploadedAt: '10/05/2026',
      postedBy: 'Avery Coleman',
      status: 'Ready to view',
      summary: 'Dues, rules, and reserves from the homeowners association.',
      fileUrl: '/documents/doc-4.pdf',
    },
    {
      id: 'doc-15',
      name: 'Closing disclosure',
      category: 'Closing',
      uploadedAt: '10/20/2026',
      postedBy: 'Kendall Ortiz',
      status: 'Ready to view',
      summary: 'The final statement of costs and credits for the sale.',
      fileUrl: '/documents/doc-5.pdf',
    },
    {
      id: 'doc-16',
      name: 'Final walkthrough checklist',
      category: 'Closing',
      uploadedAt: '10/22/2026',
      postedBy: 'Morgan Ellis',
      status: 'Ready to view',
      summary: 'What the buyer will confirm before signing day.',
      fileUrl: '/documents/doc-6.pdf',
    },
  ],
}
