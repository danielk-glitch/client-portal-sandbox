import type { TeamNote } from './types'

/** Notes show their creation time as "MM/DD/YYYY · hh:mm AM". This turns that into a sortable time. */
export function noteCreatedTime(note: Pick<TeamNote, 'createdAt'>): number {
  const match = note.createdAt.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:\s*·\s*(\d{1,2}):(\d{2})\s*(AM|PM))?/i)
  if (!match) return 0
  const [, month, day, year, hour = '12', minute = '0', meridiem = 'AM'] = match
  const hours24 = (Number(hour) % 12) + (meridiem.toUpperCase() === 'PM' ? 12 : 0)
  return new Date(Number(year), Number(month) - 1, Number(day), hours24, Number(minute)).getTime()
}

/**
 * The notes worth surfacing first.
 * - Starred notes lead, the most recently starred first. The team stars notes; clients can't.
 * - Everything else follows, newest note first. With no starred notes, that's all of it.
 */
export function sortImportantNotes(notes: TeamNote[]): TeamNote[] {
  return [...notes].sort((a, b) => {
    const starA = a.starredAt ? new Date(a.starredAt).getTime() : null
    const starB = b.starredAt ? new Date(b.starredAt).getTime() : null
    if (starA !== null && starB !== null) return starB - starA
    if (starA !== null) return -1
    if (starB !== null) return 1
    return noteCreatedTime(b) - noteCreatedTime(a)
  })
}
