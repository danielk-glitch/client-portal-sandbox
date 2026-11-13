/**
 * Direction C2 · Stage focus.
 * A clone of C, reworked after review:
 * - Header: a larger home thumbnail beside the headline, then the dark stage tracker (the existing
 *   timeline component in its dark style). "Full timeline" (beside the tracker label) opens a shadowbox:
 *   C's to-scale calendar, then a toggle between every date by stage and a draggable upcoming row.
 *   Once the hero scrolls away, a slim sticky header keeps the home and the agent in view.
 * - The page splits into two clearly labeled zones:
 *   1. "This stage": follows the stage picked in the tracker. What's coming up next (expand to read
 *      everything, no CTAs), then the timeline exploration's stage block (dates, documents).
 *   2. "Listing and transaction details": always the same regardless of stage. Listing performance,
 *      team and viewers, and tabs for activity, documents, open houses, team work, emails, and notes.
 * - Pinned documents lead the Documents tab. Pin and unpin from the full-screen document viewer.
 * - Open houses: rows in their stage's dates list and in their own tab. Either opens the open house modal.
 * - Right rail beside zone 1: important notes (starred first, then newest, up to five). The agent lives in the hero,
 *   the sticky header, and the footer, so the rail doesn't repeat it.
 * - V1 data: resources are documents with an optional team-set tag (none, Resource, File).
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import { Avatar, Box, ButtonBase, Collapse, Container, Dialog, Typography } from '@mui/material'
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded'
import CheckRounded from '@mui/icons-material/CheckRounded'
import CloseOutlined from '@mui/icons-material/CloseOutlined'
import { DisclosureButton } from '../../components/DisclosureButton'
import { PlaceCard } from '../../components/PlaceCard'
import { SectionLabel } from '../../components/SectionLabel'
import { TextLink } from '../../components/TextLink'
import { Eyebrow } from '../../components/Eyebrow'
import { PlaceIconButton } from '../../components/PlaceIconButton'
import { PlaceModal } from '../../components/PlaceModal'
import { ActivityPanel, DateStamp, EmailsPanel, PeopleSection, PersonContactActions, NotesPanel, type PeopleTab } from '../../transaction-portal/components'
import { PartnerBrandLockup } from '../../components/PartnerBrandLockup'
import { MilestoneDetailsBlock, SellerTimeline } from '../SellerTimeline'
import { AdvertisingSnapshot } from '../AdvertisingSnapshot'
import { MarketingDashboardSheet, type MarketingDashboardSection } from '../MarketingDashboardSheet'
import { futureMarketingSnapshot } from '../futureSellerTransaction'
import type { MilestoneId, SellerMilestone, SellerTimelineStep } from '../sellerTimelineData'
import { CalendarTimeline, placeDate } from './CalendarTimeline'
import { CinematicHero, PassHero, type AgentPlacement, type HeroVariant } from './C2Heroes'
import { currentMilestone, daysBetween, formatDay, teamTodos } from './timelineFirstData'
import { AgentBrandCard, OwnerLabel, SectionTabs, StepDetailBody, TeamTodoList, UpdatesPill, whenCopy, type OpenItem } from './TimelineFirstParts'
import { SegmentedSwitch } from '../../components/SegmentedSwitch'
import { C2DesignPanel } from '../../internal/review/C2DesignPanel'
import { detailWithDocuments, resourceDocumentId } from './taggedDocuments'
import { buildClientDocuments, documentsLinkedTo, sellerDocumentRecords, type ClientDocument } from './documentLibrary'
import { LinkedDateMeta, StagedDocumentsPanel } from './StagedDocumentsPanel'
import type { DirectionContext } from './TimelineFirstPortal'
import { ImportantNotes } from './ImportantNotes'
import { sampleTransactionEmails } from '../../transaction-portal/emailsData'
import { MarketActivityBlock } from '../market-activity/MarketActivityBlock'
import { sampleMarketActivity } from '../market-activity/marketActivityData'
import { OpenHouseRow } from '../OpenHouseRow'
import { OpenHouseModal } from '../OpenHouseModal'
import { isOpenHouseDone, pendingOpenHouses, type OpenHouse } from '../openHouses'


export function byPlacedDate(a: SellerTimelineStep, b: SellerTimelineStep) {
  return (placeDate(a) ?? '9999').localeCompare(placeDate(b) ?? '9999')
}

export function stageRange(milestone: SellerMilestone) {
  if (milestone.startDate && milestone.endDate) return `${formatDay(milestone.startDate)} – ${formatDay(milestone.endDate)}`
  if (milestone.startDate) return `From ${formatDay(milestone.startDate)}`
  return 'Dates to come'
}

/** The highlighted item for a stage: the next step if it's the current stage, otherwise the first open item. */
function featuredStep(milestone: SellerMilestone, nextStepId: string) {
  if (milestone.status === 'current') return milestone.steps.find((step) => step.id === nextStepId)
  if (milestone.status === 'upcoming') return [...milestone.steps].sort(byPlacedDate)[0]
  return undefined
}

export function DirectionC2({ transaction, timeline, openDocument, openResource, openListing, openActivity, pins }: DirectionContext) {
  const current = currentMilestone(timeline)
  const [stageId, setStageId] = useState<MilestoneId>(current.id)
  const [peopleTab, setPeopleTab] = useState<PeopleTab>('team')
  const [sectionTab, setSectionTab] = useState('activity')
  const [fullOpen, setFullOpen] = useState(false)
  // Only documents the client can see. Hidden ones never reach any part of this page.
  const documents = useMemo(() => buildClientDocuments(sellerDocumentRecords, transaction.resources ?? [], timeline), [transaction.resources, timeline])
  const [marketingSection, setMarketingSection] = useState<MarketingDashboardSection | null>(null)
  const [modalItem, setModalItem] = useState<OpenItem | null>(null)
  const [openHouse, setOpenHouse] = useState<OpenHouse | null>(null)
  const openHouses = pendingOpenHouses
  const [shown, setShown] = useState<OpenItem | null>(null)
  const stage = timeline.milestones.find((milestone) => milestone.id === stageId) ?? current
  const closing = timeline.countdown?.date ?? '2026-11-06'
  const listing = transaction.listing
  const leadAgent = transaction.team.find((member) => member.id === transaction.teamBrand.leadAgentId)

  /** "See all notes" in the rail: switch the lower tabs to Notes and scroll them into view. */
  function showAllNotes() {
    setSectionTab('notes')
    document.getElementById('tf-c2-sections')?.scrollIntoView({ behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ? 'auto' : 'smooth', block: 'start' })
  }

  function open(item: OpenItem) {
    setShown(item)
    setModalItem(item)
  }

  /** Guides are documents in V1: open the matching tagged document. */
  function openGuideAsDocument(guide: { id: string }) {
    const doc = documents.find((candidate) => candidate.id === resourceDocumentId(guide.id))
    if (doc) openDocument(doc)
  }

  // Sticky header: show once the hero has fully scrolled out of view.
  // Hero options for review. ?hero=cinematic|pass|pass-light|current
  const [heroVariant, setHeroVariant] = useState<HeroVariant>(() => {
    const requested = new URLSearchParams(window.location.search).get('hero')
    return requested === 'pass' || requested === 'pass-light' || requested === 'current' ? requested : 'cinematic'
  })
  function selectHeroVariant(value: HeroVariant) {
    setHeroVariant(value)
    setHeroPassed(false)
    const url = new URL(window.location.href)
    url.searchParams.set('hero', value)
    window.history.replaceState(null, '', url)
  }

  // Agent card placement for review. ?agent=hero|rail. The rail option moves the listing buttons into the hero's right side.
  const [agentPlacement, setAgentPlacement] = useState<AgentPlacement>(() => new URLSearchParams(window.location.search).get('agent') === 'hero' ? 'hero' : 'rail')
  function selectAgentPlacement(value: AgentPlacement) {
    setAgentPlacement(value)
    const url = new URL(window.location.href)
    url.searchParams.set('agent', value)
    window.history.replaceState(null, '', url)
  }
  // The other headers have no agent card of their own, so the rail always carries it with them.
  const agentInRail = heroVariant !== 'cinematic' || agentPlacement === 'rail'

  const heroRef = useRef<HTMLElement>(null)
  const [heroPassed, setHeroPassed] = useState(false)
  useEffect(() => {
    const hero = heroRef.current
    if (!hero || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(([entry]) => setHeroPassed(!entry.isIntersecting && entry.boundingClientRect.bottom <= 0), { threshold: 0 })
    observer.observe(hero)
    return () => observer.disconnect()
  }, [heroVariant])

  const tracker = (
    <SellerTimeline
      data={timeline}
      transition="dark"
      trackerOnly
      currentLabel="Current"
      headingAction={<TextLink className="tf-timeline-link" onClick={() => setFullOpen(true)} aria-haspopup="dialog">Full timeline</TextLink>}
      onSelectMilestone={setStageId}
      resources={transaction.resources ?? []}
      documents={transaction.documents}
      team={transaction.team}
      onOpenResource={openResource}
      onOpenDocument={openDocument}
    />
  )

  return (
    <>
      <StickyTransactionHeader visible={heroPassed} transaction={transaction} onOpenListing={openListing} />

      {/* ---------- Header: switchable for review (cinematic, pass, current) ---------- */}
      {heroVariant === 'cinematic' && <CinematicHero transaction={transaction} timeline={timeline} tracker={tracker} heroRef={heroRef} onOpenListing={openListing} agentPlacement={agentPlacement} />}
      {heroVariant === 'pass' && <PassHero transaction={transaction} timeline={timeline} tracker={tracker} heroRef={heroRef} onOpenListing={openListing} />}
      {heroVariant === 'pass-light' && <PassHero light transaction={transaction} timeline={timeline} tracker={tracker} heroRef={heroRef} onOpenListing={openListing} />}
      {heroVariant === 'current' && (
      <Box component="section" ref={heroRef} aria-labelledby="tf-c2-title" className="tf-c-hero tf-c2-hero">
        <Container maxWidth="xl" className="tf-c2-hero-inner">
          <ButtonBase className="tf-c2-thumb" onClick={openListing} disableRipple aria-label={`See listing for ${listing.address}`}>
            {listing.photoUrl && <Box component="img" src={listing.photoUrl} alt="" />}
            <Box component="span" className="tf-c-home-label"><Typography variant="labelM" component="span">See listing</Typography><ArrowForwardRounded aria-hidden="true" /></Box>
          </ButtonBase>
          <Box className="tf-c2-hero-copy">
            <Eyebrow component="p" className="tf-c-eyebrow">{listing.address} · {listing.city}, {listing.state}</Eyebrow>
            <Typography component="h1" variant="displayM" id="tf-c2-title">{daysBetween(timeline.today, closing)} days to closing</Typography>
            <Typography component="p" variant="bodyLStandard" className="tf-c-hero-sub">Closing is set for {formatDay(closing, { weekday: 'long', month: 'long', day: 'numeric' })}.</Typography>
            <UpdatesPill count={0} onClick={openActivity} className="tf-a-pill tf-c2-pill" />
          </Box>
        </Container>
        <Container maxWidth="xl" className="tf-c2-tracker">
          {tracker}
        </Container>
      </Box>

      )}

      <C2DesignPanel header={heroVariant} selectHeader={selectHeroVariant} agentPlacement={agentPlacement} selectAgentPlacement={selectAgentPlacement} />

      <Container maxWidth="xl" className="portal-main tf-c2">
        <Box className="tf-c2-top">
          {/* ---------- Zone 1: this stage ---------- */}
          <Box component="section" aria-label={stage.label} className={`tf-c2-stage tf-c2-stage--${stage.status}`}>
            {/* No stage title: the tracker already shows which stage is open. The way back sits on the first label's line. */}
            <NextUp key={stage.id} stage={stage} nextStepId={timeline.nextStepId} today={timeline.today} context={{ transaction, documents, openDocument }} onBack={stage.id !== current.id ? () => setStageId(current.id) : undefined} backLabel={`Back to ${current.label.toLowerCase()}`} />

            <Box component="section" aria-label={`Everything in ${stage.label.toLowerCase()}`} className="tf-c2-all">
              <MilestoneDetailsBlock
                data={timeline}
                milestoneId={stage.id}
                onOpenStep={(step, milestone) => open({ step, milestone })}
                resourcesAsDocuments
                resources={transaction.resources ?? []}
                documents={documents}
                team={transaction.team}
                onOpenResource={openGuideAsDocument}
                onOpenDocument={openDocument}
                linkedDocuments={(step) => documentsLinkedTo(documents, step.id)}
                openHouses={openHouses}
                onOpenOpenHouse={setOpenHouse}
              />
            </Box>
          </Box>

          {/* ---------- Right rail: important notes, then the agent card when it isn't in the hero ---------- */}
          <Box component="aside" className="tf-c2-rail" aria-label={agentInRail ? 'Important notes and your agent' : 'Important notes'}>
            <ImportantNotes notes={transaction.notes} onSeeAll={showAllNotes} />
            {agentInRail && leadAgent && <AgentBrandCard agent={leadAgent} brand={transaction.teamBrand} />}
          </Box>
        </Box>

        {/* ---------- Zone 2: your whole sale ---------- */}
        <Box component="section" aria-labelledby="tf-c2-sale-title" className="tf-c2-sale">
          <Box className="tf-c2-sale-head">
            <Typography component="h2" variant="titleL" id="tf-c2-sale-title">Listing and transaction details</Typography>
          </Box>

          {futureMarketingSnapshot.insights && (
            <Box className="tf-c2-performance">
              <AdvertisingSnapshot data={futureMarketingSnapshot.insights} feedback={transaction.feedback} onOpenDashboard={() => setMarketingSection('overview')} />
            </Box>
          )}

          <MarketActivityBlock activity={sampleMarketActivity} />

          <Box className="tf-c2-lower">
            <PeopleSection team={transaction.team} viewers={transaction.viewers} value={peopleTab} onChange={setPeopleTab} />
          <SectionTabs
            id="tf-c2-sections"
            value={sectionTab}
            onChange={setSectionTab}
            label="Everything in your sale"
            tabs={[
              { id: 'activity', label: 'Activity', content: <ActivityPanel events={transaction.timeline} /> },
              { id: 'documents', label: 'Documents', content: <StagedDocumentsPanel documents={documents} side="seller" onOpen={openDocument} pinnedIds={pins.pinnedIds} /> },
              { id: 'open-houses', label: 'Open houses', content: <OpenHousesPanel openHouses={openHouses} team={transaction.team} onOpen={setOpenHouse} /> },
              { id: 'team', label: 'Team to-dos', content: <TeamTodoList todos={teamTodos} team={transaction.team} intro="The work your team is doing for you, across every stage." /> },
              { id: 'emails', label: 'Emails', content: <EmailsPanel emails={sampleTransactionEmails} /> },
              { id: 'notes', label: 'Notes', content: <NotesPanel notes={transaction.notes} /> },
            ]}
          />
          </Box>
        </Box>
      </Container>

      <MarketingDashboardSheet
        open={marketingSection !== null}
        onClose={() => setMarketingSection(null)}
        initialSection={marketingSection ?? 'overview'}
        transaction={transaction}
        data={futureMarketingSnapshot}
      />

      <FullTimelineDialog open={fullOpen} onClose={() => setFullOpen(false)} timeline={timeline} team={transaction.team} eyebrow={listing.address} onOpen={open} />

      <OpenHouseModal
        openHouse={openHouse}
        stageLabel={timeline.milestones.find((milestone) => milestone.id === openHouse?.milestoneId)?.label}
        team={transaction.team}
        today={timeline.today}
        onClose={() => setOpenHouse(null)}
      />

      {shown && (
        <PlaceModal open={Boolean(modalItem)} onClose={() => setModalItem(null)} title={shown.step.title} description={`${shown.milestone.label} · ${whenCopy(shown.step, true)}`} size="m" className="tf-c-modal">
          <StepDetailBody item={shown} {...documentProps(documents)} introEyebrow="Details" showAfter={false} team={transaction.team} onOpenDocument={(doc) => { setModalItem(null); openDocument(doc) }} />
        </PlaceModal>
      )}
    </>
  )
}

/* ---------- Full timeline shadowbox: the to-scale calendar, then every date by stage or an upcoming row ---------- */

/** Shared by the seller and buyer pages. `calendarEnd` sets the calendar's last day. */
export function FullTimelineDialog({ open, onClose, timeline, team, eyebrow, onOpen, calendarEnd }: {
  open: boolean
  onClose: () => void
  timeline: DirectionContext['timeline']
  team: DirectionContext['transaction']['team']
  eyebrow: string
  onOpen: (item: OpenItem) => void
  calendarEnd?: string
}) {
  const [fullView, setFullView] = useState<'stages' | 'upcoming'>('stages')
  const upcomingDrag = useRef<{ pointerId: number; startX: number; scrollLeft: number } | null>(null)
  const suppressDateClick = useRef(false)
  const [draggingDates, setDraggingDates] = useState(false)
  const upcoming = timeline.milestones.flatMap((milestone) => milestone.steps
    .filter((step) => step.status !== 'complete')
    .map((step) => ({ step, milestone })))
    .sort((a, b) => byPlacedDate(a.step, b.step))

  return (
  <Dialog open={open} onClose={onClose} maxWidth={false} className="tf-shadowbox-root" slotProps={{ paper: { className: 'tf-shadowbox', 'aria-labelledby': 'tf-full-title' } }}>
    <Box className="tf-shadowbox-head">
      <Box>
        <Eyebrow component="p" className="tf-c-eyebrow">{eyebrow}</Eyebrow>
        <Typography component="h2" variant="titleL" id="tf-full-title">Full timeline</Typography>
      </Box>
      <PlaceIconButton onClick={onClose} aria-label="Close full timeline" className="tf-shadowbox-close"><CloseOutlined /></PlaceIconButton>
    </Box>
    <Box className="tf-shadowbox-body">
      <CalendarTimeline timeline={timeline} onOpen={onOpen} end={calendarEnd} />
      <Box className="tf-shadowbox-toolbar">
        <Typography component="h3" variant="titleS">{fullView === 'stages' ? 'Every date, by stage' : `${upcoming.length} upcoming dates`}</Typography>
        <SegmentedSwitch<'stages' | 'upcoming'>
          size="s"
          value={fullView}
          onChange={setFullView}
          aria-label="Timeline view"
          className="tf-shadowbox-switch"
          options={[
            { value: 'stages', label: 'By stage' },
            { value: 'upcoming', label: 'Upcoming' },
          ]}
        />
      </Box>
      {fullView === 'stages' ? (
      <Box className="tf-shadowbox-stages">
        {timeline.milestones.map((milestone) => (
          <Box component="section" key={milestone.id} className={`tf-shadowbox-stage tf-shadowbox-stage--${milestone.status}`}>
            <Typography component="h3" variant="labelS" className="tf-shadowbox-stage-title">{milestone.label} <Box component="span">{stageRange(milestone)}</Box></Typography>
            <Box component="ul">
              {[...milestone.steps].sort(byPlacedDate).map((step) => (
                <Box component="li" key={step.id}>
                  <ButtonBase className={`tf-shadowbox-item${step.status === 'complete' ? ' is-done' : ''}`} onClick={() => onOpen({ step, milestone })} disableRipple>
                    <Typography variant="labelS" component="span" className="tf-shadowbox-date">{step.date ? formatDay(step.date) : 'TBD'}</Typography>
                    <Typography variant="labelM" component="span">{step.title}</Typography>
                  </ButtonBase>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
      ) : (
      <Box
        component="ol"
        className={`tf-c-strip tf-shadowbox-strip${draggingDates ? ' is-dragging' : ''}`}
        aria-label="Upcoming dates"
        onPointerDown={(event) => {
          suppressDateClick.current = false
          if (event.pointerType !== 'mouse' || event.button !== 0) return
          upcomingDrag.current = { pointerId: event.pointerId, startX: event.clientX, scrollLeft: event.currentTarget.scrollLeft }
        }}
        onPointerMove={(event) => {
          const drag = upcomingDrag.current
          if (!drag || drag.pointerId !== event.pointerId) return
          const distance = event.clientX - drag.startX
          if (!suppressDateClick.current && Math.abs(distance) < 5) return
          if (!suppressDateClick.current) {
            event.currentTarget.setPointerCapture(event.pointerId)
            suppressDateClick.current = true
            setDraggingDates(true)
          }
          event.preventDefault()
          event.currentTarget.scrollLeft = drag.scrollLeft - distance
        }}
        onPointerUp={() => {
          upcomingDrag.current = null
          setDraggingDates(false)
        }}
        onPointerCancel={() => {
          upcomingDrag.current = null
          setDraggingDates(false)
        }}
        onLostPointerCapture={() => {
          upcomingDrag.current = null
          setDraggingDates(false)
        }}
        onPointerLeave={() => {
          if (!suppressDateClick.current) upcomingDrag.current = null
        }}
        onClickCapture={(event) => {
          // A drag browses the row; a click or keyboard activation still opens the date.
          if (suppressDateClick.current && event.detail > 0) {
            event.preventDefault()
            event.stopPropagation()
          }
        }}
      >
        {upcoming.map(({ step, milestone }, index) => {
          const newStage = index === 0 || upcoming[index - 1].milestone.id !== milestone.id
          return (
            <Box component="li" key={step.id} className={`tf-c-card-slot${newStage ? ' is-stage-start' : ''}`}>
              {newStage && <Typography variant="labelS" className="tf-c-stage-tick">{milestone.label}</Typography>}
              <DateCard step={step} milestone={milestone} team={team} onOpen={() => onOpen({ step, milestone })} />
            </Box>
          )
        })}
      </Box>
      )}
    </Box>
  </Dialog>
  )
}

export type ZoneContext = Pick<DirectionContext, 'transaction' | 'openDocument'> & { documents: ClientDocument[] }

/**
 * StepDetailBody props for the documents-only model: guides fold into documents, tags show,
 * and any document linked to the date joins the list. Rows show the file name and linked date.
 */
export function documentProps(documents: ClientDocument[]) {
  const find = (doc: { id: string }) => documents.find((candidate) => candidate.id === doc.id)
  return {
    documents,
    resources: [],
    getDetail: (step: SellerTimelineStep) => {
      const detail = detailWithDocuments(step)
      return { ...detail, documentIds: [...new Set([...documentsLinkedTo(documents, step.id).map((doc) => doc.id), ...(detail.documentIds ?? [])])] }
    },
    tagFor: (doc: { id: string }) => find(doc)?.tag,
    metaFor: (doc: { id: string }) => {
      const match = find(doc)
      return match ? <LinkedDateMeta document={match} /> : undefined
    },
    openAnyTime: true,
    documentsTitle: 'Documents',
    onOpenResource: () => {},
  }
}

/* ---------- What's coming up next: one highlighted item, expand to read everything ---------- */

/** `onBack`: when another stage is open, the way back to the current stage sits on the section label's line. */
export function NextUp({ stage, nextStepId, today, context, onBack, backLabel }: { stage: SellerMilestone; nextStepId: string; today: string; context: ZoneContext; onBack?: () => void; backLabel?: string }) {
  const [open, setOpen] = useState(false)
  const step = featuredStep(stage, nextStepId)
  const { transaction } = context
  const back = onBack && <TextLink direction="back" onClick={onBack}>{backLabel}</TextLink>

  if (!step) {
    return (
      <Box component="section" aria-labelledby="tf-c2-next-label" className="tf-c2-next-section">
        <SectionLabel id="tf-c2-next-label" action={back}>{stage.label} recap</SectionLabel>
        <PlaceCard className="tf-c2-next tf-c2-next--done">
          <Box component="span" className="tf-c2-done-mark" aria-hidden="true"><CheckRounded /></Box>
          <Box>
            <Typography variant="titleS" component="p">This stage is complete</Typography>
            <Typography variant="bodySStandard" color="text.secondary">Finished {stage.endDate ? formatDay(stage.endDate, { month: 'long', day: 'numeric' }) : ''}. Everything that happened is listed below.</Typography>
          </Box>
        </PlaceCard>
      </Box>
    )
  }

  const days = step.date ? daysBetween(today, step.date) : null
  const away = days === null ? step.estimate ?? 'Date to come' : days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : days > 0 ? `In ${days} days` : `${-days} days ago`
  const panelId = `tf-c2-next-${step.id}`

  return (
    <Box component="section" aria-labelledby="tf-c2-next-label" className="tf-c2-next-section">
      <SectionLabel id="tf-c2-next-label" action={back}>{stage.status === 'current' ? 'What’s coming up next' : `First up in ${stage.label.toLowerCase()}`}</SectionLabel>
      <PlaceCard padding="none" className={`tf-c2-next${open ? ' is-open' : ''}`}>
        <Box className="tf-c2-next-inner">
          <Box className="tf-c2-next-head">
            <DateStamp date={step.date} tbd={!step.date} />
            <Box className="tf-c2-next-copy">
              <Typography component="h4" variant="titleM" id="tf-c2-next-title">{step.title}</Typography>
              <Typography variant="bodyMStandard" color="text.secondary">{step.summary}</Typography>
              {/* The stamp shows the date, so the meta line says how far away it is and whose it is. */}
              <Typography variant="labelS" color="text.secondary" className="tf-c2-next-meta">
                {away}<Box component="span" aria-hidden="true">·</Box><OwnerLabel owner={step.owner} team={transaction.team} />
              </Typography>
            </Box>
          </Box>
          <Collapse in={open}>
            <Box id={panelId} className="tf-c2-next-body">
              <StepDetailBody item={{ step, milestone: stage }} hideFacts introEyebrow="Details" showAfter={false} {...documentProps(context.documents)} team={transaction.team} onOpenDocument={context.openDocument} />
            </Box>
          </Collapse>
        </Box>
        <DisclosureButton placement="cardFooter" open={open} onToggle={() => setOpen(!open)} showLabel="Show all details" hideLabel="Show less" controls={panelId} />
      </PlaceCard>
    </Box>
  )
}

export function DateCard({ step, milestone, team, onOpen }: { step: SellerTimelineStep; milestone: SellerMilestone; team: DirectionContext['transaction']['team']; onOpen: () => void }) {
  const tbd = !step.date
  return (
    <ButtonBase className={`tf-c-card${tbd ? ' is-tbd' : ''}${milestone.status === 'upcoming' ? ' is-later' : ''}`} onClick={onOpen} aria-haspopup="dialog" disableRipple>
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

/* ---------- Open houses tab: every open house in the sale, upcoming first, then most recent ---------- */

function OpenHousesPanel({ openHouses, team, onOpen }: { openHouses: OpenHouse[]; team: DirectionContext['transaction']['team']; onOpen: (openHouse: OpenHouse) => void }) {
  const upcoming = openHouses.filter((openHouse) => !isOpenHouseDone(openHouse)).sort((a, b) => a.date.localeCompare(b.date))
  const past = openHouses.filter(isOpenHouseDone).sort((a, b) => b.date.localeCompare(a.date))
  const visitors = past.reduce((total, openHouse) => total + (openHouse.attendees ?? 0), 0)
  const leads = past.reduce((total, openHouse) => total + (openHouse.leads ?? 0), 0)

  if (!openHouses.length) {
    return <Typography variant="bodySStandard" color="text.secondary">No open houses yet. Your agent will add them here once they’re scheduled.</Typography>
  }

  return (
    <Box className="open-house-panel">
      {past.length > 0 && (
        <Typography component="p" variant="bodyMStandard" className="tab-panel-intro open-house-summary">
          {past.length} {past.length === 1 ? 'open house' : 'open houses'} held · {visitors} visitors · {leads} leads
        </Typography>
      )}
      <Box component="ul" className="timeline-item-list" aria-label="Open houses">
        {[...upcoming, ...past].map((item) => <OpenHouseRow key={item.id} openHouse={item} team={team} calendar onOpen={() => onOpen(item)} />)}
      </Box>
    </Box>
  )
}

/* ---------- Sticky header: appears once the hero scrolls away ---------- */

/** `agentLabel`: the role line above the agent's name. */
export function StickyTransactionHeader({ visible, transaction, onOpenListing, agentLabel = 'Your listing agent' }: { visible: boolean; transaction: DirectionContext['transaction']; onOpenListing: () => void; agentLabel?: string }) {
  const { listing } = transaction
  const agent = transaction.team.find((member) => member.id === transaction.teamBrand.leadAgentId)
  return (
    <Box component="header" className={`tf-sticky${visible ? ' is-visible' : ''}`} aria-hidden={!visible} inert={!visible}>
      <Container maxWidth="xl" className="tf-sticky-inner">
        <Box className="tf-sticky-lead">
          <ButtonBase component="a" href="/" className="tf-sticky-back" aria-label="Back to the PLACE client portal home" disableRipple>
            <Typography variant="labelM" component="span">Client portal</Typography>
          </ButtonBase>
          <Box className="tf-sticky-back-divider" aria-hidden="true" />
        <ButtonBase className="tf-sticky-home" onClick={onOpenListing} aria-label={`See listing for ${listing.address}`} disableRipple>
          {listing.photoUrl && <Box component="img" src={listing.photoUrl} alt="" className="tf-sticky-thumb" />}
          <Box component="span" className="tf-sticky-address">
            <Typography variant="titleXS" component="span">{listing.address}</Typography>
            <Typography variant="labelS" component="span" color="text.secondary">{listing.city}, {listing.state}</Typography>
          </Box>
        </ButtonBase>
        </Box>
        {agent && (
          <Box className="tf-sticky-agent">
            <Avatar src={agent.photoUrl} alt="" className="tf-sticky-avatar">{agent.initials}</Avatar>
            <Box className="tf-sticky-agent-copy">
              <Typography variant="labelS" component="span" color="text.secondary">{agentLabel}</Typography>
              <Typography variant="labelM" component="span">{agent.name}</Typography>
            </Box>
            <PersonContactActions person={agent} />
            <Box className="tf-sticky-divider" aria-hidden="true" />
            <Box className="tf-sticky-brand"><PartnerBrandLockup brand={transaction.teamBrand} /></Box>
          </Box>
        )}
      </Container>
    </Box>
  )
}
