/**
 * Documents V1 · structured documents, prototype data.
 * The team sets a few fields on every document. The client never sees them as fields.
 * They just see documents that are organized and labeled:
 * - type: the document's primary label ("Inspection report"). The uploaded file name is secondary text.
 * - stage: where it sits in the deal. Stage lists differ for sellers and buyers.
 * - visibleToClient: hidden documents never appear anywhere in the client's view.
 * - linkedStepId: optional link to one date on the transaction timeline.
 * Guides are documents too, with the type "Resource".
 */
import type { TransactionDocument, TransactionResource } from '../../transaction-portal/types'
import type { MilestoneId, SellerTimelineData, SellerTimelineStep } from '../sellerTimelineData'
import type { DocumentTag } from './taggedDocuments'

export type DocumentType =
  | 'purchase-contract'
  | 'listing-agreement'
  | 'buyer-agreement'
  | 'amendment'
  | 'offer'
  | 'buyer-financing-letter'
  | 'preapproval-letter'
  | 'seller-disclosure'
  | 'hoa-documents'
  | 'inspection-report'
  | 'appraisal'
  | 'survey'
  | 'settlement-statement'
  | 'tax-documents'
  | 'earnest-money-receipt'
  | 'loan-estimate'
  | 'title-commitment'
  | 'homeowners-insurance'
  | 'loan-commitment'
  | 'closing-disclosure'
  | 'deed'
  | 'home-warranty'
  | 'resource'

/** Display label and the order types appear in within a stage. Resources always sit last. */
export const documentTypes: Array<{ id: DocumentType; label: string }> = [
  { id: 'purchase-contract', label: 'Purchase contract' },
  { id: 'listing-agreement', label: 'Listing agreement' },
  { id: 'buyer-agreement', label: 'Buyer agreement' },
  { id: 'amendment', label: 'Amendment' },
  { id: 'offer', label: 'Offer' },
  { id: 'buyer-financing-letter', label: 'Buyer financing letter' },
  { id: 'preapproval-letter', label: 'Preapproval letter' },
  { id: 'seller-disclosure', label: 'Seller disclosure' },
  { id: 'hoa-documents', label: 'HOA documents' },
  { id: 'inspection-report', label: 'Inspection report' },
  { id: 'appraisal', label: 'Appraisal' },
  { id: 'survey', label: 'Survey' },
  { id: 'settlement-statement', label: 'Settlement statement' },
  { id: 'tax-documents', label: 'Tax documents' },
  { id: 'earnest-money-receipt', label: 'Earnest money receipt' },
  { id: 'loan-estimate', label: 'Loan estimate' },
  { id: 'title-commitment', label: 'Title commitment' },
  { id: 'homeowners-insurance', label: 'Homeowners insurance' },
  { id: 'loan-commitment', label: 'Loan commitment' },
  { id: 'closing-disclosure', label: 'Closing disclosure' },
  { id: 'deed', label: 'Deed' },
  { id: 'home-warranty', label: 'Home warranty' },
  { id: 'resource', label: 'Resource' },
]

export const documentTypeLabel = (type: DocumentType) => documentTypes.find((item) => item.id === type)?.label ?? 'Document'
const typeRank = (type: DocumentType) => documentTypes.findIndex((item) => item.id === type)

/* ---------- Stages: different lists for each side of the deal ---------- */

export type ClientSide = 'seller' | 'buyer'
export type DocumentStage = 'pre-listing' | 'active' | 'buyer-agreement' | 'pending' | 'closed' | 'inspection-period' | 'financing' | 'move-in'

export const documentStages: Record<ClientSide, Array<{ id: DocumentStage; label: string }>> = {
  seller: [
    { id: 'pre-listing', label: 'Pre-listing' },
    { id: 'active', label: 'Active' },
    { id: 'pending', label: 'Pending' },
    { id: 'closed', label: 'Closed' },
  ],
  // Buyer stages follow the buyer timeline, plus the paperwork from before the contract.
  buyer: [
    { id: 'buyer-agreement', label: 'Before contract' },
    { id: 'inspection-period', label: 'Inspection period' },
    { id: 'financing', label: 'Financing' },
    { id: 'closed', label: 'Closing' },
    { id: 'move-in', label: 'Move in' },
  ],
}

export type StageForMilestone = Partial<Record<MilestoneId, DocumentStage>>

/** The seller timeline's milestones, as document stages. */
export const sellerStageForMilestone: StageForMilestone = {
  'pre-listing': 'pre-listing',
  'active-listing': 'active',
  'under-contract': 'pending',
  closing: 'closed',
}

/** The buyer timeline's milestones, as document stages. */
export const buyerStageForMilestone: StageForMilestone = {
  'inspection-period': 'inspection-period',
  financing: 'financing',
  closing: 'closed',
  'move-in': 'move-in',
}

/* ---------- The record the team keeps ---------- */

export type DocumentRecord = {
  id: string
  type: DocumentType
  /** Named however the uploader named it. */
  fileName: string
  stage: DocumentStage
  visibleToClient: boolean
  /** One date on the transaction timeline (a timeline step). */
  linkedStepId?: string
  /** Resources only: the guide's title. Other documents are labeled by type. */
  title?: string
  uploadedAt: string
  postedBy: string
  summary: string
  tag?: DocumentTag
}

/** What the client's view renders: labeled by type, with the file name and linked date resolved. */
export type ClientDocument = TransactionDocument & {
  type: DocumentType
  fileName: string
  stage: DocumentStage
  tag?: DocumentTag
  linkedDate?: { stepId: string; title: string; date?: string }
}

/** Seller deal at 128 Meadowbrook Lane. Prototype "today" is Oct 6, in Pending. */
export const sellerDocumentRecords: DocumentRecord[] = [
  // Pre-listing
  { id: 'doc-1', type: 'listing-agreement', fileName: 'Exclusive_Listing_Agreement_signed.pdf', stage: 'pre-listing', visibleToClient: true, linkedStepId: 'al-live', uploadedAt: '08/20/2026', postedBy: 'Morgan Ellis', summary: 'The signed agreement for the property listing, including the marketing period and agreed listing terms.' },
  { id: 'sd-inspection', type: 'inspection-report', fileName: 'IMG_4471.pdf', stage: 'pre-listing', visibleToClient: true, uploadedAt: '08/23/2026', postedBy: 'Avery Coleman', summary: 'The pre-listing inspection you ordered, covering the roof, systems, and foundation.' },
  { id: 'sd-survey', type: 'survey', fileName: 'Scan_0814.pdf', stage: 'pre-listing', visibleToClient: true, uploadedAt: '08/22/2026', postedBy: 'Morgan Ellis', summary: 'The most recent boundary survey of the 1.14 acre lot.' },
  { id: 'sd-tax', type: 'tax-documents', fileName: '2025_Property_Tax_Statement.pdf', stage: 'pre-listing', visibleToClient: true, uploadedAt: '08/22/2026', postedBy: 'Morgan Ellis', summary: 'Your 2025 Flathead County property tax statement.' },
  { id: 'doc-3', type: 'resource', title: 'Listing presentation', fileName: 'Meadowbrook_Listing_Presentation.pdf', stage: 'pre-listing', visibleToClient: true, uploadedAt: '08/18/2026', postedBy: 'Kendall Ortiz', summary: 'A summary of the marketing plan and published listing destinations.' },

  // Active
  { id: 'sd-hoa', type: 'hoa-documents', fileName: 'FoysLake_HOA_CCRs_2026.pdf', stage: 'active', visibleToClient: true, uploadedAt: '09/02/2026', postedBy: 'Morgan Ellis', summary: 'Covenants, bylaws, and the current dues schedule for the Foys Lake HOA.' },
  { id: 'sd-offer-1', type: 'offer', fileName: 'Offer_Nguyen_signed.pdf', stage: 'active', visibleToClient: true, uploadedAt: '09/28/2026', postedBy: 'Avery Coleman', summary: 'The Nguyens’ first offer, with price, terms, and contingencies.' },
  { id: 'sd-offer-2', type: 'offer', fileName: 'SCAN0042.pdf', stage: 'active', visibleToClient: true, linkedStepId: 'al-offer', uploadedAt: '10/01/2026', postedBy: 'Avery Coleman', summary: 'The Nguyens’ revised offer, the one you accepted.' },
  { id: 'sd-offer-hidden', type: 'offer', fileName: 'Offer_Patel_withdrawn.pdf', stage: 'active', visibleToClient: false, uploadedAt: '09/29/2026', postedBy: 'Avery Coleman', summary: 'A withdrawn offer kept for the team’s records.' },
  { id: 'sd-financing', type: 'buyer-financing-letter', fileName: 'Preapproval_Nguyen.pdf', stage: 'active', visibleToClient: true, uploadedAt: '10/01/2026', postedBy: 'Avery Coleman', summary: 'The buyer’s lender preapproval, sent with their offer.' },
  { id: 'doc-4', type: 'resource', title: 'Showing feedback summary', fileName: 'Showing_feedback_Sept.pdf', stage: 'active', visibleToClient: true, uploadedAt: '09/10/2026', postedBy: 'Morgan Ellis', summary: 'A collected view of buyer comments received after recent showings.' },

  // Pending
  { id: 'doc-5', type: 'purchase-contract', fileName: 'PRINTOUT.pdf', stage: 'pending', visibleToClient: true, linkedStepId: 'uc-agreement', uploadedAt: '10/02/2026', postedBy: 'Morgan Ellis', summary: 'The signed contract with the buyer, including price, deadlines, and the closing date.' },
  { id: 'sd-amend-1', type: 'amendment', fileName: 'Addendum_1_inspection_period.pdf', stage: 'pending', visibleToClient: true, uploadedAt: '10/04/2026', postedBy: 'Morgan Ellis', summary: 'Extends the buyer’s inspection period by two days.' },
  { id: 'sd-amend-2', type: 'amendment', fileName: 'DOC100526.pdf', stage: 'pending', visibleToClient: true, uploadedAt: '10/05/2026', postedBy: 'Morgan Ellis', summary: 'Adds the washer and dryer to the items included in the sale.' },
  { id: 'sd-amend-draft', type: 'amendment', fileName: 'Amendment_3_DRAFT.docx', stage: 'pending', visibleToClient: false, uploadedAt: '10/06/2026', postedBy: 'Avery Coleman', summary: 'A draft the team is still working on.' },
  { id: 'doc-2', type: 'seller-disclosure', fileName: 'Form17_Seller_Disclosure.pdf', stage: 'pending', visibleToClient: true, linkedStepId: 'uc-disclosures', tag: 'review', uploadedAt: '10/05/2026', postedBy: 'Avery Coleman', summary: 'Disclosure forms for you to review and complete.' },
  { id: 'doc-6', type: 'earnest-money-receipt', fileName: 'EM_receipt_FlatheadTitle.pdf', stage: 'pending', visibleToClient: true, linkedStepId: 'uc-deposit', uploadedAt: '10/05/2026', postedBy: 'Morgan Ellis', summary: 'Confirmation that escrow received the buyer’s deposit.' },
  { id: 'sd-appraisal', type: 'appraisal', fileName: 'Appraisal_128_Meadowbrook.pdf', stage: 'pending', visibleToClient: false, linkedStepId: 'uc-appraisal', uploadedAt: '10/06/2026', postedBy: 'Morgan Ellis', summary: 'The lender’s appraisal. The team hasn’t shared it with the client.' },

  // Closed
  { id: 'sd-settlement', type: 'settlement-statement', fileName: 'Est_Settlement_Stmt_v1.pdf', stage: 'closed', visibleToClient: true, linkedStepId: 'cl-signing', uploadedAt: '10/06/2026', postedBy: 'Morgan Ellis', summary: 'An early estimate of your closing numbers from Flathead Title. The final version arrives before signing.' },
]

/* The buyer deal's records live with the buyer portal: src/buyer-portal/buyerDocuments.ts */

/* ---------- Building the client's view ---------- */

function findStep(timeline: SellerTimelineData, stepId?: string): SellerTimelineStep | undefined {
  if (!stepId) return undefined
  return timeline.milestones.flatMap((milestone) => milestone.steps).find((step) => step.id === stepId)
}

/** Guides become Resource documents in the stage that lists them. */
function resourceRecords(resources: TransactionResource[], timeline: SellerTimelineData, stageFor: StageForMilestone): DocumentRecord[] {
  return resources.map((guide) => {
    const milestone = timeline.milestones.find((item) => item.resourceIds.includes(guide.id) || item.steps.some((step) => step.resourceId === guide.id))
    return {
      id: `res-${guide.id}`,
      type: 'resource',
      title: guide.title,
      // Guides are written by the team, so there's no uploaded file name to show.
      fileName: '',
      stage: (milestone && stageFor[milestone.id]) || 'pending',
      visibleToClient: true,
      uploadedAt: '08/18/2026',
      postedBy: 'Avery Coleman',
      summary: guide.summary,
    }
  })
}

/** Only documents the client can see, labeled and linked. Hidden ones are dropped here, once, for the whole view. */
export function buildClientDocuments(records: DocumentRecord[], resources: TransactionResource[], timeline: SellerTimelineData, stageFor: StageForMilestone = sellerStageForMilestone): ClientDocument[] {
  return [...records, ...resourceRecords(resources, timeline, stageFor)]
    .filter((record) => record.visibleToClient)
    .map((record) => {
      const step = findStep(timeline, record.linkedStepId)
      return {
        id: record.id,
        name: record.type === 'resource' ? record.title ?? 'Resource' : documentTypeLabel(record.type),
        category: record.fileName,
        uploadedAt: record.uploadedAt,
        postedBy: record.postedBy,
        status: 'Ready to view',
        summary: record.summary,
        type: record.type,
        fileName: record.fileName,
        stage: record.stage,
        tag: record.tag ?? (record.type === 'resource' ? 'resource' : undefined),
        linkedDate: step ? { stepId: step.id, title: step.title, date: step.date } : undefined,
      }
    })
}

/** Stage first, in the side's order; then type. Empty stages and types are left out. */
export function groupByStage(documents: ClientDocument[], side: ClientSide) {
  return documentStages[side]
    .map((stage) => ({
      ...stage,
      documents: documents
        .filter((doc) => doc.stage === stage.id)
        .sort((a, b) => typeRank(a.type) - typeRank(b.type) || a.uploadedAt.localeCompare(b.uploadedAt)),
    }))
    .filter((stage) => stage.documents.length > 0)
}

export function documentsLinkedTo(documents: ClientDocument[], stepId: string) {
  return documents.filter((doc) => doc.linkedDate?.stepId === stepId)
}
