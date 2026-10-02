import type { ReactNode } from 'react'
import { Box } from '@mui/material'
import './portal-icon-badge.css'

export type PortalIconBadgeSize = 's' | 'm' | 'l'

export function PortalIconBadge({ children, size = 'm', className }: { children: ReactNode; size?: PortalIconBadgeSize; className?: string }) {
  return <Box component="span" className={['portal-icon-badge', `portal-icon-badge--${size}`, className].filter(Boolean).join(' ')} aria-hidden="true">{children}</Box>
}
