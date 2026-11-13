import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { MarketActivityBlock } from './MarketActivityBlock'
import { emptyMarketActivity, hiddenMarketActivity, sampleMarketActivity } from './marketActivityData'
import { relativeDay } from './marketActivityFormat'

beforeAll(() => {
  HTMLElement.prototype.scrollTo = vi.fn()
})

describe('MarketActivityBlock', () => {
  it('shows nearby home cards, most recent first', () => {
    render(<MarketActivityBlock activity={sampleMarketActivity} />)
    const rows = within(screen.getByRole('list', { name: 'Nearby homes' })).getAllByRole('listitem')
    expect(rows).toHaveLength(8)
    expect(rows[0]).toHaveTextContent('57 Larkspur Court')
    expect(rows[1]).toHaveTextContent('Price dropped $5,000 · 3 days ago')
  })

  it('opens a nearby home in the shared overlay with its own price and facts', async () => {
    render(<MarketActivityBlock activity={sampleMarketActivity} />)
    fireEvent.click(screen.getByRole('button', { name: 'View listing for 214 Aspen Ridge Road' }))
    const dialog = screen.getByRole('dialog', { name: 'Listing for 214 Aspen Ridge Road' })
    expect(within(dialog).getByRole('heading', { name: '214 Aspen Ridge Road' })).toBeInTheDocument()
    expect(within(dialog).getByText('$819,000')).toBeInTheDocument()
    expect(within(dialog).getByText('2,860 sqft')).toBeInTheDocument()
    expect(within(dialog).getByText('0.3 miles')).toBeInTheDocument()
    expect(within(dialog).getByText('$824,000')).toBeInTheDocument()
    expect(within(dialog).getByText('October 3, 2026')).toBeInTheDocument()
    expect(within(dialog).queryByText('Published')).not.toBeInTheDocument()
    expect(within(dialog).queryByText('Your listing agent')).not.toBeInTheDocument()
    expect(within(dialog).queryByRole('heading', { name: 'Location' })).not.toBeInTheDocument()
    expect(within(dialog).queryByRole('heading', { name: 'Interior details' })).not.toBeInTheDocument()
    fireEvent.click(within(dialog).getByRole('button', { name: 'View photo' }))
    expect(screen.getByRole('dialog', { name: 'Photos for 214 Aspen Ridge Road' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Back to listing' }))
    expect(screen.getByRole('dialog', { name: 'Listing for 214 Aspen Ridge Road' })).toBeInTheDocument()
    fireEvent.click(within(dialog).getByRole('button', { name: 'Close listing details' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    fireEvent.click(screen.getByRole('button', { name: 'View listing for 57 Larkspur Court' }))
    const nextDialog = screen.getByRole('dialog', { name: 'Listing for 57 Larkspur Court' })
    expect(within(nextDialog).getByText('$869,000')).toBeInTheDocument()
    expect(within(nextDialog).queryByText('$824,000')).not.toBeInTheDocument()
    expect(within(nextDialog).getByRole('img', { name: 'Exterior of 57 Larkspur Court' })).toHaveAttribute('src', sampleMarketActivity.listings[1].photoUrl)
  })

  it.each([
    ['1902 Willow Glen Drive', 'Sale price', 'Sold'],
    ['12 Swan Creek Court', 'Last asking price', 'Withdrawn'],
    ['88 Timber Hollow Lane', 'Asking price', 'Pending'],
  ])('uses the right price label and status for %s', (address, priceLabel, status) => {
    render(<MarketActivityBlock activity={sampleMarketActivity} />)
    fireEvent.click(screen.getByRole('button', { name: `View listing for ${address}` }))
    const dialog = screen.getByRole('dialog', { name: `Listing for ${address}` })
    expect(within(dialog).getByText(priceLabel)).toBeInTheDocument()
    expect(within(dialog).getByText(status)).toBeInTheDocument()
  })

  it('shows one calm line when nothing changed', () => {
    render(<MarketActivityBlock activity={emptyMarketActivity} />)
    expect(screen.getByText(/No changes nearby since you listed/)).toBeInTheDocument()
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
  })

  it('renders nothing when the team hides it', () => {
    const { container } = render(<MarketActivityBlock activity={hiddenMarketActivity} />)
    expect(container).toBeEmptyDOMElement()
  })
})

describe('relativeDay', () => {
  it('reads like a person would say it', () => {
    expect(relativeDay('2026-10-06', '2026-10-06')).toBe('Today')
    expect(relativeDay('2026-10-05', '2026-10-06')).toBe('Yesterday')
    expect(relativeDay('2026-09-29', '2026-10-06')).toBe('1 week ago')
    expect(relativeDay('2026-09-11', '2026-10-06')).toBe('3 weeks ago')
  })
})
