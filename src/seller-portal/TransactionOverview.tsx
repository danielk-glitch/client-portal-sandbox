/**
 * Transaction overview · the current seller portal's row under the header (default layout).
 * Sits on the page background between two hairlines: the stage timeline across the full width, then a wide column of dates and a narrower column of notes.
 * The next date inside it is the one elevated card.
 * contained: dates and notes each sit in a card (PlaceCard), like the People block, instead of on the page background (a design-panel option).
 * The page passes each piece in, so this only owns the arrangement. The classic row (dates beside recent activity) is the alternative.
 */
import type { ReactNode } from 'react'
import { Box } from '@mui/material'
import { PlaceCard } from '../components/PlaceCard'
import './transaction-overview.css'

export function TransactionOverview({ timeline, dates, notes, contained = false }: { timeline: ReactNode; dates: ReactNode; notes: ReactNode; contained?: boolean }) {
  return (
    <Box component="section" aria-label="Transaction overview" className={`transaction-overview${contained ? ' transaction-overview--contained' : ''}`}>
      {timeline}
      <Box className="transaction-overview-body">
        {contained ? (
          <>
            <PlaceCard component="div" className="transaction-overview-dates upcoming-dates-card">{dates}</PlaceCard>
            <PlaceCard component="div" className="transaction-overview-notes">{notes}</PlaceCard>
          </>
        ) : (
          <>
            <Box className="transaction-overview-dates upcoming-dates-card">{dates}</Box>
            <Box className="transaction-overview-notes">{notes}</Box>
          </>
        )}
      </Box>
    </Box>
  )
}
