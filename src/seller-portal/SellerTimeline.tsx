import { createContext, useContext, useEffect, useId, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react'
import { Avatar, Box, Button, ButtonBase, Chip, Typography, useMediaQuery } from '@mui/material'
import CheckRounded from '@mui/icons-material/CheckRounded'
import ExpandMoreRounded from '@mui/icons-material/ExpandMoreRounded'
import LockOutlined from '@mui/icons-material/LockOutlined'
import MenuBookOutlined from '@mui/icons-material/MenuBookOutlined'
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined'
import EventOutlined from '@mui/icons-material/EventOutlined'
import TaskAltOutlined from '@mui/icons-material/TaskAltOutlined'
import { PlaceModal } from '../components/PlaceModal'
import type { TeamMember, TransactionDocument, TransactionResource } from '../transaction-portal/types'
import type { MilestoneId, SellerMilestone, SellerTimelineData, SellerTimelineStep, TimelineItemKind, TimelineStatus } from './sellerTimelineData'
import './seller-timeline.css'

export type TimelineTransition = 'divider' | 'dark'

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
}

type Handlers = Pick<SellerTimelineProps, 'resources' | 'documents' | 'team' | 'onOpenResource' | 'onOpenDocument' | 'onOpenMarketing'>

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

function completedCount(milestone: SellerMilestone, isDone = defaultIsDone) {
  return milestone.steps.filter(isDone).length
}

/** Short date context, revealed on hover and selection. */
function nodeCaption(milestone: SellerMilestone, isDone = defaultIsDone) {
  if (milestone.status === 'complete') return milestone.endDate ? `Done ${formatDate(milestone.endDate)}` : 'Done'
  if (milestone.status === 'current') return `${completedCount(milestone, isDone)} of ${milestone.steps.length} done`
  return milestone.startDate ? `From ${formatDate(milestone.startDate)}` : 'Not started'
}

export function SellerTimeline({ data, layout = 'auto', transition = 'divider', ...handlers }: SellerTimelineProps) {
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
    <Box component="section" aria-labelledby={titleId} className={`seller-timeline seller-timeline--${transition}${stacked ? ' seller-timeline--stacked' : ''}`}>
      {stacked
        ? <StackedTimeline data={data} currentId={current.id} titleId={titleId} onOpenStep={(step, milestone) => setOpenStep({ step, milestone })} {...handlers} />
        : <TrackerTimeline data={data} currentId={current.id} titleId={titleId} onOpenStep={(step, milestone) => setOpenStep({ step, milestone })} {...handlers} />}
      <StepModal item={openStep} onClose={() => setOpenStep(null)} {...handlers} />
    </Box>
    </ChecksContext.Provider>
  )
}

type OpenStep = (step: SellerTimelineStep, milestone: SellerMilestone) => void

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
        <Typography component="h2" id={titleId} variant="labelS" className="seller-timeline-eyebrow">Transaction timeline</Typography>
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
                aria-controls={`${baseId}-panel`}
                aria-selected={isSelected}
                aria-description={statusCopy[milestone.status]}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => select(index)}
                className={`timeline-node timeline-node--${milestone.status}${isSelected ? ' is-selected' : ''}${index === arrivedIndex ? ' is-arrived' : ''}`}
                disableRipple
              >
                <Box component="span" className="timeline-now" aria-hidden={milestone.status !== 'current'}>{milestone.status === 'current' ? 'Now' : ''}</Box>
                <MilestoneMarker status={milestone.status} index={index} />
                <Typography variant="labelM" component="span" className="timeline-node-label">{milestone.label}</Typography>
                <Typography variant="labelS" component="span" className="timeline-node-caption">{nodeCaption(milestone, isDone)}</Typography>
              </ButtonBase>
            )
          })}
        </Box>
        <ButtonBase
          className={`timeline-collapse${collapsed ? ' is-collapsed' : ''}`}
          onClick={() => setCollapsed(!collapsed)}
          aria-expanded={!collapsed}
          aria-controls={`${baseId}-panel-shell`}
          disableRipple
        >
          <Typography variant="labelM" component="span">{collapsed ? 'Show details' : 'Hide details'}</Typography>
          <ExpandMoreRounded className="timeline-chevron" aria-hidden="true" />
        </ButtonBase>
      </Box>

      <Box id={`${baseId}-panel-shell`} className={`timeline-panel-shell${collapsed ? ' is-collapsed' : ''}`} inert={collapsed}>
        <Box className="timeline-panel-clip">
          <Box role="tabpanel" id={`${baseId}-panel`} aria-labelledby={`${baseId}-tab-${selected.id}`} className="timeline-panel" key={selected.id}>
            <MilestoneItems milestone={selected} previous={milestones[selectedIndex - 1]} nextStepId={data.nextStepId} onOpenStep={onOpenStep} {...handlers} />
          </Box>
        </Box>
      </Box>
    </>
  )
}

/** Glint travel time grows gently with distance. */
function glintDuration(from: number, to: number) {
  return 320 + Math.abs(to - from) * 160
}

/* ---------- Mobile: vertical rail ---------- */

function StackedTimeline({ data, currentId, titleId, onOpenStep, ...handlers }: Handlers & { data: SellerTimelineData; currentId: MilestoneId; titleId: string; onOpenStep: OpenStep }) {
  const [openId, setOpenId] = useState<MilestoneId | null>(currentId)
  const baseId = useId()

  return (
    <>
      <Box className="timeline-stage">
        <Typography component="h2" id={titleId} variant="labelS" className="seller-timeline-eyebrow">Transaction timeline</Typography>
      </Box>
      <Box component="ol" className="timeline-stack">
        {data.milestones.map((milestone, index) => {
          const open = openId === milestone.id
          return (
            <Box component="li" key={milestone.id} className={`timeline-stack-item timeline-stack-item--${milestone.status}${open ? ' is-open' : ''}`}>
              <ButtonBase
                className="timeline-stack-header"
                aria-expanded={open}
                aria-controls={`${baseId}-${milestone.id}`}
                onClick={() => setOpenId(open ? null : milestone.id)}
                disableRipple
              >
                <MilestoneMarker status={milestone.status} index={index} />
                <Box component="span" className="timeline-stack-heading">
                  <Typography variant="titleXS" component="span">{milestone.label}</Typography>
                  {milestone.status === 'current' && <Box component="span" className="timeline-now timeline-now--inline">Now</Box>}
                </Box>
                <ExpandMoreRounded className="timeline-chevron" aria-hidden="true" />
              </ButtonBase>
              {open && (
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

function MilestoneItems({ milestone, previous, nextStepId, onOpenStep, resources, team, onOpenResource, onOpenMarketing }: Handlers & { milestone: SellerMilestone; previous?: SellerMilestone; nextStepId: string; onOpenStep: OpenStep }) {
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

  const stepRow = (step: SellerTimelineStep) => (
    <StepRow key={step.id} step={step} locked={locked} next={step.id === nextStepId && !isDone(step)} resources={resources} team={team} onOpen={() => onOpenStep(step, milestone)} onOpenResource={onOpenResource} />
  )

  return (
    <Box className="milestone-items">
      {locked && (
        <Box className="milestone-locked-note">
          <LockOutlined aria-hidden="true" />
          <Typography variant="bodySStandard">Opens after {previous ? previous.label.toLowerCase() : 'earlier steps'}. Guides are ready now.</Typography>
        </Box>
      )}

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

      {doneSteps.length > 0 && (
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
function ItemStamp({ kind, date, done }: { kind: TimelineItemKind; date?: string; done?: boolean }) {
  const type = timelineItemKinds[kind]
  const showDate = kind === 'date' && date
  return (
    <Box component="span" className={`portal-date-stamp timeline-stamp${showDate ? '' : ' timeline-stamp--icon'}${done ? ' is-done' : ''}`}>
      {showDate ? (
        <>
          <Typography variant="labelS" component="span">{formatDate(date, { month: 'short' })}</Typography>
          <Typography variant="metricM" component="span">{formatDate(date, { day: '2-digit' })}</Typography>
        </>
      ) : <Box component="span" className="timeline-stamp-icon" aria-hidden="true">{type.icon}</Box>}
    </Box>
  )
}

function StepRow({ step, locked, next, resources, team, onOpen, onOpenResource }: Pick<Handlers, 'resources' | 'team' | 'onOpenResource'> & { step: SellerTimelineStep; locked: boolean; next: boolean; onOpen: () => void }) {
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
  const resource = resources.find((item) => item.id === step.resourceId)
  const due = kind === 'action' && step.date ? `${step.dateLabel && !done ? `${step.dateLabel} ` : ''}${formatDate(step.date)}` : null

  function onCheck() {
    if (done) { toggle(step); return }
    setSettling(true)
    settleTimer.current = window.setTimeout(() => { setSettling(false); toggle(step) }, 650)
  }

  return (
    <Box component="li" className={`portal-date-row timeline-item timeline-item--${kind}${resource ? ' portal-date-row--resource' : ''}${done ? ' is-done' : ''}${checked ? ' is-checked' : ''}${next ? ' is-next' : ''}`}>
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
        {kind === 'action' ? <Box component="span" className="timeline-check-slot" aria-hidden="true" /> : <ItemStamp kind={kind} date={step.date} done={done} />}
        <Box component="span" className="portal-date-copy timeline-item-copy">
          <Box component="span" className="timeline-item-title">
            <Typography variant="titleXS" component="span">{step.title}</Typography>
            {next && <Box component="span" className="timeline-next-tag">Next step</Box>}
          </Box>
          <Typography variant="bodySStandard" color="text.secondary" component="span">{step.summary}</Typography>
          <Typography variant="labelS" component="span" className="timeline-item-meta">
            {!isYou && member?.photoUrl && <Avatar src={member.photoUrl} alt="" className="timeline-item-avatar" />}
            {due && <>{due}<Box component="span" aria-hidden="true">·</Box></>}
            {isYou ? 'You' : step.owner}
          </Typography>
        </Box>
      </ButtonBase>
      {resource && (
        <Chip
          component="button"
          type="button"
          variant="outlined"
          icon={<MenuBookOutlined />}
          label={`Resource: ${resource.shortTitle ?? resource.title}`}
          title={resource.title}
          aria-label={`Read ${resource.title}`}
          onClick={() => onOpenResource(resource)}
          className="portal-date-resource"
        />
      )}
    </Box>
  )
}

function ResourceRow({ title, summary, meta, onOpen }: { title: string; summary: string; meta: string; onOpen: () => void }) {
  return (
    <Box component="li" className="portal-date-row timeline-item timeline-item--resource">
      <ButtonBase className="portal-date-row-main" onClick={onOpen} aria-label={`Read ${title}`} disableRipple>
        <ItemStamp kind="resource" />
        <Box component="span" className="portal-date-copy timeline-item-copy">
          <Typography variant="titleXS" component="span">{title}</Typography>
          <Typography variant="bodySStandard" color="text.secondary" component="span">{summary}</Typography>
          <Typography variant="labelS" component="span" className="timeline-item-meta">{meta}</Typography>
        </Box>
      </ButtonBase>
    </Box>
  )
}

/* ---------- Item detail modal ---------- */

function StepModal({ item, onClose, resources, documents, team, onOpenResource, onOpenDocument, onOpenMarketing }: Handlers & { item: { step: SellerTimelineStep; milestone: SellerMilestone } | null; onClose: () => void }) {
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
  const isYou = step.owner === 'you'
  const member = team.find((person) => person.name === step.owner)
  const document = documents.find((doc) => doc.id === step.documentId)
  const resource = resources.find((guide) => guide.id === step.resourceId)
  const when = step.date ? `${step.dateLabel && !done ? `${step.dateLabel} ` : ''}${formatDate(step.date, { weekday: 'long', month: 'long', day: 'numeric' })}` : 'Date to be confirmed'

  function then(action: () => void) {
    onClose()
    action()
  }

  const actions = (
    <>
      {resource && <Button variant="outlined" startIcon={<MenuBookOutlined />} onClick={() => then(() => onOpenResource(resource))}>Read the guide</Button>}
      {step.opensMarketing && onOpenMarketing && <Button variant="outlined" onClick={() => then(onOpenMarketing)}>Listing performance</Button>}
      {kind === 'action' && !locked && <Button variant={done ? 'outlined' : 'contained'} color="primary" startIcon={<CheckRounded />} onClick={() => then(() => checks.toggle(step))}>{done ? 'Mark as not done' : 'Mark as done'}</Button>}
      {document && !locked && <Button variant="contained" color="primary" startIcon={<DescriptionOutlined />} onClick={() => then(() => onOpenDocument(document))}>{done ? 'View document' : 'Review document'}</Button>}
    </>
  )

  return (
    <PlaceModal open={Boolean(item)} onClose={onClose} title={step.title} size="s" actions={resource || document || step.opensMarketing || (kind === 'action' && !locked) ? actions : undefined} className="timeline-step-modal">
      <Box className="timeline-modal-body">
        <Box component="dl" className="timeline-modal-facts">
          <Box className="timeline-modal-fact">
            <Typography component="dt" variant="labelS">Type</Typography>
            <Typography component="dd" variant="labelM" className="timeline-modal-type">{type.icon}{type.label}</Typography>
          </Box>
          {kind !== 'document' && (
            <Box className="timeline-modal-fact">
              <Typography component="dt" variant="labelS">When</Typography>
              <Typography component="dd" variant="labelM">{when}</Typography>
            </Box>
          )}
          <Box className="timeline-modal-fact">
            <Typography component="dt" variant="labelS">Who</Typography>
            <Typography component="dd" variant="labelM" className="timeline-modal-owner">
              {!isYou && member?.photoUrl && <Avatar src={member.photoUrl} alt="" className="timeline-item-avatar" />}
              {isYou ? 'You' : step.owner}
            </Typography>
          </Box>
          <Box className="timeline-modal-fact">
            <Typography component="dt" variant="labelS">Status</Typography>
            <Typography component="dd" variant="labelM">{done ? 'Done' : locked ? `Opens in ${milestone.label.toLowerCase()}` : 'Open'}</Typography>
          </Box>
        </Box>
        <Typography variant="bodyMStandard" color="text.secondary">{step.detail ?? step.summary}</Typography>
        {locked && (document || step.pendingDocument) && (
          <Box className="milestone-locked-note">
            <LockOutlined aria-hidden="true" />
            <Typography variant="bodySStandard">{document?.name ?? step.pendingDocument} will be shared in {milestone.label.toLowerCase()}.</Typography>
          </Box>
        )}
      </Box>
    </PlaceModal>
  )
}
