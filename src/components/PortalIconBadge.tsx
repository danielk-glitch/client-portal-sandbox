import type { ReactNode } from 'react'
import { Box } from '@mui/material'
import './portal-icon-badge.css'

export type PortalIconBadgeSize = 's' | 'm' | 'l'

/** A round gray badge holding one icon, used to lead list rows and activity items. Decorative: hidden from screen readers.
 * Sizes: s 32px (16px icon), m 44px (20px icon), l 48px (24px icon). */
export function PortalIconBadge({ children, size = 'm', className }: { children: ReactNode; size?: PortalIconBadgeSize; className?: string }) {
  return <Box component="span" className={['portal-icon-badge', `portal-icon-badge--${size}`, className].filter(Boolean).join(' ')} aria-hidden="true">{children}</Box>
}
