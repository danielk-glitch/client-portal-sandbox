/**
 * Your first 10 days · leads the "this stage" zone while the inspection period is on.
 * - The day count is the headline ("Day 4 of 10"). One line says when the period ends and why it matters.
 * - A to-scale track, filled to today, shows the five checkpoints buyers ask about: contract, earnest money, inspection,
 *   repair request, and the end of the period. Done checkpoints fill, the next one gets a ring.
 *   Each checkpoint opens its date. On phones the track becomes a plain list.
 * - One link opens the "Your first 10 days" guide. No CTA: dates, not tasks.
 */
import type { CSSProperties } from 'react'
import { Box, ButtonBase, Typography } from '@mui/material'
import CheckRounded from '@mui/icons-material/CheckRounded'
import { PlaceCard } from '../components/PlaceCard'
import { Eyebrow } from '../components/Eyebrow'
import { TextLink } from '../components/TextLink'
import type { SellerTimelineData } from '../seller-portal/sellerTimelineData'
import { daysBetween, formatDay } from '../seller-portal/timeline-first/timelineFirstData'
import type { OpenItem } from '../seller-portal/timeline-first/TimelineFirstParts'
import { buyerDeal, findBuyerStep } from './buyerTimelineData'

/** The checkpoints on the track, with the short label each one gets there. */
const checkpoints: Array<{ stepId: string; label: string }> = [
  { stepId: 'b-contract', label: 'Contract signed' },
  { stepId: 'b-earnest', label: 'Earnest money' },
  { stepId: 'b-inspection', label: 'Inspection' },
  { stepId: 'b-repair-request', label: 'Repair request' },
  { stepId: 'b-inspection-end', label: 'Period ends' },
]

export function FirstTenDays({ timeline, onOpenStep, onOpenGuide }: { timeline: SellerTimelineData; onOpenStep: (item: OpenItem) => void; onOpenGuide: () => void }) {
  const { contractDate, inspectionEnds, inspectionDays } = buyerDeal
  const day = Math.min(inspectionDays, Math.max(0, daysBetween(contractDate, timeline.today)))
  const at = (iso: string) => `${(Math.min(inspectionDays, Math.max(0, daysBetween(contractDate, iso))) / inspectionDays) * 100}%`
  const ends = formatDay(inspectionEnds, { weekday: 'long', month: 'long', day: 'numeric' })
  const lastDay = day === inspectionDays

  const points = checkpoints
    .map(({ stepId, label }) => ({ label, item: findBuyerStep(timeline, stepId) }))
    .filter((point): point is { label: string; item: OpenItem } => Boolean(point.item?.step.date))
  // The ring marks the next checkpoint on this track, even when another date comes first on the timeline.
  const nextId = points.find(({ item }) => item.step.status !== 'complete')?.item.step.id

  return (
    <PlaceCard component="section" aria-labelledby="bp-ten-title" className="bp-ten">
      <Box className="bp-ten-head">
        <Eyebrow component="p">Your first 10 days</Eyebrow>
        <Typography component="h2" variant="titleL" id="bp-ten-title" className="bp-ten-title">
          {lastDay ? 'Last day of your inspection period' : `Day ${day} of ${inspectionDays}`}
        </Typography>
        <Typography variant="bodyMStandard" color="text.secondary" className="bp-ten-sub">
          Your inspection period ends {lastDay ? 'today' : ends} at 5:00 PM. Until then, you can cancel for inspection reasons and keep your earnest money.
        </Typography>
      </Box>

      <Box className="bp-ten-track">
        <Box className="bp-ten-rail" aria-hidden="true">
          <Box className="bp-ten-fill" style={{ width: at(timeline.today) }} />
        </Box>
        <Box component="ol" className="bp-ten-points" aria-label="Inspection period checkpoints">
          {points.map(({ label, item }, index) => {
            const { step } = item
            const done = step.status === 'complete'
            const next = step.id === nextId
            const edge = index === 0 ? ' is-first' : index === points.length - 1 ? ' is-last' : ''
            return (
              <Box component="li" key={step.id} className={`bp-ten-point${done ? ' is-done' : ''}${next ? ' is-next' : ''}${edge}`} style={{ '--at': at(step.date!) } as CSSProperties}>
                <ButtonBase className="bp-ten-point-button" onClick={() => onOpenStep(item)} aria-haspopup="dialog" disableRipple
                  aria-label={`${step.title}, ${formatDay(step.date!, { weekday: 'long', month: 'long', day: 'numeric' })}${done ? ', done' : next ? ', next up' : ''}`}>
                  <Box component="span" className="bp-ten-dot" aria-hidden="true">{done && <CheckRounded />}</Box>
                  <Box component="span" className="bp-ten-point-copy">
                    <Typography component="span" variant="labelS" className="bp-ten-point-date">{next ? 'Next · ' : ''}{formatDay(step.date!, { weekday: 'short', month: 'short', day: 'numeric' })}</Typography>
                    <Typography component="span" variant="labelM" className="bp-ten-point-label">{label}</Typography>
                  </Box>
                </ButtonBase>
              </Box>
            )
          })}
        </Box>
      </Box>

      <Box className="bp-ten-foot">
        <TextLink onClick={onOpenGuide} aria-haspopup="dialog">Read the first 10 days guide</TextLink>
      </Box>
    </PlaceCard>
  )
}
