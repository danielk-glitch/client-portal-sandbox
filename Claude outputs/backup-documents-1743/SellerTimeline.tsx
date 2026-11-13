import { createContext, useContext, useEffect, useId, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react'
import { Avatar, Box, Button, ButtonBase, Typography, useMediaQuery } from '@mui/material'
import CheckRounded from '@mui/icons-material/CheckRounded'
import ExpandMoreRounded from '@mui/icons-material/ExpandMoreRounded'
import LockOutlined from '@mui/icons-material/LockOutlined'
import MenuBookOutlined from '@mui/icons-material/MenuBookOutlined'
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined'
import EventOutlined from '@mui/icons-material/EventOutlined'
import TaskAltOutlined from '@mui/icons-material/TaskAltOutlined'
import InsightsOutlined from '@mui/icons-material/InsightsOutlined'
import { PlaceModal } from '../components/PlaceModal'
import { DocumentListRow } from './DocumentListRow'
import { AddToCalendarButton } from './AddToCalendarButton'
import { Eyebrow } from '../components/Eyebrow'
import { DateRowCopy, DateStamp, ResourceChip } from '../transaction-portal/components'
import type { TeamMember, TransactionDocument, TransactionResource } from '../transaction-portal/types'
import type { MilestoneId, SellerMilestone, SellerTimelineData, SellerTimelineStep, TimelineItemKind, TimelineStatus } from './sellerTimelineData'
import { OwnerLabel, StepDetailBody, whenCopy } from './timeline-first/TimelineFirstParts'
import { OpenHouseRow } from './OpenHouseRow'
import { isOpenHouseDone, type OpenHouse } from './openHouses'
import './seller-timeline.css'

/** divider and dark sit on the page under a hero; card sits inside a column layout. */
export type TimelineTransition = 'divider' | 'dark' | 'card'

type SellerTimelineProps = {
  data: SellerTimelineData
  resources: TransactionResource[]
  documents: TransactionDocument[]
  team: TeamMember[]
  onOpenResource: (resource: TransactionResource) => void
  onOpenDocument: (document: TransactionDocument) => void
  onOpenMarketing?: () => void
  /** How the section separates from the hero above. */
  transition?: TimelineTransition
  /** Forces a layout. Used by the component gallery. */
  layout?: 'auto' | 'tracker' | 'stacked'
  /** Replaces the built-in item modal, e.g. with a richer detail drawer. */
  onOpenStep?: (step: SellerTimelineStep, milestone: SellerMilestone) => void
  /** Show only the stage tracker. The page renders the selected stage's items elsewhere. */
  trackerOnly?: boolean
  /** Called when the client picks a stage in the tracker. */
  onSelectMilestone?: (id: MilestoneId) => void
  /** Word on the current stage's marker. Defaults to "Now". */
  currentLabel?: string
  /** V1 model: guides show as documents tagged "Resource" instead of book-icon guides. */
  resourcesAsDocuments?: boolean
  /** Prefix the stage block's column labels with the stage name, e.g. "Pending · Dates & action items". */
  stageInTitles?: boolean
  /** A small link beside the "Transaction timeline" label, separated by a dot (e.g. "Full timeline"). */
  headingAction?: ReactNode
  /** Open houses show as rows in their stage's dates list, sorted in with the other dates. */
  openHouses?: OpenHouse[]
  onOpenOpenHouse?: (openHouse: OpenHouse) => void
}

type Handlers = Pick<SellerTimelineProps, 'resources' | 'documents' | 'team' | 'onOpenResource' | 'onOpenDocument' | 'onOpenMarketing' | 'trackerOnly' | 'onSelectMilestone' | 'currentLabel' | 'resourcesAsDocuments' | 'stageInTitles' | 'headingAction' | 'openHouses' | 'onOpenOpenHouse'>

const statusCopy: Record<TimelineStatus, string> = { complete: 'Complete', current: 'Current stage', upcoming: 'Upcoming' }

const timelineItemKinds: Record<TimelineItemKind, { label: string; icon: ReactNode }> = {
  action: { label: 'Action', icon: <TaskAltOutlined /> },
  date: { label: 'Date', icon: <EventOutlined /> },
  document: { label: 'Document', icon: <DescriptionOutlined /> },
  resource: { label: 'Resource', icon: <MenuBookOutlined /> },
}

function stepKind(step: SellerTimelineStep): Exclude<TimelineItemKind, 'resource'> {
  if (step.kind) return step.kind
  if (step.documentId || step.pendingDocument) return 'document'
  return step.owner === 'you' ? 'action' : 'date'
}

function formatDate(iso: string, options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }) {
  return new Intl.DateTimeFormat('en-US', { ...options, timeZone: 'UTC' }).format(new Date(`${iso}T12:00:00Z`))
}

/** Prototype-only check-off state: sellers can tick actions, and progress updates live. */
type TimelineChecks = { isDone: (step: SellerTimelineStep) => boolean; toggle: (step: SellerTimelineStep) => void }
const defaultIsDone = (step: SellerTimelineStep) => step.status === 'complete'
const ChecksContext = createContext<TimelineChecks>({ isDone: defaultIsDone, toggle: () => {} })

/** Card mode (the 2 column page): no collapse; Done is revealed by a pill under the list. */
const CardModeContext = createContext(false)

function completedCount(milestone: SellerMilestone, isDone = defaultIsDone) {
  return milestone.steps.filter(isDone).length
}

/** Short date context, revealed on hover and selection. */
function nodeCaption(milestone: SellerMilestone, isDone = defaultIsDone) {
  if (milestone.status === 'complete') return milestone.endDate ? `Done ${formatDate(milestone.endDate)}` : 'Done'
  if (milestone.status === 'current') return `${completedCount(milestone, isDone)} of ${milestone.steps.length} done`
  return milestone.startDate ? `From ${formatDate(milestone.startDate)}` : 'Not started'
}

export function SellerTimeline({ data, layout = 'auto', transition = 'divider', onOpenStep: openStepOverride, ...handlers }: SellerTimelineProps) {
  const prefersStacked = useMediaQuery('(max-width: 899.95px)', { noSsr: true })
  const stacked = layout === 'stacked' || (layout === 'auto' && prefersStacked)
  const current = data.milestones.find((milestone) => milestone.status === 'current') ?? data.milestones[0]
  const titleId = useId()
  const [openStep, setOpenStep] = useState<{ step: SellerTimelineStep; milestone: SellerMilestone } | null>(null)
  const [overrides, setOverrides] = useState<Record<string, boolean>>({})
  const checks = useMemo<TimelineChecks>(() => ({
    isDone: (step) => overrides[step.id] ?? defaultIsDone(step),
    toggle: (step) => setOverrides((previous) => ({ ...previous, [step.id]: !(previous[step.id] ?? defaultIsDone(step)) })),
  }), [overrides])

  return (
    <ChecksContext.Provider value={checks}>
    <CardModeContext.Provider value={transition === 'card'}>
    <Box component="section" aria-labelledby={titleId} className={`seller-timeline seller-timeline--${transition}${stacked ? ' seller-timeline--stacked' : ''}${handlers.trackerOnly ? ' seller-timeline--tracker-only' : ''}`}>
      {stacked
        ? <StackedTimeline data={data} currentId={current.id} titleId={titleId} onOpenStep={(step, milestone) => openStepOverride ? openStepOverride(step, milestone) : setOpenStep({ step, milestone })} {...handlers} />
        : <TrackerTimeline data={data} currentId={current.id} titleId={titleId} onOpenStep={(step, milestone) => openStepOverride ? openStepOverride(step, milestone) : setOpenStep({ step, milestone })} {...handlers} />}
      <StepModal item={openStep} today={data.today} onClose={() => setOpenStep(null)} {...handlers} />
    </Box>
    </CardModeContext.Provider>
    </ChecksContext.Provider>
  )
}

type OpenStep = (step: SellerTimelineStep, milestone: SellerMilestone) => void

function daysBetween(from: string, to: string) {
  return Math.round((new Date(`${to}T12:00:00Z`).getTime() - new Date(`${from}T12:00:00Z`).getTime()) / 86400000)
}

/** Eyebrow, plus a countdown headline that only the card layout shows. */
function TimelineHeading({ titleId, data, action }: { titleId: string; data: SellerTimelineData; action?: ReactNode }) {
  const days = data.countdown ? daysBetween(data.today, data.countdown.date) : null
  const eyebrow = <Eyebrow component="h2" id={titleId} className="seller-timeline-eyebrow">Transaction timeline</Eyebrow>
  return (
    <Box className="seller-timeline-heading">
      {action
        ? <Box className="seller-timeline-heading-row">{eyebrow}<Box component="span" className="seller-timeline-heading-sep" aria-hidden="true">·</Box>{action}</Box>
        : eyebrow}
      {data.countdown && days !== null && (
        <Typography component="p" variant="titleL" className="seller-timeline-countdown">
          {days === 0 ? `Today: ${data.countdown.label}` : `${days} ${days === 1 ? 'day' : 'days'} until ${data.countdown.label}`}
        </Typography>
      )}
    </Box>
  )
}

/* ---------- Desktop: full-bleed tracker + milestone list ---------- */

function TrackerTimeline({ data, currentId, titleId, onOpenStep, ...handlers }: Handlers & { data: SellerTimelineData; currentId: MilestoneId; titleId: string; onOpenStep: OpenStep }) {
  const [selectedId, setSelectedId] = useState<MilestoneId>(currentId)
  const [prevCurrent, setPrevCurrent] = useState(currentId)
  const initialIndex = Math.max(0, data.milestones.findIndex((milestone) => milestone.id === currentId))
  /** Where the selection visually rests. Trails selectedId while the glint travels. */
  const [arrivedIndex, setArrivedIndex] = useState(initialIndex)
  const [glint, setGlint] = useState<{ from: number; to: number; key: number } | null>(null)
  /** Collapsed shows only the tracker; picking a milestone opens it again. */
  const [collapsed, setCollapsed] = useState(false)
  const cardMode = useContext(CardModeContext)
  const glintTimer = useRef<number | undefined>(undefined)
  const glintCount = useRef(0)
  if (prevCurrent !== currentId) {
    setPrevCurrent(currentId)
    setSelectedId(currentId)
    setArrivedIndex(initialIndex)
    setGlint(null)
  }
  useEffect(() => () => window.clearTimeout(glintTimer.current), [])
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const baseId = useId()
  const milestones = data.milestones
  const selectedIndex = Math.max(0, milestones.findIndex((milestone) => milestone.id === selectedId))
  const selected = milestones[selectedIndex]
  const currentIndex = milestones.findIndex((milestone) => milestone.id === currentId)
  const current = milestones[currentIndex]
  const { isDone } = useContext(ChecksContext)
  const fraction = current.steps.length ? completedCount(current, isDone) / current.steps.length : 0
  const progress = Math.min(1, (currentIndex + fraction) / (milestones.length - 1))

  function select(index: number) {
    setSelectedId(milestones[index].id)
    handlers.onSelectMilestone?.(milestones[index].id)
    setCollapsed(false)
    window.clearTimeout(glintTimer.current)
    const from = glint ? glint.to : arrivedIndex
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    if (index === from || reduceMotion) {
      setGlint(null)
      setArrivedIndex(index)
      return
    }
    const duration = glintDuration(from, index)
    setArrivedIndex(-1)
    glintCount.current += 1
    setGlint({ from, to: index, key: glintCount.current })
    glintTimer.current = window.setTimeout(() => {
      setGlint(null)
      setArrivedIndex(index)
    }, duration)
  }

  function focusTab(index: number) {
    const next = (index + milestones.length) % milestones.length
    select(next)
    tabRefs.current[next]?.focus()
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowRight') { event.preventDefault(); focusTab(selectedIndex + 1) }
    if (event.key === 'ArrowLeft') { event.preventDefault(); focusTab(selectedIndex - 1) }
    if (event.key === 'Home') { event.preventDefault(); focusTab(0) }
    if (event.key === 'End') { event.preventDefault(); focusTab(milestones.length - 1) }
  }

  const trackerStyle = { '--timeline-columns': milestones.length, '--timeline-progress': progress } as CSSProperties

  return (
    <>
      <Box className="timeline-stage">
        <TimelineHeading titleId={titleId} data={data} action={handlers.headingAction} />
        <Box role="tablist" aria-label="Sale milestones" className="timeline-tracker" onKeyDown={onKeyDown} style={trackerStyle}>
          <Box className="timeline-rail" aria-hidden="true" />
          <Box className="timeline-rail-fill" aria-hidden="true" />
          {glint && (
            <Box
              key={glint.key}
              className="timeline-glint"
              aria-hidden="true"
              style={{ '--glint-from': glint.from, '--glint-to': glint.to, '--glint-duration': `${glintDuration(glint.from, glint.to)}ms` } as CSSProperties}
            />
          )}
          {arrivedIndex >= 0 && <Box key={`bloom-${arrivedIndex}`} className="timeline-spotlight" aria-hidden="true" style={{ '--timeline-selected': arrivedIndex } as CSSProperties} />}
          {milestones.map((milestone, index) => {
            const isSelected = milestone.id === selectedId
            return (
              <ButtonBase
                key={milestone.id}
                ref={(node: HTMLButtonElement | null) => { tabRefs.current[index] = node }}
                role="tab"
                id={`${baseId}-tab-${milestone.id}`}
                aria-controls={handlers.trackerOnly ? undefined : `${baseId}-panel`}
                aria-selected={isSelected}
                aria-description={statusCopy[milestone.status]}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => select(index)}
                className={`timeline-node timeline-node--${milestone.status}${isSelected ? ' is-selected' : ''}${index === arrivedIndex ? ' is-arrived' : ''}`}
                disableRipple
              >
                <Box component="span" className="timeline-now" aria-hidden={milestone.status !== 'current'}>{milestone.status === 'current' ? (handlers.currentLabel ?? 'Now') : ''}</Box>
                <MilestoneMarker status={milestone.status} index={index} />
                <Typography variant="labelM" component="span" className="timeline-node-label">{milestone.label}</Typography>
                <Typography variant="labelS" component="span" className="timeline-node-caption">{nodeCaption(milestone, isDone)}</Typography>
              </ButtonBase>
            )
          })}
        </Box>
      </Box>

      {!handlers.trackerOnly && <>
      <Box id={`${baseId}-panel-shell`} className={`timeline-panel-shell${collapsed ? ' is-collapsed' : ''}`} inert={collapsed}>
        <Box className="timeline-panel-clip">
          <Box role="tabpanel" id={`${baseId}-panel`} aria-labelledby={`${baseId}-tab-${selected.id}`} className="timeline-panel" key={selected.id}>
            <MilestoneItems milestone={selected} previous={milestones[selectedIndex - 1]} nextStepId={data.nextStepId} onOpenStep={onOpenStep} {...handlers} />
          </Box>
        </Box>
      </Box>
      {!cardMode && <ButtonBase
        className={`timeline-collapse${collapsed ? ' is-collapsed' : ''}`}
        onClick={() => setCollapsed(!collapsed)}
        aria-expanded={!collapsed}
        aria-controls={`${baseId}-panel-shell`}
        disableRipple
      >
        <Typography variant="labelM" component="span">{collapsed ? 'Show details' : 'Hide details'}</Typography>
        <ExpandMoreRounded className="timeline-chevron" aria-hidden="true" />
      </ButtonBase>}
      </>}
    </>
  )
}

/** Glint travel time grows gently with distance. */
function glintDuration(from: number, to: number) {
  return 200 + Math.abs(to - from) * 90
}

/* ---------- Mobile: vertical rail ---------- */

function StackedTimeline({ data, currentId, titleId, onOpenStep, ...handlers }: Handlers & { data: SellerTimelineData; currentId: MilestoneId; titleId: string; onOpenStep: OpenStep }) {
  const [openId, setOpenId] = useState<MilestoneId | null>(currentId)
  const baseId = useId()

  return (
    <>
      <Box className="timeline-stage">
        <TimelineHeading titleId={titleId} data={data} action={handlers.headingAction} />
      </Box>
      <Box component="ol" className="timeline-stack">
        {data.milestones.map((milestone, index) => {
          const open = openId === milestone.id
          return (
            <Box component="li" key={milestone.id} className={`timeline-stack-item timeline-stack-item--${milestone.status}${open ? ' is-open' : ''}`}>
              <ButtonBase
                className="timeline-stack-header"
                aria-expanded={handlers.trackerOnly ? undefined : open}
                aria-pressed={handlers.trackerOnly ? open : undefined}
                aria-controls={handlers.trackerOnly ? undefined : `${baseId}-${milestone.id}`}
                onClick={() => {
                  if (handlers.trackerOnly) { setOpenId(milestone.id); handlers.onSelectMilestone?.(milestone.id); return }
                  setOpenId(open ? null : milestone.id)
                }}
                disableRipple
              >
                <MilestoneMarker status={milestone.status} index={index} />
                <Box component="span" className="timeline-stack-heading">
                  <Typography variant="titleXS" component="span">{milestone.label}</Typography>
                  {milestone.status === 'current' && <Box component="span" className="timeline-now timeline-now--inline">{handlers.currentLabel ?? 'Now'}</Box>}
                </Box>
                <ExpandMoreRounded className="timeline-chevron" aria-hidden="true" />
              </ButtonBase>
              {open && !handlers.trackerOnly && (
                <Box id={`${baseId}-${milestone.id}`} className="timeline-stack-body">
                  <MilestoneItems milestone={milestone} previous={data.milestones[index - 1]} nextStepId={data.nextStepId} onOpenStep={onOpenStep} {...handlers} />
                </Box>
              )}
            </Box>
          )
        })}
      </Box>
    </>
  )
}

function MilestoneMarker({ status, index }: { status: TimelineStatus; index: number }) {
  return (
    <Box component="span" className={`timeline-marker timeline-marker--${status}`} aria-hidden="true">
      {status === 'complete' ? <CheckRounded /> : status === 'current' ? <Box component="span" className="timeline-marker-dot" /> : <Box component="span" className="timeline-marker-number">{index + 1}</Box>}
    </Box>
  )
}

/* ---------- Milestone items: one list for actions, dates, documents, and resources ---------- */

function byDate(a: SellerTimelineStep, b: SellerTimelineStep) {
  if (a.date && b.date) return a.date.localeCompare(b.date)
  return a.date ? -1 : b.date ? 1 : 0
}

function MilestoneItems({ milestone, previous, nextStepId, onOpenStep, resources, documents, team, onOpenResource, onOpenMarketing, resourcesAsDocuments, stageInTitles, openHouses = [], onOpenOpenHouse }: Handlers & { milestone: SellerMilestone; previous?: SellerMilestone; nextStepId: string; onOpenStep: OpenStep }) {
  const locked = milestone.status === 'upcoming'
  const linkedResourceIds = new Set(milestone.steps.map((step) => step.resourceId).filter(Boolean))
  const standaloneGuides = milestone.resourceIds
    .filter((id) => !linkedResourceIds.has(id))
    .map((id) => resources.find((resource) => resource.id === id))
    .filter((resource): resource is TransactionResource => Boolean(resource))
  const showMarketing = Boolean(onOpenMarketing && milestone.steps.some((step) => step.opensMarketing))
  const { isDone } = useContext(ChecksContext)
  const openSteps = milestone.steps.filter((step) => !isDone(step)).sort(byDate)
  const doneSteps = milestone.steps.filter(isDone).sort(byDate)
  // Collapsed by default when there is still something to do; open when everything is done.
  const [doneOpen, setDoneOpen] = useState(openSteps.length === 0)
  const doneListId = useId()
  const cardMode = useContext(CardModeContext)
  // Card label for the open list: the current stage's items are upcoming, earlier stages' leftovers are open, future stages are coming up.
  const groupLabel = milestone.status === 'current' ? 'Upcoming' : milestone.status === 'complete' ? 'Open' : 'Coming up'
  const lockedNote = (
    <Box className="milestone-locked-note">
      <LockOutlined aria-hidden="true" />
      <Typography variant="bodySStandard">Opens after {previous ? previous.label.toLowerCase() : 'earlier steps'}. Feel free to review resources any time.</Typography>
    </Box>
  )

  const stepRow = (step: SellerTimelineStep) => (
    <StepRow key={step.id} step={step} locked={locked} next={step.id === nextStepId && !isDone(step)} resources={resources} team={team} onOpen={() => onOpenStep(step, milestone)} onOpenResource={onOpenResource} calendar={!cardMode} />
  )

  if (!cardMode) {
    // Exploration page: dates and action items lead on the left; documents and guides sit in a lighter column on the right.
    const isDoc = (step: SellerTimelineStep) => stepKind(step) === 'document'
    // Open houses sort in with the stage's dates. Scheduled ones are open; finished ones are done.
    const stageOpenHouses = openHouses.filter((openHouse) => openHouse.milestoneId === milestone.id)
    type DatedRow = { date?: string; node: ReactNode }
    const openHouseRow = (openHouse: OpenHouse): DatedRow => ({
      date: openHouse.date,
      node: <OpenHouseRow key={openHouse.id} openHouse={openHouse} team={team} calendar onOpen={() => onOpenOpenHouse?.(openHouse)} />,
    })
    const datedRows = (steps: SellerTimelineStep[], houses: OpenHouse[]) => [
      ...steps.map((step): DatedRow => ({ date: step.date, node: stepRow(step) })),
      ...houses.map(openHouseRow),
    ].sort((a, b) => (a.date && b.date ? a.date.localeCompare(b.date) : a.date ? -1 : b.date ? 1 : 0)).map((row) => row.node)
    const leftOpen = datedRows(openSteps.filter((step) => !isDoc(step)), stageOpenHouses.filter((openHouse) => !isOpenHouseDone(openHouse)))
    const leftDone = datedRows(doneSteps.filter((step) => !isDoc(step)), stageOpenHouses.filter(isOpenHouseDone))
    const docSteps = [...openSteps.filter(isDoc), ...doneSteps.filter(isDoc)]
    const docCount = docSteps.length + standaloneGuides.length + (showMarketing ? 1 : 0)
    // Finished stage: show what happened right away, with no toggle.
    const allDone = leftOpen.length === 0 && leftDone.length > 0
    const stagePrefix = stageInTitles ? <><Box component="span" className="milestone-split-stage">{milestone.label}</Box><Box component="span" aria-hidden="true" className="milestone-split-sep">·</Box></> : null
    return (
      <Box className="milestone-split">
        <Box component="section" className="milestone-split-main" aria-label="Dates and action items">
          <Typography component="h3" variant="labelS" className="milestone-split-title">{stagePrefix}Dates & action items <Box component="span" className="milestone-done-count">{allDone ? leftDone.length : leftOpen.length}</Box></Typography>
          {locked && lockedNote}
          {leftOpen.length > 0 && <Box component="ul" className="timeline-item-list" aria-label={locked ? `${milestone.label} items` : 'To do'}>{leftOpen}</Box>}
          {allDone && <Box component="ul" className="timeline-item-list" aria-label="Done">{leftDone}</Box>}
          {leftOpen.length === 0 && leftDone.length === 0 && <Typography variant="bodySStandard" color="text.secondary" className="milestone-split-empty">Nothing scheduled for this stage yet.</Typography>}
          {leftDone.length > 0 && !allDone && (
            <Box className="milestone-done milestone-done--split">
              {/* A secondary button, so it can't be mistaken for a section label. */}
              <Button
                variant="outlined"
                size="small"
                className={`milestone-done-button${doneOpen ? ' is-open' : ''}`}
                endIcon={<ExpandMoreRounded className="timeline-chevron" />}
                onClick={() => setDoneOpen(!doneOpen)}
                aria-expanded={doneOpen}
                aria-controls={doneListId}
              >
                {doneOpen ? 'Hide done' : `Show done · ${leftDone.length}`}
              </Button>
              {doneOpen && (
                <Box component="ul" id={doneListId} className="timeline-item-list milestone-done-list" aria-label="Done">
                  {leftDone}
                </Box>
              )}
            </Box>
          )}
        </Box>

        <Box component="aside" className="milestone-split-docs" aria-label={`${milestone.label} documents`}>
          <Typography component="h3" variant="labelS" className="milestone-split-title">{stagePrefix}Documents <Box component="span" className="milestone-done-count">{docCount}</Box></Typography>
          {docCount === 0 && <Typography variant="bodySStandard" color="text.secondary" className="milestone-split-empty">No documents for this stage.</Typography>}
          <Box component="ul" className="timeline-doc-list">
            {docSteps.map((step) => {
              const done = isDone(step)
              const docLocked = locked && !step.documentId
              const next = step.id === nextStepId && !done
              const status = documents.find((doc) => doc.id === step.documentId)?.status
              return (
                <DocumentListRow
                  key={step.id}
                  title={step.title}
                  meta={docLocked ? `Shared in ${milestone.label.toLowerCase()}` : done ? 'Done' : status}
                  tag={!done && !locked ? { label: 'File' } : undefined}
                  done={done}
                  locked={docLocked}
                  label={`${step.title}. Document${done ? ', done' : ''}${next ? ', next step' : ''}`}
                  onOpen={() => onOpenStep(step, milestone)}
                />
              )
            })}
            {showMarketing && onOpenMarketing && <DocumentListRow icon={<InsightsOutlined />} title="Listing performance" meta="Live dashboard" onOpen={onOpenMarketing} />}
            {standaloneGuides.map((guide) => resourcesAsDocuments
              ? <DocumentListRow key={guide.id} title={guide.title} tag={{ label: 'Resource' }} label={`Open ${guide.title}`} onOpen={() => onOpenResource(guide)} />
              : <DocumentListRow key={guide.id} icon={<MenuBookOutlined />} title={guide.title} meta={`Guide · ${guide.readingTime}`} label={`Read ${guide.title}`} onOpen={() => onOpenResource(guide)} />)}
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <Box className="milestone-items">

      {cardMode && (openSteps.length > 0 || standaloneGuides.length > 0 || showMarketing) && (
        <Typography component="h3" variant="labelS" className="milestone-group-title milestone-upcoming-title">{groupLabel}</Typography>
      )}
      {cardMode && locked && lockedNote}

      {(openSteps.length > 0 || standaloneGuides.length > 0 || showMarketing) && (
        <Box component="ul" className="timeline-item-list" aria-label={locked ? `${milestone.label} items` : 'To do'}>
          {openSteps.map(stepRow)}
          {showMarketing && onOpenMarketing && (
            <ResourceRow title="Listing performance" summary="Views, showings, and buyer feedback" meta="Live dashboard" onOpen={onOpenMarketing} />
          )}
          {standaloneGuides.map((guide) => (
            <ResourceRow key={guide.id} title={guide.title} summary={guide.summary} meta={guide.readingTime} onOpen={() => onOpenResource(guide)} />
          ))}
        </Box>
      )}

      {cardMode && doneSteps.length > 0 && (
        <>
          {doneOpen && (
            <Box className="milestone-done">
              <Typography component="h3" variant="labelS" className="milestone-group-title">Done</Typography>
              <Box component="ul" id={doneListId} className="timeline-item-list milestone-done-list" aria-label="Done">
                {doneSteps.map(stepRow)}
              </Box>
            </Box>
          )}
          <ButtonBase
            className={`timeline-collapse timeline-done-pill${doneOpen ? '' : ' is-collapsed'}`}
            onClick={() => setDoneOpen(!doneOpen)}
            aria-expanded={doneOpen}
            aria-controls={doneListId}
            disableRipple
          >
            <Typography variant="labelM" component="span">{doneOpen ? 'Hide done' : `Show done · ${doneSteps.length}`}</Typography>
            <ExpandMoreRounded className="timeline-chevron" aria-hidden="true" />
          </ButtonBase>
        </>
      )}

      {!cardMode && doneSteps.length > 0 && (
        <Box className="milestone-done">
          <ButtonBase className={`milestone-done-toggle${doneOpen ? ' is-open' : ''}`} onClick={() => setDoneOpen(!doneOpen)} aria-expanded={doneOpen} aria-controls={doneListId} disableRipple>
            <Typography component="h3" variant="labelS" className="milestone-group-title">Done <Box component="span" className="milestone-done-count">{doneSteps.length}</Box></Typography>
            <ExpandMoreRounded className="timeline-chevron" aria-hidden="true" />
          </ButtonBase>
          {doneOpen && (
            <Box component="ul" id={doneListId} className="timeline-item-list milestone-done-list" aria-label="Done">
              {doneSteps.map(stepRow)}
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}

/** Dates get the date thumbnail. Documents and resources get their icon. Actions use a check circle instead. */
function ItemStamp({ kind, date, done, tbd }: { kind: TimelineItemKind; date?: string; done?: boolean; tbd?: boolean }) {
  if (tbd) return <Box component="span" className="portal-date-stamp timeline-stamp timeline-stamp--tbd"><Typography variant="labelS" component="span">TBD</Typography></Box>
  const showDate = kind === 'date' && date
  return <DateStamp date={showDate ? date : undefined} icon={timelineItemKinds[kind].icon} className={`timeline-stamp${done ? ' is-done' : ''}`} />
}

function StepRow({ step, locked, next, resources, team, onOpen, onOpenResource, calendar = false }: Pick<Handlers, 'resources' | 'team' | 'onOpenResource'> & { step: SellerTimelineStep; locked: boolean; next: boolean; onOpen: () => void; /** Split block: an add-to-calendar button replaces the resource chip. */ calendar?: boolean }) {
  const kind = stepKind(step)
  const { isDone, toggle } = useContext(ChecksContext)
  const done = isDone(step)
  // Show the tick first, then let the item settle into Done.
  const [settling, setSettling] = useState(false)
  const settleTimer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(settleTimer.current), [])
  const checked = done || settling
  const isYou = step.owner === 'you'
  const member = team.find((person) => person.name === step.owner)
  // In the split block the resource lives in the item's detail instead of a chip on the row.
  const resource = calendar ? undefined : resources.find((item) => item.id === step.resourceId)
  const showCalendar = calendar && Boolean(step.date) && !done
  const due = kind === 'action' && step.date ? `${step.dateLabel && !done ? `${step.dateLabel} ` : ''}${formatDate(step.date)}` : null

  function onCheck() {
    if (done) { toggle(step); return }
    setSettling(true)
    settleTimer.current = window.setTimeout(() => { setSettling(false); toggle(step) }, 650)
  }

  return (
    <Box component="li" className={`portal-date-row timeline-item timeline-item--${kind}${resource || showCalendar ? ' portal-date-row--resource' : ''}${done ? ' is-done' : ''}${checked ? ' is-checked' : ''}${next ? ' is-next' : ''}`}>
      {kind === 'action' && (
        <ButtonBase
          className={`timeline-check${checked ? ' is-checked' : ''}`}
          role="checkbox"
          aria-checked={checked}
          aria-label={`${step.title}: mark as ${done ? 'not done' : 'done'}`}
          disabled={locked}
          onClick={onCheck}
          disableRipple
        >
          <CheckRounded aria-hidden="true" />
        </ButtonBase>
      )}
      <ButtonBase className="portal-date-row-main" onClick={onOpen} aria-haspopup="dialog" aria-label={`${step.title}. ${timelineItemKinds[kind].label}${done ? ', done' : ''}${next ? ', next step' : ''}`} disableRipple>
        {kind === 'action' ? <Box component="span" className="timeline-check-slot" aria-hidden="true" /> : <ItemStamp kind={kind} date={step.date} done={done} tbd={!step.date && Boolean(step.estimate) && kind === 'date'} />}
        <DateRowCopy
          className="timeline-item-copy"
          metaClassName="timeline-item-meta"
          title={step.title}
          titleAdornment={next && <Box component="span" className="timeline-next-tag">Next step</Box>}
          description={step.summary}
          meta={<>
            {!isYou && member?.photoUrl && <Avatar src={member.photoUrl} alt="" className="timeline-item-avatar" />}
            {due && <>{due}<Box component="span" aria-hidden="true">·</Box></>}
            {!step.date && step.estimate && <>{`Date TBD · ${step.estimate}`}<Box component="span" aria-hidden="true">·</Box></>}
            {isYou ? 'You' : step.owner}
          </>}
        />
      </ButtonBase>
      {resource && <ResourceChip resources={[resource]} onClick={() => onOpenResource(resource)} />}
      {showCalendar && <AddToCalendarButton title={step.title} date={step.date!} className="timeline-item-calendar" />}
    </Box>
  )
}


function ResourceRow({ title, summary, meta, onOpen }: { title: string; summary: string; meta: string; onOpen: () => void }) {
  return (
    <Box component="li" className="portal-date-row timeline-item timeline-item--resource">
      <ButtonBase className="portal-date-row-main" onClick={onOpen} aria-label={`Read ${title}`} disableRipple>
        <ItemStamp kind="resource" />
        <DateRowCopy className="timeline-item-copy" metaClassName="timeline-item-meta" title={title} description={summary} meta={meta} />
      </ButtonBase>
    </Box>
  )
}

/* ---------- Item detail modal ---------- */

function StepModal({ item, today, onClose, resources, documents, team, onOpenResource, onOpenDocument }: Handlers & { item: { step: SellerTimelineStep; milestone: SellerMilestone } | null; today: string; onClose: () => void }) {
  const checks = useContext(ChecksContext)
  // Keep the last item while the dialog animates closed.
  const [shown, setShown] = useState(item)
  if (item && item !== shown) setShown(item)
  const current = item ?? shown
  if (!current) return null
  const { step, milestone } = current
  const kind = stepKind(step)
  const type = timelineItemKinds[kind]
  const done = checks.isDone(step)
  const locked = milestone.status === 'upcoming'
  // Relative to the prototype's "today", so "In 4 days" matches the timeline.
  const days = step.date ? daysBetween(today, step.date) : null
  const away = done ? 'Done' : days === null ? null : days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : days > 0 ? `In ${days} days` : `${-days} days ago`

  function then(action: () => void) {
    onClose()
    action()
  }

  const actions = kind === 'action' && !locked
    ? <Button variant={done ? 'outlined' : 'contained'} color="primary" startIcon={<CheckRounded />} onClick={() => then(() => checks.toggle(step))}>{done ? 'Mark as not done' : 'Mark as done'}</Button>
    : undefined

  return (
    <PlaceModal open={Boolean(item)} onClose={onClose} title={step.title} size="m" actions={actions} className="timeline-step-modal">
      <Box className="timeline-modal-head">
        <Box className="timeline-modal-when">
          {kind === 'date' && step.date
            ? <DateStamp date={step.date} />
            : <DateStamp icon={type.icon} className="timeline-stamp" />}
        </Box>
        <Box className="timeline-modal-head-copy">
          <Eyebrow component="p">{type.label} · {milestone.label}</Eyebrow>
          <Typography component="p" variant="titleM" className="timeline-modal-title">{step.title}</Typography>
          <Typography variant="bodyMStandard" color="text.secondary">{step.summary}</Typography>
          <Typography variant="labelS" color="text.secondary" className="timeline-modal-meta">
            {kind !== 'document' && <>{whenCopy(step)}<Box component="span" aria-hidden="true">·</Box></>}
            {away && <>{away}<Box component="span" aria-hidden="true">·</Box></>}
            <OwnerLabel owner={step.owner} team={team} />
          </Typography>
        </Box>
      </Box>
      <Box className="timeline-modal-body">
        <StepDetailBody item={{ step, milestone }} hideFacts team={team} documents={documents} resources={resources} onOpenDocument={(doc) => then(() => onOpenDocument(doc))} onOpenResource={(guide) => then(() => onOpenResource(guide))} />
      </Box>
    </PlaceModal>
  )
}

/**
 * The selected stage's detail block on its own (dates & action items, plus a documents column),
 * for pages that place it outside the tracker. Clicking an item calls onOpenStep.
 */
export function MilestoneDetailsBlock({ data, milestoneId, onOpenStep, ...handlers }: Handlers & { data: SellerTimelineData; milestoneId: MilestoneId; onOpenStep: OpenStep }) {
  const [overrides, setOverrides] = useState<Record<string, boolean>>({})
  const checks = useMemo<TimelineChecks>(() => ({
    isDone: (step) => overrides[step.id] ?? defaultIsDone(step),
    toggle: (step) => setOverrides((previous) => ({ ...previous, [step.id]: !(previous[step.id] ?? defaultIsDone(step)) })),
  }), [overrides])
  const index = Math.max(0, data.milestones.findIndex((milestone) => milestone.id === milestoneId))
  const milestone = data.milestones[index]
  return (
    <ChecksContext.Provider value={checks}>
      <Box className="seller-timeline seller-timeline--divider milestone-details-block">
        <MilestoneItems key={milestone.id} milestone={milestone} previous={data.milestones[index - 1]} nextStepId={data.nextStepId} onOpenStep={onOpenStep} {...handlers} />
      </Box>
    </ChecksContext.Provider>
  )
}
