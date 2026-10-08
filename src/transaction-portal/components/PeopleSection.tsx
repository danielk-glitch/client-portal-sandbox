/* design-build · self-critique: Clarity5 Warmth4 Restraint5 Craft4 Variety4 SlopFree5 */
import { Box, Paper, Stack, Tab, Tabs } from '@mui/material'
import type { TeamMember, TransactionViewer } from '../types'
import { PersonContactActions, PersonRow } from './TransactionRows'
import './people-section.css'

export type PeopleTab = 'team' | 'viewers'

export function PeopleSection({ team, viewers, value, onChange }: {
  team: TeamMember[]
  viewers: TransactionViewer[]
  value: PeopleTab
  onChange: (value: PeopleTab) => void
}) {
  return (
    <Paper component="section" id="people" elevation={0} className="people-section" aria-label="People">
      <Tabs value={value} onChange={(_, nextValue: PeopleTab) => onChange(nextValue)} aria-label="People" className="people-tabs">
        <Tab value="team" label="Your Team" id="people-tab-team" aria-controls="people-panel-team" />
        <Tab value="viewers" label="Viewers" id="people-tab-viewers" aria-controls="people-panel-viewers" />
      </Tabs>

      <Box role="tabpanel" id="people-panel-team" aria-labelledby="people-tab-team" hidden={value !== 'team'} className="people-panel">
        <Box className="team-list">
          {team.map((member) => <PersonRow key={member.id} person={member} actions={<PersonContactActions person={member} />} />)}
        </Box>
      </Box>

      <Box role="tabpanel" id="people-panel-viewers" aria-labelledby="people-tab-viewers" hidden={value !== 'viewers'} className="people-panel viewers-panel">
        <Stack spacing={1.5} className="viewers-list">
          {viewers.map((viewer) => <PersonRow key={viewer.id} person={viewer} variant="viewer" />)}
        </Stack>
      </Box>
    </Paper>
  )
}
