/**
 * People · the team and the viewers on this sale, in one card with tabs.
 * On a phone it gets a "People" heading, so it reads as its own section, and shows the first two people with a "Show more" to see the rest.
 * Pass `collaborators` to add a middle tab (title, escrow, lender and other outside partners). `showContact` replaces the call and email buttons with labelled, tappable phone and email lines in each row.
 */
import { useState } from 'react'
import { Box, Tab, Tabs, useMediaQuery } from '@mui/material'
import { DisclosureButton } from '../../components/DisclosureButton'
import { PlaceCard } from '../../components/PlaceCard'
import { SectionLabel } from '../../components/SectionLabel'
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
  const phone = useMediaQuery('(max-width:599.95px)', { noSsr: true })
  const [expanded, setExpanded] = useState(false)
  const phoneCap = 2
  const activeCount = value === 'team' ? team.length : value === 'collaborators' ? (collaborators?.length ?? 0) : viewers.length
  const capped = phone && !expanded
  const shown = <T,>(list: T[]) => (capped ? list.slice(0, phoneCap) : list)
  return (
    <PlaceCard component="section" id="people" className="people-section" aria-label="People">
      {phone && <SectionLabel component="h2" className="people-heading">People</SectionLabel>}
      <Tabs value={value} onChange={(_, nextValue: PeopleTab) => { setExpanded(false); onChange(nextValue) }} aria-label="People" className="people-tabs">
        <Tab value="team" label={collaborators ? 'Team' : 'Your Team'} id="people-tab-team" aria-controls="people-panel-team" />
        {collaborators && <Tab value="collaborators" label="Collaborators" id="people-tab-collaborators" aria-controls="people-panel-collaborators" />}
        <Tab value="viewers" label="Viewers" id="people-tab-viewers" aria-controls="people-panel-viewers" />
      </Tabs>

      <Box role="tabpanel" id="people-panel-team" aria-labelledby="people-tab-team" hidden={value !== 'team'} className="people-panel">
        <Box className="team-list">
          {shown(team).map((member) => <PersonRow key={member.id} person={member} showContact={showContact} actions={showContact ? undefined : <PersonContactActions person={member} />} />)}
        </Box>
      </Box>

      {collaborators && (
        <Box role="tabpanel" id="people-panel-collaborators" aria-labelledby="people-tab-collaborators" hidden={value !== 'collaborators'} className="people-panel">
          <Box className="team-list">
            {shown(collaborators).map((member) => <PersonRow key={member.id} person={member} showContact={showContact} actions={showContact ? undefined : <PersonContactActions person={member} />} />)}
          </Box>
        </Box>
      )}

      <Box role="tabpanel" id="people-panel-viewers" aria-labelledby="people-tab-viewers" hidden={value !== 'viewers'} className="people-panel viewers-panel">
        {/* Same list spacing as the team tab, so switching tabs doesn't shift anything. */}
        <Box className="team-list viewers-list">
          {shown(viewers).map((viewer) => <PersonRow key={viewer.id} person={viewer} variant="viewer" showContact={showContact} />)}
        </Box>
      </Box>
      {phone && activeCount > phoneCap && (
        <DisclosureButton open={expanded} onToggle={() => setExpanded(!expanded)} showLabel="Show more" hideLabel="Show less" />
      )}
    </PlaceCard>
  )
}
