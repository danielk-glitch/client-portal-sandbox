import type { ReactNode } from 'react'
import { Drawer, useMediaQuery } from '@mui/material'
import './place-sheet.css'

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
    <Drawer anchor="bottom" open={open} onClose={onClose} transitionDuration={reducedMotion ? 0 : 240} className={['place-sheet-root', className].filter(Boolean).join(' ')}
      slotProps={{ paper: { className: ['place-sheet-paper', paperClassName].filter(Boolean).join(' '), role: 'dialog', 'aria-modal': true, 'aria-label': label, 'aria-labelledby': labelledBy } }}>
      {children}
    </Drawer>
  )
}
