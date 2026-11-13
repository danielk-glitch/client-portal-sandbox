import type { ReactNode } from 'react'
import { Box } from '@mui/material'
import './place-tag.css'

/**
 * PlaceTag · a short, non-interactive label on a row, card, or photo ("File", "Price drop", "Published").
 * - tone "quiet" (default): hairline outline on white. Works on photos too, because the fill is opaque.
 * - tone "strong": dark fill. Only for something that needs the reader to act. At most one per view.
 * Tags are 24px tall pills. They never open anything; make the row or card the click target instead.
 */
export function PlaceTag({ children, tone = 'quiet', icon, className }: { children: ReactNode; tone?: 'quiet' | 'strong'; icon?: ReactNode; className?: string }) {
  return (
    <Box component="span" className={['place-tag', `place-tag--${tone}`, className].filter(Boolean).join(' ')}>
      {icon && <Box component="span" className="place-tag-icon" aria-hidden="true">{icon}</Box>}
      {children}
    </Box>
  )
}
