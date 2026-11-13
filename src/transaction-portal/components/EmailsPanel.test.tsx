import { fireEvent, render, screen, within } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '../../theme'
import { describe, expect, it } from 'vitest'
import { sampleTransactionEmails } from '../emailsData'
import { EmailsPanel } from './EmailsPanel'

const renderPanel = (emails: Parameters<typeof EmailsPanel>[0]['emails']) => render(<ThemeProvider theme={theme}><EmailsPanel emails={emails} /></ThemeProvider>)

describe('EmailsPanel', () => {
  it('groups emails into threads, newest first', () => {
    renderPanel(sampleTransactionEmails)
    const rows = within(screen.getByRole('list', { name: 'Email conversations' })).getAllByRole('button')
    expect(rows).toHaveLength(4)
    expect(rows[0]).toHaveTextContent('Title commitment and closing details')
    expect(rows[3]).toHaveTextContent('Offer on 128 Meadowbrook Lane')
  })

  it('opens a thread in the modal and switches threads', () => {
    renderPanel(sampleTransactionEmails)
    fireEvent.click(screen.getByRole('button', { name: /Offer on 128 Meadowbrook Lane/ }))
    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByRole('heading', { name: 'Offer on 128 Meadowbrook Lane' })).toBeInTheDocument()
    expect(within(dialog).getByText('Purchase-offer-signed.pdf')).toBeInTheDocument()
    fireEvent.click(within(dialog).getByRole('button', { name: /Inspection scheduled/ }))
    expect(within(dialog).getByRole('heading', { name: 'Inspection scheduled for Oct 12' })).toBeInTheDocument()
  })

  it('shows an empty state', () => {
    renderPanel([])
    expect(screen.getByText(/No emails yet/)).toBeInTheDocument()
  })
})
