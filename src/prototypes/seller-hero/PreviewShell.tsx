/**
 * Timeline-first seller portal · three layout directions on one shell.
 * A · Tracker + rail: the current timeline component leads, with a progress band, an activity rail, and a detail drawer.
 * B · Agenda: one continuous vertical journey with inline detail, flanked by a progress rail and an updates rail.
 * C · Calendar: a dark hero with a to-scale calendar track, a featured next step, and a filmstrip of upcoming dates.
 * C2 · Stage focus: C reworked. Dark stage tracker drives a scoped "this stage" zone; a separate "whole sale" zone below.
 * The shell owns shared state: which item is open, documents, guides, the listing sheet, and the "all updates" drawer.
 */
import { useState, type ReactNode } from 'react'
import { Box } from '@mui/material'
import { ActivityPanel, DocumentViewer, DocumentsPanel, PortalFooter, PortalTopbar, ResourceGuideSheet, useDocumentPins, type DocumentPins } from '../../transaction-portal/components'
import type { TransactionDocument, TransactionResource } from '../../transaction-portal/types'
import { ListingDetailsSheet } from '../../seller-portal/ListingDetailsSheet'
import { pendingTimeline, pendingTransaction, unseenUpdateCount } from '../../seller-portal/timeline-first/timelineFirstData'
import { SideDrawer, StepDetailDrawer, type OpenItem } from '../../seller-portal/timeline-first/TimelineFirstParts'
import '../../seller-portal/seller-portal.css'
import '../../seller-portal/timeline-first/timeline-first.css'

import { PreviewDirection } from './PreviewDirection'
import { clientDocumentFacts } from '../../seller-portal/timeline-first/documentViewerFacts'

/** Everything a direction needs from the shell. */
export type DirectionContext = {
  transaction: typeof pendingTransaction
  timeline: typeof pendingTimeline
  unseen: number
  openItem: (item: OpenItem) => void
  openDocument: (document: TransactionDocument) => void
  openResource: (resource: TransactionResource) => void
  openListing: () => void
  openActivity: () => void
  openDocuments: () => void
  documentsPanel: ReactNode
  pins: DocumentPins
}

export function PreviewShell({ variant }: { variant: number }) {
  const transaction = pendingTransaction
  const [item, setItem] = useState<OpenItem | null>(null)
  const [shownItem, setShownItem] = useState<OpenItem | null>(null)
  const [document, setDocument] = useState<TransactionDocument | null>(null)
  const [resource, setResource] = useState<TransactionResource | null>(null)
  const [listingOpen, setListingOpen] = useState(false)
  const [activityOpen, setActivityOpen] = useState(() => new URLSearchParams(window.location.search).get('panel') === 'activity')
  const [documentsOpen, setDocumentsOpen] = useState(false)
  const pins = useDocumentPins('place-document-pins:hero-preview')
  const leadAgent = transaction.team.find((member) => member.id === transaction.teamBrand.leadAgentId)

  function openItem(next: OpenItem) {
    setShownItem(next)
    setItem(next)
  }

  const documentsPanel = (
    <DocumentsPanel
      pins={pins}
      storageKey={`place-document-pins:timeline-first:${transaction.listing.mlsNumber}`}
      documents={transaction.documents}
      onOpen={setDocument}
    />
  )

  const context: DirectionContext = {
    transaction,
    timeline: pendingTimeline,
    unseen: unseenUpdateCount,
    // Direction C uses its own modal; A and B route items here.
    openItem,
    openDocument: setDocument,
    openResource: setResource,
    openListing: () => setListingOpen(true),
    openActivity: () => setActivityOpen(true),
    openDocuments: () => setDocumentsOpen(true),
    documentsPanel,
    pins,
  }

  const handlers = {
    team: transaction.team,
    documents: transaction.documents,
    resources: transaction.resources ?? [],
    onOpenDocument: setDocument,
    onOpenResource: setResource,
  }

  return (
    <Box className="seller-portal tf-portal tf-portal--c2 hero-preview">
      <PortalTopbar viewer={transaction.viewers[0]} />

      <PreviewDirection {...context} variant={variant} />

      <PortalFooter agent={leadAgent} brand={transaction.teamBrand} />

      <StepDetailDrawer item={item} shown={shownItem} onClose={() => setItem(null)} leadAgent={leadAgent} {...handlers} />

      <SideDrawer open={activityOpen} onClose={() => setActivityOpen(false)} eyebrow="Recent activity" title="All updates" className="tf-drawer--wide">
        <ActivityPanel events={transaction.timeline} />
      </SideDrawer>

      <SideDrawer open={documentsOpen} onClose={() => setDocumentsOpen(false)} eyebrow="Your files" title="Documents" className="tf-drawer--wide">
        {documentsPanel}
      </SideDrawer>

      <ListingDetailsSheet open={listingOpen} onClose={() => setListingOpen(false)} transaction={transaction} />
      <ResourceGuideSheet resource={resource} resources={transaction.resources ?? []} onSelectResource={setResource} onClose={() => setResource(null)} />
      <DocumentViewer document={document} onClose={() => setDocument(null)} pinned={document ? pins.isPinned(document.id) : false} onTogglePin={pins.togglePin} extraFacts={clientDocumentFacts} />
    </Box>
  )
}
