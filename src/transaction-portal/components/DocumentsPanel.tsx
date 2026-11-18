/* design-build · self-critique: Clarity5 Warmth4 Restraint5 Craft4 Variety3 SlopFree5 */
import type { ReactNode } from 'react'
import { Box, Typography } from '@mui/material'
import { DocumentCard } from './DocumentCard'
import { PaginatedTabList } from './PaginatedTabList'
import type { TransactionDocument } from '../types'
import { useDocumentPins, type DocumentPins } from './useDocumentPins'

export function DocumentsPanel({ documents, storageKey, onOpen, readOnly = false, pins: sharedPins, renderRow, pinning = true }: {
  documents: TransactionDocument[]
  pins?: DocumentPins
  readOnly?: boolean
  storageKey: string
  onOpen: (document: TransactionDocument) => void
  /** Shows the unpinned documents as list rows (one per document) instead of preview cards. */
  renderRow?: (document: TransactionDocument) => ReactNode
  /** Pinning on by default. Off: no pinned group, and every document is listed in one group in its original order. */
  pinning?: boolean
}) {
  const localPins = useDocumentPins(storageKey)
  const { pinnedIds, togglePin } = sharedPins ?? localPins
  const pinned = pinning ? documents.filter(document => pinnedIds.includes(document.id)) : []
  const remaining = pinning ? documents.filter(document => !pinnedIds.includes(document.id)) : documents

  function cards(items: TransactionDocument[]) {
    return <Box component="ul" className="document-grid">{items.map(document => (
      <DocumentCard key={document.id} document={document} readOnly={readOnly} pinned={pinnedIds.includes(document.id)} onPin={togglePin} onPreview={onOpen} />
    ))}</Box>
  }

  function rows(items: TransactionDocument[]) {
    return <Box component="ul" className="document-row-list">{items.map(renderRow!)}</Box>
  }

  return (
    <Box component="section" aria-label="Transaction documents" className="portal-tab-content documents-panel">
      {pinned.length > 0 && <Box>
        <Typography component="h3" variant="titleXS" className="document-group-title">Pinned documents <Typography component="span" variant="labelS" color="text.secondary">{pinned.length}</Typography></Typography>
        {cards(pinned)}
      </Box>}
      {remaining.length > 0 && <Box>
        {/* A heading only earns its place when it separates the list from a pinned group. */}
        {pinned.length > 0 && <Typography component="h3" variant="titleXS" className="document-group-title">Other documents <Typography component="span" variant="labelS" color="text.secondary">{remaining.length}</Typography></Typography>}
        <PaginatedTabList items={remaining} itemName="documents" ariaLabel="Document pages">{renderRow ? rows : cards}</PaginatedTabList>
      </Box>}
    </Box>
  )
}
