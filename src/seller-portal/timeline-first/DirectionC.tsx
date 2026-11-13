/**
 * Direction C · Calendar.
 * Time drawn to scale. A deep navy hero holds a calendar track from the first meeting to closing:
 * stage bands, a "Today" needle, a pin for every date, and dashed pins where a date is estimated
 * but not scheduled. Below, the one thing that needs you now is featured with its instructions
 * open, beside recent updates. A filmstrip of upcoming dates follows. Any date opens a modal.
 */
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Box, Button, ButtonBase, Container, Paper, Stack, Typography } from '@mui/material'
import ArrowOutwardOutlined from '@mui/icons-material/ArrowOutwardOutlined'
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined'
import { Eyebrow } from '../../components/Eyebrow'
import { PlaceModal } from '../../components/PlaceModal'
import { PeopleSection, ResourcesPanel, TeamNoteCard, type PeopleTab } from '../../transaction-portal/components'
import { PortalSectionHeader } from '../../components/PortalSection'
import type { SellerMilestone, SellerTimelineStep } from '../sellerTimelineData'
import { currentMilestone, daysBetween, formatDay, teamTodos } from './timelineFirstData'
import { ActivityFeed, NewBadge, OwnerLabel, SectionTabs, StepDetailBody, TeamTodoList, whenCopy, type OpenItem } from './TimelineFirstParts'
import type { DirectionContext } from './TimelineFirstPortal'

/** Where an unscheduled item probably lands, so its dashed pin sits in a believable spot. */
const estimatedDates: Record<string, string> = {
  'uc-repairs': '2026-10-13',
  'cl-statement': '2026-11-03',
  'cl-walkthrough': '2026-11-04',
}

/** Pins that get a printed label, and which row the label sits on so neighbors don't collide. */
const keyLabels: Record<string, { label: string; low?: boolean }> = {
  'pl-consultation': { label: 'First meeting' },
  'al-live': { label: 'Listed', low: true },
  'al-offer': { label: 'Offer accepted' },
  'uc-inspection': { label: 'Inspection', low: true },
  'uc-appraisal': { label: 'Appraisal' },
  'uc-contingencies': { label: 'Contingencies clear' },
  'cl-walkthrough': { label: 'Walkthrough', low: true },
  'cl-signing': { label: 'Closing' },
}

function placeDate(step: SellerTimelineStep) {
  return step.date ?? estimatedDates[step.id]
}

export function DirectionC({ transaction, timeline, unseen, openDocument, openResource, openListing, openActivity, documentsPanel }: DirectionContext) {
  const [peopleTab, setPeopleTab] = useState<PeopleTab>('team')
  const [modalItem, setModalItem] = useState<OpenItem | null>(null)
  const [shown, setShown] = useState<OpenItem | null>(null)
  const current = currentMilestone(timeline)
  const next = current.steps.find((step) => step.id === timeline.nextStepId)
  const closing = timeline.countdown?.date ?? '2026-11-06'
  const start = timeline.milestones[0].startDate ?? timeline.today
  const end = '2026-11-08'
  const total = daysBetween(start, end)
  const at = (iso: string) => `${(daysBetween(start, iso) / total) * 100}%`
  const listing = transaction.listing
  const agent = transaction.team.find((member) => member.id === transaction.teamBrand.leadAgentId)
  const nextDoc = next ? transaction.documents.find((doc) => doc.id === next.documentId) : undefined

  const calendarRef = useRef<HTMLDivElement>(null)
  // On narrow screens the calendar scrolls sideways. Start it centered on today.
  useEffect(() => {
    const calendar = calendarRef.current
    if (!calendar || calendar.scrollWidth <= calendar.clientWidth) return
    const share = daysBetween(start, timeline.today) / total
    calendar.scrollLeft = share * calendar.scrollWidth - calendar.clientWidth / 2
  }, [start, timeline.today, total])

  function open(item: OpenItem) {
    setShown(item)
    setModalItem(item)
  }

  const pins = timeline.milestones.flatMap((milestone) => milestone.steps
    .filter((step) => placeDate(step))
    .map((step) => ({ step, milestone, date: placeDate(step)! })))
  const labeled = pins.filter((pin) => keyLabels[pin.step.id]).sort((a, b) => a.date.localeCompare(b.date))

  const upcoming = timeline.milestones.flatMap((milestone) => milestone.steps
    .filter((step) => step.status !== 'complete' && step.id !== timeline.nextStepId)
    .map((step) => ({ step, milestone, sortDate: placeDate(step) ?? '9999' })))
    .sort((a, b) => a.sortDate.localeCompare(b.sortDate))

  return (
    <>
      <Box component="section" aria-labelledby="tf-c-title" className="tf-c-hero">
        <Container maxWidth="xl" className="tf-c-hero-inner">
          <Box className="tf-c-hero-top">
            <Box>
              <Eyebrow component="p" className="tf-c-eyebrow">{listing.address} · {current.label}</Eyebrow>
              <Typography component="h1" variant="displayM" id="tf-c-title">{daysBetween(timeline.today, closing)} days to closing</Typography>
              <Typography variant="bodyLStandard" className="tf-c-hero-sub">Stage {timeline.milestones.indexOf(current) + 1} of {timeline.milestones.length}. {current.summary}</Typography>
            </Box>
            <ButtonBase className="tf-c-home" onClick={openListing} disableRipple aria-label={`See listing for ${listing.address}`}>
              {listing.photoUrl && <Box component="img" src={listing.photoUrl} alt="" />}
              <Box component="span" className="tf-c-home-label"><Typography variant="labelM" component="span">See listing</Typography><ArrowOutwardOutlined aria-hidden="true" /></Box>
            </ButtonBase>
          </Box>

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
                  onClick={() => open({ step, milestone })}
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
        </Container>
      </Box>

      <Container maxWidth="xl" className="portal-main tf-c">
        <Box className="tf-c-now">
          {next && (
            <Paper component="section" variant="outlined" aria-labelledby="tf-c-next-title" className="tf-c-next">
              <Box className="tf-c-next-head">
                <Box>
                  <Eyebrow component="p">Needs you · {whenCopy(next)}</Eyebrow>
                  <Typography component="h2" variant="titleL" id="tf-c-next-title">{next.title}</Typography>
                </Box>
                <Typography variant="labelM" className="tf-c-next-due">{next.date ? `${daysBetween(timeline.today, next.date)} days left` : ''}</Typography>
              </Box>
              <StepDetailBody item={{ step: next, milestone: current }} hideFacts team={transaction.team} documents={transaction.documents} resources={transaction.resources ?? []} onOpenDocument={openDocument} onOpenResource={openResource} />
              <Box className="tf-c-next-actions">
                {agent?.email && <Button variant="outlined" href={`mailto:${agent.email}?subject=${encodeURIComponent(next.title)}`}>Ask {agent.name.split(' ')[0]}</Button>}
                {nextDoc && <Button variant="contained" color="primary" startIcon={<DescriptionOutlined />} onClick={() => openDocument(nextDoc)}>Review and sign</Button>}
              </Box>
            </Paper>
          )}

          <Paper component="section" variant="outlined" className="portal-section tf-card tf-c-updates">
            <PortalSectionHeader title="Recent updates" prominent action={<NewBadge count={unseen} />} />
            <Box className="portal-section-content">
              <ActivityFeed events={transaction.timeline.slice(0, 4)} unseen={unseen} />
              <Button variant="outlined" fullWidth onClick={openActivity} className="tf-see-all">See all updates</Button>
            </Box>
          </Paper>
        </Box>

        <Box component="section" aria-labelledby="tf-c-coming-title" className="tf-c-coming">
          <Box className="tf-c-coming-head">
            <Typography component="h2" variant="titleM" id="tf-c-coming-title">Coming up</Typography>
            <Typography variant="bodySStandard" color="text.secondary">{upcoming.length} dates through closing</Typography>
          </Box>
          <Box component="ol" className="tf-c-strip">
            {upcoming.map(({ step, milestone }, index) => {
              const newStage = index === 0 || upcoming[index - 1].milestone.id !== milestone.id
              return (
                <Box component="li" key={step.id} className={`tf-c-card-slot${newStage ? ' is-stage-start' : ''}`}>
                  {newStage && <Typography variant="labelS" className="tf-c-stage-tick">{milestone.label}</Typography>}
                  <DateCard step={step} milestone={milestone} team={transaction.team} onOpen={() => open({ step, milestone })} />
                </Box>
              )
            })}
          </Box>
        </Box>

        <SectionTabs
          label="Transaction information"
          tabs={[
            { id: 'documents', label: 'Documents', content: documentsPanel },
            { id: 'team', label: 'Behind the scenes', content: <TeamTodoList todos={teamTodos} team={transaction.team} intro="The work your team is doing for you. Nothing here needs your action." /> },
            { id: 'notes', label: 'Notes', content: <Stack spacing={2} className="notes-list">{transaction.notes.map((note) => <TeamNoteCard key={note.id} note={note} />)}</Stack> },
            { id: 'guides', label: 'Guides', content: <ResourcesPanel resources={transaction.resources ?? []} onOpen={openResource} /> },
            { id: 'people', label: 'People', content: <PeopleSection team={transaction.team} viewers={transaction.viewers} value={peopleTab} onChange={setPeopleTab} /> },
          ]}
        />
      </Container>

      {shown && (
        <PlaceModal open={Boolean(modalItem)} onClose={() => setModalItem(null)} title={shown.step.title} description={`${shown.milestone.label} · ${whenCopy(shown.step, true)}`} size="m" className="tf-c-modal">
          <StepDetailBody item={shown} team={transaction.team} documents={transaction.documents} resources={transaction.resources ?? []} onOpenDocument={(doc) => { setModalItem(null); openDocument(doc) }} onOpenResource={(guide) => { setModalItem(null); openResource(guide) }} />
        </PlaceModal>
      )}
    </>
  )
}

function DateCard({ step, milestone, team, onOpen }: { step: SellerTimelineStep; milestone: SellerMilestone; team: DirectionContext['transaction']['team']; onOpen: () => void }) {
  const tbd = !step.date
  const locked = milestone.status === 'upcoming'
  return (
    <ButtonBase className={`tf-c-card${tbd ? ' is-tbd' : ''}${locked ? ' is-later' : ''}`} onClick={onOpen} aria-haspopup="dialog" disableRipple>
      <Box component="span" className="tf-c-card-date">
        {tbd ? <>
          <Typography variant="labelS" component="span">Not scheduled</Typography>
          <Typography variant="titleS" component="span">TBD</Typography>
        </> : <>
          <Typography variant="labelS" component="span">{formatDay(step.date!, { weekday: 'long' })}</Typography>
          <Typography variant="titleS" component="span">{formatDay(step.date!)}</Typography>
        </>}
      </Box>
      <Typography variant="titleXS" component="span" className="tf-c-card-title">{step.title}</Typography>
      <Typography variant="bodySStandard" component="span" color="text.secondary" className="tf-c-card-summary">{tbd && step.estimate ? step.estimate : step.summary}</Typography>
      <Typography variant="labelS" component="span" color="text.secondary" className="tf-c-card-meta"><OwnerLabel owner={step.owner} team={team} /></Typography>
    </ButtonBase>
  )
}
