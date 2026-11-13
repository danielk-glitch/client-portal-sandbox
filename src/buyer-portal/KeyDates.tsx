/**
 * Hero key dates · a quiet facts row under the buyer hero's headline.
 * Answers the date questions buyers ask over and over: when's loan commitment, when and where is closing.
 * - Before closing: the next two contract deadlines, then closing (with its time and place). Done deadlines drop off.
 * - After closing: the first mortgage payment and the recorded deed.
 * - It covers dates beyond the stage you're looking at, so it never repeats the stage's dates list as a block.
 * - Each fact opens its date. On phones the facts stack as rows.
 */
import { Box, ButtonBase, Typography } from '@mui/material'
import type { SellerTimelineData } from '../seller-portal/sellerTimelineData'
import { formatDay } from '../seller-portal/timeline-first/timelineFirstData'
import type { OpenItem } from '../seller-portal/timeline-first/TimelineFirstParts'
import { buyerDeal, findBuyerStep } from './buyerTimelineData'

const deadlines = ['b-earnest', 'b-inspection-end', 'b-loan-commitment', 'b-closing-funds', 'b-walkthrough']
const afterClosing = ['b-first-payment', 'b-deed']

/** Short labels for the row. */
const labels: Record<string, string> = {
  'b-earnest': 'Earnest money due',
  'b-inspection-end': 'Inspection period ends',
  'b-loan-commitment': 'Loan commitment',
  'b-closing-funds': 'Closing funds due',
  'b-walkthrough': 'Final walkthrough',
  'b-signing': 'Closing',
  'b-first-payment': 'First mortgage payment',
  'b-deed': 'Recorded deed',
}

/** Detail after the date. Closing carries its place, since "where am I closing" comes up as often as "when". */
const details: Record<string, string> = {
  'b-inspection-end': '5:00 PM',
  'b-walkthrough': '4:00 PM',
  'b-signing': `${buyerDeal.closingTime} · ${buyerDeal.closingPlace}`,
  'b-deed': 'Mailed by Flathead County',
}

/** Undated items get a short estimate here; the full one lives in the date's details. */
const shortEstimates: Record<string, string> = {
  'b-deed': 'In 4 to 8 weeks',
}

export function HeroKeyDates({ timeline, onOpenStep }: { timeline: SellerTimelineData; onOpenStep: (item: OpenItem) => void }) {
  const closed = timeline.today > buyerDeal.closingDate
  const open = (ids: string[]) => ids.map((id) => findBuyerStep(timeline, id)).filter((item): item is OpenItem => Boolean(item) && item!.step.status !== 'complete')
  const closing = findBuyerStep(timeline, 'b-signing')
  const items = closed ? open(afterClosing) : [...open(deadlines).slice(0, 2), ...(closing ? [closing] : [])]
  if (!items.length) return null

  return (
    <Box component="ul" className="bp-hero-keys" aria-label="Key dates">
      {items.map((item) => {
        const { step } = item
        const when = step.date ? formatDay(step.date, { weekday: 'short', month: 'short', day: 'numeric' }) : shortEstimates[step.id] ?? step.estimate
        return (
          <Box component="li" key={step.id} className="bp-hero-key">
            <ButtonBase className="bp-hero-key-button" onClick={() => onOpenStep(item)} aria-haspopup="dialog" disableRipple>
              <Typography component="span" variant="labelS" className="bp-hero-key-label">{labels[step.id] ?? step.title}</Typography>
              <Typography component="span" variant="titleS" className="bp-hero-key-date">{when}</Typography>
              {details[step.id] && <Typography component="span" variant="labelS" className="bp-hero-key-detail">{details[step.id]}</Typography>}
            </ButtonBase>
          </Box>
        )
      })}
    </Box>
  )
}
