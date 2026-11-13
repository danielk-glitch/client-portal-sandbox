import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { theme } from '../theme'
import { SellerPortal } from './SellerPortal'
import { futureMarketingSnapshot, futureSellerTransaction } from './futureSellerTransaction'
import { sampleMarketActivity } from './market-activity/marketActivityData'

vi.mock('../transaction-portal/components/PdfPages', () => ({
  default: ({ url }: { url: string }) => <div data-testid="pdf-pages" data-url={url} />,
}))

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
    // The note shows in Notes (overview) and in the Notes tab.
    expect(screen.getAllByText(/^Closing is scheduled for November 6\./).length).toBeGreaterThan(0)
    fireEvent.click(screen.getByRole('button', { name: 'Feedback tools' }))
    fireEvent.click(screen.getByRole('checkbox', { name: 'Annotations' }))

    await selectView('Before listing')
    expect(screen.getByRole('heading', { name: 'Before your home goes live' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Review your tasks' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Listing performance' })).not.toBeInTheDocument()
    expect(screen.getByText('Not published')).toBeInTheDocument()
    expect(screen.getAllByText(/^We’re aiming to launch on September 1\./).length).toBeGreaterThan(0)
    expect(screen.queryByText(/^Closing is scheduled for November 6\./)).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Copy link' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Preview listing' })).not.toBeInTheDocument()
    expect(new URLSearchParams(window.location.search).get('view')).toBe('before-listing')
    expect(new URLSearchParams(window.location.search).get('header')).toBe('card')
    expect(new URLSearchParams(window.location.search).get('listingLink')).toBe('idx-mvp')

    if (screen.getByRole('button', { name: 'Feedback tools' }).getAttribute('aria-expanded') === 'false') fireEvent.click(screen.getByRole('button', { name: 'Feedback tools' }))
    expect(screen.getByRole('checkbox', { name: 'Annotations' })).toBeChecked()
    await selectView('Pending')
    expect(screen.getByRole('heading', { name: 'Listing performance' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'See Listing (opens in a new tab)' })).toBeInTheDocument()
    // The note shows in Notes (overview) and in the Notes tab.
    expect(screen.getAllByText(/^Closing is scheduled for November 6\./).length).toBeGreaterThan(0)
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

  it('shows market activity only while the home is listed', () => {
    const portal = <ThemeProvider theme={theme}><SellerPortal transaction={futureSellerTransaction} marketingSnapshot={futureMarketingSnapshot} marketActivity={sampleMarketActivity} basePath="/seller/future-v1" /></ThemeProvider>
    window.history.replaceState(null, '', '/seller/future-v1?view=listed')
    const { unmount } = render(portal)
    expect(screen.getByRole('heading', { name: 'Market activity' })).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
    unmount()
    window.history.replaceState(null, '', '/seller/future-v1?view=under-contract')
    render(portal)
    expect(screen.queryByRole('heading', { name: 'Market activity' })).not.toBeInTheDocument()
  })

  it('keeps market activity below listing performance when switching timeline stages', () => {
    window.history.replaceState(null, '', '/seller/timeline-exploration?view=listed')
    render(<ThemeProvider theme={theme}><SellerPortal transaction={futureSellerTransaction} marketingSnapshot={futureMarketingSnapshot} marketActivity={sampleMarketActivity} basePath="/seller/timeline-exploration" layout="timeline" /></ThemeProvider>)
    const stage = screen.getByRole('tab', { name: /Active listing/ })
    expect(stage).toHaveAttribute('aria-selected', 'true')
    const panel = () => document.getElementById(stage.getAttribute('aria-controls')!)!
    expect(panel()).not.toHaveTextContent('Market activity')
    const market = screen.getByRole('heading', { name: 'Market activity' }).closest('section')!
    const performance = screen.getByRole('heading', { name: 'Listing performance' }).closest('section')!
    expect(performance.nextElementSibling).toBe(market)
    fireEvent.click(screen.getByRole('tab', { name: /Pre-listing/ }))
    expect(panel()).not.toHaveTextContent('Market activity')
    expect(screen.getByRole('heading', { name: 'Market activity' })).toBeInTheDocument()
  })

  it('lays out the two-column timeline page with a narrow property column', () => {
    window.history.replaceState(null, '', '/seller/timeline-columns')
    render(<ThemeProvider theme={theme}><SellerPortal transaction={futureSellerTransaction} marketingSnapshot={futureMarketingSnapshot} basePath="/seller/timeline-columns" layout="timeline-columns" /></ThemeProvider>)
    expect(screen.getByRole('heading', { name: 'Good morning, Tim.' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Your home' })).toHaveTextContent('128 Meadowbrook Lane')
    expect(screen.getByText('31 days until closing')).toBeInTheDocument()
  })
})


function setViewerScreen(wide: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query === '(min-width: 1024px)' && wide,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
}

describe('Shared document viewer', () => {
  beforeEach(() => setViewerScreen(true))
  it('opens a transaction file in the full viewer and keeps card pins in sync', async () => {
    window.history.replaceState(null, '', '/seller/future-v1?section=documents')
    renderPortal()
    fireEvent.click(screen.getAllByRole('button', { name: /^Preview / })[0])
    const viewer = await screen.findByRole('dialog')
    expect(await within(viewer).findByTestId('pdf-pages')).toHaveAttribute('data-url', '/documents/doc-1.pdf')
    const controls = within(viewer).getByRole('group', { name: 'Document controls' })
    fireEvent.click(within(controls).getByRole('button', { name: 'Zoom in' }))
    expect(within(controls).getByRole('button', { name: 'Zoom 125 percent. Reset to fit width' })).toBeInTheDocument()
    fireEvent.click(within(controls).getByRole('button', { name: 'Zoom 125 percent. Reset to fit width' }))
    const pin = within(viewer).getByRole('button', { name: /^(Pin|Unpin) / })
    const wasPinned = pin.getAttribute('aria-pressed') === 'true'
    fireEvent.click(pin)
    expect(pin).toHaveAttribute('aria-pressed', String(!wasPinned))
    const cardLabel = pin.getAttribute('aria-label')!
    fireEvent.click(within(viewer).getByRole('button', { name: 'Close document' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(screen.getByRole('button', { name: cardLabel })).toHaveAttribute('aria-pressed', String(!wasPinned))
  })

  it.each([
    ['purchase contract', /^Open Purchase contract,/, '/documents/doc-5.pdf'],
    ['resource', /^Open After the buyer’s home inspection/, '/documents/res-inspection.pdf'],
  ])('uses the same viewer for a %s in the staged document list', async (_kind, label, url) => {
    window.history.replaceState(null, '', '/seller/timeline-columns?section=documents')
    render(<ThemeProvider theme={theme}><SellerPortal transaction={futureSellerTransaction} basePath="/seller/timeline-columns" layout="timeline-columns" /></ThemeProvider>)
    fireEvent.click(screen.getByRole('button', { name: label }))
    const viewer = await screen.findByRole('dialog')
    expect(await within(viewer).findByTestId('pdf-pages')).toHaveAttribute('data-url', url)
    expect(within(viewer).queryByText('Stage')).not.toBeInTheDocument()
    expect(within(viewer).getByRole('button', { name: 'Close document' })).toBeInTheDocument()
  })

  it('opens a timeline document directly in the viewer without a step dialog', async () => {
    window.history.replaceState(null, '', '/seller/timeline-columns')
    render(<ThemeProvider theme={theme}><SellerPortal transaction={futureSellerTransaction} basePath="/seller/timeline-columns" layout="timeline-columns" /></ThemeProvider>)
    fireEvent.click(screen.getByRole('button', { name: 'Review and sign Form 17. Document, next step' }))
    const pages = await screen.findByTestId('pdf-pages')
    expect(pages).toHaveAttribute('data-url', '/documents/doc-2.pdf')
    expect(screen.getByRole('heading', { name: 'Seller disclosure' })).toBeInTheDocument()
    expect(screen.queryByRole('dialog', { name: 'Review and sign Form 17' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Documents and resources' })).not.toBeInTheDocument()
  })

  it('lets team preview read documents without changing pins', async () => {
    window.history.replaceState(null, '', '/team/preview?section=documents')
    render(<ThemeProvider theme={theme}><SellerPortal transaction={futureSellerTransaction} basePath="/team/preview" readOnly showReviewTools={false} /></ThemeProvider>)
    fireEvent.click(screen.getAllByRole('button', { name: /^Preview / })[0])
    const viewer = await screen.findByRole('dialog')
    expect(await within(viewer).findByTestId('pdf-pages')).toBeInTheDocument()
    expect(within(viewer).queryByRole('button', { name: /^(Pin|Unpin) / })).not.toBeInTheDocument()
  })

  it('keeps actions in the bottom bar and reveals secondary information on demand', async () => {
    setViewerScreen(false)
    window.history.replaceState(null, '', '/seller/future-v1?section=documents')
    renderPortal()
    fireEvent.click(screen.getAllByRole('button', { name: /^Preview / })[0])
    const viewer = await screen.findByRole('dialog')
    const controls = within(viewer).getByRole('group', { name: 'Document controls' })
    const details = within(controls).getByRole('button', { name: 'Details' })
    expect(details).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    expect(within(controls).getByRole('button', { name: 'Download' })).toBeInTheDocument()
    expect(within(controls).getByRole('button', { name: /^(Pin|Unpin) / })).toBeInTheDocument()
    expect(within(controls).getByRole('button', { name: 'Zoom in' })).toBeInTheDocument()
    fireEvent.click(details)
    expect(details).toHaveAttribute('aria-expanded', 'true')
    const tooltip = await screen.findByRole('tooltip')
    expect(within(tooltip).getByText('Added by')).toBeInTheDocument()
    expect(within(tooltip).getByText('Uploaded')).toBeInTheDocument()
    expect(within(tooltip).queryByText('Stage')).not.toBeInTheDocument()
    fireEvent.keyDown(details, { key: 'Escape' })
    expect(details).toHaveAttribute('aria-expanded', 'false')
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument())
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('closes from the empty reader backdrop and returns focus to the document row', async () => {
    window.history.replaceState(null, '', '/seller/future-v1?section=documents')
    renderPortal()
    const row = screen.getAllByRole('button', { name: /^Preview / })[0]
    row.focus()
    fireEvent.click(row)
    const viewer = await screen.findByRole('dialog')
    await within(viewer).findByTestId('pdf-pages')
    fireEvent.click(within(viewer).getByLabelText('Exclusive listing agreement pages'))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(row).toHaveFocus()
  })

  it('uses the attached sample file when a scenario has a different document id', async () => {
    window.history.replaceState(null, '', '/seller/future-v1?section=documents&view=before-listing')
    renderPortal()
    fireEvent.click(screen.getByRole('button', { name: 'Preview Exclusive listing agreement' }))
    const viewer = await screen.findByRole('dialog')
    expect(await within(viewer).findByTestId('pdf-pages')).toHaveAttribute('data-url', '/documents/doc-1.pdf')
  })
})
