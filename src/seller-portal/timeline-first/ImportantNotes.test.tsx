import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { ThemeProvider } from '@mui/material'
import { describe, expect, it, vi } from 'vitest'
import { theme } from '../../theme'
import type { TeamNote } from '../../transaction-portal/types'
import { ImportantNotes } from './ImportantNotes'

const make = (id: string, day: number, starredAt?: string): TeamNote => ({
  id,
  body: `Body of ${id}`,
  author: 'Avery Coleman',
  createdAt: `09/${String(day).padStart(2, '0')}/2026 · 10:00 AM`,
  starredAt,
})

function renderNotes(notes: TeamNote[], onSeeAll = vi.fn()) {
  render(<ThemeProvider theme={theme}><ImportantNotes notes={notes} onSeeAll={onSeeAll} /></ThemeProvider>)
  return onSeeAll
}

describe('ImportantNotes', () => {
  it('shows at most five notes, starred first, then newest', () => {
    const notes = [make('n1', 1), make('n2', 2), make('n3', 3), make('n4', 4), make('n5', 5), make('n6', 6), make('old-star', 1, '2026-10-01T09:00:00')]
    renderNotes(notes)
    const rows = within(screen.getByRole('list')).getAllByRole('listitem')
    expect(rows).toHaveLength(5)
    expect(rows.map((row) => row.querySelector('.important-note-text')?.textContent?.replace('Body of ', ''))).toEqual(['old-star', 'n6', 'n5', 'n4', 'n3'])
    expect(within(rows[0]).getByTitle('Important')).toBeInTheDocument()
    expect(within(rows[1]).queryByTitle('Important')).not.toBeInTheDocument()
  })

  it('orders by newest when nothing is starred', () => {
    renderNotes([make('a', 1), make('b', 9), make('c', 4)])
    const rows = within(screen.getByRole('list')).getAllByRole('listitem')
    expect(rows.map((row) => row.querySelector('.important-note-text')?.textContent?.replace('Body of ', ''))).toEqual(['b', 'c', 'a'])
  })

  it('opens the full note and jumps to all notes', async () => {
    const onSeeAll = renderNotes([make('a', 1)])
    fireEvent.click(screen.getByRole('button', { name: /Body of a/ }))
    expect(screen.getByRole('dialog')).toHaveTextContent('Body of a')
    fireEvent.click(screen.getByRole('button', { name: 'Close note' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    fireEvent.click(screen.getByRole('button', { name: 'See all notes' }))
    expect(onSeeAll).toHaveBeenCalledTimes(1)
  })

  it('has no title or heading on a note row', () => {
    renderNotes([make('a', 1)])
    expect(screen.getAllByRole('heading')).toHaveLength(1)
    expect(screen.getByRole('heading', { name: 'Important notes' })).toBeInTheDocument()
  })
})
