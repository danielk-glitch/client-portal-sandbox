import type { ReactNode } from 'react'
import { Avatar, Box, Button, Chip, IconButton, Rating, Stack, Typography } from '@mui/material'
import CampaignOutlined from '@mui/icons-material/CampaignOutlined'
import EmailOutlined from '@mui/icons-material/EmailOutlined'
import Favorite from '@mui/icons-material/Favorite'
import FavoriteBorder from '@mui/icons-material/FavoriteBorder'
import InsertDriveFileOutlined from '@mui/icons-material/InsertDriveFileOutlined'
import PhoneOutlined from '@mui/icons-material/PhoneOutlined'
import type {
  AdvertisingEvent,
  ShowingFeedback,
  TeamMember,
  TransactionDocument,
  TransactionTask,
  UpcomingDate,
} from '../types'
import { PortalIconBadge } from './PortalIconBadge'
import './transaction-rows.css'

type Person = Pick<TeamMember, 'name' | 'role' | 'initials' | 'photoUrl'>

export function TransactionRowList({ children }: { children: ReactNode }) {
  return <Box component="ul" className="portal-row-list">{children}</Box>
}

export function PersonRow({ person, variant = 'team', actions }: {
  person: Person
  variant?: 'team' | 'viewer'
  actions?: ReactNode
}) {
  return (
    <Box className={`portal-person-row portal-person-row-${variant}`}>
      <Avatar src={person.photoUrl} alt={person.name} className="portal-person-avatar">
        {person.initials}
      </Avatar>
      <Box className="portal-person-copy">
        <Typography variant="bodySStandard" className="portal-person-name">{person.name}</Typography>
        <Typography variant="labelS" color="text.secondary" className="portal-person-role">{person.role}</Typography>
      </Box>
      {actions}
    </Box>
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

export function DateEventRow({ date, title, description, children }: Pick<UpcomingDate, 'date' | 'title' | 'description'> & { children?: ReactNode }) {
  const value = new Date(`${date}T12:00:00Z`)
  const month = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' }).format(value)
  const day = new Intl.DateTimeFormat('en-US', { day: '2-digit', timeZone: 'UTC' }).format(value)

  return (
    <Box component="li" className="portal-date-row">
      <Box component="time" dateTime={date} className="portal-date-stamp">
        <Typography variant="labelS">{month}</Typography>
        <Typography variant="metricM">{day}</Typography>
      </Box>
      <Box className="portal-date-copy">
        <Typography variant="titleXS">{title}</Typography>
        <Typography variant="bodySStandard" color="text.secondary">{description}</Typography>
        {children && <Typography variant="labelS" color="text.secondary" className="portal-date-meta">{children}</Typography>}
      </Box>
    </Box>
  )
}

export function TaskRow({ task }: { task: TransactionTask }) {
  return (
    <Box component="li" className="portal-task-row">
      <Typography variant="titleXS">{task.name}</Typography>
      <Typography variant="bodySStandard" color="text.secondary" className="portal-task-description">{task.description}</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 1.5 }} className="portal-task-meta">
        <Typography variant="labelS" color="text.secondary">Assigned to {task.assignee}</Typography>
        <Chip label={`Due ${task.dueDate}`} size="small" variant="outlined" className="portal-task-due" />
      </Stack>
    </Box>
  )
}

export function AdvertisingRow({ event, compact = false }: { event: AdvertisingEvent; compact?: boolean }) {
  const [month, day, year] = event.occurredAt.split(' · ')[0].split('/')
  const shortDate = `${month}/${day}/${year.slice(-2)}`
  return (
    <Stack component="li" direction={compact ? 'column' : { xs: 'column', sm: 'row' }} sx={{ alignItems: compact ? 'flex-start' : { sm: 'center' }, gap: compact ? 0.75 : { xs: 1, sm: 2 } }} className="portal-advertising-row">
      {!compact && <PortalIconBadge><CampaignOutlined /></PortalIconBadge>}
      <Box className="portal-advertising-copy">
        <Typography variant="bodySStandard">{event.action} on <strong>{event.platform}</strong></Typography>
        <Typography variant="labelS" color="text.secondary">Added by {event.postedBy}{compact && ` · ${shortDate}`}</Typography>
      </Box>
      {!compact && <Typography variant="labelS" color="text.secondary" className="portal-advertising-date">{event.occurredAt}</Typography>}
    </Stack>
  )
}

export function ShowingFeedbackRow({ feedback }: { feedback: ShowingFeedback }) {
  return (
    <Box component="li" className="portal-feedback-row">
      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 1 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Typography variant="labelM" className="portal-tabular-numbers">{feedback.date}</Typography>
          <Typography className="portal-metadata-separator">·</Typography>
          <Typography variant="bodySStandard" color="text.secondary">{feedback.showingType}</Typography>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }} className="portal-feedback-interest">
          <Rating value={feedback.interest} max={5} readOnly size="small" icon={<Favorite fontSize="inherit" />} emptyIcon={<FavoriteBorder fontSize="inherit" />} aria-label={`Interest ${feedback.interest} out of 5`} />
        </Stack>
      </Stack>
      <Typography variant="bodySStandard" className="portal-feedback-quote">“{feedback.feedback}”</Typography>
    </Box>
  )
}

export function DocumentRow({ document, onPreview }: { document: TransactionDocument; onPreview: (document: TransactionDocument) => void }) {
  return (
    <Stack component="li" direction={{ xs: 'column', sm: 'row' }} sx={{ alignItems: { sm: 'center' }, gap: 1.5 }} className="portal-document-row">
      <PortalIconBadge><InsertDriveFileOutlined /></PortalIconBadge>
      <Box className="portal-document-copy">
        <Typography variant="titleXS">{document.name}</Typography>
        <Typography variant="labelS" color="text.secondary">{document.category} · Updated {document.updatedAt} · Added by {document.postedBy}</Typography>
      </Box>
      <Chip label={document.status} size="small" variant="outlined" className="portal-document-status" />
      <Button variant="text" onClick={() => onPreview(document)} className="portal-document-action">Preview</Button>
    </Stack>
  )
}

export function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <Box className="portal-detail-item">
      <Typography variant="labelS" color="text.secondary">{label}</Typography>
      <Typography variant="bodySStandard" className="portal-detail-value">{value}</Typography>
    </Box>
  )
}

export function DetailGrid({ rows }: { rows: Array<{ label: string; value: string }> }) {
  return (
    <Box className="portal-detail-grid">
      {rows.map((row) => <DetailItem key={row.label} label={row.label} value={row.value} />)}
    </Box>
  )
}
