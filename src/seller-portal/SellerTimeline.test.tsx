import { fireEvent, render, screen, within } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
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
    expect(screen.getByRole('tab', { name: /Pending/ })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('button', { name: /Review and sign Form 17\. Document, next step/ })).toBeInTheDocument()
  })

  it.each(['tracker', 'stacked'] as const)('opens document rows directly without a detail modal in the %s layout', (layout) => {
    const handlers = renderTimeline(layout)
    fireEvent.click(screen.getByRole('button', { name: /Review and sign Form 17/ }))
    expect(handlers.onOpenDocument).toHaveBeenCalledWith(expect.objectContaining({ id: 'doc-2' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens a date with its timing and what happens next', () => {
    renderTimeline('tracker')
    fireEvent.click(screen.getByRole('button', { name: /^Appraisal\. Date/ }))
    const dialog = screen.getByRole('dialog', { name: 'Appraisal' })
    expect(within(dialog).getByText(/In 8 days/)).toBeInTheDocument()
    expect(within(dialog).getByText('What happens next')).toBeInTheDocument()
  })

  it('splits dates from documents', () => {
    renderTimeline('tracker')
    const main = screen.getByRole('region', { name: 'Dates' })
    const docs = screen.getByRole('complementary', { name: 'Pending documents' })
    expect(within(main).getByRole('button', { name: /^Appraisal\. Date/ })).toBeInTheDocument()
    expect(within(docs).getByRole('button', { name: /Review and sign Form 17/ })).toBeInTheDocument()
    expect(within(main).queryByRole('button', { name: /Review and sign Form 17/ })).not.toBeInTheDocument()
  })

  it('offers add to calendar on dated rows and lists standalone guides as documents', () => {
    const handlers = renderTimeline('tracker')
    // Resource chips no longer sit on rows; dated rows get one add-to-calendar button instead.
    expect(screen.queryByRole('button', { name: 'Read What to expect from the appraisal' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Add Appraisal to your calendar' }))
    expect(screen.getByRole('menuitem', { name: 'Google Calendar' })).toBeInTheDocument()
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' })
    fireEvent.click(screen.getByRole('button', { name: 'Read What “pending” means' }))
    expect(handlers.onOpenResource).toHaveBeenCalledWith(expect.objectContaining({ id: 'contingencies' }))
  })

  it('lets sellers look ahead with documents locked', () => {
    renderTimeline('tracker')
    fireEvent.click(screen.getByRole('tab', { name: /Closing/ }))
    const panel = screen.getByRole('tabpanel')
    expect(within(panel).getByText(/Opens after pending/)).toBeInTheDocument()
    fireEvent.click(within(panel).getByRole('button', { name: /^Review your closing statement/ }))
    const dialog = screen.getByRole('dialog', { name: 'Review your closing statement' })
    expect(within(dialog).getByText('Shared in closing')).toBeInTheDocument()
    expect(within(dialog).queryByRole('button', { name: 'Review document' })).not.toBeInTheDocument()
  })

  it('collapses the Done group until it is opened', () => {
    renderTimeline('tracker')
    const toggle = screen.getByRole('button', { name: /^(Show|Hide) done/ })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('button', { name: /^Purchase agreement signed/ })).not.toBeInTheDocument()
    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: /^Purchase agreement signed/ })).toBeInTheDocument()
  })

  it('shows documents with their file icon instead of a date', () => {
    const { container } = render(<ThemeProvider theme={theme}><SellerTimeline layout="tracker" data={underContractTimeline} resources={timelineResources} documents={sampleSellerTransaction.documents} team={sampleSellerTransaction.team} onOpenResource={vi.fn()} onOpenDocument={vi.fn()} /></ThemeProvider>)
    const documentRow = container.querySelector('.document-list-row')!
    expect(documentRow.querySelector('.document-list-row-icon svg')).not.toBeNull()
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
    fireEvent.keyDown(screen.getByRole('tab', { name: /Pending/ }), { key: 'ArrowLeft' })
    expect(screen.getByRole('tab', { name: /Active listing/ })).toHaveAttribute('aria-selected', 'true')
  })

  it('stacks milestones along a vertical rail on small screens', () => {
    renderTimeline('stacked')
    expect(screen.getByRole('button', { name: /^Pending/ })).toHaveAttribute('aria-expanded', 'true')
    const closing = screen.getByRole('button', { name: /^Closing/ })
    fireEvent.click(closing)
    expect(closing).toHaveAttribute('aria-expanded', 'true')
  })
})
