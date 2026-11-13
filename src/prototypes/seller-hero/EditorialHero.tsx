/** Address-led editorial composition: generous photo, personal details, quiet signature. */
import { Box, Container, Typography } from '@mui/material'
import { AgentSignature, HomePhoto, NextStep, type HeroProps } from './HeroParts'
import { currentMilestone, daysBetween, formatDay } from '../../seller-portal/timeline-first/timelineFirstData'

export function EditorialHero(props: HeroProps) {
  const { listing } = props.transaction
  const closing = props.timeline.countdown?.date
  return <Container maxWidth="xl" className="hero-editorial">
    <HomePhoto {...props} />
    <Box className="hero-editorial-copy">
      <Typography component="p" variant="labelS" className="hero-kicker">Your home · {currentMilestone(props.timeline).label}</Typography>
      <Typography component="h1" variant="displayM" id="tf-c2-title">{listing.address}</Typography>
      <Typography component="p" variant="bodyMStandard" className="hero-location">{listing.city}, {listing.state} {listing.postalCode}</Typography>
      {closing && <Box className="hero-editorial-status">
        <Box className="hero-countdown"><Typography component="span" variant="displayL">{daysBetween(props.timeline.today, closing)}</Typography><Typography component="span" variant="bodySStandard">days to<br />closing</Typography></Box>
        <Box className="hero-closing-date"><Typography component="span" variant="labelS" className="hero-kicker">Expected closing</Typography><Typography component="span" variant="titleXS">{formatDay(closing, { month: 'long', day: 'numeric' })}</Typography></Box>
      </Box>}
      <NextStep {...props} />
      <AgentSignature {...props} />
    </Box>
  </Container>
}
