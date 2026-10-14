import { fireEvent, render, screen, within } from '@testing-library/react'
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

const renderAt = (url: string) => { window.history.replaceState(null, '', url); return render(<ThemeProvider theme={theme}><TeamPortal /></ThemeProvider>) }

describe('Admin-managed library', () => {
  it('shows how many transactions a deletion reaches, then removes the resource everywhere', () => {
    renderAt('/team/library')
    fireEvent.click(screen.getByRole('button', { name: 'More actions for Your guide to working with our team' }))
    fireEvent.click(screen.getByRole('menuitem', { name: 'Delete' }))
    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText('12')).toBeInTheDocument()
    expect(within(dialog).getByText(/removes it from those client portals right away/)).toBeInTheDocument()
    fireEvent.click(within(dialog).getByRole('button', { name: 'Delete resource' }))
    const saved = loadTeamState()
    expect(saved.resources.some(resource => resource.id === 'team-welcome')).toBe(false)
    expect(saved.visible).not.toContain('team-welcome')
    expect(saved.defaults.seller?.visible).not.toContain('team-welcome')
  })

  it('lets members browse published resources without editing controls', () => {
    renderAt('/team/library?as=member')
    expect(screen.queryByRole('link', { name: 'Create resource' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /More actions/ })).not.toBeInTheDocument()
    expect(screen.queryByText('Preparing for your first buyer tour')).not.toBeInTheDocument()
    expect(screen.getByText('A smoother move')).toBeInTheDocument()
  })

  it('keeps the editor read-only for members', () => {
    window.localStorage.setItem(teamStateKey, JSON.stringify({ ...initialTeamState, role: 'member' }))
    renderAt('/team/editor?id=team-moving')
    expect(screen.getByRole('heading', { name: 'Admins edit library resources' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Publish' })).not.toBeInTheDocument()
  })
})

describe('Team defaults', () => {
  it('compares a transaction with the seller default and resets it', () => {
    renderAt('/team/resources')
    expect(screen.getByText('2 changes from the default')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }))
    fireEvent.click(screen.getByRole('button', { name: 'Reset resources' }))
    expect([...loadTeamState().visible].sort()).toEqual([...initialTeamState.defaults.seller!.visible].sort())
    expect(screen.getByText('Matches the default')).toBeInTheDocument()
  })

  it('lets admins save the current selection as the seller default', () => {
    renderAt('/team/resources')
    fireEvent.click(screen.getByRole('button', { name: 'Update seller default' }))
    fireEvent.click(screen.getByRole('button', { name: 'Update default' }))
    expect([...loadTeamState().defaults.seller!.visible].sort()).toEqual([...initialTeamState.visible].sort())
  })

  it('hides default saving from members', () => {
    renderAt('/team/resources?as=member')
    expect(screen.queryByRole('button', { name: /seller default/ })).not.toBeInTheDocument()
    expect(screen.getByText('Admins manage team defaults.')).toBeInTheDocument()
  })

  it('sets up a buyer default from the defaults page', () => {
    renderAt('/team/defaults')
    fireEvent.click(screen.getByRole('button', { name: 'Buyer' }))
    fireEvent.click(screen.getByRole('button', { name: 'Set up buyer default' }))
    fireEvent.click(screen.getByRole('switch', { name: 'Start A smoother move visible' }))
    fireEvent.click(screen.getByRole('button', { name: 'Save default' }))
    expect(loadTeamState().defaults.buyer?.visible).toContain('team-moving')
  })
})

describe('Client invites', () => {
  it('sends nothing until an admin chooses Send, and includes the personal note', async () => {
    renderAt('/team')
    expect(screen.getByText('Not invited')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Invite' }))
    expect(loadTeamState().invites['co-seller'].status).toBe('not-invited')
    fireEvent.change(screen.getByRole('textbox', { name: 'Personal note (optional)' }), { target: { value: 'Excited to get started!' } })
    expect(within(screen.getByRole('dialog')).getAllByText('Excited to get started!').length).toBeGreaterThan(0)
    fireEvent.click(screen.getByRole('button', { name: 'Send invite' }))
    const invite = loadTeamState().invites['co-seller']
    expect(invite.status).toBe('invited')
    expect(invite.note).toBe('Excited to get started!')
    expect(await screen.findByRole('button', { name: 'Resend' })).toBeInTheDocument()
  })

  it('lets admins remove access after confirming', async () => {
    renderAt('/team')
    fireEvent.click(screen.getByRole('button', { name: 'More access options for Tim Bennett' }))
    fireEvent.click(screen.getByRole('menuitem', { name: 'Remove access' }))
    fireEvent.click(screen.getByRole('button', { name: 'Remove access' }))
    expect(loadTeamState().invites.seller.status).toBe('removed')
    expect(await screen.findByRole('button', { name: 'Invite again' })).toBeInTheDocument()
  })

  it('shows invite status to members without controls', () => {
    renderAt('/team?as=member')
    expect(screen.getByText('Not invited')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Invite' })).not.toBeInTheDocument()
    expect(screen.getByText('Admins send invites and manage access.')).toBeInTheDocument()
  })
})
