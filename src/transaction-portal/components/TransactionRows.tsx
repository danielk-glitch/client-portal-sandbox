import { useState, type ReactNode } from 'react'
import { Avatar, Box, Button, ButtonBase, Chip, IconButton, Stack, Typography } from '@mui/material'
import MenuBookOutlined from '@mui/icons-material/MenuBookOutlined'
import CampaignOutlined from '@mui/icons-material/CampaignOutlined'
import EmailOutlined from '@mui/icons-material/EmailOutlined'
import InsertDriveFileOutlined from '@mui/icons-material/InsertDriveFileOutlined'
import PhoneOutlined from '@mui/icons-material/PhoneOutlined'
import ArrowOutwardRounded from '@mui/icons-material/ArrowOutwardRounded'
import { PlaceTag } from '../../components/PlaceTag'
import type {
  AdvertisingEvent,
  ShowingFeedback,
  TeamMember,
  TransactionDocument,
  TransactionTask,
  TransactionResource,
  UpcomingDate,
} from '../types'
import { PortalIconBadge } from '../../components/PortalIconBadge'
import { MilestoneExplanation } from './MilestoneExplanation'
import { InterestRating } from './FeedbackQuote'
import { formatRowDate } from '../dates'
import './transaction-rows.css'

type Person = Pick<TeamMember, 'name' | 'role' | 'initials' | 'photoUrl'>

export function TransactionRowList({ children }: { children: ReactNode }) {
  return <Box component="ul" className="portal-row-list">{children}</Box>
}

function formatPhone(phone: string) {
  return phone.replace(/^\+1(\d{3})(\d{3})(\d{4})$/, '($1) $2-$3')
}

/**
 * A person: photo, name, and role. With `showContact`, their phone number and email address sit under the role as links,
 * so nobody has to open anything to find them. Pass `actions` instead for the compact call and email buttons.
 */
export function PersonRow({ person, variant = 'team', actions, showContact = false }: {
  person: Person & { phone?: string; email?: string }
  variant?: 'team' | 'viewer'
  actions?: ReactNode
  showContact?: boolean
}) {
  return (
    <Box className={`portal-person-row portal-person-row-${variant}`}>
      <Avatar src={person.photoUrl} alt={person.name} className="portal-person-avatar">
        {person.initials}
      </Avatar>
      <Box className="portal-person-copy">
        {showContact && <Typography variant="labelS" className="portal-person-role portal-person-role--above">{person.role}</Typography>}
        <Typography variant={showContact ? 'bodyMStandard' : 'bodySStandard'} className="portal-person-name">{person.name}</Typography>
        {!showContact && <Typography variant="labelS" color="text.secondary" className="portal-person-role">{person.role}</Typography>}
        {showContact && (person.phone || person.email) && (
          <Box className="portal-person-contact">
            {person.phone && <PersonContactLink label="Phone" value={formatPhone(person.phone)} href={`tel:${person.phone}`} />}
            {person.email && <PersonContactLink label="Email" value={person.email} href={`mailto:${person.email}`} />}
          </Box>
        )}
      </Box>
      {actions}
    </Box>
  )
}

/** One contact: the label sits above the value ("Phone" over "(406) 555-0101"). The whole block is the link, so it is a large tap target on a phone. */
function PersonContactLink({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <ButtonBase component="a" href={href} className="portal-person-contact-link" disableRipple>
      <Typography component="span" variant="labelS" color="text.secondary" className="portal-person-contact-label">{label}</Typography>
      <Typography component="span" variant="bodySStandard" className="portal-person-contact-value">{value}</Typography>
    </ButtonBase>
  )
}

export function PersonContactActions({ person }: { person: Pick<TeamMember, 'name' | 'phone' | 'email'> }) {
  if (!person.phone && !person.email) return null

  return (
    <Box className="portal-person-actions">
      {person.phone && (
        <IconButton component="a" href={`tel:${person.phone}`} aria-label={`Call ${person.name}`} title={`Call ${person.name}`} className="portal-person-action">
          <PhoneOutlined fontSize="small" />
        </IconButton>
      )}
      {person.email && (
        <IconButton component="a" href={`mailto:${person.email}`} aria-label={`Email ${person.name}`} title={`Email ${person.name}`} className="portal-person-action">
          <EmailOutlined fontSize="small" />
        </IconButton>
      )}
    </Box>
  )
}

export function DateEventList({ children }: { children: ReactNode }) {
  return <Box component="ol" className="portal-date-list">{children}</Box>
}

/**
 * The round month/day bubble shared by the client portal and the team workspace. `date` is an ISO day (YYYY-MM-DD).
 * Without a date, pass `icon` to show the same bubble holding an icon (documents, resources).
 */
export function DateStamp({ date, icon, tbd = false, className }: { date?: string; icon?: ReactNode; /** No date yet: the same circle reads "TBD". */ tbd?: boolean; className?: string }) {
  if (tbd) {
    return (
      <Box component="span" className={['portal-date-stamp portal-date-stamp--tbd', className].filter(Boolean).join(' ')}>
        <Typography variant="labelS" component="span">TBD</Typography>
      </Box>
    )
  }
  const classes = ['portal-date-stamp', date ? '' : 'portal-date-stamp--icon', className].filter(Boolean).join(' ')
  if (!date) {
    return (
      <Box component="span" className={classes}>
        <Box component="span" className="portal-date-stamp-icon" aria-hidden="true">{icon}</Box>
      </Box>
    )
  }
  const value = new Date(`${date}T12:00:00Z`)
  const month = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' }).format(value)
  const day = new Intl.DateTimeFormat('en-US', { day: '2-digit', timeZone: 'UTC' }).format(value)
  return (
    <Box component="time" dateTime={date} className={classes}>
      <Typography variant="labelS" component="span">{month}</Typography>
      <Typography variant="metricM" component="span">{day}</Typography>
    </Box>
  )
}

/** A date as text ("Oct 14"), for lists where a round stamp would be too heavy. */
function PlainDate({ date }: { date: string }) {
  const label = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`))
  return <Typography component="time" dateTime={date} variant="titleXS" className="portal-date-text">{label}</Typography>
}

/** Title, summary, and an optional meta line: the text column of date rows and timeline rows. */
export function DateRowCopy({ title, titleAdornment, eyebrow, description, meta, className, metaClassName }: {
  title: ReactNode
  /** Sits beside the title, such as a "Next step" tag. */
  titleAdornment?: ReactNode
  /** A small label above the title, such as "Up next". */
  eyebrow?: ReactNode
  /** Optional: rows with only a date and a title leave it out. */
  description?: ReactNode
  meta?: ReactNode
  className?: string
  metaClassName?: string
}) {
  return (
    <Box component="span" className={['portal-date-copy', className].filter(Boolean).join(' ')}>
      {eyebrow}
      <Box component="span" className="portal-date-title">
        <Typography variant="titleXS" component="span">{title}</Typography>
        {titleAdornment}
      </Box>
      {description && <Typography variant="bodySStandard" color="text.secondary" component="span">{description}</Typography>}
      {meta && <Typography variant="labelS" color="text.secondary" component="span" className={['portal-date-meta', metaClassName].filter(Boolean).join(' ')}>{meta}</Typography>}
    </Box>
  )
}

/**
 * A date in the client's list. Behavior by attached resources:
 * - none: no chip.
 * - one: a "Resource: <short title>" chip opens that resource directly.
 * - two or more: a "<n> resources" chip opens the date's explanation dialog, which lists every resource.
 * The row itself opens the explanation whenever there is guidance or more than one resource.
 */
export function DateEventRow({ date, title, description, children, guidance, resources = [], onReadResource, onEdit, notes, trailing, today, featured = false, plainDate = false, past = false, titleAdornment, eyebrow }: Pick<UpcomingDate, 'date' | 'title' | 'guidance'> & {
  description?: string
  /** Highlights the row, such as the next date coming up. Styling is up to the page. */
  featured?: boolean
  /** Show the date as plain text ("Oct 14") instead of the round stamp. */
  plainDate?: boolean
  /** A date that has already gone by: the date and title are struck through. */
  past?: boolean
  /** Sits beside the title, such as how far away the date is. */
  titleAdornment?: ReactNode
  /** A small label above the title. */
  eyebrow?: ReactNode
  children?: ReactNode
  /** ISO date treated as today. Dates before it don't offer Add to calendar. Without it, every date does. */
  today?: string
  resources?: TransactionResource[]
  onReadResource?: (resource: TransactionResource) => void
  /** Team mode: clicking the row edits the date instead of opening the client explanation. */
  onEdit?: () => void
  /** Team mode: notes shown under the row (never shown to clients). */
  notes?: ReactNode
  /** Team mode: an action at the end of the row, such as Edit. */
  trailing?: ReactNode
}) {
  const [explanationOpen, setExplanationOpen] = useState(false)
  const readable = onReadResource ? resources : []
  const single = readable.length === 1 ? readable[0] : undefined
  const multiple = readable.length > 1
  const hasExplanation = !!guidance || multiple
  const rowIsButton = !!onEdit || hasExplanation
  const content = <>
    {plainDate ? <PlainDate date={date} /> : <DateStamp date={date} />}
    <DateRowCopy title={title} titleAdornment={titleAdornment} eyebrow={eyebrow} description={description} meta={children} />
  </>

  return (
    <Box component="li" className={['portal-date-row', featured ? 'portal-date-row--featured' : '', past ? 'portal-date-row--past' : '', readable.length ? 'portal-date-row--resource' : '', trailing ? 'portal-date-row--trailing' : '', notes ? 'portal-date-row--notes' : ''].filter(Boolean).join(' ')}>
      {rowIsButton ? <ButtonBase className="portal-date-row-main" onClick={() => onEdit ? onEdit() : setExplanationOpen(true)} aria-haspopup="dialog" aria-label={onEdit ? `Edit ${title}` : `About ${title}`} disableRipple>{content}</ButtonBase> : content}
      {single && <ResourceChip resources={[single]} onClick={() => onReadResource!(single)} />}
      {multiple && <ResourceChip resources={readable} subject={title} onClick={() => setExplanationOpen(true)} />}
      {trailing && <Box className="portal-date-trailing">{trailing}</Box>}
      {notes && <Box className="portal-date-notes">{notes}</Box>}
      {hasExplanation && <MilestoneExplanation title={title} date={today && date < today ? undefined : date} guidance={guidance} resources={readable} open={explanationOpen} onClose={() => setExplanationOpen(false)} onReadResource={onReadResource} />}
    </Box>
  )
}

/**
 * The outlined chip on the right of a date or timeline row.
 * One resource reads "Resource: <short title>" and opens it. Several read "<n> resources" and open a list of them.
 */
export function ResourceChip({ resources, subject, onClick }: {
  resources: TransactionResource[]
  /** What the resources belong to, used in the accessible name when there are several. */
  subject?: string
  onClick: () => void
}) {
  const single = resources.length === 1 ? resources[0] : undefined
  return (
    <Chip
      component="button"
      type="button"
      variant="outlined"
      icon={<MenuBookOutlined />}
      label={single ? `Resource: ${single.shortTitle ?? single.title}` : `${resources.length} resources`}
      title={single ? single.title : resources.map(resource => resource.title).join(', ')}
      aria-label={single ? `Read ${single.title}` : `See ${resources.length} resources${subject ? ` for ${subject}` : ''}`}
      aria-haspopup={single ? undefined : 'dialog'}
      onClick={onClick}
      className="portal-date-resource"
    />
  )
}

export function TaskRow({ task }: { task: TransactionTask }) {
  return (
    <Box component="li" className="portal-task-row">
      <Box className="portal-task-heading">
        <Typography variant="titleXS">{task.name}</Typography>
        <PlaceTag className="portal-task-due">{`Due ${task.dueDate}`}</PlaceTag>
      </Box>
      <Typography variant="bodySStandard" color="text.secondary" className="portal-task-description">{task.description}</Typography>
      <Typography variant="labelS" className="portal-task-assignee">Assigned to {task.assignee}</Typography>
    </Box>
  )
}

/**
 * The badge on an advertising row: the linked site's own icon (from Google's favicon service, by hostname only, no referrer sent),
 * or the campaign icon when the row has no link, the link isn't a valid URL, or the icon doesn't load.
 */
function AdvertisingIcon({ url }: { url?: string }) {
  const [failed, setFailed] = useState(false)
  let host = ''
  try { host = url ? new URL(url).hostname : '' } catch { /* not a URL: use the campaign icon */ }
  return (
    <PortalIconBadge>
      {host && !failed
        ? <Box component="img" src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=64`} alt="" referrerPolicy="no-referrer" className="portal-advertising-favicon" onError={() => setFailed(true)} />
        : <CampaignOutlined />}
    </PortalIconBadge>
  )
}

/**
 * One advertising update. With a `url`, the whole row is a link that opens in a new tab,
 * and an up-and-right arrow fades in at the end of the row on hover or keyboard focus.
 */
export function AdvertisingRow({ event, compact = false }: { event: AdvertisingEvent; compact?: boolean }) {
  const [month, day, year] = event.occurredAt.split(' · ')[0].split('/')
  const shortDate = `${month}/${day}/${year.slice(-2)}`
  const content = (
    <>
      <Stack direction={compact ? 'column' : { xs: 'column', sm: 'row' }} sx={{ flex: 1, minWidth: 0, alignItems: compact ? 'flex-start' : { sm: 'center' }, gap: compact ? 0.75 : { xs: 1, sm: 2 } }}>
        {!compact && <AdvertisingIcon url={event.url} />}
        <Box className="portal-advertising-copy">
          <Typography variant={compact ? 'bodySStandard' : 'titleXS'}>{event.action} on <strong>{event.platform}</strong>{event.url && <Box component="span" className="portal-advertising-go" aria-hidden="true"><ArrowOutwardRounded /></Box>}</Typography>
          <Typography variant="labelS" className="portal-advertising-meta">Added by {event.postedBy}{compact && ` · ${shortDate}`}</Typography>
        </Box>
        {!compact && <Typography variant="labelS" className="portal-advertising-date">{formatRowDate(event.occurredAt)}</Typography>}
      </Stack>
    </>
  )
  return (
    <Box component="li" className={['portal-advertising-row', event.url ? 'portal-advertising-row--link' : ''].filter(Boolean).join(' ')}>
      {event.url
        ? <ButtonBase component="a" href={event.url} target="_blank" rel="noreferrer" className="portal-advertising-main" aria-label={`${event.action} on ${event.platform}, opens in a new tab`} disableRipple>{content}</ButtonBase>
        : <Box className="portal-advertising-main">{content}</Box>}
    </Box>
  )
}

/** One showing's feedback, laid out like the other tab rows: title and rating, the quote, then the date as the meta line. */
export function ShowingFeedbackRow({ feedback }: { feedback: ShowingFeedback }) {
  return (
    <Box component="li" className="portal-feedback-row">
      <Box className="portal-feedback-heading">
        <Typography variant="titleXS">{feedback.showingType}</Typography>
        <Box className="portal-feedback-interest"><InterestRating value={feedback.interest} /></Box>
      </Box>
      <Typography variant="bodySStandard" className="portal-feedback-quote">“{feedback.feedback}”</Typography>
      <Typography variant="labelS" className="portal-feedback-date">{formatRowDate(feedback.date)}</Typography>
    </Box>
  )
}

export function DocumentRow({ document, onPreview }: { document: TransactionDocument; onPreview: (document: TransactionDocument) => void }) {
  return (
    <Stack component="li" direction={{ xs: 'column', sm: 'row' }} sx={{ alignItems: { sm: 'center' }, gap: 1.5 }} className="portal-document-row">
      <PortalIconBadge><InsertDriveFileOutlined /></PortalIconBadge>
      <Box className="portal-document-copy">
        <Typography variant="titleXS">{document.name}</Typography>
        <Typography variant="bodySStandard" color="text.secondary">Uploaded {document.uploadedAt}</Typography>
        <Typography variant="labelS" className="portal-document-attribution">Added by {document.postedBy}</Typography>
      </Box>
      <PlaceTag className="portal-document-status">{document.status}</PlaceTag>
      <Button variant="outlined" onClick={() => onPreview(document)} className="portal-document-action">Preview</Button>
    </Stack>
  )
}
