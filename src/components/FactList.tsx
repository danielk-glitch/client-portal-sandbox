import type { ReactNode } from 'react'
import { Box, Typography } from '@mui/material'
import './fact-list.css'

export type Fact = { label: string; value: ReactNode }

/**
 * Label and value pairs.
 * - grid: label above value, in a two-column grid. For summaries and detail cards.
 * - rows: label left, value right, one pair per line. For long reference lists like listing facts.
 */
export function FactList({ facts, layout = 'grid', columns = layout === 'grid' ? 2 : 1, className }: {
  facts: Fact[]
  layout?: 'grid' | 'rows'
  columns?: 1 | 2
  className?: string
}) {
  const rows = layout === 'rows'
  return (
    <Box component="dl" className={['place-fact-list', `place-fact-list--${layout}`, columns === 2 ? 'place-fact-list--two-column' : '', className].filter(Boolean).join(' ')}>
      {facts.map(({ label, value }) => (
        <Box key={label} className="place-fact">
          <Typography component="dt" variant={rows ? 'bodySStandard' : 'labelS'} className="place-fact-label">{label}</Typography>
          <Typography component="dd" variant={rows ? 'bodySStandard' : 'labelM'} className="place-fact-value">{value}</Typography>
        </Box>
      ))}
    </Box>
  )
}
