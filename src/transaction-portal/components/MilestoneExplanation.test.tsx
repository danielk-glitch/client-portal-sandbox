import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { describe, expect, it, vi } from 'vitest'
import { theme } from '../../theme'
import { DateEventRow } from './TransactionRows'

const guidance = {
  explanation: 'The buyer’s deposit is held by escrow.',
  preparation: 'Your team will confirm receipt. You do not need to send this deposit.',
  resourceIds: ['earnest-money'],
}
const resource = (id: string, title: string) => ({ id, title, summary: 'About it.', readingTime: '2 min read', relevance: 'Good to know' as const, sections: [], questions: [] })
const earnest = { ...resource('earnest-money', 'Understanding earnest money'), shortTitle: 'Earnest money guide' }
const contingencies = resource('contingencies', 'Contingencies explained')

function renderRow(resources: ReturnType<typeof resource>[] = [], onReadResource = vi.fn()) {
  render(<ThemeProvider theme={theme}><DateEventRow date="2026-10-05" title="Deposit due" description="The deposit is due to escrow." guidance={guidance} resources={resources} onReadResource={onReadResource} /></ThemeProvider>)
  return onReadResource
}
const openExplanation = () => { fireEvent.click(screen.getByRole('button', { name: 'About Deposit due' })); return screen.getByRole('dialog', { name: /^Deposit due/ }) }

describe('Date row explanations', () => {
  it('shows the meaning and preparation, and closes on Escape', async () => {
    renderRow()
    const dialog = openExplanation()
    expect(within(dialog).getByRole('heading', { name: 'What it means' })).toBeInTheDocument()
    expect(within(dialog).getByRole('heading', { name: 'What you need to do' })).toBeInTheDocument()
    expect(within(dialog).getByText(guidance.explanation)).toBeInTheDocument()
    expect(within(dialog).queryByRole('heading', { name: 'Helpful resources' })).not.toBeInTheDocument()
    fireEvent.keyDown(dialog, { key: 'Escape' })
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('closes with the primary Done action', async () => {
    const onRead = renderRow([earnest])
    fireEvent.click(within(openExplanation()).getByRole('button', { name: 'Done' }))
    expect(onRead).not.toHaveBeenCalled()
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('with one resource, the chip opens it directly and the dialog offers it as an action', async () => {
    const onRead = renderRow([earnest])
    fireEvent.click(screen.getByRole('button', { name: 'Read Understanding earnest money' }))
    expect(onRead).toHaveBeenCalledWith(earnest)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    fireEvent.click(within(openExplanation()).getByRole('button', { name: 'Read resource: Understanding earnest money' }))
    expect(onRead).toHaveBeenCalledTimes(2)
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('with several resources, the chip opens the explanation listing each one', async () => {
    const onRead = renderRow([earnest, contingencies])
    fireEvent.click(screen.getByRole('button', { name: 'See 2 resources for Deposit due' }))
    const dialog = screen.getByRole('dialog', { name: /^Deposit due/ })
    expect(within(dialog).getByRole('heading', { name: 'Helpful resources' })).toBeInTheDocument()
    fireEvent.click(within(dialog).getByRole('button', { name: 'Read resource: Contingencies explained' }))
    expect(onRead).toHaveBeenCalledWith(contingencies)
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })
})
