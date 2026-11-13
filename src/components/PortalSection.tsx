import type { ReactNode } from 'react'
import { Box, Divider, Typography } from '@mui/material'
import { PlaceCard } from './PlaceCard'
import './portal-section.css'

type PortalSectionHeaderProps = {
  title: string
  /** Lets the surrounding section point aria-labelledby at the title. */
  titleId?: string
  subtitle?: string
  prominent?: boolean
  action?: ReactNode
}

/** Card heading: title, optional subtitle, an action on the right, and a hairline below. Use inside any card surface. */
export function PortalSectionHeader({ title, titleId, subtitle, prominent = false, action }: PortalSectionHeaderProps) {
  return (
    <>
      <Box className="portal-section-heading">
        <Box className="portal-section-heading-row">
          <Box>
            <Typography component="h2" variant={prominent ? 'titleS' : 'titleXS'} id={titleId}>{title}</Typography>
            {subtitle && <Typography variant="labelS" color="text.secondary">{subtitle}</Typography>}
          </Box>
          {action}
        </Box>
      </Box>
      <Divider className="portal-section-divider" />
    </>
  )
}

export function PortalSection({ children, ...header }: PortalSectionHeaderProps & { children: ReactNode }) {
  return (
    <PlaceCard component="section" className="portal-section">
      <PortalSectionHeader {...header} />
      <Box className="portal-section-content">{children}</Box>
    </PlaceCard>
  )
}
