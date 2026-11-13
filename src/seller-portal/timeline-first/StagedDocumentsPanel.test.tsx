import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { StagedDocumentsPanel } from './StagedDocumentsPanel'
import { buildClientDocuments, sellerDocumentRecords } from './documentLibrary'
import { pendingTimeline } from './timelineFirstData'

const documents = buildClientDocuments(sellerDocumentRecords, [], pendingTimeline)

describe('StagedDocumentsPanel pins', () => {
  it('leads with a Pinned group and keeps pinned documents out of their stage group', () => {
    render(<StagedDocumentsPanel documents={documents} side="seller" onOpen={() => {}} pinnedIds={['sd-survey']} />)
    const pinned = screen.getByRole('region', { name: 'Pinned' })
    expect(within(pinned).getByRole('button', { name: /Open Survey/ })).toBeInTheDocument()
    const preListing = screen.getByRole('region', { name: 'Pre-listing' })
    expect(within(preListing).queryByRole('button', { name: /Open Survey/ })).not.toBeInTheDocument()
  })

  it('shows no Pinned group when nothing is pinned', () => {
    render(<StagedDocumentsPanel documents={documents} side="seller" onOpen={() => {}} />)
    expect(screen.queryByRole('region', { name: 'Pinned' })).not.toBeInTheDocument()
  })
})
