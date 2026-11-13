/**
 * C2 hero options, switchable on the page for review.
 * - CinematicHero (1 + 4): the home photo full width at a practical height, with a one-time slow push-in.
 *   The countdown headline and an "on track" status with the next date sit on the photo, with the same
 *   agent card as the right rail bottom-aligned beside them; the stage tracker sits in a frosted glass bar
 *   along the bottom of the photo, so the home and the timeline read as one object.
 * - PassHero (3): a "transaction pass" card, like a membership card for the sale, over a blurred,
 *   darkened version of the photo. The card tilts gently toward the cursor and catches the light.
 *   Its one action is View listing on the thumbnail. The greeting, days until closing, next step, and the agent
 *   with the brand lockup sit beside it; the dark stage tracker follows below.
 * Both reuse the page's tracker element and keep one primary action: View listing.
 */
import { useRef, type CSSProperties, type PointerEvent, type ReactNode, type Ref } from 'react'
import { Box, Button, ButtonBase, Container, Typography } from '@mui/material'
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded'
import ContentCopyOutlined from '@mui/icons-material/ContentCopyOutlined'
import { toast } from 'sonner'
import { Eyebrow } from '../../components/Eyebrow'
import { AgentBrandCard } from './TimelineFirstParts'
import { PersonContactActions } from '../../transaction-portal/components'
import { AgentIdentity } from '../../components/AgentIdentity'
import { PartnerBrandLockup } from '../../components/PartnerBrandLockup'
import type { SellerTimelineData } from '../sellerTimelineData'
import { idxListingUrl } from '../ListingOverview'
import { currentMilestone, daysBetween, formatDay, pendingTransaction } from './timelineFirstData'
import './c2-heroes.css'

export type HeroVariant = 'cinematic' | 'pass' | 'pass-light' | 'current'
/** Where the agent card lives on the cinematic hero page: in the hero (right side) or in the right rail under Important notes. */
export type AgentPlacement = 'hero' | 'rail'

type HeroProps = {
  transaction: typeof pendingTransaction
  timeline: SellerTimelineData
  tracker: ReactNode
  heroRef: Ref<HTMLElement>
  onOpenListing: () => void
  /** Cinematic only. "rail": the listing buttons take the agent card's spot on the right. */
  agentPlacement?: AgentPlacement
}

function greeting() {
  const hour = new Date().getHours()
  return hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
}

/** Shared numbers and copy for both heroes. */
function heroFacts({ transaction, timeline }: Pick<HeroProps, 'transaction' | 'timeline'>) {
  const { listing } = transaction
  const closing = timeline.countdown?.date ?? '2026-11-06'
  const current = currentMilestone(timeline)
  const next = current.steps.find((step) => step.id === timeline.nextStepId)
  const agent = transaction.team.find((member) => member.id === transaction.teamBrand.leadAgentId)
  const firstName = transaction.viewers[0]?.name.split(' ')[0] ?? 'there'
  const price = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(listing.price)
  return { listing, closing, current, next, agent, firstName, price, daysLeft: daysBetween(timeline.today, closing) }
}

/** "Closing Friday, November 6 · Next up: Review and sign Form 17, Thu, Oct 8". The lead defaults to "On track". */
function StatusLine({ next, className, showTrack = true, lead = 'On track' }: { next?: { title: string; date?: string }; className?: string; showTrack?: boolean; lead?: string }) {
  return (
    <Typography component="p" variant="bodyMStandard" className={['tf-hero-status', className].filter(Boolean).join(' ')}>
      <Box component="span" className="tf-hero-status-dot" aria-hidden="true" />
      {showTrack && <Box component="span" className="tf-hero-status-strong">{lead}</Box>}
      {next && <>
        {showTrack && <Box component="span" aria-hidden="true" className="tf-hero-status-sep">·</Box>}
        <Box component="span">Next up: {next.title}{next.date ? `, ${formatDay(next.date, { weekday: 'short', month: 'short', day: 'numeric' })}` : ''}</Box>
      </>}
    </Typography>
  )
}

/* =========================================================
   1 + 4 · Cinematic concierge
   ========================================================= */

/** The page's top bar is transparent and sits on the photo, so the top of the page feels immersive. */
export function CinematicHero(props: HeroProps) {
  const { transaction, tracker, heroRef, onOpenListing, agentPlacement = 'hero' } = props
  const { listing, closing, agent, daysLeft } = heroFacts(props)
  const agentInHero = agentPlacement === 'hero'

  async function copyListingLink() {
    try {
      await navigator.clipboard.writeText(idxListingUrl)
      toast.success('Listing link copied', { id: 'listing-link' })
    } catch {
      toast.error('Couldn’t copy the link. Please try again.', { id: 'listing-link' })
    }
  }

  const actions = (
    <Box className="tf-hero-cine-actions">
      <Button variant="onImagePrimary" endIcon={<ArrowForwardRounded />} onClick={onOpenListing} className="tf-hero-listing">View listing</Button>
      <Button variant="onImageSecondary" endIcon={<ContentCopyOutlined aria-hidden="true" />} onClick={copyListingLink}>Copy listing link</Button>
    </Box>
  )

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
            <Typography component="h1" variant="displayM" id="tf-c2-title">{daysLeft} {daysLeft === 1 ? 'day' : 'days'} until closing</Typography>
            <StatusLine lead={`Closing ${formatDay(closing, { weekday: 'long', month: 'long', day: 'numeric' })}`} />
            {agentInHero && actions}
          </Box>
          {/* Right side, bottom-aligned with the headline block: the agent card (on the photo, so overlay elevation),
              or, when the agent card lives in the rail, the listing buttons. */}
          {agentInHero
            ? agent && <AgentBrandCard agent={agent} brand={transaction.teamBrand} onPhoto className="tf-hero-cine-agent" />
            : <Box className="tf-hero-cine-side-actions">{actions}</Box>}
        </Box>
      </Container>

      <Box className="tf-hero-cine-bar">
        <Container maxWidth="xl" className="tf-hero-cine-bar-inner">{tracker}</Container>
      </Box>
    </Box>
  )
}

/* =========================================================
   3 · Transaction pass
   ========================================================= */

/** `light`: no frosted glass or blurred photo. White background, copy on the left, plain photo on the right, with the dark tracker below. */
export function PassHero(props: HeroProps & { light?: boolean }) {
  const { transaction, tracker, heroRef, onOpenListing, light = false } = props
  const { listing, closing, next, agent, firstName, daysLeft } = heroFacts(props)
  const cardRef = useRef<HTMLDivElement>(null)

  // Gentle tilt toward the cursor, plus a sheen that follows it. Skipped for reduced motion and touch.
  function onMove(event: PointerEvent<HTMLDivElement>) {
    const card = cardRef.current
    if (!card || event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = card.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    card.style.setProperty('--ry', `${(x - 0.5) * 6}deg`)
    card.style.setProperty('--rx', `${(0.5 - y) * 5}deg`)
    card.style.setProperty('--mx', `${x * 100}%`)
    card.style.setProperty('--my', `${y * 100}%`)
  }
  function onLeave() {
    const card = cardRef.current
    if (!card) return
    card.style.setProperty('--ry', '0deg')
    card.style.setProperty('--rx', '0deg')
  }

  return (
    <Box component="section" ref={heroRef} aria-labelledby="tf-c2-title" className={`tf-c-hero tf-hero-pass${light ? ' tf-hero-pass--light' : ''}`}>
      <Box className="tf-hero-pass-backdrop" aria-hidden="true">
        {listing.photoUrl && <Box component="img" src={listing.photoUrl} alt="" />}
      </Box>

      <Container maxWidth="xl" className="tf-hero-pass-inner">
        <Box className="tf-hero-pass-stage" onPointerMove={onMove} onPointerLeave={onLeave}>
          <Box ref={cardRef} className="tf-pass" style={{ '--rx': '0deg', '--ry': '0deg', '--mx': '50%', '--my': '0%' } as CSSProperties}>
            <ButtonBase className="tf-pass-photo" onClick={onOpenListing} aria-label={`View listing for ${listing.address}`} disableRipple>
              {listing.photoUrl && <Box component="img" src={listing.photoUrl} alt="" />}
              <Box component="span" className="tf-pass-photo-label"><Typography variant="labelM" component="span">View listing</Typography><ArrowForwardRounded aria-hidden="true" /></Box>
            </ButtonBase>

            {!light && (
              <Box className="tf-pass-address">
                <Typography variant="titleM" component="p">{listing.address}</Typography>
                <Typography variant="bodySStandard" component="p">{listing.city}, {listing.state} {listing.postalCode}</Typography>
              </Box>
            )}

            <Box className="tf-pass-sheen" aria-hidden="true" />
          </Box>
        </Box>

        <Box className="tf-hero-pass-copy">
          {!light && <Eyebrow component="p" className="tf-c-eyebrow">{greeting()}, {firstName}</Eyebrow>}
          <Typography component="h1" variant="displayM" id="tf-c2-title">{daysLeft} {daysLeft === 1 ? 'day' : 'days'} until closing</Typography>
          {!light && <StatusLine next={next} showTrack={false} className="tf-hero-status--pass" />}
          <Typography component="p" variant="bodyLStandard" className="tf-c-hero-sub">Closing on {formatDay(closing, { weekday: 'long', month: 'long', day: 'numeric' })}.</Typography>
          {/* Light: the address sits under the closing date, set apart by a divider. */}
          {light && (
            <>
              <Box className="tf-hero-pass-rule" aria-hidden="true" />
              <Box className="tf-pass-address">
                <Typography variant="titleM" component="p">{listing.address}</Typography>
                <Typography variant="bodySStandard" component="p">{listing.city}, {listing.state} {listing.postalCode}</Typography>
              </Box>
            </>
          )}
          {/* Agent and brand sit with the copy, on light glass so the partner logos read in full color. */}
          {agent && (
            <Box className="tf-hero-pass-agent">
              <Box className="tf-pass-agent">
                <AgentIdentity agent={agent} size="l" />
                <PersonContactActions person={agent} />
              </Box>
              <Box className="tf-hero-agent-divider" aria-hidden="true" />
              <Box className="tf-pass-brand"><PartnerBrandLockup brand={transaction.teamBrand} /></Box>
            </Box>
          )}
        </Box>
      </Container>

      <Container maxWidth="xl" className="tf-c2-tracker">{tracker}</Container>
    </Box>
  )
}
