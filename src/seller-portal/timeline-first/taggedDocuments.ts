/**
 * V1 data pivot (C2): resources are just documents.
 * A document carries one optional, team-set tag:
 * - none: a regular document
 * - resource: reading material, like a guide or checklist
 * - review: a general-purpose "File" label for a document the team wants to call out. It doesn't say the client must act, since it may already be signed.
 * Guides from the old resource model are converted into documents tagged "resource".
 */
import type { TransactionDocument, TransactionResource } from '../../transaction-portal/types'
import type { DocumentRowTag } from '../DocumentListRow'
import type { SellerTimelineStep } from '../sellerTimelineData'
import { detailFor, type StepDetail } from './timelineFirstData'

export type DocumentTag = 'resource' | 'review'

export const documentTagCopy: Record<DocumentTag, string> = {
  review: 'File',
  resource: 'Resource',
}

export type TaggedDocument = TransactionDocument & { tag?: DocumentTag }

/** Team-set tags on the existing documents. Prototype data. */
const tagsByDocumentId: Record<string, DocumentTag> = {
  'doc-2': 'review',
}

export const resourceDocumentId = (resourceId: string) => `res-${resourceId}`

export function buildTaggedDocuments(documents: TransactionDocument[], resources: TransactionResource[]): TaggedDocument[] {
  const tagged = documents.map((doc) => ({ ...doc, tag: tagsByDocumentId[doc.id] }))
  const fromResources: TaggedDocument[] = resources.map((guide) => ({
    id: resourceDocumentId(guide.id),
    name: guide.title,
    category: documentTagCopy.resource,
    uploadedAt: '08/18/2026',
    postedBy: 'Avery Coleman',
    status: 'Ready to view',
    summary: guide.summary,
    tag: 'resource',
  }))
  return [...tagged, ...fromResources]
}

/** Step detail with its guides folded into its documents. */
export function detailWithDocuments(step: SellerTimelineStep): StepDetail {
  const detail = detailFor(step)
  return {
    ...detail,
    documentIds: [...(detail.documentIds ?? []), ...(detail.resourceIds ?? []).map(resourceDocumentId)],
    resourceIds: [],
  }
}

/** Tagged files first, then plain documents, then resources. */
export function byTag(a: TaggedDocument, b: TaggedDocument) {
  const rank = (doc: TaggedDocument) => (doc.tag === 'review' ? 0 : doc.tag === 'resource' ? 2 : 1)
  return rank(a) - rank(b)
}

/** A tag as the document row shows it: both "File" and "Resource" are quiet outlined pills. */
export function documentRowTag(tag?: DocumentTag): DocumentRowTag | undefined {
  if (!tag) return undefined
  return { label: documentTagCopy[tag], tone: 'quiet' }
}
