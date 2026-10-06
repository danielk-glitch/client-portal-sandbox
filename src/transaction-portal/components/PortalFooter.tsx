import { Avatar, Box, Container, Typography } from '@mui/material'
import type { TeamMember } from '../types'
import { PartnerBrandLockup, type PartnerBrand } from './PartnerBrandLockup'
import { PersonContactActions } from './TransactionRows'
import './portal-footer.css'

export function PortalFooter({ agent, brand }: { agent?: TeamMember; brand: PartnerBrand }) {
  return (
    <Box component="footer" className="portal-footer">
      <Container maxWidth="xl" className="portal-footer-inner">
        <Box className="portal-footer-content">
          {agent && (
            <Box className="portal-footer-agent">
              <Avatar src={agent.photoUrl} alt={agent.name} className="portal-footer-avatar">
                {agent.initials}
              </Avatar>
              <Box className="portal-footer-agent-copy">
                <Typography variant="labelS" color="text.secondary">{agent.role}</Typography>
                <Typography variant="titleXS">{agent.name}</Typography>
              </Box>
              <PersonContactActions person={agent} />
            </Box>
          )}
          <Box className="portal-footer-brand">
            <PartnerBrandLockup brand={brand} />
          </Box>
        </Box>
        <Typography variant="labelS" color="text.secondary" className="portal-footer-powered">Powered by Brivity</Typography>
      </Container>
    </Box>
  )
}
