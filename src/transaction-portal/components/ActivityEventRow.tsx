import { Box, Stack, Typography } from '@mui/material'
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

export function ActivityEventRow({ event }: { event: TimelineEvent }) {
  return (
    <Box component="li" className="activity-event-row">
      <PortalIconBadge>{eventIcons[event.type]}</PortalIconBadge>
      <Box className="activity-event-copy">
        <Typography variant="titleXS">{event.title}</Typography>
        <Typography variant="bodySStandard" color="text.secondary">{event.description}</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={0.5} sx={{ justifyContent: 'space-between' }}>
          <Typography variant="labelS" className="activity-event-actor">{event.actor}</Typography>
          <Typography variant="labelS" color="text.secondary" className="activity-event-date">{event.occurredAt}</Typography>
        </Stack>
      </Box>
    </Box>
  )
}
