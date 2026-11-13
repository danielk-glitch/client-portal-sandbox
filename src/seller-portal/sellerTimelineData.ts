import type { TransactionResource } from '../transaction-portal/types'
import { sellerResources } from './sellerResources'

/** Seller stages, then buyer stages. Both sides share 'closing'. */
export type MilestoneId = 'pre-listing' | 'active-listing' | 'under-contract' | 'closing' | 'inspection-period' | 'financing' | 'move-in'
export type TimelineStatus = 'complete' | 'current' | 'upcoming'
/** Each type gets one icon. Resources come from milestone.resourceIds. There are no action items: anything that isn't a document is a date. */
export type TimelineItemKind = 'date' | 'document' | 'resource'

export type SellerTimelineStep = {
  id: string
  title: string
  summary: string
  /** ISO date. Omit when timing depends on events that have not happened yet. */
  date?: string
  /** How the date should read: "Due Oct 8", "Planned Sep 1". Defaults to the plain date. */
  dateLabel?: 'Due' | 'Planned' | 'Expected' | 'Scheduled'
  /** Shown in place of a date that isn't scheduled yet, such as "About 3 days before closing". */
  estimate?: string
  /** "you" for the seller, otherwise a team member or outside party name. */
  owner: 'you' | string
  status: TimelineStatus
  /** Defaults: document when a document is attached, otherwise date. */
  kind?: Exclude<TimelineItemKind, 'resource'>
  detail?: string
  resourceId?: string
  documentId?: string
  /** A document that will be shared later. Shown locked while its milestone is upcoming. */
  pendingDocument?: string
  opensMarketing?: boolean
}

export type SellerMilestone = {
  id: MilestoneId
  label: string
  status: TimelineStatus
  startDate?: string
  endDate?: string
  /** Overrides the "From <start date>" caption on an upcoming stage's marker. The dates above still place it on the calendar. */
  caption?: string
  summary: string
  steps: SellerTimelineStep[]
  resourceIds: string[]
}

export type SellerTimelineData = {
  today: string
  nextStepId: string
  /** The headline moment for the countdown, e.g. "31 days until closing". */
  countdown?: { date: string; label: string }
  milestones: SellerMilestone[]
}

const timelineOnlyResources: TransactionResource[] = [
  {
    id: 'listing-preparation',
    title: 'Getting your home ready to list',
    shortTitle: 'Listing preparation',
    summary: 'Photography, property details, and the steps before your home goes live.',
    readingTime: '3 min read',
    relevance: 'Useful now',
    sections: [
      { title: 'Before photography', points: ['Clear counters and put away personal items.', 'Let your team know about pets and access instructions.', 'Confirm the appointment and which rooms will be photographed.'] },
      { title: 'Review your listing', body: 'Check the property details, photos, and description with your agent. Flag anything that needs correcting before the listing is published.' },
      { title: 'Planning the launch', body: 'Your team will confirm the listing price, launch date, and showing arrangements with you. Marketing results and buyer feedback will appear after your home goes live.' },
    ],
    questions: ['What should I prepare before the photographer arrives?', 'When can I review the photos and description?', 'What needs to be finished before we go live?'],
  },
  {
    id: 'pricing',
    title: 'How your listing price comes together',
    shortTitle: 'Pricing guide',
    summary: 'The market data and goals behind your starting price.',
    readingTime: '3 min read',
    relevance: 'Good to know',
    sections: [
      { title: 'What goes into the price', body: 'Your agent looks at recent nearby sales, homes currently for sale, and how quickly similar homes are selling. Your goals and timing shape where the price lands within that range.' },
      { title: 'Why the first weeks matter', body: 'Buyer interest is usually highest right after a home goes live. A well-placed price helps your home reach the right buyers during that window.' },
      { title: 'If the market shifts', body: 'Your agent will share showing activity and feedback as it comes in. If the response is different than expected, they will talk through options with you.' },
    ],
    questions: ['Which recent sales shaped our price?', 'How will we know if the price is working?', 'When would we revisit it?'],
  },
  {
    id: 'showings',
    title: 'Living in your home while it’s for sale',
    shortTitle: 'Showings guide',
    summary: 'Keeping showings easy without putting life on hold.',
    readingTime: '2 min read',
    relevance: 'Good to know',
    sections: [
      { title: 'Before each showing', points: ['Open blinds and turn on lights.', 'Put away valuables, medications, and personal paperwork.', 'Plan where pets will be during the visit.'] },
      { title: 'How feedback reaches you', body: 'Your team collects comments from buyer agents after showings and shares them in your portal. A single comment rarely tells the whole story. Your agent will point out patterns.' },
    ],
    questions: ['How much notice will I get before a showing?', 'Should I be home during showings?', 'What feedback should we act on?'],
  },
  {
    id: 'reviewing-offers',
    title: 'How to compare offers',
    shortTitle: 'Offers guide',
    summary: 'Price is one part of an offer. Terms matter too.',
    readingTime: '3 min read',
    relevance: 'Good to know',
    sections: [
      { title: 'Beyond the price', points: ['How the buyer is paying, and how firm their financing is.', 'Which contingencies they included and how long each one lasts.', 'The proposed closing date and move-out timing.'] },
      { title: 'Responding', body: 'You can accept, decline, or counter an offer. Your agent will explain the tradeoffs and help you respond before the offer’s deadline.' },
    ],
    questions: ['Which offer is the most likely to close?', 'What can we ask for in a counteroffer?', 'How long do we have to respond?'],
  },
  {
    id: 'moving-out',
    title: 'Moving out and handing over the home',
    shortTitle: 'Move-out guide',
    summary: 'What to leave behind and how the key handoff works.',
    readingTime: '2 min read',
    relevance: 'Coming up',
    sections: [
      { title: 'What stays with the home', body: 'Your purchase agreement lists which fixtures and items are included in the sale. Check it before packing anything attached to walls, floors, or the yard.' },
      { title: 'Before you hand over keys', points: ['Schedule utility transfers for the possession date.', 'Leave manuals, warranties, and garage openers in a kitchen drawer.', 'Do a last walk through every room, closet, and outbuilding.'] },
    ],
    questions: ['When does the buyer take possession?', 'Where should we leave the keys?', 'Which items are included in the sale?'],
  },
]

/** The stage is called "Pending" in the portal, so the guide that explains it uses that word too. */
const withPendingWording = (guide: TransactionResource): TransactionResource => guide.id !== 'contingencies' ? guide : {
  ...guide,
  title: 'What “pending” means',
  sections: guide.sections.map((section) => ({ ...section, body: section.body?.replace('Under contract means', 'Pending means') })),
}

export const timelineResources: TransactionResource[] = [...timelineOnlyResources, ...sellerResources].map(withPendingWording)

/** Pending (the "under contract" stage). The prototype's "today" is October 6, 2026. */
export const underContractTimeline: SellerTimelineData = {
  today: '2026-10-06',
  nextStepId: 'uc-disclosures',
  countdown: { date: '2026-11-06', label: 'closing' },
  milestones: [
    {
      id: 'pre-listing',
      label: 'Pre-listing',
      status: 'complete',
      startDate: '2026-08-18',
      endDate: '2026-08-30',
      summary: 'Pricing, paperwork, and photography to get your home ready for buyers.',
      resourceIds: ['listing-preparation', 'pricing'],
      steps: [
        { id: 'pl-consultation', title: 'Listing consultation', summary: 'You met with Avery to talk through your goals, timing, and price.', date: '2026-08-18', owner: 'Avery Coleman', status: 'complete' },
        { id: 'pl-agreement', title: 'Listing agreement signed', summary: 'Your listing terms and marketing plan are on file.', date: '2026-08-20', owner: 'you', status: 'complete', documentId: 'doc-1' },
        { id: 'pl-details', title: 'Property details shared', summary: 'You shared the facts, updates, and history your team needed for the listing.', date: '2026-08-22', owner: 'you', status: 'complete' },
        { id: 'pl-pricing', title: 'Listing price set', summary: 'You and Avery agreed on a starting price based on recent nearby sales.', date: '2026-08-24', owner: 'Avery Coleman', status: 'complete' },
        { id: 'pl-photos', title: 'Professional photography', summary: 'Photos, video, and a floor plan were captured at your home.', date: '2026-08-26', owner: 'Robin Hayes', status: 'complete', resourceId: 'listing-preparation' },
        { id: 'pl-plan', title: 'Launch plan approved', summary: 'You approved the photos, description, and launch date.', date: '2026-08-30', owner: 'you', status: 'complete' },
      ],
    },
    {
      id: 'active-listing',
      label: 'Active listing',
      status: 'complete',
      startDate: '2026-09-01',
      endDate: '2026-10-02',
      summary: 'Your home was live for buyers, with marketing, showings, and offers.',
      resourceIds: ['showings', 'reviewing-offers'],
      steps: [
        { id: 'al-live', title: 'Listing published', summary: 'Your home went live on the MLS and major home search sites.', date: '2026-09-01', owner: 'Robin Hayes', status: 'complete' },
        { id: 'al-marketing', title: 'Marketing campaign launched', summary: 'Social posts, digital ads, and mailers started reaching buyers.', date: '2026-09-03', owner: 'Kendall Ortiz', status: 'complete', opensMarketing: true },
        { id: 'al-open-house', title: 'Open house', summary: 'Visitors toured the home during the weekend open house.', date: '2026-09-06', owner: 'Avery Coleman', status: 'complete' },
        { id: 'al-showings', title: 'Showings and buyer feedback', summary: '14 showings, with feedback shared after each visit.', date: '2026-09-10', owner: 'Avery Coleman', status: 'complete', documentId: 'doc-4' },
        { id: 'al-offer', title: 'Offer accepted', summary: 'You accepted an offer after reviewing terms with Avery.', date: '2026-10-02', owner: 'you', status: 'complete', resourceId: 'reviewing-offers' },
      ],
    },
    {
      id: 'under-contract',
      label: 'Pending',
      status: 'current',
      startDate: '2026-10-02',
      endDate: '2026-10-24',
      summary: 'The buyer completes inspections and financing while deadlines in your contract play out.',
      resourceIds: ['contingencies', 'disclosures', 'inspection', 'appraisal', 'earnest-money'],
      steps: [
        { id: 'uc-agreement', title: 'Purchase agreement signed', summary: 'Your accepted offer is now a signed contract with the buyer.', date: '2026-10-02', owner: 'you', status: 'complete' },
        { id: 'uc-deposit', title: 'Earnest money received', summary: 'The buyer’s deposit is being held by escrow.', date: '2026-10-05', owner: 'Morgan Ellis', status: 'complete', resourceId: 'earnest-money', detail: 'This deposit is applied to the buyer’s purchase at closing. You don’t need to do anything with it.' },
        { id: 'uc-disclosures', title: 'Review and sign Form 17', summary: 'Confirm what you know about the home’s condition and history.', date: '2026-10-08', dateLabel: 'Due', owner: 'you', status: 'current', documentId: 'doc-2', resourceId: 'disclosures', detail: 'Read each question carefully and answer based on what you know. Ask Avery about anything unclear before you sign.' },
        { id: 'uc-appraisal-access', title: 'Confirm appraisal access', summary: 'Let Morgan know how the appraiser can get in.', date: '2026-10-13', dateLabel: 'Due', owner: 'you', status: 'upcoming', detail: 'Share the gate code and let Morgan know about pets or areas that are off limits. A quick reply to her text is all it takes.' },
        { id: 'uc-inspection', title: 'Buyer’s home inspection', summary: 'The buyer’s inspector will look at the home’s condition.', date: '2026-10-10', dateLabel: 'Scheduled', owner: 'Buyer’s agent', status: 'upcoming', resourceId: 'inspection', detail: 'Plan to be away for about three hours. The buyer may request repairs or a credit afterward.' },
        { id: 'uc-appraisal', title: 'Appraisal', summary: 'The lender’s appraiser will estimate the home’s value.', date: '2026-10-14', dateLabel: 'Scheduled', owner: 'Morgan Ellis', status: 'upcoming', resourceId: 'appraisal', detail: 'Keep the side gate unlocked that morning and the driveway clear. Morgan will confirm the arrival window.' },
        { id: 'uc-contingencies', title: 'Contingencies cleared', summary: 'The buyer’s inspection and financing conditions are resolved.', date: '2026-10-24', dateLabel: 'Expected', owner: 'Avery Coleman', status: 'upcoming' },
      ],
    },
    {
      id: 'closing',
      label: 'Closing',
      status: 'upcoming',
      startDate: '2026-10-24',
      endDate: '2026-11-06',
      caption: 'From Nov 6',
      summary: 'Final paperwork, the walkthrough, and handing over the keys.',
      resourceIds: ['closing', 'moving-out'],
      steps: [
        { id: 'cl-statement', title: 'Review your closing statement', summary: 'Check the final numbers and confirm your signing time.', date: '2026-11-03', dateLabel: 'Due', owner: 'you', status: 'upcoming', resourceId: 'closing', pendingDocument: 'Closing statement' },
        { id: 'cl-walkthrough', title: 'Buyer’s final walkthrough', summary: 'The buyer confirms the home is in the agreed condition.', date: '2026-11-04', dateLabel: 'Planned', owner: 'Buyer’s agent', status: 'upcoming' },
        { id: 'cl-signing', title: 'Sign closing documents', summary: 'Sign the final paperwork with the title company.', date: '2026-11-06', dateLabel: 'Planned', owner: 'you', status: 'upcoming', resourceId: 'closing', pendingDocument: 'Closing documents' },
        { id: 'cl-keys', title: 'Hand over the keys', summary: 'Leave keys, openers, and manuals for the new owners.', date: '2026-11-06', dateLabel: 'Planned', owner: 'you', status: 'upcoming' },
        { id: 'cl-proceeds', title: 'Sale recorded and proceeds sent', summary: 'The sale is official and your proceeds are on the way.', date: '2026-11-07', dateLabel: 'Expected', owner: 'Morgan Ellis', status: 'upcoming', resourceId: 'closing' },
      ],
    },
  ],
}

/** Before listing. The prototype's "today" is August 24, 2026. */
export const beforeListingTimeline: SellerTimelineData = {
  today: '2026-08-24',
  nextStepId: 'bl-prepare',
  countdown: { date: '2026-09-01', label: 'your home goes live' },
  milestones: [
    {
      id: 'pre-listing',
      label: 'Pre-listing',
      status: 'current',
      startDate: '2026-08-18',
      endDate: '2026-08-31',
      summary: 'Pricing, paperwork, and photography to get your home ready for buyers.',
      resourceIds: ['listing-preparation', 'pricing', 'disclosures'],
      steps: [
        { id: 'bl-consultation', title: 'Listing consultation', summary: 'You met with Avery to talk through your goals, timing, and price.', date: '2026-08-18', owner: 'Avery Coleman', status: 'complete' },
        { id: 'bl-agreement', title: 'Listing agreement signed', summary: 'Your listing terms and marketing plan are on file.', date: '2026-08-20', owner: 'you', status: 'complete', documentId: 'prep-doc-agreement' },
        { id: 'bl-details', title: 'Property details shared', summary: 'You shared the facts, updates, and history your team needed for the listing.', date: '2026-08-22', owner: 'you', status: 'complete' },
        { id: 'bl-prepare', title: 'Prepare your home for photos', summary: 'Tidy rooms, clear surfaces, and share access instructions.', date: '2026-08-26', dateLabel: 'Due', owner: 'you', status: 'current', resourceId: 'listing-preparation', detail: 'Clear counters, put away personal items, and let Robin know about pets or gate codes.' },
        { id: 'bl-photos', title: 'Professional photography', summary: 'Photos, video, and a floor plan of your home.', date: '2026-08-26', dateLabel: 'Scheduled', owner: 'Robin Hayes', status: 'upcoming', detail: '10:00 AM at your home. Plan for about two hours.' },
        { id: 'bl-disclosures', title: 'Complete seller disclosures', summary: 'Share what you know about the home’s condition and history.', date: '2026-08-28', dateLabel: 'Due', owner: 'you', status: 'upcoming', documentId: 'prep-doc-disclosures', resourceId: 'disclosures' },
        { id: 'bl-review', title: 'Review your draft listing', summary: 'Check the photos, facts, and description before launch.', date: '2026-08-28', dateLabel: 'Planned', owner: 'you', status: 'upcoming' },
        { id: 'bl-launch', title: 'Approve your launch plan', summary: 'Confirm the price, launch date, and showing arrangements.', date: '2026-08-30', dateLabel: 'Planned', owner: 'you', status: 'upcoming', documentId: 'prep-doc-plan' },
      ],
    },
    {
      id: 'active-listing',
      label: 'Active listing',
      status: 'upcoming',
      startDate: '2026-09-01',
      summary: 'Your home is live for buyers, with marketing, showings, and offers.',
      resourceIds: ['showings', 'reviewing-offers'],
      steps: [
        { id: 'bl-live', title: 'Listing goes live', summary: 'Your home is published on the MLS and major home search sites.', date: '2026-09-01', dateLabel: 'Planned', owner: 'Robin Hayes', status: 'upcoming' },
        { id: 'bl-marketing', title: 'Marketing campaign launches', summary: 'Social posts, digital ads, and mailers start reaching buyers.', date: '2026-09-03', dateLabel: 'Planned', owner: 'Kendall Ortiz', status: 'upcoming' },
        { id: 'bl-open-house', title: 'First open house', summary: 'Buyers tour the home during a weekend open house.', date: '2026-09-06', dateLabel: 'Planned', owner: 'Avery Coleman', status: 'upcoming' },
        { id: 'bl-showings', title: 'Showings and buyer feedback', summary: 'Feedback from each visit appears here as it comes in.', owner: 'Avery Coleman', status: 'upcoming' },
        { id: 'bl-marketing-report', title: 'Review your first marketing report', summary: 'Views, saves, and showing activity from your first week live.', date: '2026-09-08', dateLabel: 'Planned', owner: 'you', status: 'upcoming', pendingDocument: 'Week one marketing report' },
        { id: 'bl-offers', title: 'Review offers', summary: 'Compare terms with Avery and choose how to respond.', owner: 'you', status: 'upcoming', resourceId: 'reviewing-offers' },
      ],
    },
    {
      id: 'under-contract',
      label: 'Pending',
      status: 'upcoming',
      summary: 'The buyer completes inspections and financing while deadlines in your contract play out.',
      resourceIds: ['contingencies', 'inspection', 'appraisal', 'earnest-money'],
      steps: [
        { id: 'bl-uc-agreement', title: 'Purchase agreement signed', summary: 'Your accepted offer becomes a signed contract.', owner: 'you', status: 'upcoming', resourceId: 'contingencies', pendingDocument: 'Purchase agreement' },
        { id: 'bl-uc-deposit', title: 'Earnest money received', summary: 'The buyer’s deposit is held by escrow.', owner: 'Morgan Ellis', status: 'upcoming', resourceId: 'earnest-money' },
        { id: 'bl-uc-inspection', title: 'Buyer’s home inspection', summary: 'An inspector looks at the home’s condition.', owner: 'Buyer’s agent', status: 'upcoming', resourceId: 'inspection' },
        { id: 'bl-uc-repairs', title: 'Respond to repair requests', summary: 'Decide with Avery how to answer anything the inspection turns up.', owner: 'you', status: 'upcoming', resourceId: 'inspection' },
        { id: 'bl-uc-appraisal', title: 'Appraisal', summary: 'The lender’s appraiser estimates the home’s value.', owner: 'Morgan Ellis', status: 'upcoming' },
        { id: 'bl-uc-contingencies', title: 'Contingencies cleared', summary: 'The buyer’s inspection and financing conditions are resolved.', owner: 'Avery Coleman', status: 'upcoming', resourceId: 'contingencies' },
      ],
    },
    {
      id: 'closing',
      label: 'Closing',
      status: 'upcoming',
      summary: 'Final paperwork, the walkthrough, and handing over the keys.',
      resourceIds: ['closing', 'moving-out'],
      steps: [
        { id: 'bl-cl-statement', title: 'Review your closing statement', summary: 'Check the final numbers and confirm your signing time.', owner: 'you', status: 'upcoming', resourceId: 'closing', pendingDocument: 'Closing statement' },
        { id: 'bl-cl-walkthrough', title: 'Buyer’s final walkthrough', summary: 'The buyer confirms the home is in the agreed condition.', owner: 'Buyer’s agent', status: 'upcoming' },
        { id: 'bl-cl-signing', title: 'Sign closing documents', summary: 'Sign the final paperwork with the title company.', owner: 'you', status: 'upcoming', resourceId: 'closing' },
        { id: 'bl-cl-keys', title: 'Hand over the keys', summary: 'Leave keys, openers, and manuals for the new owners.', owner: 'you', status: 'upcoming' },
      ],
    },
  ],
}

/**
 * Listed: live since Sep 1, no offer yet. "Today" is October 6, 2026, matching the market activity mock.
 * Pre-listing comes from the pending view; Pending and Closing reuse the before-listing stages, which have no dates yet.
 */
const pendingPreListing = underContractTimeline.milestones.find((milestone) => milestone.id === 'pre-listing')!
const pendingActiveListing = underContractTimeline.milestones.find((milestone) => milestone.id === 'active-listing')!
export const listedTimeline: SellerTimelineData = {
  today: '2026-10-06',
  nextStepId: 'al-pricing',
  milestones: [
    pendingPreListing,
    {
      ...pendingActiveListing,
      status: 'current',
      endDate: undefined,
      summary: 'Your home is live for buyers, with marketing, showings, and feedback.',
      steps: [
        ...pendingActiveListing.steps.filter((step) => step.id !== 'al-offer'),
        { id: 'al-pricing', title: 'Pricing check-in', summary: 'Avery walks through showing feedback and nearby market activity with you.', date: '2026-10-08', dateLabel: 'Scheduled', owner: 'Avery Coleman', status: 'current', resourceId: 'pricing' },
        { id: 'al-open-house-2', title: 'Second open house', summary: '12:00 to 3:00 PM. Plan to be away from the home.', date: '2026-10-11', dateLabel: 'Scheduled', owner: 'Avery Coleman', status: 'upcoming', resourceId: 'showings' },
        { id: 'al-offers', title: 'Review offers', summary: 'Compare terms with Avery as offers come in.', estimate: 'As offers arrive', owner: 'you', status: 'upcoming', resourceId: 'reviewing-offers' },
      ],
    },
    ...beforeListingTimeline.milestones.filter((milestone) => milestone.id === 'under-contract' || milestone.id === 'closing'),
  ],
}
