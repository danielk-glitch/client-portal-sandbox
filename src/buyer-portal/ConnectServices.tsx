/**
 * Connect services · a simple upsell in the details zone.
 * The team's concierge partner sets up internet, TV, utilities, movers, and security for the buyer.
 * One primary action. For now it confirms with a toast that the concierge team will reach out; no link out, no tracking.
 * Copy shifts with timing: "for move-in day" before closing, "in your new home" after.
 */
import { Box, Button, Typography } from '@mui/material'
import WifiRounded from '@mui/icons-material/WifiRounded'
import TvRounded from '@mui/icons-material/TvRounded'
import BoltRounded from '@mui/icons-material/BoltRounded'
import LocalShippingRounded from '@mui/icons-material/LocalShippingRounded'
import ShieldRounded from '@mui/icons-material/ShieldRounded'
import { toast } from 'sonner'
import { PlaceCard } from '../components/PlaceCard'
import { Eyebrow } from '../components/Eyebrow'
import { PortalIconBadge } from '../components/PortalIconBadge'

const services = [
  { icon: <WifiRounded />, label: 'Internet' },
  { icon: <TvRounded />, label: 'TV and streaming' },
  { icon: <BoltRounded />, label: 'Electric, gas, and water' },
  { icon: <LocalShippingRounded />, label: 'Movers' },
  { icon: <ShieldRounded />, label: 'Home security' },
]

export function ConnectServices({ movedIn = false }: { movedIn?: boolean }) {
  return (
    <PlaceCard component="section" aria-labelledby="bp-connect-title" className="bp-connect">
      <Box className="bp-connect-copy">
        <Eyebrow component="p">Moving made easy</Eyebrow>
        <Typography component="h2" variant="titleL" id="bp-connect-title">{movedIn ? 'Still setting up your services?' : 'Let us connect your services'}</Typography>
        <Typography variant="bodyMStandard" color="text.secondary" className="bp-connect-body">
          Tell us your {movedIn ? 'address' : 'move-in date'} once. Our concierge team compares plans, makes the calls, and schedules everything {movedIn ? 'for your new home' : 'for move-in day'}.
        </Typography>
        <Button variant="contained" onClick={() => toast.success('Request sent. Our concierge team will reach out within one business day.', { id: 'connect-services' })} className="bp-connect-action">
          Connect services
        </Button>
      </Box>
      <Box component="ul" className="bp-connect-list" aria-label="Services we can set up">
        {services.map((service) => (
          <Box component="li" key={service.label} className="bp-connect-item">
            <PortalIconBadge>{service.icon}</PortalIconBadge>
            <Typography variant="labelM" component="span">{service.label}</Typography>
          </Box>
        ))}
      </Box>
    </PlaceCard>
  )
}
