/** Charcoal private-client composition: panoramic photo and a prominent closing countdown. */
import { Box, Container, Typography } from '@mui/material'
import { AgentSignature, HomePhoto, NextStep, type HeroProps } from './HeroParts'
import { currentMilestone, daysBetween, formatDay } from '../../seller-portal/timeline-first/timelineFirstData'

export function PrivateClientHero(props: HeroProps) {
  const { listing } = props.transaction
  const closing = props.timeline.countdown?.date
  return <Container maxWidth="xl" className="hero-private">
    <Box className="hero-private-top">
      <Box className="hero-private-address">
        <Typography component="p" variant="labelS" className="hero-kicker">Your sale · {currentMilestone(props.timeline).label}</Typography>
        <Typography component="h1" variant="displayM" id="tf-c2-title">{listing.address}</Typography>
        <Typography component="p" variant="bodyMStandard" className="hero-location">{listing.city}, {listing.state} {listing.postalCode}</Typography>
      </Box>
      {closing && <Box className="hero-private-countdown">
        <Typography component="span" variant="displayL" className="hero-private-number">{daysBetween(props.timeline.today, closing)}</Typography>
        <Box><Typography component="p" variant="bodyLStandard">days to closing</Typography><Typography component="p" variant="bodySStandard" className="hero-location">Expected {formatDay(closing, { month: 'long', day: 'numeric' })}</Typography></Box>
      </Box>}
    </Box>
    <HomePhoto {...props} />
    <Box className="hero-private-bottom"><AgentSignature {...props} /><NextStep {...props} /></Box>
  </Container>
}
