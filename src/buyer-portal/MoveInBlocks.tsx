/**
 * Moving in and After closing · buyer-only blocks in the "this stage" zone.
 * - MovingIn shows in the Closing and Move in stages: when the keys come, which utilities to switch on, and a first-week list.
 * - AfterClosing shows in the Move in stage: what arrives or comes due in the first months, and what to keep.
 * Rows follow the shared row anatomy: a date stamp for anything dated, a round icon badge otherwise, hairlines between.
 * Rows tied to a timeline date open that date; the rest are information only, so they carry no chevron.
 */
import type { ReactNode } from 'react'
import { Box, ButtonBase, Typography } from '@mui/material'
import BoltRounded from '@mui/icons-material/BoltRounded'
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded'
import LocalFireDepartmentRounded from '@mui/icons-material/LocalFireDepartmentRounded'
import WaterDropRounded from '@mui/icons-material/WaterDropRounded'
import WifiRounded from '@mui/icons-material/WifiRounded'
import AccountBalanceRounded from '@mui/icons-material/AccountBalanceRounded'
import UmbrellaRounded from '@mui/icons-material/UmbrellaRounded'
import HandymanRounded from '@mui/icons-material/HandymanRounded'
import FolderRounded from '@mui/icons-material/FolderRounded'
import { PlaceCard } from '../components/PlaceCard'
import { SectionLabel } from '../components/SectionLabel'
import { TextLink } from '../components/TextLink'
import { DateStamp } from '../transaction-portal/components'
import { PortalIconBadge } from '../components/PortalIconBadge'
import { PortalSectionHeader } from '../components/PortalSection'
import type { SellerTimelineData } from '../seller-portal/sellerTimelineData'
import { formatDay } from '../seller-portal/timeline-first/timelineFirstData'
import type { OpenItem } from '../seller-portal/timeline-first/TimelineFirstParts'
import { buyerDeal, findBuyerStep } from './buyerTimelineData'

/* ---------- One row: lead, copy, optional chevron when it opens ---------- */

function InfoRow({ lead, title, description, meta, onOpen }: { lead: ReactNode; title: string; description: string; meta?: string; onOpen?: () => void }) {
  const content = (
    <>
      <Box component="span" className="bp-row-lead">{lead}</Box>
      <Box component="span" className="bp-row-copy">
        <Typography component="span" variant="titleXS">{title}</Typography>
        <Typography component="span" variant="bodySStandard" color="text.secondary">{description}</Typography>
        {meta && <Typography component="span" variant="labelS" className="bp-row-meta">{meta}</Typography>}
      </Box>
      {onOpen && <ChevronRightRounded className="bp-row-chevron" aria-hidden="true" />}
    </>
  )
  return (
    <Box component="li" className="bp-row">
      {onOpen ? <ButtonBase className="bp-row-main" onClick={onOpen} aria-haspopup="dialog" disableRipple>{content}</ButtonBase> : <Box className="bp-row-main">{content}</Box>}
    </Box>
  )
}

/* ---------- Moving in ---------- */

const utilities = [
  { icon: <BoltRounded />, title: 'Electric', provider: 'Flathead Electric Cooperative' },
  { icon: <LocalFireDepartmentRounded />, title: 'Natural gas', provider: 'NorthWestern Energy' },
  { icon: <WaterDropRounded />, title: 'Water, sewer, and trash', provider: 'City of Kalispell' },
  { icon: <WifiRounded />, title: 'Internet and TV', provider: 'Your choice of provider' },
]

const firstWeek = [
  'Change the locks and reset garage and gate codes.',
  'Forward your mail and update your address with your bank, employer, and DMV.',
  'Find the water shutoff and the breaker panel.',
  'Test the smoke and carbon monoxide detectors.',
]

export function MovingIn({ timeline }: { timeline: SellerTimelineData }) {
  const closingDay = formatDay(buyerDeal.closingDate, { weekday: 'long', month: 'short', day: 'numeric' })
  const startDay = formatDay(buyerDeal.closingDate)
  const closed = timeline.today > buyerDeal.closingDate
  return (
    <PlaceCard component="section" className="portal-section bp-block" aria-labelledby="bp-moving-title">
      <PortalSectionHeader title="Moving in" titleId="bp-moving-title" prominent subtitle={closed ? `You got the keys ${closingDay}` : `You get the keys once the sale records on ${closingDay}`} />
      <Box className="portal-section-content bp-block-columns">
        <Box component="section" aria-labelledby="bp-utilities-label" className="bp-block-group">
          <SectionLabel id="bp-utilities-label">Utilities to switch on</SectionLabel>
          <Box component="ul" className="bp-rows">
            {utilities.map((utility) => (
              <InfoRow key={utility.title} lead={<PortalIconBadge>{utility.icon}</PortalIconBadge>} title={utility.title} description={utility.provider} meta={`Start ${startDay}`} />
            ))}
          </Box>
        </Box>
        <Box component="section" aria-labelledby="bp-first-week-label" className="bp-block-group">
          <SectionLabel id="bp-first-week-label">Your first week</SectionLabel>
          <Box component="ul" className="bp-checklist">
            {firstWeek.map((item) => <Typography component="li" variant="bodySStandard" key={item}>{item}</Typography>)}
          </Box>
        </Box>
      </Box>
    </PlaceCard>
  )
}

/* ---------- After closing ---------- */

export function AfterClosing({ timeline, onOpenStep, onOpenDocuments }: { timeline: SellerTimelineData; onOpenStep: (item: OpenItem) => void; onOpenDocuments: () => void }) {
  const deed = findBuyerStep(timeline, 'b-deed')
  const payment = findBuyerStep(timeline, 'b-first-payment')
  return (
    <PlaceCard component="section" className="portal-section bp-block" aria-labelledby="bp-after-title">
      <PortalSectionHeader title="After closing" titleId="bp-after-title" prominent subtitle="What arrives and comes due in your first months" />
      <Box className="portal-section-content">
        <Box component="ul" className="bp-rows">
          {payment && <InfoRow lead={<DateStamp date={payment.step.date} />} title="First mortgage payment" description="There’s no December payment. November’s interest was paid at closing." meta="Glacier Home Loans sends payment details" onOpen={() => onOpenStep(payment)} />}
          {deed && <InfoRow lead={<DateStamp tbd />} title="Recorded deed arrives" description="Flathead County mails it once it’s recorded. It’s your proof of ownership." meta={deed.step.estimate} onOpen={() => onOpenStep(deed)} />}
          <InfoRow lead={<PortalIconBadge><AccountBalanceRounded /></PortalIconBadge>} title="Property taxes" description="Paid from your escrow account by your lender. Watch for your first escrow statement." />
          <InfoRow lead={<PortalIconBadge><UmbrellaRounded /></PortalIconBadge>} title="Homeowners insurance" description="Paid from escrow. Your policy renews each November." />
          <InfoRow lead={<PortalIconBadge><HandymanRounded /></PortalIconBadge>} title="Home warranty" description="Covers major systems and appliances for one year, through Nov 2027." />
          <InfoRow lead={<PortalIconBadge><FolderRounded /></PortalIconBadge>} title="Keep your closing papers" description="Your Closing Disclosure, deed, and warranty. You’ll want the Closing Disclosure at tax time." />
        </Box>
        <Box className="bp-block-foot"><TextLink onClick={onOpenDocuments}>See your documents</TextLink></Box>
      </Box>
    </PlaceCard>
  )
}
