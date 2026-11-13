import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { ListingDetailsSheet } from './ListingDetailsSheet'
import { sampleSellerTransaction } from './sellerTransaction'

beforeAll(() => {
  HTMLElement.prototype.scrollTo = vi.fn()
})

describe('ListingDetailsSheet', () => {
  it('preserves the subject listing details and photo gallery', () => {
    render(<ListingDetailsSheet open onClose={() => {}} transaction={sampleSellerTransaction} />)
    const dialog = screen.getByRole('dialog', { name: 'Listing for 128 Meadowbrook Lane' })
    expect(within(dialog).getByText('Published')).toBeInTheDocument()
    expect(within(dialog).getByText('Source: MLS')).toBeInTheDocument()
    expect(within(dialog).getByText(sampleSellerTransaction.details.listingDescription)).toBeInTheDocument()
    expect(within(dialog).getByRole('heading', { name: 'Interior details' })).toBeInTheDocument()
    expect(within(dialog).getByRole('heading', { name: 'Location' })).toBeInTheDocument()
    expect(within(dialog).getByText('Your listing agent')).toBeInTheDocument()
    expect(within(dialog).queryByText('Nearby home')).not.toBeInTheDocument()
    fireEvent.click(within(dialog).getByRole('button', { name: 'See all 3 photos' }))
    expect(screen.getByRole('dialog', { name: 'Photos for 128 Meadowbrook Lane' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'All property photos' })).toBeInTheDocument()
  })
})
