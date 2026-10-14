import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { toast } from 'sonner'
import { ListingOverview, idxListingUrl } from './ListingOverview'
import { sampleSellerTransaction } from './sellerTransaction'

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))
afterEach(() => { vi.clearAllMocks(); vi.unstubAllGlobals() })

describe('Header listing actions', () => {
  it('keeps the first-party preview as the default', () => {
    const openListing = vi.fn()
    render(<ListingOverview transaction={sampleSellerTransaction} onSeeListing={openListing} variant="light-bottom" />)
    fireEvent.click(screen.getByRole('button', { name: 'See Listing' }))
    expect(openListing).toHaveBeenCalledOnce()
    expect(screen.queryByRole('button', { name: 'Copy link' })).not.toBeInTheDocument()
  })

  it('links externally and confirms only a successful clipboard write', async () => {
    let finishCopy!: () => void
    const writeText = vi.fn(() => new Promise<void>((resolve) => { finishCopy = resolve }))
    vi.stubGlobal('navigator', { clipboard: { writeText } })
    render(<ListingOverview transaction={sampleSellerTransaction} onSeeListing={vi.fn()} listingLink="idx-mvp" variant="light-bottom" />)
    const link = screen.getByRole('link', { name: 'See Listing (opens in a new tab)' })
    expect(link).toHaveAttribute('href', idxListingUrl)
    expect(link).toHaveAttribute('target', '_blank')
    fireEvent.click(screen.getByRole('button', { name: 'Copy link' }))
    expect(writeText).toHaveBeenCalledWith(idxListingUrl)
    expect(toast.success).not.toHaveBeenCalled()
    finishCopy()
    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Listing link copied', { id: 'listing-link' }))
  })

  it('shows a failure message when copying is unavailable', async () => {
    vi.stubGlobal('navigator', { clipboard: { writeText: vi.fn().mockRejectedValue(new Error('Denied')) } })
    render(<ListingOverview transaction={sampleSellerTransaction} onSeeListing={vi.fn()} listingLink="idx-mvp" />)
    fireEvent.click(screen.getByRole('button', { name: 'Copy link' }))
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Couldn’t copy the link. Please try again.', { id: 'listing-link' }))
    expect(toast.success).not.toHaveBeenCalled()
  })
})
