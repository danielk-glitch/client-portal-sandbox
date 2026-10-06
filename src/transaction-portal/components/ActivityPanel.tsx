/* design-build · self-critique: Clarity5 Warmth4 Restraint5 Craft4 Variety4 SlopFree5 */
import { Box } from '@mui/material'
import type { TimelineEvent } from '../types'
import { ActivityEventRow } from './ActivityEventRow'
import { PaginatedTabList } from './PaginatedTabList'

export function ActivityPanel({ events }: { events: TimelineEvent[] }) {
  return (
    <Box component="section" aria-label="Activity history" className="portal-tab-content">
      <PaginatedTabList items={events} itemName="updates" ariaLabel="Activity pages">
        {(visibleEvents) => (
          <Box component="ol" className="activity-event-list">
            {visibleEvents.map((event) => <ActivityEventRow key={event.id} event={event} />)}
          </Box>
        )}
      </PaginatedTabList>
    </Box>
  )
}
