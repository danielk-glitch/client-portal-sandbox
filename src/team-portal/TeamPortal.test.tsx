import { fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { theme } from '../theme'
import { TeamPortal } from './TeamPortal'
import { initialTeamState, loadTeamState, teamStateKey } from './teamData'

beforeEach(() => {
  const values = new Map<string, string>()
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  })
})
afterEach(() => { window.history.replaceState(null, '', '/'); vi.unstubAllGlobals() })

describe('Team resource publishing', () => {
  it('saves a new resource under one identity, then publishes it without losing the editor', async () => {
    window.history.replaceState(null, '', '/team/editor?id=new')
    render(<ThemeProvider theme={theme}><TeamPortal /></ThemeProvider>)
    fireEvent.change(screen.getByRole('textbox', { name: 'Resource title' }), { target: { value: 'Closing contacts' } })
    const content = screen.getByRole('textbox', { name: 'Guide content' })
    content.innerHTML = '<p>Call your coordinator for paperwork questions.</p>'
    fireEvent.input(content)
    fireEvent.click(screen.getByRole('button', { name: 'Save draft' }))
    const id = new URLSearchParams(window.location.search).get('id')
    expect(id).not.toBe('new')
    expect(loadTeamState().resources.find(resource => resource.id === id)?.published).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Publish' }))
    fireEvent.click(screen.getByRole('button', { name: 'Publish now' }))
    const saved = loadTeamState().resources.filter(resource => resource.id === id)
    expect(saved).toHaveLength(1)
    expect(saved[0].published?.title).toBe('Closing contacts')
    expect(saved[0].draft).toBeNull()
    expect(await screen.findByRole('heading', { name: 'Edit resource' })).toBeInTheDocument()
  })

  it('reviews the full publication reach and preserves hidden transaction choices', () => {
    window.localStorage.setItem(teamStateKey, JSON.stringify({ ...initialTeamState, visible: ['closing'] }))
    window.history.replaceState(null, '', '/team/editor?id=team-welcome')
    render(<ThemeProvider theme={theme}><TeamPortal /></ThemeProvider>)
    const oldVersion = loadTeamState().resources.find(resource => resource.id === 'team-welcome')?.published
    fireEvent.change(screen.getByRole('textbox', { name: 'Resource title' }), { target: { value: 'Updated team guide' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save draft' }))
    expect(loadTeamState().resources.find(resource => resource.id === 'team-welcome')?.published).toEqual(oldVersion)
    fireEvent.click(screen.getByRole('button', { name: 'Publish' }))
    expect(screen.getByRole('heading', { name: 'Publish changes to 12 transactions?' })).toBeInTheDocument()
    expect(screen.getByText(/all 12 linked transactions. Hidden resources remain hidden/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Publish now' }))
    expect(loadTeamState().visible).toEqual(['closing'])
    expect(loadTeamState().resources.find(resource => resource.id === 'team-welcome')?.published?.title).toBe('Updated team guide')
  })
})
