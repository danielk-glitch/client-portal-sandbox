/**
 * Pinned documents · one shared list of pinned document ids for a portal page.
 * Pins persist in this browser (localStorage) when it's available, and fall back to this visit only.
 * Pinned documents float to the top of every document list on the page.
 */
import { useCallback, useState } from 'react'
import { toast } from 'sonner'

function readPins(storageKey: string, fallback: string[]) {
  try {
    const stored = window.localStorage.getItem(storageKey)
    if (!stored) return fallback
    const parsed: unknown = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : fallback
  } catch {
    return fallback
  }
}

export type DocumentPins = {
  pinnedIds: string[]
  isPinned: (id: string) => boolean
  togglePin: (document: { id: string; name: string }) => void
}

export function useDocumentPins(storageKey: string, initial: string[] = []): DocumentPins {
  const [pinnedIds, setPinnedIds] = useState<string[]>(() => readPins(storageKey, initial))

  const togglePin = useCallback((document: { id: string; name: string }) => {
    const wasPinned = pinnedIds.includes(document.id)
    // Newest pin goes first, so it lands at the very top.
    const next = wasPinned ? pinnedIds.filter((id) => id !== document.id) : [document.id, ...pinnedIds]
    setPinnedIds(next)
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(next))
    } catch {
      // Storage unavailable: pins last for this visit.
    }
    toast(wasPinned ? 'Unpinned' : 'Pinned to the top of your documents', { description: document.name })
  }, [pinnedIds, storageKey])

  const isPinned = useCallback((id: string) => pinnedIds.includes(id), [pinnedIds])
  return { pinnedIds, isPinned, togglePin }
}

/** Pinned first (most recently pinned on top), then everything else in its original order. */
export function pinnedFirst<T extends { id: string }>(documents: T[], pinnedIds: string[]) {
  const rank = (doc: T) => {
    const index = pinnedIds.indexOf(doc.id)
    return index === -1 ? Number.POSITIVE_INFINITY : index
  }
  return documents.map((doc, order) => ({ doc, order })).sort((a, b) => rank(a.doc) - rank(b.doc) || a.order - b.order).map(({ doc }) => doc)
}
