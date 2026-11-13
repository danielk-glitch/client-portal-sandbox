import { Avatar, Box, Container, Stack, Typography } from '@mui/material'
import { brandAssets } from '../../assets/brand'
import type { TransactionViewer } from '../types'
import './portal-topbar.css'

/**
 * PLACE wordmark with “Client portal” on the left, the signed-in client on the right.
 * - homeHref: where the wordmark goes. The client's home is their transactions index.
 * - accountHref: when set, the client's name and avatar link to their profile.
 */
export function PortalTopbar({ viewer, homeHref = '/', accountHref }: {
  viewer?: Pick<TransactionViewer, 'name' | 'initials'> & { role?: string; photoUrl?: string }
  homeHref?: string
  accountHref?: string
}) {
  const account = viewer && (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      <Avatar src={viewer.photoUrl} alt="" className="account-avatar">{viewer.initials}</Avatar>
      <Box className="account-name">
        <Typography variant="labelM">{viewer.name}</Typography>
        {viewer.role && <Typography variant="labelS" color="text.secondary">{viewer.role}</Typography>}
      </Box>
    </Stack>
  )
  return (
    <Box component="header" className="portal-topbar">
      <Container maxWidth="xl" className="portal-topbar-inner">
        <Box component="a" href={homeHref} className="portal-brand-link" aria-label="PLACE client portal home">
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Box component="img" src={brandAssets.place.wordmarkDefault} alt="" className="place-wordmark" />
            <Box className="topbar-divider" />
            <Typography variant="bodySStandard" color="text.secondary" className="portal-brand-label">Client portal</Typography>
          </Stack>
        </Box>
        {account && accountHref
          ? <Box component="a" href={accountHref} className="portal-account-link" aria-label={`Your profile, ${viewer?.name}`}>{account}</Box>
          : account}
      </Container>
    </Box>
  )
}
