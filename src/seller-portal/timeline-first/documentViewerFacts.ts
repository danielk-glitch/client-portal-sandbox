import type { ViewerDocument } from '../../transaction-portal/components/DocumentViewer'
import { documentStages, type ClientDocument, type ClientSide } from './documentLibrary'
import { formatDay } from './timelineFirstData'

/** Stage and linked date, for documents from the structured library. Stage names follow the client's side of the deal. */
export function clientDocumentFacts(document: ViewerDocument, side: ClientSide = 'seller') {
  if (!('stage' in document)) return []
  const doc = document as ClientDocument
  const stage = documentStages[side].find((item) => item.id === doc.stage)?.label
  return [
    ...(stage ? [{ label: 'Stage', value: stage }] : []),
    ...(doc.linkedDate ? [{ label: 'Linked date', value: `${doc.linkedDate.date ? `${formatDay(doc.linkedDate.date)} · ` : ''}${doc.linkedDate.title}` }] : []),
  ]
}

