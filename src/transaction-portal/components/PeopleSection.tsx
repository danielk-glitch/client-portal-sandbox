/**
 * People · the team and the viewers on this sale, in one card with tabs.
 * Pass `collaborators` to add a middle tab (title, escrow, lender and other outside partners). `showContact` replaces the call and email buttons with labelled, tappable phone and email lines in each row.
 */
import { Box, Tab, Tabs } from '@mui/material'
import { PlaceCard } from '../../components/PlaceCard'
import type { TeamMember, TransactionViewer } from '../types'
import { PersonContactActions, PersonRow } from './TransactionRows'
import './people-section.css'

export type PeopleTab = 'team' | 'collaborators' | 'viewers'

export function PeopleSection({ team, collaborators, viewers, value, onChange, showContact = false }: {
  team: TeamMember[]
  collaborators?: TeamMember[]
  viewers: TransactionViewer[]
  showContact?: boolean
  value: PeopleTab
  onChange: (value: PeopleTab) => void
}) {
  return (
    <PlaceCard component="section" id="people" className="people-section" aria-label="People">
      <Tabs value={value} onChange={(_, nextValue: PeopleTab) => onChange(nextValue)} aria-label="People" className="people-tabs">
        <Tab value="team" label={collaborators ? 'Team' : 'Your Team'} id="people-tab-team" aria-controls="people-panel-team" />
        {collaborators && <Tab value="collaborators" label="Collaborators" id="people-tab-collaborators" aria-controls="people-panel-collaborators" />}
        <Tab value="viewers" label="Viewers" id="people-tab-viewers" aria-controls="people-panel-viewers" />
      </Tabs>

      <Box role="tabpanel" id="people-panel-team" aria-labelledby="people-tab-team" hidden={value !== 'team'} className="people-panel">
        <Box className="team-list">
          {team.map((member) => <PersonRow key={member.id} person={member} showContact={showContact} actions={showContact ? undefined : <PersonContactActions person={member} />} />)}
        </Box>
      </Box>

      {collaborators && (
        <Box role="tabpanel" id="people-panel-collaborators" aria-labelledby="people-tab-collaborators" hidden={value !== 'collaborators'} className="people-panel">
          <Box className="team-list">
            {collaborators.map((member) => <PersonRow key={member.id} person={member} showContact={showContact} actions={showContact ? undefined : <PersonContactActions person={member} />} />)}
          </Box>
        </Box>
      )}

      <Box role="tabpanel" id="people-panel-viewers" aria-labelledby="people-tab-viewers" hidden={value !== 'viewers'} className="people-panel viewers-panel">
        {/* Same list spacing as the team tab, so switching tabs doesn't shift anything. */}
        <Box className="team-list viewers-list">
          {viewers.map((viewer) => <PersonRow key={viewer.id} person={viewer} variant="viewer" showContact={showContact} />)}
        </Box>
      </Box>
    </PlaceCard>
  )
}
