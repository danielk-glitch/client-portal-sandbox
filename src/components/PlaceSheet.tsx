import type { ReactNode } from 'react'
import { Drawer, useMediaQuery } from '@mui/material'
import { motionMs } from '../system-tokens'
import './place-sheet.css'

/**
 * PlaceSheet · the bottom sheet for long, focused reading: listing details, a resource guide, the marketing dashboard.
 * Rises from the bottom edge, nearly full height, `--radius-l` top corners and `--elevation-3`. Wrap scrolling content in
 * `.place-sheet-scroll`. Give it a name with `label` or `labelledBy`. For short tasks and confirmations, use PlaceModal.
 */
export function PlaceSheet({ open, onClose, label, labelledBy, className, paperClassName, children }: {
  open: boolean
  onClose: () => void
  label?: string
  labelledBy?: string
  className?: string
  paperClassName?: string
  children: ReactNode
}) {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  return (
    <Drawer anchor="bottom" open={open} onClose={onClose} transitionDuration={reducedMotion ? 0 : motionMs.overlay} className={['place-sheet-root', className].filter(Boolean).join(' ')}
      slotProps={{ paper: { className: ['place-sheet-paper', paperClassName].filter(Boolean).join(' '), role: 'dialog', 'aria-modal': true, 'aria-label': label, 'aria-labelledby': labelledBy } }}>
      {children}
    </Drawer>
  )
}
