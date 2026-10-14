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
  it('opens on the current milestone with the next step', () => {
    const handlers = renderTimeline('tracker')
    expect(screen.getByRole('tab', { name: /Under contract/ })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('Next step')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Review document' }))
    expect(handlers.onOpenDocument).toHaveBeenCalledWith(expect.objectContaining({ id: 'doc-2' }))
  })

  it('lets sellers look ahead with document actions locked and guides open', () => {
    const handlers = renderTimeline('tracker')
    fireEvent.click(screen.getByRole('tab', { name: /Closing/ }))
    const panel = screen.getByRole('tabpanel')
    expect(within(panel).getByText(/Opens after under contract/)).toBeInTheDocument()
    fireEvent.click(within(panel).getByRole('button', { name: /Review your closing statement/ }))
    expect(within(panel).getByText('Closing statement')).toHaveAttribute('title', 'Shared in closing')
    fireEvent.click(within(screen.getByRole('complementary', { name: 'Closing resources' })).getByRole('button', { name: 'Read Getting ready for closing day' }))
    expect(handlers.onOpenResource).toHaveBeenCalledWith(expect.objectContaining({ id: 'closing' }))
  })

  it('moves between milestones with arrow keys', () => {
    renderTimeline('tracker')
    const current = screen.getByRole('tab', { name: /Under contract/ })
    fireEvent.keyDown(current, { key: 'ArrowLeft' })
    expect(screen.getByRole('tab', { name: /Active listing/ })).toHaveAttribute('aria-selected', 'true')
  })

  it('stacks milestones as an expandable list', () => {
    renderTimeline('stacked')
    expect(screen.getByRole('button', { name: /Under contract/ })).toHaveAttribute('aria-expanded', 'true')
    const closing = screen.getByRole('button', { name: /Closing/ })
    expect(closing).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(closing)
    expect(closing).toHaveAttribute('aria-expanded', 'true')
  })
})
