/**
 * Documents tab · every document the client can see, by stage, then type.
 * Stages follow the client's side of the deal and only show when they have documents.
 * Each row leads with the document's type; the uploaded file name is secondary text.
 * A document linked to a date shows that date. Clicking a row opens that one document.
 * Filter pills narrow the list to one stage: outlined when off, primary when selected.
 */
import { useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import EventOutlined from '@mui/icons-material/EventOutlined'
import { DocumentListRow } from '../DocumentListRow'
import { documentRowTag } from './taggedDocuments'
import { formatDay } from './timelineFirstData'
import { groupByStage, type ClientDocument, type ClientSide, type DocumentStage } from './documentLibrary'
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

export function StagedDocumentsPanel({ documents, side, currentStage, onOpen }: {
  documents: ClientDocument[]
  side: ClientSide
  currentStage?: DocumentStage
  onOpen: (document: ClientDocument) => void
}) {
  const stages = groupByStage(documents, side)
  const [filter, setFilter] = useState<DocumentStage | 'all'>('all')
  // If the picked stage has no documents (e.g. the data changes), fall back to all.
  const active = stages.some((stage) => stage.id === filter) ? filter : 'all'
  const shown = active === 'all' ? stages : stages.filter((stage) => stage.id === active)
  const pills: Array<{ id: DocumentStage | 'all'; label: string; count: number }> = [
    { id: 'all', label: 'All', count: documents.length },
    ...stages.map((stage) => ({ id: stage.id, label: stage.label, count: stage.documents.length })),
  ]

  if (!stages.length) {
    return <Typography variant="bodySStandard" color="text.secondary">No documents yet. Your team will add them here as your sale moves along.</Typography>
  }

  return (
    <Box className="tf-docs">
      <Box role="group" aria-label="Filter documents by stage" className="tf-docs-filters">
        {pills.map((pill) => {
          const selected = pill.id === active
          return (
            <Button
              key={pill.id}
              size="small"
              variant={selected ? 'contained' : 'outlined'}
              color="primary"
              aria-pressed={selected}
              onClick={() => setFilter(pill.id)}
              className="tf-docs-filter"
            >
              {pill.label}<Box component="span" className="tf-docs-filter-count">{pill.count}</Box>
            </Button>
          )
        })}
      </Box>
      {shown.map((stage) => (
        <Box component="section" key={stage.id} aria-labelledby={`tf-docs-${stage.id}`} className="tf-docs-stage">
          <Box className="tf-docs-stage-head">
            <Typography component="h3" variant="titleS" id={`tf-docs-${stage.id}`}>{stage.label}</Typography>
            {stage.id === currentStage && <Box component="span" className="tf-c2-stage-tag tf-c2-stage-tag--current">Current</Box>}
            <Typography variant="labelS" component="span" color="text.secondary" className="tf-docs-count">
              {stage.documents.length} {stage.documents.length === 1 ? 'document' : 'documents'}
            </Typography>
          </Box>
          <Box component="ul" className="tf-docs-list">
            {stage.documents.map((doc) => (
              <DocumentListRow
                key={doc.id}
                title={doc.name}
                meta={<LinkedDateMeta document={doc} />}
                tag={documentRowTag(doc.tag)}
                label={`Open ${doc.name}${doc.fileName ? `, ${doc.fileName}` : ''}${doc.linkedDate ? `, linked to ${doc.linkedDate.title}` : ''}`}
                onOpen={() => onOpen(doc)}
              />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  )
}
