/* design-build · self-critique: Clarity5 Warmth4 Restraint5 Craft4 Variety3 SlopFree5 */
import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { toast } from 'sonner'
import { DocumentCard } from './DocumentCard'
import { PaginatedTabList } from './PaginatedTabList'
import type { TransactionDocument } from '../types'

export function DocumentsPanel({ documents, storageKey, onOpen, readOnly = false }: {
  documents: TransactionDocument[]
  readOnly?: boolean
  storageKey: string
  onOpen: (document: TransactionDocument) => void
}) {
  const [pinnedIds, setPinnedIds] = useState<string[]>(() => {
    try {
      const stored: unknown = JSON.parse(window.localStorage.getItem(storageKey) ?? '[]')
      return Array.isArray(stored) ? stored.filter((id): id is string => typeof id === 'string') : []
    } catch {
      return []
    }
  })
  const pinned = documents.filter(document => pinnedIds.includes(document.id))
  const remaining = documents.filter(document => !pinnedIds.includes(document.id))

  function togglePin(document: TransactionDocument) {
    if (readOnly) return
    const wasPinned = pinnedIds.includes(document.id)
    const next = wasPinned ? pinnedIds.filter(id => id !== document.id) : [...pinnedIds, document.id]
    setPinnedIds(next)
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(next))
    } catch {
      toast('Your pins will stay for this visit. Browser storage is unavailable.')
    }
    toast(wasPinned ? 'Document unpinned' : 'Document pinned to the top')
  }

  function cards(items: TransactionDocument[]) {
    return <Box component="ul" className="document-grid">{items.map(document => (
      <DocumentCard key={document.id} document={document} readOnly={readOnly} pinned={pinnedIds.includes(document.id)} onPin={togglePin} onPreview={onOpen} />
    ))}</Box>
  }

  return (
    <Box component="section" aria-label="Transaction documents" className="portal-tab-content documents-panel">
      {pinned.length > 0 && <Box>
        <Typography component="h3" variant="titleXS" className="document-group-title">Pinned documents <Typography component="span" variant="labelS" color="text.secondary">{pinned.length}</Typography></Typography>
        {cards(pinned)}
      </Box>}
      {remaining.length > 0 && <Box>
        <Typography component="h3" variant="titleXS" className="document-group-title">{pinned.length ? 'Other documents' : 'All documents'} <Typography component="span" variant="labelS" color="text.secondary">{remaining.length}</Typography></Typography>
        <PaginatedTabList items={remaining} itemName="documents" ariaLabel="Document pages">{cards}</PaginatedTabList>
      </Box>}
    </Box>
  )
}
