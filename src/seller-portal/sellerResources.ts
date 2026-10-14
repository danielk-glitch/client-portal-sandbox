import type { TransactionResource, UpcomingDate } from '../transaction-portal/types'

export const sellerResources: TransactionResource[] = [
  {
    id: 'appraisal',
    title: 'What to expect from the appraisal',
    shortTitle: 'Appraisal guide',
    summary: 'How the lender checks your home’s value, and how you can prepare.',
    readingTime: '3 min read',
    relevance: 'Useful now',
    sections: [
      { title: 'Why it happens', body: 'When a buyer is financing a purchase, their lender usually orders an independent estimate of the home’s value. The appraiser considers the property and recent comparable sales. This helps the lender decide how much it can lend.' },
      { title: 'Before the visit', points: ['Confirm access to the home, garage, and any other areas your team requests.', 'Share a list of major improvements with your agent.', 'Let your team know about pets, gates, or other access instructions.'] },
      { title: 'After the appraisal', body: 'The report goes to the lender. If the value comes in below the agreed price, your agent will explain what that means for your contract and discuss possible next steps with you. An appraisal estimates value; an inspection looks at condition.' },
    ],
    questions: ['Do I need to be home for the appointment?', 'When should we expect the result?', 'What are our options if the value is lower than the sale price?'],
  },
  {
    id: 'disclosures',
    title: 'Making sense of seller disclosures',
    shortTitle: 'Seller disclosures',
    summary: 'What you’re sharing with the buyer and how to approach the form.',
    readingTime: '3 min read',
    relevance: 'Useful now',
    sections: [
      { title: 'What a disclosure is for', body: 'Seller disclosures share information about the property’s condition and history. The required form and what you need to disclose depend on where the home is located and the circumstances of the sale.' },
      { title: 'Before you sign', points: ['Read each question carefully and answer based on what you know.', 'Gather relevant repair records, permits, or warranty information.', 'Ask your agent about anything unclear, including whether this is the correct form for your property.'] },
      { title: 'If something changes', body: 'Tell your agent if you discover new information or notice an error after signing. They can help you understand how to update the disclosure and share it appropriately.' },
    ],
    questions: ['Which disclosure form applies to my property?', 'How should I answer a question when I don’t know?', 'Are there supporting records I should include?'],
  },
  {
    id: 'closing',
    title: 'Getting ready for closing day',
    shortTitle: 'Closing day guide',
    summary: 'Signing, sale proceeds, and handing over the home.',
    readingTime: '4 min read',
    relevance: 'Coming up',
    sections: [
      { title: 'What closing means', body: 'Closing completes the sale once the required documents, funds, and recording steps are finished. Signing and the transfer of ownership may happen at different times. Your team will confirm the sequence for your sale.' },
      { title: 'Your preparation checklist', points: ['Review the closing statement and ask about any unfamiliar charges.', 'Confirm your signing appointment and the identification you need.', 'Confirm the move-out date, possession time, and how to hand over keys.', 'Verify any payment instructions directly with your closing team using a trusted phone number.'] },
      { title: 'When you receive proceeds', body: 'The timing depends on funding, recording, and your closing provider’s process. Your team can confirm when to expect your proceeds and whether anything remains before the sale is complete.' },
    ],
    questions: ['When will the sale be officially complete?', 'When should I expect my proceeds?', 'When does the buyer get possession?'],
  },
  {
    id: 'earnest-money',
    title: 'Understanding earnest money',
    shortTitle: 'Earnest money guide',
    summary: 'What the buyer’s deposit means for your sale.',
    readingTime: '2 min read',
    relevance: 'Good to know',
    sections: [
      { title: 'A deposit toward the purchase', body: 'Earnest money is a deposit the buyer makes after an offer is accepted. It is usually held by a neutral party, such as an escrow or title company, and applied toward the buyer’s purchase at closing.' },
      { title: 'Why the deadline matters', body: 'Your contract sets the deposit amount, delivery deadline, and who holds it. Your team can confirm receipt. The deposit is not the same as sale proceeds paid directly to you.' },
      { title: 'If the sale does not close', body: 'Whether the deposit is returned or released depends on the contract, contingencies, and circumstances. Your agent can walk you through the terms that apply to your sale.' },
    ],
    questions: ['Has the deposit been received?', 'Who is holding the earnest money?', 'What does our contract say if the sale falls through?'],
  },
  {
    id: 'inspection',
    title: 'After the buyer’s home inspection',
    summary: 'Understanding findings and possible repair requests.',
    readingTime: '3 min read',
    relevance: 'Good to know',
    sections: [
      { title: 'What the inspection tells the buyer', body: 'An inspection helps the buyer understand the home’s condition. The report may identify safety concerns, repairs, or routine maintenance. A finding does not automatically mean you must fix it.' },
      { title: 'If the buyer asks for changes', body: 'Depending on the contract, the buyer may request repairs, a credit, or another adjustment. Your agent will help you understand the request, the response deadline, and your options.' },
      { title: 'How to prepare for the conversation', points: ['Review the actual request with your agent.', 'Gather records for relevant repairs or recent work.', 'Discuss cost, timing, and how each option affects your selling goals.'] },
    ],
    questions: ['Which findings need our attention?', 'What does our contract require?', 'Would a repair or credit make more sense?'],
  },
  {
    id: 'contingencies',
    title: 'What “under contract” means',
    summary: 'The steps between accepting an offer and completing your sale.',
    readingTime: '3 min read',
    relevance: 'Good to know',
    sections: [
      { title: 'You have an agreement', body: 'Under contract means you and the buyer have agreed to the sale’s terms. There are still steps to complete before ownership transfers, and some contracts include conditions called contingencies.' },
      { title: 'Common conditions', points: ['Inspection: the buyer reviews the home’s condition.', 'Financing: the buyer secures the required loan.', 'Appraisal: the lender checks the property’s value.'] },
      { title: 'What happens next', body: 'Your team coordinates the dates and keeps you informed as each step is completed. The conditions and deadlines in your signed contract determine what applies to your transaction.' },
    ],
    questions: ['Which contingencies are in our contract?', 'What still needs to happen before closing?', 'Is there anything you need from me right now?'],
  },
]

export const sellerMilestoneGuidance: Record<string, NonNullable<UpcomingDate['guidance']>> = {
  'date-1': {
    explanation: 'Earnest money is the buyer’s deposit toward the purchase. It is held by a neutral party until it is applied at closing or handled according to the contract.',
    preparation: 'Your team will confirm receipt. You do not need to send this deposit as the seller.',
    resourceId: 'earnest-money',
  },
  'date-2': {
    explanation: 'Seller disclosures help the buyer understand what you know about the property’s condition and history.',
    preparation: 'Review the form carefully. Ask your agent about unclear questions and confirm the correct form for your property before signing.',
    resourceId: 'disclosures',
  },
  'date-3': {
    explanation: 'The buyer’s lender uses an independent estimate of your home’s value to help decide how much it can lend. This is different from a home inspection.',
    preparation: 'Confirm property access with your team and share any major improvements with your agent.',
    resourceId: 'appraisal',
  },
  'date-4': {
    explanation: 'Your sale is completed after the required signing, funding, and recording steps. Signing and handing over the keys may happen at different times.',
    preparation: 'Review your closing statement and confirm your signing appointment, move-out timing, and key handoff with your team.',
    resourceId: 'closing',
  },
}
