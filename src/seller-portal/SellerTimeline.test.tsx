import { fireEvent, render, screen, within } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { act } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { theme } from '../theme'
import { SellerTimeline } from './SellerTimeline'
import { timelineResources, underContractTimeline } from './sellerTimelineData'
import { sampleSellerTransaction } from './sellerTransaction'

function renderTimeline(layout: 'tracker' | 'stacked', handlers = { onOpenResource: vi.fn(), onOpenDocument: vi.fn() }) {
  render(
    <ThemeProvider theme={theme}>
      <SellerTimeline layout={layout} data={underContractTimeline} resources={timelineResources} documents={sampleSellerTransaction.documents} team={sampleSellerTransaction.team} {...handlers} />
    </ThemeProvider>,
  )
  return handlers
}

describe('SellerTimeline', () => {
  it('opens on the current milestone and marks the next step', () => {
    renderTimeline('tracker')
    expect(screen.getByRole('tab', { name: /Under contract/ })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('button', { name: /Review and sign Form 17\. Document, next step/ })).toBeInTheDocument()
  })

  it('opens an item in a modal with its primary action', () => {
    const handlers = renderTimeline('tracker')
    fireEvent.click(screen.getByRole('button', { name: /Review and sign Form 17/ }))
    const dialog = screen.getByRole('dialog', { name: 'Review and sign Form 17' })
    expect(within(dialog).getByText('Document')).toBeInTheDocument()
    fireEvent.click(within(dialog).getByRole('button', { name: 'Review document' }))
    expect(handlers.onOpenDocument).toHaveBeenCalledWith(expect.objectContaining({ id: 'doc-2' }))
  })

  it('keeps resource links on the right and lists standalone guides as items', () => {
    const handlers = renderTimeline('tracker')
    fireEvent.click(screen.getByRole('button', { name: 'Read What to expect from the appraisal' }))
    expect(handlers.onOpenResource).toHaveBeenCalledWith(expect.objectContaining({ id: 'appraisal' }))
    fireEvent.click(screen.getByRole('button', { name: 'Read What “under contract” means' }))
    expect(handlers.onOpenResource).toHaveBeenCalledWith(expect.objectContaining({ id: 'contingencies' }))
  })

  it('lets sellers look ahead with documents locked', () => {
    renderTimeline('tracker')
    fireEvent.click(screen.getByRole('tab', { name: /Closing/ }))
    const panel = screen.getByRole('tabpanel')
    expect(within(panel).getByText(/Opens after under contract/)).toBeInTheDocument()
    fireEvent.click(within(panel).getByRole('button', { name: /^Review your closing statement/ }))
    const dialog = screen.getByRole('dialog', { name: 'Review your closing statement' })
    expect(within(dialog).getByText(/Closing statement will be shared in closing/)).toBeInTheDocument()
    expect(within(dialog).queryByRole('button', { name: 'Review document' })).not.toBeInTheDocument()
  })

  it('collapses the Done group until it is opened', () => {
    renderTimeline('tracker')
    const toggle = screen.getByRole('button', { name: /Done/ })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('button', { name: /^Purchase agreement signed/ })).not.toBeInTheDocument()
    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: /^Purchase agreement signed/ })).toBeInTheDocument()
  })

  it('lets sellers check off an action, which then moves to Done', () => {
    vi.useFakeTimers()
    renderTimeline('tracker')
    const check = screen.getByRole('checkbox', { name: /Confirm appraisal access: mark as done/ })
    expect(check).toHaveAttribute('aria-checked', 'false')
    fireEvent.click(check)
    expect(check).toHaveAttribute('aria-checked', 'true')
    act(() => { vi.advanceTimersByTime(700) })
    expect(screen.getByRole('tab', { name: /Under contract/ })).toHaveTextContent('3 of 7 done')
    expect(screen.getByRole('button', { name: /Done/ })).toHaveTextContent('3')
    vi.useRealTimers()
  })

  it('shows documents with their file icon instead of a date', () => {
    const { container } = render(<ThemeProvider theme={theme}><SellerTimeline layout="tracker" data={underContractTimeline} resources={timelineResources} documents={sampleSellerTransaction.documents} team={sampleSellerTransaction.team} onOpenResource={vi.fn()} onOpenDocument={vi.fn()} /></ThemeProvider>)
    const documentRow = container.querySelector('.timeline-item--document')!
    expect(documentRow.querySelector('.timeline-stamp--icon')).not.toBeNull()
    expect(documentRow.textContent).not.toMatch(/OCT/i)
  })

  it('collapses to just the tracker, and reopens when a milestone is picked', () => {
    renderTimeline('tracker')
    const toggle = screen.getByRole('button', { name: 'Hide details' })
    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).toHaveTextContent('Show details')
    const shell = document.getElementById(toggle.getAttribute('aria-controls')!)!
    expect(shell).toHaveAttribute('inert')
    fireEvent.click(screen.getByRole('tab', { name: /Closing/ }))
    expect(shell).not.toHaveAttribute('inert')
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
  })

  it('moves between milestones with arrow keys', () => {
    renderTimeline('tracker')
    fireEvent.keyDown(screen.getByRole('tab', { name: /Under contract/ }), { key: 'ArrowLeft' })
    expect(screen.getByRole('tab', { name: /Active listing/ })).toHaveAttribute('aria-selected', 'true')
  })

  it('stacks milestones along a vertical rail on small screens', () => {
    renderTimeline('stacked')
    expect(screen.getByRole('button', { name: /^Under contract/ })).toHaveAttribute('aria-expanded', 'true')
    const closing = screen.getByRole('button', { name: /^Closing/ })
    fireEvent.click(closing)
    expect(closing).toHaveAttribute('aria-expanded', 'true')
  })
})
