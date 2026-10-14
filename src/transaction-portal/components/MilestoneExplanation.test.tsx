import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { describe, expect, it, vi } from 'vitest'
import { theme } from '../../theme'
import { DateEventRow } from './TransactionRows'

const guidance = {
  explanation: 'The buyer’s deposit is held by escrow.',
  preparation: 'Your team will confirm receipt. You do not need to send this deposit.',
  resourceId: 'earnest-money',
}

function renderExplanation(onReadGuide?: () => void) {
  render(<ThemeProvider theme={theme}><DateEventRow date="2026-10-05" title="Deposit due" description="The deposit is due to escrow." guidance={guidance} onReadResource={onReadGuide} /></ThemeProvider>)
  fireEvent.click(screen.getByRole('button', { name: 'About Deposit due' }))
  return screen.getByRole('dialog', { name: /^Deposit due/ })
}

describe('Date row explanations', () => {
  it('shows the selected milestone’s meaning and preparation, and closes on Escape', async () => {
    const dialog = renderExplanation()
    expect(within(dialog).getByRole('heading', { name: 'What it means' })).toBeInTheDocument()
    expect(within(dialog).getByRole('heading', { name: 'What you need to do' })).toBeInTheDocument()
    expect(within(dialog).queryByText('What this means for your sale')).not.toBeInTheDocument()
    expect(within(dialog).getByText(guidance.explanation)).toBeInTheDocument()
    expect(within(dialog).getByText(guidance.preparation)).toBeInTheDocument()
    expect(within(dialog).queryByRole('button', { name: 'Read guide: Deposit due' })).not.toBeInTheDocument()
    fireEvent.keyDown(dialog, { key: 'Escape' })
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('closes with the primary Done action', async () => {
    const onReadGuide = vi.fn()
    const dialog = renderExplanation(onReadGuide)
    fireEvent.click(within(dialog).getByRole('button', { name: 'Done' }))
    expect(onReadGuide).not.toHaveBeenCalled()
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('closes the explanation when opening its related guide', async () => {
    const onReadGuide = vi.fn()
    const dialog = renderExplanation(onReadGuide)
    fireEvent.click(within(dialog).getByRole('button', { name: 'Read guide: Deposit due' }))
    expect(onReadGuide).toHaveBeenCalledOnce()
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })
  it('opens the resource independently without also opening the explanation', () => {
    const onReadResource = vi.fn()
    const resource = { id: 'earnest-money', title: 'Understanding earnest money', shortTitle: 'Earnest money guide', summary: 'About the deposit.', readingTime: '2 min read', relevance: 'Good to know' as const, sections: [], questions: [] }
    render(<ThemeProvider theme={theme}><DateEventRow date="2026-10-05" title="Deposit due" description="The deposit is due to escrow." guidance={guidance} resource={resource} onReadResource={onReadResource} /></ThemeProvider>)
    fireEvent.click(screen.getByRole('button', { name: 'Read Understanding earnest money' }))
    expect(onReadResource).toHaveBeenCalledOnce()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'About Deposit due' })).toHaveAttribute('aria-haspopup', 'dialog')
  })
})
