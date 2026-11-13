/**
 * Calendar timeline · the to-scale calendar from direction C, as a standalone piece.
 * Stage bands, a "Today" needle, a pin per date, dashed pins for estimated dates.
 * Sits on a dark surface. Used by C2's "Full timeline" shadowbox.
 */
import { useEffect, useRef, type CSSProperties } from 'react'
import { Box, ButtonBase, Typography } from '@mui/material'
import type { SellerTimelineData, SellerTimelineStep } from '../sellerTimelineData'
import { daysBetween, formatDay } from './timelineFirstData'
import type { OpenItem } from './TimelineFirstParts'

/** Where an unscheduled item probably lands, so its dashed pin sits in a believable spot. */
export const estimatedDates: Record<string, string> = {
  'uc-repairs': '2026-10-13',
  'cl-statement': '2026-11-03',
  'cl-walkthrough': '2026-11-04',
  // Buyer
  'b-loan-docs': '2026-10-22',
  'b-locks': '2026-11-09',
}

/** Pins that get a printed label, and which row the label sits on so neighbors don't collide. */
const keyLabels: Record<string, { label: string; low?: boolean }> = {
  'pl-consultation': { label: 'First meeting' },
  'al-live': { label: 'Listed', low: true },
  'al-offer': { label: 'Offer accepted' },
  'uc-inspection': { label: 'Inspection', low: true },
  'uc-appraisal': { label: 'Appraisal' },
  'uc-contingencies': { label: 'Contingencies' },
  'cl-walkthrough': { label: 'Walkthrough', low: true },
  'cl-signing': { label: 'Closing' },
  // Buyer
  'b-contract': { label: 'Contract signed' },
  'b-inspection': { label: 'Inspection', low: true },
  'b-inspection-end': { label: 'Inspection ends' },
  'b-appraisal': { label: 'Appraisal', low: true },
  'b-loan-commitment': { label: 'Loan commitment' },
  'b-walkthrough': { label: 'Walkthrough', low: true },
  'b-signing': { label: 'Closing' },
}

export function placeDate(step: SellerTimelineStep) {
  return step.date ?? estimatedDates[step.id]
}

/** `end`: the calendar's last day. Dates after it are left off the calendar. */
export function CalendarTimeline({ timeline, onOpen, end = '2026-11-08' }: { timeline: SellerTimelineData; onOpen: (item: OpenItem) => void; end?: string }) {
  const closing = timeline.countdown?.date ?? '2026-11-06'
  const start = timeline.milestones[0].startDate ?? timeline.today
  const total = daysBetween(start, end)
  const at = (iso: string) => `${(daysBetween(start, iso) / total) * 100}%`
  const calendarRef = useRef<HTMLDivElement>(null)

  // On narrow screens the calendar scrolls sideways. Start it centered on today.
  useEffect(() => {
    const calendar = calendarRef.current
    if (!calendar || calendar.scrollWidth <= calendar.clientWidth) return
    calendar.scrollLeft = (daysBetween(start, timeline.today) / total) * calendar.scrollWidth - calendar.clientWidth / 2
  }, [start, timeline.today, total])

  const pins = timeline.milestones.flatMap((milestone) => milestone.steps
    .filter((step) => placeDate(step) && placeDate(step)! <= end)
    .map((step) => ({ step, milestone, date: placeDate(step)! })))
  const labeled = pins.filter((pin) => keyLabels[pin.step.id]).sort((a, b) => a.date.localeCompare(b.date))

  return (
    <Box ref={calendarRef} className="tf-c-calendar" role="group" aria-label="Calendar of your sale">
      <Box className="tf-c-bands">
        {timeline.milestones.map((milestone) => {
          const from = milestone.startDate ?? start
          const to = milestone.endDate ?? closing
          return (
            <Box key={milestone.id} className={`tf-c-band tf-c-band--${milestone.status}`} style={{ left: at(from), width: `calc(${at(to)} - ${at(from)})` } as CSSProperties}>
              <Typography variant="labelS" component="span">{milestone.label}</Typography>
            </Box>
          )
        })}
        <Box className="tf-c-elapsed" style={{ width: at(timeline.today) }} aria-hidden="true" />
      </Box>

      <Box className="tf-c-track">
        <Box className="tf-c-today" style={{ left: at(timeline.today) }}><Typography variant="labelS" component="span">Today</Typography></Box>
        {pins.map(({ step, milestone, date }) => (
          <ButtonBase
            key={step.id}
            className={`tf-c-pin${step.status === 'complete' ? ' is-done' : ''}${!step.date ? ' is-tbd' : ''}${keyLabels[step.id] ? ' is-key' : ''}${step.id === timeline.nextStepId ? ' is-next' : ''}`}
            style={{ left: at(date) }}
            onClick={() => onOpen({ step, milestone })}
            aria-label={`${step.title}, ${step.date ? formatDay(step.date, { weekday: 'long', month: 'long', day: 'numeric' }) : `not scheduled yet, ${step.estimate}`}`}
            title={`${step.title} · ${step.date ? formatDay(step.date) : 'Date TBD'}`}
            disableRipple
          />
        ))}
      </Box>

      <Box className="tf-c-labels" aria-hidden="true">
        {labeled.map(({ step, date }) => (
          <Box key={step.id} className={`tf-c-label${keyLabels[step.id].low ? ' is-low' : ''}${daysBetween(start, date) / total > 0.88 ? ' is-end' : ''}${!step.date ? ' is-tbd' : ''}${step.status === 'complete' ? ' is-done' : ''}`} style={{ left: at(date) }}>
            <Typography variant="labelM" component="span">{keyLabels[step.id].label}</Typography>
            <Typography variant="labelS" component="span">{step.date ? formatDay(step.date) : 'Date TBD'}</Typography>
          </Box>
        ))}
      </Box>

      <Box className="tf-c-legend" aria-hidden="true">
        <Typography variant="labelS" component="span"><Box component="span" className="tf-c-key tf-c-key--done" />Done</Typography>
        <Typography variant="labelS" component="span"><Box component="span" className="tf-c-key" />Scheduled</Typography>
        <Typography variant="labelS" component="span"><Box component="span" className="tf-c-key tf-c-key--tbd" />Not scheduled yet</Typography>
      </Box>
    </Box>
  )
}
