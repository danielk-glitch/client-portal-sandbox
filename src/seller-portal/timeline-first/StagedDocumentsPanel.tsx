/**
 * Documents tab · every document the client can see, by stage, then type.
 * Stages follow the client's side of the deal and only show when they have documents.
 * Each row leads with the document's type; the uploaded file name is secondary text.
 * A document linked to a date shows that date. Clicking a row opens that one document.
 * Filter pills narrow the list to one stage: outlined when off, primary when selected. No counts: the list itself shows how much is there.
 * Pinned documents lead: under All they get their own Pinned group on top (and leave their stage group);
 * under a stage filter, that stage's pinned documents float to the top.
 */
import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { FilterPills } from '../../components/FilterPills'
import { SectionLabel } from '../../components/SectionLabel'
import EventOutlined from '@mui/icons-material/EventOutlined'
import { DocumentListRow } from '../DocumentListRow'
import { documentRowTag } from './taggedDocuments'
import { formatDay } from './timelineFirstData'
import { groupByStage, type ClientDocument, type ClientSide, type DocumentStage } from './documentLibrary'
import { pinnedFirst } from '../../transaction-portal/components/useDocumentPins'
import './staged-documents.css'

export function LinkedDateMeta({ document }: { document: ClientDocument }) {
  const linked = document.linkedDate
  if (!document.fileName && !linked) return null
  return (
    <Box component="span" className="tf-docs-meta">
      {document.fileName && <Box component="span" className="tf-docs-file">{document.fileName}</Box>}
      {linked && (
        <Box component="span" className="tf-docs-date">
          <EventOutlined aria-hidden="true" />
          {linked.date ? `${formatDay(linked.date)} · ` : ''}{linked.title}
        </Box>
      )}
    </Box>
  )
}

/** One document row, shared by the Documents tab and the pinned block in the details zone. */
export function ClientDocumentRow({ document, pinned = false, onOpen }: { document: ClientDocument; pinned?: boolean; onOpen: (document: ClientDocument) => void }) {
  return (
    <DocumentListRow
      title={document.name}
      meta={<LinkedDateMeta document={document} />}
      tag={documentRowTag(document.tag)}
      pinned={pinned}
      label={`Open ${document.name}${document.fileName ? `, ${document.fileName}` : ''}${document.linkedDate ? `, linked to ${document.linkedDate.title}` : ''}${pinned ? ', pinned' : ''}`}
      onOpen={() => onOpen(document)}
    />
  )
}

export function StagedDocumentsPanel({ documents, side, onOpen, pinnedIds = [] }: {
  documents: ClientDocument[]
  side: ClientSide
  onOpen: (document: ClientDocument) => void
  pinnedIds?: string[]
}) {
  const stages = groupByStage(documents, side)
  const pinned = pinnedFirst(documents.filter((doc) => pinnedIds.includes(doc.id)), pinnedIds)
  const [filter, setFilter] = useState<DocumentStage | 'all'>('all')
  // If the picked stage has no documents (e.g. the data changes), fall back to all.
  const active = stages.some((stage) => stage.id === filter) ? filter : 'all'
  const shown = (active === 'all' ? stages : stages.filter((stage) => stage.id === active))
    .map((stage) => ({
      ...stage,
      // Under All, pinned documents live in the Pinned group instead. Under a stage, they float to its top.
      documents: active === 'all' ? stage.documents.filter((doc) => !pinnedIds.includes(doc.id)) : pinnedFirst(stage.documents, pinnedIds),
    }))
    .filter((stage) => stage.documents.length > 0)
  const pills: Array<{ id: DocumentStage | 'all'; label: string }> = [
    { id: 'all', label: 'All' },
    ...stages.map((stage) => ({ id: stage.id, label: stage.label })),
  ]
  const row = (doc: ClientDocument) => <ClientDocumentRow key={doc.id} document={doc} pinned={pinnedIds.includes(doc.id)} onOpen={onOpen} />

  if (!stages.length) {
    return <Typography variant="bodySStandard" color="text.secondary">No documents yet. Your team will add them here as your sale moves along.</Typography>
  }

  return (
    <Box className="tf-docs">
      <FilterPills label="Filter documents by stage" value={active} onChange={setFilter} options={pills.map((pill) => ({ value: pill.id, label: pill.label }))} className="tf-docs-filters" />
      {active === 'all' && pinned.length > 0 && (
        <Box component="section" aria-labelledby="tf-docs-pinned" className="tf-docs-stage tf-docs-stage--pinned">
          <SectionLabel id="tf-docs-pinned">Pinned</SectionLabel>
          <Box component="ul" className="tf-docs-list">{pinned.map(row)}</Box>
        </Box>
      )}
      {shown.map((stage) => (
        <Box component="section" key={stage.id} aria-labelledby={`tf-docs-${stage.id}`} className="tf-docs-stage">
          <SectionLabel id={`tf-docs-${stage.id}`}>{stage.label}</SectionLabel>
          <Box component="ul" className="tf-docs-list">{stage.documents.map(row)}</Box>
        </Box>
      ))}
    </Box>
  )
}
