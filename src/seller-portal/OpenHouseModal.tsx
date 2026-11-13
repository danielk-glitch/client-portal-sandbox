/**
 * Open house modal · the client-facing detail for one open house.
 * - Done: results lead (visitors, leads), then the facts, then the host's notes.
 * - Scheduled: facts, notes, and a quiet line saying results arrive afterward. Footer offers add to calendar.
 */
import { useState } from 'react'
import { Avatar, Box, Typography } from '@mui/material'
import { PlaceModal } from '../components/PlaceModal'
import type { TeamMember } from '../transaction-portal/types'
import { AddToCalendarButton } from './AddToCalendarButton'
import { isOpenHouseDone, openHouseTime, openHouseTitle, type OpenHouse } from './openHouses'
import './open-house.css'

function formatDay(iso: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('en-US', { ...options, timeZone: 'UTC' }).format(new Date(`${iso}T12:00:00Z`))
}

function daysBetween(from: string, to: string) {
  return Math.round((new Date(`${to}T12:00:00Z`).getTime() - new Date(`${from}T12:00:00Z`).getTime()) / 86400000)
}

export function OpenHouseModal({ openHouse, stageLabel, team, today, onClose }: {
  openHouse: OpenHouse | null
  /** The stage the open house belongs to, e.g. "Active listing". */
  stageLabel?: string
  team: TeamMember[]
  /** The prototype's "today", so "In 4 days" matches the rest of the page. */
  today: string
  onClose: () => void
}) {
  // Keep the last open house while the dialog animates closed.
  const [shown, setShown] = useState(openHouse)
  if (openHouse && openHouse !== shown) setShown(openHouse)
  const current = openHouse ?? shown
  if (!current) return null

  const done = isOpenHouseDone(current)
  const title = openHouseTitle(current)
  const host = team.find((person) => person.name === current.host)
  const hostFirstName = current.host.split(' ')[0]
  const days = daysBetween(today, current.date)
  const status = done ? 'Done' : days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : days > 0 ? `In ${days} days` : 'Scheduled'
  const description = [stageLabel, formatDay(current.date, { weekday: 'long', month: 'long', day: 'numeric' })].filter(Boolean).join(' · ')

  return (
    <PlaceModal
      open={Boolean(openHouse)}
      onClose={onClose}
      title={title}
      description={description}
      size="m"
      className="open-house-modal"
      actions={done ? undefined : <AddToCalendarButton title={title} date={current.date} />}
    >
      <Box className="open-house-detail">
        {done && (
          <Box component="section" aria-labelledby="open-house-results-title" className="open-house-group">
            <Typography component="h3" variant="labelS" id="open-house-results-title" className="open-house-group-title">Results</Typography>
            <Box component="dl" className="open-house-stats">
              <Box className="open-house-stat">
                <Typography component="dt" variant="labelM" color="text.secondary">Visitors</Typography>
                <Typography component="dd" variant="metricL">{current.attendees ?? 0}</Typography>
              </Box>
              <Box className="open-house-stat">
                <Typography component="dt" variant="labelM" color="text.secondary">Leads</Typography>
                <Typography component="dd" variant="metricL">{current.leads ?? 0}</Typography>
              </Box>
            </Box>
            <Typography variant="bodySStandard" color="text.secondary">Leads are visitors who left their contact info or asked {hostFirstName} to follow up.</Typography>
          </Box>
        )}

        <Box component="dl" className="open-house-facts">
          <Box><Typography component="dt" variant="labelS">Date</Typography><Typography component="dd" variant="labelM">{formatDay(current.date, { weekday: 'short', month: 'short', day: 'numeric' })}</Typography></Box>
          <Box><Typography component="dt" variant="labelS">Time</Typography><Typography component="dd" variant="labelM">{openHouseTime(current)}</Typography></Box>
          <Box>
            <Typography component="dt" variant="labelS">Host</Typography>
            <Typography component="dd" variant="labelM" className="open-house-host">
              {host?.photoUrl && <Avatar src={host.photoUrl} alt="" className="open-house-host-avatar" />}
              {current.host}
            </Typography>
          </Box>
          <Box><Typography component="dt" variant="labelS">Status</Typography><Typography component="dd" variant="labelM">{status}</Typography></Box>
        </Box>

        {current.notes && (
          <Box component="section" aria-labelledby="open-house-notes-title" className="open-house-group">
            <Typography component="h3" variant="labelS" id="open-house-notes-title" className="open-house-group-title">Notes from {hostFirstName}</Typography>
            <Typography variant="bodyMStandard" className="open-house-notes">{current.notes}</Typography>
          </Box>
        )}

        {!done && (
          <Typography variant="bodySStandard" color="text.secondary" className="open-house-pending">
            Visitor and lead counts show up here after the open house.
          </Typography>
        )}
      </Box>
    </PlaceModal>
  )
}
