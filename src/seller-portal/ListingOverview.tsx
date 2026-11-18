import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material'
import HomeOutlined from '@mui/icons-material/HomeOutlined'
import ImageOutlined from '@mui/icons-material/ImageOutlined'
import ArrowOutwardOutlined from '@mui/icons-material/ArrowOutwardOutlined'
import ContentCopyOutlined from '@mui/icons-material/ContentCopyOutlined'
import { toast } from 'sonner'
import { Eyebrow } from '../components/Eyebrow'
import { PersonContactActions } from '../transaction-portal/components'
import { AgentIdentity } from '../components/AgentIdentity'
import { PartnerBrandLockup } from '../components/PartnerBrandLockup'
import { ListingPreparation } from './ListingPreparation'
import type { SellerTransaction } from './sellerTransaction'
import './seller-portal.css'

/** light-compact: a shorter light split with no eyebrow. The agent's phone and email sit beside them (the logos are in the top bar), and the photo is only a little taller than the text beside it. */
export type ListingOverviewVariant = 'card' | 'full' | 'light' | 'light-bottom' | 'light-compact' | 'no-listing'

export type HeaderListingLink = 'first-party' | 'idx-mvp'
export const idxListingUrl = 'https://www.josiahubben.com/search/washington/bothell/bothell/17913-38th-dr-unit-20-bid-21-2541015'

type ListingOverviewProps = {
  transaction: SellerTransaction
  onSeeListing: () => void
  variant?: ListingOverviewVariant
  polestarLayout?: boolean
  listingLink?: HeaderListingLink
  /** Shorter header: a smaller photo and no team or brokerage logos. */
  compact?: boolean
  /** Before listing only: the "Before your home goes live" message sits in the header where the photo would be, and the team and brokerage logos replace the agent's call and email buttons. */
  preparation?: { title: string; body: string }
  /** Buyer: the home being bought. Swaps the eyebrow and drops the seller-only published tag. */
  side?: 'seller' | 'buyer'
}

export function ListingOverview({ transaction, onSeeListing, variant = 'card', polestarLayout = false, listingLink = 'first-party', compact = false, preparation, side = 'seller' }: ListingOverviewProps) {
  const { listing } = transaction
  const leadAgent = transaction.team.find((member) => member.id === transaction.teamBrand.leadAgentId)
  const address = `${listing.address}, ${listing.city}, ${listing.state} ${listing.postalCode}`
  const showPolestarCardLayout = polestarLayout && variant === 'card'
  const isLightVariant = variant === 'light' || variant === 'light-bottom' || variant === 'light-compact'
  const isNoListing = variant === 'no-listing'
  const agentLabel = side === 'buyer' ? 'Your agent' : undefined
  const preparationInHeader = isNoListing && !!preparation

  return (
    <Paper component="section" aria-label="Listing overview" className={`listing-overview listing-overview--${variant}${variant === 'light-bottom' || variant === 'light-compact' ? ' listing-overview--light' : ''}${compact ? ' listing-overview--compact' : ''}${preparationInHeader ? ' listing-overview--no-listing-compact' : ''}`}>
      {preparationInHeader ? (
        <Box className="listing-preparation-slot">
          <ListingPreparation message={preparation} />
        </Box>
      ) : isNoListing ? (
        <Box className="listing-no-listing-brand">
          <PartnerBrandLockup brand={transaction.teamBrand} />
        </Box>
      ) : <Box className="listing-photo">
        {listing.photoUrl ? (
          <Box component="img" src={listing.photoUrl} alt={`Listing at ${address}`} className="listing-image" />
        ) : (
          <Stack spacing={1} sx={{ alignItems: 'center' }} className="photo-placeholder-content">
            <ImageOutlined />
            <Typography variant="labelS">Listing photo</Typography>
            <Typography variant="labelS" color="text.secondary">Sample image to be added</Typography>
          </Stack>
        )}
        {(isLightVariant || showPolestarCardLayout) && (
          <ListingActions onSeeListing={onSeeListing} listingLink={listingLink} published={listing.published} placement="image" />
        )}
      </Box>}
      <Box className="listing-summary">
        {variant === 'light-bottom' && !compact && (
          <Box className="listing-light-brand">
            <PartnerBrandLockup brand={transaction.teamBrand} />
          </Box>
        )}
        <Box className="listing-summary-header">
          {variant !== 'light-compact' && <Eyebrow className="eyebrow">{side === 'buyer' ? 'Buyer transaction' : 'Seller transaction'}</Eyebrow>}
          {((variant === 'card' && !showPolestarCardLayout) || (variant === 'full' && !leadAgent)) && <PartnerBrandLockup brand={transaction.teamBrand} />}
        </Box>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexWrap: 'wrap' }} className="listing-statuses">
          <Chip label={listing.status} size="small" icon={<HomeOutlined />} className="status-chip" />
        </Stack>
        <Typography variant={variant === 'card' ? 'titleL' : 'displayS'} component="h1" className="listing-address">
          {listing.address}
        </Typography>
        <Typography
          variant={variant === 'card' ? 'bodySStandard' : 'bodyMStandard'}
          color="text.secondary"
          className="listing-location"
        >
          {listing.city}, {listing.state} {listing.postalCode}
        </Typography>
        {variant === 'full' && (
          <ListingActions onSeeListing={onSeeListing} listingLink={listingLink} published={listing.published} placement="full" />
        )}
        {isLightVariant && leadAgent && (
          <Box className="listing-light-agent">
            <ListingAgentDetails agent={leadAgent} label={agentLabel} inline={variant === 'light-bottom' || variant === 'light-compact'} contactText={variant === 'light-compact'} />
          </Box>
        )}
        {isNoListing && (
          <Box className="listing-no-listing-footer">
            {leadAgent && <ListingAgentDetails agent={leadAgent} label={agentLabel} inline brand={preparationInHeader ? transaction.teamBrand : undefined} />}
          </Box>
        )}
        {variant === 'card' && <Box className="listing-feature-footer">
          {leadAgent && <AgentIdentity agent={leadAgent} label={agentLabel} size="l" eyebrow className="listing-card-agent" />}
          {showPolestarCardLayout ? (
            <PartnerBrandLockup brand={transaction.teamBrand} />
          ) : (
            <ListingActions onSeeListing={onSeeListing} listingLink={listingLink} published={listing.published} placement="footer" />
          )}
        </Box>}
      </Box>
      {leadAgent && variant === 'full' && (
        <Box className="listing-agent-feature">
          <ListingAgentDetails agent={leadAgent} label={agentLabel} />
        </Box>
      )}
    </Paper>
  )
}

function ListingAgentDetails({ agent, inline = false, brand, label, contactText = false }: { agent: SellerTransaction['team'][number]; inline?: boolean; label?: string; /** Inline only: shows the team and brokerage logos where the contact buttons would be. */ brand?: SellerTransaction['teamBrand']; /** Inline only: the phone number and email written out instead of icon buttons. */ contactText?: boolean }) {
  const contacts = (agent.phone || agent.email) && (
    <Box className="listing-agent-feature-contacts">
      {agent.phone && (
        <Box className="listing-agent-feature-contact">
          <Typography variant="labelS">Phone</Typography>
          <Box className="listing-agent-feature-contact-value-row">
            <Typography component="a" href={`tel:${agent.phone}`} variant="bodySStandard" className="listing-agent-feature-contact-link listing-agent-feature-contact-value">{formatPhoneNumber(agent.phone)}</Typography>
            <ArrowOutwardOutlined aria-hidden="true" className="listing-agent-feature-contact-arrow" />
          </Box>
        </Box>
      )}
      {agent.email && (
        <Box className="listing-agent-feature-contact">
          <Typography variant="labelS">Email</Typography>
          <Box className="listing-agent-feature-contact-value-row">
            <Typography component="a" href={`mailto:${agent.email}`} variant="bodySStandard" className="listing-agent-feature-contact-link listing-agent-feature-contact-value">{agent.email}</Typography>
            <ArrowOutwardOutlined aria-hidden="true" className="listing-agent-feature-contact-arrow" />
          </Box>
        </Box>
      )}
    </Box>
  )
  return (
    <Box className={`listing-agent-feature-info${inline ? ' listing-agent-feature-info--inline' : ''}`}>
      <AgentIdentity agent={agent} size="xl" label={label} />
      {inline && brand ? <PartnerBrandLockup brand={brand} /> : inline && !contactText ? <PersonContactActions person={agent} /> : contacts}
    </Box>
  )
}

function formatPhoneNumber(phone: string) {
  return phone.replace(/^\+1(\d{3})(\d{3})(\d{4})$/, '($1) $2-$3')
}

function ListingActions({ onSeeListing, listingLink, published, placement }: { onSeeListing: () => void; listingLink: HeaderListingLink; published: boolean; placement: 'image' | 'full' | 'footer' }) {
  const onImage = placement !== 'footer'
  const buttonClass = `listing-detail-link${placement === 'footer' ? '' : ` listing-detail-link--${placement}`}`

  async function copyListingLink() {
    try {
      await navigator.clipboard.writeText(idxListingUrl)
      toast.success('Listing link copied', { id: 'listing-link' })
    } catch {
      toast.error('Couldn’t copy the link. Please try again.', { id: 'listing-link' })
    }
  }

  if (!published || listingLink === 'first-party') {
    return <Button onClick={onSeeListing} variant={onImage ? 'onImagePrimary' : 'contained'} className={buttonClass}>{published ? 'See Listing' : 'Preview listing'}</Button>
  }

  return (
    <Box className={`listing-actions listing-actions--${placement}`}>
      <Button type="button" variant={onImage ? 'onImageSecondary' : 'outlined'} onClick={copyListingLink} className={onImage ? undefined : 'listing-copy-link'} endIcon={<ContentCopyOutlined aria-hidden="true" />}>Copy link</Button>
      <Button component="a" href={idxListingUrl} target="_blank" rel="noopener noreferrer" variant={onImage ? 'onImagePrimary' : 'contained'} className={buttonClass} endIcon={<ArrowOutwardOutlined aria-hidden="true" />} aria-label="See Listing (opens in a new tab)">
        See Listing
      </Button>
    </Box>
  )
}
