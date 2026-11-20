/**
 * Listing marketing · a simplified take on Listing performance, for the stages where the home is on the market.
 * A wide column carries showing feedback as a centered carousel (one quote at a time; arrows on either side, dots below, or swipe); a narrower column
 * lists where the listing was advertised, each row a link. No stats, no chart.
 */
import { useRef, useState } from 'react'
import { Box, ButtonBase, Typography } from '@mui/material'
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded'
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded'
import { PlaceCard } from '../components/PlaceCard'
import { PlaceIconButton } from '../components/PlaceIconButton'
import { PortalSectionHeader } from '../components/PortalSection'
import { AdvertisingRow, FeedbackQuote, TransactionRowList } from '../transaction-portal/components'
import type { AdvertisingEvent, ShowingFeedback } from '../transaction-portal/types'
import './listing-marketing.css'

export function ListingMarketing({ feedback, advertising }: { feedback: ShowingFeedback[]; advertising: AdvertisingEvent[] }) {
  const track = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)

  function go(next: number) {
    const el = track.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollTo({ left: next * el.clientWidth, behavior: reduce ? 'auto' : 'smooth' })
  }

  if (!feedback.length && !advertising.length) return null
  return (
    <PlaceCard component="section" className="listing-marketing" aria-labelledby="listing-marketing-title">
      <PortalSectionHeader title="Listing marketing" titleId="listing-marketing-title" prominent />
      <Box className="listing-marketing-body">
        <Box className="listing-marketing-feedback" role="group" aria-roledescription="carousel" aria-label="Showing feedback">
          <Typography component="h3" variant="titleXS" className="listing-marketing-heading">Showing feedback</Typography>
          <Box className="listing-marketing-stage">
            {feedback.length > 1 && <PlaceIconButton onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous feedback"><ArrowBackRounded /></PlaceIconButton>}
            <Box ref={track} className="listing-marketing-track" aria-live="polite" onScroll={(event) => setIndex(Math.round(event.currentTarget.scrollLeft / event.currentTarget.clientWidth))}>
              {feedback.map((item, position) => (
                <Box key={item.id} className="listing-marketing-slide" role="group" aria-roledescription="slide" aria-label={`${position + 1} of ${feedback.length}`}>
                  <FeedbackQuote feedback={item} size="l" className="listing-marketing-quote" />
                </Box>
              ))}
            </Box>
            {feedback.length > 1 && <PlaceIconButton onClick={() => go(index + 1)} disabled={index === feedback.length - 1} aria-label="Next feedback"><ArrowForwardRounded /></PlaceIconButton>}
          </Box>
          {feedback.length > 1 && (
            <Box className="listing-marketing-dots">
              {feedback.map((item, position) => (
                <ButtonBase key={item.id} className="listing-marketing-dot" onClick={() => go(position)} aria-label={`Show feedback ${position + 1} of ${feedback.length}`} aria-current={position === index} disableRipple />
              ))}
            </Box>
          )}
        </Box>

        <Box className="listing-marketing-advertising">
          <Typography component="h3" variant="titleXS" className="listing-marketing-heading">Advertising</Typography>
          <TransactionRowList>
            {advertising.map((event) => <AdvertisingRow key={event.id} event={event} compact />)}
          </TransactionRowList>
        </Box>
      </Box>
    </PlaceCard>
  )
}
