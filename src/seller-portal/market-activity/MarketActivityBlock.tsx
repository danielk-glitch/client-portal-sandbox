/**
 * Market activity · how the market around the seller's home has changed since they listed.
 * Horizontal, scroll-snapping property cards support touch, trackpads, keyboard, and arrow controls.
 * Same card as Listing performance: PlaceCard with a PortalSectionHeader. The rail stays inside the card's padding, lined up with the header.
 * - Default: a horizontal rail of nearby homes, most recent change first.
 * - Empty: no changes nearby since listing. Header stays; the rail gives way to one calm line.
 * - Hidden: the team turned the block off (`visibleToClient: false`). Clients see nothing.
 * Variants: `card` stands alone on the dashboard page. `inline` drops the card chrome and leads with an eyebrow, for use
 * inside another surface (the timeline's Active listing stage).

 */
import { useEffect, useId, useRef, useState, type PointerEvent } from 'react'
import { Box, Typography } from '@mui/material'
import { PlaceCard } from '../../components/PlaceCard'
import { Eyebrow } from '../../components/Eyebrow'
import { PortalSectionHeader } from '../../components/PortalSection'
import { CompetingListingCard } from './CompetingListingCard'
import ArrowBackOutlined from '@mui/icons-material/ArrowBackOutlined'
import ArrowForwardOutlined from '@mui/icons-material/ArrowForwardOutlined'
import { PlaceIconButton } from '../../components/PlaceIconButton'
import type { CompetingListing, MarketActivity } from './marketActivityData'
import { ListingDetailsSheet } from '../ListingDetailsSheet'
import { nearbyListingDetails } from './nearbyListingDetails'
import './market-activity.css'

const shortDate = (day: string) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(new Date(`${day}T12:00:00Z`))

export function MarketActivityBlock({ activity, variant = 'card' }: { activity: MarketActivity; variant?: 'card' | 'inline' }) {
  const [selectedListing, setSelectedListing] = useState<CompetingListing | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const titleId = useId()
  const railId = useId()
  const railRef = useRef<HTMLUListElement>(null)
  const [edges, setEdges] = useState({ start: true, end: true })
  // Click and drag to scroll with a mouse. Touch and trackpads already scroll natively.
  const drag = useRef<{ startX: number; startScroll: number; moved: boolean } | null>(null)

  function onRailPointerDown(event: PointerEvent<HTMLUListElement>) {
    const rail = railRef.current
    if (!rail || event.pointerType !== 'mouse' || event.button !== 0) return
    drag.current = { startX: event.clientX, startScroll: rail.scrollLeft, moved: false }
  }

  function onRailPointerMove(event: PointerEvent<HTMLUListElement>) {
    const rail = railRef.current
    const state = drag.current
    if (!rail || !state) return
    const delta = event.clientX - state.startX
    if (!state.moved && Math.abs(delta) < 5) return
    if (!state.moved) {
      state.moved = true
      rail.setPointerCapture(event.pointerId)
      rail.classList.add('is-dragging')
    }
    rail.scrollLeft = state.startScroll - delta
  }

  function endRailDrag() {
    const rail = railRef.current
    if (!rail || !drag.current) return
    const moved = drag.current.moved
    drag.current = null
    // Let the click that follows a drag pass without opening a card, then snap back to the nearest card.
    if (moved) window.setTimeout(() => rail.classList.remove('is-dragging'), 0)
  }

  function updateEdges() {
    const rail = railRef.current
    if (rail) setEdges({ start: rail.scrollLeft <= 1, end: rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 1 })
  }

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return
    updateEdges()
    const observer = new ResizeObserver(updateEdges)
    observer.observe(rail)
    return () => observer.disconnect()
  }, [activity])

  function scrollCards(direction: number, keyboard: boolean) {
    const rail = railRef.current
    if (!rail) return
    const card = rail.firstElementChild as HTMLElement | null
    const step = card ? card.offsetWidth + parseFloat(getComputedStyle(rail).columnGap) : rail.clientWidth
    rail.scrollBy({ left: direction * step, behavior: keyboard || window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }

  if (!activity.visibleToClient) return null

  const listings = activity.listings
    .filter((listing) => listing.changedOn >= activity.listedOn)
    .sort((first, second) => second.changedOn.localeCompare(first.changedOn))
  const radius = `${activity.radiusMiles} ${activity.radiusMiles === 1 ? 'mile' : 'miles'}`

  // The arrows sit in the block's header, right aligned. No controls when there's nothing to scroll.
  const controls = listings.length > 0 ? (
    <Box className="market-activity-controls">
      <PlaceIconButton aria-label="Previous homes" aria-controls={railId} disabled={edges.start} onClick={(event) => scrollCards(-1, event.detail === 0)}><ArrowBackOutlined /></PlaceIconButton>
      <PlaceIconButton aria-label="Next homes" aria-controls={railId} disabled={edges.end} onClick={(event) => scrollCards(1, event.detail === 0)}><ArrowForwardOutlined /></PlaceIconButton>
    </Box>
  ) : undefined

  const subtitle = `Homes within ${radius}, since you listed on ${shortDate(activity.listedOn)}`
  const body = (
    <>
      {listings.length === 0 ? (
        <Typography component="p" variant="bodySStandard" color="text.secondary" className="market-activity-empty">
          No changes nearby since you listed. New listings, price changes, and sales within {radius} will show up here.
        </Typography>
      ) : (
        <>
          <Box className="market-activity-list">
            <Box component="ul" id={railId} ref={railRef} className="market-activity-carousel" aria-label="Nearby homes" tabIndex={0} onScroll={updateEdges}
              data-fade-start={!edges.start || undefined} data-fade-end={!edges.end || undefined}
              onPointerDown={onRailPointerDown} onPointerMove={onRailPointerMove} onPointerUp={endRailDrag} onPointerCancel={endRailDrag}
              onClickCapture={(event) => { if (railRef.current?.classList.contains('is-dragging')) { event.preventDefault(); event.stopPropagation() } }}
              onKeyDown={(event) => {
                if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                  event.preventDefault()
                  scrollCards(event.key === 'ArrowLeft' ? -1 : 1, true)
                }
              }}>
              {listings.map((listing) => <CompetingListingCard key={listing.id} listing={listing} today={activity.today} onOpen={() => {
                setSelectedListing(listing)
                setDetailsOpen(true)
              }} />)}
            </Box>
          </Box>
        </>
      )}
      {selectedListing && <ListingDetailsSheet open={detailsOpen} onClose={() => setDetailsOpen(false)} data={nearbyListingDetails(selectedListing)} />}
    </>
  )

  if (variant === 'inline') {
    return (
      <Box component="section" className="market-activity market-activity--inline" aria-labelledby={titleId}>
        <Box className="market-activity-inline-heading">
          <Box className="market-activity-inline-heading-copy">
            <Eyebrow component="h3" id={titleId}>Market activity</Eyebrow>
            <Typography component="p" variant="bodySStandard" className="market-activity-inline-subtitle">{subtitle}</Typography>
          </Box>
          {controls}
        </Box>
        {body}
      </Box>
    )
  }

  return (
    <PlaceCard component="section" className="market-activity" aria-labelledby={titleId}>
      <PortalSectionHeader title="Market activity" titleId={titleId} subtitle={subtitle} prominent action={controls} />
      {body}
    </PlaceCard>
  )
}
