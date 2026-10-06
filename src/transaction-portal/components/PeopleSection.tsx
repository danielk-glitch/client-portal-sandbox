import { Box, Paper, Stack, Typography } from '@mui/material'
import { SegmentedSwitch, type SegmentedSwitchOption } from '../../components/SegmentedSwitch'
import type { TeamMember, TransactionViewer } from '../types'
import { PersonContactActions, PersonRow } from './TransactionRows'
import './people-section.css'

export type PeopleTab = 'team' | 'viewers'

const peopleOptions: readonly SegmentedSwitchOption<PeopleTab>[] = [
  { value: 'team', label: 'Team', id: 'people-switch-team', controls: 'people-panel-team' },
  { value: 'viewers', label: 'Viewers', id: 'people-switch-viewers', controls: 'people-panel-viewers' },
]

export function PeopleSection({ team, viewers, value, onChange }: {
  team: TeamMember[]
  viewers: TransactionViewer[]
  value: PeopleTab
  onChange: (value: PeopleTab) => void
}) {
  return (
    <Paper component="section" id="people" elevation={0} className="people-section" aria-labelledby="people-title">
      <Box className="people-heading">
        <Typography component="h2" variant="titleS" id="people-title">People</Typography>
        <SegmentedSwitch options={peopleOptions} value={value} onChange={onChange} aria-label="People view" />
      </Box>

      <Box role="region" id="people-panel-team" aria-labelledby="people-switch-team" hidden={value !== 'team'} className="people-panel">
        <Box className="team-list">
          {team.map((member) => <PersonRow key={member.id} person={member} actions={<PersonContactActions person={member} />} />)}
        </Box>
      </Box>

      <Box role="region" id="people-panel-viewers" aria-labelledby="people-switch-viewers" hidden={value !== 'viewers'} className="people-panel viewers-panel">
        <Typography variant="labelS" color="text.secondary">Clients with access to this transaction</Typography>
        <Stack spacing={1.5} className="viewers-list">
          {viewers.map((viewer) => <PersonRow key={viewer.id} person={viewer} variant="viewer" />)}
        </Stack>
      </Box>
    </Paper>
  )
}
