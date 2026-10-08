import { Avatar, Box, Button, Chip, Paper, Stack, Typography } from '@mui/material'
import HomeOutlined from '@mui/icons-material/HomeOutlined'
import ImageOutlined from '@mui/icons-material/ImageOutlined'
import ArrowOutwardOutlined from '@mui/icons-material/ArrowOutwardOutlined'
import { PortalOutlineTag } from '../components/PortalOutlineTag'
import { PartnerBrandLockup, PersonContactActions } from '../transaction-portal/components'
import type { SellerTransaction } from './sellerTransaction'
import './seller-portal.css'

export type ListingOverviewVariant = 'card' | 'full' | 'light' | 'light-bottom'

type ListingOverviewProps = {
  transaction: SellerTransaction
  onSeeListing: () => void
  variant?: ListingOverviewVariant
  polestarLayout?: boolean
}

export function ListingOverview({ transaction, onSeeListing, variant = 'card', polestarLayout = false }: ListingOverviewProps) {
  const { listing } = transaction
  const leadAgent = transaction.team.find((member) => member.id === transaction.teamBrand.leadAgentId)
  const address = `${listing.address}, ${listing.city}, ${listing.state} ${listing.postalCode}`
  const showPolestarCardLayout = polestarLayout && variant === 'card'
  const isLightVariant = variant === 'light' || variant === 'light-bottom'

  return (
    <Paper component="section" aria-label="Listing overview" className={`listing-overview listing-overview--${variant}${variant === 'light-bottom' ? ' listing-overview--light' : ''}`}>
      <Box className="listing-photo">
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
          <Button onClick={onSeeListing} variant="contained" className="listing-detail-link listing-detail-link--image">
            See Listing
          </Button>
        )}
      </Box>
      <Box className="listing-summary">
        {variant === 'light-bottom' && (
          <Box className="listing-light-brand">
            <PartnerBrandLockup brand={transaction.teamBrand} />
          </Box>
        )}
        <Box className="listing-summary-header">
          <Typography variant="labelS" className="eyebrow">Seller transaction</Typography>
          {((variant === 'card' && !showPolestarCardLayout) || (variant === 'full' && !leadAgent)) && <PartnerBrandLockup brand={transaction.teamBrand} />}
        </Box>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexWrap: 'wrap' }} className="listing-statuses">
          <Chip label={listing.status} size="small" icon={<HomeOutlined />} className="status-chip" />
          <PortalOutlineTag label={listing.published ? 'Published' : 'Not published'} className="published-chip" />
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
          <Button onClick={onSeeListing} variant="contained" className="listing-detail-link listing-detail-link--full">
            See Listing
          </Button>
        )}
        {isLightVariant && leadAgent && (
          <Box className="listing-light-agent">
            <ListingAgentDetails agent={leadAgent} inline={variant === 'light-bottom'} />
          </Box>
        )}
        {variant === 'card' && <Box className="listing-feature-footer">
          {leadAgent && variant === 'card' && (
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', minWidth: 0 }}>
              <Avatar src={leadAgent.photoUrl} alt={leadAgent.name} className="listing-agent-avatar">
                {leadAgent.initials}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="labelS" className="people-kicker">Your listing agent</Typography>
                <Typography variant="titleXS" className="listing-agent-name">{leadAgent.name}</Typography>
              </Box>
            </Stack>
          )}
          {showPolestarCardLayout ? (
            <PartnerBrandLockup brand={transaction.teamBrand} />
          ) : (
            <Button onClick={onSeeListing} variant="contained" className="listing-detail-link">
              See Listing
            </Button>
          )}
        </Box>}
      </Box>
      {leadAgent && variant === 'full' && (
        <Box className="listing-agent-feature">
          <ListingAgentDetails agent={leadAgent} />
        </Box>
      )}
    </Paper>
  )
}

function ListingAgentDetails({ agent, inline = false }: { agent: SellerTransaction['team'][number]; inline?: boolean }) {
  return (
    <Box className={`listing-agent-feature-info${inline ? ' listing-agent-feature-info--inline' : ''}`}>
      <Stack direction="row" spacing={1.75} sx={{ alignItems: 'center', minWidth: 0 }}>
        <Avatar src={agent.photoUrl} alt={agent.name} className="listing-agent-feature-avatar">
          {agent.initials}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="labelS" className="listing-agent-feature-label">Your listing agent</Typography>
          <Typography variant="titleS" className="listing-agent-feature-name">{agent.name}</Typography>
        </Box>
      </Stack>
      {inline ? <PersonContactActions person={agent} /> : (agent.phone || agent.email) && (
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
      )}
    </Box>
  )
}

function formatPhoneNumber(phone: string) {
  return phone.replace(/^\+1(\d{3})(\d{3})(\d{4})$/, '($1) $2-$3')
}
