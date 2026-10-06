/* design-build · self-critique: Clarity5 Warmth4 Restraint5 Craft4 Variety4 SlopFree5 */
import { useRef, useState, type ReactNode } from 'react'
import { Box, Pagination, Typography } from '@mui/material'
import './paginated-tab-list.css'

const pageSize = 10

export function PaginatedTabList<T>({ items, itemName, ariaLabel, children }: {
  items: T[]
  itemName: string
  ariaLabel: string
  children: (visibleItems: T[]) => ReactNode
}) {
  const listRef = useRef<HTMLDivElement>(null)
  const [requestedPage, setRequestedPage] = useState(1)
  const pageCount = Math.ceil(items.length / pageSize)
  const page = Math.min(requestedPage, Math.max(pageCount, 1))
  const firstVisible = (page - 1) * pageSize
  const visibleItems = items.slice(firstVisible, firstVisible + pageSize)

  function selectPage(nextPage: number) {
    setRequestedPage(nextPage)
    requestAnimationFrame(() => listRef.current?.scrollIntoView({ block: 'start' }))
  }

  return (
    <>
      <Box ref={listRef} className="tab-list-content">{children(visibleItems)}</Box>
      {pageCount > 1 && (
        <Box className="tab-list-pagination">
          <Typography variant="bodySStandard" color="text.secondary" aria-live="polite">
            {firstVisible + 1}–{Math.min(firstVisible + pageSize, items.length)} of {items.length} {itemName}
          </Typography>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, nextPage) => selectPage(nextPage)}
            aria-label={ariaLabel}
          />
        </Box>
      )}
    </>
  )
}
