/** Real listing, agent, and next-step details shared by the two hero directions. */
import { Box, ButtonBase, Typography } from '@mui/material'
import ArrowOutwardOutlined from '@mui/icons-material/ArrowOutwardOutlined'
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded'
import { PersonContactActions } from '../../transaction-portal/components'
import { AgentIdentity } from '../../components/AgentIdentity'
import { PartnerBrandLockup } from '../../components/PartnerBrandLockup'
import type { DirectionContext } from '../../seller-portal/timeline-first/TimelineFirstPortal'
import type { OpenItem } from '../../seller-portal/timeline-first/TimelineFirstParts'
import { formatDay } from '../../seller-portal/timeline-first/timelineFirstData'

export type HeroProps = Pick<DirectionContext, 'transaction' | 'timeline'> & {
  onOpenListing: () => void
  onOpenNext: (item: OpenItem) => void
}

export function HomePhoto({ transaction, onOpenListing }: Pick<HeroProps, 'transaction' | 'onOpenListing'>) {
  const { listing } = transaction
  return <ButtonBase className="hero-home-photo" onClick={onOpenListing} aria-label={`View listing for ${listing.address}`} disableRipple>
    {listing.photoUrl && <img src={listing.photoUrl} alt={listing.photos[0]?.alt ?? listing.address} fetchPriority="high" />}
    <span className="hero-photo-link">View listing <ArrowOutwardOutlined aria-hidden="true" /></span>
  </ButtonBase>
}

export function AgentSignature({ transaction }: Pick<HeroProps, 'transaction'>) {
  const agent = transaction.team.find(member => member.id === transaction.teamBrand.leadAgentId)
  return <Box className="hero-signature">
    {agent && <Box className="hero-agent"><AgentIdentity agent={agent} size="m" /><PersonContactActions person={agent} /></Box>}
    <Box className="hero-brand"><PartnerBrandLockup brand={transaction.teamBrand} /></Box>
  </Box>
}

export function NextStep({ timeline, onOpenNext }: Pick<HeroProps, 'timeline' | 'onOpenNext'>) {
  const milestone = timeline.milestones.find(stage => stage.steps.some(step => step.id === timeline.nextStepId))
  const step = milestone?.steps.find(item => item.id === timeline.nextStepId)
  if (!step || !milestone) return null
  return <ButtonBase className="hero-next-step" onClick={() => onOpenNext({ step, milestone })} aria-haspopup="dialog" disableRipple>
    <Box component="span" className="hero-next-copy">
      <Typography component="span" variant="labelS" className="hero-kicker">Next up{step.date ? ` · ${formatDay(step.date)}` : ''}</Typography>
      <Typography component="span" variant="labelM">{step.title}</Typography>
    </Box>
    <ArrowForwardRounded aria-hidden="true" />
  </ButtonBase>
}
