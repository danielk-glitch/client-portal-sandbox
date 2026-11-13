import { Box, Button, Paper, Typography } from '@mui/material'
import ArrowOutwardOutlined from '@mui/icons-material/ArrowOutwardOutlined'
import { Eyebrow } from '../components/Eyebrow'
import { FactList, type Fact } from '../components/FactList'
import { PersonContactActions } from '../transaction-portal/components'
import { AgentIdentity } from '../components/AgentIdentity'
import { PartnerBrandLockup } from '../components/PartnerBrandLockup'
import type { SellerTransaction } from './sellerTransaction'
import './property-summary-card.css'

type PropertySummaryCardProps = {
  transaction: SellerTransaction
  facts: Fact[]
  onSeeListing?: () => void
}

/** The listing header condensed into a narrow column card: photo, address, key facts, agent, and partner brand. */
export function PropertySummaryCard({ transaction, facts, onSeeListing }: PropertySummaryCardProps) {
  const { listing } = transaction
  const agent = transaction.team.find((member) => member.id === transaction.teamBrand.leadAgentId)
  const price = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(listing.price)

  return (
    <Paper component="section" aria-label="Your home" variant="outlined" className="property-summary">
      <Box className="property-summary-photo">
        {listing.photoUrl && <Box component="img" src={listing.photoUrl} alt={`${listing.address}, ${listing.city}`} />}
        {listing.published && onSeeListing && (
          <Button variant="onImagePrimary" size="small" endIcon={<ArrowOutwardOutlined />} onClick={onSeeListing} className="property-summary-listing">See listing</Button>
        )}
      </Box>

      <Box className="property-summary-body">
        <Eyebrow className="property-summary-eyebrow">Your home</Eyebrow>
        <Typography component="h2" variant="titleM" className="property-summary-address">{listing.address}</Typography>
        <Typography variant="bodySStandard" color="text.secondary">{listing.city}, {listing.state} {listing.postalCode} · {price}</Typography>

        <FactList facts={facts} className="property-summary-facts" />
      </Box>

      {agent && (
        <Box className="property-summary-agent">
          <AgentIdentity agent={agent} size="s" />
          <PersonContactActions person={agent} />
        </Box>
      )}

      <Box className="property-summary-brand">
        <PartnerBrandLockup brand={transaction.teamBrand} />
      </Box>
    </Paper>
  )
}
