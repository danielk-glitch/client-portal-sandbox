/**
 * Buyer step instructions: what a date's detail view shows.
 * Merged into the shared `stepDetails` map (timelineFirstData.ts), keyed by the buyer step ids ("b-…").
 */
import type { StepDetail } from '../seller-portal/timeline-first/timelineFirstData'

export const buyerStepDetails: Record<string, StepDetail> = {
  'b-contract': {
    intro: 'The seller accepted your offer and everyone has signed. The contract sets your price, your deadlines, and your closing date. Every deadline in your first 10 days counts from today.',
    documentIds: ['bd-contract'],
    resourceIds: ['first-10-days'],
    after: 'Earnest money is next. It’s due in three days.',
  },
  'b-earnest': {
    intro: 'Earnest money is your good-faith deposit. It’s held by Flathead Title and counts toward your down payment at closing. Missing this deadline can put you in breach of contract.',
    checklist: ['Call Flathead Title at a number you look up yourself to confirm wiring instructions.', 'Never use wiring instructions from an email alone.', 'Send the deposit by the end of the day.', 'Forward your bank’s confirmation to Morgan.'],
    documentIds: ['bd-earnest'],
    resourceIds: ['buyer-earnest-money', 'wire-safety'],
    after: 'Morgan confirms when the title company receives it, and the receipt lands in Documents.',
  },
  'b-disclosures': {
    intro: 'The seller’s disclosure covers what they know about the home’s condition and history. Read it before your inspection so you know what to ask about.',
    checklist: ['Note anything about water, the roof, or major systems.', 'Share your notes with Avery and your inspector.'],
    documentIds: ['bd-disclosure', 'bd-hoa'],
  },
  'b-inspection': {
    intro: 'Your inspector checks the home’s structure and major systems. Come for the walkthrough at the end. It’s the best time to ask questions.',
    checklist: ['Arrive at 9:00 AM. Plan for about three hours.', 'Bring the seller’s disclosure and your notes.', 'Ask the inspector which findings are urgent and which are normal wear.', 'Take photos of anything you want to remember.'],
    documentIds: ['bd-inspection'],
    resourceIds: ['buyer-inspection'],
    links: [{ label: 'Directions to the home', href: 'https://maps.google.com/?q=128+Meadowbrook+Lane+Kalispell+MT', note: 'Google Maps' }],
    after: 'The full report usually arrives within 24 hours. You’ll find it in Documents.',
  },
  'b-repair-request': {
    intro: 'After the inspection, you can ask the seller to make repairs, give you a credit, or lower the price. Avery will help you decide what’s worth asking for.',
    checklist: ['Read the full inspection report.', 'Focus on safety issues and big-ticket items, not cosmetic ones.', 'Get a quote for anything you’re unsure about.', 'Sign the repair request Avery prepares.'],
    documentIds: ['bd-repairs'],
    resourceIds: ['repair-requests'],
    after: 'The seller can agree, counter, or decline. Avery negotiates for you.',
  },
  'b-inspection-end': {
    intro: 'This is the most important deadline in your first 10 days. Until 5:00 PM today, you can cancel and get your earnest money back. After that, backing out for inspection reasons can cost you your deposit.',
    checklist: ['Make sure any repair agreement is signed by both sides.', 'Tell Avery right away if you have second thoughts.'],
    resourceIds: ['first-10-days'],
    after: 'Next up is financing: the appraisal and your lender’s final approval.',
  },
  'b-appraisal': {
    intro: 'Your lender orders an appraisal to confirm the home is worth what you’re paying. You don’t need to be there.',
    resourceIds: ['buyer-appraisal'],
    documentIds: ['bd-appraisal'],
    after: 'Results usually arrive within a week. If the value comes in low, Avery will walk you through your options.',
  },
  'b-insurance': {
    intro: 'Your lender needs proof of homeowners insurance that starts on closing day. Compare two or three quotes. Your premium is usually paid through escrow.',
    checklist: ['Get quotes from two or three insurers.', 'Set the start date to Nov 6.', 'Send the declarations page to Cameron.'],
    documentIds: ['bd-insurance'],
  },
  'b-title': {
    intro: 'The title report shows who owns the home and any liens or easements on it. Flathead Title clears anything that needs fixing before closing.',
    checklist: ['Skim the list of exceptions.', 'Ask Avery about anything that looks unusual, like an easement through the yard.'],
    documentIds: ['bd-title'],
  },
  'b-loan-docs': {
    intro: 'Lenders often ask for an updated pay stub or bank statement close to closing. Reply quickly so nothing holds up your approval.',
    checklist: ['Send documents through your lender’s secure portal, not email.', 'Don’t open new credit or make big purchases.'],
  },
  'b-loan-commitment': {
    intro: 'Loan commitment is your lender’s final approval. After today, your financing contingency ends, so your earnest money is at risk if you can’t close for financing reasons.',
    documentIds: ['bd-commitment'],
    resourceIds: ['loan-commitment'],
    after: 'Next stop is closing. Your Closing Disclosure arrives at least three business days before signing.',
  },
  'b-closing-disclosure': {
    intro: 'Your Closing Disclosure shows your final loan terms and exactly how much to bring to closing. By law you get it at least three business days before signing.',
    checklist: ['Compare it with your Loan Estimate. Look at the rate, monthly payment, and cash to close.', 'Ask Cameron about any fee that changed.', 'Note your cash to close for your wire.'],
    documentIds: ['bd-cd'],
    resourceIds: ['buyer-closing'],
  },
  'b-closing-funds': {
    intro: 'Your cash to close goes to Flathead Title by wire or cashier’s check. Wire fraud targets home buyers at exactly this step.',
    checklist: ['Call Flathead Title at a number you look up yourself before you wire.', 'Never trust new or changed wiring instructions sent by email.', 'Send funds a day early so they arrive in time.', 'Forward your bank’s confirmation to Morgan.'],
    resourceIds: ['wire-safety'],
    after: 'Morgan confirms when your funds arrive.',
  },
  'b-walkthrough': {
    intro: 'Your last look before you sign. Check that the home is in the condition you agreed to and that any repairs are done.',
    checklist: ['Run faucets, flush toilets, and test the appliances.', 'Check that agreed repairs are done and receipts are left.', 'Make sure nothing that stays with the home was removed.'],
  },
  'b-signing': {
    intro: 'You’ll sign your loan and purchase papers at Flathead Title. It usually takes about an hour.',
    checklist: ['Bring a government photo ID for each buyer.', 'Bring your checkbook in case of small last-minute changes.', 'Plan for about an hour.'],
    links: [{ label: 'Directions to Flathead Title', href: 'https://maps.google.com/?q=35+1st+Ave+E+Kalispell+MT', note: 'Google Maps' }],
    resourceIds: ['buyer-closing'],
    after: 'Once the sale records with the county, the home is yours and Avery hands over the keys.',
  },
  'b-keys': {
    intro: 'Avery meets you at the home with every key, garage opener, and code once the sale records. That’s usually the afternoon of closing day.',
    resourceIds: ['moving-in'],
  },
  'b-utilities': {
    intro: 'Have every utility switched into your name for Nov 6, so nothing shuts off between owners.',
    checklist: ['Electric: Flathead Electric Cooperative.', 'Natural gas: NorthWestern Energy.', 'Water, sewer, and trash: City of Kalispell.', 'Internet and TV: your choice of provider.'],
    resourceIds: ['moving-in'],
  },
  'b-locks': {
    intro: 'You don’t know how many keys are out there. Rekeying is quick and inexpensive.',
    checklist: ['Rekey or replace exterior locks.', 'Reset the garage door and gate codes.', 'Change the alarm code if the home has one.'],
  },
  'b-deed': {
    intro: 'Once the county records your deed, it’s mailed to you. It’s your proof of ownership. Store it with your Closing Disclosure.',
    resourceIds: ['after-closing'],
  },
  'b-first-payment': {
    intro: 'Mortgage interest is paid in arrears, so there’s no payment in December. Your first payment is due January 1. Your lender will send your payment details.',
    resourceIds: ['after-closing'],
  },
}
