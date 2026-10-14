import { Box, Typography } from '@mui/material'
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined'
import HomeOutlined from '@mui/icons-material/HomeOutlined'
import StickyNote2Outlined from '@mui/icons-material/StickyNote2Outlined'
import TaskAltOutlined from '@mui/icons-material/TaskAltOutlined'
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined'
import type { TimelineEvent } from '../types'
import { PortalIconBadge } from './PortalIconBadge'
import './activity-event-row.css'

const eventIcons = {
  task: <TaskAltOutlined />,
  document: <DescriptionOutlined />,
  listing: <HomeOutlined />,
  showing: <VisibilityOutlined />,
  note: <StickyNote2Outlined />,
}

export function ActivityEventRow({ event, variant = 'standard' }: { event: TimelineEvent; variant?: 'standard' | 'compact' }) {
  const compact = variant === 'compact'
  return (
    <Box component="li" className={`activity-event-row activity-event-row--${variant}`}>
      <PortalIconBadge size={compact ? 's' : 'm'}>{eventIcons[event.type]}</PortalIconBadge>
      <Box className="activity-event-copy">
        <Box className="activity-event-heading">
          <Typography variant="titleXS">{event.title}</Typography>
          {!compact && <Typography variant="labelS" color="text.secondary" className="activity-event-date">{event.occurredAt}</Typography>}
        </Box>
        <Typography variant="bodySStandard" color="text.secondary">{event.description}</Typography>
        {compact ? (
          <Box className="activity-event-meta">
            <Typography variant="labelS" className="activity-event-actor">{event.actor}</Typography>
            <Typography component="span" variant="labelS" color="text.secondary" aria-hidden="true">·</Typography>
            <Typography variant="labelS" color="text.secondary" className="activity-event-date">{event.occurredAt}</Typography>
          </Box>
        ) : <Typography variant="labelS" className="activity-event-actor">{event.actor}</Typography>}
      </Box>
    </Box>
  )
}
