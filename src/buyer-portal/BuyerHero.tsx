/**
 * Buyer hero · the seller page's immersive cinematic header, retold for buyers.
 * - Headline: days until closing. On closing day, "Closing day". After closing, "Welcome home".
 * - The status line says what's next. After closing, it says when the sale closed.
 * - One action: View home details, on the right side of the photo (as on the seller page with the agent card in the rail).
 *   Directions to closing live in the Closing date's details. The seller's "Copy listing link" doesn't apply to buyers.
 * - The agent card lives in the right rail under Important notes. The frosted stage tracker works as on the seller page.
 */
import type { ReactNode, Ref } from 'react'
import { Box, Button, Container, Typography } from '@mui/material'
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded'
import { Eyebrow } from '../components/Eyebrow'
import type { SellerTimelineData } from '../seller-portal/sellerTimelineData'
import type { SellerTransaction } from '../seller-portal/sellerTransaction'
import { daysBetween, formatDay } from '../seller-portal/timeline-first/timelineFirstData'
import { buyerDeal, findBuyerStep } from './buyerTimelineData'
import '../seller-portal/timeline-first/c2-heroes.css'

export function BuyerHero({ transaction, timeline, tracker, heroRef, onOpenHome }: {
  transaction: SellerTransaction
  timeline: SellerTimelineData
  tracker: ReactNode
  heroRef: Ref<HTMLElement>
  onOpenHome: () => void
}) {
  const { listing } = transaction
  const daysLeft = daysBetween(timeline.today, buyerDeal.closingDate)
  const closed = daysLeft < 0
  const next = timeline.nextStepId ? findBuyerStep(timeline, timeline.nextStepId)?.step : undefined
  const closingDay = formatDay(buyerDeal.closingDate, { weekday: 'long', month: 'long', day: 'numeric' })

  const headline = closed ? 'Welcome home' : daysLeft === 0 ? 'Closing day' : `${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} until closing`

  return (
    <Box component="section" ref={heroRef} aria-labelledby="tf-c2-title" className="tf-hero-cine tf-hero-cine--immersive">
      <Box className="tf-hero-cine-media" aria-hidden="true">
        {listing.photoUrl && <Box component="img" src={listing.photoUrl} alt="" className="tf-hero-cine-photo" />}
        <Box className="tf-hero-cine-scrim" />
      </Box>

      <Container maxWidth="xl" className="tf-hero-cine-inner">
        <Box className="tf-hero-cine-main">
          <Box className="tf-hero-cine-copy">
            <Eyebrow component="p" className="tf-hero-cine-eyebrow">{listing.address} · {listing.city}, {listing.state}</Eyebrow>
            <Typography component="h1" variant="displayM" id="tf-c2-title">{headline}</Typography>
            {(closed || next) && (
              <Typography component="p" variant="bodyMStandard" className="tf-hero-status bp-hero-status">
                <Box component="span" className="tf-hero-status-dot" aria-hidden="true" />
                {closed
                  ? <Box component="span" className="tf-hero-status-strong">Closed {closingDay}</Box>
                  : <Box component="span"><Box component="span" className="tf-hero-status-strong">Next up:</Box> {next!.title}{next!.date ? `, ${formatDay(next!.date, { weekday: 'short', month: 'short', day: 'numeric' })}` : ''}</Box>}
              </Typography>
            )}
          </Box>
          {/* Right side, bottom-aligned with the headline block. */}
          <Box className="tf-hero-cine-side-actions">
            <Box className="tf-hero-cine-actions">
              <Button variant="onImagePrimary" endIcon={<ArrowForwardRounded />} onClick={onOpenHome} className="tf-hero-listing">View home details</Button>
            </Box>
          </Box>
        </Box>
      </Container>

      <Box className="tf-hero-cine-bar">
        <Container maxWidth="xl" className="tf-hero-cine-bar-inner">{tracker}</Container>
      </Box>
    </Box>
  )
}
