/**
 * Open house row · one open house in a stage's "Dates" list or the Open houses tab.
 * Same anatomy as a date row: date bubble, title, a time line, then a quiet meta line.
 * - Scheduled: meta shows the host. Optional add-to-calendar button on the right.
 * - Done: meta shows the host plus visitors and leads, so results read at a glance.
 * The whole row opens the open house modal.
 */
import { Avatar, Box, ButtonBase } from '@mui/material'
import { DateRowCopy, DateStamp } from '../transaction-portal/components'
import type { TeamMember } from '../transaction-portal/types'
import { AddToCalendarButton } from './AddToCalendarButton'
import { isOpenHouseDone, openHouseTime, openHouseTitle, type OpenHouse } from './openHouses'
import './open-house.css'

function weekday(iso: string) {
  return new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: 'UTC' }).format(new Date(`${iso}T12:00:00Z`))
}

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`

export function OpenHouseRow({ openHouse, team, onOpen, calendar = false }: {
  openHouse: OpenHouse
  team: TeamMember[]
  onOpen: () => void
  /** Show an add-to-calendar button while the open house is still scheduled. */
  calendar?: boolean
}) {
  const done = isOpenHouseDone(openHouse)
  const title = openHouseTitle(openHouse)
  const host = team.find((person) => person.name === openHouse.host)
  const showCalendar = calendar && !done
  const results = done && openHouse.attendees !== undefined
    ? `${plural(openHouse.attendees, 'visitor')} · ${plural(openHouse.leads ?? 0, 'lead')}`
    : null

  return (
    <Box component="li" className={`portal-date-row timeline-item timeline-item--open-house${showCalendar ? ' portal-date-row--resource' : ''}${done ? ' is-done' : ''}`}>
      <ButtonBase
        className="portal-date-row-main"
        onClick={onOpen}
        aria-haspopup="dialog"
        aria-label={`${title}, ${weekday(openHouse.date)} ${openHouseTime(openHouse)}${results ? `, ${results}` : ''}`}
        disableRipple
      >
        <DateStamp date={openHouse.date} className={`timeline-stamp${done ? ' is-done' : ''}`} />
        <DateRowCopy
          className="timeline-item-copy"
          metaClassName="timeline-item-meta"
          title={title}
          description={`${weekday(openHouse.date)} · ${openHouseTime(openHouse)}`}
          meta={<>
            {host?.photoUrl && <Avatar src={host.photoUrl} alt="" className="timeline-item-avatar" />}
            {done ? openHouse.host : `Hosted by ${openHouse.host}`}
            {results && <><Box component="span" aria-hidden="true">·</Box><Box component="span" className="open-house-results">{results}</Box></>}
          </>}
        />
      </ButtonBase>
      {showCalendar && <AddToCalendarButton title={title} date={openHouse.date} className="timeline-item-calendar" />}
    </Box>
  )
}
