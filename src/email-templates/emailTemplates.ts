export type Audience = 'seller' | 'buyer'
export type EmailKind = 'activate' | 'view' | 'activity'

export type EmailTemplate = {
  id: string
  audience: Audience
  kind: EmailKind
  stage: string
  title: string
  summary: string
  trigger: string
  subject: string
  preheader: string
  headline: string
  intro: string
  actionLabel: string
  actionHref: string
  notes: string[]
}

const portalHref = 'https://example.com/portal'

export const emailTemplates: EmailTemplate[] = [
  {
    id: 'seller-activate',
    audience: 'seller',
    kind: 'activate',
    stage: 'Getting started',
    title: 'Activate your portal',
    summary: 'A personal welcome and a clear first step into the transaction portal.',
    trigger: 'When Avery invites a seller to the portal',
    subject: 'John, your home sale has a place to follow along',
    preheader: 'Avery invited you to see updates for 128 Meadowbrook Lane.',
    headline: 'Avery is inviting you to your transaction portal',
    intro: 'Hi John, Avery Coleman has invited you to follow the sale of 128 Meadowbrook Lane. Your portal brings the important dates, updates, and people together in one place.',
    actionLabel: 'Activate your portal',
    actionHref: portalHref,
    notes: [
      'Replaces the current Brivity account invitation and its duplicate login instructions.',
      'The activation link and first-time password behavior need confirmation before sending.',
      'Avery and the Ben Kinney Team lead the relationship; Keller Williams Western Realty appears as the brokerage.',
    ],
  },
  {
    id: 'seller-view',
    audience: 'seller',
    kind: 'view',
    stage: 'Getting started',
    title: 'View your transaction',
    summary: 'An invitation to return to a portal account that is already available.',
    trigger: 'When a seller with an existing account is added to a transaction',
    subject: 'John, your transaction is ready to view',
    preheader: 'See the latest on 128 Meadowbrook Lane in your portal.',
    headline: 'Your transaction is ready to view.',
    intro: 'Hi John, you can now follow the sale of 128 Meadowbrook Lane in your portal. See the latest updates, upcoming dates, and the team helping you move forward.',
    actionLabel: 'View your transaction',
    actionHref: portalHref,
    notes: [
      'Keeps this distinct from activation so returning clients receive the right action.',
      'The current email exposes a username and reset instructions; confirm whether those are still needed.',
      'The destination URL is a review placeholder until the portal route is finalized.',
    ],
  },
  {
    id: 'seller-activity',
    audience: 'seller',
    kind: 'activity',
    stage: 'In progress',
    title: 'Weekly progress update',
    summary: 'A concise account of meaningful progress and the next relevant date.',
    trigger: 'Weekly summary when client-visible progress exists',
    subject: 'Your weekly update for 128 Meadowbrook Lane',
    preheader: 'What moved forward this week and what is coming next.',
    headline: 'This week at Meadowbrook Lane.',
    intro: 'Hi John, here is a quick look at what moved forward on your home sale this week.',
    actionLabel: 'Open your portal',
    actionHref: portalHref,
    notes: [
      'Reframes the existing activity dump around client-relevant progress and one next step.',
      'Internal tasks, private notes, and documents must be filtered by client visibility.',
      'Confirm whether a weekly email should send when there are no meaningful updates.',
      'Email preference destination and legal footer language need approval.',
    ],
  },
  {
    id: 'buyer-activate',
    audience: 'buyer',
    kind: 'activate',
    stage: 'Getting started',
    title: 'Activate your portal',
    summary: 'A buyer version of the first portal invitation.',
    trigger: 'When Avery invites a buyer to the portal',
    subject: 'John, your home purchase has a place to follow along',
    preheader: 'Avery invited you to see updates for 128 Meadowbrook Lane.',
    headline: 'A clearer view of your home purchase.',
    intro: 'Hi John, Avery Coleman has invited you to follow your purchase of 128 Meadowbrook Lane. Your portal brings the important dates, updates, and people together in one place.',
    actionLabel: 'Activate your portal',
    actionHref: portalHref,
    notes: [
      'Proposed buyer adaptation of the supplied invitation, using the same email blocks.',
      'Confirm buyer-facing agent role and sender details before this version is approved.',
      'The activation link and first-time password behavior need confirmation before sending.',
    ],
  },
  {
    id: 'buyer-view',
    audience: 'buyer',
    kind: 'view',
    stage: 'Getting started',
    title: 'View your transaction',
    summary: 'A return invitation for a buyer with portal access.',
    trigger: 'When a buyer with an existing account is added to a transaction',
    subject: 'John, your transaction is ready to view',
    preheader: 'See the latest on 128 Meadowbrook Lane in your portal.',
    headline: 'Your transaction is ready to view.',
    intro: 'Hi John, you can now follow your purchase of 128 Meadowbrook Lane in your portal. See the latest updates, upcoming dates, and the team helping you move forward.',
    actionLabel: 'View your transaction',
    actionHref: portalHref,
    notes: [
      'Proposed buyer adaptation of the supplied returning-client email.',
      'Confirm whether returning clients need login or reset instructions in the message.',
      'The destination URL is a review placeholder until the portal route is finalized.',
    ],
  },
  {
    id: 'buyer-activity',
    audience: 'buyer',
    kind: 'activity',
    stage: 'In progress',
    title: 'Weekly progress update',
    summary: 'Progress and the next date in the buyer journey.',
    trigger: 'Weekly summary when client-visible progress exists',
    subject: 'Your weekly update for 128 Meadowbrook Lane',
    preheader: 'What moved forward this week and what is coming next.',
    headline: 'A look at this week’s progress.',
    intro: 'Hi John, here is a quick look at what moved forward on your home purchase this week.',
    actionLabel: 'Open your portal',
    actionHref: portalHref,
    notes: [
      'Proposed buyer adaptation of the supplied weekly activity report.',
      'Only client-visible updates should appear; transaction data and document access need validation.',
      'Confirm whether the next date is reliably available for every transaction.',
      'Email preference destination and legal footer language need approval.',
    ],
  },
]
