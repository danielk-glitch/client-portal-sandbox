import type { TransactionEmail } from './types'

/** Sample emails for the 128 Meadowbrook Lane sale. In production these arrive via the transaction's cc/bcc address. */
const avery = { name: 'Avery Coleman', email: 'avery.coleman@example.com' }
const morgan = { name: 'Morgan Ellis', email: 'morgan.ellis@example.com' }
const jordan = { name: 'Jordan Lee', email: 'jordan.lee@example.com' }
const tim = { name: 'Tim Bennett', email: 'tim.bennett@example.com' }
const alex = { name: 'Alex Bennett', email: 'alex.bennett@example.com' }
const buyerAgent = { name: 'Sam Rivera', email: 'sam.rivera@northforkrealty.example.com' }
const title = { name: 'Priya Nair', email: 'priya.nair@example.com' }
const inspector = { name: 'Chris Dahl', email: 'chris.dahl@example.com' }

export const sampleTransactionEmails: TransactionEmail[] = [
  {
    id: 'email-1',
    threadId: 'thread-offer',
    subject: 'Offer on 128 Meadowbrook Lane',
    from: buyerAgent,
    to: [avery],
    cc: [morgan],
    sentAt: '2026-10-02T09:14:00-06:00',
    body: 'Hi Avery,\n\nMy clients would like to submit an offer on 128 Meadowbrook Lane. The signed offer and pre-approval letter are attached.\n\nThey are flexible on closing date and happy to talk through anything before you present it.\n\nThanks,\nSam',
    attachments: [
      { id: 'att-1', fileName: 'Purchase-offer-signed.pdf', size: '418 KB' },
      { id: 'att-2', fileName: 'Pre-approval-letter.pdf', size: '96 KB' },
    ],
  },
  {
    id: 'email-2',
    threadId: 'thread-offer',
    subject: 'Re: Offer on 128 Meadowbrook Lane',
    from: avery,
    to: [tim, alex],
    cc: [morgan],
    sentAt: '2026-10-02T11:40:00-06:00',
    body: 'Tim and Alex,\n\nForwarding the offer from Sam. It is a strong one: full asking price, 30 day close, and a pre-approval that checks out.\n\nI will call you at 1:00 to walk through the terms. Nothing to sign yet.\n\nAvery',
  },
  {
    id: 'email-3',
    threadId: 'thread-offer',
    subject: 'Re: Offer on 128 Meadowbrook Lane',
    from: tim,
    to: [avery],
    cc: [alex, morgan],
    sentAt: '2026-10-02T15:22:00-06:00',
    body: 'Avery,\n\nThanks for the call. We are good to accept. Please let Sam know.\n\nTim',
  },
  {
    id: 'email-4',
    threadId: 'thread-inspection',
    subject: 'Inspection scheduled for Oct 12',
    from: morgan,
    to: [tim, alex],
    cc: [avery, inspector],
    sentAt: '2026-10-06T10:05:00-06:00',
    body: 'Hi Tim and Alex,\n\nThe buyer’s inspection is set for Monday, Oct 12 at 9:00 AM. Chris Dahl from Big Sky Inspect will be there for about three hours.\n\nYou do not need to be home. If you would like to be, please plan to step out during the inspection so the inspector can work.\n\nMorgan',
  },
  {
    id: 'email-5',
    threadId: 'thread-inspection',
    subject: 'Re: Inspection scheduled for Oct 12',
    from: alex,
    to: [morgan],
    cc: [tim, avery],
    sentAt: '2026-10-06T12:48:00-06:00',
    body: 'Thanks Morgan. We will be out of the house that morning. Should we leave the garage code with you?\n\nAlex',
  },
  {
    id: 'email-6',
    threadId: 'thread-inspection',
    subject: 'Re: Inspection scheduled for Oct 12',
    from: morgan,
    to: [alex],
    cc: [tim, avery],
    sentAt: '2026-10-06T13:10:00-06:00',
    body: 'Yes please. Text it to me and I will pass it to Chris directly.\n\nMorgan',
  },
  {
    id: 'email-7',
    threadId: 'thread-repairs',
    subject: 'Inspection report and repair request',
    from: buyerAgent,
    to: [avery],
    cc: [morgan, jordan],
    sentAt: '2026-10-15T16:30:00-06:00',
    body: 'Avery,\n\nThe inspection report is attached. My clients are asking for two repairs: the water heater relief valve and the loose railing on the back deck. Everything else is fine with them.\n\nCan you let me know by Friday?\n\nSam',
    attachments: [
      { id: 'att-3', fileName: 'Inspection-report.pdf', size: '3.2 MB' },
      { id: 'att-4', fileName: 'Repair-request.pdf', size: '121 KB' },
    ],
  },
  {
    id: 'email-8',
    threadId: 'thread-title',
    subject: 'Title commitment and closing details',
    from: title,
    to: [avery, morgan],
    cc: [jordan],
    sentAt: '2026-10-19T08:52:00-06:00',
    body: 'Good morning,\n\nThe title commitment is attached. Everything is clear for closing on Nov 6. The sellers will sign at our Kalispell office at 10:00 AM. Please have them bring a government-issued photo ID.\n\nPriya',
    attachments: [{ id: 'att-5', fileName: 'Title-commitment.pdf', size: '640 KB' }],
  },
  {
    id: 'email-9',
    threadId: 'thread-title',
    subject: 'Re: Title commitment and closing details',
    from: morgan,
    to: [tim, alex],
    cc: [avery],
    sentAt: '2026-10-19T09:30:00-06:00',
    body: 'Tim and Alex,\n\nPassing along the closing details from Priya at Flathead Title. Closing is Nov 6 at 10:00 AM. Please bring photo ID.\n\nLet me know if the time does not work.\n\nMorgan',
  },
]
