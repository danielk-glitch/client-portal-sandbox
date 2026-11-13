import { Avatar, Box, Typography } from '@mui/material'
import { Eyebrow } from './Eyebrow'
import './agent-identity.css'

export type AgentIdentitySize = 's' | 'm' | 'l' | 'xl'

/**
 * Avatar, a small role label, and the agent’s name. Contact actions and brand lockups sit beside it, supplied by the parent.
 * Sizes set the avatar: s 44px, m 48px, l 56px, xl 64px. xl also uses the larger name style.
 */
export function AgentIdentity({ agent, size = 'm', label = 'Your listing agent', eyebrow = false, className }: {
  agent: { name: string; initials: string; photoUrl?: string }
  size?: AgentIdentitySize
  label?: string
  /** Show the label as an uppercase eyebrow instead of plain text. */
  eyebrow?: boolean
  className?: string
}) {
  return (
    <Box className={['agent-identity', `agent-identity--${size}`, className].filter(Boolean).join(' ')}>
      <Avatar src={agent.photoUrl} alt={agent.name} className="agent-identity-avatar">{agent.initials}</Avatar>
      <Box className="agent-identity-copy">
        {eyebrow
          ? <Eyebrow className="agent-identity-label">{label}</Eyebrow>
          : <Typography variant="labelS" className="agent-identity-label">{label}</Typography>}
        <Typography variant={size === 'xl' ? 'titleS' : 'titleXS'} className="agent-identity-name">{agent.name}</Typography>
      </Box>
    </Box>
  )
}
