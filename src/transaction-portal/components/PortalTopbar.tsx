import { Avatar, Box, Container, Stack, Typography } from '@mui/material'
import { PartnerBrandLockup, type PartnerBrand } from '../../components/PartnerBrandLockup'
import type { TransactionViewer } from '../types'
import './portal-topbar.css'

/**
 * “Client Portal” on the left, the signed-in client on the right.
 * - homeHref: where the wordmark goes. The client's home is their transactions index.
 * - accountHref: when set, the client's name and avatar link to their profile.
 * - brand: when set, the team and brokerage logos sit after “Client Portal”, past a hairline.
 */
export function PortalTopbar({ viewer, homeHref = '/', accountHref, brand }: {
  viewer?: Pick<TransactionViewer, 'name' | 'initials'> & { role?: string; photoUrl?: string }
  homeHref?: string
  accountHref?: string
  brand?: PartnerBrand
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
        <Box className="portal-topbar-lead">
          <Box component="a" href={homeHref} className="portal-brand-link" aria-label="Client Portal home">
            <Typography variant="titleXS" component="span">Client Portal</Typography>
          </Box>
          {brand && (
            <>
              <Box className="portal-topbar-divider" aria-hidden="true" />
              <PartnerBrandLockup brand={brand} />
            </>
          )}
        </Box>
        {account && accountHref
          ? <Box component="a" href={accountHref} className="portal-account-link" aria-label={`Your profile, ${viewer?.name}`}>{account}</Box>
          : account}
      </Container>
    </Box>
  )
}
