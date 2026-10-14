import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { Avatar, Box, Button, ButtonBase, Typography, useMediaQuery } from '@mui/material'
import CheckRounded from '@mui/icons-material/CheckRounded'
import ExpandMoreRounded from '@mui/icons-material/ExpandMoreRounded'
import LockOutlined from '@mui/icons-material/LockOutlined'
import MenuBookOutlined from '@mui/icons-material/MenuBookOutlined'
import InsertDriveFileOutlined from '@mui/icons-material/InsertDriveFileOutlined'
import InsightsOutlined from '@mui/icons-material/InsightsOutlined'
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded'
import type { TeamMember, TransactionDocument, TransactionResource } from '../transaction-portal/types'
import type { MilestoneId, SellerMilestone, SellerTimelineData, SellerTimelineStep, TimelineStatus } from './sellerTimelineData'
import './seller-timeline.css'

type SellerTimelineProps = {
  data: SellerTimelineData
  resources: TransactionResource[]
  documents: TransactionDocument[]
  team: TeamMember[]
  onOpenResource: (resource: TransactionResource) => void
  onOpenDocument: (document: TransactionDocument) => void
  onOpenMarketing?: () => void
  /** Forces a layout. Used by the component gallery. */
  layout?: 'auto' | 'tracker' | 'stacked'
}

type Handlers = Pick<SellerTimelineProps, 'resources' | 'documents' | 'team' | 'onOpenResource' | 'onOpenDocument' | 'onOpenMarketing'>

const statusCopy: Record<TimelineStatus, string> = { complete: 'Complete', current: 'Current stage', upcoming: 'Upcoming' }

function formatDate(iso: string, options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }) {
  return new Intl.DateTimeFormat('en-US', { ...options, timeZone: 'UTC' }).format(new Date(`${iso}T12:00:00Z`))
}

function completedCount(milestone: SellerMilestone) {
  return milestone.steps.filter((step) => step.status === 'complete').length
}

/** Short date context, revealed on hover and selection. */
function nodeCaption(milestone: SellerMilestone) {
  if (milestone.status === 'complete') return milestone.endDate ? `Done ${formatDate(milestone.endDate)}` : 'Done'
  if (milestone.status === 'current') return `${completedCount(milestone)} of ${milestone.steps.length} done`
  return milestone.startDate ? `From ${formatDate(milestone.startDate)}` : 'Not started'
}

function milestoneDates(milestone: SellerMilestone) {
  if (milestone.status === 'upcoming') return milestone.startDate ? `From ${formatDate(milestone.startDate)}` : ''
  if (milestone.startDate && milestone.endDate) return `${formatDate(milestone.startDate)} – ${formatDate(milestone.endDate)}`
  return ''
}

export function SellerTimeline({ data, layout = 'auto', ...handlers }: SellerTimelineProps) {
  const prefersStacked = useMediaQuery('(max-width: 899.95px)', { noSsr: true })
  const stacked = layout === 'stacked' || (layout === 'auto' && prefersStacked)
  const current = data.milestones.find((milestone) => milestone.status === 'current') ?? data.milestones[0]
  const titleId = useId()

  return (
    <Box component="section" aria-labelledby={titleId} className={`seller-timeline${stacked ? ' seller-timeline--stacked' : ''}`}>
      <Typography component="h2" id={titleId} variant="labelS" className="seller-timeline-eyebrow">Transaction timeline</Typography>
      {stacked
        ? <StackedTimeline data={data} currentId={current.id} {...handlers} />
        : <TrackerTimeline data={data} currentId={current.id} {...handlers} />}
    </Box>
  )
}

/* ---------- Desktop: full-bleed tracker + milestone panel ---------- */

function TrackerTimeline({ data, currentId, ...handlers }: Handlers & { data: SellerTimelineData; currentId: MilestoneId }) {
  const [selectedId, setSelectedId] = useState<MilestoneId>(currentId)
  const [prevCurrent, setPrevCurrent] = useState(currentId)
  const initialIndex = Math.max(0, data.milestones.findIndex((milestone) => milestone.id === currentId))
  /** Where the selection visually rests. Trails selectedId while the glint travels. */
  const [arrivedIndex, setArrivedIndex] = useState(initialIndex)
  const [glint, setGlint] = useState<{ from: number; to: number; key: number } | null>(null)
  const glintTimer = useRef<number | undefined>(undefined)
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
  const fraction = current.steps.length ? completedCount(current) / current.steps.length : 0
  const progress = Math.min(1, (currentIndex + fraction) / (milestones.length - 1))

  function select(index: number) {
    setSelectedId(milestones[index].id)
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
    setGlint({ from, to: index, key: Date.now() })
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
              <Typography variant="labelS" component="span" className="timeline-node-caption">{nodeCaption(milestone)}</Typography>
            </ButtonBase>
          )
        })}
      </Box>

      <Box role="tabpanel" id={`${baseId}-panel`} aria-labelledby={`${baseId}-tab-${selected.id}`} className="timeline-panel" key={selected.id}>
        <MilestoneContent milestone={selected} previous={milestones[selectedIndex - 1]} nextStepId={data.nextStepId} {...handlers} />
      </Box>
    </>
  )
}

/** Glint travel time grows gently with distance. */
function glintDuration(from: number, to: number) {
  return 320 + Math.abs(to - from) * 160
}

/* ---------- Mobile: vertical rail ---------- */

function StackedTimeline({ data, currentId, ...handlers }: Handlers & { data: SellerTimelineData; currentId: MilestoneId }) {
  const [openId, setOpenId] = useState<MilestoneId | null>(currentId)
  const baseId = useId()

  return (
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
                <MilestoneContent milestone={milestone} previous={data.milestones[index - 1]} nextStepId={data.nextStepId} compact {...handlers} />
              </Box>
            )}
          </Box>
        )
      })}
    </Box>
  )
}

function MilestoneMarker({ status, index }: { status: TimelineStatus; index: number }) {
  return (
    <Box component="span" className={`timeline-marker timeline-marker--${status}`} aria-hidden="true">
      {status === 'complete' ? <CheckRounded /> : status === 'current' ? <Box component="span" className="timeline-marker-dot" /> : <Box component="span" className="timeline-marker-number">{index + 1}</Box>}
    </Box>
  )
}

/* ---------- Milestone content ---------- */

function MilestoneContent({ milestone, previous, nextStepId, compact = false, ...handlers }: Handlers & { milestone: SellerMilestone; previous?: SellerMilestone; nextStepId: string; compact?: boolean }) {
  const { resources, onOpenResource, onOpenMarketing } = handlers
  const locked = milestone.status === 'upcoming'
  const guides = milestone.resourceIds.map((id) => resources.find((resource) => resource.id === id)).filter((resource): resource is TransactionResource => Boolean(resource))
  const showMarketing = Boolean(onOpenMarketing && milestone.steps.some((step) => step.opensMarketing))
  const openSteps = milestone.steps.filter((step) => step.status !== 'complete')
  const doneSteps = milestone.steps.filter((step) => step.status === 'complete')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const dates = milestoneDates(milestone)

  const renderStep = (step: SellerTimelineStep) => (
    <StepItem
      key={step.id}
      step={step}
      featured={step.id === nextStepId}
      locked={locked}
      milestoneLabel={milestone.label}
      expanded={expandedId === step.id}
      onToggle={() => setExpandedId(expandedId === step.id ? null : step.id)}
      {...handlers}
    />
  )

  return (
    <Box className={`milestone-content${compact ? ' milestone-content--compact' : ''}`}>
      <Box className="milestone-main">
        {!compact && (
          <Box className="milestone-heading">
            <Typography component="h3" variant="titleS">{milestone.label}</Typography>
            {dates && <Typography variant="labelS" color="text.secondary" className="milestone-dates">{dates}</Typography>}
          </Box>
        )}

        {locked && (
          <Box className="milestone-locked-note">
            <LockOutlined aria-hidden="true" />
            <Typography variant="bodySStandard">Opens after {previous ? previous.label.toLowerCase() : 'earlier steps'}. Guides are ready now.</Typography>
          </Box>
        )}

        {openSteps.length > 0 && (
          <Box component="ul" className="milestone-steps" aria-label={locked ? `${milestone.label} steps` : 'To do'}>
            {openSteps.map(renderStep)}
          </Box>
        )}

        {doneSteps.length > 0 && (
          <Box className="milestone-done">
            {openSteps.length > 0 && <Typography component="h4" variant="labelS" className="milestone-group-title">Done</Typography>}
            <Box component="ul" className="milestone-steps milestone-steps--done" aria-label="Done">
              {doneSteps.map(renderStep)}
            </Box>
          </Box>
        )}
      </Box>

      {(guides.length > 0 || showMarketing) && (
        <Box component="aside" className="milestone-aside" aria-label={`${milestone.label} resources`}>
          <Typography component="h4" variant="labelS" className="milestone-group-title">Resources</Typography>
          <Box component="ul" className="milestone-guide-list">
            {showMarketing && (
              <Box component="li">
                <ButtonBase className="milestone-guide" onClick={onOpenMarketing}>
                  <InsightsOutlined aria-hidden="true" />
                  <Typography variant="labelM" component="span" className="milestone-guide-copy">Listing performance</Typography>
                  <ArrowForwardRounded className="milestone-guide-arrow" aria-hidden="true" />
                </ButtonBase>
              </Box>
            )}
            {guides.map((guide) => (
              <Box component="li" key={guide.id}>
                <ButtonBase className="milestone-guide" onClick={() => onOpenResource(guide)} aria-label={`Read ${guide.title}`}>
                  <MenuBookOutlined aria-hidden="true" />
                  <Typography variant="labelM" component="span" className="milestone-guide-copy">{guide.title}</Typography>
                  <ArrowForwardRounded className="milestone-guide-arrow" aria-hidden="true" />
                </ButtonBase>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  )
}

function StepItem({ step, featured, locked, milestoneLabel, expanded, onToggle, resources, documents, team, onOpenResource, onOpenDocument, onOpenMarketing }: Handlers & {
  step: SellerTimelineStep
  featured: boolean
  locked: boolean
  milestoneLabel: string
  expanded: boolean
  onToggle: () => void
}) {
  const detailId = useId()
  const done = step.status === 'complete'
  const isYou = step.owner === 'you'
  const member = team.find((person) => person.name === step.owner)
  const document = documents.find((item) => item.id === step.documentId)
  const resource = resources.find((item) => item.id === step.resourceId)
  const marketing = step.opensMarketing && onOpenMarketing
  const pendingDocument = !document && locked ? step.pendingDocument : undefined
  const meta = [step.date ? `${step.dateLabel && !done ? `${step.dateLabel} ` : ''}${formatDate(step.date)}` : null, isYou ? 'You' : step.owner].filter(Boolean).join(' · ')

  const actions = (document || pendingDocument || resource || marketing) && (
    <Box className="step-actions">
      {document && (locked
        ? <Box component="span" className="step-action step-action--locked"><LockOutlined aria-hidden="true" />{document.name}</Box>
        : featured
          ? <Button variant="contained" color="primary" size="small" startIcon={<InsertDriveFileOutlined />} onClick={() => onOpenDocument(document)}>Review document</Button>
          : <ButtonBase className="step-action" onClick={() => onOpenDocument(document)}><InsertDriveFileOutlined aria-hidden="true" />{document.name}</ButtonBase>)}
      {pendingDocument && <Box component="span" className="step-action step-action--locked" title={`Shared in ${milestoneLabel.toLowerCase()}`}><LockOutlined aria-hidden="true" />{pendingDocument}</Box>}
      {resource && <ButtonBase className="step-action" onClick={() => onOpenResource(resource)} aria-label={`Read ${resource.title}`}><MenuBookOutlined aria-hidden="true" />{resource.shortTitle ?? resource.title}</ButtonBase>}
      {marketing && <ButtonBase className="step-action" onClick={onOpenMarketing}><InsightsOutlined aria-hidden="true" />Listing performance</ButtonBase>}
    </Box>
  )

  if (featured && !done) {
    return (
      <Box component="li" className="step-item step-item--featured">
        <Box component="span" className="step-check" aria-hidden="true" />
        <Box className="step-body">
          <Typography variant="labelS" className="step-eyebrow">Next step</Typography>
          <Typography variant="titleXS" component="span" className="step-title">{step.title}</Typography>
          <Typography variant="labelS" color="text.secondary" className="step-meta">{meta}</Typography>
          {step.detail && <Typography variant="bodySStandard" color="text.secondary" className="step-detail-copy">{step.detail}</Typography>}
          {actions}
        </Box>
      </Box>
    )
  }

  return (
    <Box component="li" className={`step-item${done ? ' step-item--done' : ''}${expanded ? ' is-expanded' : ''}`}>
      <ButtonBase className="step-row" onClick={onToggle} aria-expanded={expanded} aria-controls={detailId} disableRipple>
        <Box component="span" className={`step-check${done ? ' step-check--done' : ''}`} aria-hidden="true">{done && <CheckRounded />}</Box>
        <Box component="span" className="step-body">
          <Typography variant="titleXS" component="span" className="step-title">{step.title}</Typography>
          <Typography variant="labelS" color="text.secondary" component="span" className="step-meta">
            {!isYou && member?.photoUrl && <Avatar src={member.photoUrl} alt="" className="step-avatar" />}
            {meta}
          </Typography>
        </Box>
        <Box component="span" className="sr-only">{done ? 'Done' : 'Open'}</Box>
        <ExpandMoreRounded className="timeline-chevron" aria-hidden="true" />
      </ButtonBase>
      <Box id={detailId} className="step-detail" hidden={!expanded}>
        <Typography variant="bodySStandard" color="text.secondary">{step.detail ?? step.summary}</Typography>
        {actions}
      </Box>
    </Box>
  )
}
