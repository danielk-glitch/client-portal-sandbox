import { Avatar, Box, Button, Chip, Paper, Stack, Typography } from '@mui/material'
import HomeOutlined from '@mui/icons-material/HomeOutlined'
import ImageOutlined from '@mui/icons-material/ImageOutlined'
import { PartnerBrandLockup } from '../transaction-portal/components'
import type { SellerTransaction } from './sellerTransaction'
import './seller-portal.css'

export type ListingOverviewVariant = 'card' | 'full'

type ListingOverviewProps = {
  transaction: SellerTransaction
  onSeeListing: () => void
  variant?: ListingOverviewVariant
}

export function ListingOverview({ transaction, onSeeListing, variant = 'card' }: ListingOverviewProps) {
  const { listing } = transaction
  const leadAgent = transaction.team.find((member) => member.id === transaction.teamBrand.leadAgentId)
  const address = `${listing.address}, ${listing.city}, ${listing.state} ${listing.postalCode}`

  return (
    <Paper component="section" aria-label="Listing overview" className={`listing-overview listing-overview--${variant}`}>
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
      </Box>
      <Box className="listing-summary">
        <Box className="listing-summary-header">
          <Typography variant="labelS" className="eyebrow">Seller transaction</Typography>
          {(variant === 'card' || !leadAgent) && <PartnerBrandLockup brand={transaction.teamBrand} />}
        </Box>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexWrap: 'wrap' }} className="listing-statuses">
          <Chip label={listing.status} size="small" icon={<HomeOutlined />} className="status-chip" />
          <Chip
            label={listing.published ? 'Published' : 'Not published'}
            size="small"
            variant="outlined"
            className="published-chip"
          />
        </Stack>
        <Typography variant={variant === 'full' ? 'displayS' : 'titleL'} component="h1" className="listing-address">
          {listing.address}
        </Typography>
        <Typography
          variant={variant === 'full' ? 'bodyMStandard' : 'bodySStandard'}
          color="text.secondary"
          className="listing-location"
        >
          {listing.city}, {listing.state} {listing.postalCode}
        </Typography>
        <Box className="listing-feature-footer">
          {leadAgent && variant === 'full' && (
            <Box className="listing-agent-feature">
              <Stack direction="row" spacing={1.75} sx={{ alignItems: 'center', minWidth: 0 }}>
                <Avatar src={leadAgent.photoUrl} alt={leadAgent.name} className="listing-agent-feature-avatar">
                  {leadAgent.initials}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="labelS" className="listing-agent-feature-label">Your listing agent</Typography>
                  <Typography variant="titleS" className="listing-agent-feature-name">{leadAgent.name}</Typography>
                </Box>
              </Stack>
              {(leadAgent.phone || leadAgent.email) && (
                <Box className="listing-agent-feature-contacts">
                  {leadAgent.phone && (
                    <Box component="a" href={`tel:${leadAgent.phone}`} className="listing-agent-feature-contact">
                      <Typography variant="labelS">Phone</Typography>
                      <Typography variant="bodySStandard">{formatPhoneNumber(leadAgent.phone)}</Typography>
                    </Box>
                  )}
                  {leadAgent.email && (
                    <Box component="a" href={`mailto:${leadAgent.email}`} className="listing-agent-feature-contact">
                      <Typography variant="labelS">Email</Typography>
                      <Typography variant="bodySStandard">{leadAgent.email}</Typography>
                    </Box>
                  )}
                </Box>
              )}
              <Box className="listing-agent-feature-brand">
                <PartnerBrandLockup brand={transaction.teamBrand} />
              </Box>
            </Box>
          )}
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
          <Button onClick={onSeeListing} variant="contained" className="listing-detail-link">
            See Listing
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}

function formatPhoneNumber(phone: string) {
  return phone.replace(/^\+1(\d{3})(\d{3})(\d{4})$/, '($1) $2-$3')
}
