import { Avatar, Box, Button, Paper, Typography } from '@mui/material'
import ArrowOutwardOutlined from '@mui/icons-material/ArrowOutwardOutlined'
import { PartnerBrandLockup, PersonContactActions } from '../transaction-portal/components'
import type { SellerTransaction } from './sellerTransaction'
import './property-summary-card.css'

type PropertySummaryCardProps = {
  transaction: SellerTransaction
  /** Stage label shown on the photo, e.g. "Under contract". */
  stage: string
  facts: Array<{ label: string; value: string }>
  onSeeListing?: () => void
}

/** The listing header condensed into a narrow column card: photo, address, key facts, agent, and partner brand. */
export function PropertySummaryCard({ transaction, stage, facts, onSeeListing }: PropertySummaryCardProps) {
  const { listing } = transaction
  const agent = transaction.team.find((member) => member.id === transaction.teamBrand.leadAgentId)
  const price = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(listing.price)

  return (
    <Paper component="section" aria-label="Your home" variant="outlined" className="property-summary">
      <Box className="property-summary-photo">
        {listing.photoUrl && <Box component="img" src={listing.photoUrl} alt={`${listing.address}, ${listing.city}`} />}
        <Box component="span" className="property-summary-stage"><Box component="span" className="property-summary-stage-dot" aria-hidden="true" />{stage}</Box>
      </Box>

      <Box className="property-summary-body">
        <Typography variant="labelS" className="property-summary-eyebrow">Your home</Typography>
        <Typography component="h2" variant="titleM" className="property-summary-address">{listing.address}</Typography>
        <Typography variant="bodySStandard" color="text.secondary">{listing.city}, {listing.state} {listing.postalCode} · {price}</Typography>

        <Box component="dl" className="property-summary-facts">
          {facts.map((fact) => (
            <Box key={fact.label} className="property-summary-fact">
              <Typography component="dt" variant="labelS">{fact.label}</Typography>
              <Typography component="dd" variant="labelM">{fact.value}</Typography>
            </Box>
          ))}
        </Box>

        {listing.published && onSeeListing && (
          <Button variant="outlined" size="small" endIcon={<ArrowOutwardOutlined />} onClick={onSeeListing} className="property-summary-listing">See listing</Button>
        )}
      </Box>

      {agent && (
        <Box className="property-summary-agent">
          <Avatar src={agent.photoUrl} alt="" className="property-summary-avatar">{agent.initials}</Avatar>
          <Box className="property-summary-agent-copy">
            <Typography variant="labelS" color="text.secondary">Your listing agent</Typography>
            <Typography variant="titleXS">{agent.name}</Typography>
          </Box>
          <PersonContactActions person={agent} />
        </Box>
      )}

      <Box className="property-summary-brand">
        <PartnerBrandLockup brand={transaction.teamBrand} />
      </Box>
    </Paper>
  )
}
