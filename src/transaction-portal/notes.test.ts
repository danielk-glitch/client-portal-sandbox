import { describe, expect, it } from 'vitest'
import { noteCreatedTime, sortImportantNotes } from './notes'
import type { TeamNote } from './types'

const note = (id: string, createdAt: string, starredAt?: string): TeamNote => ({ id, body: id, author: 'Avery Coleman', createdAt, starredAt })

describe('noteCreatedTime', () => {
  it('reads the display format, including AM and PM', () => {
    expect(noteCreatedTime({ createdAt: '10/03/2026 · 11:20 AM' })).toBeLessThan(noteCreatedTime({ createdAt: '10/03/2026 · 01:05 PM' }))
    expect(noteCreatedTime({ createdAt: '12/31/2025 · 11:59 PM' })).toBeLessThan(noteCreatedTime({ createdAt: '01/01/2026 · 12:01 AM' }))
  })
})

describe('sortImportantNotes', () => {
  const notes = [
    note('old', '08/18/2026 · 10:30 AM'),
    note('star-early', '09/28/2026 · 10:45 AM', '2026-10-06T14:30:00'),
    note('new', '10/03/2026 · 11:20 AM'),
    note('star-late', '09/30/2026 · 03:10 PM', '2026-10-09T09:15:00'),
  ]

  it('puts starred notes first, most recently starred first, then the rest newest first', () => {
    expect(sortImportantNotes(notes).map((n) => n.id)).toEqual(['star-late', 'star-early', 'new', 'old'])
  })

  it('falls back to newest first when nothing is starred', () => {
    expect(sortImportantNotes(notes.map(({ starredAt: _starredAt, ...rest }) => rest)).map((n) => n.id)).toEqual(['new', 'star-late', 'star-early', 'old'])
  })

  it('does not change the order of the list it was given', () => {
    const before = notes.map((n) => n.id)
    sortImportantNotes(notes)
    expect(notes.map((n) => n.id)).toEqual(before)
  })
})
