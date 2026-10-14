import type { SellerTransaction } from '../../seller-portal/sellerTransaction'
import type { TransactionResource } from '../../transaction-portal/types'

export type SellerJourneyView = 'before-listing' | 'under-contract'

export const sellerJourneyViews: Array<{ id: SellerJourneyView; label: string; description: string }> = [
  { id: 'before-listing', label: 'Before listing', description: 'Preparing the home and planning the launch.' },
  { id: 'under-contract', label: 'Under contract', description: 'An offer is accepted. Working toward closing.' },
]

export function readSellerJourneyView(search: string): SellerJourneyView {
  return new URLSearchParams(search).get('view') === 'before-listing' ? 'before-listing' : 'under-contract'
}

const preparationGuide: TransactionResource = {
  id: 'listing-preparation',
  title: 'Getting your home ready to list',
  summary: 'Photography, property details, and the steps before your home goes live.',
  readingTime: '3 min read',
  relevance: 'Useful now',
  sections: [
    { title: 'Before photography', points: ['Clear counters and put away personal items.', 'Let your team know about pets and access instructions.', 'Confirm the appointment and which rooms will be photographed.'] },
    { title: 'Review your listing', body: 'Check the property details, photos, and description with your agent. Flag anything that needs correcting before the listing is published.' },
    { title: 'Planning the launch', body: 'Your team will confirm the listing price, launch date, and showing arrangements with you. Marketing results and buyer feedback will appear after your home goes live.' },
  ],
  questions: ['What should I prepare before the photographer arrives?', 'When can I review the photos and description?', 'What needs to be finished before we go live?'],
}

export function createBeforeListingTransaction(source: SellerTransaction): SellerTransaction {
  const agent = source.team.find((member) => member.id === source.teamBrand.leadAgentId)
  const seller = source.viewers[0]
  const coordinator = source.team.find((member) => member.id === 'listing') ?? agent
  return {
    ...source,
    clientMessage: source.clientMessage ?? {
      title: 'Before your home goes live',
      body: 'We’re getting everything ready for your home’s debut. Photography is booked for August 26, and we’re aiming to go live on September 1. We’ll share the photos and draft listing with you first, and keep you posted as the plan comes together.',
    },
    listing: {
      ...source.listing,
      status: 'Coming soon',
      published: false,
      dataSource: 'Brivity',
      mlsNumber: '',
      daysOnMarket: 0,
      lastUpdated: '08/24/2026',
      expiration: 'Not set',
    },
    timeline: [
      { id: 'prep-plan', title: 'Launch plan shared', description: 'Your agent shared the photography schedule and proposed September 1 launch date.', occurredAt: '08/24/2026 · 04:20 PM', actor: agent?.name ?? source.teamBrand.name, type: 'note' },
      { id: 'prep-photos', title: 'Photography appointment confirmed', description: 'Your photographer will visit on August 26 at 10:00 AM.', occurredAt: '08/24/2026 · 11:10 AM', actor: coordinator?.name ?? source.teamBrand.name, type: 'listing' },
      { id: 'prep-disclosures', title: 'Seller disclosures shared', description: 'Your disclosure forms are ready to review in Documents.', occurredAt: '08/22/2026 · 09:15 AM', actor: agent?.name ?? source.teamBrand.name, type: 'document' },
      { id: 'prep-agreement', title: 'Listing agreement signed', description: 'The signed agreement is available in Documents.', occurredAt: '08/20/2026 · 10:42 AM', actor: seller?.name ?? 'Seller', type: 'document' },
      { id: 'prep-consultation', title: 'Listing consultation completed', description: 'You met with your agent to discuss your selling goals and next steps.', occurredAt: '08/18/2026 · 10:30 AM', actor: agent?.name ?? source.teamBrand.name, type: 'note' },
    ],
    upcomingDates: [
      { id: 'prep-photography', date: '2026-08-26', title: 'Photography appointment', description: '10:00 AM at your home. Your photographer will capture the interior and outdoor spaces.', guidance: source.resources ? { explanation: 'Professional photos help buyers get a clear first impression of your home.', preparation: 'Clear counters and personal items, and confirm access instructions with your team.', resourceIds: ['listing-preparation'] } : undefined },
      { id: 'prep-review', date: '2026-08-28', title: 'Draft listing review', description: 'Your agent will share the photos and description for your review before publishing.' },
      { id: 'prep-launch', date: '2026-09-01', title: 'Planned listing launch', description: 'Your target date to go live, pending your final review. Your agent will confirm.' },
    ],
    tasks: [
      { id: 'prep-task-photos', name: 'Prepare your home for photography', description: 'Tidy the rooms, clear surfaces, and share any access instructions with your team.', assignee: seller?.name ?? 'Seller', dueDate: '08/26/2026' },
      { id: 'prep-task-details', name: 'Review your listing details', description: 'Check the property facts and draft description before your home is published.', assignee: seller?.name ?? 'Seller', dueDate: '08/28/2026' },
      { id: 'prep-task-disclosures', name: 'Complete seller disclosures', description: 'Review the disclosure form and ask your agent about any unclear questions.', assignee: seller?.name ?? 'Seller', dueDate: '08/28/2026' },
    ],
    advertising: [],
    feedback: [],
    notes: [
      { id: 'prep-note-launch', title: 'Your listing launch plan', body: 'We’re aiming to launch on September 1. Photography is scheduled for August 26, then we’ll review the photos and listing details together. We’ll confirm the final launch date once everything is ready.', author: agent?.name ?? source.teamBrand.name, authorPhotoUrl: agent?.photoUrl, createdAt: '08/24/2026 · 04:45 PM' },
      { id: 'prep-note-photos', title: 'Getting ready for photography', body: 'Please clear counters and put away personal items before the photographer arrives. Let us know about pets or any special access instructions so we can plan the visit.', author: coordinator?.name ?? source.teamBrand.name, authorPhotoUrl: coordinator?.photoUrl, createdAt: '08/24/2026 · 11:30 AM' },
    ],
    documents: [
      { id: 'prep-doc-agreement', name: 'Exclusive listing agreement', category: 'Listing paperwork', uploadedAt: '08/20/2026', postedBy: agent?.name ?? source.teamBrand.name, status: 'Signed', summary: 'The signed agreement covering your listing terms and marketing plan.' },
      { id: 'prep-doc-disclosures', name: 'Property disclosures', category: 'Property information', uploadedAt: '08/22/2026', postedBy: agent?.name ?? source.teamBrand.name, status: 'Signature requested', summary: 'Disclosure forms for you to review and complete before launch.' },
      { id: 'prep-doc-plan', name: 'Listing launch plan', category: 'Marketing', uploadedAt: '08/24/2026', postedBy: coordinator?.name ?? source.teamBrand.name, status: 'Ready to view', summary: 'Your proposed launch date, photography appointment, and planned marketing activities.' },
    ],
    details: {
      ...source.details,
      dateListed: 'Not listed yet',
      listingFacts: source.details.listingFacts.filter((fact) => fact.label !== 'MLS #'),
      customDates: [
        { label: 'Photography scheduled', value: '08/26/2026' },
        { label: 'Listing review', value: '08/28/2026' },
        { label: 'Target launch date', value: '09/01/2026' },
      ],
    },
    resources: source.resources ? [preparationGuide, ...source.resources.filter((resource) => resource.id === 'disclosures')] : undefined,
  }
}
