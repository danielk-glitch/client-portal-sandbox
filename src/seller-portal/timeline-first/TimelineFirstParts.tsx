/**
 * Timeline-first explorations · shared pieces.
 * - StepDetailBody: formatted instructions, checklist, documents, guides, and links for one date or milestone item.
 * - StepDetailDrawer: the body in a side drawer (bottom sheet on phones).
 * - SideDrawer: generic right drawer, used for "All updates".
 * - TeamTodoList: what the team is doing for the client, grouped by status.
 * - ActivityFeed: compact recent updates.
 */
import { useState, type ReactNode } from 'react'
import { Avatar, Box, Button, ButtonBase, Drawer, Tab, Tabs, Typography, useMediaQuery } from '@mui/material'
import CheckRounded from '@mui/icons-material/CheckRounded'
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded'
import CloseOutlined from '@mui/icons-material/CloseOutlined'
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined'
import LinkRounded from '@mui/icons-material/LinkRounded'
import MenuBookOutlined from '@mui/icons-material/MenuBookOutlined'
import { Eyebrow } from '../../components/Eyebrow'
import { PlaceIconButton } from '../../components/PlaceIconButton'
import { PlaceCard } from '../../components/PlaceCard'
import { FilterPills } from '../../components/FilterPills'
import { SectionLabel } from '../../components/SectionLabel'
import { ActivityEventRow, PersonContactActions } from '../../transaction-portal/components'
import { AgentIdentity } from '../../components/AgentIdentity'
import { PartnerBrandLockup, type PartnerBrand } from '../../components/PartnerBrandLockup'
import type { TeamMember, TimelineEvent, TransactionDocument, TransactionResource } from '../../transaction-portal/types'
import type { SellerMilestone, SellerTimelineStep } from '../sellerTimelineData'
import { documentRowTag, documentTagCopy, type DocumentTag } from './taggedDocuments'
import { DocumentListRow } from '../DocumentListRow'
import { detailFor, formatDay, type StepDetail, teamTodoStatusCopy, type TeamTodo, type TeamTodoStatus } from './timelineFirstData'
import './timeline-first.css'
import { below } from '../../system-tokens'

export type OpenItem = { step: SellerTimelineStep; milestone: SellerMilestone }

type DetailHandlers = {
  team: TeamMember[]
  documents: TransactionDocument[]
  resources: TransactionResource[]
  onOpenDocument: (document: TransactionDocument) => void
  onOpenResource: (resource: TransactionResource) => void
}

export function whenCopy(step: SellerTimelineStep, long = false) {
  if (!step.date) return step.estimate ? 'Not scheduled yet' : 'Date to be confirmed'
  const day = formatDay(step.date, long ? { weekday: 'long', month: 'long', day: 'numeric' } : { weekday: 'short', month: 'short', day: 'numeric' })
  return step.dateLabel && step.status !== 'complete' ? `${step.dateLabel} ${day}` : day
}

export function OwnerLabel({ owner, team }: { owner: string; team: TeamMember[] }) {
  const member = team.find((person) => person.name === owner)
  return (
    <Box component="span" className="tf-owner">
      {member?.photoUrl && <Avatar src={member.photoUrl} alt="" className="tf-owner-avatar" />}
      {owner === 'you' ? 'You' : owner}
    </Box>
  )
}

/** The formatted detail for one item. Shared by the drawer (A), inline expansion (B), and modal (C). */
export function StepDetailBody({ item, team, documents, resources, onOpenDocument, onOpenResource, hideFacts = false, getDetail = detailFor, tagFor, documentsTitle = 'Documents and resources', introEyebrow, showAfter = true, metaFor, openAnyTime }: DetailHandlers & {
  item: OpenItem
  hideFacts?: boolean
  /** Swap how a step's documents and guides are gathered, e.g. guides folded into documents. */
  getDetail?: (step: SellerTimelineStep) => StepDetail
  /** Optional team-set tag shown beside each document. */
  tagFor?: (document: TransactionDocument) => DocumentTag | undefined
  documentsTitle?: string
  /** Small label above the intro, e.g. "Details". */
  introEyebrow?: string
  /** Show the "What happens next" note. */
  showAfter?: boolean
  /** Swap a document's secondary line, e.g. its file name and linked date. */
  metaFor?: (document: TransactionDocument) => ReactNode
  /** Documents the team has shared open even when their stage hasn't started. */
  openAnyTime?: boolean
}) {
  const { step, milestone } = item
  const detail = getDetail(step)
  const locked = milestone.status === 'upcoming'
  const docs = detail.documentIds?.map((id) => documents.find((doc) => doc.id === id)).filter((doc): doc is TransactionDocument => Boolean(doc)) ?? []
  const guides = detail.resourceIds?.map((id) => resources.find((guide) => guide.id === id)).filter((guide): guide is TransactionResource => Boolean(guide)) ?? []
  const status = step.status === 'complete' ? 'Done' : locked ? `Opens in ${milestone.label.toLowerCase()}` : step.status === 'current' ? 'Needs you now' : 'Coming up'

  return (
    <Box className="tf-detail">
      {!hideFacts && (
        <Box component="dl" className="tf-detail-facts">
          <Box><Typography component="dt" variant="labelS">When</Typography><Typography component="dd" variant="labelM">{whenCopy(step, true)}{!step.date && step.estimate && <Typography component="span" variant="labelS" className="tf-detail-estimate">{step.estimate}</Typography>}</Typography></Box>
          <Box><Typography component="dt" variant="labelS">Who</Typography><Typography component="dd" variant="labelM"><OwnerLabel owner={step.owner} team={team} /></Typography></Box>
          <Box><Typography component="dt" variant="labelS">Stage</Typography><Typography component="dd" variant="labelM">{milestone.label}</Typography></Box>
          <Box><Typography component="dt" variant="labelS">Status</Typography><Typography component="dd" variant="labelM">{status}</Typography></Box>
        </Box>
      )}

      {introEyebrow
        ? (
          <Box component="section" className="tf-detail-group">
            <SectionLabel component="h4">{introEyebrow}</SectionLabel>
            <Typography variant="bodyMStandard" className="tf-detail-intro">{detail.intro}</Typography>
          </Box>
        )
        : <Typography variant="bodyMStandard" className="tf-detail-intro">{detail.intro}</Typography>}

      {detail.checklist && (
        <Box component="section" className="tf-detail-group">
          <SectionLabel component="h4">How to prepare</SectionLabel>
          <Box component="ul" className="tf-checklist">
            {detail.checklist.map((point) => (
              <Box component="li" key={point}><CheckRounded aria-hidden="true" /><Typography variant="bodySStandard">{point}</Typography></Box>
            ))}
          </Box>
        </Box>
      )}

      {(docs.length > 0 || (locked && step.pendingDocument) || guides.length > 0 || (detail.links?.length ?? 0) > 0) && (
        <Box component="section" className="tf-detail-group">
          <SectionLabel component="h4">{documentsTitle}</SectionLabel>
          <Box component="ul" className="tf-attachments">
            {docs.map((doc) => {
              const tag = tagFor?.(doc)
              // Resources can be read any time. Other documents open with their stage.
              const docLocked = locked && tag !== 'resource' && !openAnyTime
              return <DocumentListRow key={doc.id} title={doc.name} tag={docLocked ? undefined : documentRowTag(tag)} meta={docLocked ? `Shared in ${milestone.label.toLowerCase()}` : metaFor ? metaFor(doc) : tag === 'resource' ? undefined : doc.status} locked={docLocked} onOpen={docLocked ? undefined : () => onOpenDocument(doc)} />
            })}
            {locked && step.pendingDocument && !docs.length && (
              <DocumentListRow title={step.pendingDocument} meta={`Shared in ${milestone.label.toLowerCase()}`} locked />
            )}
            {guides.map((guide) => (
              <DocumentListRow key={guide.id} icon={<MenuBookOutlined />} title={guide.title} meta={`Guide · ${guide.readingTime}`} onOpen={() => onOpenResource(guide)} />
            ))}
            {detail.links?.map((link) => (
              <DocumentListRow key={link.label} icon={<LinkRounded />} title={link.label} meta={link.note ?? 'Link'} href={link.href} />
            ))}
          </Box>
        </Box>
      )}

      {showAfter && detail.after && (
        <Box className="tf-detail-after">
          <SectionLabel component="h4">What happens next</SectionLabel>
          <Typography variant="bodySStandard">{detail.after}</Typography>
        </Box>
      )}
    </Box>
  )
}


/** Primary action for an item: review its document, otherwise none. */
function primaryAction(item: OpenItem, documents: TransactionDocument[]) {
  const doc = documents.find((candidate) => candidate.id === item.step.documentId)
  if (!doc || item.milestone.status === 'upcoming' || item.step.status === 'complete') return null
  return doc
}

export function SideDrawer({ open, onClose, title, eyebrow, children, footer, className }: { open: boolean; onClose: () => void; title: string; eyebrow?: string; children: ReactNode; footer?: ReactNode; className?: string }) {
  const phone = useMediaQuery(below('tablet'), { noSsr: true })
  return (
    <Drawer
      anchor={phone ? 'bottom' : 'right'}
      open={open}
      onClose={onClose}
      className="tf-drawer-root"
      slotProps={{ paper: { className: ['tf-drawer', phone ? 'tf-drawer--bottom' : '', className].filter(Boolean).join(' '), role: 'dialog', 'aria-label': title } }}
    >
      <Box className="tf-drawer-header">
        <Box>
          {eyebrow && <Eyebrow component="p">{eyebrow}</Eyebrow>}
          <Typography component="h2" variant="titleM">{title}</Typography>
        </Box>
        <PlaceIconButton onClick={onClose} aria-label="Close"><CloseOutlined /></PlaceIconButton>
      </Box>
      <Box className="tf-drawer-scroll">{children}</Box>
      {footer && <Box className="tf-drawer-footer">{footer}</Box>}
    </Drawer>
  )
}

export function StepDetailDrawer({ item, shown, onClose, leadAgent, ...handlers }: DetailHandlers & { item: OpenItem | null; shown: OpenItem | null; onClose: () => void; leadAgent?: TeamMember }) {
  if (!shown) return null
  const doc = primaryAction(shown, handlers.documents)
  return (
    <SideDrawer
      open={Boolean(item)}
      onClose={onClose}
      eyebrow={shown.milestone.label}
      title={shown.step.title}
      footer={<>
        {leadAgent?.email && <Button variant="outlined" href={`mailto:${leadAgent.email}?subject=${encodeURIComponent(shown.step.title)}`}>Ask {leadAgent.name.split(' ')[0]}</Button>}
        {doc && <Button variant="contained" color="primary" startIcon={<DescriptionOutlined />} onClick={() => { onClose(); handlers.onOpenDocument(doc) }}>Review document</Button>}
      </>}
    >
      <StepDetailBody item={shown} {...handlers} />
    </SideDrawer>
  )
}

/* ---------- Team to-dos ---------- */

const todoFilters: Array<{ value: TeamTodoStatus; label: string }> = [
  { value: 'open', label: teamTodoStatusCopy.open },
  { value: 'done', label: teamTodoStatusCopy.done },
]

/** Team to-dos: an optional intro, Open / Done filter pills (Open by default), then the matching rows. */
export function TeamTodoList({ todos, team, intro }: { todos: TeamTodo[]; team: TeamMember[]; intro?: string }) {
  const [filter, setFilter] = useState<TeamTodoStatus>('open')
  const items = todos.filter((todo) => todo.status === filter)
  return (
    <Box className="tf-todos">
      {intro && <Typography component="p" variant="bodyMStandard" className="tab-panel-intro">{intro}</Typography>}
      <FilterPills label="Filter team to-dos" value={filter} onChange={setFilter} options={todoFilters} />
      {items.length === 0 ? (
        <Typography variant="bodySStandard" color="text.secondary">{filter === 'open' ? 'Nothing open right now. Your team is all caught up.' : 'Nothing finished yet.'}</Typography>
      ) : (
        <Box component="ul" className="tf-todo-list" aria-label={`${teamTodoStatusCopy[filter]} to-dos`}>
          {items.map((todo) => {
            const member = team.find((person) => person.name === todo.owner)
            return (
              <Box component="li" key={todo.id} className={`tf-todo tf-todo--${todo.status}`}>
                <Box component="span" className="tf-todo-mark" aria-hidden="true">{todo.status === 'done' ? <CheckRounded /> : null}</Box>
                <Box className="tf-todo-copy">
                  <Typography variant="titleXS" component="p">{todo.title}</Typography>
                  <Typography variant="bodySStandard" color="text.secondary">{todo.description}</Typography>
                  <Typography variant="labelS" color="text.secondary" className="tf-todo-meta">
                    {member?.photoUrl && <Avatar src={member.photoUrl} alt="" className="tf-owner-avatar" />}
                    {todo.owner}<Box component="span" aria-hidden="true">·</Box>{todo.when}
                  </Typography>
                </Box>
              </Box>
            )
          })}
        </Box>
      )}
    </Box>
  )
}

/* ---------- Activity ---------- */

export function ActivityFeed({ events, unseen = 0 }: { events: TimelineEvent[]; unseen?: number }) {
  return (
    <Box component="ol" className="activity-event-list tf-activity" data-unseen={unseen}>
      {events.map((event) => <ActivityEventRow key={event.id} event={event} variant="compact" />)}
    </Box>
  )
}

/** Small "3 new" pill. */
export function NewBadge({ count }: { count: number }) {
  if (!count) return null
  return <Box component="span" className="tf-new-badge">{count} new</Box>
}

/* ---------- Section tabs ---------- */

export type SectionTab = { id: string; label: string; content: ReactNode }

/** The portal's underline tabs, reused so each direction can name and order its own sections. */
export function SectionTabs({ tabs, initial, label, id, value, onChange }: { tabs: SectionTab[]; initial?: string; label: string; id?: string; value?: string; onChange?: (id: string) => void }) {
  const [localActive, setLocalActive] = useState(initial ?? tabs[0].id)
  // Controlled when a parent passes `value`, so a button elsewhere on the page can switch tabs.
  const active = value ?? localActive
  const setActive = (next: string) => { setLocalActive(next); onChange?.(next) }
  const current = tabs.find((tab) => tab.id === active) ?? tabs[0]
  return (
    <Box id={id} className="transaction-sections tf-sections">
      <Box component="nav" aria-label={label} className="portal-section-nav">
        <Tabs value={current.id} onChange={(_, value: string) => setActive(value)} variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile aria-label={label}>
          {tabs.map((tab) => <Tab key={tab.id} value={tab.id} label={tab.label} id={`tf-tab-${tab.id}`} aria-controls={`tf-panel-${tab.id}`} />)}
        </Tabs>
      </Box>
      <Box role="tabpanel" id={`tf-panel-${current.id}`} aria-labelledby={`tf-tab-${current.id}`} className="portal-panel">{current.content}</Box>
    </Box>
  )
}

/** Compact "3 new updates" button for narrow screens, where the updates rail falls below the timeline. */
export function UpdatesPill({ count, onClick, className }: { count: number; onClick: () => void; className?: string }) {
  return (
    <ButtonBase className={['tf-updates-pill', className].filter(Boolean).join(' ')} onClick={onClick} disableRipple>
      {count > 0 && <Box component="span" className="tf-updates-pill-dot" aria-hidden="true" />}
      <Typography variant="labelM" component="span">{count ? `${count} new updates` : 'Recent activity'}</Typography>
      <ChevronRightRounded aria-hidden="true" />
    </ButtonBase>
  )
}

/** Small label for a document's team-set tag. Both "File" and "Resource" are quiet outlined pills. */
export function DocumentTagPill({ tag }: { tag: DocumentTag }) {
  return <Box component="span" className={`tf-doc-tag tf-doc-tag--${tag}`}>{documentTagCopy[tag]}</Box>
}

/* ---------- Agent card: listing agent with contact actions, partner lockup below ---------- */

/** The listing agent and brand lockup as one card. Used in C2's right rail and the cinematic hero. */
/** The agent and the team and brokerage lockups in one card. On a photo (the hero), pass `onPhoto` for the overlay elevation. */
export function AgentBrandCard({ agent, brand, onPhoto = false, className, label }: { agent: TeamMember; brand: PartnerBrand; onPhoto?: boolean; className?: string; /** Role line above the name. Defaults to "Your listing agent". */ label?: string }) {
  return (
    <PlaceCard component="section" aria-label="Your agent" className={['tf-c2-agent', onPhoto ? 'tf-c2-agent--on-photo' : '', className].filter(Boolean).join(' ')}>
      <Box className="tf-c2-agent-row">
        <AgentIdentity agent={agent} size="l" label={label} />
        <PersonContactActions person={agent} />
      </Box>
      <Box className="tf-c2-brand"><PartnerBrandLockup brand={brand} /></Box>
    </PlaceCard>
  )
}
