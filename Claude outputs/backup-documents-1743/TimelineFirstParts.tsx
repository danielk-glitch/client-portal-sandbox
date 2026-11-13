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
import { ActivityEventRow } from '../../transaction-portal/components'
import type { TeamMember, TimelineEvent, TransactionDocument, TransactionResource } from '../../transaction-portal/types'
import type { SellerMilestone, SellerTimelineStep } from '../sellerTimelineData'
import { documentRowTag, documentTagCopy, type DocumentTag } from './taggedDocuments'
import { DocumentListRow } from '../DocumentListRow'
import { detailFor, formatDay, type StepDetail, teamTodoStatusCopy, type TeamTodo, type TeamTodoStatus } from './timelineFirstData'
import './timeline-first.css'

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
export function StepDetailBody({ item, team, documents, resources, onOpenDocument, onOpenResource, hideFacts = false, getDetail = detailFor, tagFor, documentsTitle = 'Documents and resources', introEyebrow, showAfter = true }: DetailHandlers & {
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
            <Typography component="h4" variant="labelS" className="tf-detail-group-title">{introEyebrow}</Typography>
            <Typography variant="bodyMStandard" className="tf-detail-intro">{detail.intro}</Typography>
          </Box>
        )
        : <Typography variant="bodyMStandard" className="tf-detail-intro">{detail.intro}</Typography>}

      {detail.checklist && (
        <Box component="section" className="tf-detail-group">
          <Typography component="h4" variant="labelS" className="tf-detail-group-title">How to prepare</Typography>
          <Box component="ul" className="tf-checklist">
            {detail.checklist.map((point) => (
              <Box component="li" key={point}><CheckRounded aria-hidden="true" /><Typography variant="bodySStandard">{point}</Typography></Box>
            ))}
          </Box>
        </Box>
      )}

      {(docs.length > 0 || (locked && step.pendingDocument) || guides.length > 0 || (detail.links?.length ?? 0) > 0) && (
        <Box component="section" className="tf-detail-group">
          <Typography component="h4" variant="labelS" className="tf-detail-group-title">{documentsTitle}</Typography>
          <Box component="ul" className="tf-attachments">
            {docs.map((doc) => {
              const tag = tagFor?.(doc)
              // Resources can be read any time. Other documents open with their stage.
              const docLocked = locked && tag !== 'resource'
              return <DocumentListRow key={doc.id} variant="outlined" title={doc.name} tag={docLocked ? undefined : documentRowTag(tag)} meta={docLocked ? `Shared in ${milestone.label.toLowerCase()}` : tag === 'resource' ? undefined : doc.status} locked={docLocked} onOpen={docLocked ? undefined : () => onOpenDocument(doc)} />
            })}
            {locked && step.pendingDocument && !docs.length && (
              <DocumentListRow variant="outlined" title={step.pendingDocument} meta={`Shared in ${milestone.label.toLowerCase()}`} locked />
            )}
            {guides.map((guide) => (
              <DocumentListRow key={guide.id} variant="outlined" icon={<MenuBookOutlined />} title={guide.title} meta={`Guide · ${guide.readingTime}`} onOpen={() => onOpenResource(guide)} />
            ))}
            {detail.links?.map((link) => (
              <DocumentListRow key={link.label} variant="outlined" icon={<LinkRounded />} title={link.label} meta={link.note ?? 'Link'} href={link.href} />
            ))}
          </Box>
        </Box>
      )}

      {showAfter && detail.after && (
        <Box className="tf-detail-after">
          <Typography component="h4" variant="labelS" className="tf-detail-group-title">What happens next</Typography>
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
  const phone = useMediaQuery('(max-width: 759.95px)', { noSsr: true })
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

const todoOrder: TeamTodoStatus[] = ['in-progress', 'up-next', 'done']

export function TeamTodoList({ todos, team, intro }: { todos: TeamTodo[]; team: TeamMember[]; intro?: string }) {
  return (
    <Box className="tf-todos">
      {intro && <Typography variant="bodySStandard" color="text.secondary" className="tf-todos-intro">{intro}</Typography>}
      {todoOrder.map((status) => {
        const items = todos.filter((todo) => todo.status === status)
        if (!items.length) return null
        return (
          <Box component="section" key={status} className="tf-todo-group">
            <Typography component="h4" variant="labelS" className="tf-detail-group-title">{teamTodoStatusCopy[status]} <Box component="span" className="tf-count">{items.length}</Box></Typography>
            <Box component="ul" className="tf-todo-list">
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
          </Box>
        )
      })}
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
export function SectionTabs({ tabs, initial, label, id }: { tabs: SectionTab[]; initial?: string; label: string; id?: string }) {
  const [active, setActive] = useState(initial ?? tabs[0].id)
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
