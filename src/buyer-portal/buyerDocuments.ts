/**
 * Buyer deal documents at 128 Meadowbrook Lane · prototype data.
 * Same record shape as the seller library (documentLibrary.ts). Stages follow the buyer timeline.
 * The page only shows records uploaded by "today", so the list grows as the deal moves along.
 * Includes a hidden draft, so the data shows hidden documents exist.
 */
import type { DocumentRecord } from '../seller-portal/timeline-first/documentLibrary'

export const buyerDocumentRecords: DocumentRecord[] = [
  // Before contract
  { id: 'bd-rep', type: 'buyer-agreement', fileName: 'Buyer_Broker_Agreement_signed.pdf', stage: 'buyer-agreement', visibleToClient: true, uploadedAt: '07/20/2026', postedBy: 'Avery Coleman', summary: 'Your agreement with Avery’s team to represent you as a buyer.' },
  { id: 'bd-preapproval', type: 'preapproval-letter', fileName: 'Preapproval_Glacier_Home_Loans.pdf', stage: 'buyer-agreement', visibleToClient: true, uploadedAt: '07/22/2026', postedBy: 'Cameron Tate', summary: 'Your lender preapproval from Glacier Home Loans.' },

  // Inspection period
  { id: 'bd-contract', type: 'purchase-contract', fileName: 'PSA_128_Meadowbrook_executed.pdf', stage: 'inspection-period', visibleToClient: true, linkedStepId: 'b-contract', uploadedAt: '10/02/2026', postedBy: 'Morgan Ellis', summary: 'Your signed purchase contract: price, deadlines, and the closing date.' },
  { id: 'bd-disclosure', type: 'seller-disclosure', fileName: 'Form17_Seller_Disclosure.pdf', stage: 'inspection-period', visibleToClient: true, linkedStepId: 'b-disclosures', uploadedAt: '10/03/2026', postedBy: 'Morgan Ellis', summary: 'What the seller knows about the home’s condition and history.' },
  { id: 'bd-hoa', type: 'hoa-documents', fileName: 'FoysLake_HOA_CCRs_2026.pdf', stage: 'inspection-period', visibleToClient: true, uploadedAt: '10/03/2026', postedBy: 'Morgan Ellis', summary: 'Covenants, bylaws, and the dues schedule for the Foys Lake HOA.' },
  { id: 'bd-earnest', type: 'earnest-money-receipt', fileName: 'EM_receipt_FlatheadTitle.pdf', stage: 'inspection-period', visibleToClient: true, linkedStepId: 'b-earnest', uploadedAt: '10/05/2026', postedBy: 'Morgan Ellis', summary: 'Confirmation that Flathead Title received your earnest money.' },
  { id: 'bd-inspection', type: 'inspection-report', fileName: 'BigSky_Inspection_Report_1007.pdf', stage: 'inspection-period', visibleToClient: true, linkedStepId: 'b-inspection', uploadedAt: '10/07/2026', postedBy: 'Avery Coleman', summary: 'Your inspector’s full report, with photos and recommendations.' },
  { id: 'bd-repairs', type: 'amendment', fileName: 'Amendment_1_Inspection_Repairs.pdf', stage: 'inspection-period', visibleToClient: true, linkedStepId: 'b-repair-request', uploadedAt: '10/09/2026', postedBy: 'Avery Coleman', summary: 'The seller agrees to service the furnace and replace the deck railing, plus a $2,500 credit.' },
  { id: 'bd-repairs-draft', type: 'amendment', fileName: 'Amendment_1_DRAFT_v2.docx', stage: 'inspection-period', visibleToClient: false, uploadedAt: '10/08/2026', postedBy: 'Avery Coleman', summary: 'A draft the team is still working on.' },

  // Financing
  { id: 'bd-loan-estimate', type: 'loan-estimate', fileName: 'Loan_Estimate_GHL.pdf', stage: 'financing', visibleToClient: true, uploadedAt: '10/05/2026', postedBy: 'Cameron Tate', summary: 'Your lender’s estimate of your rate, payment, and closing costs.' },
  { id: 'bd-appraisal', type: 'appraisal', fileName: 'Appraisal_128_Meadowbrook.pdf', stage: 'financing', visibleToClient: true, linkedStepId: 'b-appraisal', uploadedAt: '10/19/2026', postedBy: 'Cameron Tate', summary: 'The appraiser valued the home at the purchase price.' },
  { id: 'bd-insurance', type: 'homeowners-insurance', fileName: 'Declarations_Page.pdf', stage: 'financing', visibleToClient: true, linkedStepId: 'b-insurance', uploadedAt: '10/16/2026', postedBy: 'Morgan Ellis', summary: 'Proof of your homeowners coverage, starting Nov 6.' },
  { id: 'bd-title', type: 'title-commitment', fileName: 'Title_Commitment_FT26-4471.pdf', stage: 'financing', visibleToClient: true, linkedStepId: 'b-title', uploadedAt: '10/14/2026', postedBy: 'Morgan Ellis', summary: 'Who owns the home today, and what Flathead Title clears before closing.' },
  { id: 'bd-commitment', type: 'loan-commitment', fileName: 'Commitment_Letter.pdf', stage: 'financing', visibleToClient: true, linkedStepId: 'b-loan-commitment', uploadedAt: '10/28/2026', postedBy: 'Cameron Tate', summary: 'Your lender’s final approval.' },

  // Closing
  { id: 'bd-cd', type: 'closing-disclosure', fileName: 'Closing_Disclosure_final.pdf', stage: 'closed', visibleToClient: true, linkedStepId: 'b-closing-disclosure', uploadedAt: '11/02/2026', postedBy: 'Cameron Tate', summary: 'Your final loan terms and cash to close.' },
  { id: 'bd-settlement', type: 'settlement-statement', fileName: 'Buyer_Settlement_Statement.pdf', stage: 'closed', visibleToClient: true, linkedStepId: 'b-signing', uploadedAt: '11/06/2026', postedBy: 'Morgan Ellis', summary: 'The signed settlement statement from closing.' },

  // Move in
  { id: 'bd-deed', type: 'deed', fileName: 'Warranty_Deed_unrecorded_copy.pdf', stage: 'move-in', visibleToClient: true, linkedStepId: 'b-deed', uploadedAt: '11/06/2026', postedBy: 'Morgan Ellis', summary: 'A copy of your signed deed. The recorded original arrives by mail.' },
  { id: 'bd-warranty', type: 'home-warranty', fileName: 'Home_Warranty_Plan.pdf', stage: 'move-in', visibleToClient: true, uploadedAt: '11/06/2026', postedBy: 'Avery Coleman', summary: 'Your one-year home warranty, paid by the seller at closing.' },
]
