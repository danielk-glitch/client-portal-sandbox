import type { ReactNode } from 'react'
import { Box, Typography } from '@mui/material'
import './stat.css'

/** A number with a short label underneath, such as “2,378 / Unique visitors”. */
export function Stat({ value, label, className }: { value: ReactNode; label: ReactNode; className?: string }) {
  return (
    <Box className={['place-stat', className].filter(Boolean).join(' ')}>
      <Typography variant="metricM" component="p" className="place-stat-value">{value}</Typography>
      <Typography variant="bodySStandard" className="place-stat-label">{label}</Typography>
    </Box>
  )
}

/** The lead number on a card: a label above, a large value, and optional context below. */
export function HeadlineStat({ label, value, context, className }: { label: ReactNode; value: ReactNode; context?: ReactNode; className?: string }) {
  return (
    <Box className={['place-headline-stat', className].filter(Boolean).join(' ')}>
      <Typography variant="labelM" component="p" className="place-headline-stat-label">{label}</Typography>
      <Typography variant="displayL" component="p" className="place-headline-stat-value">{value}</Typography>
      {context && <Typography variant="bodySStandard" className="place-headline-stat-context">{context}</Typography>}
    </Box>
  )
}
