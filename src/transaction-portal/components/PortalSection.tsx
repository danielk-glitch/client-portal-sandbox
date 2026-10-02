import type { ReactNode } from 'react'
import { Box, Divider, Paper, Typography } from '@mui/material'
import './portal-section.css'

export function PortalSection({ title, subtitle, prominent = false, action, children }: {
  title: string
  subtitle?: string
  prominent?: boolean
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <Paper component="section" variant="outlined" className="portal-section">
      <Box className="portal-section-heading">
        <Box className="portal-section-heading-row">
          <Box>
            <Typography component="h2" variant={prominent ? 'titleS' : 'titleXS'}>{title}</Typography>
            {subtitle && <Typography variant="labelS" color="text.secondary">{subtitle}</Typography>}
          </Box>
          {action}
        </Box>
      </Box>
      <Divider />
      <Box className="portal-section-content">{children}</Box>
    </Paper>
  )
}
