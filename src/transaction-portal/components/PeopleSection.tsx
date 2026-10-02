import { Box, Divider, Paper, Stack, Tab, Tabs, Typography } from '@mui/material'
import type { TeamMember, TransactionViewer } from '../types'
import { PersonContactActions, PersonRow } from './TransactionRows'
import './people-section.css'

export type PeopleTab = 'team' | 'viewers'

export function PeopleSection({ team, viewers, brand, value, onChange }: {
  team: TeamMember[]
  viewers: TransactionViewer[]
  brand: { name: string; logoUrl: string }
  value: PeopleTab
  onChange: (value: PeopleTab) => void
}) {
  return (
    <Paper component="section" id="people" elevation={0} className="people-section" aria-labelledby="people-title">
      <Typography component="h2" variant="titleS" id="people-title">People</Typography>
      <Tabs value={value} onChange={(_, next: PeopleTab) => onChange(next)} variant="fullWidth" aria-label="People" className="people-tabs">
        <Tab id="people-tab-team" aria-controls="people-panel-team" value="team" label="Team" />
        <Tab id="people-tab-viewers" aria-controls="people-panel-viewers" value="viewers" label="Viewers" />
      </Tabs>

      <Box role="tabpanel" id="people-panel-team" aria-labelledby="people-tab-team" hidden={value !== 'team'} className="people-panel">
        <Box className="team-list">
          {team.map((member) => <PersonRow key={member.id} person={member} actions={<PersonContactActions person={member} />} />)}
        </Box>
        <Box className="team-brand-footer">
          <Divider />
          <Box component="img" src={brand.logoUrl} alt={brand.name} className="team-logo" />
        </Box>
      </Box>

      <Box role="tabpanel" id="people-panel-viewers" aria-labelledby="people-tab-viewers" hidden={value !== 'viewers'} className="people-panel viewers-panel">
        <Typography variant="labelS" color="text.secondary">Clients with access to this transaction</Typography>
        <Stack spacing={1.5} className="viewers-list">
          {viewers.map((viewer) => <PersonRow key={viewer.id} person={viewer} variant="viewer" />)}
        </Stack>
      </Box>
    </Paper>
  )
}
