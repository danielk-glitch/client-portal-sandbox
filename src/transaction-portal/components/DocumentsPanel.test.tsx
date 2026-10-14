import { fireEvent, render, screen, within } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { theme } from '../../theme'
import { sampleSellerTransaction } from '../../seller-portal/sellerTransaction'
import { DocumentsPanel } from './DocumentsPanel'

const documents = sampleSellerTransaction.documents
const storageKey = 'document-pins:test'
function panel(key = storageKey, items = documents, onOpen = vi.fn()) {
  return <ThemeProvider theme={theme}><DocumentsPanel documents={items} storageKey={key} onOpen={onOpen} /></ThemeProvider>
}
beforeEach(() => {
  const values = new Map<string, string>()
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  })
  vi.stubGlobal('requestAnimationFrame', vi.fn())
})
afterEach(() => vi.unstubAllGlobals())

describe('Document cards', () => {
  it('keeps document reading available in preview without changing client pins', () => {
    const onOpen = vi.fn()
    window.localStorage.setItem(storageKey, JSON.stringify([documents[0].id]))
    const stored = window.localStorage.getItem(storageKey)
    render(<ThemeProvider theme={theme}><DocumentsPanel documents={documents} storageKey={storageKey} onOpen={onOpen} readOnly /></ThemeProvider>)
    const pin = screen.getByRole('button', { name: `Unpin ${documents[0].name}` })
    expect(pin).toBeDisabled()
    fireEvent.click(pin)
    expect(window.localStorage.getItem(storageKey)).toBe(stored)
    fireEvent.click(screen.getByRole('button', { name: `Preview ${documents[0].name}` }))
    expect(onOpen).toHaveBeenCalledWith(documents[0])
  })

  it('pins without opening, keeps pinned cards first, remembers pins, and restores the original order on unpin', () => {
    const onOpen = vi.fn()
    const view = render(panel(storageKey, documents, onOpen))
    fireEvent.click(screen.getByRole('button', { name: `Pin ${documents[2].name}` }))
    expect(onOpen).not.toHaveBeenCalled()
    expect(within(screen.getAllByRole('list')[0]).getByRole('button', { name: `Preview ${documents[2].name}` })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: `Unpin ${documents[2].name}` })).toHaveAttribute('aria-pressed', 'true')
    view.unmount()
    render(panel(storageKey, documents, onOpen))
    expect(screen.getByRole('button', { name: `Unpin ${documents[2].name}` })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: `Unpin ${documents[2].name}` }))
    expect(screen.queryByRole('heading', { name: /Pinned documents/ })).not.toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /^Preview / }).map(button => button.getAttribute('aria-label'))).toEqual(documents.map(document => `Preview ${document.name}`))
    fireEvent.click(screen.getByRole('button', { name: `Preview ${documents[0].name}` }))
    expect(onOpen).toHaveBeenCalledWith(documents[0])
  })

  it('keeps pinned documents visible when browsing later pages without duplicating them', () => {
    const many = Array.from({ length: 22 }, (_, i) => ({ ...documents[0], id: `doc-${i}`, name: `Document ${i}` }))
    window.localStorage.setItem(storageKey, JSON.stringify(['doc-21']))
    render(panel(storageKey, many))
    fireEvent.click(screen.getByRole('button', { name: 'Go to page 2' }))
    expect(screen.getAllByRole('button', { name: 'Preview Document 21' })).toHaveLength(1)
    expect(screen.getByRole('button', { name: 'Preview Document 10' })).toBeInTheDocument()
  })

  it('does not share pin preferences across viewers or transactions and tolerates invalid storage', () => {
    window.localStorage.setItem('another-viewer', JSON.stringify([documents[0].id]))
    window.localStorage.setItem(storageKey, '{broken')
    render(panel())
    expect(screen.queryByRole('heading', { name: /Pinned documents/ })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: `Pin ${documents[0].name}` })).toBeInTheDocument()
  })
})
