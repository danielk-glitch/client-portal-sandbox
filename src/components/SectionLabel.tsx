import type { ElementType, ReactNode } from 'react'
import { Box, Typography } from '@mui/material'
import './section-label.css'

/**
 * SectionLabel · the small uppercase label that names a list or group ("What's coming up next", "Dates", "In progress").
 * - count: optional. Smaller, muted, and baseline aligned after the label. Include it only when the number changes
 *   what the reader does (see DESIGN.md › Labels and counts). A visible list never needs its own length.
 * - action: optional trailing control on the same line, such as a back link. Right aligned.
 * Card titles use PortalSectionHeader instead; SectionLabel is for groups that sit on the page or inside a list.
 */
export function SectionLabel({ children, count, action, component = 'h3', id, className }: {
  children: ReactNode
  count?: number
  action?: ReactNode
  component?: ElementType
  id?: string
  className?: string
}) {
  return (
    <Box className={['section-label', className].filter(Boolean).join(' ')}>
      <Typography component={component} variant="labelS" id={id} className="section-label-text">
        {children}
        {count !== undefined && <Box component="span" className="section-label-count">{count}</Box>}
      </Typography>
      {action && <Box className="section-label-action">{action}</Box>}
    </Box>
  )
}
