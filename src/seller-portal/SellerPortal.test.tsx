import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { theme } from '../theme'
import { SellerPortal } from './SellerPortal'
import { futureMarketingSnapshot, futureSellerTransaction } from './futureSellerTransaction'

afterEach(() => { window.history.replaceState(null, '', '/'); vi.unstubAllGlobals() })

function renderPortal() {
  render(<ThemeProvider theme={theme}><SellerPortal transaction={futureSellerTransaction} marketingSnapshot={futureMarketingSnapshot} basePath="/seller/future-v1" /></ThemeProvider>)
}

async function selectView(label: string) {
  if (screen.getByRole('button', { name: 'Feedback tools' }).getAttribute('aria-expanded') === 'false') {
    fireEvent.click(screen.getByRole('button', { name: 'Feedback tools' }))
  }
  fireEvent.click(screen.getByRole('button', { name: /^View:/ }))
  fireEvent.click(screen.getByRole('menuitemradio', { name: new RegExp(label) }))
  await waitFor(() => expect(screen.queryByRole('menu', { name: 'Journey view' })).not.toBeInTheDocument())
}

describe('Seller journey views', () => {
  it('uses the seller experience in team preview without review tools or pin changes', () => {
    window.history.replaceState(null, '', '/team/preview?section=documents')
    render(<ThemeProvider theme={theme}><SellerPortal transaction={futureSellerTransaction} marketingSnapshot={futureMarketingSnapshot} basePath="/team/preview" readOnly showReviewTools={false} /></ThemeProvider>)
    expect(screen.getByRole('heading', { name: 'Listing performance' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Feedback tools' })).not.toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /^(Pin|Unpin) / }).every(button => button.hasAttribute('disabled'))).toBe(true)
    expect(screen.getAllByRole('button', { name: /^Preview / }).length).toBeGreaterThan(0)
  })

  it('switches complete scenarios while preserving design choices and the annotations toggle', async () => {
    window.history.replaceState(null, '', '/seller/future-v1?header=card&listingLink=idx-mvp&section=notes')
    renderPortal()
    expect(screen.getByRole('heading', { name: 'Listing performance' })).toBeInTheDocument()
    expect(screen.getByText('Closing preparation')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Feedback tools' }))
    fireEvent.click(screen.getByRole('checkbox', { name: 'Annotations' }))

    await selectView('Before listing')
    expect(screen.getByRole('heading', { name: 'Before your home goes live' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Review your tasks' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Listing performance' })).not.toBeInTheDocument()
    expect(screen.getByText('Not published')).toBeInTheDocument()
    expect(screen.getByText('Your listing launch plan')).toBeInTheDocument()
    expect(screen.queryByText('Closing preparation')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Copy link' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Preview listing' })).not.toBeInTheDocument()
    expect(new URLSearchParams(window.location.search).get('view')).toBe('before-listing')
    expect(new URLSearchParams(window.location.search).get('header')).toBe('card')
    expect(new URLSearchParams(window.location.search).get('listingLink')).toBe('idx-mvp')

    if (screen.getByRole('button', { name: 'Feedback tools' }).getAttribute('aria-expanded') === 'false') fireEvent.click(screen.getByRole('button', { name: 'Feedback tools' }))
    expect(screen.getByRole('checkbox', { name: 'Annotations' })).toBeChecked()
    await selectView('Under contract')
    expect(screen.getByRole('heading', { name: 'Listing performance' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'See Listing (opens in a new tab)' })).toBeInTheDocument()
    expect(screen.getByText('Closing preparation')).toBeInTheDocument()
  })

  it('loads shareable preparation content without listing or marketing actions', () => {
    window.history.replaceState(null, '', '/seller/future-v1?view=before-listing&listingLink=idx-mvp&section=tasks&marketing=overview')
    renderPortal()
    expect(screen.getByText('Prepare your home for photography')).toBeInTheDocument()
    expect(screen.queryByText('Review closing details')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'View marketing dashboard' })).not.toBeInTheDocument()

    expect(screen.queryByRole('button', { name: 'Preview listing' })).not.toBeInTheDocument()
    expect(window.location.pathname).toBe('/seller/future-v1')
    expect(new URLSearchParams(window.location.search).get('view')).toBe('before-listing')
    expect(screen.getByRole('heading', { name: 'Before your home goes live' })).toBeInTheDocument()
  })

  it('restores the journey when browser history changes', async () => {
    window.history.replaceState(null, '', '/seller/future-v1')
    renderPortal()
    await selectView('Before listing')
    fireEvent.click(screen.getByRole('tab', { name: 'Tasks' }))
    window.history.replaceState(null, '', '/seller/future-v1?view=under-contract')
    fireEvent.popState(window)
    expect(screen.getByRole('heading', { name: 'Listing performance' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Before your home goes live' })).not.toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Activity' })).toHaveAttribute('aria-selected', 'true')
  })
})
